// src/components/booking/sections/Step08Address.tsx
'use client'

import React, { useRef } from 'react'
import { MapPin, Home, Building2, Hash, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'
import { isBrowardZip } from '@/lib/booking/broward-zips'
import { useAddressAutocomplete } from '@/hooks/useAddressAutocomplete'

// State selector removed — service-location state is always Florida.
// Service area gate (Broward County) lives on this step now (was Step 1).
// State is set to 'FL' in useBookingForm initial state.

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

  // Google Places Autocomplete on the Street input. When the customer picks
  // a suggestion, Street + City + State + Zip all populate at once.
  const streetInputRef = useRef<HTMLInputElement>(null)
  useAddressAutocomplete(streetInputRef, (parsed) => {
    updateAddress({
      street: parsed.street || address.street,
      city: parsed.city || address.city,
      state: parsed.state || address.state,
      zipCode: parsed.zipCode || address.zipCode,
    })
  })

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
      <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', fontWeight: 900, letterSpacing: '-1.5px', color: 'var(--color-navy-deep)', marginBottom: '20px' }}>
        Service Address.
      </h2>

      {/* Service-area notice — Broward County only. Sits above the address
          fields so customers see it BEFORE filling the form (was below). */}
      <div style={{
        marginBottom: '32px',
        padding: '18px 22px',
        background: 'rgba(23,176,171,0.06)',
        borderLeft: '4px solid var(--color-teal)',
      }}>
        <p style={{
          fontSize: '0.98rem',
          color: 'var(--color-navy-deep)',
          lineHeight: 1.55,
          margin: 0,
          fontWeight: 500,
        }}>
          We currently serve the <strong>greater metropolitan area</strong>. Enter your address and we&apos;ll confirm availability in your zone.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* Street — full width */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={labelStyle}>
            Street Address <span style={{ color: 'var(--color-teal)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <MapPin size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none' }} />
            <input
              ref={streetInputRef}
              type="text"
              value={address.street}
              onChange={(e) => updateAddress({ street: e.target.value })}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="Start typing your address…"
              style={inputStyle}
              autoComplete="off"
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
              placeholder="e.g. Fort Lauderdale"
              style={inputStyle}
              required
            />
          </div>
        </div>

        {/* Zip — with inline Broward County validation */}
        <div>
          {(() => {
            const zip = (address.zipCode ?? '').trim()
            const digits = zip.replace(/\D/g, '').slice(0, 5)
            const fullyTyped = digits.length === 5
            const valid = fullyTyped && isBrowardZip(digits)
            const invalid = fullyTyped && !valid
            return (
              <>
                <label style={labelStyle}>
                  ZIP / Postal Code <span style={{ color: 'var(--color-teal)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Hash size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={address.zipCode}
                    onChange={(e) => updateAddress({ zipCode: e.target.value.replace(/\D/g, '').slice(0, 5) })}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder="33305"
                    maxLength={5}
                    style={{
                      ...inputStyle,
                      borderColor: invalid ? '#fca5a5' : valid ? 'var(--color-teal)' : 'rgba(13,27,46,0.1)',
                    }}
                    required
                  />
                  {valid && (
                    <CheckCircle2
                      size={16}
                      style={{
                        position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                        color: 'var(--color-teal)', pointerEvents: 'none',
                      }}
                    />
                  )}
                </div>
                {invalid && (
                  <p style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    marginTop: '8px', fontSize: '0.78rem', color: '#dc2626', fontWeight: 600,
                  }}>
                    <AlertCircle size={13} /> We don&apos;t service this area yet.
                  </p>
                )}
              </>
            )
          })()}
        </div>

      </div>
    </div>
  )
}
