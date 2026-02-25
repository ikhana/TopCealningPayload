// src/blocks/AvailableTests/config.ts
import type { Block } from 'payload'

export const AvailableTests: Block = {
  slug: 'availableTests',
  interfaceName: 'AvailableTestsBlock',
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      required: true,
      defaultValue: 'AVAILABLE TESTS',
      admin: {
        description: 'Main section heading',
      },
    },
    {
      name: 'featuredTest',
      type: 'group',
      label: 'Featured Test (Large)',
      fields: [
        {
          name: 'testName',
          type: 'text',
          required: true,
          defaultValue: 'PHLEBOTOMY TESTING',
          admin: {
            description: 'Main test category name',
          },
        },
        {
          name: 'subtitle',
          type: 'text',
          required: true,
          defaultValue: 'VENI/SKIN PUNCTURE GENERIC HEALTH ASSESSMENTS',
          admin: {
            description: 'Test category subtitle/description',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          defaultValue: 'Professional blood collection and testing services performed by certified phlebotomists. Our mobile lab brings comprehensive health assessments directly to your location with fast, accurate results you can trust.',
          admin: {
            rows: 4,
            description: 'Detailed description of the test category',
          },
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Background image for the featured test card',
          },
        },
        {
          name: 'ctaButton',
          type: 'group',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
              defaultValue: 'SCHEDULE A PHLEBOTOMY TEST',
              admin: {
                description: 'Button text',
              },
            },
            {
              name: 'link',
              type: 'text',
              required: true,
              defaultValue: '/phlebotomy-testing',
              admin: {
                description: 'Button link URL',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'secondaryTests',
      type: 'array',
      label: 'Secondary Tests (Smaller Cards)',
      minRows: 2,
      maxRows: 2,
      defaultValue: [
        {
          testName: 'GENETIC PATERNITY TESTS',
          subtitle: 'NOW OFFERING PRENATAL AND AT-HOME SERVICES',
          description: 'Accurate DNA paternity testing with legally admissible results. We offer both prenatal and postnatal testing options with confidential collection services. Fast turnaround times and certified laboratory processing ensure reliable results.',
          ctaButton: {
            text: 'SCHEDULE A GENETIC TEST',
            link: '/genetic-testing',
          },
        },
        {
          testName: 'EMPLOYEE SCREENING',
          subtitle: 'DRUG TESTS: URINE, SALIVA, HAIR AND BLOOD',
          description: 'Comprehensive employment screening services including pre-employment drug testing, DOT compliance testing, and ongoing workplace screening. Multiple testing methods available with rapid results and chain-of-custody documentation.',
          ctaButton: {
            text: 'SCHEDULE A DRUG SCREENING',
            link: '/employee-screening',
          },
        },
      ],
      fields: [
        {
          name: 'testName',
          type: 'text',
          required: true,
          admin: {
            description: 'Test category name',
          },
        },
        {
          name: 'subtitle',
          type: 'text',
          required: true,
          admin: {
            description: 'Test category subtitle/description',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            rows: 4,
            description: 'Detailed description of the test category',
          },
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Background image for the test card',
          },
        },
        {
          name: 'ctaButton',
          type: 'group',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
              admin: {
                description: 'Button text',
              },
            },
            {
              name: 'link',
              type: 'text',
              required: true,
              admin: {
                description: 'Button link URL',
              },
            },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Available Tests Sections',
    singular: 'Available Tests Section',
  },
}