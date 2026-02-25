// src/blocks/ServiceHeroBanner/config.ts
import type { Block } from 'payload'

export const ServiceHeroBanner: Block = {
  slug: 'serviceHeroBanner',
  interfaceName: 'ServiceHeroBannerBlock',
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Background image for the banner section (optional - will use default if not provided)',
      },
    },
    {
      name: 'mainHeading',
      type: 'text',
      required: true,
      defaultValue: 'Schedule your lab work when you want, where you want,',
      admin: {
        description: 'Main headline text (first part)',
      },
    },
    {
      name: 'emphasizedText',
      type: 'text',
      required: true,
      defaultValue: 'without',
      admin: {
        description: 'Emphasized/italicized text in the middle',
      },
    },
    {
      name: 'subHeading',
      type: 'text',
      required: true,
      defaultValue: 'the hassle of having to drive to a lab and wait in a crowded room to be served by a stranger.',
      admin: {
        description: 'Continuation of headline text (second part)',
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
          defaultValue: 'AVAILABLE TESTS',
          admin: {
            description: 'Button text',
          },
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          defaultValue: '/services',
          admin: {
            description: 'Button link URL',
          },
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Open link in new tab',
          },
        },
      ],
      admin: {
        description: 'Call-to-action button configuration',
      },
    },
    {
      name: 'overlayOpacity',
      type: 'select',
      defaultValue: 'medium',
      options: [
        {
          label: 'Light (30%)',
          value: 'light',
        },
        {
          label: 'Medium (50%)',
          value: 'medium',
        },
        {
          label: 'Dark (70%)',
          value: 'dark',
        },
      ],
      admin: {
        description: 'Background overlay darkness for text readability',
      },
    },
    {
      name: 'textAlignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        {
          label: 'Left',
          value: 'left',
        },
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'Right',
          value: 'right',
        },
      ],
      admin: {
        description: 'Text alignment within the banner',
      },
    },
  ],
  labels: {
    plural: 'Service Hero Banners',
    singular: 'Service Hero Banner',
  },
}