// src/components/booking/sections/Step09Payment.tsx
// PCI SAQ-A compliant — card data never touches React state or our server.
// Accept.js tokenizes directly; only the opaque nonce is stored in context.
'use client'

import React, { useRef, useState, useEffect } from 'react'
import { CreditCard, User, Lock, ShieldCheck, Tag, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'
import { tokenizeCard } from '@/lib/authnet/accept-client'

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

/** Format a raw digit string into groups of 4 */
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

/** Mask card number display: **** **** **** 1234 */
function maskCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  return `**** **** **** ${digits.slice(-4).padStart(4, '*')}`
}

export function Step09Payment() {
  const { bookingData, toggleFirstTimeClient, paymentNonce, setPaymentNonce } = useBooking()
  const { isFirstTimeClient, pricing } = bookingData

  // Uncontrolled refs — card data never enters React state
  const cardHolderRef = useRef<HTMLInputElement>(null)
  const cardNumberRef = useRef<HTMLInputElement>(null)
  const expiryRef = useRef<HTMLInputElement>(null)
  const cvcRef = useRef<HTMLInputElement>(null)

  // Display-only state (not card data)
  const [brandDisplay, setBrandDisplay] = useState('')
  const [cardNumberDisplay, setCardNumberDisplay] = useState('')
  const [isTokenizing, setIsTokenizing] = useState(false)
  const [tokenizeError, setTokenizeError] = useState<string | null>(null)

  // Auth.net config (fetched once)
  const [authConfig, setAuthConfig] = useState<{ apiLoginID: string; clientKey: string } | null>(null)

  useEffect(() => {
    fetch('/api/payment/tokenize-config')
      .then((r) => r.json())
      .then((d) => {
        if (d.apiLoginID && d.clientKey) setAuthConfig(d)
      })
      .catch(() => {/* non-critical — accept-client falls back to env vars */})
  }, [])

  // If user navigates back to step 9, clear the nonce (force re-tokenize)
  useEffect(() => {
    setPaymentNonce(null)
    setTokenizeError(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--color-teal)'
    e.target.style.boxShadow = '0 0 0 4px rgba(23,176,171,0.05)'
  }
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(13,27,46,0.1)'
    e.target.style.boxShadow = 'none'
  }

  const handleCardNumberInput = (e: React.FormEvent<HTMLInputElement>) => {
    const raw = e.currentTarget.value.replace(/\D/g, '')
    const formatted = formatCardNumber(raw)
    e.currentTarget.value = formatted
    setCardNumberDisplay(raw)
    setBrandDisplay(detectBrand(raw))
  }

  const handleExpiryInput = (e: React.FormEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.currentTarget.value)
    e.currentTarget.value = formatted
  }

  const handleCvcInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 4)
  }

  const handleConfirmCard = async () => {
    const cardNumber = cardNumberRef.current?.value.replace(/\s/g, '') ?? ''
    const expiryVal = expiryRef.current?.value ?? ''
    const cvc = cvcRef.current?.value ?? ''
    const cardName = cardHolderRef.current?.value.trim() ?? ''

    // Basic client-side validation before calling Accept.js
    if (!cardName) { setTokenizeError('Cardholder name is required.'); return }
    if (cardNumber.length < 13) { setTokenizeError('Please enter a valid card number.'); return }
    const expiryMatch = expiryVal.match(/^(\d{2})\/(\d{2})$/)
    if (!expiryMatch) { setTokenizeError('Please enter expiry as MM/YY.'); return }
    if (!cvc || cvc.length < 3) { setTokenizeError('Please enter your CVV.'); return }

    setIsTokenizing(true)
    setTokenizeError(null)

    const [month, year] = [expiryMatch[1]!, `20${expiryMatch[2]!}`]

    try {
      const nonce = await tokenizeCard(
        { cardNumber, month, year, cardCode: cvc, cardName },
        authConfig ?? undefined,
      )
      setPaymentNonce(nonce)
    } catch (err) {
      setTokenizeError(err instanceof Error ? err.message : 'Card verification failed. Please check your details.')
    } finally {
      setIsTokenizing(false)
    }
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

      {/* ── Card confirmed state ───────────────────────────── */}
      {paymentNonce ? (
        <div style={{ padding: '24px', border: '1px solid rgba(23,176,171,0.3)', background: '#e8f8f7', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <CheckCircle size={20} style={{ color: 'var(--color-teal)', flexShrink: 0 }} />
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-navy-deep)' }}>Card verified</span>
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'rgba(74,90,106,0.75)', margin: '0 0 12px 32px' }}>
            {maskCardNumber(cardNumberDisplay)} — {brandDisplay || 'Card'}<br />
            Card saved securely — you&apos;ll only be charged once your cleaning is completed.
          </p>
          <button
            onClick={() => setPaymentNonce(null)}
            style={{ marginLeft: '32px', background: 'none', border: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--color-teal)', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
          >
            Use a different card
          </button>
        </div>
      ) : (
        <>
          {/* ── Card form (refs — never in React state) ────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

            {/* Cardholder name */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>
                Cardholder Name <span style={{ color: 'var(--color-teal)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none' }} />
                <input
                  ref={cardHolderRef}
                  type="text"
                  onFocus={onFocus}
                  onBlur={onBlur}
                  placeholder="Alexander Pierce"
                  style={inputStyle}
                  autoComplete="cc-name"
                />
              </div>
            </div>

            {/* Card number */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>
                Card Number <span style={{ color: 'var(--color-teal)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <CreditCard size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none' }} />
                <input
                  ref={cardNumberRef}
                  type="text"
                  inputMode="numeric"
                  onInput={handleCardNumberInput}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  style={{ ...inputStyle, letterSpacing: '0.12em', fontFamily: 'var(--font-mono)' }}
                  autoComplete="cc-number"
                />
                {brandDisplay && (
                  <span style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700,
                    color: 'var(--color-teal)', letterSpacing: '0.05em',
                  }}>
                    {brandDisplay.toUpperCase()}
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
                ref={expiryRef}
                type="text"
                inputMode="numeric"
                onInput={handleExpiryInput}
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
                  ref={cvcRef}
                  type="text"
                  inputMode="numeric"
                  onInput={handleCvcInput}
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

          {/* Error state */}
          {tokenizeError && (
            <div style={{ marginTop: '16px', padding: '12px 16px', background: '#fef2f2', border: '1px solid #fca5a5', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#dc2626', margin: 0 }}>{tokenizeError}</p>
            </div>
          )}

          {/* Confirm card button */}
          <button
            onClick={handleConfirmCard}
            disabled={isTokenizing}
            style={{
              marginTop: '20px',
              width: '100%',
              padding: '14px 24px',
              background: isTokenizing ? 'rgba(23,176,171,0.6)' : 'var(--color-teal)',
              color: 'white',
              border: 'none',
              cursor: isTokenizing ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'background 0.2s',
            }}
          >
            {isTokenizing ? (
              <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Verifying...</>
            ) : (
              <><Lock size={14} /> Confirm Payment Method</>
            )}
          </button>
        </>
      )}

      {/* ── Secure note ───────────────────────────────────── */}
      <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'rgba(23,176,171,0.05)', border: '1px solid rgba(23,176,171,0.15)' }}>
        <ShieldCheck size={16} style={{ color: 'var(--color-teal)', flexShrink: 0 }} />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(74,90,106,0.75)', margin: 0, lineHeight: 1.5 }}>
          Card details are tokenized by Authorize.net and never sent to our servers. We never store card numbers.
        </p>
      </div>
    </div>
  )
}
