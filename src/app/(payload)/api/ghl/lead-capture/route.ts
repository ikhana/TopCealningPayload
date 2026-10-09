// POST /api/ghl/lead-capture
//
// Called when a visitor completes step 1 of the booking wizard (name, email, phone,
// consent). It is what puts them in GoHighLevel with the `website-lead` tag that starts
// the abandoned-booking sequence.
//
// STORE FIRST, THEN SYNC (ported from BrandBloomPayload's /api/leads)
//
// This route used to write straight to GoHighLevel and keep nothing. A submission the bot
// screen flagged was answered "ok" and dropped, and a GoHighLevel outage lost the lead.
// Now the enquiry is stored in the `enquiries` collection before anything else happens:
//
//   - flagged as automated  -> stored as QUARANTINED, never sent, visible in the admin
//   - GoHighLevel failing   -> stored as FAILED with the reason, retryable from the admin
//   - otherwise             -> stored, then synced
//
// The caller is told `ok` in every case where the lead was stored, because it WAS. A bot
// that is thanked learns nothing; a real person is never shown an error for a lead that is
// safe on our side.

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@payload-config'
import { CONSENT_VERSION, clientIp } from '@/lib/consent'
import { screenSubmission } from '@/lib/leads/spam'
import { syncEnquiry } from '@/lib/leads/sync'

export const dynamic = 'force-dynamic'

const COUNTRY_PREFIX: Record<string, string> = {
  US: '+1',
  CA: '+1',
  MX: '+52',
  UK: '+44',
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { firstName, email, phone, countryCode, draftToken, smsConsent } = body as {
      firstName: string
      email: string
      phone: string
      countryCode: string
      draftToken?: string
      smsConsent?: { service?: boolean; marketing?: boolean }
    }

    if (!email || !phone) {
      return NextResponse.json({ error: 'email and phone required' }, { status: 400 })
    }

    // This request comes from the wizard's own script, not from a <form>, so there is no
    // honeypot or fill timer to read; the bot-detection challenge is the screen here.
    const spam = await screenSubmission({ label: 'lead-capture', who: email || phone })

    const prefix = COUNTRY_PREFIX[countryCode] ?? '+1'
    const e164 = `${prefix}${phone.replace(/\D/g, '')}`
    const cleanEmail = email.trim().toLowerCase()

    const payload = await getPayload({ config })

    // The wizard can call this more than once for the same draft (going back and
    // continuing). One row per draft, updated in place, rather than a row per click.
    type ExistingRow = { id: number | string; syncStatus?: string | null }
    let existing = null as ExistingRow | null
    if (draftToken) {
      const found = await payload.find({
        collection: 'enquiries',
        where: { and: [{ source: { equals: 'booking-start' } }, { draftToken: { equals: draftToken } }] },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      existing = (found.docs[0] as unknown as ExistingRow | undefined) ?? null
    }

    // A lead already in GoHighLevel is never downgraded to quarantined by a later call.
    if (existing?.syncStatus === 'synced' && spam.length) {
      console.warn(`[lead-capture] ignoring a flagged repeat for an already-synced draft (${cleanEmail}): ${spam.join('; ')}`)
      return NextResponse.json({ ok: true })
    }

    const data = {
      source: 'booking-start' as const,
      draftToken: draftToken ?? null,
      firstName: firstName?.trim() || null,
      email: cleanEmail,
      phone: e164,
      details: { countryCode: countryCode ?? null },
      // Explicit yes/no, never omitted: a declined consent is a recorded decision. The
      // timestamp, IP and wording version are taken here, on the server. A client-supplied
      // time or address is not evidence of anything.
      consent: {
        service: smsConsent?.service ? ('yes' as const) : ('no' as const),
        marketing: smsConsent?.marketing ? ('yes' as const) : ('no' as const),
        version: CONSENT_VERSION,
        capturedAt: new Date().toISOString(),
        ip: clientIp(req) ?? null,
        userAgent: req.headers.get('user-agent')?.slice(0, 500) ?? null,
      },
      syncStatus: spam.length ? ('quarantined' as const) : ('pending' as const),
      spamReasons: spam.length ? spam.join('; ') : null,
    }

    const row = existing
      ? await payload.update({ collection: 'enquiries', id: existing.id, data, overrideAccess: true, depth: 0, context: { skipSync: true } })
      : await payload.create({ collection: 'enquiries', data, overrideAccess: true, depth: 0 })

    if (spam.length) {
      payload.logger.info(`[lead-capture] quarantined ${cleanEmail}: ${spam.join('; ')}`)
      return NextResponse.json({ ok: true })
    }

    // Awaited, as the route always did: the sync records its own failures on the row and
    // never throws, so this cannot turn a stored lead into an error response.
    await syncEnquiry(payload, row.id)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[lead-capture]', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
