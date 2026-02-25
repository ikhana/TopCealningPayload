// src/heros/ClinicalGridMatrix/index.tsx
import type { Page } from '@/payload-types'
import React from 'react'
import { ClinicalGridMatrixHeroClient } from './Component.client'

export const ClinicalGridMatrixHero: React.FC<Page['hero']> = (props) => {
  const safeProps = {
    heroTitle: props.clinicalGridTitle ?? 'Precision Testing, Delivered',
    heroSubtitle: props.clinicalGridSubtitle ?? 'Professional laboratory services that come to you - because healthcare should fit your schedule, not the other way around.',
    
    primaryCTA: {
      label: props.clinicalGridPrimaryCTA?.label ?? 'Schedule Test',
      link: props.clinicalGridPrimaryCTA?.link ?? '/schedule',
    },
    
    secondaryCTA: props.clinicalGridSecondaryCTA?.label ? {
      label: props.clinicalGridSecondaryCTA.label,
      link: props.clinicalGridSecondaryCTA.link ?? '/services',
    } : undefined,
    
    gridAnimationSpeed: (props.clinicalGridAnimationSpeed ?? 'medium') as 'slow' | 'medium' | 'fast',
    backgroundStyle: (props.clinicalGridBackgroundStyle ?? 'light') as 'light' | 'dark',
  }

  return <ClinicalGridMatrixHeroClient {...safeProps} />
}