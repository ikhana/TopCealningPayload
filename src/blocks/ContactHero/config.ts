// blocks/ContactHero/config.ts

import type { Block } from 'payload'
import { sectionIdField } from '@/fields/sectionId'
import { richTextField } from '@/fields/richTextField'
import { linkWithAnchor } from '@/fields/linkWithAnchor'

export const ContactHero: Block = {
  slug: 'contactHero',
  interfaceName: 'ContactHeroBlock',
  dbName: 'contact_hero',
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
      name: 'content',
      label: 'Hero Content',
      required: true,
      overrides: {
        admin: {
          description: 'Main heading and description',
        },
      },
    }),
    
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Optional hero image',
      },
    },
    
    {
      name: 'cta',
      type: 'group',
      label: 'Optional Call to Action',
      fields: [linkWithAnchor()],
    },
  ],
  labels: {
    plural: 'Contact Hero Sections',
    singular: 'Contact Hero Section',
  },
}