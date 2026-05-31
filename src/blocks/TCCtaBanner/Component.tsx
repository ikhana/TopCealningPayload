// src/blocks/TCCtaBanner/Component.tsx
// Server wrapper — passes variant prop through to the client component.

import React from 'react'
import { TCCtaBannerClient } from './Component.client'

type Variant = 'teal' | 'navy'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcCtaBanner'
  variant?: Variant | null
}

export const TCCtaBannerBlock: React.FC<Props> = ({ variant, ...rest }) => {
  return <TCCtaBannerClient {...rest} variant={(variant as Variant) ?? 'teal'} />
}
