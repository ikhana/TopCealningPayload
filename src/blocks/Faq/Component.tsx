import type { FaqBlock as FaqBlockType } from '@/payload-types'
import React from 'react'
import { FaqClient } from './Component.client'

export const FaqBlock: React.FC<FaqBlockType> = (props) => {
  return <FaqClient {...props} />
}