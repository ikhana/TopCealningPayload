// src/components/booking/sections/Step06Schedule.tsx
'use client'

import React from 'react'
import { CalendarDays, Clock, Info } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'

const TIME_SLOTS = [
  { value: '08:00', label: '8:00 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '13:00', label: '1:00 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '16:00', label: '4:00 PM' },
]

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

const getTomorrow = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

export function Step06Schedule() {
  const { bookingData, updateServiceDateTime, toggleFlexibleTime } = useBooking()
  const { serviceDate, serviceTime, flexibleTimes } = bookingData

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

      {/* Date + time row */}
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
              min={getTomorrow()}
              onChange={(e) => updateServiceDateTime(e.target.value, serviceTime)}
              onFocus={onFocus}
              onBlur={onBlur}
              style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid rgba(13,27,46,0.1)', background: 'white', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.3s, box-shadow 0.3s', borderRadius: 0 }}
              required
            />
          </div>
          <p style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', fontSize: '0.72rem', color: 'rgba(74,90,106,0.65)' }}>
            <Info size={11} /> Earliest available date is tomorrow
          </p>
        </div>

        {/* Time */}
        <div>
          <label style={labelStyle}>
            Preferred Time <span style={{ color: 'var(--color-teal)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <Clock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none', zIndex: 1 }} />
            <select
              value={serviceTime}
              onChange={(e) => updateServiceDateTime(serviceDate, e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid rgba(13,27,46,0.1)', background: 'white', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.3s', borderRadius: 0, cursor: 'pointer', appearance: 'none' as const }}
              required
            >
              <option value="">Select a time</option>
              {TIME_SLOTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <p style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', fontSize: '0.72rem', color: 'rgba(74,90,106,0.65)' }}>
            <Info size={11} /> Select your preferred start time
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
                style={{
                  border: `1px solid ${sel ? 'var(--color-teal)' : 'rgba(13,27,46,0.1)'}`,
                  padding: '14px 12px',
                  cursor: 'pointer',
                  background: sel ? '#e0f5f4' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s',
                }}
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
    </div>
  )
}
