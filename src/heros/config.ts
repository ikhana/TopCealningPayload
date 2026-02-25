// src/heros/config.ts
import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'Heritage Craftsmanship (Premium)',
          value: 'heritageCraftsmanship',
        },
        {
          label: 'Barrel Cross-Section',
          value: 'barrelCrossSection',
        },
        {
          label: 'Craftsman Workbench',
          value: 'craftsmanWorkbench',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
      admin: {
        description: 'For Heritage Craftsmanship: Use H1 for main title, H2 for subtitle, and paragraph for description. Rich content with burgundy wine accents.',
      },
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          description: 'Heritage call-to-action buttons. Primary uses burgundy wine styling, secondary uses aged oak outline.',
        },
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact', 'heritageCraftsmanship'].includes(type),
        description: 'For Heritage Craftsmanship: Use high-quality bourbon heritage images. Workshop scenes, craftsmanship details, or heritage moments work best.',
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}