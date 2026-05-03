import { NextRequest, NextResponse } from 'next/server'
import { getFreeSlots } from '@/lib/ghl/calendars'
import { GhlApiError } from '@/lib/ghl/errors'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const startDate = searchParams.get('date')
  const endDate = searchParams.get('endDate') ?? startDate

  if (!startDate) {
    return NextResponse.json({ error: 'date param required (YYYY-MM-DD)' }, { status: 400 })
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    return NextResponse.json({ error: 'Invalid date format — use YYYY-MM-DD' }, { status: 400 })
  }

  const calendarId = process.env.GHL_CALENDAR_ID
  const timezone = process.env.GHL_CALENDAR_TIMEZONE ?? 'America/New_York'

  if (!calendarId) {
    // GHL not yet configured — return empty (Phase 1b not done yet)
    return NextResponse.json({ slots: [], timezone }, { status: 200 })
  }

  try {
    const slots = await getFreeSlots({
      calendarId,
      startDate,
      endDate: endDate!,
      timezone,
    })

    const response = NextResponse.json({ slots, timezone }, { status: 200 })
    // Cache 60s, stale-while-revalidate 30s
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
    return response
  } catch (err) {
    if (err instanceof GhlApiError) {
      console.error('[availability] GHL error', { status: err.status, body: err.body })
      return NextResponse.json({ error: 'Calendar unavailable — try again', slots: [] }, { status: 503 })
    }
    console.error('[availability] Unexpected error', err)
    return NextResponse.json({ error: 'Internal error', slots: [] }, { status: 500 })
  }
}
