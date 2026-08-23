// src/components/SmsConsent/index.tsx
//
// The single source of SMS consent markup for every phone-collecting form on the
// site. Shared rather than copy-pasted on purpose: A2P §6.1 calls out "no stale
// duplicate forms carrying old consent language" as a failure mode, and the only
// reliable way to prevent drift is to have one copy of the words.
//
// See docs/a2p-compliance-handoff.md sections 4.1 and 6.1.
//
// RULES BAKED IN HERE. Do not override them per form:
//
//  - Unticked on load, always. A pre-selected consent box invalidates the record
//    regardless of the label, and is Twilio 30931.
//  - Never `required`. The form must submit with every box declined.
//  - Each label states the MESSAGE TYPE and the BRAND NAME. The type is what
//    separates marketing consent from service consent (30913); HighLevel's DBA
//    guidance wants the brand in the checkbox CTA.
//  - The five disclosures (type, frequency, rates, STOP, HELP) live once in the
//    shared block below the boxes, not repeated inside each label. The rule is
//    about PLACEMENT — "directly adjacent to the consent mechanism, on the same
//    screen, before the user submits" — not repetition.
//  - The shared block must never be removed. Compliance is ongoing; carriers
//    spot-check and complaints trigger re-review.

'use client'

import React from 'react'

export type SmsConsentValue = {
  service: boolean
  marketing: boolean
}

export const EMPTY_SMS_CONSENT: SmsConsentValue = { service: false, marketing: false }

/**
 * Which form this is. Changes the wording so each label names the messages that
 * audience would actually receive, rather than generic "marketing messages".
 */
export type SmsConsentAudience = 'customer' | 'careers'

// Registered trade name plus legal entity.
//
// "Top Cleaning" is deliberate and is NOT a typo for "Top Cleaning Team". The
// IRS record for EIN 39-4300652 lists the legal name as TEAM TOP CLEANING LLC
// with the trade name / DBA as TOP CLEANING. Those are the two names with
// documentary backing, and they are what the A2P brand record declares.
//
// "Top Cleaning Team" is the domain and the marketing name, and it stays in
// headings and page copy. It just does not appear in identity statements, where
// a name a reviewer cannot verify against the tax record is Twilio 30918.
//
// The legal entity is included because HighLevel's compliance check requires the
// registered business name inside the consent text itself, not merely elsewhere
// on the page.
const BRAND = 'Top Cleaning (TEAM TOP CLEANING LLC)'

// The full disclosure set, repeated inside EVERY label.
//
// This reverses an earlier decision, deliberately. The documented rule is about
// PLACEMENT ("clear and conspicuous text directly adjacent to the consent
// mechanism") and not repetition, so a single shared block below both checkboxes
// is defensible — and it reads far better in a booking funnel.
//
// HighLevel's pre-submission compliance checker disagrees. It parses the checkbox
// LABEL as the consent text and nothing else, so a shared block scores:
//   message type ✅ (in the label)   opt-out ❌  frequency ❌  rates ❌
//
// Being right about the standard does not get a campaign approved. SMPL shipped
// full repetition and was approved; this matches that.
//
// If a future reviewer of this file wonders why the labels are so long: they are
// long on purpose. Do not "tidy" them by hoisting the disclosures out again.
const DISCLOSURE =
  ' Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help.'

const COPY: Record<
  SmsConsentAudience,
  Array<{ key: keyof SmsConsentValue; label: string }>
> = {
  customer: [
    {
      key: 'service',
      label:
        `I agree to receive account and service text messages from ${BRAND}, such as booking confirmations, appointment reminders, and replies to my enquiry.` +
        DISCLOSURE,
    },
    {
      key: 'marketing',
      label:
        `I agree to receive marketing and promotional text messages from ${BRAND} about cleaning services, offers, and updates.` +
        DISCLOSURE,
    },
  ],
  // Careers deliberately offers only the service box. We are not going to send
  // job applicants promotional cleaning offers, and a consent option we never
  // intend to use is a claim we cannot substantiate.
  careers: [
    {
      key: 'service',
      label:
        `I agree to receive text messages from ${BRAND} about my application, such as interview scheduling and status updates.` +
        DISCLOSURE,
    },
  ],
}

export function SmsConsentFields({
  value,
  onChange,
  audience = 'customer',
  tone = 'light',
  style,
}: {
  value: SmsConsentValue
  onChange: (next: SmsConsentValue) => void
  audience?: SmsConsentAudience
  /** `dark` for forms on a dark panel. Affects text colour only. */
  tone?: 'light' | 'dark'
  style?: React.CSSProperties
}) {
  const rows = COPY[audience]

  const labelColor = tone === 'dark' ? 'rgba(255,255,255,0.82)' : 'rgba(74,90,106,0.85)'
  const noteColor = tone === 'dark' ? 'rgba(255,255,255,0.55)' : 'rgba(74,90,106,0.65)'
  const linkColor = '#17b0ab'
  const ruleColor = tone === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(13,27,46,0.08)'

  return (
    <div
      style={{
        marginTop: '24px',
        borderTop: `1px solid ${ruleColor}`,
        paddingTop: '20px',
        ...style,
      }}
    >
      {rows.map(({ key, label }) => (
        <label
          key={key}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            cursor: 'pointer',
            marginBottom: '14px',
            userSelect: 'none',
          }}
        >
          <input
            type="checkbox"
            checked={value[key]}
            onChange={(e) => onChange({ ...value, [key]: e.target.checked })}
            style={{
              marginTop: '3px',
              width: '16px',
              height: '16px',
              flexShrink: 0,
              accentColor: linkColor,
              cursor: 'pointer',
            }}
          />
          <span style={{ fontSize: '0.82rem', lineHeight: 1.55, color: labelColor }}>
            {label}
          </span>
        </label>
      ))}

      {/* Links only. The five disclosures now live inside each label above, so
          repeating them here as well would be a third copy on screen. The links
          must stay: "Privacy Policy and Terms links visible on the form page" is
          its own checklist item, and it passes. */}
      <p style={{ fontSize: '0.78rem', color: noteColor, margin: '4px 0 0', lineHeight: 1.6 }}>
        See our{' '}
        <a href="/privacy" style={{ color: linkColor, fontWeight: 600 }}>
          Privacy Policy
        </a>{' '}
        and{' '}
        <a href="/terms" style={{ color: linkColor, fontWeight: 600 }}>
          Terms of Service
        </a>
        .
      </p>
    </div>
  )
}
