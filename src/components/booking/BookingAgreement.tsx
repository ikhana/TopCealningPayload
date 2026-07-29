// src/components/booking/BookingAgreement.tsx
// Compact "I agree" bar shown at the bottom of the LAST wizard step.
// Replaces the old full-page Terms step — the policy text now lives at /terms
// so the funnel doesn't carry a whole page of legal copy (Geraldine, 2026-07).

'use client'

import React from 'react'
import Link from 'next/link'
import { CheckSquare, Square, ShieldCheck } from 'lucide-react'

interface BookingAgreementProps {
  accepted: boolean
  onChange: (v: boolean) => void
  onSubmit: () => void
  isSubmitting?: boolean
}

export function BookingAgreement({ accepted, onChange, onSubmit, isSubmitting = false }: BookingAgreementProps) {
  const canSubmit = accepted && !isSubmitting

  return (
    <div style={{ marginTop: '36px', borderTop: '1px solid rgba(13,27,46,0.08)', paddingTop: '28px' }}>

      {/* Acceptance checkbox */}
      <div
        onClick={() => onChange(!accepted)}
        style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', marginBottom: '20px', userSelect: 'none' }}
      >
        {accepted
          ? <CheckSquare size={20} style={{ color: 'var(--color-teal)', flexShrink: 0, marginTop: '1px' }} />
          : <Square size={20} style={{ color: 'rgba(13,27,46,0.25)', flexShrink: 0, marginTop: '1px' }} />
        }
        <p style={{ fontSize: '0.88rem', color: 'rgba(74,90,106,0.85)', margin: 0, lineHeight: 1.6 }}>
          I have read and agree to the{' '}
          <Link
            href="/terms"
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            style={{ color: 'var(--color-teal)', fontWeight: 600, textDecoration: 'underline' }}
          >
            Terms &amp; Conditions and Satisfaction Guarantee
          </Link>.
        </p>
      </div>

      {/* Trust line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '11px 15px', background: 'rgba(23,176,171,0.05)', border: '1px solid rgba(23,176,171,0.15)', marginBottom: '24px' }}>
        <ShieldCheck size={15} style={{ color: 'var(--color-teal)', flexShrink: 0 }} />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(74,90,106,0.7)', margin: 0, lineHeight: 1.5 }}>
          Fully insured team · This is a request — we&apos;ll confirm pricing before your appointment
        </p>
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={() => { if (canSubmit) onSubmit() }}
        disabled={!canSubmit}
        style={{
          width: '100%',
          padding: '18px',
          background: canSubmit ? 'var(--color-teal)' : 'rgba(23,176,171,0.35)',
          color: 'white',
          border: 'none',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: '0.85rem',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          cursor: canSubmit ? 'pointer' : 'not-allowed',
          clipPath: 'polygon(0 0, 100% 0, 97% 100%, 0% 100%)',
          transition: 'all 0.35s cubic-bezier(0.25,1,0.5,1)',
        }}
        onMouseEnter={(e) => {
          if (canSubmit) (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-navy-deep)'
        }}
        onMouseLeave={(e) => {
          if (canSubmit) (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-teal)'
        }}
      >
        {isSubmitting ? 'Submitting…' : 'Submit Request'}
      </button>
    </div>
  )
}
