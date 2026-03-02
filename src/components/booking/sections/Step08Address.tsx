// src/components/booking/sections/Step08Address.tsx
'use client'

import React from 'react'
import { MapPin, Home, Building2, Map, Hash } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'

const US_STATES = [
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' }, { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' },
]

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

export function Step08Address() {
  const { bookingData, updateAddress } = useBooking()
  const { address } = bookingData

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
        Service Address.
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* Street — full width */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={labelStyle}>
            Street Address <span style={{ color: 'var(--color-teal)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <MapPin size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none' }} />
            <input
              type="text"
              value={address.street}
              onChange={(e) => updateAddress({ street: e.target.value })}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="123 Main Street"
              style={inputStyle}
              required
            />
          </div>
        </div>

        {/* Apt / Unit — full width */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={labelStyle}>Apt / Suite / Unit</label>
          <div style={{ position: 'relative' }}>
            <Home size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none' }} />
            <input
              type="text"
              value={address.apt ?? ''}
              onChange={(e) => updateAddress({ apt: e.target.value })}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="Apt 4B (optional)"
              style={inputStyle}
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label style={labelStyle}>
            City <span style={{ color: 'var(--color-teal)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <Building2 size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none' }} />
            <input
              type="text"
              value={address.city}
              onChange={(e) => updateAddress({ city: e.target.value })}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="e.g. New York"
              style={inputStyle}
              required
            />
          </div>
        </div>

        {/* Zip */}
        <div>
          <label style={labelStyle}>
            ZIP / Postal Code <span style={{ color: 'var(--color-teal)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <Hash size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none' }} />
            <input
              type="text"
              value={address.zipCode}
              onChange={(e) => updateAddress({ zipCode: e.target.value })}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="10001"
              maxLength={10}
              style={inputStyle}
              required
            />
          </div>
        </div>

        {/* State — full width */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={labelStyle}>
            State <span style={{ color: 'var(--color-teal)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <Map size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none', zIndex: 1 }} />
            <select
              value={address.state}
              onChange={(e) => updateAddress({ state: e.target.value })}
              onFocus={onFocus}
              onBlur={onBlur}
              style={{
                width: '100%',
                padding: '12px 16px 12px 42px',
                border: '1px solid rgba(13,27,46,0.1)',
                background: 'white',
                fontSize: '0.95rem',
                outline: 'none',
                borderRadius: 0,
                cursor: 'pointer',
                appearance: 'none' as const,
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}
              required
            >
              <option value="">Select a state</option>
              {US_STATES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Note */}
      <div style={{ marginTop: '24px', padding: '14px 16px', background: 'rgba(23,176,171,0.05)', border: '1px dashed rgba(23,176,171,0.3)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(74,90,106,0.75)', lineHeight: 1.6, margin: 0 }}>
          We currently serve the greater metropolitan area. Enter your address and we&apos;ll confirm availability in your zone.
        </p>
      </div>
    </div>
  )
}
