// src/blocks/QualityGuarantee/config.ts
import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const QualityGuarantee: Block = {
  slug: 'qualityGuarantee',
  interfaceName: 'QualityGuaranteeBlock',
  fields: [
    // SECTION HEADER
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Our Quality Guarantee',
      admin: {
        description: 'Main heading for the guarantee section',
        placeholder: 'e.g., Our Quality Promise, Product Warranties, Service Guarantees',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue: 'Every piece backed by our commitment to excellence and lifetime satisfaction',
      admin: {
        rows: 2,
        description: 'Brief description of your quality commitment',
        placeholder: 'Describe your overall quality promise and commitment to customers',
      },
    },

    // GUARANTEE TYPE WITH ENHANCED DESCRIPTIONS
    {
      name: 'type',
      type: 'select',
      defaultValue: 'company',
      options: [
        { 
          label: 'Company Brand Promises - Overall business guarantees & service standards', 
          value: 'company' 
        },
        { 
          label: 'Product Warranties - Specific product guarantees & material coverage', 
          value: 'product' 
        },
        { 
          label: 'Service Guarantees - Support, installation & maintenance promises', 
          value: 'service' 
        },
      ],
      admin: {
        description: 'Choose the type to get relevant default content. Each type includes pre-filled examples you can customize.',
      },
    },

    // LAYOUT OPTIONS
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid Layout - Cards in a grid', value: 'grid' },
        { label: 'Horizontal Cards - Side by side', value: 'horizontal' },
        { label: 'Badge Style - Compact badges', value: 'badges' },
      ],
      admin: {
        description: 'How to display the guarantees (grid works best for most cases)',
      },
    },

    // GUARANTEE ITEMS WITH TYPE-BASED DEFAULTS
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      maxRows: 8,
      admin: {
        description: 'Your quality guarantees (3-6 items work best). Default content is provided based on the type selected above.',
      },
      defaultValue: [
        // Default Company Guarantees
        {
          title: 'Heritage Craftsmanship Promise',
          icon: 'shield',
          description: 'Every piece handcrafted with techniques passed down through generations, ensuring authentic quality and character.',
          hasDetails: true,
          highlight: true,
        },
        {
          title: 'Customer Satisfaction Guarantee',
          icon: 'star',
          description: 'Not completely satisfied? We will work with you until you love your purchase or provide a full refund.',
          hasDetails: false,
          highlight: false,
        },
        {
          title: 'Sustainable Sourcing Promise',
          icon: 'leaf',
          description: 'All materials ethically sourced from sustainable suppliers who share our commitment to environmental responsibility.',
          hasDetails: true,
          highlight: false,
        },
        {
          title: 'Lifetime Support',
          icon: 'trophy',
          description: 'Our relationship doesn not end at purchase. Lifetime care guidance and support for all our heritage pieces.',
          hasDetails: false,
          highlight: false,
        },
      ],
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Clear, compelling guarantee title',
            placeholder: 'e.g., Lifetime Warranty, 30-Day Returns, Free Installation',
          },
        },
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'shield',
          options: [
            { label: 'Shield - Protection/Warranty', value: 'shield' },
            { label: 'Trophy - Premium/Award', value: 'trophy' },
            { label: 'Star - Quality/Excellence', value: 'star' },
            { label: 'Hammer - Craftsmanship', value: 'hammer' },
            { label: 'Diamond - Premium/Luxury', value: 'diamond' },
            { label: 'Leaf - Sustainable/Natural', value: 'leaf' },
            { label: 'Target - Precision/Accuracy', value: 'target' },
            { label: 'Fire - Passion/Intensity', value: 'fire' },
            { label: 'Tree - Longevity/Growth', value: 'tree' },
            { label: 'Flag - Achievement/Milestone', value: 'flag' },
          ],
          admin: {
            description: 'Icon to represent this guarantee',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            rows: 2,
            description: 'Brief description of this guarantee (1-2 sentences)',
            placeholder: 'Describe what this guarantee covers and why customers should trust it',
          },
        },
        {
          name: 'hasDetails',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Add expandable details section for warranty terms, conditions, etc.',
          },
        },
        {
          name: 'details',
          type: 'richText',
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
          admin: {
            condition: (data, siblingData) => siblingData?.hasDetails === true,
            description: 'Detailed warranty terms, conditions, or process details',
          },
        },
        {
          name: 'highlight',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Feature this guarantee with premium styling (use for your most important guarantee)',
          },
        },
      ],
    },

    // CONDITIONAL DEFAULT CONTENT BASED ON TYPE
    {
      name: 'defaultContentType',
      type: 'select',
      admin: {
        hidden: true, // This field is just for logic, not shown to users
      },
      options: [
        { label: 'Company', value: 'company' },
        { label: 'Product', value: 'product' },
        { label: 'Service', value: 'service' },
      ],
    },

    // DISPLAY OPTIONS
    {
      name: 'showBadge',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Add decorative heritage elements and texture overlays',
      },
    },

    // OPTIONAL CALL TO ACTION
    {
      name: 'enableCTA',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Add a button below the guarantees',
      },
    },
    {
      name: 'ctaText',
      type: 'text',
      admin: {
        condition: (data, siblingData) => siblingData?.enableCTA === true,
        placeholder: 'e.g., Learn More, View Warranty Details, Contact Support',
      },
    },
    {
      name: 'ctaLink',
      type: 'text',
      admin: {
        condition: (data, siblingData) => siblingData?.enableCTA === true,
        description: 'Internal link (start with /) or external URL',
        placeholder: 'e.g., /warranty-details, /contact, https://support.example.com',
      },
    },

    // PRODUCT ASSOCIATION (for product pages)
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      admin: {
        description: 'Optional: associate with specific product (mainly for product-specific warranties)',
        condition: (data, siblingData) => siblingData?.type === 'product',
      },
    },
  ],
  labels: {
    singular: 'Quality Guarantee Block',
    plural: 'Quality Guarantee Blocks',
  },
}

// DEFAULT CONTENT SETS FOR EACH TYPE
export const GUARANTEE_DEFAULTS = {
  company: {
    title: 'Our Heritage Promise',
    description: 'Built on generations of craftsmanship, backed by our unwavering commitment to excellence',
    items: [
      {
        title: 'Heritage Craftsmanship Promise',
        icon: 'shield',
        description: 'Every piece handcrafted with techniques passed down through generations, ensuring authentic quality and character.',
        hasDetails: true,
        highlight: true,
      },
      {
        title: 'Customer Satisfaction Guarantee',
        icon: 'star',
        description: 'Not completely satisfied? We will work with you until you love your purchase or provide a full refund.',
        hasDetails: false,
        highlight: false,
      },
      {
        title: 'Sustainable Sourcing Promise',
        icon: 'leaf',
        description: 'All materials ethically sourced from sustainable suppliers who share our commitment to environmental responsibility.',
        hasDetails: true,
        highlight: false,
      },
      {
        title: 'Lifetime Support',
        icon: 'trophy',
        description: 'Our relationship doesn not end at purchase. Lifetime care guidance and support for all our heritage pieces.',
        hasDetails: false,
        highlight: false,
      },
    ]
  },
  
  product: {
    title: 'Product Warranty Coverage',
    description: 'Comprehensive protection for your investment, covering materials, craftsmanship, and performance',
    items: [
      {
        title: 'Lifetime Material Warranty',
        icon: 'diamond',
        description: 'Premium bourbon barrel wood and slate materials guaranteed against defects for the lifetime of the product.',
        hasDetails: true,
        highlight: true,
      },
      {
        title: '5-Year Craftsmanship Guarantee',
        icon: 'hammer',
        description: 'All joinery, finishing, and construction techniques guaranteed for 5 years against manufacturing defects.',
        hasDetails: true,
        highlight: false,
      },
      {
        title: '30-Day Perfect Fit Promise',
        icon: 'target',
        description: 'If your board does not meet your exact specifications, we will remake it at no charge within 30 days.',
        hasDetails: false,
        highlight: false,
      },
      {
        title: 'Replacement Parts Available',
        icon: 'shield',
        description: 'Damaged components can be individually replaced. We maintain stock of all parts for current and legacy products.',
        hasDetails: true,
        highlight: false,
      },
    ]
  },
  
  service: {
    title: 'Service Excellence Guarantee',
    description: 'From consultation to delivery, we guarantee exceptional service at every touchpoint',
    items: [
      {
        title: 'Expert Consultation Promise',
        icon: 'star',
        description: 'Every customer receives personalized guidance from our master craftsmen to ensure the perfect selection.',
        hasDetails: false,
        highlight: true,
      },
      {
        title: 'On-Time Delivery Guarantee',
        icon: 'flag',
        description: 'Your order will arrive exactly when promised, or we will compensate you for the delay.',
        hasDetails: true,
        highlight: false,
      },
      {
        title: 'White-Glove Installation',
        icon: 'trophy',
        description: 'Professional installation and setup service ensures your piece is perfectly positioned and ready to use.',
        hasDetails: true,
        highlight: false,
      },
      {
        title: 'Lifetime Care Support',
        icon: 'leaf',
        description: 'Ongoing maintenance guidance, care tips, and restoration services available throughout the product lifetime.',
        hasDetails: false,
        highlight: false,
      },
    ]
  }
}