// blocks/Faq/config.ts

import type { Block } from 'payload'
import { sectionIdField } from '@/fields/sectionId'
import { richTextField } from '@/fields/richTextField'
import { linkWithAnchor } from '@/fields/linkWithAnchor'

export const Faq: Block = {
  slug: 'faq',
  interfaceName: 'FaqBlock',
  dbName: 'faq',
  fields: [
    sectionIdField(),
    
    {
      name: 'backgroundStyle',
      type: 'select',
      defaultValue: 'muted',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Muted Gray', value: 'muted' },
        { label: 'Card', value: 'card' },
      ],
      admin: {
        description: 'Background style',
      },
    },
    
    {
      name: 'eyebrow',
      type: 'text',
      required: false,
      defaultValue: 'About Mazco LLC',
      admin: {
        description: 'Small text above title',
      },
    },
    
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'FAQs',
    },
    
    richTextField({
      name: 'description',
      label: 'Description',
      required: false,
    }),
    
    {
      name: 'contactItems',
      type: 'array',
      label: 'Contact Information',
      minRows: 0,
      maxRows: 5,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g., "General", "Consultations"',
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            description: 'Email or link text',
          },
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          admin: {
            description: 'Full URL (e.g., mailto:info@example.com or /disclosures)',
          },
        },
      ],
    },
    
    {
      name: 'faqs',
      type: 'array',
      label: 'FAQ Items',
      minRows: 1,
      maxRows: 20,
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        richTextField({
          name: 'answer',
          label: 'Answer',
          required: true,
        }),
      ],
    },
    
    {
      name: 'ctaHeading',
      type: 'text',
      required: false,
      defaultValue: 'Still have questions?',
    },
    
    richTextField({
      name: 'ctaDescription',
      label: 'CTA Description',
      required: false,
    }),
    
    {
      name: 'cta',
      type: 'group',
      label: 'CTA Button',
      fields: [linkWithAnchor()],
    },
    
    {
      name: 'disclaimer',
      type: 'textarea',
      required: false,
      admin: {
        rows: 2,
        description: 'Small disclaimer text below CTA',
      },
    },
  ],
  labels: {
    plural: 'FAQ Sections',
    singular: 'FAQ Section',
  },
}