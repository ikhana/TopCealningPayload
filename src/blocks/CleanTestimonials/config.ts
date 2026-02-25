// src/blocks/CleanTestimonials/config.ts
import type { Block } from 'payload'

export const CleanTestimonials: Block = {
  slug: 'cleanTestimonials',
  interfaceName: 'CleanTestimonialsBlock',
  fields: [
    // Section Configuration
    {
      name: 'sectionTitle',
      type: 'text',
      defaultValue: 'What Our Patients Say',
      admin: {
        description: 'Main section heading',
      },
    },
    {
      name: 'sectionSubtitle',
      type: 'textarea',
      admin: {
        description: 'Optional subtitle below the main heading',
        rows: 2,
      },
    },

    // Testimonials Array
    {
      name: 'testimonials',
      type: 'array',
      minRows: 1,
      maxRows: 12,
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Patient testimonial quote - keep impactful and authentic',
            rows: 3,
          },
        },
        {
          name: 'authorName',
          type: 'text',
          required: true,
          admin: {
            description: 'Patient name (first name + last initial for privacy: "Sarah K.")',
          },
        },
        {
          name: 'authorTitle',
          type: 'text',
          admin: {
            description: 'Optional title or context (e.g., "Business Owner", "Healthcare Worker")',
          },
        },
        {
          name: 'testType',
          type: 'text',
          admin: {
            description: 'Type of test taken (e.g., "Genetic Screening", "Cancer Panel", "Employment Physical")',
          },
        },
        {
          name: 'location',
          type: 'text',
          admin: {
            description: 'Optional location (e.g., "Phoenix, AZ", "Scottsdale")',
          },
        },
        {
          name: 'testimonialDate',
          type: 'date',
          admin: {
            description: 'Optional date when testimonial was given',
          },
        },
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          admin: {
            description: 'Star rating (1-5 stars)',
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          admin: {
            description: 'Mark as featured testimonial (shows first in lists)',
          },
        },
      ],
      admin: {
        description: 'Patient testimonials - no photos needed, focuses on authentic experiences',
      },
    },

    // Layout Configuration
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        {
          label: 'Grid Layout (Default)',
          value: 'grid',
        },
        {
          label: 'Masonry Layout',
          value: 'masonry',
        },
        {
          label: 'Single Column',
          value: 'single',
        },
        {
          label: 'Horizontal Carousel',
          value: 'carousel',
        },
      ],
      admin: {
        description: 'How to display the testimonials',
      },
    },

    // Visual Configuration
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'clinical',
      options: [
        {
          label: 'Clinical White (Recommended)',
          value: 'clinical',
        },
        {
          label: 'Pure White',
          value: 'white',
        },
        {
          label: 'Subtle Background',
          value: 'subtle',
        },
        {
          label: 'Gradient Background',
          value: 'gradient',
        },
      ],
      admin: {
        description: 'Background style for the section',
      },
    },

    {
      name: 'sectionPadding',
      type: 'select',
      defaultValue: 'large',
      options: [
        {
          label: 'Small Padding',
          value: 'small',
        },
        {
          label: 'Medium Padding',
          value: 'medium',
        },
        {
          label: 'Large Padding (Default)',
          value: 'large',
        },
        {
          label: 'Extra Large Padding',
          value: 'xl',
        },
      ],
      admin: {
        description: 'Vertical spacing for the section',
      },
    },

    // Feature Toggles
    {
      name: 'enableRatings',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show star ratings above testimonials',
      },
    },

    {
      name: 'showTestType',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Display the type of test associated with each testimonial',
      },
    },

    // Optional CTA
    {
      name: 'enableCTA',
      type: 'checkbox',
      admin: {
        description: 'Add a call-to-action button below the testimonials',
      },
    },
    {
      name: 'ctaText',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.enableCTA,
        description: 'CTA button text',
      },
      defaultValue: 'Share Your Experience',
    },
    {
      name: 'ctaLink',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.enableCTA,
        description: 'CTA button destination URL',
      },
      defaultValue: '/contact',
    },
  ],
  labels: {
    singular: 'Clean Testimonials Block',
    plural: 'Clean Testimonials Blocks',
  },
}

// Sample Data for New Birth Labs
export const TESTIMONIAL_SAMPLES = {
  genetic: [
    {
      quote: "The genetic screening gave me peace of mind about my family's health history. The mobile service made it so convenient - they came right to my office.",
      authorName: "Sarah K.",
      authorTitle: "Marketing Director",
      testType: "Genetic Screening Panel",
      location: "Phoenix, AZ",
      rating: 5,
      featured: true,
    },
    {
      quote: "Professional, discreet, and thorough. The results helped my doctor create a personalized prevention plan. Highly recommend New Birth Labs.",
      authorName: "Michael R.",
      testType: "Genetic Cancer Screening",
      location: "Scottsdale, AZ", 
      rating: 5,
    },
  ],
  
  cancer: [
    {
      quote: "Early detection saved my life. The mobile lab made it easy to get tested without disrupting my schedule. Forever grateful.",
      authorName: "Jennifer M.",
      authorTitle: "Small Business Owner",
      testType: "Comprehensive Cancer Panel",
      location: "Tempe, AZ",
      rating: 5,
      featured: true,
    },
  ],
  
  employment: [
    {
      quote: "Quick, professional employment testing. They worked around our company schedule and delivered results fast. Will use again.",
      authorName: "David L.",
      authorTitle: "HR Manager",
      testType: "Employment Physical",
      location: "Mesa, AZ",
      rating: 5,
    },
  ],
}