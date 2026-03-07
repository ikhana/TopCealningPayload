// src/components/booking/sections/Step10Terms.tsx
'use client'

import React, { useState } from 'react'
import { CheckSquare, Square, ShieldCheck, RefreshCcw, AlertCircle, Sparkles } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'

interface Step10TermsProps {
  onSubmit: () => void
  isSubmitting?: boolean
}

const POLICIES = [
  {
    icon: AlertCircle,
    color: '#fc8181',
    title: 'Cancellation Policy',
    points: [
      'Cancel or reschedule at least 24 hours before your appointment at no charge.',
      'Cancellations within 24 hours are subject to a 50% service fee.',
      'Same-day no-shows are charged in full.',
    ],
  },
  {
    icon: RefreshCcw,
    color: 'var(--color-teal)',
    title: 'Re-clean Guarantee',
    points: [
      'Not satisfied? Contact us within 24 hours and we will return to fix it — free of charge.',
      'Applies to the same surfaces cleaned during the original visit.',
      'Up to one re-clean per booking.',
    ],
  },
  {
    icon: Sparkles,
    color: 'var(--color-navy-deep)',
    title: 'Our Commitment',
    points: [
      'Fully insured, background-checked cleaning professionals.',
      'Eco-friendly, pet- and child-safe products on every visit.',
      'Pricing is fixed — no hidden charges after booking.',
    ],
  },
]

export function Step10Terms({ onSubmit, isSubmitting = false }: Step10TermsProps) {
  const { bookingData } = useBooking()
  const { pricing, isFirstTimeClient } = bookingData
  const [accepted, setAccepted] = useState(false)

  // pricing.total already has all discounts (first-time or recurring) applied via context
  const finalTotal = pricing.total.toFixed(2)

  return (
    <div>
      <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', fontWeight: 900, letterSpacing: '-1.5px', color: 'var(--color-navy-deep)', marginBottom: '8px' }}>
        Review & Confirm.
      </h2>
      <p style={{ fontSize: '0.9rem', color: 'rgba(74,90,106,0.7)', marginBottom: '36px', lineHeight: 1.6 }}>
        Please read our policies before confirming your booking.
      </p>

      {/* ── Policies ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '36px' }}>
        {POLICIES.map(({ icon: Icon, color, title, points }) => (
          <div
            key={title}
            style={{
              border: '1px solid rgba(13,27,46,0.07)',
              padding: '20px 22px',
              background: 'white',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Icon size={16} style={{ color, flexShrink: 0 }} />
              <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--color-navy-deep)' }}>{title}</span>
            </div>
            <ul style={{ margin: 0, padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {points.map((p) => (
                <li key={p} style={{ fontSize: '0.82rem', color: 'rgba(74,90,106,0.78)', lineHeight: 1.55 }}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── SSL assurance ─────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'rgba(23,176,171,0.05)', border: '1px solid rgba(23,176,171,0.15)', marginBottom: '28px' }}>
        <ShieldCheck size={15} style={{ color: 'var(--color-teal)', flexShrink: 0 }} />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(74,90,106,0.7)', margin: 0, lineHeight: 1.5 }}>
          SSL encrypted · Fully insured team · No card stored on our servers
        </p>
      </div>

      {/* ── Acceptance checkbox ───────────────────────────────── */}
      <div
        onClick={() => setAccepted((v) => !v)}
        style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', marginBottom: '32px', userSelect: 'none' }}
      >
        {accepted
          ? <CheckSquare size={20} style={{ color: 'var(--color-teal)', flexShrink: 0, marginTop: '1px' }} />
          : <Square size={20} style={{ color: 'rgba(13,27,46,0.25)', flexShrink: 0, marginTop: '1px' }} />
        }
        <p style={{ fontSize: '0.85rem', color: 'rgba(74,90,106,0.8)', margin: 0, lineHeight: 1.6 }}>
          I have read and agree to the cancellation policy, re-clean guarantee, and service terms outlined above.
          I understand that my booking will be confirmed after payment is processed.
        </p>
      </div>

      {/* ── Submit button ─────────────────────────────────────── */}
      <button
        onClick={() => { if (accepted && !isSubmitting) onSubmit() }}
        disabled={!accepted || isSubmitting}
        style={{
          width: '100%',
          padding: '18px 36px',
          background: accepted ? 'var(--color-navy-deep)' : 'rgba(13,27,46,0.15)',
          color: accepted ? 'white' : 'rgba(13,27,46,0.3)',
          border: 'none',
          cursor: accepted && !isSubmitting ? 'pointer' : 'not-allowed',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          transition: 'all 0.35s cubic-bezier(0.25,1,0.5,1)',
          clipPath: 'polygon(0 0, 100% 0, 96% 100%, 0% 100%)',
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          if (accepted && !isSubmitting) {
            const btn = e.currentTarget as HTMLButtonElement
            btn.style.background = 'var(--color-teal)'
            btn.style.color = 'var(--color-navy-deep)'
            btn.style.clipPath = 'polygon(0 0, 96% 0, 100% 100%, 0% 100%)'
          }
        }}
        onMouseLeave={(e) => {
          if (accepted && !isSubmitting) {
            const btn = e.currentTarget as HTMLButtonElement
            btn.style.background = 'var(--color-navy-deep)'
            btn.style.color = 'white'
            btn.style.clipPath = 'polygon(0 0, 100% 0, 96% 100%, 0% 100%)'
          }
        }}
      >
        {isSubmitting
          ? 'Processing…'
          : pricing.total > 0
            ? `Confirm Booking · $${finalTotal}`
            : 'Confirm Booking'}
      </button>

      {!accepted && (
        <p style={{ textAlign: 'center', marginTop: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'rgba(74,90,106,0.55)' }}>
          Accept the terms above to enable booking
        </p>
      )}
    </div>
  )
}
