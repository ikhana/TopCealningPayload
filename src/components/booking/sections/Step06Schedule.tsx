'use client'

import React, { useEffect, useState } from 'react'
import { CalendarDays, Clock, Info, Loader2 } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'

const FLEXIBLE = ['Morning', 'Afternoon', 'Evening']

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontWeight: 700,
  color: 'rgba(74,90,106,0.9)',
  marginBottom: '6px',
  display: 'block',
}

// Earliest bookable date is computed from the GHL calendar's
// "Minimum scheduling notice" setting. We fetch that live via
// /api/calendar-config so a single source of truth (GHL) controls
// both the available time slots and the date picker's `min` attribute.
//
// Fallback to "tomorrow" if the API call fails — fail open, never
// fully block bookings due to a transient config fetch error.
function getDateOffsetDays(daysAhead: number): string {
  const d = new Date()
  d.setDate(d.getDate() + Math.max(daysAhead, 1))
  return d.toISOString().split('T')[0]!
}

function labelForOffset(daysAhead: number): string {
  if (daysAhead <= 1) return 'tomorrow'
  if (daysAhead === 2) return 'the day after tomorrow'
  return `${daysAhead} days from today`
}

function formatSlotLabel(iso: string, timezone?: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    // Force display in the business timezone so customers see appointment times
    // matching the company's local clock, not their browser's local clock.
    timeZone: timezone || 'America/New_York',
  })
}

export function Step06Schedule() {
  const { bookingData, updateServiceDateTime, toggleFlexibleTime } = useBooking()
  const { serviceDate, serviceTime, flexibleTimes } = bookingData

  const [slots, setSlots] = useState<string[]>([])
  const [slotsTimezone, setSlotsTimezone] = useState<string | undefined>(undefined)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [slotsError, setSlotsError] = useState(false)

  // Server computes the earliest bookable date in the GHL calendar's
  // timezone so we don't have to do timezone math on the client.
  // Defaults to tomorrow if the fetch fails — fail open.
  const [earliestDate, setEarliestDate] = useState<string>(() => getDateOffsetDays(1))
  const [minDaysAhead, setMinDaysAhead] = useState<number>(1)

  useEffect(() => {
    let cancelled = false
    fetch('/api/calendar-config')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (typeof data?.earliestBookableDate === 'string') {
          setEarliestDate(data.earliestBookableDate)
        }
        if (typeof data?.minScheduleNoticeDays === 'number' && data.minScheduleNoticeDays > 0) {
          setMinDaysAhead(data.minScheduleNoticeDays)
        }
      })
      .catch(() => {
        // Silent fallback to default — never block the wizard on a config fetch
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!serviceDate) { setSlots([]); return }

    setLoadingSlots(true)
    setSlotsError(false)

    fetch(`/api/availability?date=${serviceDate}`)
      .then((r) => r.json())
      .then((data) => {
        const daySlots = data.slots?.find((d: { date: string; times: string[] }) => d.date === serviceDate)
        setSlots(daySlots?.times ?? [])
        setSlotsTimezone(data.timezone)
      })
      .catch(() => setSlotsError(true))
      .finally(() => setLoadingSlots(false))
  }, [serviceDate])

  // Clear selected time if it's no longer in the available slots
  useEffect(() => {
    if (serviceTime && slots.length > 0 && !slots.includes(serviceTime)) {
      updateServiceDateTime(serviceDate, '')
    }
  }, [slots])

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'var(--color-teal)'
    e.target.style.boxShadow = '0 0 0 4px rgba(23,176,171,0.05)'
  }
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'rgba(13,27,46,0.1)'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div>
      <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', fontWeight: 900, letterSpacing: '-1.5px', color: 'var(--color-navy-deep)', marginBottom: '36px' }}>
        When to Arrive?
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '36px' }}>

        {/* Date */}
        <div>
          <label style={labelStyle}>
            Preferred Date <span style={{ color: 'var(--color-teal)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <CalendarDays size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none' }} />
            <input
              type="date"
              value={serviceDate}
              min={earliestDate}
              onChange={(e) => updateServiceDateTime(e.target.value, '')}
              onFocus={onFocus}
              onBlur={onBlur}
              style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid rgba(13,27,46,0.1)', background: 'white', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.3s, box-shadow 0.3s', borderRadius: 0 }}
              required
            />
          </div>
          <p style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', fontSize: '0.72rem', color: 'rgba(74,90,106,0.65)' }}>
            <Info size={11} /> Earliest available date is {labelForOffset(minDaysAhead)}
          </p>
        </div>

        {/* Time */}
        <div>
          <label style={labelStyle}>
            Available Time <span style={{ color: 'var(--color-teal)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            {loadingSlots ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', border: '1px solid rgba(13,27,46,0.1)', color: 'rgba(74,90,106,0.6)', fontSize: '0.88rem' }}>
                <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Checking availability...
              </div>
            ) : (
              <>
                <Clock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none', zIndex: 1 }} />
                <select
                  aria-label="Preferred service time"
                  value={serviceTime}
                  onChange={(e) => updateServiceDateTime(serviceDate, e.target.value)}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  disabled={!serviceDate || slots.length === 0}
                  style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid rgba(13,27,46,0.1)', background: 'white', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.3s', borderRadius: 0, cursor: serviceDate && slots.length > 0 ? 'pointer' : 'not-allowed', appearance: 'none' as const, opacity: !serviceDate ? 0.5 : 1 }}
                  required
                >
                  {!serviceDate && <option value="">Select a date first</option>}
                  {serviceDate && slots.length === 0 && !slotsError && <option value="">No availability — pick another date</option>}
                  {serviceDate && slotsError && <option value="">Could not load slots — try again</option>}
                  {slots.length > 0 && <option value="">Select a time</option>}
                  {slots.map((iso) => (
                    <option key={iso} value={iso}>{formatSlotLabel(iso, slotsTimezone)}</option>
                  ))}
                </select>
              </>
            )}
          </div>
          <p style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', fontSize: '0.72rem', color: 'rgba(74,90,106,0.65)' }}>
            <Info size={11} />
            {!serviceDate ? 'Pick a date to see available times' : slots.length > 0 ? `${slots.length} slot${slots.length > 1 ? 's' : ''} available` : 'Try a different date'}
          </p>
        </div>
      </div>

      {/* Flexible time section */}
      <div>
        <label style={{ ...labelStyle, marginBottom: '10px' }}>Flexible Times</label>
        <p style={{ fontSize: '0.82rem', color: 'rgba(74,90,106,0.7)', lineHeight: 1.6, marginBottom: '14px' }}>
          Flexible with timing? Check all that apply — we&apos;ll always call if we need to adjust.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {FLEXIBLE.map((time) => {
            const sel = flexibleTimes.includes(time)
            return (
              <div
                key={time}
                onClick={() => toggleFlexibleTime(time)}
                style={{ border: `1px solid ${sel ? 'var(--color-teal)' : 'rgba(13,27,46,0.1)'}`, padding: '14px 12px', cursor: 'pointer', background: sel ? '#e0f5f4' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s' }}
                onMouseEnter={(e) => { if (!sel) (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-teal)' }}
                onMouseLeave={(e) => { if (!sel) (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(13,27,46,0.1)' }}
              >
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-navy-deep)' }}>{time}</span>
                <div style={{ width: '16px', height: '16px', border: `1px solid ${sel ? 'var(--color-teal)' : 'rgba(13,27,46,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'var(--color-teal)', flexShrink: 0 }}>
                  {sel && '✓'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
