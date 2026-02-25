// src/heros/RotatingHero/Component.tsx
'use client'
import { RenderHero } from '@/heros/RenderHero'
import type { Page } from '@/payload-types'
import React, { useEffect, useState } from 'react'

type RotatingHeroProps = {
  heroes: Array<Page['hero']>
  rotationType?: 'random' | 'sequential' | 'time-based'
  interval?: number // For time-based rotation (in seconds)
  persistSelection?: boolean // Remember last selection across visits
}

export const RotatingHero: React.FC<RotatingHeroProps> = ({
  heroes,
  rotationType = 'random',
  interval = 30, // 30 seconds default
  persistSelection = true
}) => {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize hero selection on mount
  useEffect(() => {
    if (heroes.length === 0) return

    const selectHero = () => {
      switch (rotationType) {
        case 'random':
          return Math.floor(Math.random() * heroes.length)
        
        case 'sequential':
          if (persistSelection && typeof window !== 'undefined') {
            const lastIndex = parseInt(localStorage.getItem('lastHeroIndex') || '0')
            const nextIndex = (lastIndex + 1) % heroes.length
            localStorage.setItem('lastHeroIndex', nextIndex.toString())
            return nextIndex
          }
          return Math.floor(Math.random() * heroes.length)
        
        case 'time-based':
          // Changes based on hour of day, day of week, etc.
          const hour = new Date().getHours()
          return hour % heroes.length
        
        default:
          return 0
      }
    }

    const initialIndex = selectHero()
    setCurrentHeroIndex(initialIndex)
    setIsLoaded(true)
  }, [heroes.length, rotationType, persistSelection])

  // Time-based rotation (optional)
  useEffect(() => {
    if (rotationType !== 'time-based' || !interval) return

    const timer = setInterval(() => {
      setCurrentHeroIndex((current) => (current + 1) % heroes.length)
    }, interval * 1000)

    return () => clearInterval(timer)
  }, [heroes.length, rotationType, interval])

  // Don't render until hero is selected
  if (!isLoaded || heroes.length === 0) {
    return null
  }

  const currentHero = heroes[currentHeroIndex]

  return (
    <div className="relative">
      {/* Optional: Hero indicator dots */}
      {heroes.length > 1 && (
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          {heroes.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentHeroIndex
                  ? 'bg-copper-bourbon scale-125'
                  : 'bg-white/50 hover:bg-white/80 cursor-pointer'
              }`}
              onClick={() => setCurrentHeroIndex(index)}
              title={`Hero ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Render the selected hero */}
      <RenderHero {...currentHero} />
    </div>
  )
}