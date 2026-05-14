// src/blocks/TCBookingForm/Component.client.tsx
// 3-column booking wizard: left step rail | center form | right summary
// Design: design/form.html — no background grid, compact fields
'use client'

import React, { useState, useEffect } from 'react'
import { ChevronUp, ShieldCheck, AlertCircle } from 'lucide-react'
import { TCButton } from '@/components/ui/TCButton'
import { BookingProvider } from '@/components/booking/BookingContext'
import { BookingSummary } from '@/components/booking/BookingSummary'
import { useBooking } from '@/components/booking/BookingContext'
import { generateIdempotencyKeyClient } from '@/lib/booking/idempotency'
import { validateStep } from '@/lib/booking/step-validation'
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

const fmt = (n: number) => `$${n.toFixed(2)}`

/* ── Mobile sticky bottom bar ───────────────────────────────── */
function MobileBottomBar({
  currentStep,
  totalSteps,
  stepLabel,
  onContinue,
  onBack,
  onSubmit,
  isSubmitting,
}: {
  currentStep: number
  totalSteps: number
  stepLabel: string
  onContinue: () => void
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const { bookingData } = useBooking()
  const { pricing, property } = bookingData
  const hasPrice = property.squareFootage > 0
  const isLastStep = currentStep === totalSteps

  return (
    <div className="bf-mobile-bar">
      {/* Expandable summary sheet */}
      {expanded && (
        <div style={{
          padding: '24px 20px 0',
          borderBottom: '1px solid rgba(13,27,46,0.08)',
          background: 'white',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {[
              ['Base Service', hasPrice ? fmt(pricing.basePrice) : '—'],
              ['Add-ons', pricing.extrasTotal > 0 ? `+${fmt(pricing.extrasTotal)}` : '$0.00'],
              ['Discount', pricing.discount > 0 ? `-${fmt(pricing.discount)}` : '-$0.00'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'rgba(74,90,106,0.7)' }}>{label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>
          <p style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.65rem', color: 'rgba(74,90,106,0.5)', marginBottom: '16px' }}>
            <ShieldCheck size={11} style={{ color: 'var(--color-teal)', flexShrink: 0 }} />
            256-bit SSL encrypted · Secure payment
          </p>
        </div>
      )}

      {/* Main bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        background: 'white',
        gap: '12px',
      }}>
        {/* Back */}
        {currentStep > 1 && (
          <button
            onClick={onBack}
            style={{
              padding: '13px 18px',
              border: '1px solid rgba(13,27,46,0.12)',
              background: 'transparent',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '1px',
              cursor: 'pointer',
              color: 'rgba(74,90,106,0.7)',
              flexShrink: 0,
            }}
          >
            ← Back
          </button>
        )}

        {/* Price tap target */}
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            flex: 1,
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(74,90,106,0.5)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Estimate <ChevronUp size={11} style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }} />
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-teal)' }}>
            {hasPrice ? fmt(pricing.total) : '$0.00'}
          </span>
        </button>

        {/* Action button */}
        {isLastStep ? (
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            style={{
              padding: '14px 24px',
              background: isSubmitting ? 'rgba(23,176,171,0.5)' : 'var(--color-teal)',
              color: 'white',
              border: 'none',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              flexShrink: 0,
            }}
          >
            {isSubmitting ? 'Booking...' : 'Confirm Booking'}
          </button>
        ) : (
          <button
            onClick={onContinue}
            style={{
              padding: '14px 24px',
              background: 'var(--color-navy-deep)',
              color: 'white',
              border: 'none',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Feature flag — flip to true when payment credentials are ready ── */
const PAYMENT_ENABLED = process.env.NEXT_PUBLIC_PAYMENT_ENABLED === 'true'

/* ── Step metadata ─────────────────────────────────────────── */
const ALL_STEPS = [
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

const STEPS = PAYMENT_ENABLED ? ALL_STEPS : ALL_STEPS.filter((s) => s.num !== '09')
const TOTAL_STEPS = STEPS.length

// Maps wizard step index (1-based) to the real step number (for rendering)
const STEP_NUM_AT = (wizardStep: number) => parseInt(STEPS[wizardStep - 1]?.num ?? '0', 10)

/* ── Success screen shown after booking is confirmed ─────── */
function BookingSuccess({ confirmationCode, appointmentTime }: { confirmationCode?: string; appointmentTime?: string }) {
  const formatDateTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true,
      })
    } catch { return iso }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', textAlign: 'center', padding: '60px 8%' }}>
      <div style={{ width: '72px', height: '72px', background: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px', animation: 'bf-in 0.5s ease forwards' }}>
        <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
          <path d="M2 12L12 22L30 2" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-2px', color: 'var(--color-navy-deep)', marginBottom: '16px' }}>
        Booking Confirmed!
      </h2>
      {confirmationCode && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-teal)', letterSpacing: '0.1em', marginBottom: '12px' }}>
          {confirmationCode}
        </div>
      )}
      {appointmentTime && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'rgba(74,90,106,0.6)', marginBottom: '16px' }}>
          {formatDateTime(appointmentTime)}
        </p>
      )}
      <p style={{ fontSize: '1rem', color: 'rgba(74,90,106,0.75)', maxWidth: '420px', lineHeight: 1.7, marginBottom: '36px' }}>
        Thank you — we&apos;ve received your booking. A confirmation text/email will arrive shortly. View your booking anytime in{' '}
        <a href="/account/bookings" style={{ color: 'var(--color-teal)' }}>My Bookings</a>.
      </p>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(74,90,106,0.5)', letterSpacing: '0.08em', border: '1px solid rgba(13,27,46,0.08)', padding: '12px 24px' }}>
        TOPCLEANING · EST. 2019
      </div>
    </div>
  )
}

/* ── Inner form — has access to BookingContext ───────────── */
function BookingFormInner() {
  const {
    bookingData,
    paymentNonce,
    isSubmitting,
    setIsSubmitting,
    submissionError,
    setSubmissionError,
    idempotencyKey,
    setIdempotencyKey,
  } = useBooking()

  const [currentStep, setCurrentStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState<string | undefined>()
  const [appointmentTime, setAppointmentTime] = useState<string | undefined>()
  const [stepError, setStepError] = useState<string | null>(null)

  // Clear the step error when the user changes step or starts editing
  useEffect(() => {
    setStepError(null)
  }, [currentStep, bookingData])

  const goNext = () => {
    // Validate the current REAL step (handles Step 9 being filtered when payment disabled)
    const realStepNum = STEP_NUM_AT(currentStep)
    const result = validateStep(realStepNum, bookingData, {
      paymentEnabled: PAYMENT_ENABLED,
      paymentNonceSet: !!paymentNonce,
      termsAccepted: true, // Step 10 self-gates via its own button — never blocks goNext
    })
    if (!result.valid) {
      setStepError(`Please fill in: ${result.missingField}`)
      // Scroll to top so the error banner is visible
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (currentStep === 1) {
      const { customer } = bookingData
      fetch('/api/ghl/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: customer.firstName,
          email: customer.email,
          phone: customer.phone,
          countryCode: customer.countryCode,
        }),
      }).catch(() => {})
    }
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1))

  const jumpTo = (step: number) => {
    if (step < currentStep) setCurrentStep(step)
  }

  // Generate idempotency key when user reaches the Terms step (last step)
  useEffect(() => {
    if (currentStep === TOTAL_STEPS && !idempotencyKey) {
      setIdempotencyKey(generateIdempotencyKeyClient())
    }
  }, [currentStep, idempotencyKey, setIdempotencyKey])

  const handleSubmit = async () => {
    if (PAYMENT_ENABLED && !paymentNonce) {
      setSubmissionError('Payment not confirmed. Please go back and verify your card.')
      return
    }

    setIsSubmitting(true)
    setSubmissionError(null)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idempotencyKey: idempotencyKey ?? generateIdempotencyKeyClient(),
          formData: bookingData,
          paymentNonce: PAYMENT_ENABLED ? paymentNonce : { dataDescriptor: 'PAYMENT_DISABLED', dataValue: 'PAYMENT_DISABLED' },
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setSubmissionError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      setConfirmationCode(data.confirmationCode)
      setAppointmentTime(data.appointmentTime)
      setSubmitted(true)
    } catch {
      setSubmissionError('Network error — please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return <BookingSuccess confirmationCode={confirmationCode} appointmentTime={appointmentTime} />
  }

  return (
    <>
      {/* Block-scoped styles */}
      <style>{`
        @keyframes bf-in {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bf-section-in {
          animation: bf-in 0.5s cubic-bezier(0.2, 1, 0.3, 1) forwards;
        }
        .bf-step-clickable:hover .bf-step-label { color: var(--color-navy-deep) !important; }

        /* Mobile bar — hidden on desktop */
        .bf-mobile-bar {
          display: none;
        }
        .bf-mobile-progress {
          display: none;
        }
        .bf-desktop-nav {
          display: flex;
        }

        /* ── Responsive ── */
        @media (max-width: 1200px) {
          .bf-wrapper { grid-template-columns: 72px 1fr 320px !important; }
          .bf-step-label { display: none !important; }
          .bf-left-rail { padding: 50px 16px !important; }
        }
        @media (max-width: 992px) {
          .bf-wrapper { grid-template-columns: 1fr !important; }
          .bf-left-rail { display: none !important; }
          .bf-center { border-right: none !important; padding-bottom: 100px !important; }
          .bf-right { display: none !important; }
          .bf-mobile-bar {
            display: block;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 100;
            box-shadow: 0 -4px 24px rgba(13,27,46,0.10);
            border-top: 1px solid rgba(13,27,46,0.08);
            background: white;
          }
          .bf-mobile-progress {
            display: block;
          }
          .bf-desktop-nav {
            display: none !important;
          }
        }
        @media (max-width: 600px) {
          .bf-center { padding: 28px 5% 100px !important; }
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
          {/* ── Mobile-only progress indicator ── */}
          <div className="bf-mobile-progress" style={{ marginBottom: '32px' }}>
            {/* Progress bar */}
            <div style={{ height: '2px', background: 'rgba(13,27,46,0.07)', marginBottom: '12px' }}>
              <div style={{
                height: '100%',
                width: `${(currentStep / TOTAL_STEPS) * 100}%`,
                background: 'var(--color-teal)',
                transition: 'width 0.4s cubic-bezier(0.25,1,0.5,1)',
              }} />
            </div>
            {/* Step label */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-teal)', fontWeight: 700 }}>
                {STEPS[currentStep - 1]?.label}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(74,90,106,0.45)', letterSpacing: '1px' }}>
                {currentStep} / {TOTAL_STEPS}
              </span>
            </div>
          </div>

          {/* Inline step validation error */}
          {stepError && (
            <div
              role="alert"
              style={{
                marginBottom: '20px',
                padding: '12px 16px',
                background: '#fef2f2',
                border: '1px solid #fca5a5',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                animation: 'bf-in 0.3s ease-out forwards',
              }}
            >
              <AlertCircle size={16} style={{ color: '#dc2626', flexShrink: 0 }} />
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#dc2626', margin: 0, fontWeight: 600 }}>
                {stepError}
              </p>
            </div>
          )}

          {/* Animated section */}
          <div key={currentStep} className="bf-section-in">
            {STEP_NUM_AT(currentStep) === 1  && <Step01Customer />}
            {STEP_NUM_AT(currentStep) === 2  && <Step02Service />}
            {STEP_NUM_AT(currentStep) === 3  && <Step03Property />}
            {STEP_NUM_AT(currentStep) === 4  && <Step04AddOns />}
            {STEP_NUM_AT(currentStep) === 5  && <Step05Frequency />}
            {STEP_NUM_AT(currentStep) === 6  && <Step06Schedule />}
            {STEP_NUM_AT(currentStep) === 7  && <Step07Access />}
            {STEP_NUM_AT(currentStep) === 8  && <Step08Address />}
            {STEP_NUM_AT(currentStep) === 9  && PAYMENT_ENABLED && <Step09Payment />}
            {STEP_NUM_AT(currentStep) === 10 && (
              <>
                <Step10Terms onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                {submissionError && (
                  <div style={{ marginTop: '16px', padding: '14px 16px', background: '#fef2f2', border: '1px solid #fca5a5', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#dc2626', margin: 0 }}>{submissionError}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Desktop nav buttons ── */}
          {currentStep < TOTAL_STEPS && (
            <div className="bf-desktop-nav" style={{ marginTop: '60px', justifyContent: 'space-between', alignItems: 'center' }}>
              <TCButton
                variant="ghost"
                onClick={goBack}
                disabled={currentStep === 1}
                className={currentStep === 1 ? 'opacity-30 pointer-events-none' : ''}
              >
                Back
              </TCButton>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(74,90,106,0.45)', letterSpacing: '1px' }}>
                {currentStep} / {TOTAL_STEPS}
              </div>
              <TCButton variant="primary" onClick={goNext}>
                Continue
              </TCButton>
            </div>
          )}
          {currentStep === TOTAL_STEPS && (
            <div className="bf-desktop-nav" style={{ marginTop: '28px' }}>
              <TCButton variant="ghost" onClick={goBack}>← Back</TCButton>
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

      {/* ── Mobile sticky bottom bar (hidden on desktop via CSS) ── */}
      <MobileBottomBar
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        stepLabel={STEPS[currentStep - 1]?.label ?? ''}
        onContinue={goNext}
        onBack={goBack}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

    </>
  )
}

export function TCBookingFormClient() {
  return (
    <BookingProvider>
      <BookingFormInner />
    </BookingProvider>
  )
}
