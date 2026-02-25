import type { HeroFeaturesBlock as HeroFeaturesBlockType } from '@/payload-types'
import React from 'react'
import { HeroFeaturesClient } from './Component.client'

export const HeroFeaturesBlock: React.FC<HeroFeaturesBlockType> = (props) => {
  return <HeroFeaturesClient {...props} />
}