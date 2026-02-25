// blocks/AboutOwner/Component.tsx

import type { AboutOwnerBlock as AboutOwnerBlockType } from '@/payload-types'
import React from 'react'
import { AboutOwnerClient } from './Component.client'

export const AboutOwnerBlock: React.FC<AboutOwnerBlockType> = (props) => {
  return <AboutOwnerClient {...props} />
}

