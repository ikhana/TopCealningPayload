import type { CollectionConfig } from 'payload'

import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { admins } from '@/access/admins'
import { adminsOrPublished } from '@/access/adminsOrPublished'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Content } from '@/blocks/Content/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { slugField } from '@/fields/slug'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { calculateTotalPrice } from './hooks/calculateTotalPrice'
import { deleteProductFromCarts } from './hooks/deleteProductFromCarts'
import { manualStripeSync } from './hooks/manualStripeSync'
import { revalidateProduct } from './hooks/revalidateProduct'
import { validateComponentConfiguration } from './hooks/validateComponents'
import { validatePersonalization } from './hooks/validatePersonalization'
import {
  manageSaleActive
} from './hooks/validateSalePrice'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: admins,
    delete: admins,
    read: adminsOrPublished,
    update: admins,
  },
  admin: {
       hidden: true,
    defaultColumns: ['title', 'price', 'stock', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const slug = typeof data?.slug === 'string' ? data.slug : ''
        const path = `/products/${slug}`
        
        return `${process.env.NEXT_PUBLIC_SERVER_URL}${generatePreviewPath({
          path,
          collection: 'products',
          slug,
        })}`
      },
    },
    preview: (doc) => {
      const slug = typeof doc?.slug === 'string' ? doc.slug : ''
      const path = `/products/${slug}`
      
      return generatePreviewPath({
        path,
        collection: 'products',
        slug,
      })
    },
    useAsTitle: 'title',
  },
  defaultPopulate: {
    title: true,
    slug: true,
    variantOptions: true,
    variants: true,
    enableVariants: true,
    gallery: true,
    price: true,
    stock: true,
    meta: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'searchableDescription',
      type: 'text',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeChange: [
          ({ data, originalDoc }) => {
            if (data?.description?.root?.children) {
              const extractText = (node: any): string => {
                if (node.type === 'text') return node.text || '';
                if (node.children) {
                  return node.children.map(extractText).join(' ');
                }
                return '';
              };
              return extractText(data.description.root);
            }
            return originalDoc?.searchableDescription || '';
          },
        ],
      },
    },
    {
      name: 'publishedOn',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'stripePriceID',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'The active Stripe Price ID for this product',
      },
      label: 'Stripe Price ID',
    },
    {
      name: 'calculatedTotalPrice',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Calculated price including all options',
        components: {
          Field: '@/collections/Products/ui/PriceDisplay#PriceDisplay',
        },
      },
      hooks: {
        beforeChange: [calculateTotalPrice],
      },
    },
    {
      name: 'selectedAddOns',
      type: 'json',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'selectedPersonalizations',
      type: 'json',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'personalizationValues',
      type: 'json',
      admin: {
        hidden: true,
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: false,
              required: false,
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              required: true,
              hasMany: true,
            },
            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, Content, MediaBlock],
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            {
              name: 'enableVariants',
              type: 'checkbox',
            },
            {
              name: 'variantOptions',
              type: 'array',
              admin: {
                condition: (data) => Boolean(data.enableVariants),
                components: {
                  RowLabel: '@/collections/Products/ui/RowLabels/KeyLabel#KeyLabel',
                  Field: '@/collections/Products/ui/Variants/VariantOptions#VariantOptions',
                },
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'options',
                  type: 'array',
                  admin: {
                    components: {
                      RowLabel: '@/collections/Products/ui/RowLabels/OptionLabel#OptionLabel',
                    },
                    initCollapsed: true,
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'slug',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'group',
                      type: 'text',
                    },
                  ],
                },
              ],
              label: 'Variant options',
              required: true,
              minRows: 1,
            },
            {
              name: 'variants',
              type: 'array',
              admin: {
                components: {
                  RowLabel: '@/collections/Products/ui/RowLabels/VariantLabel#VariantLabel',
                  Field: '@/collections/Products/ui/Variants/VariantSelect#VariantSelect',
                },
                condition: (data, siblingData) => {
                  return Boolean(siblingData?.variantOptions?.length)
                },
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'checkbox',
                  name: 'active',
                  defaultValue: true,
                },
                {
                  name: 'options',
                  type: 'array',
                  fields: [
                    {
                      name: 'value',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'slug',
                      type: 'text',
                      required: true,
                    },
                  ],
                  required: true,
                },
                {
                  name: 'price',
                  type: 'number',
                  required: true,
                  admin: {
                    components: {
                      Cell: '@/collections/Products/ui/Columns/PriceColumn#PriceColumn',
                    },
                  },
                },
    {
  name: 'salePrice',
  type: 'number',
  validate: (value, { siblingData }) => {
    if (!value) return true
    
    const regularPrice = (siblingData as any)?.price || 0
    
    if (value >= regularPrice) {
      return `Variant sale price must be less than regular price ($${(regularPrice / 100).toFixed(2)})`
    }
    
    return true
  },
  admin: {
    description: 'Variant sale price',
    components: {
      Field: '@/collections/Products/ui/Fields/ValidatedPriceInput#ValidatedPriceInput',
    },
  },
},

                {
                  name: 'saleActive',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Enable sale for this variant',
                  },
                },
                {
                  name: 'stock',
                  type: 'number',
                  admin: {
                    description:
                      'Define stock for this variant. A stock of 0 disables checkout for this variant.',
                    width: '50%',
                  },
                  defaultValue: 0,
                  required: true,
                },
                {
                  name: 'stripePriceID',
                  type: 'text',
                  admin: {
                    readOnly: true,
                    description: 'Stripe Price ID for this variant',
                  },
                },
              ],
              labels: {
                plural: 'Variants',
                singular: 'Variant',
              },
              required: true,
              minRows: 1,
            },
            {
              name: 'stock',
              type: 'number',
              admin: {
                condition: (data) => !data.enableVariants,
                description:
                  'Define stock for this product. A stock of 0 disables checkout for this product.',
              },
              defaultValue: 0,
              required: true,
            },
            {
              name: 'price',
              type: 'number',
              required: true,
              admin: {
                condition: (data) => !data.enableVariants,
                components: {
                  Field: '@/collections/Products/ui/Variants/VariantSelect/columns/PriceInput#PriceInput',
                  Cell: '@/collections/Products/ui/Columns/PriceColumn#PriceColumn',
                },
                description: 'Product price',
              },
            },
            {
              type: 'group',
              name: 'saleConfiguration',
              label: false,
              admin: {
                condition: (data) => !data.enableVariants,
                style: {
                  marginTop: '20px',
                },
              },
              fields: [
                {
                  name: 'saleActive',
                  type: 'checkbox',
                  defaultValue: false,
                  hooks: {
                    beforeChange: [manageSaleActive],
                  },
                  admin: {
                    description: 'Enable sale pricing for this product',
                  },
                },
              {
  name: 'salePrice',
  type: 'number',
  validate: (value, { siblingData, data }) => {
    if (!value) return true
    
    const regularPrice = (siblingData as any)?.price || (data as any)?.price || 0
    
    if (regularPrice === 0) return true
    
    if (value >= regularPrice) {
      return `Sale price ($${(value / 100).toFixed(2)}) must be less than regular price ($${(regularPrice / 100).toFixed(2)})`
    }
    
    return true
  },
  admin: {
    condition: (data, siblingData) => siblingData?.saleActive,
    components: {
      Field: '@/collections/Products/ui/Fields/ValidatedPriceInput#ValidatedPriceInput',
    },
    description: 'Sale price (must be lower than regular price)',
  },
},
                {
                  type: 'row',
                  admin: {
                    condition: (data, siblingData) => siblingData?.saleActive,
                  },
                  fields: [
                    {
                      name: 'saleStartDate',
                      type: 'date',
                      admin: {
                        description: 'When the sale starts (optional)',
                        date: {
                          pickerAppearance: 'dayAndTime',
                        },
                        width: '50%',
                      },
                    },
                  {
  name: 'saleEndDate',
  type: 'date',
  validate: (value, { siblingData }) => {
    if (!value) return true
    
    const saleStartDate = (siblingData as any)?.saleStartDate
    
    if (saleStartDate) {
      const startDate = new Date(saleStartDate)
      const endDate = new Date(value)
      
      if (endDate <= startDate) {
        return 'Sale end date must be after start date'
      }
    }
    
    return true
  },
  admin: {
    description: 'When the sale ends (optional)',
    date: {
      pickerAppearance: 'dayAndTime',
    },
    width: '50%',
  },
},
                  ],
                },
              ],
            },
            {
              name: 'relatedProducts',
              type: 'relationship',
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
              hasMany: true,
              relationTo: 'products',
            },
          ],
          label: 'Product Details',
        },
        {
          fields: [
            {
              name: 'availableAddOns',
              type: 'relationship',
              relationTo: 'addons',
              hasMany: true,
              admin: {
                description: 'Add-on products that can be purchased with this item',
              },
            },
            {
              name: 'requiredAddOns',
              type: 'relationship',
              relationTo: 'addons',
              hasMany: true,
              admin: {
                description: 'Add-ons that must be selected when purchasing this product',
              },
            },
            {
              name: 'personalizationOptions',
              type: 'relationship',
              relationTo: 'personalization-options',
              hasMany: true,
              admin: {
                description: 'Personalization options available for this product',
              },
            },
            {
              name: 'allowCustomPersonalization',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Allow customers to add their own personalization fields',
              },
            },
            {
              name: 'maxPersonalizationFields',
              type: 'number',
              defaultValue: 5,
              min: 1,
              max: 10,
              admin: {
                condition: (data) => Boolean(data?.allowCustomPersonalization),
                description: 'Maximum number of custom personalization fields allowed',
              },
            },
          ],
          label: 'Add-ons & Personalization',
        },
        {
          label: 'Component Configuration',
          fields: [
            {
              name: 'enableComponentCustomization',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Allow customers to customize individual components of this product',
              },
            },
            {
              name: 'componentConfig',
              type: 'group',
              label: 'Component Configuration',
              admin: {
                condition: (data) => Boolean(data?.enableComponentCustomization),
                description: 'Configure which components make up this product',
              },
              fields: [
                {
                  name: 'components',
                  type: 'relationship',
                  relationTo: 'product-components',
                  hasMany: true,
                  admin: {
                    description: 'Components that can be customized for this product',
                  },
                },
                {
                  name: 'componentGroups',
                  type: 'array',
                  fields: [
                    {
                      name: 'groupName',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Name for this group of components (e.g., "Base Options", "Accessories")',
                      },
                    },
                    {
                      name: 'groupSlug',
                      type: 'text',
                      required: true,
                      hooks: {
                        beforeValidate: [
                          ({ value }) => {
                            if (typeof value === 'string') {
                              return value
                                .toLowerCase()
                                .replace(/\s+/g, '-')
                                .replace(/[^\w-]+/g, '')
                            }
                            return value
                          },
                        ],
                      },
                    },
                    {
                      name: 'components',
                      type: 'relationship',
                      relationTo: 'product-components',
                      hasMany: true,
                      admin: {
                        description: 'Components in this group',
                      },
                    },
                    {
                      name: 'displayOrder',
                      type: 'number',
                      defaultValue: 0,
                      admin: {
                        description: 'Order of this group in the UI',
                      },
                    },
                  ],
                  admin: {
                    description: 'Group components for better organization in the UI',
                  },
                },
                {
                  name: 'basePrice',
                  type: 'number',
                  required: true,
                  min: 0,
                  admin: {
                    description: 'Base price before any component selections',
                    step: 1,
                    components: {
                      Field: '@/collections/Products/ui/Variants/VariantSelect/columns/PriceInput#PriceInput',
                    },
                  },
                },
                {
                  name: 'pricingStrategy',
                  type: 'select',
                  label: 'Pricing Strategy',
                  options: [
                    {
                      label: 'Additive (Base + Component Prices)',
                      value: 'additive',
                    },
                    {
                      label: 'Override (Component Sets Total Price)',
                      value: 'override',
                    },
                    {
                      label: 'Percentage (Components Add % to Base)',
                      value: 'percentage',
                    },
                  ],
                  defaultValue: 'additive',
                  admin: {
                    description: 'How component prices affect the total',
                  },
                },
              ],
            },
            {
              name: 'componentValidationRules',
              type: 'array',
              fields: [
                {
                  name: 'ruleName',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'ruleType',
                  type: 'select',
                  required: true,
                  options: [
                    {
                      label: 'Require All',
                      value: 'require_all',
                    },
                    {
                      label: 'Require One Of',
                      value: 'require_one',
                    },
                    {
                      label: 'Mutually Exclusive',
                      value: 'exclusive',
                    },
                    {
                      label: 'Conditional Requirement',
                      value: 'conditional',
                    },
                  ],
                },
                {
                  name: 'components',
                  type: 'relationship',
                  relationTo: 'product-components',
                  hasMany: true,
                  required: true,
                },
                {
                  name: 'condition',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => siblingData?.ruleType === 'conditional',
                    description: 'Condition in format: component-slug:option-slug',
                  },
                },
                {
                  name: 'errorMessage',
                  type: 'text',
                  admin: {
                    description: 'Custom error message for validation failure',
                  },
                },
              ],
              admin: {
                condition: (data) => Boolean(data?.enableComponentCustomization),
                description: 'Define validation rules for component combinations',
              },
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        sortOptions: 'title',
      },
      hasMany: true,
      relationTo: 'categories',
    },
    slugField(),
  ],
  hooks: {
    beforeChange: [
      validateComponentConfiguration,
      validatePersonalization,
    ],
    afterChange: [revalidateProduct, manualStripeSync],
    afterDelete: [deleteProductFromCarts],
  },
  versions: {
    drafts: {
      autosave: false,
    },
    maxPerDoc: 1,
  },
}