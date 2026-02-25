'use client'
import type { Page } from '@/payload-types'
import React from 'react'
import { DNAInteractiveLabHeroClient } from './Component.client'

const getImageData = (media: any) => {
  if (media && typeof media === 'object' && 'url' in media) {
    return {
      url: media.url || '/images/medical-lab-hero-bg.jpg',
      alt: media.alt || 'Medical laboratory background',
    }
  }

  return {
    url: '/images/medical-lab-hero-bg.jpg',
    alt: 'Medical laboratory background',
  }
}

const getTestCategories = (categories: any[]) => {
  if (!categories || categories.length === 0) {
    return [
      {
        id: 'genetic',
        name: 'Genetic Testing',
        description: 'Comprehensive genetic analysis and predisposition testing',
        icon: 'genetic' as const,
        color: 'coral' as const,
      },
      {
        id: 'cancer',
        name: 'Cancer Screening', 
        description: 'Early detection and diagnostic cancer screening services',
        icon: 'cancer' as const,
        color: 'blue' as const,
      },
      {
        id: 'employment',
        name: 'Employment Testing',
        description: 'Professional health assessments and workplace testing',
        icon: 'employment' as const,
        color: 'teal' as const,
      }
    ]
  }

  return categories.map(category => ({
    id: category.id || 'test',
    name: category.name || 'Test Category',
    description: category.description || 'Professional testing services',
    icon: (category.icon || 'genetic') as 'genetic' | 'cancer' | 'employment',
    color: (category.color || 'coral') as 'blue' | 'teal' | 'green' | 'coral',
    ctaLink: category.ctaLink || undefined,
  }))
}

export const DNAInteractiveLabHero: React.FC<Page['hero']> = (props) => {
  const safeProps = {
    heroTitle: props.heroTitle ?? 'Advanced Medical Testing',
    heroSubtitle: props.heroSubtitle ?? 'Precision diagnostics with cutting-edge technology and compassionate care',
    
    backgroundImage: props.backgroundImage ? getImageData(props.backgroundImage) : null,
    overlayStrength: (props.overlayStrength ?? 'medium') as 'none' | 'light' | 'medium' | 'strong',
    
    enableDNAAnimation: props.enableDNAAnimation ?? true,
    enableParticleAnimation: props.enableParticleAnimation ?? true,
    
    testCategories: getTestCategories(props.testCategories || []),
    
    showLabStats: props.showLabStats ?? true,
    customStats: props.customStats || undefined,
    
    ctaText: props.dnaLabPrimaryButton?.label || 'View All Tests',
    ctaLink: props.dnaLabPrimaryButton?.link || '/available-tests',
    secondaryCTAText: props.dnaLabSecondaryButton?.label || 'Find Locations',
    secondaryCTALink: props.dnaLabSecondaryButton?.link || '/find-us',
    
    animationSpeed: props.animationSpeed ?? 20,
    segmentTransitionSpeed: props.segmentTransitionSpeed ?? 4,
    particleCount: props.particleCount ?? 12,
  }

  return <DNAInteractiveLabHeroClient {...safeProps} />
}