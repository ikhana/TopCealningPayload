// src/blocks/TCServicesSection/config.ts
import type { Block } from 'payload'

export const TCServicesSection: Block = {
  slug: 'tcServicesSection',
  interfaceName: 'TCServicesSectionBlock',
  dbName: 'tc_services_section',
  labels: {
    singular: 'TC Services Section',
    plural: 'TC Services Sections',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'home',
      required: true,
      options: [
        {
          label: 'Home Page — Crystalline hover cards',
          value: 'home',
        },
        {
          label: 'Services Page — Filterable grid with search',
          value: 'services-page',
        },
      ],
      admin: {
        description:
          'Home: full-image hover-reveal cards for the homepage. Services Page: filterable grid with search bar, used on the /services page.',
      },
    },
  ],
}
