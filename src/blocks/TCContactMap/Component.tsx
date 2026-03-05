// src/blocks/TCContactMap/Component.tsx
// Server wrapper — delegates to client component.

import React from 'react'
import { TCContactMapClient } from './Component.client'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcContactMap'
  embedUrl?: string | null
  mapsUrl?: string | null
}

export const TCContactMapBlock: React.FC<Props> = (props) => {
  return <TCContactMapClient {...props} />
}
