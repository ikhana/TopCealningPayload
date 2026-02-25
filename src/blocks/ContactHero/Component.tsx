// blocks/ContactHero/Component.tsx

import type { ContactHeroBlock as ContactHeroBlockType } from '@/payload-types'
import React from 'react'
import { ContactHeroClient } from './Component.client'

export const ContactHeroBlock: React.FC<ContactHeroBlockType> = (props) => {
  return <ContactHeroClient {...props} />
}