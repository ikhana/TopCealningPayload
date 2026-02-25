// src/collections/ProductComponents/index.ts
import type { CollectionConfig } from 'payload'

import { admins } from '@/access/admins'
import { anyone } from '@/access/anyone'
import { slugField } from '@/fields/slug'

export const ProductComponents: CollectionConfig = {
  slug: 'product-components',
  access: {
    create: admins,
    delete: admins,
    read: anyone,
    update: admins,
  },
  admin: {
       hidden: true,
    defaultColumns: ['title', 'componentType', 'required', 'displayOrder'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name for this component (e.g., "Board Type", "Handle Style")',
      },
    },
    {
      name: 'componentType',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Base Component',
          value: 'base',
        },
        {
          label: 'Handle',
          value: 'handle',
        },
        {
          label: 'Accessory',
          value: 'accessory',
        },
        {
          label: 'Material',
          value: 'material',
        },
        {
          label: 'Color/Finish',
          value: 'finish',
        },
        {
          label: 'Size Variant',
          value: 'size',
        },
        {
          label: 'Custom Part',
          value: 'custom',
        },
      ],
      admin: {
        description: 'Type of component for categorization',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of what this component represents',
      },
    },
    {
      name: 'required',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this component must be selected when configuring the product',
      },
    },
    {
      name: 'allowMultiple',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether multiple options can be selected for this component',
      },
    },
    {
      name: 'componentOptions',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'optionTitle',
          type: 'text',
          required: true,
          admin: {
            description: 'Name of this option (e.g., "Leather Handle", "Wooden Handle")',
          },
        },
        {
          name: 'optionSlug',
          type: 'text',
          required: true,
          hooks: {
            beforeValidate: [
              ({ value }) => {
                if (typeof value === 'string') {
                  return value
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w-]+/g, '')
                }
                return value
              },
            ],
          },
        },
        {
      name: 'priceModifier',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Price adjustment for this option',
        components: {
          Field: '@/collections/Products/ui/Variants/VariantSelect/columns/PriceInput#PriceInput',
        },
      },
    },
        {
          name: 'stockQuantity',
          type: 'number',
          defaultValue: 0,
          min: 0,
          admin: {
            description: 'Available stock for this option (0 for unlimited)',
          },
        },
        {
          name: 'images',
          type: 'array',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
          admin: {
            description: 'Images showing this specific option',
          },
        },
        {
          name: 'specifications',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'value',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'incompatibleWith',
          type: 'text',
          admin: {
            description: 'Comma-separated list of option slugs this is incompatible with',
          },
        },
        {
          name: 'requiredWith',
          type: 'text',
          admin: {
            description: 'Comma-separated list of option slugs that must be selected with this',
          },
        },
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
      admin: {
        description: 'Available options for this component',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Order in which this component appears in configuration (lower = first)',
      },
    },
    {
      name: 'displayConditions',
      type: 'group',
      fields: [
        {
          name: 'showOnlyWhen',
          type: 'text',
          admin: {
            description: 'Component slug:option slug pairs (e.g., "board-type:premium")',
          },
        },
        {
          name: 'hideWhen',
          type: 'text',
          admin: {
            description: 'Component slug:option slug pairs that hide this component',
          },
        },
      ],
      admin: {
        description: 'Conditional display rules based on other component selections',
      },
    },
    {
      name: 'defaultOption',
      type: 'text',
      admin: {
        description: 'Slug of the default selected option',
      },
    },
    slugField(),
  ],
  timestamps: true,
}