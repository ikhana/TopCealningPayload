// src/fields/componentVariants.ts
import type { Field } from 'payload'

export const componentVariants: Field = {
  name: 'componentConfiguration',
  type: 'group',
  admin: {
    description: 'Configure which components make up this product',
  },
  fields: [
    {
      name: 'components',
      type: 'relationship',
      relationTo: 'product-components',
      hasMany: true,
      admin: {
        description: 'Components that can be customized for this product',
      },
    },
    {
      name: 'componentGroups',
      type: 'array',
      fields: [
        {
          name: 'groupName',
          type: 'text',
          required: true,
          admin: {
            description: 'Name for this group of components (e.g., "Base Options", "Accessories")',
          },
        },
        {
          name: 'groupSlug',
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
          name: 'components',
          type: 'relationship',
          relationTo: 'product-components',
          hasMany: true,
          admin: {
            description: 'Components in this group',
          },
        },
        {
          name: 'displayOrder',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Order of this group in the UI',
          },
        },
      ],
      admin: {
        description: 'Group components for better organization in the UI',
      },
    },
    {
      name: 'basePrice',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Base price before any component selections',
        step: 1,
      },
    },
    {
      name: 'pricingStrategy',
      type: 'select',
      options: [
        {
          label: 'Additive (Base + Component Prices)',
          value: 'additive',
        },
        {
          label: 'Override (Component Sets Total Price)',
          value: 'override',
        },
        {
          label: 'Percentage (Components Add % to Base)',
          value: 'percentage',
        },
      ],
      defaultValue: 'additive',
      admin: {
        description: 'How component prices affect the total',
      },
    },
  ],
}