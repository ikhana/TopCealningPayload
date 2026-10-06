// src/app/(frontend)/[slug]/page.tsx
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { RenderHero } from '@/heros/RenderHero'
import { SERVICES, listServiceSlugs } from '@/data/serviceContent'
import { generateMeta } from '@/utilities/generateMeta'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const pages = await payload.find({
      collection: 'pages',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    })

    const params = pages.docs
      ?.filter((doc) => {
        return doc.slug !== 'home'
      })
      .map(({ slug }) => {
        return { slug }
      })

    return params
  } catch (error) {
    console.error('generateStaticParams: could not reach database', error)
    return []
  }
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

// Same fallback as the service pages: the canonical production host (www).
const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.topcleaningteam.com'

// The /services hub is a CMS page, so it has no template of its own. This describes it to
// crawlers as what it is: a list of the individual service pages. The list comes from the
// same SERVICES object the service pages render from, so a new service appears here without
// a second edit. Names come from `service.name`, never the marketing title.
function buildServicesHubJsonLd(page: { meta?: { title?: string | null; description?: string | null } | null }) {
  const url = `${SITE_URL}/services`
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${url}#page`,
      url,
      name: 'Cleaning Services in Broward County, FL',
      ...(page.meta?.description ? { description: page.meta.description } : {}),
      isPartOf: { '@type': 'WebSite', url: SITE_URL, name: 'Top Cleaning Team' },
      about: { '@type': 'LocalBusiness', '@id': `${SITE_URL}/#business` },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: listServiceSlugs().map((slug, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: SERVICES[slug].name,
          url: `${SITE_URL}/services/${slug}`,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Services', item: url },
      ],
    },
  ]
}

export default async function Page({ params }: Args) {
  const { slug = 'home' } = await params
  const url = '/' + slug

  const page = await queryPageBySlug({
    slug,
  })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article>
      {slug === 'services' &&
        buildServicesHubJsonLd(page).map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      {/* Hero has its own spacing */}
      <RenderHero {...hero} />

      {/* Blocks handle their own spacing, first block gets top padding for header */}
      <div className="first:pt-20 lg:first:pt-24">
        <RenderBlocks blocks={layout} />
      </div>
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug = 'home' } = await params

  const page = await queryPageBySlug({
    slug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = async ({ slug }: { slug: string }) => {
  try {
    const { isEnabled: isDraftMode } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'pages',
      draft: isDraftMode,
      limit: 1,
      overrideAccess: isDraftMode,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return result.docs?.[0] || null
  } catch (error) {
    console.error(`queryPageBySlug(${slug}): database error`, error)
    return null
  }
}
