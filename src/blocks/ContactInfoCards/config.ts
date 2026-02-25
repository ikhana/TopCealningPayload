// blocks/ContactInfoCards/config.ts

import type { Block } from 'payload'
import { sectionIdField } from '@/fields/sectionId'
import { iconSelectField } from '@/fields/iconSelect'
import { linkWithAnchor } from '@/fields/linkWithAnchor'

export const ContactInfoCards: Block = {
  slug: 'contactInfoCards',
  interfaceName: 'ContactInfoCardsBlock',
  dbName: 'contact_info_cards',
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
    
    {
      name: 'cards',
      type: 'array',
      label: 'Contact Cards',
      minRows: 1,
      maxRows: 6,
      fields: [
        iconSelectField({
          name: 'icon',
          label: 'Icon',
          required: true,
        }),
        {
          name: 'title',
          type: 'text',
          required: true,
          maxLength: 40,
          admin: {
            description: 'Card title (max 40 characters)',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          maxLength: 250,
          admin: {
            rows: 4,
            description: 'Card description (max 250 characters)',
          },
        },
        {
          name: 'link',
          type: 'group',
          label: 'Optional Link/Button',
          fields: [linkWithAnchor()],
        },
      ],
    },
  ],
  labels: {
    plural: 'Contact Info Card Sections',
    singular: 'Contact Info Card Section',
  },
}