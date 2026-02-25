

// blocks/ContactForm/Component.tsx

import type { ContactFormBlock as ContactFormBlockType } from '@/payload-types'
import React from 'react'
import { ContactFormClient } from './Component.client'

export const ContactFormBlock: React.FC<ContactFormBlockType> = (props) => {
  return <ContactFormClient {...props} />
}