// blocks/ValuesGrid/Component.tsx

import type { ValuesGridBlock as ValuesGridBlockType } from '@/payload-types'
import React from 'react'
import { ValuesGridClient } from './Component.client'

export const ValuesGridBlock: React.FC<ValuesGridBlockType> = (props) => {
  return <ValuesGridClient {...props} />
}