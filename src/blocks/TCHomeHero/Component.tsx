// src/blocks/TCHomeHero/Component.tsx
// Server wrapper — delegates all rendering to the client component.
import React from 'react'
import { TCHomeHeroClient } from './Component.client'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcHomeHero'
}

export const TCHomeHeroBlock: React.FC<Props> = (props) => {
  return <TCHomeHeroClient {...props} />
}
