// src/components/booking/BookingAgreement.tsx
// The submit bar shown at the bottom of the LAST wizard step.
//
// It used to carry an "I have read and agree to the Terms & Conditions and
// Satisfaction Guarantee" checkbox that had to be ticked before Submit enabled.
// Removed 2026-10-18. Things worth knowing about that removal:
//
//  - It was a TERMS acceptance, never an SMS consent. The A2P consent lives on
//    Step 1 (src/components/SmsConsent) and is untouched, so the carrier
//    registration is not affected.
//  - The Terms and Privacy links the A2P checklist requires on the form page sit
//    in that same Step 1 block, so they are still on the page.
//  - Nothing was lost on the record side: the tick was only ever a client-side
//    gate. `termsAccepted` was never sent in the submit body or stored, so there
//    is no acceptance evidence that stopped being collected.
//  - If card payment (a deposit) is ever switched on, revisit this. Refund and
//    cancellation terms are exactly what an explicit acceptance is for.
//
// Kept under this file name so the import in TCBookingForm does not churn.

'use client'

import React from 'react'
import { ShieldCheck } from 'lucide-react'

interface BookingAgreementProps {
  onSubmit: () => void
  isSubmitting?: boolean
}

export function BookingAgreement({ onSubmit, isSubmitting = false }: BookingAgreementProps) {
  const canSubmit = !isSubmitting

  return (
    <div style={{ marginTop: '36px', borderTop: '1px solid rgba(13,27,46,0.08)', paddingTop: '28px' }}>

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
