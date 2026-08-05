// src/app/robots.ts
// Must live at the app ROOT, not inside the (app) route group. With two root
// groups ((app) and (payload)) a metadata route inside a group does not
// resolve, so /robots.txt was being swallowed by the [slug] catch-all and 404ing.
//
// Canonical host is www (Vercel redirects the apex to www), so the URLs here
// match the canonical tags the pages emit.

import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.topcleaningteam.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep crawlers out of admin, API and authenticated customer areas.
        // With no robots file at all these were crawlable by default.
        disallow: [
          '/admin',
          '/api/',
          '/account',
          '/checkout',
          '/cart',
          '/orders',
          '/login',
          '/logout',
          '/create-account',
          '/recover-password',
          '/reset-password',
          '/search',
          '/next/',
        ],
      },
    ],
    host: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
