// src/app/sitemap.ts
// Generates /sitemap.xml. Lives at the app ROOT for the same reason as
// robots.ts: metadata routes inside a route group do not resolve when there
// are multiple root groups.
//
// Only finished, indexable pages go in here. Admin, API, account, checkout and
// search are excluded (and also disallowed in robots.ts). Submitting a sitemap
// does not force indexing, it guides discovery, so anything half-built should
// simply be left out until it ships.

import type { MetadataRoute } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { listServiceSlugs } from '@/data/serviceContent'

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.topcleaningteam.com'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Static, hand-built routes we know are live and worth indexing.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/booking`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
  ]

  // Service pages — generated from the same source as the routes themselves,
  // so this cannot drift out of sync with what actually exists.
  const serviceRoutes: MetadataRoute.Sitemap = listServiceSlugs().map((slug) => ({
    url: `${SITE_URL}/services/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  let cmsRoutes: MetadataRoute.Sitemap = []

  try {
    const payload = await getPayload({ config: configPromise })

    const [pages, posts] = await Promise.all([
      payload.find({
        collection: 'pages',
        draft: false,
        limit: 1000,
        pagination: false,
        overrideAccess: false,
        select: { slug: true, updatedAt: true },
      }),
      payload.find({
        collection: 'blog-posts',
        draft: false,
        limit: 1000,
        pagination: false,
        overrideAccess: false,
        select: { slug: true, updatedAt: true },
      }),
    ])

    const pageRoutes: MetadataRoute.Sitemap = (pages.docs ?? [])
      // 'home' is already covered by the root URL above.
      .filter((doc: { slug?: string | null }) => doc.slug && doc.slug !== 'home')
      .map((doc: { slug?: string | null; updatedAt?: string | null }) => ({
        url: `${SITE_URL}/${doc.slug}`,
        lastModified: doc.updatedAt ? new Date(doc.updatedAt) : now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))

    const postRoutes: MetadataRoute.Sitemap = (posts.docs ?? [])
      .filter((doc: { slug?: string | null }) => Boolean(doc.slug))
      .map((doc: { slug?: string | null; updatedAt?: string | null }) => ({
        url: `${SITE_URL}/blog/${doc.slug}`,
        lastModified: doc.updatedAt ? new Date(doc.updatedAt) : now,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }))

    cmsRoutes = [...pageRoutes, ...postRoutes]
  } catch (error) {
    // Never fail the sitemap because the database is unreachable at build time.
    // A sitemap with the static and service routes is far better than a 500.
    console.error('[sitemap] Could not load CMS routes', error)
  }

  return [...staticRoutes, ...serviceRoutes, ...cmsRoutes]
}
