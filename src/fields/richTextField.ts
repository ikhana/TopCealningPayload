import type { Field } from 'payload'
import { deepMerge } from '@/utilities/deepMerge'
import {
  BlockquoteFeature,
  BoldFeature,
  HeadingFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

type RichTextType = (options?: {
  name?: string
  label?: string
  required?: boolean
  overrides?: Partial<Field>
}) => Field

// Full rich text editor - all features enabled
export const richTextField: RichTextType = ({
  name = 'content',
  label = 'Content',
  required = false,
  overrides = {},
} = {}) => {
  const richTextConfig: Field = {
    name,
    type: 'richText',
    label,
    required,
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
          enabledCollections: ['pages'],
        }),
      ],
    }),
  }

  return deepMerge(richTextConfig, overrides)
}

// Simplified rich text for shorter content (headings, descriptions)
// Only basic formatting: bold, italic, underline, links
export const richTextSimple: RichTextType = ({
  name = 'description',
  label = 'Description',
  required = false,
  overrides = {},
} = {}) => {
  const richTextConfig: Field = {
    name,
    type: 'richText',
    label,
    required,
    editor: lexicalEditor({
      features: () => [
        BoldFeature(),
        ItalicFeature(),
        UnderlineFeature(),
        ParagraphFeature(),
        LinkFeature({
          enabledCollections: ['pages'],
        }),
      ],
    }),
  }

  return deepMerge(richTextConfig, overrides)
}