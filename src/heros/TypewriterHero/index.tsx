// src/heros/TypewriterHero/index.tsx
import type { Page } from '@/payload-types'
import React from 'react'
import { TypewriterHeroClient } from './Component.client'

const getImageData = (media: any) => {
  if (media && typeof media === 'object' && 'url' in media) {
    return {
      url: media.url || '/placeholder.jpg',
      alt: media.alt || 'Contact background',
    }
  }

  return {
    url: '/placeholder.jpg',
    alt: 'Contact background',
  }
}

export const TypewriterHero: React.FC<Page['hero']> = (props) => {
  const safeProps = {
    headline: props.typewriterHeadline ?? 'Go ahead, ',
    
    phrases: props.typewriterPhrases?.map((phrase) => phrase.phrase).filter(Boolean) || [
      'pour us your thoughts.',
      'share your spirit.',
      'raise a glass with us.',
      'send us a message.',
      "let's talk bourbon.",
      'connect with connoisseurs.',
      'join our circle.',
      'craft your inquiry.',
      'light up a conversation.',
      'send smoke signals.',
      'savor the connection.',
      'uncork your questions.',
    ],

    backgroundImage: props.typewriterBackground 
      ? getImageData(props.typewriterBackground)
      : { url: '/placeholder.jpg', alt: 'Contact background' },

    overlayStrength: props.typewriterOverlayStrength ?? 'medium',
    typingSpeed: props.typewriterTypingSpeed ?? 150,
    pauseTime: props.typewriterPauseTime ?? 3000,
  }

  return <TypewriterHeroClient {...safeProps} />
}