// blocks/WhyItMatters/config.ts

import type { Block } from 'payload'
import { sectionIdField } from '@/fields/sectionId'
import { richTextSimple } from '@/fields/richTextField'

export const WhyItMatters: Block = {
  slug: 'whyItMatters',
  interfaceName: 'WhyItMattersBlock',
  dbName: 'why_matters',
  fields: [
    sectionIdField(),
    
    {
      name: 'backgroundStyle',
      type: 'select',
      defaultValue: 'muted',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Muted Gray', value: 'muted' },
        { label: 'Light Accent', value: 'accent' },
        { label: 'Subtle Gradient', value: 'gradient' },
      ],
      admin: {
        description: 'Choose background style for the section',
      },
    },
    
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: "The Current Way Isn't Working",
    },
    
    {
      name: 'stats',
      type: 'array',
      label: 'Statistics',
      minRows: 2,
      maxRows: 8,
      fields: [
        richTextSimple({
          name: 'statValue',
          label: 'Statistic Value',
          required: true,
          overrides: {
            admin: {
              description: 'The number or percentage (e.g., 68%, $182,100)',
            },
          },
        }),
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            rows: 2,
            description: 'Description of the statistic',
          },
        },
      ],
    },
    
    {
      name: 'textureImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Background texture image (right side)',
      },
    },
    
    {
      name: 'overlayImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Main image overlaid on texture background',
      },
    },
    
    {
      name: 'disclaimer',
      type: 'textarea',
      required: false,
      admin: {
        rows: 2,
        description: 'Optional disclaimer text below stats',
      },
    },
  ],
  labels: {
    plural: 'Why It Matters Sections',
    singular: 'Why It Matters Section',
  },
}