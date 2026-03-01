// src/blocks/TCWhyTop/Component.tsx
// Server wrapper — delegates all rendering to the client component.

import React from 'react'
import { TCWhyTopSectionClient } from './Component.client'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcWhyTopSection'
}

export const TCWhyTopSectionBlock: React.FC<Props> = (props) => {
  return <TCWhyTopSectionClient {...props} />
}
