// blocks/ContentShowcase/Component.tsx

import type { ContentShowcaseBlock as ContentShowcaseBlockType } from '@/payload-types'
import React from 'react'
import { ContentShowcaseClient } from './Component.client'

export const ContentShowcaseBlock: React.FC<ContentShowcaseBlockType> = (props) => {
  return <ContentShowcaseClient {...props} />
}