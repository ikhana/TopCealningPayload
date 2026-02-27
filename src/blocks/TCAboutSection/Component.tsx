// src/blocks/TCAboutSection/Component.tsx
// Server wrapper — delegates all rendering to the client component.
import React from 'react'
import { TCAboutSectionClient } from './Component.client'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcAboutSection'
}

export const TCAboutSectionBlock: React.FC<Props> = (props) => {
  return <TCAboutSectionClient {...props} />
}
