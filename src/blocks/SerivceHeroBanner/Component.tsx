// src/blocks/ServiceHeroBanner/Component.tsx
import { WorkshopButton } from '@/components/ui/WorkshopButton/WorkshopButton'
import type { Media as MediaType } from '@/payload-types'
import { cn } from '@/utilities/cn'
import React from 'react'

export type ServiceHeroBannerBlock = {
  backgroundImage?: number | MediaType | null
  mainHeading: string
  emphasizedText: string
  subHeading: string
  ctaButton: {
    text: string
    link: string
    openInNewTab?: boolean
  }
  overlayOpacity?: 'light' | 'medium' | 'dark'
  textAlignment?: 'left' | 'center' | 'right'
  blockType: 'serviceHeroBanner'
  id?: string
}

export const ServiceHeroBannerBlock: React.FC<ServiceHeroBannerBlock> = ({
  backgroundImage,
  mainHeading,
  emphasizedText,
  subHeading,
  ctaButton,
  overlayOpacity = 'medium',
  textAlignment = 'center',
  id,
}) => {
  // Handle background image
  const backgroundImageUrl = React.useMemo(() => {
    if (!backgroundImage) {
      // Default background image if none provided
      return '/images/backgrounds/service-hero-banner-bg.jpg'
    }

    if (typeof backgroundImage === 'object' && backgroundImage?.url) {
      return backgroundImage.url
    }

    return '/images/backgrounds/service-hero-banner-bg.jpg'
  }, [backgroundImage])

  // Overlay opacity classes
  const overlayClasses = {
    light: 'bg-dark-navy/30',
    medium: 'bg-dark-navy/50',
    dark: 'bg-dark-navy/70'
  }

  // Text alignment classes
  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  return (
    <section
      id={id}
      className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Geometric Overlay Pattern */}
      <div className="absolute inset-0 z-10 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="serviceHeroGrid" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="80" height="80" fill="none" stroke="hsl(var(--color-clinical-white))" strokeWidth="1" opacity="0.3"/>
              <circle cx="40" cy="40" r="2" fill="hsl(var(--color-coral))" opacity="0.4"/>
              <path d="M 40 30 L 40 50 M 30 40 L 50 40" stroke="hsl(var(--color-brand-blue))" strokeWidth="1" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#serviceHeroGrid)" />
        </svg>
      </div>

      {/* Dark Overlay */}
      <div className={cn(
        'absolute inset-0 z-20',
        overlayClasses[overlayOpacity]
      )} />

      {/* Medical Corner Accents */}
      <div className="absolute top-8 left-8 w-8 h-8 border-l-3 border-t-3 border-coral/60 z-30" />
      <div className="absolute top-8 right-8 w-8 h-8 border-r-3 border-t-3 border-brand-blue/60 z-30" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-l-3 border-b-3 border-orange/60 z-30" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-r-3 border-b-3 border-coral/60 z-30" />

      {/* Content Container */}
      <div className="relative z-30 container mx-auto px-6 py-16 lg:py-24">
        <div className={cn(
          'max-w-5xl mx-auto',
          textAlignClasses[textAlignment]
        )}>
          
          {/* Main Content */}
          <div className="space-y-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-heading font-bold text-clinical-white leading-tight max-w-6xl">
              {mainHeading}{' '}
              <em className="italic text-coral font-light">
                {emphasizedText}
              </em>{' '}
              {subHeading}
            </h1>

            {/* CTA Button */}
            <div className={cn(
              'pt-4',
              textAlignment === 'left' && 'flex justify-start',
              textAlignment === 'center' && 'flex justify-center',
              textAlignment === 'right' && 'flex justify-end'
            )}>
              <WorkshopButton
                as="link"
                href={ctaButton.link}
                variant="primary"
                size="lg"
                className={cn(
                  'px-8 py-4 text-lg font-semibold uppercase tracking-wider',
                  'hover:scale-105 transform transition-all duration-300',
                  'shadow-lg hover:shadow-xl'
                )}
                {...(ctaButton.openInNewTab && { target: '_blank', rel: 'noopener noreferrer' })}
              >
                {ctaButton.text}
              </WorkshopButton>
            </div>
          </div>

          {/* Geometric Accent Elements */}
          <div className="absolute -top-4 -left-4 w-4 h-4 bg-coral rotate-45 opacity-60" />
          <div className="absolute -top-2 -right-6 w-3 h-3 bg-brand-blue opacity-50" />
          <div className="absolute -bottom-6 -left-2 w-5 h-5 border-2 border-orange rotate-12 opacity-40" />
          <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-br from-coral to-orange rounded-full opacity-30" />
        </div>
      </div>

      {/* Bottom Fade Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-clinical-white dark:from-navy to-transparent z-25" />
    </section>
  )
}