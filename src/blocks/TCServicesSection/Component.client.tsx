// src/blocks/TCServicesSection/Component.client.tsx
// Dispatcher — picks the right view based on the `variant` field set in Payload admin.
//
//   variant: 'home'          → Component.home.client.tsx       (crystalline hover cards)
//   variant: 'services-page' → Component.servicespage.client.tsx (filterable grid + search)

'use client'

import { TCServicesSectionHome }         from './Component.home.client'
import { TCServicesSectionServicesPage } from './Component.servicespage.client'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcServicesSection'
  variant?: 'home' | 'services-page'
}

export function TCServicesSectionClient(props: Props) {
  if (props.variant === 'services-page') {
    return <TCServicesSectionServicesPage />
  }
  return <TCServicesSectionHome />
}
