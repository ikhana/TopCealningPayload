// blocks/ValuesGrid/config.ts

import type { Block } from 'payload'
import { sectionIdField } from '@/fields/sectionId'
import { richTextField } from '@/fields/richTextField'
import { iconSelectField } from '@/fields/iconSelect'
import { linkWithAnchor } from '@/fields/linkWithAnchor'

export const ValuesGrid: Block = {
  slug: 'valuesGrid',
  interfaceName: 'ValuesGridBlock',
  dbName: 'values_grid',
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
      name: 'eyebrow',
      type: 'text',
      required: false,
      maxLength: 50,
      admin: {
        description: 'Small text above title (max 50 characters)',
      },
    },
    
    richTextField({
      name: 'content',
      label: 'Title & Description',
      required: true,
      overrides: {
        admin: {
          description: 'Main heading and description text',
        },
      },
    }),
    
    {
      name: 'values',
      type: 'array',
      label: 'Value Cards',
      minRows: 1,
      maxRows: 8,
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
          maxLength: 30,
          admin: {
            description: 'Value title (max 30 characters)',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          maxLength: 250,
          admin: {
            rows: 4,
            description: 'Value description (max 250 characters)',
          },
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
    plural: 'Values Grid Sections',
    singular: 'Values Grid Section',
  },
}