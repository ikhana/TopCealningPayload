// src/globals/Footer.ts - CLEAN COMPACT VERSION

import type { GlobalConfig } from 'payload'
import { linkWithAnchor } from '@/fields/linkWithAnchor'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    // Logo
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Footer logo. Recommended size: 160x44px'
      }
    },

    // Tagline
    {
      name: 'tagline',
      type: 'textarea',
      label: 'Company Tagline',
      defaultValue: 'Strategic financial planning and wealth management solutions tailored to your goals.',
      admin: {
        description: 'Brief company description below the logo',
        rows: 2
      }
    },

    // Footer Sections (Services, Company, Resources)
    {
      name: 'sections',
      type: 'array',
      label: 'Footer Navigation Sections',
      minRows: 2,
      maxRows: 4,
      defaultValue: [
        {
          title: 'Services',
          links: []
        },
        {
          title: 'Company',
          links: []
        },
        {
          title: 'Resources',
          links: []
        }
      ],
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          required: true,
          admin: {
            placeholder: 'e.g., Services, Company, Resources'
          }
        },
        {
          name: 'links',
          type: 'array',
          label: 'Section Links',
          minRows: 1,
          maxRows: 6,
          fields: [
            linkWithAnchor({
              appearances: false,
            })
          ]
        }
      ],
      admin: {
        description: 'Create 2-4 navigation sections. Each can have up to 6 links with anchor scroll support.'
      }
    },

    // Newsletter
    {
      name: 'newsletter',
      type: 'group',
      label: 'Newsletter Subscription',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enable Newsletter',
          defaultValue: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Newsletter Title',
          defaultValue: 'Financial Insights',
          admin: {
            condition: (_, { enabled } = {}) => enabled,
          }
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Newsletter Description',
          defaultValue: 'Stay informed with the latest market trends and wealth management insights.',
          admin: {
            condition: (_, { enabled } = {}) => enabled,
            rows: 2
          }
        }
      ]
    },

    // Social Links
    {
      name: 'socialLinks',
      type: 'group',
      label: 'Social Media Links',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook URL',
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram URL',
        },
        {
          name: 'twitter',
          type: 'text',
          label: 'Twitter/X URL',
        },
        {
          name: 'linkedin',
          type: 'text',
          label: 'LinkedIn URL',
        }
      ]
    },

    // Legal Links
    {
      name: 'legalLinks',
      type: 'array',
      label: 'Legal Links',
      maxRows: 4,
      defaultValue: [
        { link: { type: 'custom', url: '/privacy', label: 'Privacy Policy' } },
        { link: { type: 'custom', url: '/terms', label: 'Terms of Service' } }
      ],
      fields: [
        linkWithAnchor({
          appearances: false,
        })
      ],
      admin: {
        description: 'Add legal/compliance links (Privacy, Terms, etc.)'
      }
    },

    // Copyright
    {
      name: 'copyright',
      type: 'text',
      label: 'Copyright Text',
      defaultValue: '© {year} Mazco LLC. All rights reserved.',
      admin: {
        description: 'Use {year} as placeholder for current year'
      }
    },
  ],
}