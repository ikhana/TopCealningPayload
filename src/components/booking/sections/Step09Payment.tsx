// src/components/booking/sections/Step09Payment.tsx
'use client'

import React, { useState } from 'react'
import { CreditCard, User, Lock, ShieldCheck, Tag } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'

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
  letterSpacing: '0.03em',
}

/** Format a raw digit string into groups of 4: "1234 5678 9012 3456" */
function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

/** Format expiry as MM/YY */
function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return digits
}

/** Detect card brand from first digit(s) */
function detectBrand(raw: string): string {
  if (!raw) return ''
  if (/^4/.test(raw)) return 'Visa'
  if (/^5[1-5]/.test(raw)) return 'Mastercard'
  if (/^3[47]/.test(raw)) return 'Amex'
  if (/^6(?:011|5)/.test(raw)) return 'Discover'
  return ''
}

export function Step09Payment() {
  const { bookingData, toggleFirstTimeClient } = useBooking()
  const { isFirstTimeClient, pricing } = bookingData

  /* Local card state (not persisted to context — handled on final submit) */
  const [cardHolder, setCardHolder] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')

  const rawNumber = cardNumber.replace(/\s/g, '')
  const brand = detectBrand(rawNumber)

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
      <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', fontWeight: 900, letterSpacing: '-1.5px', color: 'var(--color-navy-deep)', marginBottom: '36px' }}>
        Payment Details.
      </h2>

      {/* ── First-time client discount ─────────────────────── */}
      <div
        onClick={toggleFirstTimeClient}
        style={{
          border: `1px solid ${isFirstTimeClient ? 'var(--color-teal)' : 'rgba(13,27,46,0.1)'}`,
          background: isFirstTimeClient ? '#e0f5f4' : 'white',
          padding: '16px 20px',
          marginBottom: '32px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          transition: 'all 0.3s',
        }}
      >
        {/* Checkbox */}
        <div style={{
          width: '20px', height: '20px', flexShrink: 0,
          border: `2px solid ${isFirstTimeClient ? 'var(--color-teal)' : 'rgba(13,27,46,0.2)'}`,
          background: isFirstTimeClient ? 'var(--color-teal)' : 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.25s',
        }}>
          {isFirstTimeClient && (
            <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
              <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <Tag size={15} style={{ color: isFirstTimeClient ? 'var(--color-teal)' : 'rgba(74,90,106,0.4)', flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-navy-deep)', marginBottom: '2px' }}>
            I am a first-time client
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: isFirstTimeClient ? 'var(--color-teal)' : 'rgba(74,90,106,0.6)' }}>
            {isFirstTimeClient
              ? `15% discount applied → New total: $${pricing.total.toFixed(2)}`
              : '15% first-time discount available'}
          </div>
        </div>
      </div>

      {/* ── Card form ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Cardholder name — full width */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={labelStyle}>
            Cardholder Name <span style={{ color: 'var(--color-teal)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <User size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none' }} />
            <input
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="Alexander Pierce"
              style={inputStyle}
              autoComplete="cc-name"
            />
          </div>
        </div>

        {/* Card number — full width */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={labelStyle}>
            Card Number <span style={{ color: 'var(--color-teal)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <CreditCard size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none' }} />
            <input
              type="text"
              inputMode="numeric"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              style={{ ...inputStyle, letterSpacing: '0.12em', fontFamily: 'var(--font-mono)' }}
              autoComplete="cc-number"
            />
            {/* Brand badge */}
            {brand && (
              <span style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700,
                color: 'var(--color-teal)', letterSpacing: '0.05em',
              }}>
                {brand.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Expiry */}
        <div>
          <label style={labelStyle}>
            Expiry <span style={{ color: 'var(--color-teal)' }}>*</span>
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="MM/YY"
            maxLength={5}
            style={{ ...inputStyle, padding: '12px 16px', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}
            autoComplete="cc-exp"
          />
        </div>

        {/* CVC */}
        <div>
          <label style={labelStyle}>
            CVC <span style={{ color: 'var(--color-teal)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none' }} />
            <input
              type="text"
              inputMode="numeric"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="•••"
              maxLength={4}
              style={{ ...inputStyle, fontFamily: 'var(--font-mono)', letterSpacing: '0.2em' }}
              autoComplete="cc-csc"
            />
          </div>
        </div>

      </div>

      {/* ── Secure note ───────────────────────────────────── */}
      <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'rgba(23,176,171,0.05)', border: '1px solid rgba(23,176,171,0.15)' }}>
        <ShieldCheck size={16} style={{ color: 'var(--color-teal)', flexShrink: 0 }} />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(74,90,106,0.75)', margin: 0, lineHeight: 1.5 }}>
          Your payment info is encrypted and processed securely. We never store card details.
        </p>
      </div>
    </div>
  )
}
