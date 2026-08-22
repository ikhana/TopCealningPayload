// src/components/booking/sections/Step01Customer.tsx
// Step 1 — Contact & Address (address merged in from the old Step 8 per
// Geraldine's request: collect contact + service address up front).

'use client'

import React, { useRef } from 'react'
import { User, Mail, Phone, Info, MapPin, Home, Building2, Hash, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'
import { isServiceAreaZip } from '@/lib/booking/broward-zips'
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

        {/* First Name */}
        <div>
          <label style={labelStyle}>First Name <span style={{ color: 'var(--color-teal)' }}>*</span></label>
          <div style={{ position: 'relative' }}>
            <User size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none' }} />
            <input
              type="text"
              name="firstName"
              value={customer.firstName}
              onChange={handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="e.g. Alexander"
              style={inputStyle}
              required
            />
          </div>
        </div>

        {/* Last Name */}
        <div>
          <label style={labelStyle}>Last Name <span style={{ color: 'var(--color-teal)' }}>*</span></label>
          <div style={{ position: 'relative' }}>
            <User size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none' }} />
            <input
              type="text"
              name="lastName"
              value={customer.lastName ?? ''}
              onChange={handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="e.g. Pierce"
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
        {/* Service-area notice — Broward County */}
        <div style={{
          marginBottom: '24px',
          padding: '16px 20px',
          background: 'rgba(23,176,171,0.06)',
          borderLeft: '4px solid var(--color-teal)',
        }}>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-navy-deep)', lineHeight: 1.55, margin: 0, fontWeight: 500 }}>
            Enter your address and we&apos;ll confirm availability in your area.
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
              const valid = fullyTyped && isServiceAreaZip(digits)
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

      <SmsConsentBlock />

    </div>
  )
}

// ── A2P 10DLC SMS consent ──────────────────────────────────────────────
//
// Lives on Step 1 by necessity, not by preference. Step 1 posts to
// /api/ghl/lead-capture, which puts the phone number in the CRM and tags the
// contact `website-lead` — the trigger for the abandoned-booking sequence. If
// consent were collected later, every abandoned lead would sit in GHL with no
// consent record and the recovery SMS could not legally be sent.
//
// Both boxes are optional and unticked on load. The form must submit with both
// declined (Twilio 30931), and a pre-ticked box invalidates the consent record
// regardless of the label. All five required disclosures (message type,
// frequency, rates, STOP, HELP) are present in this panel: the message type sits
// in each label, the rest in the shared block below both (Twilio 30924).
//
// See docs/a2p-compliance-handoff.md sections 4.1 and 6.1.
function SmsConsentBlock() {
  const { bookingData, updateSmsConsent } = useBooking()
  const { smsConsent } = bookingData

  // Each label keeps the two things that must be per-checkbox: the MESSAGE TYPE
  // (what separates marketing consent from service consent, Twilio 30913) and the
  // BRAND NAME (HighLevel's DBA guidance wants the brand in the checkbox CTA).
  //
  // The five boilerplate disclosures are NOT repeated per label. Researched during
  // the SMPL remediation: the requirement is about PLACEMENT, not repetition —
  // "clear and conspicuous text directly adjacent to the consent mechanism, on the
  // same screen as the checkbox, before the user submits". A shared block sitting
  // inside the same consent panel satisfies that. One source phrases it "adjacent
  // to each consent mechanism", so a pedantic reviewer could object; SMPL kept the
  // repetition only because it had a single clean attempt left. Top Cleaning has
  // used none, and this is a booking funnel where two 40-word labels cost
  // conversions.
  //
  // Do not remove the shared block. Compliance is ongoing, not a one-time gate:
  // carriers spot-check and complaints trigger re-review. Swapping one compliant
  // layout for another is fine; dropping the disclosures is not.
  const rows: Array<{ key: 'service' | 'marketing'; label: string }> = [
    {
      key: 'service',
      label:
        'I agree to receive account and service text messages from Top Cleaning Team, such as booking confirmations, appointment reminders, and replies to my enquiry.',
    },
    {
      key: 'marketing',
      label:
        'I agree to receive marketing and promotional text messages from Top Cleaning Team about cleaning services, offers, and updates.',
    },
  ]

  return (
    <div style={{ marginTop: '32px', borderTop: '1px solid rgba(13,27,46,0.08)', paddingTop: '24px' }}>
      {/* No section heading. Nothing in the A2P rules asks for one, and each
          checkbox already states what it is agreeing to. Optionality is proven by
          the form submitting with both unticked, not by a label saying so. */}
      {rows.map(({ key, label }) => (
        <label
          key={key}
          style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px',
            cursor: 'pointer', marginBottom: '14px', userSelect: 'none',
          }}
        >
          <input
            type="checkbox"
            checked={smsConsent[key]}
            onChange={(e) => updateSmsConsent({ [key]: e.target.checked })}
            style={{ marginTop: '3px', width: '16px', height: '16px', flexShrink: 0, accentColor: '#17b0ab', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.82rem', lineHeight: 1.55, color: 'rgba(74,90,106,0.85)' }}>
            {label}
          </span>
        </label>
      ))}

      {/* Shared disclosure block. Must stay inside this panel, directly below the
          checkboxes and above the submit control. Not in a footer, not behind a
          link, not in an accordion. */}
      <p style={{ fontSize: '0.78rem', color: 'rgba(74,90,106,0.65)', margin: '4px 0 0', lineHeight: 1.6 }}>
        Message frequency varies. Message and data rates may apply. Reply STOP to opt out
        or HELP for help. See our{' '}
        <a href="/privacy" style={{ color: '#17b0ab', fontWeight: 600 }}>Privacy Policy</a>
        {' '}and{' '}
        <a href="/terms" style={{ color: '#17b0ab', fontWeight: 600 }}>Terms of Service</a>.
      </p>
    </div>
  )
}
