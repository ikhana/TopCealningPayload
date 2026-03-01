import React from 'react'
import { TCTestimonialsClient } from './Component.client'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcTestimonials'
}

export const TCTestimonialsBlock: React.FC<Props> = (props) => {
  return <TCTestimonialsClient {...props} />
}
