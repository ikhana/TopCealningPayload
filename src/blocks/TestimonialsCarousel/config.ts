// blocks/TestimonialsCarousel/config.ts

import type { Block } from 'payload'
import { sectionIdField } from '@/fields/sectionId'
import { richTextField } from '@/fields/richTextField'
import { linkWithAnchor } from '@/fields/linkWithAnchor'

export const TestimonialsCarousel: Block = {
  slug: 'testimonialsCarousel',
  interfaceName: 'TestimonialsCarouselBlock',
  dbName: 'testimonials_carousel',
  fields: [
    sectionIdField(),
    
    {
      name: 'backgroundStyle',
      type: 'select',
      defaultValue: 'muted',
      options: [
        { label: 'Default (White)', value: 'default' },
        { label: 'Muted', value: 'muted' },
        { label: 'Card', value: 'card' },
      ],
      admin: {
        description: 'Background color style',
      },
    },
    
    richTextField({
      name: 'content',
      label: 'Heading & Description',
      required: true,
      overrides: {
        admin: {
          description: 'Main heading and supporting text',
        },
      },
    }),
    
    {
      name: 'cta',
      type: 'group',
      label: 'Optional Call to Action',
      fields: [linkWithAnchor()],
    },
    
    {
      name: 'testimonials',
      type: 'array',
      label: 'Testimonials',
      minRows: 3,
      maxRows: 12,
      required: true,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            description: 'Photo of the person giving testimonial (optional - uses placeholder if empty)',
          },
        },
        {
          name: 'quote',
          type: 'textarea',
          required: false,
          maxLength: 300,
          admin: {
            rows: 4,
            description: 'Testimonial quote or summary (max 300 characters, optional)',
          },
        },
        {
          name: 'name',
          type: 'text',
          required: false,
          maxLength: 50,
          admin: {
            description: 'Person name (max 50 characters, optional)',
          },
        },
        {
          name: 'role',
          type: 'text',
          required: false,
          maxLength: 60,
          admin: {
            description: 'Job title or role (max 60 characters, optional)',
          },
        },
      ],
    },
    
    {
      name: 'carouselSettings',
      type: 'group',
      label: 'Carousel Settings',
      fields: [
        {
          name: 'loop',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable infinite loop',
          },
        },
        {
          name: 'autoplay',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Auto-advance slides',
          },
        },
        {
          name: 'autoplayDelay',
          type: 'number',
          defaultValue: 5000,
          admin: {
            description: 'Autoplay delay in milliseconds (if enabled)',
            condition: (data: any) => data.autoplay === true,
          },
        },
      ],
    },
  ],
  labels: {
    plural: 'Testimonials Carousel Sections',
    singular: 'Testimonials Carousel Section',
  },
}