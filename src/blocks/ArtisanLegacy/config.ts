// src/blocks/ArtisanLegacy/config.ts
import type { Block } from 'payload'

import {
    FixedToolbarFeature,
    HeadingFeature,
    InlineToolbarFeature,
    lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const ArtisanLegacy: Block = {
  slug: 'artisanLegacy',
  interfaceName: 'ArtisanLegacyBlock',
  fields: [
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Showcase of your finest custom work or workshop scene',
      },
    },
    {
      name: 'heroImageAlt',
      type: 'text',
      admin: {
        description: 'Alt text for accessibility',
      },
    },
    {
      name: 'overlayHeight',
      type: 'select',
      defaultValue: 'third',
      options: [
        {
          label: '1/4 (25%) - Minimal overlay',
          value: 'quarter',
        },
        {
          label: '1/3 (33%) - Balanced overlay',
          value: 'third',
        },
        {
          label: '1/2 (50%) - Large overlay',
          value: 'half',
        },
      ],
      admin: {
        description: 'How much of the bottom should be used for content overlay',
      },
    },
    {
      name: 'overlayBackground',
      type: 'select',
      defaultValue: 'bourbon',
      options: [
        {
          label: 'Dark Gradient',
          value: 'gradient',
        },
        {
          label: 'Bourbon Tinted (Recommended)',
          value: 'bourbon',
        },
        {
          label: 'Solid Dark',
          value: 'dark',
        },
        {
          label: 'Minimal (Text shadows only)',
          value: 'minimal',
        },
      ],
      admin: {
        description: 'Background style for the content overlay',
      },
    },
    {
      name: 'heroContent',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      admin: {
        description: 'Rich content to overlay on the hero (e.g., "Three Generations of Masterful Craftsmanship")',
      },
    },
    {
      name: 'contentAlignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'Left',
          value: 'left',
        },
        {
          label: 'Right',
          value: 'right',
        },
      ],
      admin: {
        description: 'Text alignment within the overlay area',
      },
    },
    {
      name: 'galleryTitle',
      type: 'text',
      defaultValue: 'Masterpieces & Their Stories',
      admin: {
        description: 'Title above the testimonial gallery',
      },
    },
    {
      name: 'testimonials',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'showcaseImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Image of the custom work or client space',
          },
        },
        {
          name: 'showcaseImageAlt',
          type: 'text',
          admin: {
            description: 'Alt text for the showcase image',
          },
        },
        {
          name: 'testimonialContent',
          type: 'richText',
          required: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
              ]
            },
          }),
          admin: {
            description: 'Rich testimonial content with client quote and attribution',
          },
        },
        {
          name: 'projectType',
          type: 'text',
          admin: {
            description: 'Type of project (e.g., "Executive Boardroom", "Private Collection")',
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Mark as featured testimonial (gets premium styling)',
          },
        },
      ],
      admin: {
        description: 'Gallery of custom work with client testimonials',
      },
    },
    {
      name: 'legacyStats',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show heritage statistics section',
          },
        },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'A Legacy of Excellence',
          admin: {
            condition: (data, siblingData) => siblingData.enabled,
          },
        },
        {
          name: 'stats',
          type: 'array',
          maxRows: 4,
          fields: [
            {
              name: 'number',
              type: 'text',
              required: true,
              admin: {
                description: 'Heritage number (e.g., "3rd", "500+", "1923")',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                description: 'Heritage label (e.g., "Generation", "Masterpieces", "Established")',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'Optional description of this heritage aspect',
              },
            },
          ],
          admin: {
            condition: (data, siblingData) => siblingData.enabled,
            description: 'Heritage statistics',
          },
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'gallery',
      options: [
        {
          label: 'Gallery Grid (Recommended)',
          value: 'gallery',
        },
        {
          label: 'Masonry Layout',
          value: 'masonry',
        },
        {
          label: 'Side-by-Side Stories',
          value: 'stories',
        },
      ],
      admin: {
        description: 'How to display the testimonial gallery',
      },
    },
    {
      name: 'imageStyle',
      type: 'select',
      defaultValue: 'cover',
      options: [
        {
          label: 'Cover (Fill)',
          value: 'cover',
        },
        {
          label: 'Contain (Fit)',
          value: 'contain',
        },
      ],
      admin: {
        description: 'How images should be displayed',
      },
    },
    {
      name: 'enableHoverEffects',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable subtle hover animations',
      },
    },
    {
      name: 'sectionPadding',
      type: 'select',
      defaultValue: 'large',
      options: [
        {
          label: 'Small',
          value: 'small',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'Large',
          value: 'large',
        },
      ],
    },
  ],
  labels: {
    plural: 'Artisan Legacy Sections',
    singular: 'Artisan Legacy Section',
  },
}