// src/blocks/TCContactForm/Component.client.tsx
// 2-column contact section: info panel (left) + inquiry form (right).
// Design reference: design/contactpage1.html ".contact-grid"
//
// Layout:
//   • Light ceramic bg (#f4f7f6), grid lifts into hero via negative margin-top
//   • LEFT — white info panel: phone, email, hours, social circles
//   • RIGHT — white form panel: underline inputs, parallelogram submit button
//   • No ticker strip (removed by design decision)
//
// Justified inline-style exceptions:
//   • clip-path on submit button — complex polygon value
//   • select appearance:none — cross-browser reset

'use client'

import React, { useState } from 'react'
import { SmsConsentFields, EMPTY_SMS_CONSENT } from '@/components/SmsConsent'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcContactForm'
}

type FormState = 'idle' | 'sending' | 'sent' | 'error'

export function TCContactFormClient(_props: Props) {
  const [formState, setFormState] = useState<FormState>('idle')

  // A2P 10DLC consent. This form collects a phone number, so it needs the same
  // consent mechanism as the booking wizard — reviewers crawl the site, not just
  // the declared opt-in URL.
  const [smsConsent, setSmsConsent] = useState(EMPTY_SMS_CONSENT)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Captured before the first await. React nulls currentTarget once the
    // synthetic event is pooled, so reading it after the fetch would throw.
    const formEl = e.currentTarget
    setFormState('sending')

    const body = new FormData(formEl)
    body.set('audience', 'contact')
    body.set('sms_service_consent', smsConsent.service ? 'yes' : 'no')
    body.set('sms_marketing_consent', smsConsent.marketing ? 'yes' : 'no')

    try {
      const res = await fetch('/api/ghl/form-submit', { method: 'POST', body })
      if (!res.ok) throw new Error(`form-submit responded ${res.status}`)

      setFormState('sent')
      formEl.reset()
      // reset() clears the DOM inputs but not the controlled consent state, and
      // a box left ticked after a successful send would pre-tick the next
      // visitor's form on the same device — which is Twilio 30931.
      setSmsConsent(EMPTY_SMS_CONSENT)
      setTimeout(() => setFormState('idle'), 3500)
    } catch (err) {
      console.error('[contact-form]', err)
      // Deliberately no auto-reset to idle. A failed send must stay visible:
      // clearing it would look identical to success and the enquiry would be
      // silently lost.
      setFormState('error')
    }
  }

  return (
    <>
      <style>{`
        /* ── Section shell ── */
        .tc-cf-section {
          background: #f4f7f6;
          padding: 0 5% 100px;
        }

        /* ── 2-col grid ── */
        .tc-cf-grid {
          max-width: 1400px;
          margin: -60px auto 0;
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 2px;
          background: rgba(13, 27, 46, 0.05);
          position: relative;
          z-index: 10;
        }

        /* ── LEFT — Info panel ── */
        .tc-cf-info {
          background: white;
          padding: 80px 60px;
          display: flex;
          flex-direction: column;
          gap: 55px;
          border: 1px solid rgba(13, 27, 46, 0.05);
        }

        .tc-cf-info-block h4 {
          font-family: var(--font-mono, 'JetBrains Mono', monospace);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: #17b0ab;
          margin-bottom: 18px;
        }

        .tc-cf-info-link {
          font-size: 1.4rem;
          font-weight: 700;
          color: #0d1b2e;
          text-decoration: none;
          display: block;
          margin-bottom: 8px;
          transition: color 0.3s ease;
        }

        .tc-cf-info-link:hover {
          color: #17b0ab;
        }

        .tc-cf-hours-day {
          font-size: 1.1rem;
          font-weight: 500;
          color: #0d1b2e;
        }

        .tc-cf-hours-time {
          font-family: var(--font-mono, 'JetBrains Mono', monospace);
          color: #17b0ab;
          margin-top: 5px;
          font-size: 0.9rem;
        }

        /* Social circles */
        .tc-cf-socials {
          display: flex;
          gap: 16px;
          margin-top: 8px;
        }

        .tc-cf-social-circle {
          width: 45px;
          height: 45px;
          border: 1px solid rgba(23, 176, 171, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0d1b2e;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .tc-cf-social-circle:hover {
          background: #17b0ab;
          color: white;
          border-color: #17b0ab;
          transform: translateY(-3px);
        }

        /* ── RIGHT — Form panel ── */
        .tc-cf-form-panel {
          background: white;
          padding: 80px;
          border: 1px solid rgba(13, 27, 46, 0.05);
        }

        .tc-cf-form-intro {
          margin-bottom: 45px;
        }

        .tc-cf-form-intro h3 {
          font-size: 2rem;
          font-weight: 900;
          color: #0d1b2e;
          letter-spacing: -0.5px;
        }

        .tc-cf-form-intro p {
          color: #4a5a6a;
          margin-top: 10px;
          line-height: 1.7;
          font-size: 0.95rem;
        }

        /* Input rows */
        .tc-cf-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        .tc-cf-field {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .tc-cf-field.full {
          grid-column: span 2;
          margin-bottom: 40px;
        }

        .tc-cf-field label {
          font-family: var(--font-mono, 'JetBrains Mono', monospace);
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #4a5a6a;
        }

        /* Underline inputs */
        .tc-cf-input {
          border: none;
          border-bottom: 2px solid #e2e8f0;
          padding: 15px 0;
          font-family: var(--font-sans, 'Poppins', sans-serif);
          font-size: 1rem;
          color: #0d1b2e;
          background: transparent;
          transition: border-color 0.35s ease;
          width: 100%;
          appearance: none;
          -webkit-appearance: none;
        }

        .tc-cf-input:focus {
          outline: none;
          border-color: #17b0ab;
        }

        .tc-cf-input::placeholder {
          color: #94a3b8;
        }

        textarea.tc-cf-input {
          min-height: 120px;
          resize: vertical;
        }

        /* Submit button — parallelogram clip-path */
        .tc-cf-submit {
          background: #0d1b2e;
          color: white;
          padding: 20px 40px;
          border: none;
          font-family: var(--font-mono, 'JetBrains Mono', monospace);
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          display: inline-flex;
          align-items: center;
          gap: 15px;
        }

        .tc-cf-submit:hover {
          background: #17b0ab;
          transform: translateX(5px);
        }

        .tc-cf-submit svg {
          transition: transform 0.4s ease;
          flex-shrink: 0;
        }

        .tc-cf-submit:hover svg {
          transform: translateX(5px);
        }

        .tc-cf-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        /* Success state */
        .tc-cf-submit.sent {
          background: #17b0ab;
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .tc-cf-grid {
            grid-template-columns: 1fr;
            margin-top: 0;
          }

          .tc-cf-info,
          .tc-cf-form-panel {
            padding: 60px 5%;
          }
        }

        @media (max-width: 600px) {
          .tc-cf-row {
            grid-template-columns: 1fr;
          }

          .tc-cf-field.full {
            grid-column: span 1;
          }

          .tc-cf-form-intro h3 {
            font-size: 1.6rem;
          }
        }
      `}</style>

      <section className="tc-cf-section">
        <div className="tc-cf-grid">

          {/* ── LEFT: Info panel ── */}
          <aside className="tc-cf-info">

            {/* Phone */}
            <div className="tc-cf-info-block">
              <h4>Voice &amp; Mobile</h4>
              <a href="tel:9548334276" className="tc-cf-info-link">(954) 833-4276</a>
              <a href="tel:7012383301" className="tc-cf-info-link">(701) 238-3301</a>
            </div>

            {/* Email */}
            <div className="tc-cf-info-block">
              <h4>Digital Inbox</h4>
              <a href="mailto:topcleaningservicefl@gmail.com" className="tc-cf-info-link">
                topcleaningservicefl@gmail.com
              </a>
            </div>

            {/* Hours */}
            <div className="tc-cf-info-block">
              <h4>Operational Hours</h4>
              <p className="tc-cf-hours-day">Monday — Sunday</p>
              <p className="tc-cf-hours-time">08:00 AM — 06:00 PM</p>
            </div>

            {/* Social */}
            <div className="tc-cf-info-block">
              <h4>Social Network</h4>
              <div className="tc-cf-socials">
                {/* Facebook */}
                <a href="https://web.facebook.com/people/TOP-Cleaning/61567295163475/" className="tc-cf-social-circle" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a href="https://www.instagram.com/topcleaning_team" className="tc-cf-social-circle" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                {/* Twitter / X */}
                <a href="https://www.tiktok.com/@topcleaning09" className="tc-cf-social-circle" aria-label="Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
              </div>
            </div>

          </aside>

          {/* ── RIGHT: Form panel ── */}
          <main className="tc-cf-form-panel">

            <div className="tc-cf-form-intro">
              <h3>Send a Message</h3>
              <p>
                Have a question about our services or need a specific quote? Fill out the form
                below and our team will respond within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              {/* Row 1: Name + Phone */}
              <div className="tc-cf-row">
                <div className="tc-cf-field">
                  <label htmlFor="tc-cf-name">Full Name</label>
                  <input
                    id="tc-cf-name"
                    name="name"
                    type="text"
                    className="tc-cf-input"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="tc-cf-field">
                  <label htmlFor="tc-cf-phone">Phone Number</label>
                  <input
                    id="tc-cf-phone"
                    name="phone"
                    type="tel"
                    className="tc-cf-input"
                    placeholder="(555) 000-0000"
                  />
                </div>
              </div>

              {/* Row 2: Email + Service */}
              <div className="tc-cf-row">
                <div className="tc-cf-field">
                  <label htmlFor="tc-cf-email">Email Address</label>
                  <input
                    id="tc-cf-email"
                    name="email"
                    type="email"
                    className="tc-cf-input"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="tc-cf-field">
                  <label htmlFor="tc-cf-service">Service Type</label>
                  <select id="tc-cf-service" name="service" className="tc-cf-input" style={{ appearance: 'none' }}>
                    <option>Residential Cleaning</option>
                    <option>Deep Cleaning</option>
                    <option>Commercial Cleaning</option>
                    <option>Move In / Out</option>
                    <option>AirBnB Turnover</option>
                  </select>
                </div>
              </div>

              {/* Message — full width */}
              <div className="tc-cf-field full">
                <label htmlFor="tc-cf-message">How can we help?</label>
                <textarea
                  id="tc-cf-message"
                  name="message"
                  className="tc-cf-input"
                  placeholder="Tell us about your space..."
                />
              </div>

              <SmsConsentFields
                audience="customer"
                value={smsConsent}
                onChange={setSmsConsent}
              />

              {/* Submit */}
              <button
                type="submit"
                className={`tc-cf-submit${formState === 'sent' ? ' sent' : ''}`}
                disabled={formState === 'sending'}
                style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)' }}
              >
                {formState === 'idle' && (
                  <>
                    Transmit Message
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </>
                )}
                {formState === 'sending' && '[ PROCESSING... ]'}
                {formState === 'error'   && '[ SEND FAILED — RETRY ]'}
                {formState === 'sent'    && '[ MESSAGE SENT ✓ ]'}
              </button>

            </form>
          </main>

        </div>
      </section>
    </>
  )
}
