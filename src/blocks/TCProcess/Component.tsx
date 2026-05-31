// src/blocks/TCProcess/Component.tsx
// Server wrapper — forwards variant prop to the client dispatcher.

import React from 'react'
import { TCProcessClient } from './Component.client'

type Variant = 'monolith' | 'simple-steps'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcProcess'
  variant?: Variant | null
}

export const TCProcessBlock: React.FC<Props> = ({ variant, ...rest }) => {
  return <TCProcessClient {...rest} variant={(variant as Variant) ?? 'monolith'} />
}
