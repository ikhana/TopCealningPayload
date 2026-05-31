// src/blocks/TCCtaBanner/Component.client.tsx
// Closing CTA banner — two visual variants (teal spotlight or navy statement).
//
// Content (slide 13):
//   Heading  : "Ready to experience our exceptional cleaning service?"
//   Subtitle : "Book your cleaning today and enjoy a spotless space."
//              (note: word "tomorrow" removed per Geraldine's slide 13)
//   Button   : "Book Now →" → /booking
//
// Animation: framer-motion fade-up on scroll-in, matching the TCBenefits
// pattern used in the previous block for consistency.

'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { TCButton } from '@/components/ui/TCButton'

type Variant = 'teal' | 'navy'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcCtaBanner'
  variant?: Variant
}

const HEADING = 'Ready to experience our exceptional cleaning service?'
const SUBTITLE = 'Book your cleaning today and enjoy a spotless space.'

export function TCCtaBannerClient({ variant = 'teal' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const isTeal = variant === 'teal'

  return (
    <section
      ref={ref}
      // Outer spacing wraps the banner — keeps it visually distinct from
      // adjacent sections (matches TCServiceCommitment Section 3 spacing pattern)
      className="px-[5%] py-[60px] lg:py-[80px]"
    >
      <motion.div
        className={
          isTeal
            ? 'relative bg-teal text-white mx-auto max-w-[1400px]'
            : 'relative bg-[#0d1b2e] text-white mx-auto max-w-[1400px]'
        }
        style={
          isTeal
            ? {
                // Diagonal clip-path — preserves the existing brand visual signature
                clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)',
                boxShadow: '0 20px 60px -25px rgba(23,176,171,0.35)',
              }
            : {
                boxShadow: '0 20px 60px -25px rgba(13,27,46,0.35)',
              }
        }
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={
            'flex flex-col lg:flex-row items-center justify-between gap-7 lg:gap-10 ' +
            (isTeal
              ? 'px-[8%] lg:px-[10%] py-[60px] lg:py-[70px]'
              : 'px-[5%] lg:px-[8%] py-[60px] lg:py-[70px]')
          }
        >
          {/* Left: heading + subtitle */}
          <div className="text-center lg:text-left max-w-[720px]">
            <h3 className="text-[1.6rem] lg:text-[2rem] font-black tracking-[-0.5px] leading-[1.2] mb-3">
              {HEADING}
            </h3>
            <p
              className="text-[1rem] lg:text-[1.05rem] leading-[1.6] opacity-90 m-0"
            >
              {SUBTITLE}
            </p>
          </div>

          {/* Right: book now button */}
          <div className="flex-shrink-0">
            <TCButton
              // Teal variant: white button stands out on teal bg
              // Navy variant: primary (teal) button stands out on navy bg
              variant={isTeal ? 'light' : 'primary'}
              href="/booking"
            >
              Book Now
            </TCButton>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
