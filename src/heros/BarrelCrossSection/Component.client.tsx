// src/heros/BarrelCrossSection/Component.client.tsx - Charcoal & Bourbon Luxury Theme
'use client'
import { WorkshopButton } from '@/components/ui/WorkshopButton/WorkshopButton'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { cn } from '@/utilities/cn'
import React, { useEffect, useState } from 'react'

type BarrelCrossSectionHeroProps = {
  barrelHeadline?: string | null
  barrelWoodBackground?: {
    url: string
    alt: string
  }
  brandPillars: {
    label: string
    description: string
    ringPosition: 'outer' | 'middleOuter' | 'middleInner' | 'inner'
    id: string
  }[]
  barrelBadgeText?: string
  barrelPrimaryButton: {
    label: string
    link: string
  }
  barrelSecondaryButton: {
    label: string
    link: string
  }
  craftsmanshipSteps: {
    step: string
    id: string
  }[]
  barrelImages?: {
    image: {
      url: string
      alt: string
    }
  }[]
  logoImage?: {
    url: string
    alt: string
  }
}

export const BarrelCrossSectionHeroClient: React.FC<BarrelCrossSectionHeroProps> = (props) => {
  const {
    barrelHeadline = "Our",
    barrelWoodBackground,
    brandPillars = [],
    barrelBadgeText = "Heritage Crafted Excellence",
    barrelPrimaryButton = { label: "Explore Heritage", link: "#" },
    barrelSecondaryButton = { label: "Our Legacy", link: "#" },
    craftsmanshipSteps = [],
    barrelImages = [],
    logoImage
  } = props

  const { setHeaderTheme } = useHeaderTheme()
  const [activeRing, setActiveRing] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hoveredRing, setHoveredRing] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-rotate through rings
  useEffect(() => {
    if (brandPillars.length > 0) {
      const timer = setInterval(() => {
        setActiveRing((current) => (current + 1) % brandPillars.length)
      }, 4000)
      return () => clearInterval(timer)
    }
  }, [brandPillars])

  const handleRingClick = (index: number) => {
    setActiveRing(index)
  }

  const currentPillar = brandPillars[activeRing] || brandPillars[0]

  // Ring positioning based on ringPosition - Professional sizing
  const getRingSize = (position: string) => {
    switch (position) {
      case 'outer': return 90        // Refined sizing for premium feel
      case 'middleOuter': return 72  // Professional spacing
      case 'middleInner': return 54  // Elegant proportions
      case 'inner': return 36        // Perfect core size
      default: return 90
    }
  }

  const getRingLabelPosition = (position: string) => {
    switch (position) {
      case 'outer': return isMobile ? { top: '15%', left: '50%' } : { top: '20%', left: '85%' }
      case 'middleOuter': return isMobile ? { top: '25%', left: '80%' } : { top: '35%', left: '80%' }
      case 'middleInner': return isMobile ? { top: '75%', left: '20%' } : { bottom: '35%', left: '20%' }
      case 'inner': return isMobile ? { bottom: '15%', left: '50%' } : { bottom: '20%', left: '15%' }
      default: return { top: '20%', left: '85%' }
    }
  }

  return (
    <>
      {/* Enhanced CSS animations with Charcoal & Bourbon theme */}
      <style jsx>{`
        @keyframes slide-in-left { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slide-in-right { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gradient { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .animate-slide-in-left { animation: slide-in-left 0.8s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.8s ease-out 0.2s both; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out 0.4s both; }
        .animate-gradient { animation: gradient 8s ease infinite; }
      `}</style>
    
    <section 
      className="relative -mt-[10.4rem] min-h-[80vh] flex flex-col overflow-hidden bg-antique-white dark:bg-charcoal-black" 
      data-theme="dark"
    >
      
      {/* Hero Grid Layout */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-0 min-h-[80vh] relative">
        
        {/* Barrel Cross-Section View with Wood Background */}
        <div className="relative order-1 lg:col-span-7 min-h-[50vh] lg:min-h-[80vh] flex items-center justify-center px-6 py-8 lg:px-10 lg:py-10 bg-gradient-to-br from-antique-white to-antique-white/90 dark:from-charcoal-black dark:to-charcoal-black/90 overflow-hidden">
          
          {/* Wood Background Image - Premium overlay */}
          {barrelWoodBackground && (
            <div className="absolute inset-0 z-0">
              <img
                src={barrelWoodBackground.url}
                alt={barrelWoodBackground.alt}
                className="w-full h-full object-cover opacity-80 dark:opacity-60 filter brightness-105 contrast-95"
              />
            </div>
          )}
          
          {/* Enhanced Background Particles with Charcoal & Bourbon colors */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-charcoal-gold/20 dark:bg-copper-bourbon/20 rounded-full animate-pulse"
                style={{
                  left: `${10 + (i * 7)}%`,
                  top: `${20 + (i * 5)}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + (i % 3)}s`
                }}
              />
            ))}
          </div>
          
          {/* Logo Background */}
          {logoImage && (
            <div className="absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-20 z-10">
              <img
                src={logoImage.url}
                alt={logoImage.alt}
                className="w-2/3 h-2/3 object-contain transition-transform duration-[20s] hover:scale-105"
              />
            </div>
          )}
          
          {/* Main Barrel Container */}
          <div className="relative w-full max-w-xs lg:max-w-lg aspect-square z-20">
            
            {/* Barrel Cross-Section */}
            <div className="relative w-full h-full">
              
              {/* Enhanced Wood grain background with Charcoal & Bourbon theme */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-antique-brass/20 via-charcoal-gold/30 to-antique-brass/20 dark:from-copper-bourbon/20 dark:via-charcoal-gold/25 dark:to-copper-bourbon/20 animate-pulse" style={{ animationDuration: '4s' }} />
              
              {/* Heritage Barrel Stave Lines */}
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-0.5 h-full bg-smoky-gray/15 dark:bg-antique-brass/15 origin-bottom"
                    style={{
                      left: '50%',
                      transform: `translateX(-50%) rotate(${i * 22.5}deg)`,
                      transformOrigin: '50% 100%'
                    }}
                  />
                ))}
              </div>
              
              {/* Ring Depth Shadows with Heritage styling */}
              <div className="absolute inset-0 rounded-full">
                {brandPillars.map((pillar, index) => {
                  const ringSize = getRingSize(pillar.ringPosition)
                  return (
                    <div
                      key={`shadow-${pillar.id}`}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{
                        width: `${ringSize - 1}%`,
                        height: `${ringSize - 1}%`,
                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
                        zIndex: 1
                      }}
                    />
                  )
                })}
              </div>
              
              {/* Enhanced Concentric Rings with Charcoal & Bourbon colors */}
              {brandPillars.map((pillar, index) => {
                const isActive = index === activeRing
                const isHovered = index === hoveredRing
                const ringSize = getRingSize(pillar.ringPosition)
                const ringThickness = isMobile ? '6px' : '10px'
                
                // Unified color theme - premium copper bourbon with gold accents
                const ringColor = isActive 
                  ? 'hsl(var(--color-copper-bourbon))'
                  : isHovered
                  ? 'hsl(var(--color-charcoal-gold))'
                  : 'hsl(var(--color-copper-bourbon) / 0.6)'
                
                return (
                  <div
                    key={pillar.id}
                    className={cn(
                      "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                      "rounded-full border-solid cursor-pointer transition-all duration-700 ease-in-out",
                      isActive && "ring-4 ring-copper-bourbon/50 ring-offset-4 ring-offset-antique-white dark:ring-offset-charcoal-black",
                      isHovered ? "scale-105" : "scale-100",
                      !isActive && !isHovered && "animate-pulse"
                    )}
                    style={{
                      width: `${ringSize}%`,
                      height: `${ringSize}%`,
                      borderWidth: ringThickness,
                      borderColor: ringColor,
                      animationDuration: isActive ? 'none' : `${3 + (index % 2)}s`,
                      zIndex: 10 + index
                    }}
                    onClick={() => handleRingClick(index)}
                    onMouseEnter={() => setHoveredRing(index)}
                    onMouseLeave={() => setHoveredRing(null)}
                  />
                )
              })}

              {/* Enhanced Ring Labels with Heritage positioning */}
              {brandPillars.map((pillar, index) => {
                const labelPosition = getRingLabelPosition(pillar.ringPosition)
                const isActive = index === activeRing
                const isHovered = index === hoveredRing
                
                return (
                  <div
                    key={`label-${pillar.id}`}
                    className={cn(
                      "absolute cursor-pointer transition-all duration-300 ease-out pointer-events-none",
                      "bg-antique-white/95 dark:bg-charcoal-black/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border",
                      isActive 
                        ? "border-copper-bourbon shadow-xl scale-110" 
                        : "border-smoky-gray/20 dark:border-antique-brass/20",
                      isHovered && !isActive && 'scale-105 shadow-md'
                    )}
                    style={{
                      ...labelPosition,
                      transform: `translate(-50%, -50%) ${isActive ? 'scale(1.1)' : 'scale(1)'}`,
                      zIndex: 20,
                      fontSize: isMobile ? '0.75rem' : '0.875rem'
                    }}
                  >
                    <span className={cn(
                      'font-sourcesans font-semibold transition-colors duration-300',
                      isActive 
                        ? 'text-copper-bourbon' 
                        : 'text-deep-charcoal dark:text-antique-white'
                    )}>
                      {pillar.label}
                    </span>
                  </div>
                )
              })}

              {/* Heritage Center Badge - "CORE" with premium styling */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                <div className="bg-charcoal-black/90 dark:bg-deep-charcoal/95 backdrop-blur-sm border border-copper-bourbon/30 text-center py-2 px-4 shadow-lg rounded-lg">
                  <div className="flex items-center justify-center gap-2">
                    {/* Left decorative element */}
                    <div className="w-1 h-1 bg-copper-bourbon rounded-full"></div>
                    
                    {/* Core Badge Text */}
                    <span className="text-antique-white font-sourcesans font-semibold text-xs sm:text-sm uppercase tracking-wide">
                      CORE
                    </span>
                    
                    {/* Right decorative element */}
                    <div className="w-1 h-1 bg-copper-bourbon rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Content Section with Dynamic Background Images */}
        <div className="relative order-2 lg:col-span-5 min-h-[50vh] lg:min-h-[80vh] flex flex-col justify-center px-6 py-10 lg:px-10 lg:py-14 overflow-hidden">
          
          {/* Heritage Banner Badge - Normalized z-index */}
          <div className="absolute top-0 lg:top-16 left-1/2 lg:left-8 transform -translate-x-1/2 lg:translate-x-0 z-20 w-full max-w-lg px-4 lg:px-0">
            <div className="bg-charcoal-black/90 dark:bg-deep-charcoal/95 backdrop-blur-sm border border-copper-bourbon/30 text-center py-2 px-4 shadow-lg">
              <div className="flex items-center justify-center gap-2 sm:gap-4">
                {/* Left decorative line */}
                <div className="hidden sm:block flex-1 h-px bg-copper-bourbon/40"></div>
                
                {/* Heritage Star Icon */}
                <div className="w-1.5 h-1.5 bg-copper-bourbon rotate-45 hidden sm:block"></div>
                
                {/* Main Badge Text */}
                <div className="text-antique-white font-sourcesans font-semibold text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap">
                  {barrelBadgeText}
                </div>
                
                {/* Right decorative line */}
                <div className="hidden sm:block flex-1 h-px bg-copper-bourbon/40"></div>
                
                {/* Heritage Year */}
                <div className="text-charcoal-gold font-sourcesans text-xs sm:text-sm font-medium whitespace-nowrap">
                  Since 1985
                </div>
                
                {/* Right decorative line */}
                <div className="hidden sm:block flex-1 h-px bg-copper-bourbon/40"></div>
              </div>
            </div>
          </div>
          
          {/* Dynamic Background Image for Current Pillar */}
          {barrelImages && barrelImages[activeRing] && (
            <div className="absolute inset-0 z-0">
              <img
                src={barrelImages[activeRing].image.url}
                alt={barrelImages[activeRing].image.alt}
                className="w-full h-full object-cover transition-all duration-700 ease-out"
                style={{
                  filter: 'brightness(0.4) contrast(1.1) sepia(0.1)',
                }}
              />
              {/* Premium overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-br from-charcoal-black/40 via-charcoal-black/30 to-deep-charcoal/50 dark:from-deep-charcoal/50 dark:via-deep-charcoal/40 dark:to-charcoal-black/60"></div>
            </div>
          )}
          
          {/* Fallback background if no images */}
          {(!barrelImages || !barrelImages[activeRing]) && (
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-charcoal-black via-charcoal-black/95 to-deep-charcoal dark:from-deep-charcoal dark:via-deep-charcoal/95 dark:to-charcoal-black"></div>
          )}
          
          {/* Heritage Decorative Elements */}
          <div className="absolute top-8 right-8 w-16 h-16 border-2 border-charcoal-gold/20 rounded-full animate-pulse opacity-60 z-5" />
          <div className="absolute bottom-12 left-8 w-8 h-8 border border-copper-bourbon/30 rotate-45 opacity-40 z-5" />
          
          <div className="relative z-10 max-w-lg mx-auto lg:mx-0 text-antique-white pt-10 lg:pt-28">
            {/* Enhanced Dynamic Headline with refined typography */}
            <div className={cn(
              "mb-6 transition-all duration-700 ease-out",
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-playfair font-bold text-antique-white mb-3 leading-tight">
                <span className="block animate-slide-in-left mb-1 sm:mb-2 lg:mb-4">{barrelHeadline}</span>
                <span 
                  className="block transition-all duration-500 ease-out animate-slide-in-right text-copper-bourbon"
                  key={currentPillar?.id}
                >
                  {currentPillar?.label}
                </span>
              </h1>
            </div>

            {/* Enhanced Description with Heritage typography */}
            <p className={cn(
              "text-sm lg:text-base text-antique-white/90 leading-relaxed font-sourcesans max-w-md mx-auto lg:mx-0 transition-all duration-500 ease-out delay-100 animate-fade-in-up mb-8",
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              {currentPillar?.description}
            </p>

            {/* Enhanced Heritage Action Buttons - Professional Charcoal & Bourbon Integration */}
            <div className={cn(
              "flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-700 delay-400",
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              
              {/* Primary Heritage Button - Mobile-responsive dynamic text */}
              <WorkshopButton
                as="link"
                href={barrelPrimaryButton?.link || '#'}
                variant="primary"
                size="lg"
              >
                Explore <span className="text-xs sm:text-sm text-antique-white/90">{currentPillar?.label}</span>
              </WorkshopButton>
              
              {/* Secondary Heritage Button - Uses professional CSS custom properties */}
              <WorkshopButton
                as="link"
                href={barrelSecondaryButton?.link || '#'}
                variant="secondary"
                size="lg"
              >
                {barrelSecondaryButton?.label}
              </WorkshopButton>
            </div>

            {/* Optional: Custom Button Example (if you want different colors) */}
            {/* 
            <WorkshopButton
              variant="primary"
              style={{
                '--button-primary-bg': 'var(--color-emerald-600)',
                '--button-primary-hover': 'var(--color-emerald-700)',
                '--button-shadow-primary': 'var(--color-emerald-600)'
              }}
            >
              Custom Green Button
            </WorkshopButton>
            */}

            {/* Enhanced Heritage Ring Navigation */}
            <div className="flex justify-center lg:justify-start gap-3 pt-6">
              {brandPillars.map((pillar, index) => (
                <button
                  key={pillar.id}
                  onClick={() => handleRingClick(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300 cursor-pointer relative",
                    index === activeRing 
                      ? "bg-copper-bourbon ring-2 ring-copper-bourbon/50 scale-125" 
                      : "bg-antique-white/40 hover:bg-antique-white/60 hover:scale-110"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compact Heritage Craftsmanship Timeline */}
      {craftsmanshipSteps.length > 0 && (
        <div className="bg-deep-charcoal/95 dark:bg-charcoal-black/95 backdrop-blur-sm py-4 lg:py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 lg:gap-12">
              {craftsmanshipSteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-copper-bourbon rounded-full flex items-center justify-center text-antique-white font-bold text-xs sm:text-sm">
                    {index + 1}
                  </div>
                  <span className="font-sourcesans font-semibold text-antique-white uppercase tracking-wide text-xs sm:text-sm">
                    {step.step}
                  </span>
                  {index < craftsmanshipSteps.length - 1 && (
                    <div className="hidden sm:block w-4 lg:w-8 h-0.5 bg-charcoal-gold/40 ml-2 sm:ml-3" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
    </>
  )
}