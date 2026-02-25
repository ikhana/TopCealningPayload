// src/blocks/ShopByCategories/config.ts - HERITAGE CRAFTSMAN VERSION
import type { Block } from 'payload'

export const ShopByCategories: Block = {
  slug: 'shopByCategories',
  interfaceName: 'ShopByCategoriesBlock',
  fields: [
    // Section Content
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Shop by Category',
      admin: {
        description: 'Main heading for the categories section',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional subtitle or description text',
      },
    },
    
    // Category Population Settings
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      options: [
        {
          label: 'Auto-fetch Categories',
          value: 'collection',
        },
        {
          label: 'Manual Selection',
          value: 'selection',
        },
      ],
      admin: {
        description: 'How to populate the categories to display',
      },
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        step: 1,
        description: 'Maximum number of categories to display (works best with multiples of 3)',
      },
      defaultValue: 6,
      label: 'Number of Categories',
      max: 12,
      min: 1,
    },
    {
      name: 'selectedCategories',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'selection',
        description: 'Choose specific categories to display',
      },
      hasMany: true,
      label: 'Select Categories',
      relationTo: 'categories',
    },
    
    // Layout & Display Options
    {
      name: 'displayStyle',
      type: 'select',
      defaultValue: 'grid',
      options: [
        {
          label: 'Heritage Grid Layout',
          value: 'grid',
        },
        {
          label: 'Carousel/Slider',
          value: 'carousel',
        },
      ],
      admin: {
        description: 'Choose between grid or carousel display',
      },
    },
    {
      name: 'imageStyle',
      type: 'select',
      defaultValue: 'cover',
      options: [
        {
          label: 'Cover (Fill Container)',
          value: 'cover',
        },
        {
          label: 'Contain (Fit Inside)',
          value: 'contain',
        },
        {
          label: 'Fill (Stretch to Fit)',
          value: 'fill',
        },
      ],
      admin: {
        description: 'How category images should be displayed within their containers',
      },
    },
    
    // Heritage Theme Options
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'parchment',
      options: [
        {
          label: 'Parchment (Light Heritage)',
          value: 'parchment',
        },
        {
          label: 'White (Clean)',
          value: 'white',
        },
        {
          label: 'Charcoal (Dark Workshop)',
          value: 'charcoal',
        },
        {
          label: 'Bourbon (Warm Heritage)',
          value: 'bourbon',
        },
      ],
      admin: {
        description: 'Background theme for the entire section',
      },
    },
    {
      name: 'sectionPadding',
      type: 'select',
      defaultValue: 'large',
      options: [
        {
          label: 'Small (Compact)',
          value: 'small',
        },
        {
          label: 'Medium (Balanced)',
          value: 'medium',
        },
        {
          label: 'Large (Spacious)',
          value: 'large',
        },
        {
          label: 'Extra Large (Premium)',
          value: 'xl',
        },
      ],
      admin: {
        description: 'Vertical spacing around the section',
      },
    },
    
    // Enhanced Features
    {
      name: 'showCategoryDescriptions',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Display category descriptions in the cards',
      },
    },
    {
      name: 'enableAnimations',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable heritage hover animations and transitions',
      },
    },
    {
      name: 'showViewAllButton',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        description: 'Show "Explore All Collections" button below categories',
      },
    },
    {
      name: 'viewAllButtonText',
      type: 'text',
      defaultValue: 'Explore All Collections',
      admin: {
        condition: (_, siblingData) => 
          siblingData.populateBy === 'collection' && siblingData.showViewAllButton,
        description: 'Custom text for the view all button',
      },
    },
    {
      name: 'viewAllButtonLink',
      type: 'text',
      defaultValue: '/shop',
      admin: {
        condition: (_, siblingData) => 
          siblingData.populateBy === 'collection' && siblingData.showViewAllButton,
        description: 'Custom link for the view all button',
      },
    },
  ],
  labels: {
    plural: 'Shop by Categories Blocks',
    singular: 'Shop by Categories Block',
  },
}