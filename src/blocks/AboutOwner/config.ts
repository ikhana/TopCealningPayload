// blocks/AboutOwner/config.ts

import type { Block } from 'payload'
import { sectionIdField } from '@/fields/sectionId'
import { linkWithAnchor } from '@/fields/linkWithAnchor'

export const AboutOwner: Block = {
  slug: 'aboutOwner',
  interfaceName: 'AboutOwnerBlock',
  dbName: 'abt_owner',
  fields: [
    sectionIdField(),
    
    {
      name: 'backgroundStyle',
      type: 'select',
      defaultValue: 'default',
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
      defaultValue: 'About Mazco',
    },
    
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      admin: {
        rows: 6,
        description: 'Main testimonial/about text',
      },
    },
    
    {
      name: 'authorName',
      type: 'text',
      required: true,
      defaultValue: 'Alain Mazaira',
    },
    
    {
      name: 'authorTitle',
      type: 'text',
      required: true,
      defaultValue: 'Financial Services Manager',
    },
    
    {
      name: 'authorImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Author photo',
      },
    },
    
    {
      name: 'cta',
      type: 'group',
      label: 'Call to Action Button',
      fields: [linkWithAnchor()],
    },
  ],
  labels: {
    plural: 'About Owner Sections',
    singular: 'About Owner Section',
  },
}