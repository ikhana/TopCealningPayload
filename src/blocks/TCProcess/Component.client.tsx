// src/blocks/TCProcess/Component.client.tsx
// Dispatcher — picks the right view based on the `variant` field set in Payload admin.
//
//   variant: 'monolith'     → Component.monolith.client.tsx     (hover-expand cards w/ photos)
//   variant: 'simple-steps' → Component.simple-steps.client.tsx (compact numbered stepper)

'use client'

import { TCProcessMonolith }   from './Component.monolith.client'
import { TCProcessSimpleSteps } from './Component.simple-steps.client'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcProcess'
  variant?: 'monolith' | 'simple-steps'
}

export function TCProcessClient(props: Props) {
  if (props.variant === 'simple-steps') {
    return <TCProcessSimpleSteps />
  }
  return <TCProcessMonolith />
}
