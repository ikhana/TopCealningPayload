// blocks/Faq/Component.client.tsx

'use client'

import React, { useState, useId } from 'react'
import type { FaqBlock } from '@/payload-types'
import { BlockWrapper } from '@/components/BlockWrapper'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/CMSLink'
import { BorderButton } from '@/components/ui/BorderButton'
import { cn } from '@/utilities/cn'

const GradientBorders = () => (
  <>
    <div className="pointer-events-none absolute left-0 top-2 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="pointer-events-none absolute left-0 bottom-2 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="pointer-events-none absolute left-2 top-0 h-full w-px bg-gradient-to-b from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="pointer-events-none absolute right-2 top-0 h-full w-px bg-gradient-to-b from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
  </>
)

function PlusToX({ open }: { open: boolean }) {
  return (
    <span
      className="relative mr-4 inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-primary transition-all duration-300 flex-shrink-0"
      aria-hidden="true"
    >
      <span className={cn(
        "absolute h-[2px] w-5 bg-primary transition-transform duration-300",
        open ? "rotate-45" : ""
      )} />
      <span className={cn(
        "absolute h-[2px] w-5 bg-primary transition-transform duration-300",
        open ? "-rotate-45" : "rotate-90"
      )} />
    </span>
  )
}

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
  const panelId = `${baseId}-a-${index}`

  return (
    <div className="mb-4 relative">
      <GradientBorders />

      <div className="overflow-hidden pt-6 pb-6 px-6">
        <h3 id={headingId} className="sr-only">{item.question}</h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          className="group flex w-full items-start gap-2 text-left focus:outline-none hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
          onClick={() => onToggle(index)}
        >
          <PlusToX open={open} />
          <span className="text-base lg:text-lg font-semibold leading-snug text-primary font-heading pt-1">
            {item.question}
          </span>
        </button>

        <div
          id={panelId}
          role="region"
          aria-labelledby={headingId}
          className={cn(
            "transition-all duration-300 overflow-hidden",
            open ? "mt-4 pl-14 max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="prose prose-base dark:prose-invert max-w-none
            prose-p:text-foreground dark:prose-p:text-white prose-p:leading-relaxed prose-p:my-2
            prose-strong:text-foreground dark:prose-strong:text-white prose-strong:font-semibold
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-ul:my-2 prose-li:text-foreground dark:prose-li:text-white
          ">
            <RichText data={item.answer} enableGutter={false} enableProse={true} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function FaqClient(props: FaqBlock) {
  const {
    sectionId,
    backgroundStyle = 'muted',
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

  const backgroundClasses = {
    default: 'bg-background dark:bg-card',
    muted: 'bg-muted dark:bg-card',
    card: 'bg-card dark:bg-card',
  }

  return (
    <BlockWrapper sectionId={sectionId}>
      <div className={cn('py-12 md:py-16', backgroundClasses[backgroundStyle as keyof typeof backgroundClasses])}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Left Panel */}
            <div className="lg:w-1/3 flex flex-col justify-start">
              {eyebrow && (
                <p className="text-muted-foreground font-medium text-sm uppercase tracking-wider mb-4">
                  {eyebrow}
                </p>
              )}
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 font-heading">
                {title}
              </h2>
              
              {description && (
                <div className="prose prose-lg dark:prose-invert max-w-none mb-8
                  prose-p:text-foreground dark:prose-p:text-white prose-p:leading-relaxed
                ">
                  <RichText data={description} enableGutter={false} enableProse={true} />
                </div>
              )}

              {contactItems && contactItems.length > 0 && (
                <>
                  <div className="w-full h-px bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark my-6" />
                  
                  <div className="space-y-4 text-base md:text-lg">
                    {contactItems.map((item, idx) => (
                      <div key={idx}>
                        <span className="font-semibold text-primary font-heading">
                          {item.label}:
                        </span>
                        <a
                          href={item.link}
                          className="ml-2 text-foreground dark:text-white hover:text-primary transition-colors font-body"
                        >
                          {item.value}
                        </a>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right Panel */}
            <div className="lg:w-2/3">
              <div className="space-y-6">
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

              {/* CTA Section */}
              {(ctaHeading || ctaDescription || cta?.link) && (
                <div className="mt-12 p-6 bg-card/50 dark:bg-card/30 backdrop-blur-sm rounded-lg text-center relative">
                  <GradientBorders />
                  
                  <div className="relative z-10">
                    {ctaHeading && (
                      <h3 className="text-xl md:text-2xl font-semibold text-primary mb-2 font-heading">
                        {ctaHeading}
                      </h3>
                    )}
                    
                    {ctaDescription && (
                      <div className="prose prose-base dark:prose-invert max-w-none mb-4
                        prose-p:text-foreground dark:prose-p:text-white
                      ">
                        <RichText data={ctaDescription} enableGutter={false} enableProse={true} />
                      </div>
                    )}
                    
                    {cta?.link && (
                      <div className="mb-4">
                        <CMSLink link={cta.link}>
                          <BorderButton
                            text={cta.link.label || 'Contact Us'}
                            variant="filled"
                          />
                        </CMSLink>
                      </div>
                    )}
                    
                    {disclaimer && (
                      <p className="mt-3 text-xs text-muted-foreground font-body">
                        {disclaimer}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </BlockWrapper>
  )
}