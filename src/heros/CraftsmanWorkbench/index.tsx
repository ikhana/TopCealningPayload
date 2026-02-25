// src/heros/CraftsmanWorkbench/index.tsx
import type { Page } from '@/payload-types'
import React from 'react'
import { CraftsmanWorkbenchHeroClient } from './Component.client'

const getImageData = (media: any) => {
  if (media && typeof media === 'object' && 'url' in media) {
    return {
      url: media.url || '/placeholder.jpg',
      alt: media.alt || 'Workbench image',
    }
  }

  return {
    url: '/placeholder.jpg',
    alt: 'Workbench image',
  }
}

export const CraftsmanWorkbenchHero: React.FC<Page['hero']> = (props) => {
  const safeProps = {
    workbenchHeadline: props.workbenchHeadline ?? 'Crafting',
    workbenchSubheadline: props.workbenchSubheadline ?? 'Excellence by Hand',

    workbenchAreas:
      props.workbenchAreas?.map((area) => ({
        areaName: area.areaName || '',
        title: area.title || '',
        description: area.description || '',
        areaType: area.areaType || 'tools',
        position: {
          x: area.position?.x || 25,
          y: area.position?.y || 25,
        },
        id: area.id || '',
      })) || [
        {
          areaName: 'Tools',
          title: 'Precision Tools',
          description: 'Each tool in our workshop has been selected for its precision and reliability, honed through decades of experience.',
          areaType: 'tools',
          position: { x: 20, y: 30 },
          id: 'tools'
        },
        {
          areaName: 'Materials',
          title: 'Premium Materials',
          description: 'We source only the finest hardwoods, each piece carefully selected for its grain, durability, and character.',
          areaType: 'materials',
          position: { x: 70, y: 25 },
          id: 'materials'
        },
        {
          areaName: 'Blueprints',
          title: 'Design & Planning',
          description: 'Every piece begins with careful planning and precise measurements, ensuring perfect proportions and functionality.',
          areaType: 'blueprints',
          position: { x: 25, y: 70 },
          id: 'blueprints'
        },
        {
          areaName: 'Finishes',
          title: 'Heritage Finishes',
          description: 'Our time-tested finishing techniques protect and enhance the natural beauty of the wood for generations.',
          areaType: 'finishes',
          position: { x: 75, y: 75 },
          id: 'finishes'
        },
      ],

    workbenchBadgeText: props.workbenchBadgeText ?? 'Master Crafted',

    workbenchPrimaryButton: props.workbenchPrimaryButton ?? {
      label: 'Visit Workshop',
      link: '/products',
    },

    workbenchSecondaryButton: props.workbenchSecondaryButton ?? {
      label: 'Our Process',
      link: '/about',
    },

    workbenchBackgroundImage: props.workbenchBackgroundImage 
      ? getImageData(props.workbenchBackgroundImage) 
      : undefined,

    // Added proper handling for sectionBackgroundImage
    sectionBackgroundImage: props.sectionBackgroundImage 
      ? getImageData(props.sectionBackgroundImage) 
      : undefined,

    enableWoodEffects: props.enableWoodEffects ?? false,
  }

  return <CraftsmanWorkbenchHeroClient {...safeProps} />
}