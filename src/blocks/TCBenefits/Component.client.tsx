// src/blocks/TCBenefits/Component.client.tsx
// Three equal cards — Customized Maintenance / Satisfaction / Long-Term Discounts
// Per Geraldine's PDF slides 10 + 11. Visual language matches the rest of the
// TC blocks: TCHeadingStack section header, mono kicker labels, teal accents,
// numbered badges, and framer-motion fade-up stagger on scroll-in.

'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Calendar, Shield, Sparkles } from 'lucide-react'
import { TCHeadingStack } from '@/components/ui/TCHeading'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcBenefits'
}

const BENEFITS = [
  {
    n: '01',
    icon: Calendar,
    kicker: 'Programs',
    title: 'Customized Maintenance Programs',
    // Slide 11 — paragraph form, replaces old bullet list
    body: "Customized Maintenance Programs are personalized cleaning and maintenance plans tailored to meet each client's unique needs. Rather than offering a one-size-fits-all service, we create customized solutions based on factors such as service frequency, type of cleaning required, priority areas, and your specific preferences and budget. Our goal is to provide efficient, reliable, and flexible cleaning services that fit your lifestyle or business needs.",
  },
  {
    n: '02',
    icon: Shield,
    kicker: 'The Promise',
    title: 'Satisfaction Guarantee',
    body: 'We are committed to delivering high-quality cleaning and disinfection services. Our Satisfaction Guarantee ensures that if our clients are not completely satisfied with the results, we will make it right. We strive for excellence in every service, providing reliability, professionalism, and peace of mind.',
  },
  {
    n: '03',
    icon: Sparkles,
    kicker: 'Loyalty',
    title: 'Discounts for Long-Term Contracts',
    body: 'We value long-term partnerships, which is why we offer exclusive discounts for clients who commit to recurring cleaning services. Our long-term contracts provide cost-effective solutions while ensuring consistent, high-quality maintenance tailored to your needs.',
  },
]

export function TCBenefitsClient(_props: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative bg-[#f4f7f6] py-[100px] lg:py-[140px] px-[5%]">
      <div ref={ref} className="max-w-[1400px] mx-auto">

        {/* ── Section heading — matches site language via TCHeadingStack ───── */}
        <motion.div
          className="mb-12 lg:mb-16 max-w-[640px]"
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <TCHeadingStack
            ghostKicker="Tailored"
            mainLine="Built For"
            secondaryLine="your lifestyle."
            level="h2"
            theme="light"
            size="md"
          />
          <p className="mt-5 text-[1rem] leading-[1.7] text-navy-deep/60 max-w-[520px]">
            Three commitments that shape every cleaning we deliver — flexibility, accountability, and a partnership that rewards long-term care.
          </p>
        </motion.div>

        {/* ── 3 equal cards — grid stretches them to identical width AND height ──── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon
            return (
              <motion.div
                key={b.title}
                className="group relative bg-white border border-slate-200 flex flex-col h-full overflow-hidden transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_24px_50px_-22px_rgba(13,27,46,0.18)]"
                initial={{ opacity: 0, y: 28 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.2 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* Teal top accent — brand line on every card */}
                <div className="h-[3px] bg-teal" />

                {/* Watermark number — subtle, large, low-opacity teal in top-right */}
                <span
                  className="absolute top-[18px] right-[22px] font-mono font-black leading-none select-none pointer-events-none"
                  style={{
                    fontSize: '2.4rem',
                    color: 'rgba(23,176,171,0.12)',
                    letterSpacing: '-2px',
                  }}
                  aria-hidden="true"
                >
                  {b.n}
                </span>

                {/* Content */}
                <div className="relative z-[1] p-8 lg:p-10 flex flex-col h-full">

                  {/* Icon tile */}
                  <div
                    className="w-12 h-12 flex items-center justify-center mb-6 flex-shrink-0 transition-colors duration-300 group-hover:bg-teal/15"
                    style={{ background: 'rgba(23,176,171,0.10)' }}
                  >
                    <Icon className="w-5 h-5 text-teal" strokeWidth={2} />
                  </div>

                  {/* Mono kicker — matches TCWhyTop / TCAboutSection pattern */}
                  <span
                    className="font-mono text-teal font-bold uppercase text-[0.68rem] mb-[10px]"
                    style={{ letterSpacing: '2px' }}
                  >
                    {b.kicker}
                  </span>

                  {/* Title — bold navy, tight tracking */}
                  <h3 className="text-[1.15rem] lg:text-[1.25rem] font-extrabold text-navy-deep mb-4 leading-[1.25] tracking-[-0.3px]">
                    {b.title}
                  </h3>

                  {/* Body — flex-1 keeps card heights equal */}
                  <p className="text-[0.92rem] leading-[1.7] text-navy-deep/65 flex-1">
                    {b.body}
                  </p>

                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
