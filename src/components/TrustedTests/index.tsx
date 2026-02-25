'use client'

import * as React from 'react'
import { X } from 'lucide-react'

type StandardCardProps = {
  title: string
  description: string
  iconSrc: string
  ctaLabel?: string
  href?: string
  ribbon?: string
}

export default function StandardCard({
  title,
  description,
  iconSrc,
  ctaLabel = 'Click to View',
  href = '#',
  ribbon,
}: StandardCardProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
    
      <div
        className="
          group relative overflow-hidden rounded-2xl p-6 lg:p-8
          border-2 shadow-lg transition-all duration-500
          bg-white text-coral border-coral/25
          dark:bg-[#0F172017] dark:text-white dark:border-white/10
          hover:-translate-y-2 hover:shadow-xl
        "
      >
        {ribbon && (
          <div className="absolute left-6 -top-3">
            <div className="relative inline-flex items-center rounded px-3 py-1 text-xs font-semibold tracking-wide text-white bg-coral dark:bg-white/15">
              {ribbon}
              <span className="absolute -right-1 top-1.5 h-2.5 w-2.5 rotate-45 bg-coral dark:bg-white/15" />
            </div>
          </div>
        )}

        {/* icon chip */}
        <div className="relative mb-5 inline-flex">
          <div className="grid place-items-center h-16 w-16 rounded-xl bg-white ring-1 ring-coral/30 shadow-sm dark:bg-white/10 dark:ring-white/20">
            <img
              src={iconSrc}
              alt={title}
              className="h-8 w-8 object-contain"
              style={{
                filter:
                  'invert(33%) sepia(91%) saturate(1362%) hue-rotate(350deg) brightness(90%) contrast(94%)',
              }}
            />
          </div>

          {/* corners */}
          <span className="pointer-events-none absolute -left-2 -top-2 h-6 w-6 border-l-2 border-t-2 border-coral dark:border-white/60 rounded-tl-md" />
          <span className="pointer-events-none absolute -right-2 -top-2 h-6 w-6 border-r-2 border-t-2 border-coral dark:border-white/60 rounded-tr-md" />
          <span className="pointer-events-none absolute -left-2 -bottom-2 h-6 w-6 border-l-2 border-b-2 border-coral dark:border-white/60 rounded-bl-md" />
          <span className="pointer-events-none absolute -right-2 -bottom-2 h-6 w-6 border-r-2 border-b-2 border-coral dark:border-white/60 rounded-br-md" />
        </div>

        <h3 className="text-xl lg:text-2xl font-bold font-heading text-coral tracking-wide group-hover:text-coral dark:text-white dark:group-hover:text-white">
          {title}
        </h3>

        <p className="mt-2 text-blue-gray lg:text-lg leading-relaxed">{description}</p>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative mt-5 inline-flex items-center cursor-pointer gap-2 rounded-md px-3 py-1.5 text-sm font-semibold text-current"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-md border border-coral dark:border-white
                       opacity-0 scale-95 transition-all duration-300 ease-out
                       group-hover:opacity-100 group-hover:scale-100"
          />
          <span className="relative z-10">{ctaLabel}</span>
          <svg
            className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {open && (
        <MiniInfoModal
          title={title}
          description={description}
          iconSrc={iconSrc}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

function MiniInfoModal({
  title,
  description,
  iconSrc,
  onClose,
}: {
  title: string
  description: string
  iconSrc: string
  onClose: () => void
}) {
  const [show, setShow] = React.useState(false)

  React.useEffect(() => {
    const id = requestAnimationFrame(() => setShow(true))
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(id)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mini-title"
      className="fixed inset-0 z-[999] flex items-center justify-center"
    >
      {/* overlay */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-200 ${
          show ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative z-10 w-[92%] max-w-md rounded-2xl border
                    bg-white text-coral border-coral/25
                    dark:bg-[#0F172017] dark:text-white dark:border-white/10
                    shadow-xl transition-all duration-200 ${
                      show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
      >
        {/* close */}
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
          {/* icon */}
          <div
            className="mb-3 inline-grid h-10 w-10 place-items-center rounded-md ring-1
                          bg-coral/10 text-coral ring-coral/20
                          dark:bg-white/10 dark:text-white dark:ring-white/15"
          >
            <img
              src={iconSrc}
              alt={title}
              className="h-5 w-5 object-contain"
              style={{
                filter:
                  'invert(33%) sepia(91%) saturate(1362%) hue-rotate(350deg) brightness(90%) contrast(94%)',
              }}
            />
          </div>

          <h4 id="mini-title" className="text-lg font-semibold">
            {title}
          </h4>

          <p className="mt-2 text-sm text-black dark:text-white leading-relaxed">
            {description}
          </p>

          <ul className="mt-3 space-y-1 text-sm text-black dark:text-white">
            <li>• Home sample available</li>
            <li>• Certified staff</li>
            <li>• Results in 24–48h</li>
          </ul>

          <div className="mt-4 flex justify-between items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md w-full px-3 py-2 text-sm ring-1 ring-current hover:opacity-90"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                window.alert('You can start')
                onClose()
              }}
              className="rounded-md w-full bg-coral px-3 py-2 text-sm text-white hover:opacity-95"
            >
              Book this test
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
