// src/blocks/ServiceCoverage/config.ts
import type { Block } from 'payload'

export const ServiceCoverage: Block = {
  slug: 'serviceCoverage',
  interfaceName: 'ServiceCoverageBlock',
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      required: true,
      defaultValue: 'Arizona Coverage Areas',
      admin: {
        description: 'Main section heading',
      },
    },
    {
      name: 'sectionSubtitle',
      type: 'text',
      required: true,
      defaultValue: 'Professional mobile lab services across Arizona',
      admin: {
        description: 'Subtitle below main heading',
      },
    },
    {
      name: 'mapImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Arizona coverage map image (SVG recommended)',
      },
    },
    {
      name: 'coverageStats',
      type: 'group',
      fields: [
        {
          name: 'citiesServed',
          type: 'text',
          required: true,
          defaultValue: '15+',
          admin: {
            description: 'Number of cities served (e.g., "15+")',
          },
        },
        {
          name: 'serviceRadius',
          type: 'text',
          required: true,
          defaultValue: '50 miles',
          admin: {
            description: 'Service radius distance (e.g., "50 miles")',
          },
        },
        {
          name: 'responseTime',
          type: 'text',
          required: true,
          defaultValue: 'Same day availability',
          admin: {
            description: 'Response time promise (e.g., "Same day availability")',
          },
        },
      ],
    },
    {
      name: 'cities',
      type: 'array',
      required: true,
      minRows: 4,
      maxRows: 12,
      defaultValue: [
        { name: 'Phoenix', status: 'available' },
        { name: 'Scottsdale', status: 'available' },
        { name: 'Tempe', status: 'available' },
        { name: 'Mesa', status: 'available' },
        { name: 'Chandler', status: 'available' },
        { name: 'Glendale', status: 'available' },
        { name: 'Tucson', status: 'available' },
        { name: 'Flagstaff', status: 'available' },
      ],
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'City name',
          },
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'available',
          options: [
            {
              label: 'Available',
              value: 'available',
            },
            {
              label: 'Coming Soon',
              value: 'coming-soon',
            },
            {
              label: 'On Request',
              value: 'on-request',
            },
          ],
        },
      ],
    },
    {
      name: 'ctaButton',
      type: 'group',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          defaultValue: 'FIND LAB NEAR YOU',
          admin: {
            description: 'Button text',
          },
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          defaultValue: '/find-us',
          admin: {
            description: 'Button link URL',
          },
        },
      ],
    },
  ],
  labels: {
    plural: 'Service Coverage Sections',
    singular: 'Service Coverage Section',
  },
}