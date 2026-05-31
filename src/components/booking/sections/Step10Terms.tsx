// src/components/booking/sections/Step10Terms.tsx
'use client'

import React, { useState } from 'react'
import { CheckSquare, Square, ShieldCheck, RefreshCcw, AlertCircle } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'

interface Step10TermsProps {
  onSubmit: () => void
  isSubmitting?: boolean
}

// Geraldine's PDF slides 19 + 20 — replaces the old 3-card layout
// (Cancellation Policy / Re-clean Guarantee / Our Commitment).
const POLICIES = [
  {
    icon: AlertCircle,
    color: '#fc8181',
    title: 'Terms & Conditions',
    points: [
      'The service will be charged in full if it is not cancelled prior to the completion of the cleaning service.',
      'Prices are subject to change based on the condition, size, and level of cleanliness of the property.',
      'Cleaners reserve the right to decline or stop services if the property presents any health, safety, or hazardous risks.',
      'Top Cleaning is not responsible for any damage to items that are improperly installed, unsecured, or were already damaged prior to the service.',
      'By booking our services, the client agrees to all terms and conditions listed above.',
    ],
  },
  {
    icon: RefreshCcw,
    color: 'var(--color-teal)',
    title: 'Satisfaction Guarantee',
    points: [
      'At Top Cleaning, your satisfaction is our priority. If you are not completely satisfied with your cleaning service due to missed areas, we will gladly return to re-clean them. Please send photos of the missed areas to topcleaningservicefl@gmail.com within 24 hours of your cleaning appointment so we can resolve the issue promptly.',
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
          I have read and agree to the Terms &amp; Conditions and Satisfaction Guarantee outlined above.
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
