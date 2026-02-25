// src/collections/PersonalizationOptions/index.ts
import type { CollectionConfig } from 'payload'

import { admins } from '@/access/admins'
import { anyone } from '@/access/anyone'

export const PersonalizationOptions: CollectionConfig = {
  slug: 'personalization-options',
  access: {
    create: admins,
    delete: admins,
    read: anyone,
    update: admins,
  },
  admin: {
       hidden: true,
    defaultColumns: ['label', 'fieldType', 'personalizationType', 'additionalPrice', 'active'],
    useAsTitle: 'label',
    description: 'Manage personalization options that can be added to products',
  },
  fields: [
    // ===== PREVIEW COMPONENT =====
    {
      type: 'ui',
      name: 'preview',
      admin: {
        components: {
          Field: '/src/collections/PersonalizationOptions/components/PersonalizationPreview#PersonalizationPreview',
        },
      },
    },
    
    // ===== INSTRUCTIONS COMPONENT =====
    {
      type: 'ui',
      name: 'instructions',
      admin: {
        components: {
          Field: '/src/collections/PersonalizationOptions/components/PersonalizationPreview#PersonalizationInstructions',
        },
      },
    },

    // ===== CORE FIELDS =====
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: {
        description: 'Customer-facing name (e.g., "Custom Name", "Add Date")',
      },
    },
    {
      name: 'fieldKey',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'System identifier (auto-generated from label)',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            // Auto-generate from label if not set
            if (!value && data?.label) {
              return data.label
                .toLowerCase()
                .replace(/\s+/g, '_')
                .replace(/[^\w_]+/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'personalizationType',
      type: 'select',
      required: true,
      defaultValue: 'simple',
      options: [
        {
          label: 'Simple Field',
          value: 'simple',
        },
        {
          label: 'Style Selector (with sub-fields)',
          value: 'style',
        },
        {
          label: 'Conditional Field',
          value: 'conditional',
        },
      ],
      admin: {
        description: 'How this personalization works',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'displayOrder',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Display order (lower = first)',
            width: '50%',
          },
        },
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Available to customers',
            width: '50%',
          },
        },
      ],
    },

    // ===== FIELD CONFIGURATION =====
    {
      type: 'collapsible',
      label: 'Field Configuration',
      admin: {
        initCollapsed: false,
      },
      fields: [
        // Field type - only for non-style personalizations
        {
          name: 'fieldType',
          type: 'select',
          required: true,
          options: [
            { label: 'Text Input', value: 'text' },
            { label: 'Text Area', value: 'textarea' },
            { label: 'Dropdown', value: 'select' },
            { label: 'Date Picker', value: 'date' },
            { label: 'Color Picker', value: 'color' },
          ],
          defaultValue: 'text',
          admin: {
            condition: (data) => data?.personalizationType !== 'style',
            description: 'Type of input field',
          },
        },

        // Text field settings
        {
          name: 'placeholder',
          type: 'text',
          admin: {
            condition: (data) => 
              ['text', 'textarea'].includes(data?.fieldType) && 
              data?.personalizationType !== 'style',
            description: 'Hint text shown in empty field',
          },
        },
        {
          name: 'characterLimit',
          type: 'number',
          min: 0,
          admin: {
            condition: (data) => 
              ['text', 'textarea'].includes(data?.fieldType) && 
              data?.personalizationType === 'simple',
            description: 'Maximum characters (0 = unlimited)',
          },
        },

        // Dropdown options
        {
          name: 'options',
          type: 'array',
          admin: {
            condition: (data) => 
              data?.fieldType === 'select' || 
              data?.personalizationType === 'style',
            description: 'Options for dropdown or style selector',
          },
          labels: {
            singular: 'Option',
            plural: 'Options',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '40%',
                  },
                },
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '40%',
                  },
                  hooks: {
                    beforeValidate: [
                      ({ value, siblingData }) => {
                        if (!value && siblingData?.label) {
                          return siblingData.label
                            .toLowerCase()
                            .replace(/\s+/g, '_')
                            .replace(/[^\w_]+/g, '')
                        }
                        return value
                      },
                    ],
                  },
                },
                {
                  name: 'additionalPrice',
                  type: 'number',
                  defaultValue: 0,
                  min: 0,
                  admin: {
                    description: '+$ (in cents)',
                    width: '20%',
                  },
                },
              ],
            },
          ],
        },

        // Style fields
        {
          name: 'styleFields',
          type: 'array',
          admin: {
            condition: (data) => data?.personalizationType === 'style',
            description: 'Input fields that appear when a style is selected',
          },
          labels: {
            singular: 'Style Field',
            plural: 'Style Fields',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'fieldLabel',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Field name',
                    width: '40%',
                  },
                },
                {
                  name: 'fieldKey',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '30%',
                  },
                  hooks: {
                    beforeValidate: [
                      ({ value, siblingData }) => {
                        if (!value && siblingData?.fieldLabel) {
                          return siblingData.fieldLabel
                            .toLowerCase()
                            .replace(/\s+/g, '_')
                            .replace(/[^\w_]+/g, '')
                        }
                        return value
                      },
                    ],
                  },
                },
                {
                  name: 'fieldType',
                  type: 'select',
                  options: [
                    { label: 'Text', value: 'text' },
                    { label: 'Date', value: 'date' },
                  ],
                  defaultValue: 'text',
                  admin: {
                    width: '20%',
                  },
                },
                {
                  name: 'required',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Required?',
                    width: '10%',
                  },
                },
              ],
            },
            {
              name: 'placeholder',
              type: 'text',
              admin: {
                condition: (data, siblingData) => siblingData?.fieldType === 'text',
                description: 'Placeholder text',
              },
            },
            {
              name: 'characterLimit',
              type: 'number',
              min: 0,
              admin: {
                condition: (data, siblingData) => siblingData?.fieldType === 'text',
                description: 'Max characters (0 = unlimited)',
              },
            },
          ],
        },

        // Conditional settings
        {
          name: 'parentOption',
          type: 'relationship',
          relationTo: 'personalization-options',
          admin: {
            condition: (data) => data?.personalizationType === 'conditional',
            description: 'Which field controls this one?',
          },
          filterOptions: ({ id }) => {
            return {
              id: {
                not_equals: id,
              },
              personalizationType: {
                not_equals: 'conditional',
              },
            }
          },
        },
        {
          name: 'parentValue',
          type: 'text',
          admin: {
            condition: (data) => data?.personalizationType === 'conditional',
            description: 'Parent value(s) that show this field (comma-separated)',
            placeholder: 'e.g., "yes" or "name_only,name_and_date"',
          },
        },

        // Common field settings
        {
          name: 'required',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Customer must fill this field',
          },
        },
        {
          name: 'helpText',
          type: 'text',
          admin: {
            description: 'Help text shown below the field',
          },
        },
      ],
    },

    // ===== PRICING =====
    {
      type: 'collapsible',
      label: 'Pricing',
      fields: [
        {
  name: 'additionalPrice',
  type: 'number',
  min: 0,
  admin: {
    description: 'Extra charge for this personalization',
    components: {
      Field: '@/collections/Products/ui/Variants/VariantSelect/columns/PriceInput#PriceInput',
    },
  },
},
        {
          name: 'pricingType',
          type: 'select',
          options: [
            { label: 'Flat Rate', value: 'flat' },
          ],
          defaultValue: 'flat',
          admin: {
            readOnly: true,
            description: 'Pricing is always a flat rate',
          },
        },
        {
          name: 'showPriceInLabel',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            condition: (data) => 
              data?.personalizationType === 'simple' && 
              data?.fieldType === 'select',
            description: 'Show price in dropdown options (e.g., "Name [+$9.50]")',
          },
        },
      ],
    },

    // ===== PRODUCT APPLICABILITY =====
    {
      type: 'collapsible',
      label: 'Product Settings',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'applicableProducts',
          type: 'relationship',
          relationTo: 'products',
          hasMany: true,
          admin: {
            description: 'Specific products (leave empty for all)',
          },
        },
        {
          name: 'applicableCategories',
          type: 'relationship',
          relationTo: 'categories',
          hasMany: true,
          admin: {
            description: 'Product categories (leave empty for all)',
          },
        },
      ],
    },

    // ===== ADVANCED VALIDATION (Hidden by default) =====
    {
      type: 'collapsible',
      label: 'Advanced Validation',
      admin: {
        initCollapsed: true,
        description: 'Optional validation rules',
      },
      fields: [
        {
          name: 'validationRules',
          type: 'group',
          fields: [
            {
              name: 'minLength',
              type: 'number',
              min: 0,
              admin: {
                condition: (data) => ['text', 'textarea'].includes(data?.fieldType),
                description: 'Minimum characters required',
              },
            },
            {
              name: 'maxLength',
              type: 'number',
              min: 0,
              admin: {
                condition: (data) => ['text', 'textarea'].includes(data?.fieldType),
                description: 'Maximum characters allowed',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'pattern',
                  type: 'text',
                  admin: {
                    description: 'Regex pattern (advanced)',
                    placeholder: '^[A-Za-z]+$',
                    width: '50%',
                  },
                },
                {
                  name: 'patternMessage',
                  type: 'text',
                  admin: {
                    description: 'Error message',
                    placeholder: 'Only letters allowed',
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}