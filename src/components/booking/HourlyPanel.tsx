// src/components/booking/HourlyPanel.tsx
//
// The Custom Hourly Cleaning questions on the Specs step: how long, how many cleaners, and
// what to focus on. Geraldine, 2026-10-18: Custom Hourly is "its own service category", not
// an option under another service's estimate. This used to live at the bottom of Step 4 as a
// toggle; it moved here when the service got its own place in the picker.
//
// Two components, rendered one after the other by Step03Property:
//   <HourlyPanel />       total labor hours, cleaners, the rate card, the estimated total
//   <HourlyPriorities />  which areas to focus on, plus the free-text question

'use client'

import React, { useId } from 'react'
import { useBooking } from '@/components/booking/BookingContext'
import {
  quoteHourlyFromState,
  canAddSecondCleaner,
  hourlyMaxTotal,
  HOURLY_MIN_TOTAL_HOURS,
  HOURLY_SECOND_CLEANER_MIN_TOTAL,
  HOURLY_MIN_CLEANERS,
  HOURLY_MAX_CLEANERS,
  HOURLY_RATE_TIERS,
  HOURLY_DISCLAIMER,
} from '@/data/pricing'
import { HOURLY_PRIORITIES, HOURLY_PRIORITY_OTHER } from '@/data/hourly'

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontWeight: 700,
  color: 'rgba(74,90,106,0.9)',
  marginBottom: '8px',
  display: 'block',
}

/** Labelled -/+ row. */
function Stepper({
  label, hint, value, min, max, onChange,
}: {
  label: string
  hint?: string
  value: number
  min: number
  max: number
  onChange: (n: number) => void
}) {
  const btn = (enabled: boolean): React.CSSProperties => ({
    width: '34px', height: '34px', flexShrink: 0,
    border: '1px solid rgba(13,27,46,0.15)', background: 'white',
    color: enabled ? 'var(--color-navy-deep)' : 'rgba(74,90,106,0.3)',
    fontSize: '1.05rem', lineHeight: 1, fontWeight: 700,
    cursor: enabled ? 'pointer' : 'not-allowed', borderRadius: 0,
  })
  return (
    <div>
      <div style={labelStyle}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button type="button" aria-label={`Fewer ${label}`} disabled={value <= min}
          onClick={() => onChange(value - 1)} style={btn(value > min)}>−</button>
        <span aria-live="polite" style={{ minWidth: '38px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-navy-deep)' }}>
          {value}
        </span>
        <button type="button" aria-label={`More ${label}`} disabled={value >= max}
          onClick={() => onChange(value + 1)} style={btn(value < max)}>+</button>
      </div>
      {hint && <p style={{ margin: '6px 0 0', fontSize: '0.7rem', color: 'rgba(74,90,106,0.7)' }}>{hint}</p>}
    </div>
  )
}

export function HourlyPanel() {
  const { bookingData, updateCustomHourly } = useBooking()
  const hourly = quoteHourlyFromState(bookingData.customHourly)
  const baseRate = HOURLY_RATE_TIERS[HOURLY_RATE_TIERS.length - 1]!.rate

  return (
    <div style={{ gridColumn: 'span 2', border: '1px solid var(--color-teal)', background: '#f2fbfa', padding: '20px' }}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-navy-deep)' }}>Custom Hourly Cleaning</div>
        <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'rgba(74,90,106,0.85)' }}>
          Book by the hour and choose the total labor hours and the number of cleaners that works best for you.
        </p>
      </div>

      {/*
        TOTAL hours first, then cleaners (her slide: "Customers should only be able to request
        a second cleaner when booking at least 6 combined labor hours"). Total hours is what is
        priced, so the cleaner count can never change the total: it only decides who shares
        the hours.
      */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <Stepper
          label="Total Labor Hours"
          hint={`Minimum ${HOURLY_MIN_TOTAL_HOURS} hours. Longer bookings get a lower hourly rate.`}
          value={hourly.totalLaborHours}
          min={HOURLY_MIN_TOTAL_HOURS}
          max={hourlyMaxTotal(hourly.cleaners)}
          onChange={(n) => updateCustomHourly({ totalHours: n })}
        />
        <Stepper
          label="Number of Cleaners"
          hint={
            canAddSecondCleaner(hourly.totalLaborHours)
              ? 'Each cleaner works at least 3 hours.'
              : `A second cleaner is available from ${HOURLY_SECOND_CLEANER_MIN_TOTAL} labor hours.`
          }
          value={hourly.cleaners}
          min={HOURLY_MIN_CLEANERS}
          // Capped at ONE until the booking reaches 6 combined hours.
          max={canAddSecondCleaner(hourly.totalLaborHours) ? HOURLY_MAX_CLEANERS : HOURLY_MIN_CLEANERS}
          onChange={(n) => updateCustomHourly({ cleaners: n })}
        />
      </div>

      {/* Rate card, built from HOURLY_RATE_TIERS so it cannot disagree with the price. Shown in
          full so the customer can see that booking longer lowers the rate. */}
      <div style={{ marginTop: '18px', border: '1px solid rgba(13,27,46,0.08)', background: 'white' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(74,90,106,0.6)', padding: '10px 14px 6px' }}>
          Hourly rates (by total labor hours)
        </div>
        {[...HOURLY_RATE_TIERS].reverse().map((tier, i, ascending) => {
          const lo = tier.minHours
          const next = ascending[i + 1]
          const hi = next ? next.minHours - 1 : 999
          const band = !next ? `${lo}+ hours` : lo === hi ? `${lo} hours` : `${lo} – ${hi} hours`
          const active = hourly.totalLaborHours >= lo && hourly.totalLaborHours <= hi
          return (
            <div key={band} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 14px', fontSize: '0.82rem', background: active ? '#e0f5f4' : 'transparent', fontWeight: active ? 700 : 400, color: 'var(--color-navy-deep)' }}>
              <span>{band}</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>${tier.rate} / hour</span>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '16px', padding: '16px 18px', background: 'var(--color-navy-deep)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.75 }}>
            Estimated Total
          </span>
          <span style={{ fontSize: '1.7rem', fontWeight: 900, letterSpacing: '-1px' }}>${hourly.total}</span>
        </div>
        <p style={{ margin: '8px 0 0', fontSize: '0.78rem', opacity: 0.8 }}>
          {hourly.totalLaborHours} labor hours at ${hourly.rate} / hour
          {hourly.cleaners > 1 ? ` (${hourly.hoursPerCleaner} hours each for ${hourly.cleaners} cleaners)` : ''}
        </p>
        {/* Her slide: the website should display the customer's savings. Only when there are
            some: in the top rate band there is nothing to save. */}
        {hourly.savings > 0 && (
          <p style={{ margin: '6px 0 0', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-teal-glow, #3dcfca)' }}>
            You save ${hourly.savings} compared with the ${baseRate} / hour rate.
          </p>
        )}
        {/* Her slide: "When customers select 2 cleaners, please explain that the total labor
            hours are divided between both cleaners." */}
        {hourly.cleaners > 1 && (
          <p style={{ margin: '6px 0 0', fontSize: '0.75rem', opacity: 0.8 }}>
            The {hourly.totalLaborHours} labor hours are shared between your {hourly.cleaners} cleaners, so a second
            cleaner finishes sooner and does not add to the total.
          </p>
        )}
      </div>

      <p style={{ margin: '12px 0 0', fontSize: '0.75rem', lineHeight: 1.55, color: 'rgba(74,90,106,0.8)' }}>
        {HOURLY_DISCLAIMER}
      </p>
    </div>
  )
}

export function HourlyPriorities() {
  const { bookingData, togglePriority, updateCustomHourly } = useBooking()
  const selected = bookingData.customHourly?.priorities ?? []
  const other = bookingData.customHourly?.priorityOther ?? ''
  const otherId = useId()

  return (
    <div style={{ gridColumn: 'span 2' }}>
      <label style={labelStyle}>
        Cleaning priorities <span style={{ color: 'var(--color-teal)' }}>*</span>
      </label>
      <p style={{ margin: '-2px 0 10px', fontSize: '0.78rem', color: 'rgba(74,90,106,0.75)' }}>
        Select the areas you want our cleaners to focus on. Choose as many as you like.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {HOURLY_PRIORITIES.map((opt) => {
          const sel = selected.includes(opt)
          return (
            <button
              type="button"
              key={opt}
              aria-pressed={sel}
              onClick={() => togglePriority(opt)}
              style={{
                padding: '9px 14px',
                border: `1px solid ${sel ? 'var(--color-teal)' : 'rgba(13,27,46,0.12)'}`,
                background: sel ? '#e0f5f4' : 'white',
                color: sel ? 'var(--color-navy-deep)' : 'rgba(74,90,106,0.8)',
                fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', borderRadius: 0,
                display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'all 0.25s ease',
              }}
            >
              {sel && <span style={{ color: 'var(--color-teal)', fontSize: '0.7rem' }}>✓</span>}
              {opt}
            </button>
          )
        })}
      </div>

      {selected.includes(HOURLY_PRIORITY_OTHER) && (
        <div style={{ marginTop: '12px' }}>
          <label htmlFor={otherId} style={labelStyle}>Please specify the other area</label>
          <input
            id={otherId}
            type="text"
            value={other}
            maxLength={200}
            onChange={(e) => updateCustomHourly({ priorityOther: e.target.value })}
            placeholder="e.g. garage, patio, home office"
            style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(13,27,46,0.1)', background: 'white', fontSize: '0.95rem', outline: 'none', borderRadius: 0 }}
          />
        </div>
      )}
    </div>
  )
}
