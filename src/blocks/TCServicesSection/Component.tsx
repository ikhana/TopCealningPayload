// src/blocks/TCServicesSection/Component.tsx
// Server wrapper — delegates all rendering to the client component.

import React from 'react'
import { TCServicesSectionClient } from './Component.client'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcServicesSection'
}

export const TCServicesSectionBlock: React.FC<Props> = (props) => {
  return <TCServicesSectionClient {...props} />
}
