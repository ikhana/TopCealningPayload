// src/components/Media/Video/index.tsx
'use client'

import { cn } from '@/utilities/cn'
import React, { useEffect, useRef } from 'react'

import type { Props as MediaProps } from '../types'

export const Video: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName } = props

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const { current: video } = videoRef
    if (video) {
      video.addEventListener('suspend', () => {
        // Video suspended fallback handling
      })
    }
  }, [])

  if (resource && typeof resource !== 'string') {
    const { url, filename } = resource

    let videoSrc = ''
    
    if (url) {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        videoSrc = url
      } else {
        videoSrc = `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`
      }
    } else if (filename) {
      videoSrc = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/media/file/${filename}`
    }

    return (
      <video
        autoPlay
        className={cn(videoClassName)}
        controls={false}
        loop
        muted
        onClick={onClick}
        playsInline
        ref={videoRef}
      >
        <source src={videoSrc} />
      </video>
    )
  }

  return null
}