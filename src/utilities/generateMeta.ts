// src/utilities/generateMeta.ts

import type { Metadata } from 'next'
import type { BlogPost, Page, Product } from '../payload-types'
import { mergeOpenGraph } from './mergeOpenGraph'

// Canonical host. Must match the redirect target: the apex 308s to www, so www
// is canonical. A canonical pointing at the apex would name a URL that never
// serves a 200.
const SITE_URL = (
  process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.topcleaningteam.com'
).replace(/\/+$/, '')

export const generateMeta = async (args: {
  doc: Page | Product | BlogPost
  // Collections live under different path prefixes: pages at /{slug}, blog posts
  // at /blog/{slug}. Without this the blog canonical would claim /{slug}, which
  // 404s — and a canonical pointing at a 404 is worse than no canonical at all,
  // because it actively de-indexes the real page.
  pathPrefix?: string
}): Promise<Metadata> => {
  const { doc, pathPrefix = '' } = args || {}

  const ogImage =
    typeof doc?.meta?.image === 'object' &&
    doc.meta.image !== null &&
    'url' in doc.meta.image &&
    `${process.env.NEXT_PUBLIC_SERVER_URL}${doc.meta.image.url}`

  // `slug` is a string on every collection here. The previous code tested
  // Array.isArray(doc.slug), which is never true, so every Payload-driven page
  // shipped og:url="/" — relative, and identical across the whole site.
  const rawSlug = Array.isArray(doc?.slug) ? doc.slug.join('/') : (doc?.slug ?? '')
  // Only the top-level page named "home" collapses to "/". A blog post that
  // happened to be slugged "home" lives at /blog/home, not at the root.
  const isRoot = !rawSlug || (rawSlug === 'home' && !pathPrefix)
  const path = isRoot ? '/' : `${pathPrefix}/${rawSlug}`
  const url = `${SITE_URL}${path}`

  return {
    description: doc?.meta?.description ?? 'TopCleaning offers professional residential and commercial cleaning services — trusted, eco-friendly, and tailored to your home.',
    alternates: { canonical: url },
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description ?? 'TopCleaning offers professional residential and commercial cleaning services — trusted, eco-friendly, and tailored to your home.',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title: doc?.meta?.title ?? 'TopCleaning | Professional Cleaning Services',
      url,
    }),
    title: doc?.meta?.title ?? 'TopCleaning | Professional Cleaning Services',
  }
}