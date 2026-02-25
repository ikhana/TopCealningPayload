// blocks/ContactInfoCards/Component.client.tsx

'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { ContactInfoCardsBlock } from '@/payload-types'
import { BlockWrapper } from '@/components/BlockWrapper'
import { CMSLink } from '@/components/CMSLink'
import { BorderButton } from '@/components/ui/BorderButton'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/utilities/cn'

// Gradient borders component (reusable)
const GradientBorders = () => (
  <>
    <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
  </>
)

export function ContactInfoCardsClient(props: ContactInfoCardsBlock) {
  const {
    sectionId,
    backgroundStyle = 'default',
    cards,
  } = props

  const backgroundClasses = {
    default: 'bg-white dark:bg-[#1a2333]',
    muted: 'bg-muted dark:bg-card',
    card: 'bg-card dark:bg-card',
  }

  const rootRef = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!rootRef.current) return
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    io.observe(rootRef.current)
    return () => io.disconnect()
  }, [])

  return (
    <BlockWrapper sectionId={sectionId}>
      <section 
        ref={rootRef}
        className={cn(backgroundClasses[backgroundStyle as keyof typeof backgroundClasses])}
      >
        <div className="container mx-auto py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {cards && cards.map((card, idx) => {
              const delay = idx * 300
              
              // Map existing appearance values to BorderButton variants
              const appearance = (card.link as any)?.appearance
              const buttonVariant: 'filled' | 'outlined' | 'outlined-colored' = 
                appearance === 'default' ? 'filled' :
                appearance === 'outline' ? 'outlined-colored' : // Use outlined-colored for visible text
                'outlined-colored' // fallback
              
              // Different gradient colors for each card
              const gradientColors = [
                'hsl(var(--primary) / 0.35)', // Orange/primary
                'hsl(220, 70%, 50% / 0.35)',  // Blue
                'hsl(280, 70%, 50% / 0.35)',  // Purple
                'hsl(160, 70%, 50% / 0.35)',  // Teal
              ]
              const gradientColor = gradientColors[idx % gradientColors.length]
              
              return (
                <div
                  key={idx}
                  style={{ transitionDelay: `${delay}ms` }}
                  className={cn(
                    'transition-all duration-700 will-change-transform',
                    'flex flex-col min-h-[320px] relative overflow-hidden', // Added relative and overflow-hidden
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  )}
                >
                  {/* Radial gradient background shader - different for each card */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${gradientColor} 0%, transparent 75%)`,
                    }}
                  />
                  
                  {/* Content wrapper with relative positioning */}
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Icon Box with Gradient Borders */}
                    {card.icon && (
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-background dark:bg-card flex-shrink-0">
                        <GradientBorders />
                        <Icon 
                          name={card.icon} 
                          size={28} 
                          className="text-primary relative z-10" 
                        />
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="mt-6 sm:mt-8 text-xl font-semibold text-primary font-heading flex-shrink-0">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <div className="mt-4 sm:mt-5 text-base sm:text-[17px] leading-7 text-muted-foreground dark:text-foreground font-body flex-grow">
                      {card.description}
                    </div>

                    {/* Optional Link/Button */}
                    {card.link?.link && (
                      <div className="mt-6 flex-shrink-0">
                        <CMSLink link={card.link.link}>
                          <BorderButton
                            text={card.link.link.label || 'Learn More'}
                            variant={buttonVariant}
                            className="w-full"
                          />
                        </CMSLink>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </BlockWrapper>
  )
}