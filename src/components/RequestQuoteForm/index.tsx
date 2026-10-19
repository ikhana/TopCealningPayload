// src/components/RequestQuoteForm/index.tsx
//
// Short request-only form for Airbnb and Commercial (Geraldine, 2026-10-18). No price, no
// deposit, no property address, every field required, mobile friendly. Posts to the same
// store-first endpoint as the other forms with audience 'quote', so spam screening, the
// bot challenge, SMS consent capture and the GoHighLevel sync are all the existing ones.

'use client'

import React, { useEffect, useRef, useState } from 'react'

import { Honeypot } from '@/components/Honeypot'
import { EMPTY_SMS_CONSENT, SmsConsentFields } from '@/components/SmsConsent'
import {
  COMMERCIAL_FREQUENCIES,
  COMMERCIAL_SPACE_TYPES,
  REQUEST_FORM_BUTTON,
  REQUEST_FORM_SERVICE_LABEL,
  type RequestFormKind,
} from '@/data/requestForms'
import { FILL_MS_FIELD } from '@/lib/leads/constants'

type Props = {
  kind: RequestFormKind
  /** Carried over when the visitor already typed them into the booking wizard. */
  defaults?: { name?: string; email?: string; phone?: string }
}

type FormState = 'idle' | 'sending' | 'sent' | 'error'

const input: React.CSSProperties = {
  width: '100%',
  padding: '12px 0',
  border: 'none',
  borderBottom: '1px solid rgba(13,27,46,0.2)',
  background: 'transparent',
  fontSize: '1rem',
  color: 'var(--color-navy-deep)',
  borderRadius: 0,
  outline: 'none',
}

const label: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.65rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  color: 'rgba(74,90,106,0.8)',
  marginBottom: '2px',
}

function Field({ id, text, children }: { id: string; text: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '22px' }}>
      <label htmlFor={id} style={label}>
        {text}
      </label>
      {children}
    </div>
  )
}

export function RequestQuoteForm({ kind, defaults }: Props) {
  const [state, setState] = useState<FormState>('idle')
  const [smsConsent, setSmsConsent] = useState(EMPTY_SMS_CONSENT)

  // Browser-clock duration for the server's spam screen (see TCContactForm for the reasoning).
  const shownAt = useRef(0)
  useEffect(() => {
    shownAt.current = Date.now()
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formEl = e.currentTarget
    setState('sending')

    const body = new FormData(formEl)
    body.set('audience', 'quote')
    body.set('service', REQUEST_FORM_SERVICE_LABEL[kind])
    body.set(
      'quote_reason',
      kind === 'airbnb' ? 'Airbnb request form (no automatic price)' : 'Commercial request form (no automatic price)',
    )
    body.set('request_form', kind)
    body.set('sms_service_consent', smsConsent.service ? 'yes' : 'no')
    body.set('sms_marketing_consent', smsConsent.marketing ? 'yes' : 'no')
    if (shownAt.current) body.set(FILL_MS_FIELD, String(Date.now() - shownAt.current))

    try {
      const res = await fetch('/api/ghl/form-submit', { method: 'POST', body })
      if (!res.ok) throw new Error(`form-submit responded ${res.status}`)
      setState('sent')
      formEl.reset()
      setSmsConsent(EMPTY_SMS_CONSENT) // a box left ticked would pre-tick the next visitor's form
    } catch (err) {
      console.error('[request-quote-form]', err)
      // No auto-reset: a failed send must stay visible or the request is silently lost.
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <div role="status" style={{ padding: '32px 28px', background: '#e0f5f4', border: '1px solid var(--color-teal)' }}>
        <h3 style={{ margin: '0 0 8px', fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-navy-deep)' }}>
          Request received.
        </h3>
        <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--color-navy-deep)' }}>
          Thank you. Our team will review your details and contact you with a custom quote.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
      <Honeypot />

      <Field id={`rq-${kind}-name`} text="Full Name">
        <input id={`rq-${kind}-name`} name="name" required autoComplete="name" defaultValue={defaults?.name} style={input} />
      </Field>

      {kind === 'commercial' && (
        <Field id="rq-commercial-business" text="Business Name">
          <input id="rq-commercial-business" name="business_name" required autoComplete="organization" style={input} />
        </Field>
      )}

      <Field id={`rq-${kind}-phone`} text="Phone Number">
        <input
          id={`rq-${kind}-phone`}
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          defaultValue={defaults?.phone}
          style={input}
        />
      </Field>

      <Field id={`rq-${kind}-email`} text="Email">
        <input
          id={`rq-${kind}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={defaults?.email}
          style={input}
        />
      </Field>

      {kind === 'airbnb' && (
        <>
          <Field id="rq-airbnb-properties" text="How many properties do you manage?">
            <input id="rq-airbnb-properties" name="properties_managed" type="number" inputMode="numeric" min={1} required style={input} />
          </Field>
          <Field id="rq-airbnb-cleanings" text="Approximately how many cleanings do you need per month?">
            <input id="rq-airbnb-cleanings" name="cleanings_per_month" type="number" inputMode="numeric" min={1} required style={input} />
          </Field>
        </>
      )}

      {kind === 'commercial' && (
        <>
          <Field id="rq-commercial-space" text="What type of space do you need cleaned?">
            <select id="rq-commercial-space" name="space_type" required defaultValue="" style={{ ...input, appearance: 'none' }}>
              <option value="" disabled>
                Select one
              </option>
              {COMMERCIAL_SPACE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field id="rq-commercial-frequency" text="How often do you need cleaning?">
            <select id="rq-commercial-frequency" name="frequency" required defaultValue="" style={{ ...input, appearance: 'none' }}>
              <option value="" disabled>
                Select one
              </option>
              {COMMERCIAL_FREQUENCIES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </>
      )}

      <SmsConsentFields value={smsConsent} onChange={setSmsConsent} />

      {state === 'error' && (
        <p role="alert" style={{ margin: '16px 0 0', color: '#b42318', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Something went wrong sending your request. Please try again, or call us.
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'sending'}
        style={{
          marginTop: '24px',
          width: '100%',
          padding: '16px 24px',
          background: 'var(--color-teal)',
          color: 'white',
          border: 'none',
          fontWeight: 800,
          fontSize: '0.95rem',
          letterSpacing: '0.5px',
          cursor: state === 'sending' ? 'wait' : 'pointer',
          opacity: state === 'sending' ? 0.7 : 1,
        }}
      >
        {state === 'sending' ? 'Sending...' : REQUEST_FORM_BUTTON}
      </button>
    </form>
  )
}
