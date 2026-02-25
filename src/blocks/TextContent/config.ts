// src/blocks/TextContent/config.ts
import {
    AlignFeature,
    BlockquoteFeature,
    HeadingFeature,
    HorizontalRuleFeature,
    IndentFeature,
    InlineToolbarFeature,
    LinkFeature,
    OrderedListFeature,
    UnorderedListFeature,
    lexicalEditor
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const TextContent: Block = {
  slug: 'textContent',
  interfaceName: 'TextContentBlock',
  labels: {
    singular: 'Text Content',
    plural: 'Text Content Blocks',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HeadingFeature({
            enabledHeadingSizes: ['h2', 'h3', 'h4'],
          }),
          BlockquoteFeature(),
          UnorderedListFeature(),
          OrderedListFeature(),
          LinkFeature({
            enabledCollections: ['pages', 'blog-posts', 'products'],
          }),
          AlignFeature(),
          IndentFeature(),
          InlineToolbarFeature(),
          HorizontalRuleFeature(),
        ],
      }),
      admin: {
        description: 'Add your text content here',
      },
    },
  ],
}