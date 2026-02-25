// blocks/ContentShowcase/config.ts

import type { Block } from 'payload'
import { sectionIdField } from '@/fields/sectionId'
import { richTextField } from '@/fields/richTextField'
import { linkWithAnchor } from '@/fields/linkWithAnchor'

export const ContentShowcase: Block = {
  slug: 'contentShowcase',
  interfaceName: 'ContentShowcaseBlock',
  dbName: 'content_showcase',
  fields: [
    sectionIdField(),
    
    {
      name: 'backgroundStyle',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default (White)', value: 'default' },
        { label: 'Muted', value: 'muted' },
        { label: 'Card', value: 'card' },
      ],
      admin: {
        description: 'Background color style',
      },
    },
    
    richTextField({
      name: 'leftContent',
      label: 'Left Column Content',
      required: true,
      overrides: {
        admin: {
          description: 'Main content for left column (headings, paragraphs, etc.)',
        },
      },
    }),
    
    {
      name: 'leftImages',
      type: 'array',
      label: 'Left Column Images',
      minRows: 0,
      maxRows: 3,
      admin: {
        description: 'Up to 3 images for left column',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    
    richTextField({
      name: 'rightContent',
      label: 'Right Column Content',
      required: false,
      overrides: {
        admin: {
          description: 'Content for right column (optional)',
        },
      },
    }),
    
    {
      name: 'rightImages',
      type: 'array',
      label: 'Right Column Images',
      minRows: 0,
      maxRows: 3,
      admin: {
        description: 'Up to 3 images for right column',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    
    {
      name: 'cta',
      type: 'group',
      label: 'Optional Call to Action',
      fields: [linkWithAnchor()],
    },
  ],
  labels: {
    plural: 'Content Showcase Sections',
    singular: 'Content Showcase Section',
  },
}