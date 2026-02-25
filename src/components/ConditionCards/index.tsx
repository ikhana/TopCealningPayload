// components/ConditionCards.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { Apple, HeartPulse, Ribbon, Brain, ArrowRight, X } from 'lucide-react'
import Link from 'next/link'

type Item = {
  id: string
  title: string
  desc: string
  href?: string
  icon: React.ReactNode
}

const ITEMS: Item[] = [
  {
    id: 'weight',
    title: 'Weight Loss',
    desc: "Designed to capture the key factors behind your body's weight-loss and weight-gain mechanisms.",
    icon: <Apple className="h-6 w-6" />,
    href: '#',
  },
  {
    id: 'wellness',
    title: 'Wellness Health',
    desc: 'Evaluates red blood cells, electrolytes, thyroid function, cardiac risk and more for better health.',
    icon: <HeartPulse className="h-6 w-6" />,
    href: '#',
  },
  {
    id: 'cancer',
    title: 'Cancer Testing',
    desc: 'Panels include tumor markers that help detect cancers of the liver, pancreas, prostate, GI tract, breast and ovaries.',
    icon: <Ribbon className="h-6 w-6" />,
    href: '#',
  },
  {
    id: 'tbi',
    title: 'Traumatic Brain Injury',
    desc: 'Investigate symptoms linked to TBI—now recognized as a contributor to hormone deficiencies.',
    icon: <Brain className="h-6 w-6" />,
    href: '#',
  },
]

export default function ConditionCards() {
  const [active, setActive] = useState<Item | null>(null)

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setActive(null)
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [active])

  return (
    <section className="relative py-10 md:py-14 ">
      <div
        className="pointer-events-none absolute inset-0 -z-10
                   bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.06)_1px,transparent_1px)]
                   dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_1px)]
                   [background-size:18px_18px]"
      />

      <div className="mx-auto max-w-7xl p-12 bg-[#de4c1c0d] dark:bg-[#0f172017] rounded-md">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 -mt-[120px]">
          {ITEMS.map((it) => (
            <article
              key={it.id}
              className="group relative overflow-hidden rounded-2xl p-6 transition
                         bg-white ring-1 ring-slate-200 shadow-sm hover:-translate-y-1.5 
                         dark:bg-[#445866] 
                         "
            >
              {/* <div
                className="absolute left-0 right-0 top-0 h-1
                              bg-gradient-to-r from-coral via-coral/60 to-brand-blue
                              dark:from-white/15 dark:via-white/25 dark:to-white/15"
              /> */}

              <div
                className="mb-4 inline-grid h-12 w-12 place-items-center rounded-lg ring-1
                              bg-coral/10 text-coral ring-coral/20
                              dark:bg-white/10 dark:text-white dark:ring-white/15"
              >
                {it.icon}
              </div>

              <h3
                className="text-xl lg:text-2xl font-bold font-heading leading-tight tracking-wide
                             text-dark-navy group-hover:text-coral
                             dark:text-white dark:group-hover:text-white"
              >
                {it.title}
              </h3>

              <p
                className="mt-2 text-base lg:text-lg font-body leading-relaxed
                            text-blue-gray group-hover:text-dark-navy
                            dark:text-white/80 dark:group-hover:text-white"
              >
                {it.desc}
              </p>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setActive(it)}
                  className="inline-flex ring-1 ring-[#FF6B6B]/40 cursor-pointer p-1.5 rounded-md items-center text-xs font-semibold text-coral hover:opacity-90"
                >
                  See More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {active && <MiniInfoModal item={active} onClose={() => setActive(null)} />}
    </section>
  )
}

function MiniInfoModal({ item, onClose }: { item: Item; onClose: () => void }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setShow(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mini-title"
      className="fixed inset-0 z-[999] flex items-center justify-center"
    >
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-200 ${show ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative z-10 w-[92%] max-w-md rounded-2xl border
                    bg-white text-coral border-coral/25
                    dark:bg-[#0F172017] dark:text-white dark:border-white/10
                    shadow-xl transition-all duration-200 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full
                     bg-coral/10 text-coral hover:bg-coral/15
                     dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-5">
          <div
            className="mb-3 inline-grid h-10 w-10 place-items-center rounded-md ring-1
                          bg-coral/10 text-coral ring-coral/20
                          dark:bg-white/10 dark:text-white dark:ring-white/15"
          >
            {item.icon}
          </div>

          <h4 id="mini-title" className="text-lg font-semibold">
            {item.title}
          </h4>

          <p className="mt-2 text-sm  text-black dark:text-white  leading-relaxed">{item.desc}</p>

          <ul className="mt-3 space-y-1 text-sm text-black dark:text-white">
            <li>• Home sample available</li>
            <li>• Certified staff</li>
            <li>• Results within 24–48h</li>
          </ul>

          <div className="mt-4 flex justify-between items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md w-100 px-3 py-2 text-sm
                         ring-1 ring-current hover:opacity-90"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                window.alert('You can start')
                onClose()
              }}
              className="rounded-md w-100 bg-coral px-3 py-2 text-sm text-white hover:opacity-95
                         dark:bg-coral"
            >
              Book this test
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
