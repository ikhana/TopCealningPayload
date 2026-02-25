// src/blocks/RichText/config.ts
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

export const RichText: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
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
    },
  ],
  labels: {
    plural: 'Rich Text Blocks',
    singular: 'Rich Text Block',
  },
}