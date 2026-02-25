import type { User } from '@/payload-types'
import type { CollectionConfig } from 'payload'

import { admins } from '@/access/admins'
import { adminsAndUser } from '@/access/adminsAndUser'
import { anyone } from '@/access/anyone'
import { checkRole } from '@/access/checkRole'

import { customerProxy } from './endpoints/customer'
import { createStripeCustomer } from './hooks/createStripeCustomer'
import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req: { user } }) => checkRole(['admin'], user),
    create: anyone,
    delete: admins,
    read: adminsAndUser,
    update: adminsAndUser,
  },
  admin: {
    defaultColumns: ['name', 'email', 'roles', 'postCount'],
    useAsTitle: 'name',
    group: 'Admin', // Groups it with other admin collections
  },
  auth: {
    forgotPassword: {
      generateEmailHTML: (args) => {
        const req = args?.req
        const token = args?.token
        const user = req?.user

        // Use the token provided to allow your user to reset their password
        const resetPasswordURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password?token=${token}`
        const email = (user as User).email
        return `
          <!doctype html>
          <html>
            <body>
              <h1>Here is my custom email template!</h1>
              <p>Hello, ${email}!</p>
              <p>Click below to reset your password.</p>
              <p>
                <a href="${resetPasswordURL}">${resetPasswordURL}</a>
              </p>
            </body>
          </html>
        `
      },
    },
    tokenExpiration: 1209600,
  },
  endpoints: [
    {
      handler: customerProxy,
      method: 'get',
      path: '/:teamID/customer',
    },
    {
      handler: customerProxy,
      method: 'patch',
      path: '/:teamID/customer',
    },
  ],
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      access: {
        /* create: admins, */
        read: admins,
        update: admins,
      },
      defaultValue: ['customer'],
      hasMany: true,
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Blog Author',
          value: 'author',
        },
        {
          label: 'Customer',
          value: 'customer',
        },
      ],
      admin: {
        description: 'Admin can manage everything, Authors can write blog posts, Customers can shop',
      },
    },
    {
      name: 'orders',
      type: 'join',
      collection: 'orders',
      on: 'orderedBy',
      admin: {
        allowCreate: false,
        defaultColumns: ['id', 'createdAt', 'total', 'currency', 'items'],
      },
    },
    {
      name: 'stripeCustomerID',
      type: 'text',
      access: {
        /* create: admins, */
        read: admins,
        update: admins,
      },
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      label: 'Stripe Customer',
    },
    {
      name: 'cart',
      type: 'group',
      fields: [
        {
          name: 'items',
          type: 'array',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'product',
                  type: 'relationship',
                  relationTo: 'products',
                },
                {
                  name: 'variantID',
                  type: 'text',
                },
                {
                  name: 'variant',
                  type: 'text',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'unitPrice',
                  type: 'number',
                  required: true,
                },
                {
                  name: 'quantity',
                  type: 'number',
                  admin: {
                    step: 1,
                  },
                  required: true,
                  min: 0,
                },
              ],
            },
            {
              name: 'url',
              type: 'text',
            },
          ],
          interfaceName: 'CartItems',
          label: 'Items',
        },
      ],
      label: 'Cart',
    },
    // Author Profile Fields - Added here
    {
      type: 'collapsible',
      label: 'Author Profile',
      admin: {
        condition: ({ roles }) => roles?.includes('admin') || roles?.includes('author'),
      },
      fields: [
        {
          name: 'authorProfile',
          type: 'group',
          label: 'Author Information',
          fields: [
            {
              name: 'displayName',
              type: 'text',
              label: 'Author Display Name',
              admin: {
                description: 'Public name shown on blog posts (defaults to user name)',
                placeholder: 'John Doe',
              },
            },
            {
              name: 'bio',
              type: 'textarea',
              label: 'Author Bio',
              maxLength: 500,
              admin: {
                description: 'Brief biography shown on author pages and blog posts',
                placeholder: 'Passionate about bourbon heritage and traditional craftsmanship...',
                rows: 4,
              },
            },
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
              label: 'Profile Photo',
              admin: {
                description: 'Author profile picture (recommended: 400x400px)',
              },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Job Title',
              admin: {
                description: 'e.g., "Master Craftsman", "Head of Heritage"',
                placeholder: 'Master Craftsman',
              },
            },
            {
              name: 'expertise',
              type: 'array',
              label: 'Areas of Expertise',
              maxRows: 5,
              fields: [
                {
                  name: 'area',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'e.g., Barrel Aging, Wood Selection',
                  },
                },
              ],
              admin: {
                description: 'List your areas of expertise',
              },
            },
          ],
        },
        {
          name: 'socialLinks',
          type: 'group',
          label: 'Social Media Links',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'website',
                  type: 'text',
                  label: 'Personal Website',
                  admin: {
                    placeholder: 'https://example.com',
                  },
                },
                {
                  name: 'linkedin',
                  type: 'text',
                  label: 'LinkedIn',
                  admin: {
                    placeholder: 'https://linkedin.com/in/username',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'twitter',
                  type: 'text',
                  label: 'X (Twitter)',
                  admin: {
                    placeholder: '@username',
                  },
                  hooks: {
                    beforeValidate: [
                      ({ value }) => {
                        if (value && !value.startsWith('@') && !value.startsWith('http')) {
                          return `@${value}`;
                        }
                        return value;
                      },
                    ],
                  },
                },
                {
                  name: 'instagram',
                  type: 'text',
                  label: 'Instagram',
                  admin: {
                    placeholder: '@username',
                  },
                  hooks: {
                    beforeValidate: [
                      ({ value }) => {
                        if (value && !value.startsWith('@') && !value.startsWith('http')) {
                          return `@${value}`;
                        }
                        return value;
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'authorSettings',
          type: 'group',
          label: 'Author Settings',
          fields: [
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              label: 'Featured Author',
              admin: {
                description: 'Show this author prominently on the blog',
              },
            },
            {
              name: 'allowEmail',
              type: 'checkbox',
              defaultValue: false,
              label: 'Show Contact Email',
              admin: {
                description: 'Display email publicly on author page',
              },
            },
          ],
        },
      ],
    },
    // Virtual field for author post count
    {
      name: 'postCount',
      type: 'number',
      virtual: true,
      admin: {
        description: 'Total number of published blog posts',
        readOnly: true,
        condition: ({ roles }) => roles?.includes('admin') || roles?.includes('author'),
      },
      hooks: {
        afterRead: [
          async ({ req: { payload }, siblingData }) => {
            if (!siblingData.id) return 0;
            
            try {
              const posts = await payload.count({
                collection: 'blog-posts',
                where: {
                  author: {
                    equals: siblingData.id,
                  },
                  _status: {
                    equals: 'published',
                  },
                },
              });
              return posts.totalDocs;
            } catch (err) {
              console.error('Error counting author posts:', err);
              return 0;
            }
          },
        ],
      },
    },
    {
      name: 'skipSync',
      type: 'checkbox',
      admin: {
        hidden: true,
        position: 'sidebar',
        readOnly: true,
      },
      label: 'Skip Sync',
    },
  ],
  hooks: {
    beforeChange: [createStripeCustomer],
  },
  timestamps: true,
}