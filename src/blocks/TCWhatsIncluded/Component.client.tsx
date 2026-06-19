// src/blocks/TCWhatsIncluded/Component.client.tsx
// Service-page checklist block — "Ceramic Sequence" pattern.
//
// Design inspiration: design/whatisinlcuded.html
//   • 12-col CSS Grid with 2px "grout" gap
//   • Light grout colour shows between white tiles
//   • Variable tile spans create visual hierarchy
//   • Accent dot top-right (sand → coral on hover)
//   • Hover: lift + teal-tint background
//
// Smart span allocation so the grid stays beautifully aligned
// for any number of sections from 1 to 6.
//
// Header uses our TCHeadingStack — no eyebrow/category-kicker on
// individual tiles per Geraldine's request.

'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { TCHeadingStack } from '@/components/ui/TCHeading'

export type WhatsIncludedSection = {
  title: string
  items: string[]
}

type Props = {
  ghostKicker: string
  mainLine: string
  secondaryLine: string
  intro?: string
  sections: WhatsIncludedSection[]
}

// ── Span allocation ──────────────────────────────────────────
// Each pattern sums to a multiple of 12 (the grid's column count)
// so no tile is left orphaned on a partial row. Asymmetric spans
// are chosen for visual rhythm where it works; equal spans are
// used where symmetry reads cleaner.
function getTileSpans(count: number): number[] {
  switch (count) {
    case 1:  return [12]
    case 2:  return [6, 6]
    case 3:  return [4, 4, 4]
    case 4:  return [7, 5, 5, 7]            // zigzag — wide/narrow then narrow/wide
    case 5:  return [7, 5, 4, 4, 4]          // hero duo + equal trio
    case 6:  return [4, 4, 4, 4, 4, 4]       // clean 2×3
    default:
      // Fallback for unexpected counts — equal 4-spans, wrapped
      return Array.from({ length: count }, () => 4)
  }
}

// Checked-checkbox tick — teal square with a white check (per Geraldine:
// "What's Included" reads as a checkbox checklist).
const CheckBox = () => (
  <span
    style={{
      width: '20px',
      height: '20px',
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-teal, #17b0ab)',
      borderRadius: '4px',
    }}
  >
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden>
      <path
        d="M20 6L9 17l-5-5"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  </span>
)

export function TCWhatsIncludedClient({
  ghostKicker,
  mainLine,
  secondaryLine,
  intro,
  sections,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const spans = getTileSpans(sections.length)

  return (
    <section className="relative bg-white pt-[60px] pb-[100px] lg:pt-[80px] lg:pb-[140px] px-[5%]">
      <div ref={ref} className="max-w-[1400px] mx-auto">

        {/* ── Editorial heading ─────────────────────────────────── */}
        <motion.div
          className="mb-14 lg:mb-20 max-w-[800px]"
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <TCHeadingStack
            ghostKicker={ghostKicker}
            mainLine={mainLine}
            secondaryLine={secondaryLine}
            level="h2"
            theme="light"
            size="lg"
          />
          {intro && (
            <p
              className="mt-8 text-[1.05rem] lg:text-[1.125rem] leading-[1.7] max-w-[540px]"
              style={{
                color: 'var(--color-navy-mid, #2a4365)',
                borderLeft: '2px solid var(--color-teal, #17b0ab)',
                paddingLeft: '24px',
              }}
            >
              {intro}
            </p>
          )}
        </motion.div>

        {/* ── Ceramic sequence grid ─────────────────────────────── */}
        <div
          className="tc-included-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '2px',
            background: 'rgba(13, 27, 46, 0.05)',
            border: '1px solid rgba(13, 27, 46, 0.05)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          {sections.map((section, i) => (
            <motion.article
              key={section.title}
              className="tc-included-tile group"
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.65,
                delay: 0.15 + i * 0.09,
                ease: [0.23, 1, 0.32, 1],
              }}
              style={{
                gridColumn: `span ${spans[i] ?? 4}`,
                background: '#ffffff',
                padding: '48px',
                position: 'relative',
                transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
              }}
            >
              {/* Accent dot — sand at rest, coral on hover */}
              <span
                aria-hidden
                className="tc-included-dot"
                style={{
                  position: 'absolute',
                  top: '32px',
                  right: '32px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--color-sand, #f5efe0)',
                  transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                }}
              />

              {/* Section title — no eyebrow per design */}
              <h3
                className="text-[1.4rem] lg:text-[1.5rem] font-bold leading-[1.3] mb-[28px] tracking-[-0.3px]"
                style={{ color: 'var(--color-navy-deep, #0d1b2e)' }}
              >
                {section.title}
              </h3>

              {/* Checklist */}
              <ul className="list-none">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="grid items-start gap-4 mb-[16px] last:mb-0"
                    style={{
                      gridTemplateColumns: '24px 1fr',
                      fontSize: '0.95rem',
                      lineHeight: 1.55,
                      color: 'var(--color-navy-mid, #2a4365)',
                    }}
                  >
                    <span className="flex mt-[2px]">
                      <CheckBox />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>

      </div>

      {/* Scoped styles: hover behaviour + responsive collapse */}
      <style>{`
        .tc-included-tile:hover {
          z-index: 2;
          background-color: var(--color-teal-tint, #eaf7f6) !important;
          box-shadow: 0 22px 48px -22px rgba(13, 27, 46, 0.18);
          transform: translateY(-4px);
        }
        .tc-included-tile:hover .tc-included-dot {
          background-color: var(--color-coral, #fc8181) !important;
          transform: scale(1.5);
        }
        @media (max-width: 1024px) {
          .tc-included-grid > .tc-included-tile {
            grid-column: span 6 !important;
          }
        }
        @media (max-width: 700px) {
          .tc-included-grid > .tc-included-tile {
            grid-column: span 12 !important;
            padding: 36px !important;
          }
        }
      `}</style>
    </section>
  )
}
