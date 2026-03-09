// blocks/Faq/Component.client.tsx
// TopCleaning theme — deep navy bg, teal accents, glass accordion rows.
// Left sticky panel (heading + contact) | Right scrollable accordion.
// Config and payload-types unchanged — only presentation updated.

'use client'

import React, { useState, useId } from 'react'
import type { FaqBlock } from '@/payload-types'
import { BlockWrapper } from '@/components/BlockWrapper'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/CMSLink'
import { TCHeadingStack } from '@/components/ui/TCHeading'
import { cn } from '@/utilities/cn'

/* ── Animated +/× icon ───────────────────────────────────────────── */
function PlusToX({ open }: { open: boolean }) {
  return (
    <span
      className="relative flex-shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full border border-teal/40 transition-colors duration-300"
      style={{ background: open ? 'rgba(23,176,171,0.12)' : 'transparent' }}
      aria-hidden="true"
    >
      <span className={cn('absolute h-[2px] w-4 bg-teal transition-transform duration-300', open ? 'rotate-45' : '')} />
      <span className={cn('absolute h-[2px] w-4 bg-teal transition-transform duration-300', open ? '-rotate-45' : 'rotate-90')} />
    </span>
  )
}

/* ── Single accordion row ────────────────────────────────────────── */
function FaqRow({
  item,
  index,
  open,
  onToggle,
  baseId,
}: {
  item: any
  index: number
  open: boolean
  onToggle: (i: number) => void
  baseId: string
}) {
  const headingId = `${baseId}-q-${index}`
  const panelId   = `${baseId}-a-${index}`

  return (
    <div
      className={cn(
        'rounded-lg border transition-all duration-300',
        open
          ? 'border-teal/40 bg-teal/[0.06]'
          : 'border-white/[0.08] bg-white/[0.03] hover:border-white/[0.15]',
      )}
    >
      {/* sr-only heading for accessibility */}
      <h3 id={headingId} className="sr-only">{item.question}</h3>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-4 px-5 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 rounded-lg"
        onClick={() => onToggle(index)}
      >
        <PlusToX open={open} />
        <span className="text-base lg:text-lg font-semibold text-white leading-snug font-heading">
          {item.question}
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={headingId}
        className={cn(
          'transition-all duration-300 overflow-hidden',
          open ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="px-5 pb-6 pl-[4.25rem]">
          <div className="prose prose-base max-w-none
            prose-p:text-white/65 prose-p:leading-relaxed prose-p:my-2
            prose-strong:text-white prose-strong:font-semibold
            prose-a:text-teal prose-a:no-underline hover:prose-a:underline
            prose-ul:my-2 prose-li:text-white/65
          ">
            <RichText data={item.answer} enableGutter={false} enableProse={true} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main export ─────────────────────────────────────────────────── */
export function FaqClient(props: FaqBlock) {
  const {
    sectionId,
    eyebrow,
    title,
    description,
    contactItems,
    faqs,
    ctaHeading,
    ctaDescription,
    cta,
    disclaimer,
  } = props

  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const baseId = useId()
  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i))

  return (
    <BlockWrapper sectionId={sectionId}>
      <section className="bg-[#080d1a] py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

            {/* ── Left sticky panel ──────────────────────────────── */}
            <div className="lg:w-2/5 lg:sticky lg:top-24 self-start">
              <TCHeadingStack
                ghostKicker={eyebrow ?? 'FAQ'}
                mainLine={title ?? 'Frequently Asked'}
                secondaryLine="Questions"
                level="h2"
                theme="dark"
                size="md"
                accentColor="#17b0ab"
                className="mb-6"
              />

              {description && (
                <div className="prose prose-base max-w-none mb-8
                  prose-p:text-white/60 prose-p:leading-relaxed
                ">
                  <RichText data={description} enableGutter={false} enableProse={true} />
                </div>
              )}

              {contactItems && contactItems.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/[0.08] space-y-4">
                  {contactItems.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-0.5">
                      <span className="font-mono text-[0.6rem] uppercase tracking-[2.5px] text-teal">
                        {item.label}
                      </span>
                      <a
                        href={item.link}
                        className="text-white/75 hover:text-teal transition-colors text-sm"
                      >
                        {item.value}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right accordion panel ───────────────────────────── */}
            <div className="lg:w-3/5">
              <div className="space-y-3">
                {faqs && faqs.map((item, i) => (
                  <FaqRow
                    key={i}
                    item={item}
                    index={i}
                    open={openIndex === i}
                    onToggle={toggle}
                    baseId={baseId}
                  />
                ))}
              </div>

              {/* CTA card */}
              {(ctaHeading || cta?.link) && (
                <div
                  className="mt-10 rounded-lg border border-teal/25 bg-teal/[0.04] backdrop-blur-sm px-8 py-8 text-center"
                  style={{ boxShadow: '0 0 40px rgba(23,176,171,0.06)' }}
                >
                  {ctaHeading && (
                    <p className="font-heading font-bold text-xl text-white mb-2">
                      {ctaHeading}
                    </p>
                  )}

                  {ctaDescription && (
                    <div className="prose prose-base max-w-none mb-6
                      prose-p:text-white/60 prose-p:leading-relaxed
                    ">
                      <RichText data={ctaDescription} enableGutter={false} enableProse={true} />
                    </div>
                  )}

                  {cta?.link && (
                    <CMSLink link={cta.link}>
                      <span className="inline-flex items-center justify-center bg-teal text-[#080d1a] font-mono font-black uppercase tracking-[2px] text-xs px-8 py-3 hover:bg-teal/85 transition-colors cursor-pointer">
                        {cta.link.label ?? 'Contact Us'}
                      </span>
                    </CMSLink>
                  )}

                  {disclaimer && (
                    <p className="mt-4 text-xs text-white/35">{disclaimer}</p>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </BlockWrapper>
  )
}
