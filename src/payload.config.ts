import type { GenerateTitle } from '@payloadcms/plugin-seo/types'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import { Categories } from '@/collections/Categories'
import { Media } from '@/collections/Media'
import { Orders } from '@/collections/Orders'
import { Pages } from '@/collections/Pages'
import { Products } from '@/collections/Products'
import { Users } from '@/collections/Users'
import { createPaymentIntent } from '@/endpoints/create-payment-intent'
import { customersProxy } from '@/endpoints/customers'
import { productsProxy } from '@/endpoints/products'
import { Footer } from '@/globals/Footer'
import { Header } from '@/globals/Header'
import { postgresAdapter } from '@payloadcms/db-postgres'
import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  UnderlineFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { AddOns } from './collections/AddOns'
import { BlogCategories } from './collections/BlogCategories'
import { BlogPosts } from './collections/BlogPosts'
import { BlogTags } from './collections/BlogTags'
import { PersonalizationOptions } from './collections/PersonalizationOptions'
import { ProductComponents } from './collections/ProductComponents'
import { calculateProductPrice } from './endpoints/calculate-product-price'
import { plugins } from './plugins'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export type GenerateTitle2<T = unknown> = (args: {
  doc: T
  locale?: string
}) => Promise<string> | string

const generateTitle: GenerateTitle = <Page>({ doc }) => {
  return `${doc?.title ?? ''} | Mazco LLC`
}

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin#BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard#BeforeDashboard'],
    },
    user: Users.slug,
  },
  
  collections: [
    Users, 
    Products, 
    Pages, 
    Categories,
    Media, 
    Orders, 
    AddOns, 
    PersonalizationOptions, 
    ProductComponents,
    BlogPosts,
    BlogCategories,
    BlogTags
  ],
  
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  
  editor: lexicalEditor({
    features: () => {
      return [
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        LinkFeature({
          enabledCollections: ['pages'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: ({ linkType }) => linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
              },
            ]
          },
        }),
      ]
    },
  }),
  
  endpoints: [
    {
      handler: productsProxy,
      method: 'get',
      path: '/stripe/products',
    },
    {
      handler: createPaymentIntent,
      method: 'post',
      path: '/create-payment-intent',
    },
    {
      handler: customersProxy,
      method: 'get',
      path: '/stripe/customers',
    },
    {
      handler: calculateProductPrice,
      method: 'post',
      path: '/calculate-product-price',
    },
  ],
  
  globals: [Footer, Header],
  
  plugins: [
    // Use Vercel Blob in ALL environments (dev + prod)
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      // Add random suffix to prevent file conflicts
      addRandomSuffix: true,
    }),
    // Your existing plugins
    ...plugins,
  ],
  
  secret: process.env.PAYLOAD_SECRET || '',
  
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})