// src/blocks/Timeline/config.ts
import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Timeline: Block = {
  slug: 'timeline',
  interfaceName: 'TimelineBlock',
  fields: [
    // ✅ SECTION HEADER - CONTENT FOCUSED
    {
      name: 'sectionTitle',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'Our Heritage Story',
      admin: {
        description: 'Main heading for the timeline section',
      },
    },
    {
      name: 'sectionDescription',
      type: 'textarea',
      label: 'Section Description',
      defaultValue: 'Decades of dedication to the art of luxury craftsmanship',
      admin: {
        rows: 2,
        description: 'Subtitle text below the main heading',
      },
    },

    // ✅ TIMELINE ITEMS - MAIN CONTENT
    {
      name: 'timelineItems',
      type: 'array',
      label: 'Timeline Milestones',
      minRows: 3,
      maxRows: 12,
      admin: {
        description: 'Add milestones in chronological order (newest first works well)',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'year',
          type: 'text',
          label: 'Year/Date',
          required: true,
          admin: {
            placeholder: 'e.g., 1985, 2024, Q3 2023',
            description: 'Year or time period for this milestone',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Milestone Title',
          required: true,
          admin: {
            placeholder: 'e.g., The Beginning, Master Recognition',
            description: 'Clear, compelling title for this milestone',
          },
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Milestone Description',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
              ]
            },
          }),
          required: true,
          admin: {
            description: 'Tell the story of this milestone (keep to 2-3 sentences for best readability)',
          },
        },
        {
          name: 'milestoneImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Milestone Image (Optional)',
          admin: {
            description: 'Image representing this milestone (workshop photo, product, award, etc.)',
          },
        },
        {
          name: 'imageAlt',
          type: 'text',
          label: 'Image Alt Text',
          admin: {
            condition: (data, siblingData) => siblingData.milestoneImage,
            description: 'Describe the image for accessibility',
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          label: 'Featured Milestone',
          defaultValue: false,
          admin: {
            description: 'Highlight this milestone with special styling (use sparingly - 2-3 max)',
          },
        },
      ],
    },

    // ✅ MINIMAL LAYOUT OPTIONS - ADMIN FRIENDLY
    {
      name: 'layoutDirection',
      type: 'select',
      label: 'Timeline Layout',
      defaultValue: 'alternating',
      options: [
        {
          label: 'Alternating (Left/Right)',
          value: 'alternating',
        },
        {
          label: 'All Left Side',
          value: 'left',
        },
        {
          label: 'All Right Side', 
          value: 'right',
        },
      ],
      admin: {
        description: 'How to arrange timeline items (alternating works best for most content)',
      },
    },

    // ✅ OPTIONAL CALL TO ACTION
    {
      name: 'enableCTA',
      type: 'checkbox',
      label: 'Show Call-to-Action Button',
      defaultValue: false,
      admin: {
        description: 'Add a button below the timeline',
      },
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Button Text',
      admin: {
        condition: (data, siblingData) => siblingData.enableCTA,
        placeholder: 'e.g., Explore Our Legacy Collection',
      },
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Button Link',
      admin: {
        condition: (data, siblingData) => siblingData.enableCTA,
        placeholder: 'e.g., /products, /about, /contact',
      },
    },
  ],
  labels: {
    plural: 'Timeline Blocks',
    singular: 'Timeline Block',
  },
}