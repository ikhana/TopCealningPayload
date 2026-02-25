// src/blocks/BlogShowcase/config.ts - CONTENT-FOCUSED CONFIG
import type { Block } from 'payload'

export const BlogShowcase: Block = {
  slug: 'blogShowcase',
  interfaceName: 'BlogShowcaseBlock',
  labels: {
    singular: 'Blog Showcase',
    plural: 'Blog Showcases',
  },
  fields: [
    // ✅ CONTENT ONLY - NO STYLING OPTIONS
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'Stories from the Workshop',
      admin: {
        description: 'Main heading for the blog section',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Section Description',
      defaultValue: 'Explore the craftsmanship, heritage, and artistry behind every piece we create',
      admin: {
        rows: 2,
        description: 'Subtitle text below the main heading',
      },
    },

    // ✅ CONTENT SELECTION
    {
      name: 'displayType',
      type: 'select',
      defaultValue: 'featured',
      label: 'Which Posts to Show',
      options: [
        {
          label: 'Featured + Latest Posts',
          value: 'featured',
        },
        {
          label: 'Latest Posts Only',
          value: 'latest',
        },
        {
          label: 'Choose Specific Posts',
          value: 'manual',
        },
      ],
    },
    {
      name: 'selectedPosts',
      type: 'relationship',
      relationTo: 'blog-posts',
      hasMany: true,
      label: 'Selected Posts',
      admin: {
        condition: (_, { displayType }) => displayType === 'manual',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Number of Posts',
      defaultValue: 3,
      min: 2,
      max: 6,
      admin: {
        condition: (_, { displayType }) => displayType !== 'manual',
        description: 'First post will be featured prominently',
      },
    },

    // ✅ OPTIONAL CALL TO ACTION
    {
      name: 'ctaText',
      type: 'text',
      label: 'Button Text (optional)',
      admin: {
        placeholder: 'e.g. "Read All Stories"',
        description: 'Leave empty to hide the button',
      },
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Button Link',
      defaultValue: '/blog',
      admin: {
        condition: (_, { ctaText }) => !!ctaText,
      },
    },
  ],
}

