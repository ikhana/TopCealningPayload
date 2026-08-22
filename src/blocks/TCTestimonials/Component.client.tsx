// src/blocks/TCTestimonials/Component.client.tsx
// "Voices of The Pristine" — sticky sidebar + 2×2 testimonial card grid.
// Light theme on brand sand #f5efe0 — warm differentiation from white/teal sections.
// White cards pop against the sand bg; teal accents preserved on stars + role + ghost quote.
//
// Justified <style> + inline exceptions:
//   • ::before pseudo-element for ghost quote mark — not possible in Tailwind
//   • nth-child(even) stagger — needs CSS
//   • Hover box-shadow + transform combination — cleaner as CSS rule

'use client'

import { TCHeadingStack } from '@/components/ui/TCHeading'
import React from 'react'
import {
  TESTIMONIALS as REAL_TESTIMONIALS,
  GOOGLE_REVIEWS_URL,
  initialOf,
} from '@/data/testimonials'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcTestimonials'
}

// Real Google reviews, from src/data/testimonials.ts.
//
// This array previously held four fabricated testimonials with stock avatars.
// That is Twilio 30962 (deceptive marketing), NON-RESUBMITTABLE for A2P, and it
// was live on the homepage. Do not reintroduce invented quotes, invented names,
// invented job titles, or stock photographs of people.
//
// To add a review: edit src/data/testimonials.ts. It must exist publicly on the
// Google listing so that anyone, including a carrier reviewer, can verify it.
const TESTIMONIALS = REAL_TESTIMONIALS

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
    </svg>
  )
}

export function TCTestimonialsClient(_props: Props) {
  return (
    <>
      <style>{`
        /* Staggered even-card vertical offset */
        .tc-testi-card:nth-child(even) { margin-top: 40px; }

        /* Ghost opening quote mark — teal at light opacity on light bg */
        .tc-testi-quote { position: relative; }
        .tc-testi-quote::before {
          content: '"';
          position: absolute;
          top: -20px;
          left: -10px;
          font-size: 4rem;
          color: #17b0ab;
          opacity: 0.18;
          font-family: serif;
          line-height: 1;
          pointer-events: none;
        }

        /* Card hover on light bg */
        .tc-testi-card {
          transition: all 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .tc-testi-card:hover {
          background: #ffffff !important;
          border-color: #17b0ab !important;
          box-shadow: 0 18px 40px -18px rgba(13,27,46,0.22) !important;
          transform: translateY(-6px);
        }

        /* Responsive */
        @media (max-width: 1100px) {
          .tc-testi-container { grid-template-columns: 1fr !important; gap: 40px !important; }
          .tc-testi-header { position: static !important; text-align: center; }
          .tc-testi-header p { margin: 0 auto; }
        }
        @media (max-width: 768px) {
          .tc-testi-section { padding: 60px 5% !important; }
          .tc-testi-grid {
            display: flex !important;
            flex-direction: row !important;
            overflow-x: scroll !important;
            scroll-snap-type: x mandatory !important;
            -webkit-overflow-scrolling: touch !important;
            gap: 0 !important;
            scrollbar-width: none !important;
          }
          .tc-testi-card {
            flex: 0 0 100% !important;
            min-width: 100% !important;
            scroll-snap-align: start !important;
            margin-top: 0 !important;
          }
        }
        .tc-testi-grid::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Light brand sand bg — warm differentiation from neighbouring white/grey sections */}
      <section
        className="tc-testi-section"
        style={{
          background: '#f5efe0',
          padding: '140px 5%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Centred teal glow blob — softer on light bg */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            background: '#17b0ab',
            filter: 'blur(150px)',
            opacity: 0.06,
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />

        <div
          className="tc-testi-container"
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1.8fr',
            gap: '80px',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >

          {/* ── Sticky sidebar ─────────────────────────────── */}
          <div className="tc-testi-header" style={{ position: 'sticky', top: '150px' }}>
            {/* Heading — ghost kicker + tight-stack (TCHeadingStack) */}
            <TCHeadingStack
              ghostKicker="Voices"
              mainLine="Voices of"
              secondaryLine="The Pristine."
              theme="light"
              size="lg"
              className="mb-[30px]"
            />
            <p style={{ color: 'rgba(13,27,46,0.62)', lineHeight: 1.8, maxWidth: '400px', margin: 0 }}>
              Our reputation is built on the visible results we leave behind. Hear from the clients
              who transformed their environments with Top Cleaning.
            </p>
          </div>

          {/* ── Cards grid ─────────────────────────────────── */}
          <div
            className="tc-testi-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px',
            }}
          >
            {TESTIMONIALS.map((t) => (
              <article
                key={t.name}
                className="tc-testi-card"
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(23,176,171,0.18)',
                  borderRadius: '4px',
                  padding: '40px',
                  position: 'relative',
                  boxShadow: '0 8px 22px -14px rgba(13,27,46,0.18)',
                }}
              >
                {/* Quote */}
                <div
                  className="tc-testi-quote"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1rem',
                    lineHeight: 1.65,
                    color: 'rgba(13,27,46,0.78)',
                    marginBottom: '30px',
                  }}
                >
                  {/* No typographic quotes here: the card already renders a
                      decorative quote mark above, and wrapping the text as well
                      double-quotes it. */}
                  {t.quote}
                </div>

                {/* Meta row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {/* Monogram, not a photograph. A stock face beside a real quote
                      is still deceptive, and a real face needs the reviewer's
                      permission. Neither is worth the risk for an avatar. */}
                  <div
                    aria-hidden
                    style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: '2px',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#e0f5f4',
                      border: '1px solid rgba(23,176,171,0.3)',
                      color: '#0d1b2e',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      lineHeight: 1,
                    }}
                  >
                    {initialOf(t.name)}
                  </div>
                  <div>
                    <h5
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: '#0d1b2e',
                        letterSpacing: '0.5px',
                        margin: 0,
                      }}
                    >
                      {t.name}
                    </h5>
                    {/* Provenance, not an invented job title. "Google Review"
                        plus the date is what makes the quote checkable. */}
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        color: '#17b0ab',
                        textTransform: 'uppercase',
                      }}
                    >
                      Google Review &middot; {t.when}
                      {t.translated && ' · Translated'}
                    </span>
                  </div>
                </div>

                {/* 5-star rating */}
                <div
                  style={{
                    marginTop: '20px',
                    display: 'flex',
                    gap: '4px',
                    color: '#17b0ab',
                  }}
                >
                  {Array.from({ length: t.rating }, (_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>
              </article>
            ))}
          </div>

          {/* The link is what makes these verifiable rather than merely claimed.
              Anyone, including a carrier reviewer checking for fabricated
              endorsements, can confirm every quote above in one click. */}
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: '#17b0ab',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(23,176,171,0.4)',
                paddingBottom: '3px',
              }}
            >
              Read all reviews on Google →
            </a>
          </div>

        </div>
      </section>
    </>
  )
}
