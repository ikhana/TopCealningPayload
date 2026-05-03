import { NextResponse } from 'next/server'

export async function GET() {
  const token = process.env.GHL_PRIVATE_TOKEN
  const locationId = process.env.GHL_LOCATION_ID
  const base = process.env.GHL_API_BASE ?? 'https://services.leadconnectorhq.com'

  if (!token || !locationId) {
    return NextResponse.json({ error: 'GHL env vars not set' }, { status: 500 })
  }

  const res = await fetch(`${base}/locations/${locationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Version: '2021-07-28',
    },
  })

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ error: `GHL returned ${res.status}`, detail: text }, { status: res.status })
  }

  const data = await res.json()
  const loc = data.location

  return NextResponse.json({
    ok: true,
    name: loc.name,
    locationId: loc.id,
    timezone: loc.timezone,
    email: loc.email,
  })
}
