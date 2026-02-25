// src/blocks/ProductVariantShowcase/config.ts - CLEANED ADMIN (Content-Only)
import type { Block } from 'payload'

export const ProductVariantShowcase: Block = {
  slug: 'variantShow',
  interfaceName: 'VariantShowBlock',
  fields: [
    {
      name: 'secTitle',
      type: 'text',
      admin: {
        description: 'Optional title for the additional images section (shown below hero)',
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 3, // ✅ Limit to 3 product showcases for performance
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
          admin: {
            description: 'Select the product for this showcase',
          },
          filterOptions: {
            _status: { equals: 'published' },
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'Discover Premium Craftsmanship',
          admin: {
            description: 'Main heading for the hero section',
          },
        },
        {
          name: 'subtitle',
          type: 'textarea',
          admin: {
            description: 'Optional subtitle or tagline for the hero section',
          },
        },
        {
          name: 'hero',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Large hero background image for this product showcase',
          },
        },
        {
          name: 'cta',
          type: 'group',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Show call-to-action button',
              },
            },
            {
              name: 'label',
              type: 'text',
              defaultValue: 'Shop Now',
              admin: {
                condition: (data, siblingData) => siblingData.enabled,
                description: 'Button text',
              },
            },
          ],
          admin: {
            description: 'Call-to-action button configuration',
          },
        },
        {
          name: 'additionalImages',
          type: 'array',
          required: true,
          minRows: 1,
          maxRows: 8, // ✅ Reasonable limit for performance
          fields: [
            {
              name: 'img',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Additional product image (detail shot, angle, etc.)',
              },
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: 'Title for this image (e.g., "Premium Walnut Finish")',
              },
            },
            {
              name: 'desc',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Description of what this image shows',
              },
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Mark as featured for special highlighting',
              },
            },
          ],
          admin: {
            description: 'Additional images showing different angles, details, or features of the product',
          },
        },
      ],
      admin: {
        description: 'Create product showcases. First one will be displayed by default.',
      },
    },
    // ❌ REMOVED: layout field (admin styling)
    // ❌ REMOVED: cols field (admin styling) 
    // ❌ REMOVED: hover field (admin styling)
    // ❌ REMOVED: price field (admin styling)
    // ✅ All styling controlled by developer in Component.tsx
  ],
  labels: {
    plural: 'Product Showcases',
    singular: 'Product Showcase',
  },
}