// blocks/WhyItMatters/Component.tsx

import type { WhyItMattersBlock as WhyItMattersBlockType } from '@/payload-types'
import React from 'react'
import { WhyItMattersClient } from './Component.client'

export const WhyItMattersBlock: React.FC<WhyItMattersBlockType> = (props) => {
  return <WhyItMattersClient {...props} />
}

