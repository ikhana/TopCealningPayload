// src/heros/HeritageCraftsmanship/index.tsx
'use client'
import type { Page } from '@/payload-types'
import React from 'react'
import { HeritageCraftsmanshipHeroClient } from './Component.client'

const getImageData = (media: any) => {
  if (media && typeof media === 'object' && 'url' in media) {
    return {
      url: media.url || '/placeholder.jpg',
      alt: media.alt || 'Workshop image',
    }
  }

  return {
    url: '/placeholder.jpg',
    alt: 'Workshop image',
  }
}

export const HeritageCraftsmanshipHero: React.FC<Page['hero']> = (props) => {
  const safeProps = {
    headline: props.headline ?? 'Crafting',

    animatedWords:
      props.animatedWords?.map((word) => ({
        text: word.text || '',
        colorStyle: word.colorStyle || 'word1',
      })) || [
        { text: 'Excellence', colorStyle: 'word1' },
        { text: 'Heritage', colorStyle: 'word2' },
        { text: 'Legacy', colorStyle: 'word3' },
          { text: 'Sample word', colorStyle: 'word1' },
      ],

    description:
      props.description ??
      "Where traditional artistry meets contemporary design. Every piece tells a story of dedication, precision, and time-honored techniques passed down through generations.",

    primaryButton: props.primaryButton ?? {
      label: 'Explore Collection',
      link: '/products',
    },

    secondaryButton: props.secondaryButton ?? {
      label: 'Our Story',
      link: '/about',
    },

    workshopImages:
      props.workshopImages?.map((item) => ({
        image: getImageData(item.image),
      })) || [
        { image: { url: '/placeholder.jpg', alt: 'Workshop scene 1' } },
        { image: { url: '/placeholder.jpg', alt: 'Workshop scene 2' } },
        { image: { url: '/placeholder.jpg', alt: 'Workshop scene 3' } },
        { image: { url: '/placeholder.jpg', alt: 'Workshop scene 4' } },
      ],

    // NEW: Wood background image support
    workshopBackgroundImage: props.workshopBackgroundImage 
      ? getImageData(props.workshopBackgroundImage)
      : null,

    heritageYear: props.heritageYear ?? '1985',
    craftmanshipLabel: props.craftmanshipLabel ?? 'Handcrafted Excellence',
  }

  return <HeritageCraftsmanshipHeroClient {...safeProps} />
}