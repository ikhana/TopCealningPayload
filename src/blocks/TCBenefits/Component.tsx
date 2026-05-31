// src/blocks/TCBenefits/Component.tsx
// Server wrapper — delegates to client component (framer-motion needs client).

import React from 'react'
import { TCBenefitsClient } from './Component.client'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcBenefits'
}

export const TCBenefitsBlock: React.FC<Props> = (props) => {
  return <TCBenefitsClient {...props} />
}
