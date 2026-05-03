import { ghlFetch } from './client'
import type { GhlFreeSlots } from './types'

export interface DaySlots {
  date: string    // YYYY-MM-DD
  times: string[] // ISO 8601 strings
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
