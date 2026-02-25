// src/heros/RenderHero.tsx
import React from 'react'

import type { Page } from '@/payload-types'

import { ClinicalGridMatrixHero } from '@/heros/ClinicalGridMatrix'
import { DNAInteractiveLabHero } from '@/heros/DNAInteractiveLab'
import { HeritageCraftsmanshipHero } from '@/heros/HeritageCraftsmanship'
import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'
import { TypewriterHero } from '@/heros/TypewriterHero'
import { BarrelCrossSectionHero } from './BarrelCrossSection'
import { CraftsmanWorkbenchHero } from './CraftsmanWorkbench'

const heroes = {
  typewriter: TypewriterHero,
  heritageCraftsmanship: HeritageCraftsmanshipHero,
  barrelCrossSection: BarrelCrossSectionHero,
  craftsmanWorkbench: CraftsmanWorkbenchHero,
  dnaInteractiveLab: DNAInteractiveLabHero,
  clinicalGridMatrix: ClinicalGridMatrixHero,
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
}

export const RenderHero: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}