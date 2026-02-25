// blocks/ContactInfoCards/Component.tsx

import type { ContactInfoCardsBlock as ContactInfoCardsBlockType } from '@/payload-types'
import React from 'react'
import { ContactInfoCardsClient } from './Component.client'

export const ContactInfoCardsBlock: React.FC<ContactInfoCardsBlockType> = (props) => {
  return <ContactInfoCardsClient {...props} />
}