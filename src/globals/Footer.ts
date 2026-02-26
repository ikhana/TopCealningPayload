// src/globals/Footer.ts

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
        description: 'Footer logo. Recommended size: 160x44px',
      },
    },

    // Tagline / Mission Text
    {
      name: 'tagline',
      type: 'textarea',
      label: 'Mission Text',
      defaultValue: 'Professional cleaning services dedicated to excellence. Making your space spotless, one cleaning at a time.',
      admin: {
        description: 'Short brand statement shown below the logo in the footer',
        rows: 2,
      },
    },

    // Footer Navigation Sections (Quick Links, Specialties, etc.)
    {
      name: 'sections',
      type: 'array',
      label: 'Footer Navigation Sections',
      minRows: 2,
      maxRows: 4,
      defaultValue: [
        { title: 'Quick Links',  links: [] },
        { title: 'Specialties',  links: [] },
      ],
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          required: true,
          admin: {
            placeholder: 'e.g., Quick Links, Specialties',
          },
        },
        {
          name: 'links',
          type: 'array',
          label: 'Section Links',
          minRows: 1,
          maxRows: 8,
          fields: [
            linkWithAnchor({ appearances: false }),
          ],
        },
      ],
      admin: {
        description: 'Create 2-4 navigation columns. Each can have up to 8 links.',
      },
    },

    // Contact Information (shown in its own footer column)
    {
      name: 'contactInfo',
      type: 'group',
      label: 'Contact Information',
      admin: {
        description: 'Phone numbers, email, and business hours shown in the contact column',
      },
      fields: [
        {
          name: 'phone1',
          type: 'text',
          label: 'Primary Phone',
          admin: { placeholder: '(754) 307-4034' },
        },
        {
          name: 'phone2',
          type: 'text',
          label: 'Secondary Phone',
          admin: { placeholder: '(701) 238-3301' },
        },
        {
          name: 'email',
          type: 'text',
          label: 'Email Address',
          admin: { placeholder: 'Topcleaningfl@gmail.com' },
        },
        {
          name: 'hours',
          type: 'text',
          label: 'Business Hours',
          defaultValue: 'Mon – Sun: 8am to 6pm',
        },
      ],
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
      ],
    },

    // Legal Links (Privacy Policy, etc.)
    {
      name: 'legalLinks',
      type: 'array',
      label: 'Legal Links',
      maxRows: 4,
      defaultValue: [
        { link: { type: 'custom', url: '/privacy', label: 'Privacy Policy' } },
      ],
      fields: [
        linkWithAnchor({ appearances: false }),
      ],
      admin: {
        description: 'Links shown in the bottom bar (Privacy Policy, Terms, etc.)',
      },
    },

    // Copyright
    {
      name: 'copyright',
      type: 'text',
      label: 'Copyright Text',
      defaultValue: '© {year} TOP CLEANING. ALL RIGHTS RESERVED.',
      admin: {
        description: 'Use {year} as a placeholder — it is replaced with the current year automatically',
      },
    },
  ],
}
