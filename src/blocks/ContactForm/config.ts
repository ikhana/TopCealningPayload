// blocks/ContactForm/config.ts

import type { Block } from 'payload'
import { sectionIdField } from '@/fields/sectionId'
import { richTextField } from '@/fields/richTextField'

export const ContactForm: Block = {
  slug: 'contactForm',
  interfaceName: 'ContactFormBlock',
  dbName: 'contact_form',
  fields: [
    sectionIdField(),
    
    {
      name: 'backgroundStyle',
      type: 'select',
      defaultValue: 'muted',
      options: [
        { label: 'Default (White)', value: 'default' },
        { label: 'Muted', value: 'muted' },
        { label: 'Card', value: 'card' },
      ],
      admin: {
        description: 'Background color style',
      },
    },
    
    // Form relationship - uses Payload's form plugin
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      admin: {
        description: 'Select the contact form to display',
      },
    },
    
    // Left column content
    richTextField({
      name: 'leftContent',
      label: 'Left Column Content',
      required: true,
      overrides: {
        admin: {
          description: 'Contact information, headings, emails, etc.',
        },
      },
    }),
    
    // Optional contact emails group
    {
      name: 'contactEmails',
      type: 'array',
      label: 'Contact Email Addresses',
      minRows: 0,
      maxRows: 5,
      admin: {
        description: 'Add department-specific email addresses',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          maxLength: 30,
          admin: {
            description: 'Department name (e.g., "General", "Advisory")',
          },
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          admin: {
            description: 'Email address',
          },
        },
      ],
    },
  ],
  labels: {
    plural: 'Contact Form Sections',
    singular: 'Contact Form Section',
  },
}