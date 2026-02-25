// src/blocks/ProductSpotlight/config.ts
import type { Block } from 'payload'

export const ProductSpotlight: Block = {
  slug: 'productSpotlight',
  interfaceName: 'ProductSpotlightBlock',
  fields: [
    {
      name: 'ctaButton',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'label',
          type: 'text',
          defaultValue: 'SHOP GIFTS',
          admin: {
            condition: (_, siblingData) => siblingData.enabled,
          },
        },
        {
          name: 'link',
          type: 'text',
          defaultValue: '/products',
          admin: {
            condition: (_, siblingData) => siblingData.enabled,
            description: 'Link URL (e.g., /products, /shop)',
          },
        },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'bourbon',
          options: [
            { label: 'Bourbon Primary', value: 'bourbon' },
            { label: 'Charcoal Dark', value: 'charcoal' },
            { label: 'Outline', value: 'outline' },
          ],
          admin: {
            condition: (_, siblingData) => siblingData.enabled,
          },
        },
      ],
    },
    {
      name: 'spotlightType',
      type: 'select',
      defaultValue: 'products',
      options: [
        {
          label: 'Products',
          value: 'products',
        },
        {
          label: 'Categories',
          value: 'categories',
        },
      ],
      admin: {
        description: 'What to showcase in the spotlight',
      },
    },
    // Products array - following ShopByCategories pattern exactly
    {
      name: 'selectedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      maxRows: 3,
      admin: {
        condition: (_, siblingData) => siblingData.spotlightType === 'products',
        description: 'Choose exactly 3 products to spotlight',
      },
      filterOptions: {
        _status: { equals: 'published' },
      },
    },
    // Categories array - following ShopByCategories pattern exactly  
    {
      name: 'selectedCategories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      maxRows: 3,
      admin: {
        condition: (_, siblingData) => siblingData.spotlightType === 'categories',
        description: 'Choose exactly 3 categories to spotlight',
      },
    },
    // Custom labels and images for each spotlight item
    {
      name: 'spotlightLabels',
      type: 'array',
      required: true,
      minRows: 3,
      maxRows: 3,
      fields: [
        {
          name: 'customLabel',
          type: 'text',
          required: true,
          admin: {
            description: 'Label for this spotlight item (e.g., "EXECUTIVE CHOICE")',
            placeholder: 'PREMIUM COLLECTION',
          },
        },
        {
          name: 'customImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional: Override with custom image',
          },
        },
      ],
      admin: {
        description: 'Labels and custom images for your 3 spotlight items (in order)',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'even',
      options: [
        {
          label: 'Even 3-Column Grid',
          value: 'even',
        },
        {
          label: 'Featured + 2 Side',
          value: 'featured',
        },
      ],
    },
    {
      name: 'enableHoverEffects',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable hover animations',
      },
    },
    {
      name: 'bg',
      type: 'select',
      defaultValue: 'parchment',
      options: [
        { label: 'Parchment', value: 'parchment' },
        { label: 'White', value: 'white' },
        { label: 'Charcoal', value: 'charcoal' },
        { label: 'Bourbon Tint', value: 'bourbon' },
      ],
    },
    {
      name: 'pad',
      type: 'select',
      defaultValue: 'large',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'Extra Large', value: 'xl' },
      ],
    },
  ],
  labels: {
    plural: 'Product Spotlights',
    singular: 'Product Spotlight',
  },
}
