// blocks/ServicesTabs/Component.tsx

import type { ServicesTabsBlock as ServicesTabsBlockType } from '@/payload-types'
import React from 'react'
import { ServicesTabsClient } from './Component.client'

export const ServicesTabsBlock: React.FC<ServicesTabsBlockType> = (props) => {
  return <ServicesTabsClient {...props} />
}