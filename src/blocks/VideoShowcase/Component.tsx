// blocks/VideoShowcase/Component.tsx

import type { VideoShowcaseBlock as VideoShowcaseBlockType } from '@/payload-types'
import React from 'react'
import { VideoShowcaseClient } from './Component.client'

export const VideoShowcaseBlock: React.FC<VideoShowcaseBlockType> = (props) => {
  return <VideoShowcaseClient {...props} />
}

