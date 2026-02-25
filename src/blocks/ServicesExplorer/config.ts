// src/blocks/ServicesExplorer/config.ts
import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const ServicesExplorer: Block = {
  slug: 'servicesExplorer',
  interfaceName: 'ServicesExplorerBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Professional Laboratory Services',
    },
    {
      name: 'subtitle',
      type: 'text',
      defaultValue: 'Comprehensive diagnostic testing with advanced technology',
    },

    {
      name: 'bookingType',
      type: 'select',
      required: true,
      defaultValue: 'scroll',
      options: [
        { label: 'Scroll to Calendar', value: 'scroll' },
        { label: 'External URL', value: 'external' },
      ],
      admin: {
        description: 'Default "Book Test" button action',
      },
    },
    {
      name: 'scrollTarget',
      type: 'text',
      defaultValue: 'calendar-section',
      admin: {
        condition: (_, { bookingType }) => bookingType === 'scroll',
        description: 'Block ID to scroll to',
      },
    },
    {
      name: 'bookingUrl',
      type: 'text',
      admin: {
        condition: (_, { bookingType }) => bookingType === 'external',
        description: 'External booking URL',
      },
    },

    {
      name: 'enableSearch',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'enableFilters',
      type: 'checkbox',
      defaultValue: true,
    },

    {
      name: 'categoryGuidance',
      type: 'array',
      admin: {
        description: 'Optional: Define suggested categories for consistency across your lab services. Tests can use any category name, but these provide helpful guidance.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'categoryName',
          type: 'text',
          required: true,
          admin: {
            description: 'Suggested category name for organizing tests',
            placeholder: 'e.g., Cardiovascular Health',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Optional: Brief description of what tests belong in this category',
            rows: 2,
            placeholder: 'Tests related to heart health, blood pressure, cholesterol...',
          },
        },
      ],
    },

    {
      name: 'tests',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 1000,
      fields: [
        {
          name: 'testId',
          type: 'text',
          admin: {
            description: 'Auto-generated if empty (NBL_001, NBL_002...)',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: { rows: 3 },
        },
        {
          name: 'category',
          type: 'text',
          required: true,
          admin: {
            description: 'Enter category name - categories are created automatically. See "Category Guidance" above for suggestions.',
            placeholder: 'e.g., Cardiovascular Health, Women\'s Health, Cancer Detection...',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            description: 'Test preview image (optional - fallback design will be used if not provided)',
          },
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'blood',
          options: [
            { label: 'Blood', value: 'blood' },
            { label: 'Urine', value: 'urine' },
            { label: 'Saliva', value: 'saliva' },
            { label: 'Hair', value: 'hair' },
            { label: 'Panel', value: 'panel' },
          ],
        },
        {
          name: 'turnaround',
          type: 'text',
          required: true,
          defaultValue: '24-48 hours',
        },
        {
          name: 'mobile',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Mobile collection available',
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
        },
        
        {
          name: 'details',
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
            description: 'Detailed test information with rich formatting. Use H2 for section headers (Preparation, Clinical Relevance, etc.)',
          },
        },

        {
          name: 'features',
          type: 'array',
          admin: {
            description: 'Optional: Key features/benefits of this test',
            initCollapsed: true,
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
          ],
        },

        {
          name: 'customBook',
          type: 'checkbox',
          admin: {
            description: 'Override default booking action',
          },
        },
        {
          name: 'customType',
          type: 'select',
          options: [
            { label: 'Scroll to Calendar', value: 'scroll' },
            { label: 'External URL', value: 'external' },
          ],
          admin: {
            condition: (_, { customBook }) => customBook,
          },
        },
        {
          name: 'customTarget',
          type: 'text',
          admin: {
            condition: (_, { customBook, customType }) => customBook && customType === 'scroll',
          },
        },
        {
          name: 'customUrl',
          type: 'text',
          admin: {
            condition: (_, { customBook, customType }) => customBook && customType === 'external',
          },
        },
      ],
    },

    {
      name: 'sortBy',
      type: 'select',
      defaultValue: 'featured',
      options: [
        { label: 'Featured First', value: 'featured' },
        { label: 'Alphabetical', value: 'alpha' },
        { label: 'Category', value: 'category' },
      ],
    },
  ],
  labels: {
    singular: 'Services Explorer',
    plural: 'Services Explorer',
  },
}

//new one 