// src/blocks/HeritageTrust/Component.client.tsx
'use client'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/cn'
import React, { useCallback, useEffect, useState } from 'react'

type TestimonialType = {
  quote: string
  authorPhoto: any
  authorName: string
  authorTitle: string
  companyName: string
  companyLogo: any
  industry?: string | null
  id?: string | null
}

type CarouselSettingsType = {
  autoplay: boolean
  autoplaySpeed: number
  pauseOnHover: boolean
  showProgress: boolean
}

type HeritageTrustClientProps = {
  testimonials: TestimonialType[]
  carouselSettings: CarouselSettingsType
}

export const HeritageTrustClient: React.FC<HeritageTrustClientProps> = ({
  testimonials,
  carouselSettings,
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  const activeTestimonial = testimonials[activeIndex]

  const nextTestimonial = useCallback(() => {
    setActiveIndex((current) => (current + 1) % testimonials.length)
    setProgress(0)
  }, [testimonials.length])

  const selectTestimonial = useCallback((index: number) => {
    setActiveIndex(index)
    setProgress(0)
  }, [])

  useEffect(() => {
    if (!carouselSettings.autoplay || isPaused || testimonials.length <= 1) return

    const timer = setTimeout(() => {
      nextTestimonial()
    }, carouselSettings.autoplaySpeed)

    return () => clearTimeout(timer)
  }, [activeIndex, isPaused, carouselSettings.autoplay, carouselSettings.autoplaySpeed, nextTestimonial, testimonials.length])

  useEffect(() => {
    if (!carouselSettings.autoplay || isPaused || testimonials.length <= 1 || !carouselSettings.showProgress) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = (100 / (carouselSettings.autoplaySpeed / 100))
        return prev + increment
      })
    }, 100)

    return () => clearInterval(interval)
  }, [activeIndex, isPaused, carouselSettings.autoplay, carouselSettings.autoplaySpeed, carouselSettings.showProgress, testimonials.length])

  useEffect(() => {
    setProgress(0)
  }, [activeIndex])

  const handleMouseEnter = useCallback(() => {
    if (carouselSettings.pauseOnHover) setIsPaused(true)
  }, [carouselSettings.pauseOnHover])

  const handleMouseLeave = useCallback(() => {
    if (carouselSettings.pauseOnHover) setIsPaused(false)
  }, [carouselSettings.pauseOnHover])

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        <div className="order-2 lg:order-1 lg:col-span-7">
          <div className="relative bg-navy dark:bg-dark-navy rounded-lg p-8 lg:p-12 shadow-2xl">
            
           <div className="relative z-10">
                <blockquote className="text-lg sm:text-xl lg:text-2xl font-heading leading-relaxed text-clinical-white mb-8">
                  &ldquo;{activeTestimonial.quote}&rdquo;
                </blockquote>
              
              <div className="space-y-1">
                <div className="text-base sm:text-lg font-semibold text-clinical-white font-body">
                  {activeTestimonial.authorName}
                </div>
                <div className="text-sm font-body text-clinical-white/80">
                  {activeTestimonial.authorTitle}
                </div>
                <div className="text-sm font-semibold font-body tracking-wide text-coral">
                  {activeTestimonial.companyName}
                </div>
                {activeTestimonial.industry && (
                  <div className="text-sm text-clinical-white/60 font-body italic">
                    {activeTestimonial.industry}
                  </div>
                )}
              </div>
            </div>
            
            <div className="absolute top-6 left-6 w-3 h-3 border-l-2 border-t-2 border-coral/60" />
            <div className="absolute bottom-6 right-6 w-3 h-3 border-r-2 border-b-2 border-coral/60" />
            
            <div className="absolute top-6 right-6 flex gap-2 opacity-60">
              <div className="w-2 h-2 bg-coral rounded-full" />
              <div className="w-1.5 h-1.5 bg-brand-blue rounded-full" />
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-5 text-center">
          <div className="relative mb-8">
            <div className="relative w-32 h-32 lg:w-40 lg:h-40 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-coral to-brand-blue p-1">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-clinical-white">
                  {activeTestimonial.authorPhoto && typeof activeTestimonial.authorPhoto === 'object' && (
                    <Media
                      resource={activeTestimonial.authorPhoto}
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  )}
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-brand-blue/20 shadow-inner" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {testimonials.map((testimonial, index) => (
              <button
                key={index}
                onClick={() => selectTestimonial(index)}
                className={cn(
                  "relative p-3 rounded-lg transition-all duration-300 hover:scale-105",
                  index === activeIndex
                    ? "bg-coral/20 ring-2 ring-coral"
                    : "bg-navy/10 dark:bg-navy/20 hover:bg-navy/20 dark:hover:bg-navy/30"
                )}
              >
                {testimonial.companyLogo && typeof testimonial.companyLogo === 'object' && (
                  <Media
                    resource={testimonial.companyLogo}
                    className="w-full h-12 object-contain"
                    imgClassName="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                )}
                {index === activeIndex && (
                  <div className="absolute inset-0 rounded-lg border-2 border-coral/40" />
                )}
              </button>
            ))}
          </div>

          {carouselSettings.showProgress && testimonials.length > 1 && (
            <div className="flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => selectTestimonial(index)}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    index === activeIndex ? "w-8 bg-coral" : "w-4 bg-blue-gray/40"
                  )}
                >
                  {index === activeIndex && carouselSettings.autoplay && !isPaused && (
                    <div 
                      className="h-full bg-brand-blue rounded-full transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

