const redirects = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header',
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // Leftover e-commerce scaffolding from the Payload template. These routes
  // still return 200 and render half-built pages (the store locator says
  // "Google Maps integration coming soon"), which is placeholder content on a
  // cleaning company's domain.
  //
  // Nothing on the live site links to them and they are not in the sitemap, so
  // the exposure is small. Redirecting rather than deleting because the code may
  // be wanted later: the pages stay in the repo, they just stop serving.
  //
  // `permanent: false` (307) on purpose. A 308 would get cached by browsers and
  // search engines, which is hard to undo if these are ever brought back.
  const templateLeftovers = ['/shop', '/find-stores'].map((source) => ({
    source,
    destination: '/',
    permanent: false,
  }))

  // `/home` and `/` render the SAME Pages document — app/(app)/page.tsx renders
  // it by defaulting the slug, so both URLs were live. Only `/` was ever purged
  // (revalidatePage calls revalidatePath('/')), which left `/home` serving
  // whatever render was cached when it was last hit. Measured at 12.2 days old
  // (Age: 1053730, X-Vercel-Cache: HIT) while `/` was 1.2 hours — which is why
  // it was still advertising services that had been removed from the site.
  //
  // Fixing the nav link alone would not have been enough: the URL stays
  // reachable from bookmarks, old emails and anything Google has indexed, and it
  // would go on serving a stale page indefinitely. The duplicate has to stop
  // existing.
  //
  // `permanent: true` (308) on purpose, unlike the template leftovers below.
  // This is not a maybe-restore-later route — `/home` should never be a URL on
  // this site, and a 308 also collapses the duplicate-content split in search.
  const homeDuplicate = {
    source: '/home',
    destination: '/',
    permanent: true,
  }

  const redirects = [internetExplorerRedirect, homeDuplicate, ...templateLeftovers]

  return redirects
}

export default redirects
