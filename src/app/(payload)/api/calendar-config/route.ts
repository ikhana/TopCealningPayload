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

  const timezone = process.env.GHL_CALENDAR_TIMEZONE ?? 'America/New_York'

  try {
    const config = await getCalendarConfig(calendarId, { includeRaw: debug })

    // Compute earliest bookable date in the CALENDAR's timezone so the
    // client doesn't have to know about timezone math. Returns YYYY-MM-DD.
    const nowInTz = new Date().toLocaleString('en-US', { timeZone: timezone })
    const nowMs = new Date(nowInTz).getTime() + config.minScheduleNoticeMs
    const targetYmd = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(nowMs))

    const responseBody = {
      ...config,
      earliestBookableDate: targetYmd, // YYYY-MM-DD in calendar timezone
      timezone,
    }
    const response = NextResponse.json(responseBody, { status: 200 })
    if (!debug) {
      response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
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
