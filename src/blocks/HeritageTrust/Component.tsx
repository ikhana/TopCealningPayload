// ============================================
// src/blocks/HeritageTrust/Component.tsx
// ============================================

import type { HeritageTrustBlock as HeritageTrustBlockProps } from '@/payload-types'

import { WorkshopButton } from '@/components/ui/WorkshopButton/WorkshopButton'
import React from 'react'
import { HeritageTrustClient } from './Component.client'

export const HeritageTrustBlock: React.FC<
  HeritageTrustBlockProps & {
    id?: string
  }
> = (props) => {
  const {
    sectionTitle,
    sectionSubtitle,
    testimonials,
    carouselSettings,
    enableCTA,
    ctaLabel,
    ctaLink,
  } = props

  const safeTestimonials = testimonials || []
  const safeCarouselSettings = {
    autoplay: carouselSettings?.autoplay ?? true,
    autoplaySpeed: carouselSettings?.autoplaySpeed ?? 6000,
    pauseOnHover: carouselSettings?.pauseOnHover ?? true,
    showProgress: carouselSettings?.showProgress ?? true,
  }

  if (!safeTestimonials.length) {
    return (
      <section className="relative bg-clinical-white dark:bg-dark-navy py-16 lg:py-24">
        <div className="container text-center">
          <p className="text-sm font-body text-blue-gray dark:text-clinical-white/70">
            No testimonials configured
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative bg-clinical-white dark:bg-dark-navy py-16 lg:py-24 overflow-hidden">
      
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(216,77,43,0.15)_1px,_transparent_0)] bg-[length:20px_20px]" />
      </div>

      <div className="container relative">
        
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-wide font-heading text-dark-navy dark:text-clinical-white mb-4">
            {sectionTitle || 'Trusted by Healthcare Professionals'}
          </h2>
          {sectionSubtitle && (
            <p className="text-sm font-body leading-relaxed text-blue-gray dark:text-clinical-white/80 max-w-2xl mx-auto">
              {sectionSubtitle}
            </p>
          )}
          <div className="w-16 h-0.5 bg-coral mx-auto mt-6" />
        </div>

        <HeritageTrustClient
          testimonials={safeTestimonials}
          carouselSettings={safeCarouselSettings}
        />

        {enableCTA && ctaLabel && ctaLink && (
          <div className="text-center mt-16 lg:mt-20">
            <WorkshopButton
              as="link"
              href={ctaLink}
              variant="primary"
              size="lg"
            >
              {ctaLabel}
            </WorkshopButton>
          </div>
        )}

        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-coral/5 rounded-full blur-3xl" />
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl" />
      </div>
    </section>
  )
}