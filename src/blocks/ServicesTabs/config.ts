// blocks/ServicesTabs/config.ts

import type { Block } from 'payload'
import { sectionIdField } from '@/fields/sectionId'
import { iconSelectField } from '@/fields/iconSelect'

export const ServicesTabs: Block = {
  slug: 'servicesTabs',
  interfaceName: 'ServicesTabsBlock',
  dbName: 'services_tabs',
  fields: [
    sectionIdField(),
    
    {
      name: 'headerOffset',
      type: 'number',
      defaultValue: 80,
      admin: {
        description: 'Height of your fixed header in pixels (for sticky positioning)',
      },
    },
    
    {
      name: 'tabs',
      type: 'array',
      label: 'Service Tabs',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Tab title (e.g., "Individuals & Families")',
          },
        },
        
        {
          name: 'sectionHeading',
          type: 'text',
          required: true,
          admin: {
            description: 'Main heading displayed in the tab content',
          },
        },
        
        {
          name: 'sectionDescription',
          type: 'textarea',
          required: false,
          admin: {
            rows: 3,
            description: 'Description text below the section heading',
          },
        },
        
        {
          name: 'services',
          type: 'array',
          label: 'Service Cards',
          minRows: 1,
          maxRows: 20,
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
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              admin: {
                rows: 3,
              },
            },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Services Tabs Sections',
    singular: 'Services Tabs Section',
  },
}