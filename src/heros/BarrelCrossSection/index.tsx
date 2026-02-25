// src/heros/BarrelCrossSection/index.tsx - Charcoal & Bourbon Theme
import type { Page } from '@/payload-types'
import React from 'react'
import { BarrelCrossSectionHeroClient } from './Component.client'

const getImageData = (media: any) => {
  if (media && typeof media === 'object' && 'url' in media) {
    return {
      url: media.url || '/placeholder.jpg',
      alt: media.alt || 'Heritage craftsman image',
    }
  }
  
  return {
    url: '/placeholder.jpg',
    alt: 'Heritage craftsman image',
  }
}

export const BarrelCrossSectionHero: React.FC<Page['hero']> = (props) => {
  const safeProps = {
    barrelHeadline: props.barrelHeadline ?? 'Our',
    
    // Wood background support
    barrelWoodBackground: props.barrelWoodBackground ? getImageData(props.barrelWoodBackground) : undefined,
    
    brandPillars:
      props.brandPillars?.map((pillar) => ({
        label: pillar.label || '',
        description: pillar.description || '',
        // Removed colorStyle - now using unified Charcoal & Bourbon theme
        ringPosition: pillar.ringPosition || 'outer',
        id: pillar.id || '',
      })) || [
        {
          label: 'Heritage',
          description: 'Time-honored traditions passed down through generations of craftsmen',
          ringPosition: 'outer' as const,
          id: 'heritage'
        },
        {
          label: 'Quality', 
          description: 'Uncompromising standards in every detail of our craftsmanship',
          ringPosition: 'middleOuter' as const,
          id: 'quality'
        },
        {
          label: 'Community',
          description: 'Building lasting relationships with every interaction and product',
          ringPosition: 'middleInner' as const,
          id: 'community'
        },
        {
          label: 'Excellence',
          description: 'Pursuing perfection in craft and service with heritage pride',
          ringPosition: 'inner' as const,
          id: 'excellence'
        },
      ],
    
    barrelBadgeText: props.barrelBadgeText ?? 'Heritage Crafted Excellence',
    
    barrelPrimaryButton: props.barrelPrimaryButton ?? {
      label: 'Explore Heritage',
      link: '/products',
    },
    
    barrelSecondaryButton: props.barrelSecondaryButton ?? {
      label: 'Our Legacy',
      link: '/about',
    },
    
    craftsmanshipSteps:
      props.craftsmanshipSteps?.map((item) => ({
        step: item.step || '',
        id: item.id || '',
      })) || [
        { step: 'Select', id: 'select' },
        { step: 'Craft', id: 'craft' },
        { step: 'Perfect', id: 'perfect' },
        { step: 'Deliver', id: 'deliver' },
      ],
    
    barrelImages:
      props.barrelImages?.map((item) => ({
        image: getImageData(item.image),
      })) || [],
    
    logoImage: props.logoImage ? getImageData(props.logoImage) : undefined,
  }
  
  return <BarrelCrossSectionHeroClient {...safeProps} />
}