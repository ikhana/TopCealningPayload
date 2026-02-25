// blocks/VideoShowcase/config.ts

import type { Block } from 'payload'
import { sectionIdField } from '@/fields/sectionId'
import { richTextField } from '@/fields/richTextField'
import { linkWithAnchor } from '@/fields/linkWithAnchor'

export const VideoShowcase: Block = {
  slug: 'videoShowcase',
  interfaceName: 'VideoShowcaseBlock',
  dbName: 'video_show',
  fields: [
    sectionIdField(),
    
    {
      name: 'backgroundStyle',
      type: 'select',
      defaultValue: 'muted',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Muted Gray', value: 'muted' },
        { label: 'Light Accent', value: 'accent' },
      ],
      admin: {
        description: 'Background style for the section',
      },
    },
    
    richTextField({
      name: 'content',
      label: 'Content',
      required: true,
      overrides: {
        admin: {
          description: 'Main content (headings, paragraphs, lists)',
        },
      },
    }),
    
    {
      name: 'cta',
      type: 'group',
      label: 'Call to Action Button',
      fields: [linkWithAnchor()],
    },
    
    {
      name: 'videoType',
      type: 'select',
      defaultValue: 'upload',
      required: true,
      options: [
        { label: 'Upload Video', value: 'upload' },
        { label: 'Video URL', value: 'url' },
        { label: 'YouTube', value: 'youtube' },
      ],
      admin: {
        description: 'Choose video source type',
      },
    },
    
    {
      name: 'videoFile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data.videoType === 'upload',
        description: 'Upload video file',
      },
    },
    
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        condition: (data) => data.videoType === 'url',
        description: 'Direct video URL (MP4, WebM, etc.)',
      },
    },
    
    {
      name: 'youtubeId',
      type: 'text',
      admin: {
        condition: (data) => data.videoType === 'youtube',
        description: 'YouTube video ID (e.g., dQw4w9WgXcQ)',
      },
    },
    
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Video thumbnail image',
      },
    },
    
    {
      name: 'caption',
      type: 'text',
      required: false,
      admin: {
        description: 'Optional caption below video (e.g., speaker name)',
      },
    },
  ],
  labels: {
    plural: 'Video Showcase Sections',
    singular: 'Video Showcase Section',
  },
}