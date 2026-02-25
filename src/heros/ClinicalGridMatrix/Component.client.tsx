// src/heros/ClinicalGridMatrix/Component.client.tsx
'use client'
import { WorkshopButton } from '@/components/ui/WorkshopButton/WorkshopButton'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { useTheme } from '@/providers/Theme'
import { cn } from '@/utilities/cn'
import { ChevronRight, MapPin } from 'lucide-react'
import React, { useEffect, useState } from 'react'

type ClinicalGridMatrixHeroProps = {
  heroTitle: string
  heroSubtitle: string
  primaryCTA: {
    label: string
    link: string
  }
  secondaryCTA?: {
    label: string
    link: string
  }
  gridAnimationSpeed: 'slow' | 'medium' | 'fast'
  backgroundStyle: 'light' | 'dark'
}

export const ClinicalGridMatrixHeroClient: React.FC<ClinicalGridMatrixHeroProps> = ({
  heroTitle,
  heroSubtitle,
  primaryCTA,
  secondaryCTA,
  gridAnimationSpeed,
  backgroundStyle,
}) => {
  const { theme } = useTheme()
  const { setHeaderTheme } = useHeaderTheme()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [activeGridCells, setActiveGridCells] = useState<Set<number>>(new Set())

  const animationSpeeds = {
    slow: 4000,
    medium: 2500, 
    fast: 1500
  }

  const GRID_COLS = 12
  const GRID_ROWS = 8
  const TOTAL_CELLS = GRID_COLS * GRID_ROWS

  useEffect(() => {
    setIsMounted(true)
    setHeaderTheme(backgroundStyle === 'dark' ? 'dark' : 'light')
    
    return () => {
      setHeaderTheme(undefined)
    }
  }, [setHeaderTheme, backgroundStyle])

  useEffect(() => {
    if (isMounted) {
      const timer = setTimeout(() => setIsLoaded(true), 200)
      return () => clearTimeout(timer)
    }
  }, [isMounted])

  useEffect(() => {
    if (!isMounted || !isLoaded) return

    const interval = setInterval(() => {
      setActiveGridCells(prev => {
        const newActive = new Set(prev)
        
        const cellsToAdd = Math.floor(Math.random() * 3) + 2
        for (let i = 0; i < cellsToAdd; i++) {
          const randomCell = Math.floor(Math.random() * TOTAL_CELLS)
          newActive.add(randomCell)
        }
        
        if (newActive.size > 15) {
          const cellsArray = Array.from(newActive)
          const cellsToRemove = Math.floor(Math.random() * 3) + 1
          for (let i = 0; i < cellsToRemove; i++) {
            const randomIndex = Math.floor(Math.random() * cellsArray.length)
            newActive.delete(cellsArray[randomIndex])
          }
        }
        
        return newActive
      })
    }, animationSpeeds[gridAnimationSpeed])

    return () => clearInterval(interval)
  }, [isMounted, isLoaded, gridAnimationSpeed])

  if (!isMounted) {
    return (
      <section className={cn(
        "relative -mt-[64px] min-h-screen flex items-center justify-center overflow-hidden",
        backgroundStyle === 'dark' ? 'bg-navy' : 'bg-clinical-white'
      )}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={cn(
              "text-4xl lg:text-6xl font-heading font-bold mb-6",
              backgroundStyle === 'dark' ? 'text-clinical-white' : 'text-dark-navy'
            )}>
              Loading...
            </h1>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={cn(
      "relative -mt-[64px] min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-300",
      backgroundStyle === 'dark' ? 'bg-navy' : 'bg-clinical-white'
    )}>
      
      <div className="absolute inset-0 opacity-10">
        <div 
          className="grid h-full w-full"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
          }}
        >
          {Array.from({ length: TOTAL_CELLS }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "border transition-all duration-1000 ease-out",
                backgroundStyle === 'dark' 
                  ? 'border-clinical-white/10' 
                  : 'border-dark-navy/10',
                activeGridCells.has(index) && [
                  backgroundStyle === 'dark'
                    ? 'bg-gradient-to-br from-coral/20 to-brand-blue/20 border-coral/30'
                    : 'bg-gradient-to-br from-coral/15 to-brand-blue/15 border-coral/25'
                ]
              )}
            />
          ))}
        </div>
      </div>

      <div className={cn(
        "relative z-20 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12",
        "transition-all duration-1000",
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}>
        
        <div className={cn(
          "p-8 lg:p-12 shadow-2xl border-2 transition-colors duration-300",
          backgroundStyle === 'dark' 
            ? 'bg-clinical-white/95 border-coral/30 text-dark-navy backdrop-blur-sm' 
            : 'bg-navy/95 border-brand-blue/30 text-clinical-white backdrop-blur-sm'
        )}>
          
          <div className="flex items-center gap-4 mb-8">
            <div className={cn(
              "w-3 h-3 animate-pulse",
              backgroundStyle === 'dark' ? 'bg-coral' : 'bg-brand-blue'
            )} />
            <span className={cn(
              "font-body font-semibold tracking-wider uppercase text-sm",
              backgroundStyle === 'dark' ? 'text-coral' : 'text-brand-blue'
            )}>
              Clinical Excellence
            </span>
            <div className={cn(
              "flex-1 h-px",
              backgroundStyle === 'dark' ? 'bg-coral/30' : 'bg-brand-blue/30'
            )} />
          </div>

          <h1 className={cn(
            "text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold mb-6 leading-tight",
            "transition-colors duration-300"
          )}>
            {heroTitle}
          </h1>

          <p className={cn(
            "text-lg sm:text-xl lg:text-2xl font-body leading-relaxed mb-8 max-w-3xl opacity-90"
          )}>
            {heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <WorkshopButton
              as="link"
              href={primaryCTA.link}
              variant="primary"
              size="lg"
              className={cn(
                "group transform hover:scale-105 transition-all duration-300",
                backgroundStyle === 'dark'
                  ? 'bg-coral hover:bg-coral/90 text-clinical-white shadow-lg shadow-coral/25'
                  : 'bg-brand-blue hover:bg-brand-blue/90 text-clinical-white shadow-lg shadow-brand-blue/25'
              )}
            >
              <span className="flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                {primaryCTA.label}
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </WorkshopButton>

            {secondaryCTA && (
              <WorkshopButton
                as="link"
                href={secondaryCTA.link}
                variant="outline"
                size="lg"
                className={cn(
                  "border-2 transition-all duration-300 hover:scale-105",
                  backgroundStyle === 'dark'
                    ? 'border-dark-navy text-dark-navy hover:bg-dark-navy hover:text-clinical-white'
                    : 'border-clinical-white text-clinical-white hover:bg-clinical-white hover:text-navy'
                )}
              >
                {secondaryCTA.label}
              </WorkshopButton>
            )}
          </div>

          <div className={cn(
            "absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 transition-colors duration-300",
            backgroundStyle === 'dark' ? 'border-coral/40' : 'border-brand-blue/40'
          )} />
          <div className={cn(
            "absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 transition-colors duration-300",
            backgroundStyle === 'dark' ? 'border-coral/40' : 'border-brand-blue/40'
          )} />
          <div className={cn(
            "absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 transition-colors duration-300",
            backgroundStyle === 'dark' ? 'border-coral/40' : 'border-brand-blue/40'
          )} />
          <div className={cn(
            "absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 transition-colors duration-300",
            backgroundStyle === 'dark' ? 'border-coral/40' : 'border-brand-blue/40'
          )} />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { value: '24-48hr', label: 'Results' },
            { value: '50K+', label: 'Tests' },
            { value: '99.9%', label: 'Accuracy' }
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "text-center p-4 border transition-all duration-500 hover:scale-105",
                backgroundStyle === 'dark'
                  ? 'bg-clinical-white/90 border-coral/20 text-dark-navy hover:border-coral/40'
                  : 'bg-navy/90 border-brand-blue/20 text-clinical-white hover:border-brand-blue/40'
              )}
              style={{ 
                animationDelay: `${index * 200 + 1000}ms`,
                transform: isLoaded ? 'translateY(0)' : 'translateY(10px)',
                opacity: isLoaded ? 1 : 0,
                transition: 'all 0.6s ease-out'
              }}
            >
              <div className={cn(
                "text-xl lg:text-2xl font-heading font-bold mb-1",
                backgroundStyle === 'dark' ? 'text-coral' : 'text-brand-blue'
              )}>
                {stat.value}
              </div>
              <div className="text-sm font-body opacity-80">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div 
        className={cn(
          "absolute inset-0 opacity-5 pointer-events-none",
          backgroundStyle === 'dark' ? 'text-clinical-white' : 'text-dark-navy'
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='currentColor' fill-opacity='0.3'%3E%3Cpath d='M0 0h1v1H0zm20 0h1v1h-1zm0 20h1v1h-1zM0 20h1v1H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />
    </section>
  )
}