// src/blocks/ServicesExplorer/Component.client.tsx
'use client'

import type { ServicesExplorerBlock as ServicesExplorerBlockType } from '@/payload-types'
import React from 'react'
import { DesktopView } from './DesktopView'
import { MobileView } from './MobileView'

export const ServicesExplorerClient: React.FC<ServicesExplorerBlockType & { id?: string }> = (props) => {
  return (
    <section 
      id={props.id}
      className="relative w-full"
      aria-labelledby="services-explorer-heading"
    >
      <DesktopView blockData={props} />
      <MobileView blockData={props} />
    </section>
  )
}