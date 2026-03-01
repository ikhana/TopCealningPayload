// src/blocks/TCJoinTeam/Component.client.tsx
// "Join Our Team of Experts" — 3-step application form with step-node sidebar.
// Design reference: design/hero5.html (.join-section / jointeam.html content).
//
// React state:
//   • activeStep (1|2|3) — controls which form plate is visible
//   • fileName — displays selected resume file name
//   • submitted — shows success message after form submit
//
// Justified <style> exceptions:
//   • clip-path on next button — Tailwind arbitrary clip-path not supported
//   • .join-form-plate animation — keyframe + display:flex combo
//   • Step node active state — box-shadow + transform on parent
//   • Input/select/textarea focus ring — cleaner as CSS rule
//   • Responsive step indicators becoming horizontal row

'use client'

import React, { useRef, useState } from 'react'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcJoinTeam'
}

const STEP_NODES = [
  { num: 'PHASE 01', title: 'Personal Details', step: 1 },
  { num: 'PHASE 02', title: 'Expertise & Area', step: 2 },
  { num: 'PHASE 03', title: 'Legal & Background', step: 3 },
]

export function TCJoinTeamClient(_props: Props) {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1)
  const [fileName, setFileName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setFileName(file.name)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <style>{`
        /* ── Step node active state ── */
        .tc-join-node { transition: all 0.6s cubic-bezier(0.22,1,0.36,1); cursor: pointer; }
        .tc-join-node.active {
          background: #0d1b2e;
          color: white;
          transform: translateX(20px);
          box-shadow: -4px 0 0 #17b0ab;
        }
        .tc-join-node.active .tc-join-node-num { color: rgba(255,255,255,0.55) !important; }

        /* ── Form plate slide-in animation ── */
        @keyframes tc-join-plate-slide {
          from { opacity: 0; transform: translateY(40px) rotateX(-5deg); }
          to   { opacity: 1; transform: translateY(0) rotateX(0); }
        }

        /* ── Input / select / textarea focus ── */
        .tc-join-input:focus {
          outline: none;
          border-color: #17b0ab !important;
          background: white !important;
          box-shadow: 0 0 0 4px rgba(23,176,171,0.1);
        }

        /* ── Next button clip-path ── */
        .tc-join-btn-next {
          clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%);
          padding-right: 50px !important;
        }
        .tc-join-btn-next:hover {
          background: #17b0ab !important;
          transform: translateX(10px);
        }

        /* ── Prev button ── */
        .tc-join-btn-prev { border-bottom: 2px solid transparent; }
        .tc-join-btn-prev:hover {
          color: #0d1b2e !important;
          border-bottom-color: #17b0ab;
        }

        /* ── Submit button ── */
        .tc-join-btn-submit:hover {
          transform: translate(-2px, -2px);
          box-shadow: 5px 5px 0 #0d1b2e !important;
        }

        /* ── File drop zone ── */
        .tc-join-file-zone:hover {
          border-color: #17b0ab !important;
          background: white !important;
        }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          /* Collapse to single column; steps stay vertical */
          .tc-join-container     { grid-template-columns: 1fr !important; gap: 40px !important; }
          .tc-join-sidebar       { gap: 24px !important; }
          .tc-join-form-assembly { min-height: auto !important; }
        }
        @media (max-width: 768px) {
          .tc-join-section       { padding: 60px 5% !important; }
          .tc-join-heading       { font-size: 2.4rem !important; letter-spacing: -1.5px !important; }
          .tc-join-quote         { display: none !important; }
          /* Active node: reduce translateX to avoid right-edge overflow */
          .tc-join-node          { padding: 16px 20px !important; }
          .tc-join-node-num      { margin-bottom: 4px !important; }
          .tc-join-node.active   { transform: translateX(6px) !important; }
          /* Form fields single column, no overflow */
          .tc-join-input-grid    { grid-template-columns: 1fr !important; }
          .tc-join-field-full    { grid-column: span 1 !important; }
          .tc-join-form-plate    { padding: 25px !important; overflow: hidden !important; }
          .tc-join-form-assembly { min-height: auto !important; }
          .tc-join-file-zone     { padding: 25px !important; }
          .tc-join-btn-next      { clip-path: none !important; padding-right: 36px !important; }
        }
      `}</style>

      <section
        id="careers"
        className="tc-join-section"
        style={{
          background: '#f8f4ee',
          padding: '120px 5%',
          position: 'relative',
          overflow: 'hidden',
          borderTop: '1px solid rgba(13,27,46,0.1)',
        }}
      >
        {/* Ghost watermark */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: '-5%',
            left: '-2%',
            fontFamily: 'var(--font-mono)',
            fontSize: '20vw',
            fontWeight: 900,
            color: '#0d1b2e',
            opacity: 0.03,
            pointerEvents: 'none',
            lineHeight: 0.8,
            zIndex: 0,
            userSelect: 'none',
          }}
        >
          WORK
        </div>

        <div
          className="tc-join-container"
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '420px 1fr',
            gap: '80px',
            position: 'relative',
            zIndex: 2,
          }}
        >

          {/* ── Sidebar ─────────────────────────────────────── */}
          <aside className="tc-join-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <header>
              <h2
                className="tc-join-heading"
                style={{
                  fontSize: '4rem',
                  fontWeight: 900,
                  lineHeight: 0.85,
                  letterSpacing: '-3px',
                  color: '#0d1b2e',
                  margin: 0,
                }}
              >
                Join Our{' '}
                <span
                  style={{
                    display: 'block',
                    color: '#17b0ab',
                    fontStyle: 'italic',
                    fontWeight: 300,
                    letterSpacing: '-1px',
                    fontSize: '2.5rem',
                    marginTop: '10px',
                  }}
                >
                  Team of Experts
                </span>
              </h2>
            </header>

            {/* Step indicators */}
            <div
              className="tc-join-step-indicators"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                borderLeft: '1px solid rgba(13,27,46,0.1)',
              }}
            >
              {STEP_NODES.map((node) => (
                <div
                  key={node.step}
                  className={`tc-join-node${activeStep === node.step ? ' active' : ''}`}
                  onClick={() => setActiveStep(node.step as 1 | 2 | 3)}
                  style={{
                    padding: '30px',
                    position: 'relative',
                    borderBottom: '1px solid rgba(13,27,46,0.05)',
                  }}
                >
                  <span
                    className="tc-join-node-num"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: '#17b0ab',
                      display: 'block',
                      marginBottom: '8px',
                      letterSpacing: '2px',
                    }}
                  >
                    {node.num}
                  </span>
                  <h4
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      margin: 0,
                    }}
                  >
                    {node.title}
                  </h4>
                </div>
              ))}
            </div>

            {/* Quote block */}
            <div
              className="tc-join-quote"
              style={{
                background: '#0d1b2e',
                padding: '30px',
                color: 'white',
                marginTop: 'auto',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  lineHeight: 1.6,
                  opacity: 0.7,
                  margin: 0,
                }}
              >
                &ldquo;We don&apos;t just hire cleaners, we build partnerships with professionals
                who take pride in their craft.&rdquo;
              </p>
            </div>
          </aside>

          {/* ── Form assembly ────────────────────────────────── */}
          <div
            className="tc-join-form-assembly"
            style={{ position: 'relative', minHeight: '700px' }}
          >
            {submitted ? (
              /* Success message */
              <div
                style={{
                  background: 'white',
                  padding: '60px',
                  border: '1px solid rgba(13,27,46,0.08)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '400px',
                  gap: '20px',
                }}
              >
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#17b0ab"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#0d1b2e', margin: 0 }}>
                  Application Submitted!
                </h3>
                <p style={{ color: 'rgba(26,40,64,0.6)', maxWidth: '400px', lineHeight: 1.7, margin: 0 }}>
                  Thank you for your interest in joining the Top Cleaning team. We&apos;ll review
                  your application and be in touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>

                {/* ── STEP 1: Personal Details ── */}
                {activeStep === 1 && (
                  <div
                    className="tc-join-form-plate"
                    style={{
                      background: 'white',
                      padding: '60px',
                      boxShadow: '0 2px 16px rgba(13,27,46,0.07)',
                      border: '1px solid rgba(13,27,46,0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      animation: 'tc-join-plate-slide 0.8s cubic-bezier(0.22,1,0.36,1) forwards',
                    }}
                  >
                    <div
                      style={{
                        marginBottom: '40px',
                        borderBottom: '3px solid #17b0ab',
                        width: 'fit-content',
                        paddingBottom: '10px',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '2rem',
                          fontWeight: 900,
                          color: '#0d1b2e',
                          letterSpacing: '-1px',
                          margin: 0,
                        }}
                      >
                        Tell us about you...
                      </h3>
                    </div>

                    <div
                      className="tc-join-input-grid"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '25px',
                        flex: 1,
                      }}
                    >
                      <FieldGroup label="First Name">
                        <input className="tc-join-input" type="text" name="first_name" placeholder="John" required style={inputStyle} />
                      </FieldGroup>
                      <FieldGroup label="Last Name">
                        <input className="tc-join-input" type="text" name="last_name" placeholder="Doe" required style={inputStyle} />
                      </FieldGroup>
                      <FieldGroup label="Email Address">
                        <input className="tc-join-input" type="email" name="email" placeholder="john@example.com" required style={inputStyle} />
                      </FieldGroup>
                      <FieldGroup label="Phone Number">
                        <input className="tc-join-input" type="tel" name="phone" placeholder="(555) 000-0000" required style={inputStyle} />
                      </FieldGroup>
                      <FieldGroup label="English Knowledge Level" full>
                        <select className="tc-join-input" name="english_level" style={inputStyle} defaultValue="">
                          <option value="" disabled>Select level...</option>
                          <option value="very_low">Very Low</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="very_high">Very High</option>
                        </select>
                      </FieldGroup>
                    </div>

                    <PlateActions>
                      <span />
                      <NavButton variant="next" onClick={() => setActiveStep(2)}>
                        Proceed to Experience
                      </NavButton>
                    </PlateActions>
                  </div>
                )}

                {/* ── STEP 2: Resume & Area ── */}
                {activeStep === 2 && (
                  <div
                    className="tc-join-form-plate"
                    style={{
                      background: 'white',
                      padding: '60px',
                      boxShadow: '0 2px 16px rgba(13,27,46,0.07)',
                      border: '1px solid rgba(13,27,46,0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      animation: 'tc-join-plate-slide 0.8s cubic-bezier(0.22,1,0.36,1) forwards',
                    }}
                  >
                    <div
                      style={{
                        marginBottom: '40px',
                        borderBottom: '3px solid #17b0ab',
                        width: 'fit-content',
                        paddingBottom: '10px',
                      }}
                    >
                      <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#0d1b2e', letterSpacing: '-1px', margin: 0 }}>
                        Your Resume
                      </h3>
                    </div>

                    {/* File upload */}
                    <FieldGroup label="Upload Resume (.pdf, .doc, .docx)" full style={{ marginBottom: '30px' }}>
                      <div
                        className="tc-join-file-zone"
                        style={{
                          border: '2px dashed rgba(23,176,171,0.3)',
                          padding: '50px',
                          textAlign: 'center',
                          background: '#e0f5f4',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          position: 'relative',
                        }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#17b0ab"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ margin: '0 auto 15px', display: 'block' }}
                          aria-hidden="true"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <p
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.8rem',
                            color: '#0d1b2e',
                            margin: 0,
                          }}
                        >
                          Drag and drop your file here or click to browse
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          name="resume"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />
                        {fileName && (
                          <div
                            style={{
                              marginTop: '10px',
                              fontWeight: 700,
                              color: '#17b0ab',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.85rem',
                            }}
                          >
                            {fileName}
                          </div>
                        )}
                      </div>
                    </FieldGroup>

                    <FieldGroup label="Area where you wish to apply" full>
                      <select className="tc-join-input" name="apply_area" style={inputStyle} defaultValue="">
                        <option value="" disabled>Select an area</option>
                        <option value="brickell">Brickell</option>
                        <option value="aventura">Aventura</option>
                        <option value="fort_myers">Fort Myers</option>
                        <option value="coral_springs">Coral Springs</option>
                        <option value="miami_beach">Miami Beach</option>
                        <option value="doral">Doral</option>
                      </select>
                    </FieldGroup>

                    <PlateActions>
                      <NavButton variant="prev" onClick={() => setActiveStep(1)}>Back</NavButton>
                      <NavButton variant="next" onClick={() => setActiveStep(3)}>Final Information</NavButton>
                    </PlateActions>
                  </div>
                )}

                {/* ── STEP 3: Additional Info ── */}
                {activeStep === 3 && (
                  <div
                    className="tc-join-form-plate"
                    style={{
                      background: 'white',
                      padding: '60px',
                      boxShadow: '0 2px 16px rgba(13,27,46,0.07)',
                      border: '1px solid rgba(13,27,46,0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      animation: 'tc-join-plate-slide 0.8s cubic-bezier(0.22,1,0.36,1) forwards',
                    }}
                  >
                    <div
                      style={{
                        marginBottom: '40px',
                        borderBottom: '3px solid #17b0ab',
                        width: 'fit-content',
                        paddingBottom: '10px',
                      }}
                    >
                      <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#0d1b2e', letterSpacing: '-1px', margin: 0 }}>
                        Additional Information
                      </h3>
                    </div>

                    <div
                      className="tc-join-input-grid"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '25px',
                        flex: 1,
                      }}
                    >
                      <FieldGroup label="Authorized to work in US?">
                        <div style={{ display: 'flex', gap: '30px', marginTop: '5px' }}>
                          <RadioItem name="auth_work" value="yes" label="Yes" />
                          <RadioItem name="auth_work" value="no" label="No" />
                        </div>
                      </FieldGroup>
                      <FieldGroup label="Own reliable transportation?">
                        <div style={{ display: 'flex', gap: '30px', marginTop: '5px' }}>
                          <RadioItem name="transport" value="yes" label="Yes" />
                          <RadioItem name="transport" value="no" label="No" />
                        </div>
                      </FieldGroup>
                      <FieldGroup label="Best way to contact you?" full>
                        <select className="tc-join-input" name="contact_method" style={inputStyle}>
                          <option value="phone">Phone</option>
                          <option value="email">Email</option>
                          <option value="text">Text Message</option>
                          <option value="whatsapp">WhatsApp</option>
                        </select>
                      </FieldGroup>
                      <FieldGroup label="Tell us more about yourself" full>
                        <textarea
                          className="tc-join-input"
                          name="bio"
                          rows={3}
                          placeholder="Interests, availability, etc."
                          style={inputStyle}
                        />
                      </FieldGroup>
                      <FieldGroup label="What experience do you have in this field?" full>
                        <textarea
                          className="tc-join-input"
                          name="experience"
                          rows={3}
                          placeholder="List previous cleaning roles..."
                          style={inputStyle}
                        />
                      </FieldGroup>
                      <FieldGroup label="Allergic to any products or chemicals? (Optional)" full>
                        <textarea
                          className="tc-join-input"
                          name="allergies"
                          rows={2}
                          placeholder="N/A if none"
                          style={inputStyle}
                        />
                      </FieldGroup>
                    </div>

                    <PlateActions>
                      <NavButton variant="prev" onClick={() => setActiveStep(2)}>Back</NavButton>
                      <button
                        type="submit"
                        className="tc-join-btn-submit"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '2px',
                          fontSize: '0.8rem',
                          padding: '18px 36px',
                          cursor: 'pointer',
                          border: 'none',
                          background: '#e05c5c',
                          color: 'white',
                          boxShadow: '3px 3px 0 #0d1b2e',
                          transition: 'all 0.3s',
                        }}
                      >
                        Submit Application
                      </button>
                    </PlateActions>
                  </div>
                )}

              </form>
            )}
          </div>

        </div>
      </section>
    </>
  )
}

// ── Small helper components ────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '16px',
  background: '#f8f8f5',
  border: '1px solid rgba(13,27,46,0.1)',
  fontFamily: 'inherit',
  fontSize: '1rem',
  color: '#0d1b2e',
  transition: 'all 0.3s',
  borderRadius: 0,
  boxSizing: 'border-box',
}

function FieldGroup({
  label,
  children,
  full,
  style,
}: {
  label: string
  children: React.ReactNode
  full?: boolean
  style?: React.CSSProperties
}) {
  return (
    <div
      className={full ? 'tc-join-field-full' : undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        gridColumn: full ? 'span 2' : undefined,
        ...style,
      }}
    >
      <label
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          color: 'rgba(26,40,64,0.6)',
          fontWeight: 700,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

function PlateActions({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: 'auto',
        paddingTop: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {children}
    </div>
  )
}

function NavButton({
  variant,
  onClick,
  children,
}: {
  variant: 'next' | 'prev'
  onClick?: () => void
  children: React.ReactNode
}) {
  if (variant === 'prev') {
    return (
      <button
        type="button"
        className="tc-join-btn-prev"
        onClick={onClick}
        style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          fontSize: '0.8rem',
          padding: '18px 0',
          cursor: 'pointer',
          background: 'transparent',
          color: 'rgba(26,40,64,0.6)',
          border: 'none',
          transition: 'all 0.3s',
        }}
      >
        {children}
      </button>
    )
  }

  return (
    <button
      type="button"
      className="tc-join-btn-next"
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontSize: '0.8rem',
        padding: '18px 36px',
        cursor: 'pointer',
        border: 'none',
        background: '#0d1b2e',
        color: 'white',
        transition: 'all 0.3s',
      }}
    >
      {children}
    </button>
  )
}

function RadioItem({ name, value, label }: { name: string; value: string; label: string }) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: '0.9rem',
      }}
    >
      <input
        type="radio"
        name={name}
        value={value}
        style={{ accentColor: '#17b0ab', width: '18px', height: '18px' }}
      />
      {label}
    </label>
  )
}
