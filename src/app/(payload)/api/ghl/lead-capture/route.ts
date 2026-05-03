import { NextResponse } from 'next/server'
import { upsertContact } from '@/lib/ghl/contacts'

const COUNTRY_PREFIX: Record<string, string> = {
  US: '+1',
  CA: '+1',
  MX: '+52',
  UK: '+44',
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { firstName, email, phone, countryCode } = body as {
      firstName: string
      email: string
      phone: string
      countryCode: string
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

    await upsertContact({
      firstName,
      email,
      phone: e164,
      locationId,
      tags: ['website-lead'],
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[lead-capture]', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
