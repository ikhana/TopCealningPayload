// src/blocks/PartnershipTrust/config.ts
import type { Block } from 'payload'

export const PartnershipTrust: Block = {
  slug: 'partnerTrust',
  interfaceName: 'PartnerTrustBlock',
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Showcase image featuring your custom/corporate work',
          },
        },
        {
          name: 'eyebrow',
          type: 'text',
          defaultValue: 'HANDCRAFTED',
          admin: {
            description: 'Small text above main headline (e.g., "HANDCRAFTED", "BESPOKE")',
          },
        },
        {
          name: 'headline',
          type: 'text',
          required: true,
          defaultValue: 'Corporate Partnerships',
          admin: {
            description: 'Main headline for the section',
          },
        },
        {
          name: 'tagline',
          type: 'text',
          defaultValue: 'Built for Business Excellence',
          admin: {
            description: 'Tagline under the headline',
          },
        },
        {
          name: 'overlay',
          type: 'select',
          defaultValue: 'subtle',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Subtle', value: 'subtle' },
            { label: 'Strong', value: 'strong' },
            { label: 'Gradient', value: 'gradient' },
          ],
          admin: {
            description: 'Overlay style for text readability',
          },
        },
      ],
    },
    {
      name: 'trust',
      type: 'group',
      fields: [
        {
          name: 'method',
          type: 'select',
          defaultValue: 'stats',
          options: [
            { label: 'Statistics & Numbers', value: 'stats' },
            { label: 'Partner Logos', value: 'logos' },
            { label: 'Testimonial Quote', value: 'quote' },
            { label: 'Mixed Content', value: 'mixed' },
          ],
          admin: {
            description: 'How to display trust indicators',
          },
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Trusted by Industry Leaders',
          admin: {
            description: 'Title for the trust section',
          },
        },
        {
          name: 'stats',
          type: 'array',
          maxRows: 4,
          fields: [
            {
              name: 'number',
              type: 'text',
              required: true,
              admin: {
                description: 'Number or statistic (e.g., "500+", "25 Years")',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                description: 'Description (e.g., "Custom Projects", "Years Crafting")',
              },
            },
          ],
          admin: {
            condition: (data, siblingData) => 
              siblingData.method === 'stats' || siblingData.method === 'mixed',
            description: 'Key statistics to showcase trust',
          },
        },
        {
          name: 'logos',
          type: 'array',
          maxRows: 8,
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Partner/client logo',
              },
            },
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: {
                description: 'Company name for accessibility',
              },
            },
            {
              name: 'industry',
              type: 'text',
              admin: {
                description: 'Industry category (optional)',
              },
            },
          ],
          admin: {
            condition: (data, siblingData) => 
              siblingData.method === 'logos' || siblingData.method === 'mixed',
            description: 'Partner company logos',
          },
        },
        {
          name: 'quote',
          type: 'group',
          fields: [
            {
              name: 'text',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Testimonial quote',
              },
            },
            {
              name: 'author',
              type: 'text',
              required: true,
              admin: {
                description: 'Quote author name',
              },
            },
            {
              name: 'title',
              type: 'text',
              admin: {
                description: 'Author title/position',
              },
            },
            {
              name: 'company',
              type: 'text',
              admin: {
                description: 'Company name',
              },
            },
          ],
          admin: {
            condition: (data, siblingData) => 
              siblingData.method === 'quote' || siblingData.method === 'mixed',
            description: 'Featured testimonial',
          },
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'text',
          type: 'text',
          defaultValue: 'Start Your Custom Project',
          admin: {
            condition: (data, siblingData) => siblingData.enabled,
          },
        },
        {
          name: 'link',
          type: 'text',
          defaultValue: '/contact',
          admin: {
            condition: (data, siblingData) => siblingData.enabled,
          },
        },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'bourbon',
          options: [
            { label: 'Bourbon Primary', value: 'bourbon' },
            { label: 'Charcoal Dark', value: 'charcoal' },
            { label: 'Outline', value: 'outline' },
          ],
          admin: {
            condition: (data, siblingData) => siblingData.enabled,
          },
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'stacked',
      options: [
        { label: 'Stacked (Hero above, Trust below)', value: 'stacked' },
        { label: 'Split (Hero left, Trust right)', value: 'split' },
        { label: 'Overlay (Trust over Hero)', value: 'overlay' },
      ],
    },
    {
      name: 'bg',
      type: 'select',
      defaultValue: 'parchment',
      options: [
        { label: 'Parchment', value: 'parchment' },
        { label: 'Charcoal', value: 'charcoal' },
        { label: 'White', value: 'white' },
        { label: 'Bourbon Tint', value: 'bourbon' },
      ],
    },
    {
      name: 'pad',
      type: 'select',
      defaultValue: 'large',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'Extra Large', value: 'xl' },
      ],
    },
  ],
  labels: {
    plural: 'Partnership Trust Sections',
    singular: 'Partnership Trust Section',
  },
}