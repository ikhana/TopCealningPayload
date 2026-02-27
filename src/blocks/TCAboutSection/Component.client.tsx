// src/blocks/TCAboutSection/Component.client.tsx
// About section — mirrors design/About3.html "Pressed Micro-Filament" layout.
// Two-column: headline + feature grid left | sticky tabbed stepper right.
// Images sourced from /public/images/cleaning/ (copied from standalone project).
// Justified inline-style exceptions:
//   • box-shadow on feature items and stepper card — complex multi-value shadows
//   • radial-gradient ambient blob — color-mix with CSS custom property

'use client'

import { cn } from '@/utilities/cn'
import { useState } from 'react'

type Tab = 'vision' | 'mission' | 'values'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcAboutSection'
}

const FEATURE_ITEMS = [
  { label: 'Licensed & Insured' },
  { label: 'Eco-Friendly Products' },
  { label: 'Trained Professionals' },
  { label: 'Satisfaction Guarantee' },
]

const TABS: { id: Tab; label: string }[] = [
  { id: 'vision',  label: 'Vision'  },
  { id: 'mission', label: 'Mission' },
  { id: 'values',  label: 'Values'  },
]

const TAB_CONTENT: Record<Tab, {
  heading: string
  body?: string
  values?: { title: string; desc: string }[]
  image: string
  imageAlt: string
}> = {
  vision: {
    heading: 'Our Vision',
    body: 'To be the leading cleaning company in the region, providing high-quality solutions for both residential and commercial clients — delivering convenience, consistency, and exceptional results every time.',
    image: '/images/cleaning/aboutsecond.jpg',
    imageAlt: 'Vision — spotless residential interior',
  },
  mission: {
    heading: 'Our Mission',
    body: 'We deliver high-quality cleaning and disinfection services with efficiency, competitive pricing, and an agile process — so our customers aren\'t just satisfied, they\'re genuinely happy with every visit.',
    image: '/images/cleaning/about-cleaning.jpg',
    imageAlt: 'Mission — professional cleaning in action',
  },
  values: {
    heading: 'Our Values',
    values: [
      { title: 'Transparency',  desc: 'Fair prices, no hidden costs, and honest communication at every step.' },
      { title: 'Teamwork',      desc: 'Collaboration and mutual support to deliver high-quality results consistently.' },
      { title: 'Commitment',    desc: 'Dedication to our team and full responsibility to every client we serve.' },
    ],
    image: '/images/cleaning/aboutthird.jpg',
    imageAlt: 'Values — team meeting and collaboration',
  },
}

export function TCAboutSectionClient(_props: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('vision')

  return (
    <>
      {/* Block-scoped keyframe for the image slow-zoom */}
      <style suppressHydrationWarning>{`
        @keyframes tc-about-zoom {
          from { transform: scale(1);    }
          to   { transform: scale(1.12); }
        }
      `}</style>

      <section className="relative bg-[#fdfdfd] py-[120px] px-[5%] overflow-hidden">

        {/* ── Ambient teal glow (top-right decorative blob) ─────────── */}
        <div
          aria-hidden
          className="absolute pointer-events-none z-0"
          style={{
            width: '50vw',
            height: '50vw',
            background: 'radial-gradient(circle, color-mix(in oklch, var(--color-teal) 6%, transparent) 0%, transparent 70%)',
            top: '-15vw',
            right: '-15vw',
            filter: 'blur(80px)',
          }}
        />

        {/* ── Main 2-column grid ───────────────────────────────────────── */}
        <div className="relative z-[1] max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-[80px] items-start">

          {/* ══ LEFT COLUMN ════════════════════════════════════════════ */}
          <div>

            {/* Kicker */}
            <span className="block font-mono text-[0.8rem] text-teal uppercase tracking-[6px] font-bold mb-5">
              Who We Are
            </span>

            {/* Headline */}
            <h2 className="font-black text-navy-deep leading-[1.1] tracking-[-1.5px] mb-8"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Foundations of Excellence
            </h2>

            {/* Subtext with teal left border */}
            <p className="text-[1.1rem] leading-[1.7] text-foreground/70 border-l-[3px] border-teal pl-6 mb-10 max-w-[480px]">
              Top Cleaning is built on a commitment to quality, reliability, and care. Every service
              we deliver reflects our belief that a clean space is a better space — for living,
              working, and thriving.
            </p>

            {/* 2×2 Feature grid */}
            <div className="grid grid-cols-2 gap-5">
              {FEATURE_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    'flex items-center gap-3',
                    'font-mono text-[0.85rem] font-semibold text-navy-deep',
                    'bg-white border border-teal/20 p-[15px]',
                    'transition-all duration-200 cursor-default',
                    'hover:-translate-x-[2px] hover:-translate-y-[2px]',
                    'hover:[box-shadow:8px_8px_0px_var(--color-teal)]',
                  )}
                  style={{ boxShadow: '4px 4px 0px var(--color-teal-light)' }}
                >
                  {/* Checkmark icon */}
                  <svg
                    className="flex-shrink-0 text-teal"
                    width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item.label}
                </div>
              ))}
            </div>

          </div>

          {/* ══ RIGHT COLUMN — Sticky Tabbed Stepper ══════════════════ */}
          <div
            className="bg-white border border-teal/20 sticky top-[100px] overflow-hidden"
            style={{ boxShadow: '0 4px 30px rgba(13,27,46,0.10)' }}
          >

            {/* Tab navigation */}
            <div className="grid grid-cols-3 border-b border-teal/20" role="tablist">
              {TABS.map(({ id, label }) => {
                const isActive = activeTab === id
                return (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(id)}
                    className={cn(
                      'relative py-[25px] px-4',
                      'font-mono text-[0.75rem] uppercase tracking-[2px] font-bold',
                      'border-0 cursor-pointer transition-all duration-200',
                      isActive
                        ? 'text-teal bg-teal-light'
                        : 'text-foreground/40 bg-transparent hover:text-foreground/70',
                    )}
                  >
                    {label}
                    {/* Active indicator bar */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[3px] bg-teal" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Panes container */}
            <div className="relative min-h-[500px]" role="tabpanel">
              {TABS.map(({ id }) => {
                const pane    = TAB_CONTENT[id]
                const isActive = activeTab === id
                return (
                  <div
                    key={id}
                    aria-hidden={!isActive}
                    className={cn(
                      'absolute inset-0 grid grid-cols-2',
                      'transition-all duration-500',
                      isActive
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible translate-y-[10px]',
                    )}
                  >
                    {/* Left half — text content */}
                    <div className="p-[50px] flex flex-col justify-center">
                      <h4 className="text-[1.8rem] font-extrabold text-navy-deep mb-5 leading-tight tracking-[-0.5px]">
                        {pane.heading}
                      </h4>

                      {pane.body && (
                        <p className="text-[0.95rem] leading-[1.8] text-foreground/70">
                          {pane.body}
                        </p>
                      )}

                      {/* Values list (only on values pane) */}
                      {pane.values && (
                        <div className="flex flex-col gap-[22px]">
                          {pane.values.map((v) => (
                            <div key={v.title}>
                              <span className="block font-mono text-[0.75rem] uppercase tracking-[2px] text-teal font-bold mb-1">
                                {v.title}
                              </span>
                              <p className="text-[0.9rem] leading-[1.6] text-foreground/70 m-0">
                                {v.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right half — image */}
                    <div className="overflow-hidden bg-navy-deep">
                      <img
                        src={pane.image}
                        alt={pane.imageAlt}
                        className="w-full h-full object-cover"
                        style={{
                          filter: 'grayscale(0.15) contrast(1.1)',
                          ...(isActive
                            ? { animation: 'tc-about-zoom 8s linear forwards' }
                            : { transform: 'scale(1)' }),
                        }}
                      />
                    </div>

                  </div>
                )
              })}
            </div>

          </div>
          {/* ══ END RIGHT COLUMN ══════════════════════════════════════ */}

        </div>
      </section>
    </>
  )
}
