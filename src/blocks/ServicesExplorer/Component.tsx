// src/blocks/ServicesExplorer/Component.tsx
import type { ServicesExplorerBlock as ServicesExplorerBlockType } from '@/payload-types'
import React from 'react'
import { ServicesExplorerClient } from './Component.client'

export const ServicesExplorerBlock: React.FC<ServicesExplorerBlockType & { id?: string }> = (props) => {
  return <ServicesExplorerClient {...props} />
}