// blocks/HeroFeatures/config.ts

import type { Block } from 'payload'
import { sectionIdField } from '@/fields/sectionId'
import { richTextField, richTextSimple } from '@/fields/richTextField'
import { linkWithAnchor } from '@/fields/linkWithAnchor'
import { iconSelectField } from '@/fields/iconSelect'

export const HeroFeatures: Block = {
  slug: 'heroFeatures',
  interfaceName: 'HeroFeaturesBlock',
  dbName: 'hero_feat',
  fields: [
    sectionIdField(),
    
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Hero background image',
      },
    },
    
    {
      name: 'overlayOpacity',
      type: 'select',
      defaultValue: '80',
      options: [
        { label: '40%', value: '40' },
        { label: '50%', value: '50' },
        { label: '60%', value: '60' },
        { label: '70%', value: '70' },
        { label: '80%', value: '80' },
        { label: '90%', value: '90' },
      ],
      admin: {
        description: 'Dark overlay opacity over background image',
      },
    },
    
    richTextSimple({
      name: 'heading1',
      label: 'Heading (Part 1)',
      required: true,
      overrides: {
        admin: {
          description: 'First part of the heading (white text)',
        },
      },
    }),
    
    richTextSimple({
      name: 'heading2',
      label: 'Heading (Part 2 - Highlighted)',
      required: false,
      overrides: {
        admin: {
          description: 'Second part of the heading (golden/primary color)',
        },
      },
    }),
    
    richTextField({
      name: 'description',
      label: 'Description',
      required: false,
    }),
    
    {
      name: 'cta1',
      type: 'group',
      label: 'Primary CTA Button',
      fields: [linkWithAnchor()],
    },
    
    {
      name: 'cta2',
      type: 'group',
      label: 'Secondary CTA Button',
      fields: [linkWithAnchor()],
    },
    
    {
      name: 'features',
      type: 'array',
      label: 'Feature Cards',
      minRows: 2,
      maxRows: 6,
      admin: {
        description: 'Feature highlights displayed below the hero',
      },
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
          admin: {
            description: 'Feature title',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            rows: 2,
            description: 'Short feature description',
          },
        },
      ],
    },
  ],
  labels: {
    plural: 'Hero with Features Sections',
    singular: 'Hero with Features Section',
  },
}