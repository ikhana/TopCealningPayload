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
          ? <CheckSquare size={20} style={{ color: '#17b0ab', flexShrink: 0, marginTop: '1px' }} />
          : <Square size={20} style={{ color: 'rgba(13,27,46,0.25)', flexShrink: 0, marginTop: '1px' }} />
        }
        <p style={{ fontSize: '0.88rem', color: 'rgba(74,90,106,0.85)', margin: 0, lineHeight: 1.6 }}>
          I have read and agree to the{' '}
          <Link
            href="/terms"
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            style={{ color: '#17b0ab', fontWeight: 600, textDecoration: 'underline' }}
          >
            Terms &amp; Conditions and Satisfaction Guarantee
          </Link>.
        </p>
      </div>

      {/* Trust line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '11px 15px', background: 'rgba(23,176,171,0.05)', border: '1px solid rgba(23,176,171,0.15)', marginBottom: '24px' }}>
        <ShieldCheck size={15} style={{ color: '#17b0ab', flexShrink: 0 }} />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(74,90,106,0.7)', margin: 0, lineHeight: 1.5 }}>
          Fully insured team · This is a request — we&apos;ll confirm pricing before your appointment
        </p>
      </div>

      {/* Submit — hover handled in CSS (imperative style writes desynced from
          React's inline-style diffing and made the button vanish on re-render) */}
      <style>{`
        .tc-agree-submit {
          width: 100%;
          padding: 18px;
          background: #17b0ab;
          color: #ffffff;
          border: none;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          /* No clip-path here: inside the animated .bf-section-in container a
             clipped button fails to repaint when :disabled flips, so it looked
             like the button vanished until you hovered it. */
          position: relative;
          z-index: 1;
          transition: background-color 0.35s cubic-bezier(0.25,1,0.5,1);
        }
        .tc-agree-submit:hover:not(:disabled) { background: #0d1b2e; }
        .tc-agree-submit:disabled {
          background: #b9e3e1;
          color: #ffffff;
          cursor: not-allowed;
        }
      `}</style>
      <button
        type="button"
        className="tc-agree-submit"
        onClick={() => { if (canSubmit) onSubmit() }}
        disabled={!canSubmit}
      >
        {isSubmitting ? 'Submitting…' : 'Submit Request'}
      </button>
    </div>
  )
}
