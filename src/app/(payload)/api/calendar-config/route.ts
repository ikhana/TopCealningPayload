// GET /api/calendar-config
// Returns booking constraints pulled live from the GHL calendar, so the
// wizard's Schedule step can hide unbookable dates without us hardcoding
// the value. Cached aggressively — calendar settings rarely change.

import { NextRequest, NextResponse } from 'next/server'
import { getCalendarConfig } from '@/lib/ghl/calendars'
import { GhlApiError } from '@/lib/ghl/errors'

export const dynamic = 'force-dynamic'
// Revalidate every hour — calendar config almost never changes day to day,
// and when it does, a 1h stale window is fine.
export const revalidate = 3600

export async function GET(request: NextRequest) {
  const calendarId = process.env.GHL_CALENDAR_ID
  if (!calendarId) {
    return NextResponse.json(
      { error: 'GHL_CALENDAR_ID not configured', minScheduleNoticeMs: 0, minScheduleNoticeDays: 0 },
      { status: 500 },
    )
  }

  // Include the raw GHL config when explicitly requested via ?debug=1
  // Used for inspecting field shapes during initial wiring.
  const debug = request.nextUrl.searchParams.get('debug') === '1'

  try {
    const config = await getCalendarConfig(calendarId, { includeRaw: debug })
    const response = NextResponse.json(config, { status: 200 })
    if (!debug) {
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=300')
    }
    return response
  } catch (err) {
    if (err instanceof GhlApiError) {
      console.error('[calendar-config] GHL error', { status: err.status, body: err.body })
      return NextResponse.json(
        { error: 'Calendar config unavailable', minScheduleNoticeMs: 0, minScheduleNoticeDays: 0 },
        { status: 503 },
      )
    }
    console.error('[calendar-config] Unexpected error', err)
    return NextResponse.json(
      { error: 'Internal error', minScheduleNoticeMs: 0, minScheduleNoticeDays: 0 },
      { status: 500 },
    )
  }
}
