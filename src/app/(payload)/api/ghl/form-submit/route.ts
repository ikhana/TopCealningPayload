// POST /api/ghl/form-submit
//
// The destination for the two non-wizard forms that collect a phone number: the contact
// form and the Join Our Team application. Accepts multipart/form-data for both (the
// contact form has no file, but one content type keeps a single code path).
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
// The caller is told `ok` whenever the lead was stored, because it WAS. A bot that is
// thanked learns nothing, and a real applicant is never shown an error (and told to retype
// three steps) for a lead that is safe on our side.
//
// ONE LIMIT, stated plainly: an application's RESUME FILE is uploaded to GoHighLevel
// during the live request and is not kept on the row. An application that is quarantined
// and released later therefore has no resume attached; the row records the filename so the
// applicant can be asked to send it again.

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@payload-config'
import { CONSENT_VERSION, clientIp } from '@/lib/consent'
import { HONEYPOT_NAME, screenSubmission } from '@/lib/leads/spam'
import { syncEnquiry } from '@/lib/leads/sync'

export const dynamic = 'force-dynamic'

/** US-only normalisation. Neither form offers a country selector. */
function toE164(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed.startsWith('+')) return '+' + trimmed.slice(1).replace(/\D/g, '')
  const digits = trimmed.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return `+1${digits}`
}

function str(form: FormData, key: string): string {
  const v = form.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

/** Everything on the form that is not plumbing, kept as submitted. */
const PLUMBING = new Set([
  'audience',
  'draftToken',
  'name',
  'first_name',
  'last_name',
  'email',
  'phone',
  'resume',
  'fillMs',
  HONEYPOT_NAME,
])

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()

    const audience = str(form, 'audience')
    if (audience !== 'contact' && audience !== 'careers' && audience !== 'quote') {
      return NextResponse.json({ error: 'unknown audience' }, { status: 400 })
    }

    const email = str(form, 'email').toLowerCase()
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

    const screenInput = {
      label: 'form-submit',
      who: email || str(form, 'phone'),
      honeypot: form.get(HONEYPOT_NAME),
      fillMs: form.get('fillMs') ?? undefined,
    }
    const spam = await screenSubmission(screenInput)

    // The contact form has one "Full Name"; the application has two fields.
    const whole = str(form, 'name')
    const firstName = str(form, 'first_name') || whole.split(/\s+/)[0] || ''
    const lastName = str(form, 'last_name') || whole.split(/\s+/).slice(1).join(' ')
    const phone = toE164(str(form, 'phone'))
    // Quote requests only: which wizard draft this came from, so the draft can be marked done.
    const draftToken = audience === 'quote' ? str(form, 'draftToken') : ''

    const details: Record<string, string> = {}
    for (const [key, value] of form.entries()) {
      if (PLUMBING.has(key) || key.startsWith('sms_')) continue
      if (typeof value !== 'string') continue
      const v = value.trim()
      if (v) details[key] = v
    }

    const resume = form.get('resume')
    const resumeFile = audience === 'careers' && resume instanceof File && resume.size > 0 ? resume : undefined

    // Written as explicit yes/no rather than omitted when false, so a decline is a recorded
    // decision. The careers form offers no marketing box, so there is no marketing decision
    // to record: "not offered" says that, where "no" would assert a choice nobody was given.
    // Timestamp, IP and wording version are taken here on the server.
    const yn = (key: string) => (str(form, key) === 'yes' ? ('yes' as const) : ('no' as const))

    const payload = await getPayload({ config })
    const row = await payload.create({
      collection: 'enquiries',
      overrideAccess: true,
      depth: 0,
      data: {
        source: audience,
        firstName: firstName || null,
        lastName: lastName || null,
        email,
        phone: phone || null,
        ...(draftToken ? { draftToken } : {}),
        details,
        resumeNote: resumeFile ? `Attached: ${resumeFile.name} (${resumeFile.size} bytes)` : null,
        consent: {
          service: yn('sms_service_consent'),
          marketing: audience === 'careers' ? ('not-offered' as const) : yn('sms_marketing_consent'),
          version: CONSENT_VERSION,
          capturedAt: new Date().toISOString(),
          ip: clientIp(request) ?? null,
          userAgent: request.headers.get('user-agent')?.slice(0, 500) ?? null,
        },
        syncStatus: spam.length ? 'quarantined' : 'pending',
        spamReasons: spam.length ? spam.join('; ') : null,
      },
    })

    if (spam.length) {
      payload.logger.info(`[form-submit] quarantined ${audience} from ${email}: ${spam.join('; ')}`)
      return NextResponse.json({ ok: true, resumeUploaded: false })
    }

    // Photos a customer attached to a quote request. Checked here, not trusted from the
    // client: images only, at most 6, at most 10 MB each. The same limits as the photos on a
    // booking. Anything outside them is dropped quietly rather than failing a request that is
    // otherwise fine.
    const media =
      audience === 'quote'
        ? form
            .getAll('files')
            .filter((v): v is File => v instanceof File && v.size > 0 && v.size <= 10 * 1024 * 1024 && v.type.startsWith('image/'))
            .slice(0, 6)
        : []

    const { resumeUploaded } = await syncEnquiry(payload, row.id, { resume: resumeFile, media })

    // A finished quote request ends the wizard draft, so the abandoned-booking recovery
    // emails (which link back into the draft) stop treating it as abandoned. Not fatal: the
    // request is already stored, and a failure here only means the recovery link still works.
    if (draftToken) {
      try {
        const found = await payload.find({
          collection: 'booking-drafts',
          where: { token: { equals: draftToken } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })
        if (found.docs[0]) {
          await payload.update({
            collection: 'booking-drafts',
            id: found.docs[0].id,
            data: { convertedToBookingId: `quote-${row.id}` },
            overrideAccess: true,
          })
        }
      } catch (err) {
        payload.logger.error(
          `[form-submit] could not mark draft converted for quote ${row.id}: ${err instanceof Error ? err.message : String(err)}`,
        )
      }
    }

    return NextResponse.json({ ok: true, resumeUploaded })
  } catch (err) {
    console.error('[form-submit]', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
