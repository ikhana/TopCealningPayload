// src/collections/BlogPosts/index.ts
import type { CollectionConfig } from 'payload'

import { admins } from '@/access/admins'
import { adminsOrPublished } from '@/access/adminsOrPublished'
import { authors, authorsAndSelf } from '@/access/authors'
import { slugField } from '@/fields/slug'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { revalidateBlogPost, revalidateDelete } from './hooks/revalidateBlogPost'

// Import blocks for blog layout
import { Banner } from '@/blocks/Banner/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { TextContent } from '@/blocks/TextContent/config'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  labels: {
    singular: 'Blog Post',
    plural: 'Blog Posts',
  },
  access: {
    create: authors, // Authors and admins can create
    delete: admins, // Only admins can delete
    read: adminsOrPublished, // Public can read published, admins see all
    update: authorsAndSelf, // Authors can edit their own, admins edit all
  },
  admin: {
    defaultColumns: ['title', '_status', 'publishedAt', 'categories', 'author', 'updatedAt'],
    description: 'Create and manage blog posts for your bourbon craft website',
    group: 'Blog',
    livePreview: {
      url: ({ data }) => {
        const slug = typeof data?.slug === 'string' ? data.slug : ''
        const path = `/blog/${slug}`
        
        // Use the preview route with proper parameters
        const previewPath = generatePreviewPath({
          path,
          collection: 'blog-posts',
          slug,
        })
        
        return `${process.env.NEXT_PUBLIC_SERVER_URL}${previewPath}`
      },
    },
    preview: (doc) => {
      const slug = typeof doc?.slug === 'string' ? doc.slug : ''
      const path = `/blog/${slug}`
      
      return generatePreviewPath({
        path,
        collection: 'blog-posts',
        slug,
      })
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Post Title',
      admin: {
        description: 'The main title of your blog post',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'MMM d, yyyy h:mm a',
        },
        description: 'When this post should be published',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            // Auto-set publish date when status changes to published
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'The author of this blog post',
      },
      defaultValue: ({ user }) => user?.id,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'The main image for this blog post (recommended: 1200x630px)',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 200,
      admin: {
        description: 'A short summary of your post (max 200 characters)',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'flexibleContent',
              type: 'blocks',
              label: 'Blog Content',
              blocks: [
                TextContent,
                MediaBlock,
                Content,
                Banner,
                CallToAction,
              ],
              admin: {
                description: 'Build your blog post with flexible content blocks',
              },
            },
          ],
        },
        {
          label: 'Organization',
          fields: [
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'blog-categories',
              hasMany: true,
              required: true,
              admin: {
                description: 'Categorize your blog post',
              },
            },
            {
              name: 'tags',
              type: 'relationship',
              relationTo: 'blog-tags',
              hasMany: true,
              admin: {
                description: 'Add tags to help readers find related content',
              },
            },
            {
              name: 'relatedPosts',
              type: 'relationship',
              relationTo: 'blog-posts',
              hasMany: true,
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_equals: id,
                  },
                }
              },
              admin: {
                description: 'Select related blog posts to display',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              label: 'SEO Meta',
              fields: [
                OverviewField({
                  titlePath: 'meta.title',
                  descriptionPath: 'meta.description',
                  imagePath: 'meta.image',
                }),
                MetaTitleField({
                  hasGenerateFn: true,
                }),
                MetaImageField({
                  relationTo: 'media',
                }),
                MetaDescriptionField({}),
                PreviewField({
                  hasGenerateFn: true,
                  titlePath: 'meta.title',
                  descriptionPath: 'meta.description',
                }),
              ],
            },
            {
              name: 'keywords',
              type: 'text',
              label: 'SEO Keywords',
              admin: {
                description: 'Comma-separated keywords (e.g., "bourbon, craftsmanship, heritage")',
              },
            },
          ],
        },
        {
          label: 'Settings',
          fields: [
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              label: 'Featured Post',
              admin: {
                description: 'Show this post prominently on the blog homepage',
              },
            },
            {
              name: 'readingTime',
              type: 'number',
              label: 'Reading Time',
              min: 1,
              admin: {
                description: 'Estimated minutes to read (auto-calculated if empty)',
                step: 1,
              },
              hooks: {
                beforeChange: [
                  ({ data, value }) => {
                    // Auto-calculate reading time if not set
                    if (!value && data?.flexibleContent) {
                      // Rough estimate: 200 words per minute
                      const plainText = JSON.stringify(data.flexibleContent)
                      const wordCount = plainText.split(/\s+/).length
                      return Math.max(1, Math.ceil(wordCount / 200))
                    }
                    return value
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    slugField('title'),
  ],
  hooks: {
    afterChange: [revalidateBlogPost],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 30000, // Auto-save every 30 seconds
      },
      validate: true,
    },
    maxPerDoc: 10,
  },
}