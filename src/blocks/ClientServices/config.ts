// blocks/ClientServices/config.ts

import type { Block } from 'payload'
import { sectionIdField } from '@/fields/sectionId'
import { iconSelectField } from '@/fields/iconSelect'
import { linkWithAnchor } from '@/fields/linkWithAnchor'

export const ClientServices: Block = {
  slug: 'clientServices',
  interfaceName: 'ClientServicesBlock',
  dbName: 'client_svc',
  fields: [
    sectionIdField(),
    
    {
      name: 'bgImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Optional background image',
      },
    },
    
    {
      name: 'titleIcon',
      type: 'text',
      required: false,
      admin: {
        description: 'Icon name for the title (e.g., ArrowDownLeft)',
      },
    },
    
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Client Service Menu',
    },
    
    {
      name: 'subtitle',
      type: 'text',
      required: false,
      defaultValue: 'We are here to provide value and make an impact',
    },
    
    {
      name: 'services',
      type: 'array',
      label: 'Service Cards',
      minRows: 1,
      maxRows: 12,
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
    
    {
      name: 'cta',
      type: 'group',
      label: 'Call to Action Button',
      fields: [linkWithAnchor()],
    },
  ],
  labels: {
    plural: 'Client Services Sections',
    singular: 'Client Services Section',
  },
}