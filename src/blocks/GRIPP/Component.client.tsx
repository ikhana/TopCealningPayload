// blocks/GRIPP/Component.client.tsx

'use client'

import React from 'react'
import type { GRIPPBlock } from '@/payload-types'
import { BlockWrapper } from '@/components/BlockWrapper'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/utilities/cn'
import Image from 'next/image'

const GradientBorders = () => (
  <>
    <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
  </>
)

const galleryImages = [
  'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
  'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
  'https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&q=80',
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
]

const grippCards = [
  {
    letter: 'G',
    title: 'Guarantees',
    description: 'Principal protection',
    icon: 'Shield',
    startX: '5%',
    endX: '5%',
    delay: 0,
  },
  {
    letter: 'R',
    title: 'Rate of Return',
    description: 'Indexed crediting',
    icon: 'TrendingUp',
    startX: '75%',
    endX: '25%',
    delay: 0.3,
  },
  {
    letter: 'I',
    title: 'Indexed Growth',
    description: 'Market gains protected',
    icon: 'LineChart',
    startX: '40%',
    endX: '45%',
    delay: 0.6,
  },
  {
    letter: 'P',
    title: 'Pension Income',
    description: 'Lifetime income',
    icon: 'DollarSign',
    startX: '15%',
    endX: '65%',
    delay: 0.9,
  },
  {
    letter: 'P',
    title: 'Potential Bonuses',
    description: 'Premium bonuses',
    icon: 'Gift',
    startX: '85%',
    endX: '85%',
    delay: 1.2,
  },
]

const infoCards = [
  {
    title: 'From Variable (Unprotected) to Indexed (Protected)',
    points: [
      'Capture upside to a cap with protection from market downturns.',
      'Avoid sequence-of-returns risk in retirement.',
      'Accumulation value links to an external index, not invested directly in the stock market.',
      'Optional riders may provide lifetime income guarantees.',
    ],
  },
  {
    title: 'G R I P P',
    points: [
      'Guarantees',
      'Rate of Return (indexed crediting methods)',
      'Indexed Growth',
      'Pension-like Income',
      'Potential Bonuses',
    ],
  },
]

export function GRIPPClient(props: GRIPPBlock) {
  const { sectionId, title, subtitle } = props

  return (
    <BlockWrapper sectionId={sectionId}>
      <section className="bg-background dark:bg-card py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground font-bold font-heading mb-3 md:mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-base md:text-lg text-muted-foreground font-body">
                {subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12 md:mb-16">
            {infoCards.map((card, idx) => (
              <div key={idx} className="relative bg-muted dark:bg-card/50 backdrop-blur-sm">
                <GradientBorders />
                <div className="relative z-10 p-6 md:p-8">
                  <h3 className="text-lg md:text-xl font-semibold text-primary font-heading mb-4">
                    {card.title}
                  </h3>
                  <ul className="space-y-3">
                    {card.points.map((point, pointIdx) => (
                      <li key={pointIdx} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        <span className="text-sm md:text-base text-foreground dark:text-white/90 leading-relaxed font-body">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="relative min-h-[600px] lg:min-h-[700px]">
            
            <div className="grid grid-cols-2 md:grid-cols-3">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="relative aspect-video -ml-[1px] -mt-[1px]">
                  <GradientBorders />
                  <Image
                    src={img}
                    alt={`Financial planning visual ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="hidden lg:block absolute inset-0 pointer-events-none">
              {grippCards.map((card, idx) => (
                <div
                  key={idx}
                  className="rain-drop-card absolute w-40 xl:w-48"
                  style={{
                    left: card.endX,
                    bottom: '20px',
                    '--start-x': card.startX,
                    '--end-x': card.endX,
                    '--delay': `${card.delay}s`,
                  } as React.CSSProperties}
                >
                  <div className="relative bg-card/85 dark:bg-card/75 backdrop-blur-lg shadow-2xl pointer-events-auto">
                    <GradientBorders />
                    <div className="relative z-10 p-4 xl:p-5 flex flex-col items-center text-center">
                      <div className="text-4xl xl:text-5xl font-bold text-primary/40 font-heading mb-2">
                        {card.letter}
                      </div>
                      
                      <div className="mb-2">
                        <Icon
                          name={card.icon}
                          size={24}
                          className="text-primary"
                        />
                      </div>
                      
                      <h4 className="text-sm xl:text-base font-semibold text-primary font-heading mb-1">
                        {card.title}
                      </h4>
                      
                      <p className="text-xs text-foreground dark:text-white/90 leading-tight font-body">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:hidden grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
              {grippCards.map((card, idx) => (
                <div key={idx} className="relative bg-card/85 dark:bg-card/75 backdrop-blur-lg">
                  <GradientBorders />
                  <div className="relative z-10 p-4 flex flex-col items-center text-center">
                    <div className="text-3xl font-bold text-primary/40 font-heading mb-2">
                      {card.letter}
                    </div>
                    <div className="mb-2">
                      <Icon name={card.icon} size={20} className="text-primary" />
                    </div>
                    <h4 className="text-xs font-semibold text-primary font-heading mb-1">
                      {card.title}
                    </h4>
                    <p className="text-[10px] text-foreground dark:text-white/90 leading-tight font-body">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 md:mt-10 text-center">
            <p className="text-xs md:text-sm text-muted-foreground font-body max-w-4xl mx-auto">
              Product features, caps, participation rates, and riders vary by carrier and state. 
              Fixed indexed annuities are not direct market investments. 
              Consult a licensed financial professional for personalized guidance.
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes rainDrop {
          0% {
            transform: translateX(var(--start-x)) translateY(-100vh) rotate(-5deg);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translateX(0) translateY(0) rotate(0deg);
            opacity: 1;
          }
        }

        .rain-drop-card {
          animation: rainDrop 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          animation-delay: var(--delay);
          opacity: 0;
        }
      `}</style>
    </BlockWrapper>
  )
}