// src/blocks/TCWhatsIncluded/Component.client.tsx
// Service-page checklist block — "What's Included" section.
//
// Layout:
//   • TCHeadingStack header (ghost kicker + main + secondary line)
//   • Intro paragraph
//   • 2-col responsive grid of category cards
//   • Each card: h3 title + teal check items
//
// Light theme on brand sand, teal accents — matches the rest of the
// TC service-page language.

'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check } from 'lucide-react'
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

export function TCWhatsIncludedClient({
  ghostKicker,
  mainLine,
  secondaryLine,
  intro,
  sections,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative bg-white pt-[60px] pb-[100px] lg:pt-[80px] lg:pb-[130px] px-[5%]">
      <div ref={ref} className="max-w-[1400px] mx-auto">

        {/* ── Section heading ────────────────────────────────── */}
        <motion.div
          className="mb-12 lg:mb-16 max-w-[680px]"
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
            <p className="mt-5 text-[1rem] lg:text-[1.05rem] leading-[1.7] text-navy-deep/65 max-w-[560px]">
              {intro}
            </p>
          )}
        </motion.div>

        {/* ── Sections grid ──────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {sections.map((section, i) => (
            <motion.article
              key={section.title}
              className="group relative bg-[#f4f7f6] border border-slate-200 overflow-hidden transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_22px_48px_-22px_rgba(13,27,46,0.18)]"
              initial={{ opacity: 0, y: 26 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.18 + i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Teal top accent — brand line on every card */}
              <div className="h-[3px] bg-teal" />

              <div className="p-8 lg:p-10">
                {/* Section title */}
                <h3 className="text-[1.2rem] lg:text-[1.3rem] font-extrabold text-navy-deep mb-5 leading-[1.25] tracking-[-0.3px]">
                  {section.title}
                </h3>

                {/* Items checklist */}
                <ul className="list-none grid gap-[10px] mb-0">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[0.92rem] leading-[1.5] text-navy-deep/75"
                    >
                      <span
                        className="flex-shrink-0 mt-[3px] w-[18px] h-[18px] flex items-center justify-center"
                        style={{ background: 'rgba(23,176,171,0.12)' }}
                      >
                        <Check className="w-3 h-3 text-teal" strokeWidth={3} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  )
}
