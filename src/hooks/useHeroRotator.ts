// src/hooks/useHeroRotator.ts
'use client'
import { useEffect, useState } from 'react'

type RotationType = 'random' | 'sequential' | 'daily' | 'hourly'

export const useHeroRotator = (
  heroCount: number,
  rotationType: RotationType = 'random'
) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (heroCount <= 1) return

    const selectHero = (): number => {
      switch (rotationType) {
        case 'random':
          return Math.floor(Math.random() * heroCount)
        
        case 'sequential':
          // Get last index from localStorage, increment
          if (typeof window !== 'undefined') {
            const lastIndex = parseInt(localStorage.getItem('heroRotatorIndex') || '0')
            const nextIndex = (lastIndex + 1) % heroCount
            localStorage.setItem('heroRotatorIndex', nextIndex.toString())
            return nextIndex
          }
          return 0
        
        case 'daily':
          // Change once per day based on date
          const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
          return dayOfYear % heroCount
        
        case 'hourly':
          // Change every hour
          const hour = new Date().getHours()
          return hour % heroCount
        
        default:
          return 0
      }
    }

    setSelectedIndex(selectHero())
  }, [heroCount, rotationType])

  return selectedIndex
}

// Example usage in a page component:
/*
// src/app/page.tsx
import { useHeroRotator } from '@/hooks/useHeroRotator'
import { RenderHero } from '@/heros/RenderHero'

const heroConfigs = [
  {
    type: 'heritageCraftsmanship',
    headline: 'Crafting',
    animatedWords: [
      { text: 'Excellence', colorStyle: 'word1' },
      { text: 'Tradition', colorStyle: 'word2' },
    ],
    // ... rest of heritage hero config
  },
  {
    type: 'craftsmanWorkbench',
    workbenchHeadline: 'Mastering',
    workbenchSubheadline: 'The Art of Precision',
    // ... rest of workbench hero config
  },
  {
    type: 'barrelCrossSection',
    barrelLegend: 'Our Heritage',
    // ... rest of barrel hero config
  }
]

export default function HomePage() {
  const selectedHeroIndex = useHeroRotator(heroConfigs.length, 'random')
  const currentHero = heroConfigs[selectedHeroIndex]

  return (
    <div>
      <RenderHero {...currentHero} />
      {/* Rest of your page content *}
    </div>
  )
}
*/