// src/components/booking/sections/Step05Frequency.tsx
'use client'

import React from 'react'
import { CalendarDays, CalendarCheck, Calendar, CalendarRange } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'
import type { FrequencyOption } from '@/types/booking'

const FREQUENCIES = [
  { id: 'one-time' as FrequencyOption,  label: 'One Time',       desc: 'Single service',             discount: 0,    icon: CalendarDays },
  { id: 'weekly' as FrequencyOption,    label: 'Weekly',         desc: 'Every week',                 discount: 10,   icon: CalendarCheck },
  { id: 'biweekly' as FrequencyOption,  label: 'Bi-Weekly',      desc: 'Every two weeks',            discount: 7.5,  icon: CalendarRange },
  { id: '3weekly' as FrequencyOption,   label: 'Every 3 Weeks',  desc: 'Every three weeks',          discount: 5,    icon: CalendarRange },
  { id: 'monthly' as FrequencyOption,   label: 'Monthly',        desc: 'Once a month',               discount: 2.5,  icon: Calendar },
  { id: '8weekly' as FrequencyOption,   label: 'Every 8 Weeks',  desc: 'Every eight weeks',          discount: 0,    icon: Calendar },
]

export function Step05Frequency() {
  const { bookingData, updateFrequency } = useBooking()
  const { frequency } = bookingData

  return (
    <div>
      {/* Kicker + title */}
      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-teal)', fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
        Phase 05 — Continuity
      </span>
      <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', fontWeight: 900, letterSpacing: '-1.5px', color: 'var(--color-navy-deep)', marginBottom: '32px' }}>
        How Often?
      </h2>

      {/* Frequency cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
        {FREQUENCIES.map(({ id, label, desc, discount, icon: Icon }) => {
          const sel = frequency === id
          return (
            <div
              key={id}
              onClick={() => updateFrequency(id)}
              style={{
                border: `1px solid ${sel ? '#fc8181' : 'rgba(13,27,46,0.1)'}`,
                padding: '20px 12px',
                textAlign: 'center',
                cursor: 'pointer',
                background: sel ? '#fffafa' : 'white',
                transition: 'all 0.35s cubic-bezier(0.25,1,0.5,1)',
                position: 'relative',
              }}
              onMouseEnter={(e) => { if (!sel) (e.currentTarget as HTMLDivElement).style.background = '#e0f5f4' }}
              onMouseLeave={(e) => { if (!sel) (e.currentTarget as HTMLDivElement).style.background = 'white' }}
            >
              {/* "SELECTED" badge */}
              {sel && (
                <div style={{
                  position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                  background: '#fc8181', color: 'white',
                  fontFamily: 'var(--font-mono)', fontSize: '0.5rem', fontWeight: 700,
                  padding: '2px 8px', letterSpacing: '1px', whiteSpace: 'nowrap',
                }}>
                  SELECTED
                </div>
              )}

              <Icon size={18} style={{ color: sel ? '#fc8181' : 'rgba(74,90,106,0.45)', margin: '0 auto 10px' }} />

              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-navy-deep)', marginBottom: '4px' }}>
                {label}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(74,90,106,0.6)', marginBottom: discount > 0 ? '10px' : 0 }}>
                {desc}
              </div>
              {discount > 0 && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-teal)', fontWeight: 700 }}>
                  {discount}% OFF
                </div>
              )}
              {discount === 0 && id === 'one-time' && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'rgba(74,90,106,0.5)' }}>
                  Full Price
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Discount note */}
      <div style={{ marginTop: '32px', padding: '18px 20px', border: '1px dashed rgba(23,176,171,0.4)', background: 'rgba(224,245,244,0.4)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-navy-deep)', lineHeight: 1.6, margin: 0 }}>
          * Discounts apply after the first cleaning. No long-term contracts required.
          Recurring cleanings maintain full scheduling flexibility.
        </p>
      </div>
    </div>
  )
}
