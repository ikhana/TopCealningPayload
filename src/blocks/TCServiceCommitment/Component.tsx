// src/blocks/TCServiceCommitment/Component.tsx
// Server wrapper — delegates all rendering to the client component.

import React from 'react'
import { TCServiceCommitmentClient } from './Component.client'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcServiceCommitment'
}

export const TCServiceCommitmentBlock: React.FC<Props> = (props) => {
  return <TCServiceCommitmentClient {...props} />
}
