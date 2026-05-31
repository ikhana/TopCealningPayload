// src/blocks/TCProcess/Component.simple-steps.client.tsx
// "Our Process Is Simple" — Split Layout variant.
//
// Mirrors the old TopCleaning site's process design:
//   • Left column: 3 step cards stacked vertically (clickable, with details)
//   • Right column: active step's image, swaps with fade transition
//   • Auto-advance every 8 seconds when in view
//   • Click any step card to switch instantly
//
// Light palette throughout — no dark backgrounds (Geraldine's direction).

'use client'

import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { Calendar, Sparkles, Home, CheckCircle2 } from 'lucide-react'
import { TCHeadingStack } from '@/components/ui/TCHeading'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcProcess'
}

const STEPS = [
  {
    id: 1,
    icon: Calendar,
    title: 'Book Online',
    description: 'Easy online booking — pick a time, tell us what you need, and you’re set.',
    details: [
      'Choose your preferred date and time',
      'Specify your cleaning needs',
      'Get an instant price quote',
      'Secure online payment',
    ],
    image: '/images/process/booking.jpg',
  },
  {
    id: 2,
    icon: Sparkles,
    title: 'We Clean',
    description: 'Trained professionals arrive on schedule and clean every corner.',
    details: [
      'Background-checked, insured professionals',
      'Eco-friendly products on every visit',
      'Attention to every detail',
      'Quality check before we leave',
    ],
    image: '/images/process/cleaning.jpg',
  },
  {
    id: 3,
    icon: Home,
    title: 'You Relax',
    description: 'Sit back and enjoy your clean, fresh space.',
    details: [
      'Enjoy your spotless environment',
      '100% satisfaction guaranteed',
      'Book recurring service if you love it',
      'Leave us your feedback',
    ],
    image: '/images/process/relax.jpg',
  },
]

const AUTO_ADVANCE_MS = 8000

export function TCProcessSimpleSteps(_props: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeStep, setActiveStep] = useState(1)

  // Auto-rotate when section is in view
  useEffect(() => {
    if (!isInView) return
    const timer = setInterval(() => {
      setActiveStep((n) => (n % STEPS.length) + 1)
    }, AUTO_ADVANCE_MS)
    return () => clearInterval(timer)
  }, [isInView])

  const active = STEPS.find((s) => s.id === activeStep) ?? STEPS[0]

  return (
    <section
      ref={ref}
      className="relative bg-[#eef2f1] px-[5%] py-[80px] lg:py-[110px] overflow-hidden"
    >
      {/* Ghost watermark — matches the Monolith variant for visual continuity */}
      <div
        aria-hidden
        className="absolute right-[-8%] top-1/2 pointer-events-none select-none whitespace-nowrap"
        style={{
          transform: 'translateY(-50%) rotate(90deg)',
          fontFamily: 'var(--font-mono)',
          fontSize: '15vw',
          fontWeight: 900,
          color: 'rgba(23,176,171,0.04)',
          lineHeight: 1,
          zIndex: 0,
        }}
      >
        PROCESS
      </div>

      <div className="max-w-[1400px] mx-auto relative z-[1]">

        {/* ── Section heading ──────────────────────────────── */}
        <motion.div
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-block text-left">
            <TCHeadingStack
              ghostKicker="How It Works"
              mainLine="Our Process"
              secondaryLine="Is Simple"
              level="h2"
              theme="light"
              size="lg"
            />
          </div>
          <p className="mt-5 text-[1rem] lg:text-[1.05rem] leading-[1.7] text-navy-deep/65 max-w-[600px] mx-auto">
            We&apos;ve streamlined our cleaning process to make it as easy as
            possible for you. Just three simple steps to a spotless space.
          </p>
        </motion.div>

        {/* ── Header stepper — circles + labels, always visible (all screens) ────
            Matches Geraldine's PDF slide 13 visual: active = solid teal w/ white,
            inactive = soft teal-tinted w/ teal number. Clickable to jump steps. */}
        <div className="flex items-start justify-center gap-6 sm:gap-10 lg:gap-16 mb-12 lg:mb-16">
          {STEPS.map((step) => {
            const isActive = step.id === activeStep
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className="group flex flex-col items-center text-center"
              >
                <div
                  className={
                    'rounded-full flex items-center justify-center font-mono font-black mb-3 transition-all duration-400 ' +
                    'w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] lg:w-[80px] lg:h-[80px] ' +
                    'text-[1.4rem] sm:text-[1.6rem] lg:text-[1.85rem] ' +
                    (isActive
                      ? 'bg-teal text-white shadow-[0_10px_28px_-12px_rgba(23,176,171,0.55)] scale-100'
                      : 'bg-teal/[0.12] text-teal/75 group-hover:bg-teal/[0.18]')
                  }
                >
                  {step.id}
                </div>
                <span
                  className={
                    'text-[0.85rem] sm:text-[0.92rem] lg:text-[1rem] font-bold transition-colors duration-400 ' +
                    (isActive ? 'text-teal' : 'text-navy-deep/55 group-hover:text-navy-deep/80')
                  }
                >
                  {step.title}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── 2-col grid: steps left, image right ────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* LEFT — Step cards (stacked) */}
          <div className="flex flex-col gap-4">
            {STEPS.map((step, i) => {
              const isActive = step.id === activeStep
              const Icon = step.icon
              return (
                <motion.button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={
                    'group relative text-left bg-white border border-slate-200 overflow-hidden ' +
                    'transition-all duration-400 cursor-pointer ' +
                    (isActive
                      ? 'shadow-[0_18px_40px_-22px_rgba(23,176,171,0.45)]'
                      : 'hover:shadow-[0_12px_28px_-22px_rgba(13,27,46,0.18)]')
                  }
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {/* Left accent bar — fills with teal when active */}
                  <div
                    aria-hidden
                    className={
                      'absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-500 ' +
                      (isActive ? 'bg-teal' : 'bg-slate-200')
                    }
                  />

                  <div className="flex items-start gap-5 p-6 lg:p-7">
                    {/* Icon + number column */}
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <div
                        className={
                          'w-14 h-14 flex items-center justify-center transition-colors duration-400 ' +
                          (isActive
                            ? 'bg-teal text-white'
                            : 'bg-teal/[0.08] text-teal')
                        }
                      >
                        <Icon className="w-7 h-7" strokeWidth={2.5} />
                      </div>
                      <span
                        className={
                          'font-mono font-black text-[0.85rem] transition-colors duration-400 ' +
                          (isActive ? 'text-teal' : 'text-navy-deep/30')
                        }
                      >
                        {String(step.id).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Text content */}
                    <div className="flex-1">
                      <h3 className="text-[1.15rem] lg:text-[1.25rem] font-extrabold text-navy-deep tracking-[-0.3px] mb-1">
                        {step.title}
                      </h3>
                      <p className="text-[0.9rem] leading-[1.6] text-navy-deep/65">
                        {step.description}
                      </p>

                      {/* Details — expand when active */}
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.ul
                            className="mt-4 space-y-2 overflow-hidden"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          >
                            {step.details.map((detail, idx) => (
                              <motion.li
                                key={detail}
                                className="flex items-start gap-2 text-[0.85rem] text-navy-deep/75 leading-[1.5]"
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.06 }}
                              >
                                <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0 mt-[2px]" />
                                <span>{detail}</span>
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* RIGHT — Active step image with overlay */}
          <motion.div
            className="relative w-full md:sticky md:top-[120px] bg-white border border-slate-200 overflow-hidden"
            style={{ aspectRatio: '4 / 3', boxShadow: '0 24px 60px -24px rgba(13,27,46,0.18)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: 'easeInOut' }}
              >
                <img
                  src={active.image}
                  alt={active.title}
                  className="w-full h-full object-cover"
                />

                {/* Bottom gradient overlay for legibility */}
                <div
                  className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 75%, rgba(255,255,255,1) 100%)',
                  }}
                />

                {/* Info bar at bottom */}
                <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-teal text-white flex items-center justify-center font-mono font-black text-[1rem]">
                      {active.id}
                    </div>
                    <span className="font-mono text-teal text-[0.7rem] font-bold uppercase tracking-[2px]">
                      Step {String(active.id).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="text-[1.4rem] lg:text-[1.6rem] font-extrabold text-navy-deep tracking-[-0.5px] mb-1">
                    {active.title}
                  </h3>
                  <p className="text-[0.9rem] text-navy-deep/70 leading-[1.5] max-w-[420px]">
                    {active.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
