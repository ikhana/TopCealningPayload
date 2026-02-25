// src/blocks/HeritageStorySpotlight/config.ts
import type { Block } from 'payload'

import {
    FixedToolbarFeature,
    HeadingFeature,
    InlineToolbarFeature,
    lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const HeritageStorySpotlight: Block = {
  slug: 'heritageStorySpotlight',
  interfaceName: 'HeritageStorySpotlightBlock',
  fields: [
    // ✅ STORY SUBJECT - MAIN CONTENT
    {
      name: 'subjectName',
      type: 'text',
      label: 'Subject Name',
      required: true,
      admin: {
        placeholder: 'e.g., Buford McCreary, Master Chen, Sarah Williams',
        description: 'Name of the person or subject being featured',
      },
    },
    {
      name: 'storyTitle',
      type: 'text',
      label: 'Story Title',
      required: true,
      defaultValue: 'The Man Behind The Legend',
      admin: {
        placeholder: 'e.g., The Man Behind The Legend, Master of Craftsmanship',
        description: 'Compelling headline for the story',
      },
    },
    {
      name: 'subjectRole',
      type: 'text',
      label: 'Role/Title (Optional)',
      admin: {
        placeholder: 'e.g., Founder & Master Craftsman, Lead Artisan',
        description: 'Optional role or title to display below the name',
      },
    },

    // ✅ VISUAL ELEMENTS
    {
      name: 'portraitImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Portrait Image',
      required: true,
      admin: {
        description: 'Professional portrait or heritage photo (square/portrait orientation works best)',
      },
    },
    {
      name: 'portraitAlt',
      type: 'text',
      label: 'Portrait Alt Text',
      admin: {
        description: 'Describe the image for accessibility',
      },
    },
    {
      name: 'signatureImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Signature Image (Optional)',
      admin: {
        description: 'Personal signature, logo, or mark to display at the bottom',
      },
    },
    {
      name: 'signatureAlt',
      type: 'text',
      label: 'Signature Alt Text',
      admin: {
        condition: (data, siblingData) => siblingData.signatureImage,
        description: 'Describe the signature for accessibility',
      },
    },

    // ✅ STORY CONTENT
    {
      name: 'storyContent',
      type: 'richText',
      label: 'Heritage Story',
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
      required: true,
      admin: {
        description: 'Tell the heritage story - write in engaging paragraphs that capture the essence and legacy',
      },
    },

    // ✅ MINIMAL LAYOUT OPTIONS - ADMIN FRIENDLY
    {
      name: 'imagePosition',
      type: 'select',
      label: 'Image Position',
      defaultValue: 'left',
      options: [
        {
          label: 'Left Side (Default)',
          value: 'left',
        },
        {
          label: 'Right Side',
          value: 'right',
        },
      ],
      admin: {
        description: 'Where to position the portrait image',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Style',
      defaultValue: 'antique',
      options: [
        {
          label: 'Antique Parchment (Default)',
          value: 'antique',
        },
        {
          label: 'Clean White',
          value: 'white',
        },
        {
          label: 'Heritage Charcoal',
          value: 'charcoal',
        },
      ],
      admin: {
        description: 'Background style for the story section',
      },
    },

    // ✅ OPTIONAL QUOTE HIGHLIGHT
    {
      name: 'featuredQuote',
      type: 'textarea',
      label: 'Featured Quote (Optional)',
      admin: {
        rows: 2,
        placeholder: 'e.g., "His fingers could detect the grain of wood within thousandths of an inch"',
        description: 'Optional highlighted quote to emphasize within the story',
      },
    },
  ],
  labels: {
    plural: 'Heritage Story Spotlights',
    singular: 'Heritage Story Spotlight',
  },
}