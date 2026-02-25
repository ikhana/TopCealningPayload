// blocks/AboutSplit/config.ts

import type { Block } from 'payload'
import { sectionIdField } from '@/fields/sectionId'
import { richTextField } from '@/fields/richTextField'

export const AboutSplit: Block = {
  slug: 'aboutSplit',
  interfaceName: 'AboutSplitBlock',
  dbName: 'about_split',
  fields: [
    sectionIdField(),
    
    richTextField({
      name: 'content',
      label: 'Content',
      required: true,
      overrides: {
        admin: {
          description: 'Add your content with headings, paragraphs, and formatting. This will be styled according to your theme.',
        },
      },
    }),
    
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Image displayed on the right side',
      },
    },
    
    {
      name: 'backgroundStyle',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default (White)', value: 'default' },
        { label: 'Muted Gray', value: 'muted' },
        { label: 'Accent', value: 'accent' },
      ],
      admin: {
        description: 'Background color style',
      },
    },
    
    {
      name: 'showDottedPattern',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show decorative dotted pattern on the left',
      },
    },
    
    {
      name: 'cardStyle',
      type: 'group',
      label: 'Card Styling',
      admin: {
        description: 'Customize the content card appearance',
      },
      fields: [
        {
          name: 'backgroundColor',
          type: 'select',
          defaultValue: 'white',
          options: [
            { label: 'White with Blur', value: 'white' },
            { label: 'Card Background', value: 'card' },
            { label: 'Muted', value: 'muted' },
            { label: 'Transparent', value: 'transparent' },
          ],
        },
        {
          name: 'shadow',
          type: 'select',
          defaultValue: 'sm',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'About/Hero Split Sections',
    singular: 'About/Hero Split Section',
  },
}