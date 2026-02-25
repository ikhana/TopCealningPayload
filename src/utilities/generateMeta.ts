// src/utilities/generateMeta.ts

import type { Metadata } from 'next'
import type { BlogPost, Page, Product } from '../payload-types'
import { mergeOpenGraph } from './mergeOpenGraph'

export const generateMeta = async (args: { doc: Page | Product | BlogPost }): Promise<Metadata> => {
  const { doc } = args || {}

  const ogImage =
    typeof doc?.meta?.image === 'object' &&
    doc.meta.image !== null &&
    'url' in doc.meta.image &&
    `${process.env.NEXT_PUBLIC_SERVER_URL}${doc.meta.image.url}`

  return {
    description: doc?.meta?.description ?? 'Strategic financial planning and wealth management solutions tailored to your goals.',
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description ?? 'Strategic financial planning and wealth management solutions tailored to your goals.',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title: doc?.meta?.title ?? 'Mazco LLC | Financial Planning & Wealth Management',
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title: doc?.meta?.title ?? 'Mazco LLC | Financial Planning & Wealth Management',
  }
}