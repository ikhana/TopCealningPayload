// src/blocks/TCBookingForm/Component.client.tsx
// 3-column booking wizard: left step rail | center form | right summary
// Design: design/form.html — no background grid, compact fields
'use client'

import React, { useState } from 'react'
import { BookingProvider } from '@/components/booking/BookingContext'
import { Step01Customer } from '@/components/booking/sections/Step01Customer'
import { Step02Service } from '@/components/booking/sections/Step02Service'
import { Step03Property } from '@/components/booking/sections/Step03Property'
// Steps 04–10 added in Checkpoints 2 & 3

/* ── Step metadata ─────────────────────────────────────────── */
const STEPS = [
  { num: '01', label: 'Identify' },
  { num: '02', label: 'Service' },
  { num: '03', label: 'Specs' },
  { num: '04', label: 'Add-ons' },
  { num: '05', label: 'Frequency' },
  { num: '06', label: 'Schedule' },
  { num: '07', label: 'Access' },
  { num: '08', label: 'Address' },
  { num: '09', label: 'Payment' },
  { num: '10', label: 'Terms' },
]

const TOTAL_STEPS = STEPS.length

/* ── Nav button styles ─────────────────────────────────────── */
const navBtnBase: React.CSSProperties = {
  padding: '14px 36px',
  fontFamily: 'var(--font-mono)',
  fontWeight: 700,
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  cursor: 'pointer',
  border: '1px solid rgba(13,27,46,0.12)',
  background: 'white',
  transition: 'all 0.35s cubic-bezier(0.25,1,0.5,1)',
  borderRadius: 0,
}

export function TCBookingFormClient() {
  const [currentStep, setCurrentStep] = useState(1)

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS))
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1))
  const jumpTo = (step: number) => {
    if (step < currentStep) setCurrentStep(step)
  }

  const isLastStep = currentStep === TOTAL_STEPS

  return (
    <BookingProvider>
      {/* Block-scoped styles */}
      <style>{`
        @keyframes bf-in {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bf-section-in {
          animation: bf-in 0.5s cubic-bezier(0.2, 1, 0.3, 1) forwards;
        }
        .bf-nav-back:hover  { background: var(--color-navy-deep) !important; color: white !important; border-color: var(--color-navy-deep) !important; }
        .bf-nav-next:hover  { background: var(--color-teal) !important; border-color: var(--color-teal) !important; }
        .bf-step-clickable:hover .bf-step-label { color: var(--color-navy-deep) !important; }

        /* ── Responsive ── */
        @media (max-width: 1200px) {
          .bf-wrapper { grid-template-columns: 72px 1fr 320px !important; }
          .bf-step-label { display: none !important; }
          .bf-left-rail { padding: 50px 16px !important; }
        }
        @media (max-width: 992px) {
          .bf-wrapper { grid-template-columns: 1fr !important; }
          .bf-left-rail { display: none !important; }
          .bf-center { border-right: none !important; }
          .bf-right { position: static !important; height: auto !important; border-top: 1px solid rgba(13,27,46,0.08); }
        }
        @media (max-width: 600px) {
          .bf-center { padding: 40px 6% !important; }
          .bf-input-2col { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── 3-column grid ──────────────────────────────────── */}
      <div
        className="bf-wrapper"
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '280px 1fr 400px',
          minHeight: 'calc(100vh - 80px)',
          background: '#fcfdfd',
        }}
      >

        {/* ══════════════════════════════════════════════════
            LEFT RAIL — Skeletal step navigation
        ══════════════════════════════════════════════════ */}
        <aside
          className="bf-left-rail"
          style={{
            padding: '60px 36px',
            borderRight: '1px solid rgba(13,27,46,0.08)',
            position: 'sticky',
            top: '80px',
            height: 'fit-content',
          }}
        >
          {STEPS.map((step, i) => {
            const stepNum = i + 1
            const isActive = stepNum === currentStep
            const isDone = stepNum < currentStep

            return (
              <div
                key={i}
                className={isDone ? 'bf-step-clickable' : ''}
                onClick={() => isDone && jumpTo(stepNum)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  marginBottom: '36px',
                  position: 'relative',
                  cursor: isDone ? 'pointer' : 'default',
                }}
              >
                {/* Vertical connector line */}
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '11px',
                      top: '26px',
                      bottom: '-32px',
                      width: '1px',
                      background: isDone ? 'var(--color-teal)' : 'rgba(13,27,46,0.08)',
                      transition: 'background 0.4s',
                    }}
                  />
                )}

                {/* Numbered indicator square */}
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    border: `1px solid ${isDone ? 'var(--color-navy-deep)' : isActive ? 'var(--color-teal)' : 'rgba(13,27,46,0.12)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    flexShrink: 0,
                    zIndex: 1,
                    transition: 'all 0.35s',
                    background: isDone
                      ? 'var(--color-navy-deep)'
                      : isActive
                        ? 'var(--color-teal)'
                        : 'white',
                    color: isDone || isActive ? 'white' : 'rgba(74,90,106,0.6)',
                    boxShadow: isActive ? '0 0 14px rgba(23,176,171,0.3)' : 'none',
                  }}
                >
                  {isDone ? '✓' : step.num}
                </div>

                {/* Step label */}
                <span
                  className="bf-step-label"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    fontWeight: 700,
                    lineHeight: '24px',
                    color: isActive ? 'var(--color-navy-deep)' : isDone ? 'rgba(13,27,46,0.5)' : 'rgba(74,90,106,0.55)',
                    transition: 'color 0.3s',
                  }}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </aside>

        {/* ══════════════════════════════════════════════════
            CENTER — Form content
        ══════════════════════════════════════════════════ */}
        <main
          className="bf-center"
          style={{
            padding: '60px 8%',
            borderRight: '1px solid rgba(13,27,46,0.08)',
          }}
        >
          {/* Animated section */}
          <div key={currentStep} className="bf-section-in">
            {currentStep === 1 && <Step01Customer />}
            {currentStep === 2 && <Step02Service />}
            {currentStep === 3 && <Step03Property />}
            {/* Steps 4–10 wired in Checkpoints 2 & 3 */}
            {currentStep > 3 && (
              <div style={{ padding: '60px 0', textAlign: 'center', color: 'rgba(74,90,106,0.5)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                Phase {String(currentStep).padStart(2, '0')} — Coming in next checkpoint
              </div>
            )}
          </div>

          {/* ── Back / Continue buttons ── */}
          <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              className="bf-nav-back"
              onClick={goBack}
              disabled={currentStep === 1}
              style={{
                ...navBtnBase,
                opacity: currentStep === 1 ? 0.3 : 1,
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Back
            </button>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(74,90,106,0.45)', letterSpacing: '1px' }}>
              {currentStep} / {TOTAL_STEPS}
            </div>

            <button
              type="button"
              className="bf-nav-next"
              onClick={goNext}
              style={{
                ...navBtnBase,
                background: 'var(--color-navy-deep)',
                color: 'white',
                borderColor: 'var(--color-navy-deep)',
              }}
            >
              {isLastStep ? 'Review' : 'Continue'}
            </button>
          </div>
        </main>

        {/* ══════════════════════════════════════════════════
            RIGHT — Summary panel (BookingSummary added in Checkpoint 2)
        ══════════════════════════════════════════════════ */}
        <aside
          className="bf-right"
          style={{
            background: '#ffffff',
            padding: '60px 36px',
            position: 'sticky',
            top: '80px',
            height: 'calc(100vh - 80px)',
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid rgba(13,27,46,0.08)',
            overflowY: 'auto',
          }}
        >
          {/* Summary header */}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'rgba(74,90,106,0.6)',
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            Booking Summary
            <div style={{ flex: 1, height: '1px', background: 'rgba(13,27,46,0.08)' }} />
          </div>

          {/* Placeholder rows — BookingSummary component wired in Checkpoint 2 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {['Base Service', 'Add-ons', 'Discount'].map((label) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'rgba(74,90,106,0.7)' }}>{label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: label === 'Discount' ? '#fc8181' : 'inherit' }}>
                  {label === 'Discount' ? '-$0.00' : '$0.00'}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{
            marginTop: 'auto',
            paddingTop: '24px',
            borderTop: '2px solid var(--color-navy-deep)',
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 800,
            fontSize: '1.3rem',
          }}>
            <span>Estimate</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-teal)' }}>$0.00</span>
          </div>

          <p style={{ fontSize: '0.68rem', color: 'rgba(74,90,106,0.55)', marginTop: '16px', lineHeight: 1.6 }}>
            By clicking &ldquo;Book Now&rdquo;, you agree to our terms of service and privacy policy.
            Secure 256-bit SSL encrypted payment.
          </p>

          {/* Book button */}
          <button
            type="button"
            style={{
              width: '100%',
              padding: '18px',
              background: 'var(--color-teal)',
              color: 'white',
              border: 'none',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              marginTop: '20px',
              clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)',
              transition: 'all 0.35s cubic-bezier(0.25,1,0.5,1)',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--color-navy-deep)'
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--color-teal)'
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
            }}
          >
            Book Your Service
          </button>
        </aside>

      </div>
    </BookingProvider>
  )
}
