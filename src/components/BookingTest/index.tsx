'use client'

import React, { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'

type Props = {
  open: boolean
  onClose: () => void
  onCta?: () => void
  title?: string
  description?: string
  ctaText?: string
}

export default function SpotlightCardModal({
  open,
  onClose,
  onCta,
  title = 'Digital Strategy',
  description = `Strategic digital planning to drive revenue and business growth through
  data-driven approaches tailored to your objectives. Our expert team analyzes market trends
  and implements tactics that deliver measurable results.`,
  ctaText = 'GET STARTED',
}: Props) {
  const [show, setShow] = useState(false) 

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)

    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const id = requestAnimationFrame(() => setShow(true)) // ensure initial render has hidden state

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      cancelAnimationFrame(id)
      setShow(false) // reset for next open
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="spotlight-title"
      className="fixed inset-0 z-[999] flex items-center justify-center"
    >
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          show ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      <div
        className={`relative z-10 w-[92%] max-w-5xl rounded-[24px]
                    border border-white/10 bg-neutral-900/40 text-white
                    shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl
                    transition-all duration-300 ease-out
                    ${show ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-1'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-10 pr-28">
          <div className="flex items-start gap-5">
            <button
              type="button"
              aria-label="Next"
              className="shrink-0 h-20 w-20 rounded-full
                         bg-gradient-to-b from-[#FF7F50] to-[#E3432E]
                         ring-1 ring-white/15 shadow-[0_10px_30px_rgba(227,67,46,0.35)]
                         flex items-center justify-center
                         focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <ArrowRight className="h-10 w-10 text-white" />
            </button>

            <div className="flex flex-col max-w-[712px]">
              <h3
                id="spotlight-title"
                className="text-2xl sm:text-4xl font-extrabold tracking-tight"
              >
                {title}
              </h3>
              <p className="mt-6 text-md sm:text-md leading-relaxed text-white/90">{description}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            window.alert('You can start')
            ;(onCta || onClose)() 
          }}
          className="group absolute right-2 top-1/2 -translate-y-1/2
             h-[85%] w-24 rounded-3xl bg-coral
             shadow-[0_10px_30px_rgba(177,30,36,0.45)]
             ring-1 ring-black/20 flex items-center justify-center"
          aria-label={ctaText}
        >
          <span
            className="block font-bold text-sm tracking-[0.35em] text-white/95
               group-hover:tracking-[0.45em] transition-all duration-300
               [writing-mode:vertical-rl] rotate-180 select-none"
          >
            {ctaText}
          </span>
        </button>

        <div className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-white/10" />
      </div>
    </div>
  )
}
