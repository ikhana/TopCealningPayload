// src/collections/Categories.ts
import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    read: () => true,
  },
  admin: {
       hidden: true,
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'image'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of this category',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Featured image for this category (used in shop by categories blocks)',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark as featured category for homepage display',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Order for displaying categories (lower numbers appear first)',
      },
    },
    {
      name: 'showInNavigation',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show this category in main navigation',
      },
    },
  ],
}