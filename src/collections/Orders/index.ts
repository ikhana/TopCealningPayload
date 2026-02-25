// src/collections/Orders/index.ts
import type { CollectionConfig } from 'payload'

import { admins } from '@/access/admins'
import { adminsOrLoggedIn } from '@/access/adminsOrLoggedIn'
import { adminsOrOrderedByOrPaymentId } from '@/access/adminsOrOrderedByOrPaymentId'
import { clearUserCart } from './hooks/clearUserCart'
import { populateOrderedBy } from './hooks/populateOrderedBy'

export const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    create: adminsOrLoggedIn,
    delete: admins,
    read: adminsOrOrderedByOrPaymentId,
    update: admins,
  },
  admin: {
       hidden: true,
    defaultColumns: ['createdAt', 'orderedBy', 'total', 'status'],
    preview: (doc) => `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/orders/${doc.id}`,
    useAsTitle: 'createdAt',
  },
  fields: [
    {
      name: 'orderedBy',
      type: 'relationship',
      hooks: {
        beforeChange: [populateOrderedBy],
      },
      relationTo: 'users',
    },
    {
      name: 'stripePaymentIntentID',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      label: 'Stripe Payment Intent ID',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'total',
          type: 'number',
          min: 0,
          required: true,
        },
        {
          name: 'currency',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'product',
              type: 'relationship',
              relationTo: 'products',
              required: true,
            },
            {
              name: 'variant',
              type: 'text',
              admin: {
                description: 'Variant ID if product has variants',
              },
            },
          ],
        },
        {
          name: 'quantity',
          type: 'number',
          min: 1,
          required: true,
          defaultValue: 1,
        },
        {
          name: 'unitPrice',
          type: 'number',
          min: 0,
          required: true,
          admin: {
            description: 'Price per unit at time of order',
          },
        },
        {
          name: 'selectedComponents',
          type: 'array',
          admin: {
            description: 'Component selections for customizable products',
            condition: (data, siblingData) => {
              // Only show if the product has component customization
              return siblingData?.product?.enableComponentCustomization
            },
          },
          fields: [
            {
              name: 'component',
              type: 'relationship',
              relationTo: 'product-components',
              required: true,
            },
            {
              name: 'selectedOption',
              type: 'group',
              fields: [
                {
                  name: 'optionSlug',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'optionTitle',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'priceModifier',
                  type: 'number',
                  defaultValue: 0,
                },
              ],
            },
          ],
        },
        {
          name: 'addOns',
          type: 'array',
          admin: {
            description: 'Selected add-ons for this item',
          },
          fields: [
            {
              name: 'addOn',
              type: 'relationship',
              relationTo: 'addons',
              required: true,
            },
            {
              name: 'quantity',
              type: 'number',
              min: 1,
              defaultValue: 1,
              required: true,
            },
            {
              name: 'price',
              type: 'number',
              min: 0,
              required: true,
              admin: {
                description: 'Add-on price at time of order',
              },
            },
          ],
        },
        {
          name: 'personalization',
          type: 'array',
          admin: {
            description: 'Personalization data for this item',
          },
          fields: [
            {
              name: 'option',
              type: 'relationship',
              relationTo: 'personalization-options',
              required: true,
            },
            {
              name: 'value',
              type: 'json',
              required: true,
              admin: {
                description: 'The personalization value (text, date, color, etc.)',
              },
            },
            {
              name: 'additionalPrice',
              type: 'number',
              defaultValue: 0,
              admin: {
                description: 'Additional cost for this personalization',
              },
            },
          ],
        },
        {
          name: 'customPersonalization',
          type: 'array',
          admin: {
            description: 'Custom personalization fields added by customer',
            condition: (data, siblingData) => {
              // Only show if product allows custom personalization
              return siblingData?.product?.allowCustomPersonalization
            },
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'value',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'itemTotal',
          type: 'number',
          min: 0,
          required: true,
          admin: {
            description: 'Total price for this line item including all options',
            readOnly: true,
          },
          hooks: {
            beforeChange: [
              ({ data, siblingData }) => {
                // Calculate item total including all modifiers
                let total = (siblingData?.unitPrice || 0) * (siblingData?.quantity || 1)
                
                // Add component price modifiers
                if (siblingData?.selectedComponents?.length) {
                  siblingData.selectedComponents.forEach(comp => {
                    total += (comp.selectedOption?.priceModifier || 0) * (siblingData?.quantity || 1)
                  })
                }
                
                // Add add-on prices
                if (siblingData?.addOns?.length) {
                  siblingData.addOns.forEach(addOn => {
                    total += (addOn.price || 0) * (addOn.quantity || 1)
                  })
                }
                
                // Add personalization prices
                if (siblingData?.personalization?.length) {
                  siblingData.personalization.forEach(pers => {
                    total += (pers.additionalPrice || 0) * (siblingData?.quantity || 1)
                  })
                }
                
                return total
              },
            ],
          },
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      min: 0,
      admin: {
        position: 'sidebar',
        description: 'Order subtotal before discounts/shipping',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            // Calculate subtotal from all items
            if (data?.items?.length) {
              return data.items.reduce((sum, item) => sum + (item.itemTotal || 0), 0)
            }
            return 0
          },
        ],
      },
    },
    {
      type: 'select',
      name: 'status',
      defaultValue: 'processing',
      required: true,
      options: [
        {
          label: 'Pending Payment',
          value: 'pending',
        },
        {
          label: 'Processing',
          value: 'processing',
        },
        {
          label: 'Shipped',
          value: 'shipped',
        },
        {
          label: 'Delivered',
          value: 'delivered',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
        {
          label: 'Refunded',
          value: 'refunded',
        },
      ],
      admin: {
        position: 'sidebar',
      },
      interfaceName: 'OrderStatus',
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this order',
      },
    },
    {
      name: 'customerNotes',
      type: 'textarea',
      admin: {
        description: 'Notes from customer during checkout',
      },
    },
  ],
  hooks: {
    afterChange: [clearUserCart],
    beforeValidate: [
      async ({ data, req }) => {
        // Validate that all required add-ons are included
        if (data?.items?.length) {
          const { payload } = req
          
          for (const item of data.items) {
            if (typeof item.product === 'string') {
              const product = await payload.findByID({
                collection: 'products',
                id: item.product,
                depth: 0,
              })
              
              if (product?.requiredAddOns?.length) {
                const requiredAddOnIds = product.requiredAddOns.map(id => 
                  typeof id === 'string' ? id : id
                )
                
                const selectedAddOnIds = item.addOns?.map(a => 
                  typeof a.addOn === 'string' ? a.addOn : a.addOn?.id
                ) || []
                
                const missingRequired = requiredAddOnIds.filter(id => 
                  !selectedAddOnIds.includes(id)
                )
                
                if (missingRequired.length > 0) {
                  throw new Error(`Missing required add-ons for ${product.title}`)
                }
              }
            }
          }
        }
        
        return data
      },
    ],
  },
  timestamps: true,
}