// src/blocks/TCProcess/Component.simple-steps.client.tsx
// "Our Process Is Simple" — Simple Steps variant.
// Compact numbered stepper matching Geraldine's PDF slide 13:
//   3 numbered circles in a row, small labels below.
//
// Lighter, less visual weight than the Monolith variant. Suited for pages
// where the process is one of several elements and shouldn't dominate.

'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { TCHeadingStack } from '@/components/ui/TCHeading'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcProcess'
}

const STEPS = [
  { num: 1, title: 'Book Online' },
  { num: 2, title: 'We Clean' },
  { num: 3, title: 'You Relax' },
]

export function TCProcessSimpleSteps(_props: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="relative bg-[#eef2f1] px-[5%] py-[80px] lg:py-[110px]"
    >
      <div className="max-w-[1100px] mx-auto">

        {/* Heading — same TCHeadingStack as Monolith for visual continuity */}
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
              size="md"
            />
          </div>
          <p className="mt-5 text-[1rem] lg:text-[1.05rem] leading-[1.7] text-navy-deep/65 max-w-[560px] mx-auto">
            We&apos;ve streamlined our cleaning process to make it as easy as
            possible for you. Just three simple steps to a spotless space.
          </p>
        </motion.div>

        {/* 3 numbered circles + labels */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-10 md:gap-0">

          {/* Horizontal connector line (desktop only) — sits behind the circles */}
          <div
            aria-hidden
            className="hidden md:block absolute top-[42px] left-[10%] right-[10%] h-[2px]"
            style={{ background: 'rgba(23,176,171,0.20)' }}
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              className="relative flex flex-col items-center text-center flex-1 z-[1]"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.45,
                delay: 0.2 + i * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Numbered circle */}
              <div
                className="w-[84px] h-[84px] rounded-full flex items-center justify-center font-mono font-black text-[2rem] mb-5 bg-teal text-white shadow-[0_10px_28px_-12px_rgba(23,176,171,0.55)]"
              >
                {step.num}
              </div>

              {/* Label */}
              <span className="font-mono text-[0.72rem] font-bold uppercase tracking-[2px] text-teal mb-1">
                Step {String(step.num).padStart(2, '0')}
              </span>
              <h3 className="text-[1.15rem] lg:text-[1.25rem] font-extrabold text-navy-deep tracking-[-0.3px]">
                {step.title}
              </h3>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
