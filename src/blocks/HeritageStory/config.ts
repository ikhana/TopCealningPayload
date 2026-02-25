// src/blocks/HeritageStory/config.ts
import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const HeritageStory: Block = {
  slug: 'heritageStory',
  interfaceName: 'HeritageStoryBlock',
  fields: [
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Hero background image for your heritage story',
      },
    },
    {
      name: 'heroImageAlt',
      type: 'text',
      admin: {
        description: 'Alt text for the hero image for accessibility',
      },
    },
    {
      name: 'storyContent',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      required: true,
      admin: {
        description: 'Heritage story content. Use H1 for main title, paragraphs for body text.',
      },
    },
    {
      name: 'ctaButton',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show call-to-action button',
          },
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData.enabled,
            description: 'Button text',
          },
        },
        {
          name: 'link',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData.enabled,
            description: 'Button destination URL',
          },
        },
      ],
      admin: {
        description: 'Call-to-action button configuration',
      },
    },
    {
      name: 'galleryTitle',
      type: 'text',
      admin: {
        description: 'Optional title above the image gallery',
      },
    },
    {
      name: 'leftImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Left image in the gallery (e.g., craftsperson working)',
      },
    },
    {
      name: 'leftImageAlt',
      type: 'text',
      admin: {
        description: 'Alt text for the left image',
      },
    },
    {
      name: 'rightImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Right image in the gallery (e.g., detailed craftsmanship)',
      },
    },
    {
      name: 'rightImageAlt',
      type: 'text',
      admin: {
        description: 'Alt text for the right image',
      },
    },
  ],
  labels: {
    plural: 'Heritage Stories',
    singular: 'Heritage Story',
  },
}