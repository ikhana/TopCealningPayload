// src/blocks/TCBookingForm/Component.client.tsx
// 3-column booking wizard: left step rail | center form | right summary
// Design: design/form.html — no background grid, compact fields
'use client'

import React, { useState } from 'react'
import { BookingProvider } from '@/components/booking/BookingContext'
import { BookingSummary } from '@/components/booking/BookingSummary'
import { Step01Customer } from '@/components/booking/sections/Step01Customer'
import { Step02Service } from '@/components/booking/sections/Step02Service'
import { Step03Property } from '@/components/booking/sections/Step03Property'
import { Step04AddOns } from '@/components/booking/sections/Step04AddOns'
import { Step05Frequency } from '@/components/booking/sections/Step05Frequency'
import { Step06Schedule } from '@/components/booking/sections/Step06Schedule'
import { Step07Access } from '@/components/booking/sections/Step07Access'
import { Step08Address } from '@/components/booking/sections/Step08Address'
import { Step09Payment } from '@/components/booking/sections/Step09Payment'
import { Step10Terms } from '@/components/booking/sections/Step10Terms'

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

/* ── Success screen shown after booking is confirmed ─────── */
function BookingSuccess() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', textAlign: 'center', padding: '60px 8%' }}>
      {/* Animated checkmark */}
      <div style={{ width: '72px', height: '72px', background: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px', animation: 'bf-in 0.5s ease forwards' }}>
        <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
          <path d="M2 12L12 22L30 2" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-2px', color: 'var(--color-navy-deep)', marginBottom: '16px' }}>
        Booking Confirmed!
      </h2>
      <p style={{ fontSize: '1rem', color: 'rgba(74,90,106,0.75)', maxWidth: '420px', lineHeight: 1.7, marginBottom: '36px' }}>
        Thank you — we&apos;ve received your request. A confirmation email will be on its way shortly. Our team will reach out to finalise the details.
      </p>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(74,90,106,0.5)', letterSpacing: '0.08em', border: '1px solid rgba(13,27,46,0.08)', padding: '12px 24px' }}>
        TOPCLEANING · EST. 2019
      </div>
    </div>
  )
}

export function TCBookingFormClient() {
  const [currentStep, setCurrentStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS))
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1))
  const jumpTo = (step: number) => {
    if (step < currentStep) setCurrentStep(step)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Placeholder: replace with real API call
    await new Promise((r) => setTimeout(r, 1200))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <>
        <style>{`
          @keyframes bf-in {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <BookingSuccess />
      </>
    )
  }

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
            background: '#f5efe0',
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
            {currentStep === 1  && <Step01Customer />}
            {currentStep === 2  && <Step02Service />}
            {currentStep === 3  && <Step03Property />}
            {currentStep === 4  && <Step04AddOns />}
            {currentStep === 5  && <Step05Frequency />}
            {currentStep === 6  && <Step06Schedule />}
            {currentStep === 7  && <Step07Access />}
            {currentStep === 8  && <Step08Address />}
            {currentStep === 9  && <Step09Payment />}
            {currentStep === 10 && <Step10Terms onSubmit={handleSubmit} isSubmitting={isSubmitting} />}
          </div>

          {/* ── Back / Continue buttons — hidden on step 10 (Step10Terms has its own submit) ── */}
          {currentStep < TOTAL_STEPS && (
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
                Continue
              </button>
            </div>
          )}

          {/* On step 10: just show a Back button so the user can return to payment */}
          {currentStep === TOTAL_STEPS && (
            <div style={{ marginTop: '28px' }}>
              <button
                type="button"
                className="bf-nav-back"
                onClick={goBack}
                style={{ ...navBtnBase }}
              >
                ← Back
              </button>
            </div>
          )}
        </main>

        {/* ══════════════════════════════════════════════════
            RIGHT — Live summary panel
        ══════════════════════════════════════════════════ */}
        <aside
          className="bf-right"
          style={{
            background: '#ffffff',
            padding: '60px 36px',
            position: 'sticky',
            top: '80px',
            height: 'calc(100vh - 80px)',
            borderLeft: '1px solid rgba(13,27,46,0.08)',
            overflowY: 'auto',
          }}
        >
          <BookingSummary onBook={goNext} />
        </aside>

      </div>
    </BookingProvider>
  )
}
