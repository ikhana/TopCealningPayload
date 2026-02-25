// blocks/AboutSplit/Component.tsx

import type { AboutSplitBlock as AboutSplitBlockType } from '@/payload-types'
import React from 'react'
import { AboutSplitClient } from './Component.client'

export const AboutSplitBlock: React.FC<AboutSplitBlockType> = (props) => {
  return <AboutSplitClient {...props} />
}