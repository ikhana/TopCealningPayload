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

type Entry = MetadataRoute.Sitemap[number]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Service pages. Their copy lives in code (src/data/serviceContent.ts), so no
  // per-page modified date exists, and `lastModified` is OMITTED rather than
  // invented. It used to be `new Date()` on every route, which claims every page
  // changed this very hour on every crawl. Google only trusts lastmod when it has
  // proven accurate, so a value that is always "now" teaches it to ignore the
  // field on the pages where it would actually be true.
  const serviceRoutes: Entry[] = listServiceSlugs().map((slug) => ({
    url: `${SITE_URL}/services/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // Used only if the database is unreachable (e.g. at build time), so the sitemap
  // is still useful rather than a 500. In the normal path these come from the CMS.
  const fallbackRoutes: Entry[] = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/booking`, changeFrequency: 'monthly', priority: 0.9 },
  ]

  let cmsRoutes: Entry[] = []
  let cmsLoaded = false

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

    const pageRoutes: Entry[] = (pages.docs ?? [])
      .filter((doc: { slug?: string | null }) => Boolean(doc.slug))
      .map((doc: { slug?: string | null; updatedAt?: string | null }) => {
        const isHome = doc.slug === 'home'
        return {
          // The home document is served at the root, never at /home (which now
          // 308s to /). Listing /home would submit a URL that redirects.
          url: isHome ? `${SITE_URL}/` : `${SITE_URL}/${doc.slug}`,
          lastModified: doc.updatedAt ? new Date(doc.updatedAt) : undefined,
          changeFrequency: isHome ? ('weekly' as const) : ('monthly' as const),
          priority: isHome ? 1 : doc.slug === 'booking' ? 0.9 : 0.7,
        }
      })

    const postRoutes: Entry[] = (posts.docs ?? [])
      .filter((doc: { slug?: string | null }) => Boolean(doc.slug))
      .map((doc: { slug?: string | null; updatedAt?: string | null }) => ({
        url: `${SITE_URL}/blog/${doc.slug}`,
        lastModified: doc.updatedAt ? new Date(doc.updatedAt) : undefined,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }))

    // The blog index only goes in once there is something on it. With no
    // published posts it is a near-empty page titled "Blog | TopCleaning" with no
    // canonical, which is exactly the "thin page" a sitemap should not volunteer.
    // It appears automatically with the first post.
    const blogIndex: Entry[] =
      postRoutes.length > 0 ? [{ url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.6 }] : []

    cmsRoutes = [...pageRoutes, ...blogIndex, ...postRoutes]
    cmsLoaded = true
  } catch (error) {
    console.error('[sitemap] Could not load CMS routes', error)
  }

  // De-duplicate by URL, first wins. /booking used to appear twice, once from a
  // hand-written static list and once from the CMS, because both were added.
  const merged = [...(cmsLoaded ? [] : fallbackRoutes), ...cmsRoutes, ...serviceRoutes]
  const seen = new Set<string>()
  return merged.filter((e) => (seen.has(e.url) ? false : (seen.add(e.url), true)))
}
