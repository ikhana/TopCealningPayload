import { ghlFetch } from './client'
import type { GhlFreeSlots } from './types'

export interface DaySlots {
  date: string    // YYYY-MM-DD
  times: string[] // ISO 8601 strings
}

export interface CalendarConfig {
  /** Minimum scheduling notice in milliseconds (0 if not configured or unknown shape) */
  minScheduleNoticeMs: number
  /** Convenience: same value rounded UP to whole days */
  minScheduleNoticeDays: number
  /** Raw GHL response (for debugging field-shape detection) */
  raw?: unknown
}

const UNIT_TO_MS: Record<string, number> = {
  minute: 60 * 1000,
  minutes: 60 * 1000,
  hour: 60 * 60 * 1000,
  hours: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  days: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  weeks: 7 * 24 * 60 * 60 * 1000,
}

/**
 * Fetch the calendar configuration from GHL and extract the minimum
 * scheduling notice. GHL stores the value + unit as a pair — we try
 * several known field shapes. Defaults to 0 (no minimum) if we can't
 * find anything — fail open, never block customers on a config probe.
 */
export async function getCalendarConfig(
  calendarId: string,
  opts: { includeRaw?: boolean } = {},
): Promise<CalendarConfig> {
  const res = await ghlFetch(`/calendars/${calendarId}`)
  const json = await res.json()
  const cal = json.calendar ?? json

  // GHL has multiple possible field shapes — each combines value + unit.
  // Try paired fields first (value AND unit at the same path).
  const candidates: Array<{ value: unknown; unit: unknown }> = [
    { value: cal?.notice?.minScheduleNotice, unit: cal?.notice?.minScheduleNoticeUnit },
    { value: cal?.notice?.allowBookingAfter, unit: cal?.notice?.allowBookingAfterUnit },
    { value: cal?.minScheduleNotice, unit: cal?.minScheduleNoticeUnit },
    { value: cal?.allowBookingAfter, unit: cal?.allowBookingAfterUnit },
    { value: cal?.bookingRules?.minScheduleNotice, unit: cal?.bookingRules?.minScheduleNoticeUnit },
    { value: cal?.bookingRules?.allowBookingAfter, unit: cal?.bookingRules?.allowBookingAfterUnit },
  ]

  let minScheduleNoticeMs = 0
  for (const { value, unit } of candidates) {
    if (typeof value !== 'number' || value < 0) continue
    const unitStr = (typeof unit === 'string' ? unit : '').toLowerCase()
    const multiplier = UNIT_TO_MS[unitStr]
    if (multiplier) {
      minScheduleNoticeMs = value * multiplier
      break
    }
  }

  const minScheduleNoticeDays = Math.ceil(minScheduleNoticeMs / (24 * 60 * 60 * 1000))

  return {
    minScheduleNoticeMs,
    minScheduleNoticeDays,
    ...(opts.includeRaw ? { raw: cal } : {}),
  }
}

export async function getFreeSlots(params: {
  calendarId: string
  startDate: string  // YYYY-MM-DD
  endDate: string    // YYYY-MM-DD
  timezone: string
}): Promise<DaySlots[]> {
  const { calendarId, startDate, endDate, timezone } = params

  // GHL expects epoch milliseconds for startDate / endDate
  const startMs = new Date(`${startDate}T00:00:00`).getTime()
  const endMs = new Date(`${endDate}T23:59:59`).getTime()

  const query = new URLSearchParams({
    startDate: String(startMs),
    endDate: String(endMs),
    timezone,
    userId: '',  // omit to use calendar default assignment
  })

  const res = await ghlFetch(`/calendars/${calendarId}/free-slots?${query}`)
  const json = await res.json()

  const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
  return Object.entries(json)
    .filter(([key, val]) => DATE_RE.test(key) && val && typeof val === 'object')
    .map(([date, val]) => {
      const raw = (val as { slots: string[] | GhlFreeSlots[string]['slots'] }).slots ?? []
      const times = raw.map((s) => (typeof s === 'string' ? s : s.startTime))
      return { date, times }
    })
}
