// blocks/GRIPP/Component.tsx

import type { GRIPPBlock as GRIPPBlockType } from '@/payload-types'
import React from 'react'
import { GRIPPClient } from './Component.client'

export const GRIPPBlock: React.FC<GRIPPBlockType> = (props) => {
  return <GRIPPClient {...props} />
}

