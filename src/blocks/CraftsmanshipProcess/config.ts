// src/blocks/CraftsmanshipProcess/config.ts
import type { Block } from 'payload'

export const CraftsmanshipProcess: Block = {
  slug: 'craftsmanshipProcess',
  interfaceName: 'CraftsmanshipProcessBlock',
  fields: [
    // ✅ SECTION HEADER - CONTENT FOCUSED
    {
      name: 'sectionTitle',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'Our Craftsmanship Process',
      admin: {
        description: 'Main heading for the craftsmanship process section',
        placeholder: 'e.g., Our Craftsmanship Process, How We Create Your Board',
      },
    },
    {
      name: 'sectionDescription',
      type: 'textarea',
      label: 'Section Description',
      defaultValue: 'From raw materials to finished masterpiece, every step reflects our commitment to excellence',
      admin: {
        rows: 2,
        description: 'Brief description shown above the tabbed process interface',
        placeholder: 'Describe the craftsmanship philosophy or process overview',
      },
    },

    // ✅ PROCESS TYPE - HELPS ADMINS CHOOSE CONTENT
    {
      name: 'processType',
      type: 'select',
      label: 'Process Type',
      defaultValue: 'general',
      options: [
        {
          label: 'General Craftsmanship (About Page)',
          value: 'general',
        },
        {
          label: 'Product-Specific Process',
          value: 'product',
        },
        {
          label: 'Custom/Personalization Process',
          value: 'custom',
        },
      ],
      admin: {
        description: 'What type of process is this showcasing? Affects styling and content suggestions.',
      },
    },

    // ✅ PROCESS STEPS - MAIN CONTENT
    {
      name: 'processSteps',
      type: 'array',
      label: 'Process Steps',
      minRows: 3,
      maxRows: 8,
      admin: {
        description: 'Craftsmanship steps in chronological order (3-8 steps work best for the tabbed interface)',
        initCollapsed: true,
        components: {
          RowLabel: '@/blocks/CraftsmanshipProcess/ui/ProcessStepRowLabel#ProcessStepRowLabel',
        },
      },
      fields: [
        {
          name: 'stepNumber',
          type: 'number',
          label: 'Step Number',
          required: true,
          min: 1,
          max: 10,
          admin: {
            description: 'Step order (1, 2, 3, etc.) - determines display sequence',
            width: '30%',
          },
        },
        {
          name: 'stepTitle',
          type: 'text',
          label: 'Step Title',
          required: true,
          admin: {
            placeholder: 'e.g., Heritage Wood Selection, Precision Shaping, Signature Bourbon Finish',
            description: 'Clear, concise title for this process step',
            width: '70%',
          },
        },
        {
          name: 'stepDescription',
          type: 'textarea',
          label: 'Step Description',
          required: true,
          admin: {
            rows: 3,
            placeholder: 'Detailed description of what happens in this step and its importance to the craftsmanship process',
            description: 'Main description shown in the tabbed interface - can be 2-3 sentences with good detail',
          },
        },
        {
          name: 'stepImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Workshop Image',
          required: true,
          admin: {
            description: 'Main workshop photo for this step - will be prominently displayed in the tabbed interface',
          },
        },
        {
          name: 'imageAlt',
          type: 'text',
          label: 'Image Alt Text',
          admin: {
            description: 'Describe the image for accessibility',
            placeholder: 'e.g., Craftsman selecting premium bourbon barrel wood',
          },
        },
        {
          name: 'duration',
          type: 'text',
          label: 'Time Duration (Optional)',
          admin: {
            placeholder: 'e.g., 2-3 hours, 24 hours drying, 1 week seasoning',
            description: 'How long this step takes (optional but adds authenticity)',
          },
        },
        {
          name: 'tools',
          type: 'text',
          label: 'Tools Used (Optional)',
          admin: {
            placeholder: 'e.g., Hand planes, Japanese chisels, Custom jigs',
            description: 'Tools or equipment used in this step (optional)',
          },
        },
        {
          name: 'highlightStep',
          type: 'checkbox',
          label: 'Signature Step',
          defaultValue: false,
          admin: {
            description: 'Mark as a signature step - gets crown icon and special highlighting in the interface',
          },
        },
      ],
    },

    // ✅ SIMPLIFIED DISPLAY OPTIONS - CLEAN TABBED INTERFACE
    {
      name: 'showStepNumbers',
      type: 'checkbox',
      label: 'Show Step Numbers',
      defaultValue: true,
      admin: {
        description: 'Display step numbers in the tab navigation and content area',
      },
    },

    // ✅ OPTIONAL CALL TO ACTION
    {
      name: 'enableCTA',
      type: 'checkbox',
      label: 'Show Call-to-Action',
      defaultValue: false,
      admin: {
        description: 'Add a button after the process steps',
      },
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'CTA Button Text',
      admin: {
        condition: (data, siblingData) => siblingData.enableCTA,
        placeholder: 'e.g., Shop Our Collection, Request Custom Quote, Learn More',
      },
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'CTA Button Link',
      admin: {
        condition: (data, siblingData) => siblingData.enableCTA,
        placeholder: 'e.g., /products, /custom-orders, /contact',
      },
    },

    // ✅ ADVANCED OPTIONS - FOR PRODUCT PAGES
    {
      name: 'linkedProduct',
      type: 'relationship',
      relationTo: 'products',
      label: 'Linked Product (Optional)',
      admin: {
        condition: (data, siblingData) => siblingData.processType === 'product',
        description: 'For product pages: link this process to a specific product',
      },
    },
    {
      name: 'showMaterials',
      type: 'checkbox',
      label: 'Show Materials Used',
      defaultValue: false,
      admin: {
        description: 'Display materials/wood types used in the process (good for product pages)',
      },
    },
    {
      name: 'materials',
      type: 'array',
      label: 'Materials',
      admin: {
        condition: (data, siblingData) => siblingData.showMaterials,
        description: 'Materials used in this specific process',
      },
      fields: [
        {
          name: 'materialName',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'e.g., Kentucky Bourbon Barrel Oak, Welsh Slate',
          },
        },
        {
          name: 'materialDescription',
          type: 'text',
          admin: {
            placeholder: 'e.g., Aged 12 years, Hand-selected for grain pattern',
          },
        },
      ],
    },
  ],
  labels: {
    plural: 'Craftsmanship Process Blocks',
    singular: 'Craftsmanship Process Block',
  },
}