import { NextResponse } from 'next/server'
import { upsertContact } from '@/lib/ghl/contacts'
import { GHL_FIELDS } from '@/lib/ghl/custom-fields'

const COUNTRY_PREFIX: Record<string, string> = {
  US: '+1',
  CA: '+1',
  MX: '+52',
  UK: '+44',
}

// Resolve the public-facing site URL for resume links.
// Production should set NEXT_PUBLIC_SITE_URL=https://topcleaningteam.com
// Falls back to NEXT_PUBLIC_SERVER_URL (used in dev), then to a sensible default.
function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_SERVER_URL ??
    'https://topcleaningteam.com'
  ).replace(/\/$/, '')
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { firstName, email, phone, countryCode, draftToken } = body as {
      firstName: string
      email: string
      phone: string
      countryCode: string
      draftToken?: string
    }

    if (!email || !phone) {
      return NextResponse.json({ error: 'email and phone required' }, { status: 400 })
    }

    const locationId = process.env.GHL_LOCATION_ID
    if (!locationId) {
      return NextResponse.json({ error: 'GHL not configured' }, { status: 500 })
    }

    const prefix = COUNTRY_PREFIX[countryCode] ?? '+1'
    const digits = phone.replace(/\D/g, '')
    const e164 = `${prefix}${digits}`

    // Build the resume URL only if a draftToken was provided and the GHL field
    // is configured. Missing either is non-fatal — the contact still gets upserted.
    const customFields: Array<{ id: string; field_value: string | number }> = []
    if (draftToken && GHL_FIELDS.cartResumeUrl) {
      const resumeUrl = `${siteUrl()}/booking?resume=${encodeURIComponent(draftToken)}`
      customFields.push({ id: GHL_FIELDS.cartResumeUrl, field_value: resumeUrl })
    }

    await upsertContact({
      firstName,
      email,
      phone: e164,
      locationId,
      tags: ['website-lead'],
      ...(customFields.length > 0 && { customFields }),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[lead-capture]', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
