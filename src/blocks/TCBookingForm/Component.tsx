// src/blocks/TCBookingForm/Component.tsx
import { TCBookingFormClient } from './Component.client'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcBookingForm'
}

export function TCBookingFormComponent(_props: Props) {
  return <TCBookingFormClient />
}
