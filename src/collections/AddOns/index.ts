// src/collections/AddOns/index.ts
import type { CollectionConfig } from 'payload'

import { admins } from '@/access/admins'
import { anyone } from '@/access/anyone'
import { slugField } from '@/fields/slug'

export const AddOns: CollectionConfig = {
  slug: 'addons',
  access: {
    
    create: admins,
    delete: admins,
    read: anyone,
    update: admins,
  },
  admin: {
       hidden: true,
    defaultColumns: ['title', 'price', 'category', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the add-on item',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Handle',
          value: 'handle',
        },
        {
          label: 'Accessory',
          value: 'accessory',
        },
        {
          label: 'Component',
          value: 'component',
        },
        {
          label: 'Service',
          value: 'service',
        },
      ],
      admin: {
        description: 'Type of add-on for grouping in the UI',
      },
    },
    {
  name: 'price',
  type: 'number',
  required: true,
  min: 0,
  admin: {
    description: 'Additional price for this add-on',
    components: {
      Field: '@/collections/Products/ui/Variants/VariantSelect/columns/PriceInput#PriceInput',
    },
  },
},
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'usd',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'stock',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        description: 'Available quantity (0 for unlimited)',
        step: 1,
      },
    },
    {
      name: 'compatibleProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      filterOptions: ({ id }) => {
        return {
          id: {
            not_in: [id],
          },
        }
      },
      admin: {
        description: 'Products this add-on is compatible with (leave empty for universal compatibility)',
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
        description: 'Images showing the add-on',
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
      admin: {
        description: 'Technical specifications or details',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this add-on is currently available',
        position: 'sidebar',
      },
    },
    slugField(),
    // Stripe integration fields (added by plugin)
    {
      name: 'stripeProductID',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'stripePriceID',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
  ],
  timestamps: true,
}