// blocks/ClientServices/Component.tsx

import type { ClientServicesBlock as ClientServicesBlockType } from '@/payload-types'
import React from 'react'
import { ClientServicesClient } from './Component.client'

export const ClientServicesBlock: React.FC<ClientServicesBlockType> = (props) => {
  return <ClientServicesClient {...props} />
}

