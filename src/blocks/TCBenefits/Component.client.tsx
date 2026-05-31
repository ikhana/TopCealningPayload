// src/blocks/TCBenefits/Component.client.tsx
// 3 equal cards — Customized Maintenance / Satisfaction / Long-Term Discounts
// Geraldine's PDF slides 10 + 11. Framer-motion fade-up stagger on scroll-in.

'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Calendar, Shield, Sparkles } from 'lucide-react'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcBenefits'
}

const BENEFITS = [
  {
    icon: Calendar,
    title: 'Customized Maintenance Programs',
    // Slide 11 — updated copy (paragraph form, replaces the old bullet list)
    body: "Customized Maintenance Programs are personalized cleaning and maintenance plans tailored to meet each client's unique needs. Rather than offering a one-size-fits-all service, we create customized solutions based on factors such as service frequency, type of cleaning required, priority areas, and your specific preferences and budget. Our goal is to provide efficient, reliable, and flexible cleaning services that fit your lifestyle or business needs.",
  },
  {
    icon: Shield,
    title: 'Satisfaction Guarantee',
    body: 'We are committed to delivering high-quality cleaning and disinfection services. Our Satisfaction Guarantee ensures that if our clients are not completely satisfied with the results, we will make it right. We strive for excellence in every service, providing reliability, professionalism, and peace of mind.',
  },
  {
    icon: Sparkles,
    title: 'Discounts for Long-Term Contracts',
    body: 'We value long-term partnerships, which is why we offer exclusive discounts for clients who commit to recurring cleaning services. Our long-term contracts provide cost-effective solutions while ensuring consistent, high-quality maintenance tailored to your needs.',
  },
]

export function TCBenefitsClient(_props: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="bg-[#f4f7f6] py-[80px] lg:py-[120px] px-[5%]">
      <div ref={ref} className="max-w-[1400px] mx-auto">

        {/* Section heading — small, sets context */}
        <motion.div
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[2px] text-teal mb-3">
            What sets us apart
          </p>
          <h2 className="text-[clamp(1.8rem,3vw,2.4rem)] font-black tracking-[-1px] text-navy-deep leading-tight">
            Built for your lifestyle.
          </h2>
        </motion.div>

        {/* 3 equal cards — grid-cols stretches them to identical width AND height */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon
            return (
              <motion.div
                key={b.title}
                className="bg-white border border-slate-200 p-7 lg:p-9 flex flex-col h-full transition-shadow duration-300 hover:shadow-[0_18px_40px_-18px_rgba(13,27,46,0.12)]"
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.45,
                  delay: 0.15 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* Icon + title */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(23,176,171,0.10)' }}
                  >
                    <Icon className="w-5 h-5 text-teal" />
                  </div>
                  <h3 className="text-[1.05rem] lg:text-[1.1rem] font-bold text-navy-deep leading-snug">
                    {b.title}
                  </h3>
                </div>

                {/* Body — flex-1 pushes any future footer/CTA to bottom + keeps heights equal */}
                <p className="text-[0.92rem] leading-[1.65] text-navy-deep/65 flex-1">
                  {b.body}
                </p>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
