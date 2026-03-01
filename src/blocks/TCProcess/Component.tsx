import React from 'react'
import { TCProcessClient } from './Component.client'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcProcess'
}

export const TCProcessBlock: React.FC<Props> = (props) => {
  return <TCProcessClient {...props} />
}
