// src/collections/BlogTags/index.ts
import type { CollectionConfig } from 'payload'

import { admins } from '@/access/admins'
import { anyone } from '@/access/anyone'
import { slugField } from '@/fields/slug'

export const BlogTags: CollectionConfig = {
  slug: 'blog-tags',
  labels: {
    singular: 'Blog Tag',
    plural: 'Blog Tags',
  },
  access: {
    create: admins,
    delete: admins,
    read: anyone, // Public can read tags
    update: admins,
  },
  admin: {
    defaultColumns: ['name', 'slug', 'updatedAt'],
    useAsTitle: 'name',
    description: 'Simple tags for blog post topics',
    group: 'Blog',
    pagination: {
      defaultLimit: 50, // Show more tags at once
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Tag Name',
      admin: {
        description: 'Keep it short and descriptive',
        placeholder: 'e.g., DIY, Bourbon Barrels, Gift Ideas',
      },
    },
    {
      name: 'description',
      type: 'text',
      label: 'Tag Description',
      admin: {
        description: 'Optional: Brief description for internal reference',
      },
    },
    slugField('name'),
  ],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        // Revalidate tag pages
        const { revalidatePath } = await import('next/cache')
        revalidatePath(`/blog/tag/${doc.slug}`)
        revalidatePath('/blog')
        return doc
      },
    ],
  },
}