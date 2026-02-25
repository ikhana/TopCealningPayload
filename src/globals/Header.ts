// src/globals/Header.ts - FINAL CLEAN VERSION

import type { GlobalConfig } from 'payload'
import { linkWithAnchor } from '@/fields/linkWithAnchor'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    // Promotional Banner
    {
      name: 'promotionalBanner',
      type: 'group',
      label: 'Promotional Banner',
      admin: {
        description: 'Top banner that appears above the main navigation'
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enable Promotional Banner',
          defaultValue: false,
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Promotional Content',
          admin: {
            condition: (_, siblingData) => siblingData.enabled,
          }
        },
        {
          name: 'cta',
          type: 'group',
          label: 'Call to Action Button',
          admin: {
            condition: (_, siblingData) => siblingData.enabled,
          },
          fields: [
            linkWithAnchor({
              overrides: {
                label: 'CTA Button',
              }
            })
          ]
        },
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
          name: 'pinterest',
          type: 'text',
          label: 'Pinterest URL',
        }
      ]
    },

    // Top Bar Actions
    {
      name: 'topBarActions',
      type: 'array',
      label: 'Top Bar Actions',
      maxRows: 4,
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Icon',
          required: true,
          options: [
            { label: 'User/Account', value: 'user' },
            { label: 'Search', value: 'search' },
            { label: 'Heart/Wishlist', value: 'heart' },
            { label: 'Shopping Cart', value: 'cart' },
            { label: 'Phone', value: 'phone' },
            { label: 'Email', value: 'email' }
          ]
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link URL',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Accessibility Label',
          required: true,
        }
      ]
    },

    // Logo
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Upload your brand logo. Recommended size: 160x44px.'
      }
    },

    // Main CTA Button
    {
      name: 'ctaButton',
      type: 'group',
      label: 'Main CTA Button',
      fields: [
        linkWithAnchor({
          overrides: {
            label: 'CTA Button Configuration',
          }
        })
      ]
    },

    // Main Navigation Items
    {
      name: 'navItems',
      type: 'array',
      label: 'Main Navigation Items',
      maxRows: 6,
      fields: [
        {
          name: 'type',
          type: 'radio',
          label: 'Navigation Type',
          options: [
            { label: 'Simple Link', value: 'simple' },
            { label: 'Dropdown Menu', value: 'dropdown' }
          ],
          defaultValue: 'simple',
          admin: {
            layout: 'horizontal',
          }
        },
        
        // Simple Link Fields - FIXED: Direct linkWithAnchor, no wrapper
        linkWithAnchor({
          appearances: false,
          overrides: {
            admin: {
              condition: (_, siblingData) => siblingData.type === 'simple',
              description: 'Configure the navigation link with scroll-to-section support'
            }
          }
        }),

        // Dropdown Menu
        {
          name: 'dropdown',
          type: 'group',
          label: 'Dropdown Menu',
          admin: {
            condition: (_, siblingData) => siblingData.type === 'dropdown',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Menu Label',
              required: true,
              admin: {
                description: 'The text that appears in the main navigation (e.g., "Services")'
              }
            },
            {
              name: 'items',
              type: 'array',
              label: 'Dropdown Items',
              minRows: 1,
              maxRows: 8,
              fields: [
                linkWithAnchor({
                  appearances: false,
                }),
                {
                  name: 'description',
                  type: 'text',
                  label: 'Item Description (Optional)',
                },
                {
                  name: 'featured',
                  type: 'checkbox',
                  label: 'Featured Item',
                  defaultValue: false,
                }
              ],
            },
          ]
        }
      ],
    },
  ],
}