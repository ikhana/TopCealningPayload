// src/collections/BlogCategories/index.ts
import type { CollectionConfig } from 'payload'

import { admins } from '@/access/admins'
import { anyone } from '@/access/anyone'
import { slugField } from '@/fields/slug'

export const BlogCategories: CollectionConfig = {
  slug: 'blog-categories',
  labels: {
    singular: 'Blog Category',
    plural: 'Blog Categories',
  },
  access: {
    create: admins,
    delete: admins,
    read: anyone, // Public can read categories
    update: admins,
  },
  admin: {
    defaultColumns: ['name', 'slug', 'postCount', 'updatedAt'],
    useAsTitle: 'name',
    description: 'Organize your blog posts into categories',
    group: 'Blog',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Category Name',
          admin: {
            description: 'The display name for this category',
            placeholder: 'e.g., Craftsmanship, Product Care, Heritage Stories',
          },
        },
        {
          name: 'color',
          type: 'select',
          label: 'Category Color',
          defaultValue: 'bourbon',
          admin: {
            description: 'Color theme for this category',
          },
          options: [
            {
              label: 'Bourbon Brown',
              value: 'bourbon',
            },
            {
              label: 'Charcoal Dark',
              value: 'charcoal',
            },
            {
              label: 'Saddle Brown',
              value: 'saddle',
            },
            {
              label: 'Heritage Navy',
              value: 'navy',
            },
            {
              label: 'Barrel Oak',
              value: 'oak',
            },
            {
              label: 'Copper Accent',
              value: 'copper',
            },
          ],
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'A brief description of what content belongs in this category',
        placeholder: 'Posts about traditional crafting techniques and artisan stories...',
        rows: 3,
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Category Image',
      admin: {
        description: 'Optional image to represent this category (recommended: 800x400px)',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'displayOrder',
          type: 'number',
          defaultValue: 0,
          label: 'Display Order',
          admin: {
            description: 'Lower numbers appear first',
            step: 1,
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          label: 'Featured Category',
          admin: {
            description: 'Show this category prominently',
          },
        },
      ],
    },
    // SEO Fields in a collapsible group
    {
      type: 'collapsible',
      label: 'SEO Settings',
      fields: [
        {
          name: 'meta',
          type: 'group',
          label: 'Meta Information',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Meta Title',
              admin: {
                description: 'SEO title for category archive pages',
                placeholder: 'Leave empty to use category name',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Meta Description',
              admin: {
                description: 'SEO description for category archive pages (max 160 characters)',
                placeholder: 'Leave empty to use category description',
              },
            },
          ],
        },
      ],
    },
    // Parent category for hierarchy (optional)
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'blog-categories',
      label: 'Parent Category',
      filterOptions: ({ id }) => {
        return {
          id: {
            not_equals: id,
          },
        }
      },
      admin: {
        description: 'Optional: Create sub-categories by selecting a parent',
      },
    },
    // Virtual field for post count
    {
      name: 'postCount',
      type: 'number',
      virtual: true,
      admin: {
        description: 'Number of posts in this category',
        readOnly: true,
      },
      hooks: {
        afterRead: [
          async ({ req: { payload }, siblingData }) => {
            // Count posts in this category
            const posts = await payload.count({
              collection: 'blog-posts',
              where: {
                categories: {
                  contains: siblingData.id,
                },
                _status: {
                  equals: 'published',
                },
              },
            })
            return posts.totalDocs
          },
        ],
      },
    },
    slugField('name'),
  ],
  hooks: {
    afterChange: [
      async ({ doc, req: { payload } }) => {
        // Revalidate category pages
        const { revalidatePath } = await import('next/cache')
        revalidatePath(`/blog/category/${doc.slug}`)
        revalidatePath('/blog')
        return doc
      },
    ],
  },
}