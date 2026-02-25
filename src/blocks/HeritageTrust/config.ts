// src/blocks/HeritageTrust/config.ts - INTERACTIVE QUOTE CAROUSEL VERSION
import type { Block } from 'payload'


export const HeritageTrust: Block = {
  slug: 'heritageTrust',
  interfaceName: 'HeritageTrustBlock',
  fields: [
    // Section Configuration
    {
      name: 'sectionTitle',
      type: 'text',
      defaultValue: 'Trusted by Industry Leaders',
      admin: {
        description: 'Main section heading',
      },
    },
    {
      name: 'sectionSubtitle',
      type: 'text',
      admin: {
        description: 'Optional subtitle below the main heading',
      },
    },

    // Interactive Testimonial Carousel
    {
      name: 'testimonials',
      type: 'array',
      minRows: 2,
      maxRows: 8,
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Testimonial quote - keep impactful and concise',
          },
        },
        {
          name: 'authorPhoto',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Professional headshot of the testimonial author',
          },
        },
        {
          name: 'authorName',
          type: 'text',
          required: true,
          admin: {
            description: 'Full name of the testimonial author',
          },
        },
        {
          name: 'authorTitle',
          type: 'text',
          required: true,
          admin: {
            description: 'Job title or position (e.g., "CEO", "Founder", "Director")',
          },
        },
        {
          name: 'companyName',
          type: 'text',
          required: true,
          admin: {
            description: 'Company name - must match a company in the logos array below',
          },
        },
        {
          name: 'companyLogo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Company logo - will be highlighted when this testimonial is active',
          },
        },
        {
          name: 'industry',
          type: 'text',
          admin: {
            description: 'Industry category (optional, e.g., "Manufacturing", "Tech", "Healthcare")',
          },
        },
      ],
      admin: {
        description: 'Testimonials for the interactive carousel - each will rotate with synchronized logo highlighting',
      },
    },

    // Carousel Configuration
    {
      name: 'carouselSettings',
      type: 'group',
      fields: [
        {
          name: 'autoplay',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Automatically rotate through testimonials',
          },
        },
        {
          name: 'autoplaySpeed',
          type: 'number',
          defaultValue: 6000,
          admin: {
            condition: (_, siblingData) => siblingData.autoplay,
            description: 'Time in milliseconds between rotations (default: 6000 = 6 seconds)',
          },
        },
        {
          name: 'pauseOnHover',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            condition: (_, siblingData) => siblingData.autoplay,
            description: 'Pause carousel when user hovers over it',
          },
        },
        {
          name: 'showProgress',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show progress indicators at the bottom',
          },
        },
      ],
      admin: {
        description: 'Carousel behavior settings',
      },
    },

    // Optional Call-to-Action
    {
      name: 'enableCTA',
      type: 'checkbox',
      defaultValue: false,
      label: 'Enable Call-to-Action',
      admin: {
        description: 'Add a call-to-action button below the testimonials',
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      admin: {
        condition: (_, { enableCTA }) => Boolean(enableCTA),
        description: 'CTA button text',
      },
    },
    {
      name: 'ctaLink',
      type: 'text',
      admin: {
        condition: (_, { enableCTA }) => Boolean(enableCTA),
        description: 'CTA button destination URL',
      },
    },
  ],
  labels: {
    plural: 'Heritage Trust Sections',
    singular: 'Heritage Trust Section',
  },
}