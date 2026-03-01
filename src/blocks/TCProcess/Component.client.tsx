// src/blocks/TCProcess/Component.client.tsx
// "How It Works / Our Process Is Simple" — 3-column monolith hover-expand cards.
// Design reference: design/hero5.html (.tectonic-section / .monolith-grid).
//
// Justified inline-style + scoped <style> exceptions:
//   • max-height cubic-bezier transition — not expressible in Tailwind arbitrary
//   • image filter + transition — compound value requires CSS
//   • parent→child hover for expand, image reveal, title color

'use client'

import React from 'react'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcProcess'
}

const STEPS = [
  {
    num: '01',
    title: 'Book Online',
    image: '/images/process/booking.jpg',
    imageAlt: 'Booking',
    details: [
      'Easy online booking system makes scheduling effortless',
      'Choose your preferred date and time',
      'Specify your cleaning needs',
      'Get instant price quote',
      'Secure online payment',
    ],
  },
  {
    num: '02',
    title: 'We Clean',
    image: '/images/process/cleaning.jpg',
    imageAlt: 'Cleaning in progress',
    details: [
      'Trained professionals arrive on schedule',
      'Thorough cleaning with eco-friendly products',
      'Attention to every detail',
      'Quality check before finishing',
    ],
  },
  {
    num: '03',
    title: 'You Relax',
    image: '/images/process/relax.jpg',
    imageAlt: 'Relax and enjoy',
    details: [
      'Enjoy your spotless environment',
      'Satisfaction guaranteed',
      'Book recurring service if desired',
      'Leave us your feedback',
    ],
  },
]

export function TCProcessClient(_props: Props) {
  return (
    <>
      <style>{`
        /* Card hover: background */
        .tc-process-monolith {
          transition: background 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .tc-process-monolith:hover {
          background: #17b0ab !important;
        }

        /* Background image: default dim grayscale → full colour on hover */
        .tc-process-img {
          filter: grayscale(100%) contrast(1.2);
          opacity: 0.15;
          transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1),
                      filter 0.6s cubic-bezier(0.22,1,0.36,1),
                      transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .tc-process-monolith:hover .tc-process-img {
          opacity: 0.4;
          filter: grayscale(0) contrast(1);
          transform: scale(1.05);
        }

        /* Ghost number: fades up on hover */
        .tc-process-num {
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .tc-process-monolith:hover .tc-process-num {
          opacity: 0.2 !important;
          transform: translateY(-20px);
        }

        /* Title: colour + margin change */
        .tc-process-title {
          transition: color 0.4s ease, margin-bottom 0.4s ease;
          color: #0d1b2e;
          margin-bottom: 0;
        }
        .tc-process-monolith:hover .tc-process-title {
          color: #ffffff;
          margin-bottom: 20px;
        }

        /* Expandable details: cubic-bezier max-height trick */
        .tc-process-details {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.6s cubic-bezier(0.22,1,0.36,1),
                      opacity 0.4s ease;
        }
        .tc-process-monolith:hover .tc-process-details {
          max-height: 400px;
          opacity: 1;
        }

        /* Responsive: stack vertically, always show details */
        @media (max-width: 1024px) {
          .tc-process-grid {
            grid-template-columns: 1fr !important;
          }
          .tc-process-monolith {
            height: auto !important;
            min-height: 300px;
          }
          .tc-process-details {
            max-height: 1000px !important;
            opacity: 1 !important;
          }
          .tc-process-title {
            margin-bottom: 20px !important;
          }
        }
      `}</style>

      <section style={{ background: '#f5efe0', padding: '100px 5%' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

          {/* ── Intro ───────────────────────────────────────────── */}
          <div style={{ marginBottom: '80px' }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: '#fc8181',
                textTransform: 'uppercase',
                letterSpacing: '4px',
                marginBottom: '10px',
                fontWeight: 700,
              }}
            >
              How It Works
            </p>
            <h2
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                fontWeight: 900,
                color: '#0d1b2e',
                letterSpacing: '-2px',
                marginBottom: '20px',
                lineHeight: 1.1,
              }}
            >
              Our Process Is Simple
            </h2>
            <p
              style={{
                fontSize: '1.2rem',
                color: '#4a5a6a',
                maxWidth: '600px',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              We&apos;ve streamlined our cleaning process to make it as easy as possible for
              you. Just three simple steps to a spotless space.
            </p>
          </div>

          {/* ── Monolith grid ───────────────────────────────────── */}
          <div
            className="tc-process-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 0,
              background: '#0d1b2e',
              border: '10px solid #0d1b2e',
              boxShadow: '4px 4px 0px rgba(23,176,171,0.25)',
            }}
          >
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className="tc-process-monolith"
                style={{
                  position: 'relative',
                  height: '700px',
                  overflow: 'hidden',
                  background: '#ffffff',
                  borderRight: i < STEPS.length - 1 ? '1px solid #0d1b2e' : 'none',
                  cursor: 'pointer',
                }}
              >
                {/* Background photo */}
                <img
                  src={step.image}
                  alt={step.imageAlt}
                  className="tc-process-img"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Ghost step number */}
                <span
                  aria-hidden
                  className="tc-process-num"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '8rem',
                    fontWeight: 900,
                    lineHeight: 0.8,
                    color: '#0d1b2e',
                    opacity: 0.05,
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  {step.num}
                </span>

                {/* Content — pinned to bottom */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    height: '100%',
                    padding: '50px 50px 70px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                  }}
                >
                  <h3 className="tc-process-title" style={{ fontSize: '2.2rem', fontWeight: 900 }}>
                    {step.title}
                  </h3>

                  <div className="tc-process-details">
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {step.details.map((detail) => (
                        <li
                          key={detail}
                          style={{
                            fontSize: '0.95rem',
                            lineHeight: 1.6,
                            color: '#ffffff',
                            marginBottom: '12px',
                            fontWeight: 500,
                            borderLeft: '3px solid #17b0ab',
                            paddingLeft: '15px',
                          }}
                        >
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}
