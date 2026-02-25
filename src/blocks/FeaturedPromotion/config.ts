// src/blocks/FeaturedPromotion/config.ts - CLEANED ADMIN (Content-Only)
import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

export const FeaturedPromotion: Block = {
  slug: 'featuredPromotion',
  interfaceName: 'FeaturedPromotionBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Featured Promotion',
      admin: {
        description: 'Main headline for the promotion',
      },
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      admin: {
        description: 'Promotional content and details',
      },
    },
    {
      name: 'mediaSource',
      type: 'select',
      defaultValue: 'upload',
      options: [
        {
          label: 'Custom Media Upload',
          value: 'upload',
        },
        {
          label: 'Featured Product',
          value: 'product',
        },
      ],
      admin: {
        description: 'Choose media source for the promotion',
      },
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData.mediaSource === 'upload',
        description: 'Upload custom promotional image',
      },
    },
    {
      name: 'featuredProduct',
      type: 'relationship',
      relationTo: 'products',
      admin: {
        condition: (_, siblingData) => siblingData.mediaSource === 'product',
        description: 'Select a product to feature in this promotion',
      },
    },
    {
      name: 'enableCTA',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Include a call-to-action button',
      },
    },
    link({
      overrides: {
        admin: {
          condition: (_, { enableCTA }) => Boolean(enableCTA),
          description: 'Configure the call-to-action button',
        },
      },
    }),
    {
      name: 'cornerLabel',
      type: 'text',
      admin: {
        description: 'Optional promotional badge (e.g., "Limited Edition", "New Release")',
        placeholder: 'Limited Edition',
      },
    },
    // ❌ REMOVED: layout field (admin styling option)
    // ✅ All visual styling controlled by developer in Component.tsx
  ],
  labels: {
    plural: 'Featured Promotions',
    singular: 'Featured Promotion',
  },
}