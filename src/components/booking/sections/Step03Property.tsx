// src/components/booking/sections/Step03Property.tsx
'use client'

import React from 'react'
import { Ruler, Building2, Bath } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'

const BEDROOM_OPTIONS = [
  { value: 'studio', label: 'Studio' },
  { value: '1', label: '1 Bedroom' },
  { value: '2', label: '2 Bedrooms' },
  { value: '3', label: '3 Bedrooms' },
  { value: '4', label: '4 Bedrooms' },
  { value: '5', label: '5 Bedrooms' },
  { value: '6', label: '6 Bedrooms' },
]

const BATHROOM_OPTIONS = [1, 2, 3, 4, 5, 6]

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

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px 12px 42px',
  border: '1px solid rgba(13,27,46,0.1)',
  background: 'white',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.3s, box-shadow 0.3s',
  borderRadius: 0,
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px 12px 42px',
  border: '1px solid rgba(13,27,46,0.1)',
  background: 'white',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.3s',
  borderRadius: 0,
  cursor: 'pointer',
  appearance: 'none',
}

export function Step03Property() {
  const { bookingData, updatePropertySize } = useBooking()
  const { property } = bookingData

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
      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-teal)', fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
        Phase 03 — Dimensions
      </span>
      <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', fontWeight: 900, letterSpacing: '-1.5px', color: 'var(--color-navy-deep)', marginBottom: '40px' }}>
        Property Details.
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* Square Footage — full width */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={labelStyle}>
            Square Footage <span style={{ color: 'var(--color-teal)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <Ruler size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none' }} />
            <input
              type="number"
              value={property.squareFootage || ''}
              onChange={(e) => updatePropertySize({ squareFootage: parseInt(e.target.value) || 0 })}
              onFocus={onFocus}
              onBlur={onBlur}
              min="0"
              placeholder="Enter sq. ft."
              style={inputStyle}
              required
            />
          </div>
          <p style={{ marginTop: '6px', fontSize: '0.75rem', color: 'rgba(74,90,106,0.7)' }}>
            Enter the total square footage of your property
          </p>
        </div>

        {/* Bedrooms */}
        <div>
          <label style={labelStyle}>
            Bedrooms <span style={{ color: 'var(--color-teal)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <Building2 size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none', zIndex: 1 }} />
            <select
              value={property.bedrooms}
              onChange={(e) => updatePropertySize({ bedrooms: e.target.value })}
              onFocus={onFocus}
              onBlur={onBlur}
              style={selectStyle}
              required
            >
              <option value="">Select bedrooms</option>
              {BEDROOM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <label style={labelStyle}>
            Bathrooms <span style={{ color: 'var(--color-teal)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <Bath size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none', zIndex: 1 }} />
            <select
              value={property.bathrooms}
              onChange={(e) => updatePropertySize({ bathrooms: parseInt(e.target.value) })}
              onFocus={onFocus}
              onBlur={onBlur}
              style={selectStyle}
              required
            >
              {BATHROOM_OPTIONS.map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? 'Bathroom' : 'Bathrooms'}</option>
              ))}
            </select>
          </div>
        </div>

      </div>
    </div>
  )
}
