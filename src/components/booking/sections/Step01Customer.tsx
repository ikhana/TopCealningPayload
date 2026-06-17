// src/components/booking/sections/Step01Customer.tsx
// Step 1 — Contact & Address (address merged in from the old Step 8 per
// Geraldine's request: collect contact + service address up front).

'use client'

import React, { useRef } from 'react'
import { User, Mail, Phone, Info, MapPin, Home, Building2, Hash, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'
import { isBrowardZip } from '@/lib/booking/broward-zips'
import { useAddressAutocomplete } from '@/hooks/useAddressAutocomplete'

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

const sectionLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.7rem',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  fontWeight: 700,
  color: 'var(--color-teal)',
  marginBottom: '16px',
  display: 'block',
}

export function Step01Customer() {
  const { bookingData, updateCustomerInfo, updateAddress } = useBooking()
  const { customer, address } = bookingData

  // Google Places Autocomplete on the Street input — fills street/city/state/zip.
  const streetInputRef = useRef<HTMLInputElement>(null)
  useAddressAutocomplete(streetInputRef, (parsed) => {
    updateAddress({
      street: parsed.street || address.street,
      city: parsed.city || address.city,
      state: parsed.state || address.state,
      zipCode: parsed.zipCode || address.zipCode,
    })
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateCustomerInfo({ [name]: value })
  }

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--color-teal)'
    e.target.style.boxShadow = '0 0 0 4px rgba(23,176,171,0.05)'
  }
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(13,27,46,0.1)'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div>
      <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', fontWeight: 900, letterSpacing: '-1.5px', color: 'var(--color-navy-deep)', marginBottom: '40px' }}>
        Contact &amp; Address
      </h2>

      {/* ── Contact details ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* Full Name — spans 2 */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={labelStyle}>Full Name <span style={{ color: 'var(--color-teal)' }}>*</span></label>
          <div style={{ position: 'relative' }}>
            <User size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none' }} />
            <input
              type="text"
              name="firstName"
              value={customer.firstName}
              onChange={handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="e.g. Alexander Pierce"
              style={inputStyle}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle}>Email Address <span style={{ color: 'var(--color-teal)' }}>*</span></label>
          <div style={{ position: 'relative' }}>
            <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none' }} />
            <input
              type="email"
              name="email"
              value={customer.email}
              onChange={handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="alex@example.com"
              style={inputStyle}
              required
            />
          </div>
        </div>

        {/* Phone — US only, no country code dropdown */}
        <div>
          <label style={labelStyle}>Phone Number <span style={{ color: 'var(--color-teal)' }}>*</span></label>
          <div style={{ position: 'relative' }}>
            <Phone size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none' }} />
            <input
              type="tel"
              name="phone"
              value={customer.phone}
              onChange={handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="+1 (555) 000-0000"
              style={inputStyle}
              required
            />
          </div>
          <p style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', fontSize: '0.75rem', color: 'rgba(74,90,106,0.7)' }}>
            <Info size={12} />
            We&apos;ll only contact you about your booking
          </p>
        </div>

      </div>

      {/* ── Service address ─────────────────────────────────── */}
      <div style={{ marginTop: '36px' }}>
        <span style={sectionLabelStyle}>Service Address</span>

        {/* Service-area notice — Broward County */}
        <div style={{
          marginBottom: '24px',
          padding: '16px 20px',
          background: 'rgba(23,176,171,0.06)',
          borderLeft: '4px solid var(--color-teal)',
        }}>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-navy-deep)', lineHeight: 1.55, margin: 0, fontWeight: 500 }}>
            We currently serve the <strong>greater metropolitan area</strong>. Enter your address and we&apos;ll confirm availability in your zone.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

          {/* Street + Apt — same row (street wider) to save vertical space */}
          <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            {/* Street — autocomplete */}
            <div>
              <label style={labelStyle}>Street Address <span style={{ color: 'var(--color-teal)' }}>*</span></label>
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

            {/* Apt / Unit */}
            <div>
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
          </div>

          {/* City */}
          <div>
            <label style={labelStyle}>City <span style={{ color: 'var(--color-teal)' }}>*</span></label>
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

          {/* Zip — inline Broward County validation */}
          <div>
            {(() => {
              const zip = (address.zipCode ?? '').trim()
              const digits = zip.replace(/\D/g, '').slice(0, 5)
              const fullyTyped = digits.length === 5
              const valid = fullyTyped && isBrowardZip(digits)
              const invalid = fullyTyped && !valid
              return (
                <>
                  <label style={labelStyle}>ZIP / Postal Code <span style={{ color: 'var(--color-teal)' }}>*</span></label>
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
                      style={{ ...inputStyle, borderColor: invalid ? '#fca5a5' : valid ? 'var(--color-teal)' : 'rgba(13,27,46,0.1)' }}
                      required
                    />
                    {valid && (
                      <CheckCircle2 size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-teal)', pointerEvents: 'none' }} />
                    )}
                  </div>
                  {invalid && (
                    <p style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '0.78rem', color: '#dc2626', fontWeight: 600 }}>
                      <AlertCircle size={13} /> We don&apos;t service this area yet.
                    </p>
                  )}
                </>
              )
            })()}
          </div>

        </div>
      </div>

    </div>
  )
}
