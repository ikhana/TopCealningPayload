// src/blocks/TCContactForm/Component.tsx
// Server wrapper — delegates to client component.

import React from 'react'
import { TCContactFormClient } from './Component.client'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcContactForm'
}

export const TCContactFormBlock: React.FC<Props> = (props) => {
  return <TCContactFormClient {...props} />
}
