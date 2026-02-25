// src/blocks/HeritageProductShowcase/config.ts - CLEANED ADMIN (Content-Only)
import type { Block } from 'payload'

export const HeritageProductShowcase: Block = {
  slug: 'productShowcase',
  interfaceName: 'HeritageProductShowcaseBlock',
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      admin: {
        description: 'Optional main heading for the product showcase',
      },
    },
    {
      name: 'sectionSubtitle',
      type: 'textarea',
      admin: {
        description: 'Optional subtitle describing the collection',
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      maxRows: 5, // ✅ Fixed to 5 cards only
      minRows: 5,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
          filterOptions: ({ data, siblingData }) => {
            // Get already selected product IDs from current items array
            const selectedIds = data?.items
              ?.map((item: any) => typeof item.product === 'string' ? 
                item.product : item.product?.id)
              .filter(Boolean) || []
            
            return {
              _status: { equals: 'published' },
              // Exclude already selected products
              id: { not_in: selectedIds }
            }
          },
        },
        {
          name: 'desc',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Short, compelling description (20-40 words)',
            placeholder: 'Handcrafted elegance meets modern functionality...',
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Mark as featured product (gets premium styling)',
          },
        },
        // Simplified pricing options (keep functional, remove styling)
        {
          name: 'priceType',
          type: 'select',
          defaultValue: 'auto',
          options: [
            {
              label: 'Auto (Use Product Price)',
              value: 'auto',
            },
            {
              label: 'From Price',
              value: 'from',
            },
            {
              label: 'Starting At',
              value: 'starting',
            },
            {
              label: 'Per Unit/Set',
              value: 'unit',
            },
            {
              label: 'Custom Text',
              value: 'custom',
            },
            {
              label: 'Hide Price',
              value: 'hidden',
            },
          ],
          admin: {
            description: 'How to display the price',
          },
        },
        {
          name: 'customPrice',
          type: 'text',
          admin: {
            condition: (_, { priceType } = {}) => priceType === 'custom',
            description: 'Custom price text (e.g., "Price per 5 Coasters")',
            placeholder: 'Price per 5 Coasters',
          },
        },
        {
          name: 'unitText',
          type: 'text',
          admin: {
            condition: (_, { priceType } = {}) => priceType === 'unit',
            description: 'Unit description (e.g., "per set", "each")',
            placeholder: 'per set',
          },
        },
        {
          name: 'overridePrice',
          type: 'number',
          admin: {
            condition: (_, { priceType } = {}) => ['from', 'starting', 'unit'].includes(priceType),
            description: 'Optional: Override price (leave empty to use product price)',
          },
        },
      ],
      admin: {
        description: 'Select exactly 5 products to showcase in your heritage collection',
      },
    },
    // ✅ Keep functional carousel options (not styling)
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Auto-advance through products',
      },
    },
    {
      name: 'speed',
      type: 'number',
      defaultValue: 5000,
      admin: {
        description: 'Autoplay speed (milliseconds)',
        condition: (data) => data.autoplay,
      },
    },
    {
      name: 'dots',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show navigation dots',
      },
    },
    {
      name: 'arrows',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show navigation arrows',
      },
    },
    // ❌ REMOVED: slides field (fixed to 5)
    // ❌ REMOVED: backgroundColor field (admin styling)
    // ❌ REMOVED: sectionPadding field (admin styling)
  ],
  labels: {
    plural: 'Heritage Product Showcases',
    singular: 'Heritage Product Showcase',
  },
}