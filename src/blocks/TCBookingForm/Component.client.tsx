// src/blocks/TCBookingForm/Component.client.tsx
// 3-column booking wizard: left step rail | center form | right summary
// Design: design/form.html — no background grid, compact fields
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { AlertCircle, Info } from 'lucide-react'
import { TCButton } from '@/components/ui/TCButton'
import { BookingProvider } from '@/components/booking/BookingContext'
import { BookingSummary } from '@/components/booking/BookingSummary'
import { useBooking } from '@/components/booking/BookingContext'
import { generateIdempotencyKeyClient } from '@/lib/booking/idempotency'
import { validateStep } from '@/lib/booking/step-validation'
import { useDraftSync } from '@/hooks/useDraftSync'
import type { ServiceCategory } from '@/types/booking'
import { Step01Customer } from '@/components/booking/sections/Step01Customer'
import { Step02Service } from '@/components/booking/sections/Step02Service'
import { Step03Property } from '@/components/booking/sections/Step03Property'
import { Step04AddOns } from '@/components/booking/sections/Step04AddOns'
import { Step05Frequency } from '@/components/booking/sections/Step05Frequency'
import { Step06Schedule } from '@/components/booking/sections/Step06Schedule'
import { Step07Access } from '@/components/booking/sections/Step07Access'
import { Step09Payment } from '@/components/booking/sections/Step09Payment'
import { BookingAgreement } from '@/components/booking/BookingAgreement'

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
  const isLastStep = currentStep === totalSteps

  return (
    <div className="bf-mobile-bar">
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

        {/* Step indicator (replaces the price/estimate readout) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(74,90,106,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Step {currentStep} of {totalSteps}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-navy-deep)' }}>
            {stepLabel}
          </span>
        </div>

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
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
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
  { num: '01', label: 'Contact', desc: 'Your information' },
  { num: '02', label: 'Service', desc: 'Select your service' },
  { num: '03', label: 'Specs', desc: 'Customize details' },
  { num: '04', label: 'Add-ons', desc: 'Enhance your clean' },
  { num: '05', label: 'Frequency', desc: 'Choose a schedule' },
  { num: '06', label: 'Schedule', desc: 'Pick your date' },
  { num: '07', label: 'Access', desc: 'Property access' },
  // Address (was '08') merged into Step 1 (Contact & Address).
  { num: '09', label: 'Payment', desc: 'Secure checkout' },
  // Terms (was '10') is no longer its own step — the last step shows an
  // "I agree" checkbox linking to /terms (less funnel friction).
]

// Per-service step flows — which real step numbers each service includes.
// Services not listed here use the full default flow. Step 02 (Service) is the
// selector, so the flow resolves the moment a service is chosen.
const SERVICE_STEP_NUMS: Partial<Record<ServiceCategory, string[]>> = {
  // Handyman: Contact, Service, Details (handyman questions + mandatory
  // photos), Schedule (preferred date), Access (pets/children/access).
  // No add-ons or frequency.
  handyman: ['01', '02', '03', '06', '07'],
}

// Builds the visible step list for a service, applying the payment-flag filter.
function buildSteps(serviceType: ServiceCategory | '') {
  const allowed = SERVICE_STEP_NUMS[serviceType as ServiceCategory]
  let steps = allowed ? ALL_STEPS.filter((s) => allowed.includes(s.num)) : ALL_STEPS
  if (!PAYMENT_ENABLED) steps = steps.filter((s) => s.num !== '09')
  return steps
}

/* ── Success screen shown after booking is confirmed ─────── */
function BookingSuccess({
  confirmationCode,
  appointmentTime,
  futureOccurrences,
}: {
  confirmationCode?: string
  appointmentTime?: string
  futureOccurrences?: Array<{ occurrence: number; startTime: string }>
}) {
  const formatDateTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true,
        timeZone: 'America/New_York',
      })
    } catch { return iso }
  }
  const formatShort = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true,
        timeZone: 'America/New_York',
      })
    } catch { return iso }
  }

  const hasFutureOccurrences = futureOccurrences && futureOccurrences.length > 0

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
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'rgba(74,90,106,0.6)', marginBottom: hasFutureOccurrences ? '24px' : '16px' }}>
          {hasFutureOccurrences ? `Your first cleaning: ${formatDateTime(appointmentTime)}` : formatDateTime(appointmentTime)}
        </p>
      )}

      {hasFutureOccurrences && (
        <div style={{ border: '1px solid rgba(13,27,46,0.08)', background: '#fafbfc', padding: '20px 28px', marginBottom: '28px', maxWidth: '460px', width: '100%' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-teal)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>
            Your upcoming cleanings
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
            {futureOccurrences.map((occ) => (
              <li key={occ.occurrence} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', fontSize: '0.92rem', color: 'rgba(13,27,46,0.85)', borderBottom: '1px solid rgba(13,27,46,0.05)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-teal)', flexShrink: 0 }} />
                <span style={{ fontWeight: 600 }}>{formatShort(occ.startTime)}</span>
              </li>
            ))}
          </ul>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(74,90,106,0.55)', margin: '12px 0 0', lineHeight: 1.5, textAlign: 'left' }}>
            Each cleaning can be rescheduled or skipped individually from your account.
          </p>
        </div>
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
    setBookingDataAll,
    mediaFiles,
    clearMediaFiles,
  } = useBooking()

  const [currentStep, setCurrentStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState<string | undefined>()
  const [appointmentTime, setAppointmentTime] = useState<string | undefined>()
  const [futureOccurrences, setFutureOccurrences] = useState<Array<{ occurrence: number; startTime: string }> | undefined>(undefined)
  const [stepError, setStepError] = useState<string | null>(null)
  // Terms acceptance lives here so the mobile bar can gate submit too.
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Step list is service-driven (e.g. Handyman shows fewer steps). serviceType
  // only changes on Step 2, so currentStep stays valid; the clamp below is a guard.
  const STEPS = useMemo(() => buildSteps(bookingData.serviceType), [bookingData.serviceType])
  const TOTAL_STEPS = STEPS.length
  const STEP_NUM_AT = (wizardStep: number) => parseInt(STEPS[wizardStep - 1]?.num ?? '0', 10)
  useEffect(() => {
    setCurrentStep((s) => Math.min(s, TOTAL_STEPS))
  }, [TOTAL_STEPS])

  const { forceSaveDraft, clearDraft, hydrateFromResume, getToken } = useDraftSync(bookingData, currentStep)

  // Resume hydration — runs once on mount. If the page was opened with
  // ?resume=<token>, fetch the draft and rehydrate wizard state + step.
  useEffect(() => {
    let cancelled = false
    hydrateFromResume().then((draft) => {
      if (cancelled || !draft) return
      setBookingDataAll(draft.wizardState)
      setCurrentStep(Math.max(1, Math.min(draft.stepReached, TOTAL_STEPS)))
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      mediaCount: mediaFiles.length, // handyman requires ≥1 photo on Step 3
    })
    if (!result.valid) {
      setStepError(`Please fill in: ${result.missingField}`)
      // Scroll to top so the error banner is visible
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const nextStep = Math.min(currentStep + 1, TOTAL_STEPS)

    if (currentStep === 1) {
      const { customer, smsConsent } = bookingData
      // Save the draft FIRST so the row exists in the DB before lead-capture
      // builds the resume URL referencing this token. The lead-capture call
      // populates the GHL contact's cart_resume_url custom field which powers
      // abandoned-booking recovery emails.
      forceSaveDraft(nextStep)
      fetch('/api/ghl/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: customer.firstName,
          email: customer.email,
          phone: customer.phone,
          countryCode: customer.countryCode,
          draftToken: getToken(),
          // A2P: consent travels with the very first CRM write, so an abandoned
          // lead still has an auditable record of what they agreed to.
          smsConsent,
        }),
      }).catch(() => {})
    } else {
      forceSaveDraft(nextStep)
    }

    setCurrentStep(nextStep)
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
    if (!termsAccepted) {
      setSubmissionError('Please accept the Terms & Conditions to submit your request.')
      return
    }
    if (PAYMENT_ENABLED && !paymentNonce) {
      setSubmissionError('Payment not confirmed. Please go back and verify your card.')
      return
    }

    setIsSubmitting(true)
    setSubmissionError(null)

    try {
      const res = await fetch('/api/bookings/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idempotencyKey: idempotencyKey ?? generateIdempotencyKeyClient(),
          formData: bookingData,
          paymentNonce: PAYMENT_ENABLED ? paymentNonce : { dataDescriptor: 'PAYMENT_DISABLED', dataValue: 'PAYMENT_DISABLED' },
          draftToken: getToken() || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setSubmissionError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      // Upload service photos (if any) to the GHL contact. Best-effort —
      // a failure here must never block a completed booking, so we swallow
      // errors and still show the success screen.
      if (mediaFiles.length > 0 && data.bookingId && data.confirmationCode) {
        try {
          const fd = new FormData()
          fd.append('confirmationCode', data.confirmationCode)
          mediaFiles.forEach((file) => fd.append('files', file))
          await fetch(`/api/bookings/${data.bookingId}/media`, { method: 'POST', body: fd })
        } catch {
          /* non-blocking — booking is already complete */
        }
        clearMediaFiles()
      }

      setConfirmationCode(data.confirmationCode)
      setAppointmentTime(data.appointmentTime)
      setFutureOccurrences(data.futureOccurrences)
      setSubmitted(true)
      clearDraft()
    } catch {
      setSubmissionError('Network error — please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return <BookingSuccess confirmationCode={confirmationCode} appointmentTime={appointmentTime} futureOccurrences={futureOccurrences} />
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
        /* Request-only disclaimer in the form — desktop hides it (summary shows it) */
        .bf-req-note-mobile {
          display: none;
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
          .bf-req-note-mobile { display: flex; align-items: flex-start; gap: 8px; }
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
                    background: (isDone || isActive)
                      ? 'var(--color-navy-deep)'
                      : 'white',
                    // White number on navy for active + done (matches the design);
                    // upcoming steps are muted on white.
                    color: (isDone || isActive)
                      ? 'white'
                      : 'rgba(74,90,106,0.6)',
                    boxShadow: isActive ? '0 0 14px rgba(23,176,171,0.3)' : 'none',
                  }}
                >
                  {isDone ? '✓' : String(stepNum).padStart(2, '0')}
                </div>

                {/* Step label + sub-label */}
                <div className="bf-step-label">
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      color: isActive ? 'var(--color-navy-deep)' : isDone ? 'rgba(13,27,46,0.5)' : 'rgba(74,90,106,0.55)',
                      transition: 'color 0.3s',
                    }}
                  >
                    {step.label}
                  </div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: 'rgba(74,90,106,0.55)',
                      marginTop: '3px',
                      lineHeight: 1.3,
                    }}
                  >
                    {step.desc}
                  </div>
                </div>
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

          {/* Request-only disclaimer — mobile only; desktop shows it in the summary panel */}
          <div className="bf-req-note-mobile" style={{
            marginBottom: '20px',
            padding: '12px 16px',
            background: 'rgba(23,176,171,0.06)',
            borderLeft: '4px solid var(--color-teal)',
          }}>
            <Info size={15} style={{ color: 'var(--color-teal)', flexShrink: 0, marginTop: '1px' }} />
            <p style={{ fontSize: '0.8rem', color: 'var(--color-navy-deep)', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
              This is a request form only. Final pricing will be provided after reviewing your information.
            </p>
          </div>

          {/* Animated section */}
          <div key={currentStep} className="bf-section-in">
            {STEP_NUM_AT(currentStep) === 1  && <Step01Customer />}
            {STEP_NUM_AT(currentStep) === 2  && <Step02Service />}
            {STEP_NUM_AT(currentStep) === 3  && <Step03Property />}
            {STEP_NUM_AT(currentStep) === 4  && <Step04AddOns />}
            {STEP_NUM_AT(currentStep) === 5  && <Step05Frequency />}
            {STEP_NUM_AT(currentStep) === 6  && <Step06Schedule />}
            {STEP_NUM_AT(currentStep) === 7  && <Step07Access />}
            {STEP_NUM_AT(currentStep) === 9  && PAYMENT_ENABLED && <Step09Payment />}
          </div>

          {/* Final step — agreement checkbox + submit (Terms is no longer its own
              step). Deliberately OUTSIDE .bf-section-in: that container keeps a
              persisted transform from its `forwards` animation, which created a
              stacking context that stopped the button repainting when its
              disabled state flipped. */}
          {currentStep === TOTAL_STEPS && (
            <>
              <BookingAgreement
                accepted={termsAccepted}
                onChange={setTermsAccepted}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
              {submissionError && (
                <div style={{ marginTop: '16px', padding: '14px 16px', background: '#fef2f2', border: '1px solid #fca5a5', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#dc2626', margin: 0 }}>{submissionError}</p>
                </div>
              )}
            </>
          )}

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
          <BookingSummary />
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
