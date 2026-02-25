// src/heros/HeritageCraftsmanship/Component.client.tsx
'use client'
import { WorkshopButton } from '@/components/ui/WorkshopButton/WorkshopButton'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { cn } from '@/utilities/cn'
import React, { useEffect, useState } from 'react'
import { AnimatedWords } from './AnimatedWords'
import { ImageCarousel } from './ImageCarousel'

type HeritageCraftsmanshipHeroProps = {
  headline?: string | null
  animatedWords: {
    text: string
    colorStyle: string
  }[]
  description: string
  primaryButton: {
    label: string
    link: string
  }
  secondaryButton: {
    label: string
    link: string
  }
  workshopImages: {
    image: {
      url: string
      alt: string
    }
  }[]
  workshopBackgroundImage?: {
    url: string
    alt: string
  } | null
  heritageYear?: string
  craftmanshipLabel?: string
}

export const HeritageCraftsmanshipHeroClient: React.FC<HeritageCraftsmanshipHeroProps> = (props) => {
  const {
    headline = "Crafting",
    animatedWords = [
      { text: "Excellence", colorStyle: "word1" },
      { text: "Tradition", colorStyle: "word2" },
      { text: "Artistry", colorStyle: "word3" },
      { text: "Heritage", colorStyle: "word1" }
    ],
    description = "Where traditional artistry meets contemporary design. Every piece tells a story of dedication, precision, and time-honored techniques passed down through generations.",
    primaryButton = { label: "Explore Collection", link: "#" },
    secondaryButton = { label: "Our Story", link: "#" },
    workshopImages = [],
    workshopBackgroundImage = null,
    heritageYear = "1985",
    craftmanshipLabel = "Handcrafted Excellence"
  } = props

  const { setHeaderTheme } = useHeaderTheme()
  const [activeWord, setActiveWord] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  useEffect(() => {
    if (animatedWords.length > 0) {
      const timer = setInterval(() => {
        setActiveWord((current) => (current + 1) % animatedWords.length)
      }, 3500)
      return () => clearInterval(timer)
    }
  }, [animatedWords])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleImageSelect = (index: number) => {
    setActiveWord(index % animatedWords.length)
  }

  return (
    <section 
      className="relative -mt-[10.4rem] min-h-[80vh] flex flex-col overflow-hidden bg-antique-white dark:bg-charcoal-black" 
      data-theme="dark"
    >
      
      {/* Mobile-First Layout: Stack on mobile, side-by-side on desktop */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-0 min-h-[80vh]">
        
        {/* Content Section with Wood Background - Mobile First, Desktop Second */}
        <div className="relative flex items-center justify-center px-2 py-8 sm:px-4 sm:py-10 md:px-6 md:py-12 lg:px-8 lg:py-16 order-1 lg:order-2 lg:col-span-5 min-h-[45vh] lg:min-h-full overflow-hidden">
          
          {/* Wood Background Image - Behind content - More visible */}
          {workshopBackgroundImage && (
            <div className="absolute inset-0 z-0">
              <img
                src={workshopBackgroundImage.url}
                alt={workshopBackgroundImage.alt || 'Workshop wood background'}
                className="w-full h-full object-cover"
                style={{
                  filter: 'brightness(0.6) contrast(1.1) saturate(1.0)'
                }}
              />
              {/* Lighter overlay for wood visibility with text readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-deep-charcoal/40 via-deep-charcoal/25 to-copper-bourbon/15" />
            </div>
          )}
          
          <div className="relative z-10 w-full h-full flex flex-col justify-center items-center lg:items-start text-center lg:text-left px-2 lg:px-6 mt-6 sm:mt-8 md:mt-4 lg:-mt-8">
            
            {/* Heritage Badge - More spacing and better mobile positioning, higher on large screens */}
            <div className={cn(
              "w-full max-w-full flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8 lg:mb-10 transition-all duration-700",
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              {/* Left line - responsive */}
              <div className="flex-1 min-w-0 border-t-2 border-antique-white/70"></div>
              
              {/* HANDCRAFTED EXCELLENCE - flexible */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-2.5 h-2.5 bg-copper-bourbon rounded-full" />
                <span className="text-antique-white font-semibold tracking-[0.1em] uppercase text-xs sm:text-sm lg:text-base font-sourcesans whitespace-nowrap">
                  {craftmanshipLabel}
                </span>
              </div>
              
              {/* Middle line - shorter on mobile */}
              <div className="flex-shrink-0 w-4 sm:w-8 lg:w-12 border-t-2 border-antique-white/70"></div>
              
              {/* SINCE YEAR - always visible */}
              <span className="text-antique-white/80 text-xs sm:text-sm lg:text-base font-sourcesans whitespace-nowrap flex-shrink-0">
                Since {heritageYear}
              </span>
              
              {/* Right line - responsive */}
              <div className="flex-1 min-w-0 border-t-2 border-antique-white/70"></div>
            </div>

            {/* Animated Headline - Compact */}
            <div className={cn(
              "transition-all duration-700 delay-200 mb-4 sm:mb-6 w-full",
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              <AnimatedWords 
                staticWord={headline}
                words={animatedWords}
                activeIndex={activeWord}
                className="mb-2"
              />
            </div>

            {/* Description - More compact */}
            <p className={cn(
              "text-sm sm:text-base lg:text-lg text-antique-white/90 leading-relaxed font-sourcesans max-w-md mx-auto lg:mx-0 transition-all duration-700 delay-300 mb-4 sm:mb-6",
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              {description}
            </p>

            {/* Action Buttons - Compact spacing */}
            <div className={cn(
              "flex flex-col sm:flex-row gap-3 justify-center lg:justify-start transition-all duration-700 delay-400",
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              
              {/* Primary Button - NO ICONS */}
              <WorkshopButton
                as="link"
                href={primaryButton.link}
                variant="primary"
                size="md"
              >
                {primaryButton.label}
              </WorkshopButton>
              
              {/* Secondary Button - NO ICONS */}
              <WorkshopButton
                as="link"
                href={secondaryButton.link}
                variant="secondary"
                size="md"
              >
                {secondaryButton.label}
              </WorkshopButton>
            </div>
          </div>
        </div>

        {/* Workshop Images Section - Slightly reduced height on mobile for better balance */}
        <div className="relative order-2 lg:order-1 lg:col-span-7 min-h-[35vh] sm:min-h-[40vh] lg:min-h-full overflow-hidden">
          
          {/* Workshop Images Carousel - Fixed with correct props */}
          <div className="relative z-10 h-full">
            <ImageCarousel 
              images={workshopImages}
              onImageSelectAction={handleImageSelect}
              activeIndex={activeWord}
              className="h-full"
            />
          </div>
          
          {/* Heritage Year Badge - Floating */}
          <div className="absolute bottom-6 left-6 z-20 bg-antique-white/95 dark:bg-charcoal-black/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border border-copper-bourbon/20">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-copper-bourbon font-playfair">
                {heritageYear}
              </div>
              <div className="text-xs sm:text-sm text-smoky-gray dark:text-antique-white/80 font-sourcesans tracking-wider uppercase">
                Est.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}