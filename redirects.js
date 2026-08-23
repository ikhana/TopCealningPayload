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

  const redirects = [internetExplorerRedirect, ...templateLeftovers]

  return redirects
}

export default redirects
