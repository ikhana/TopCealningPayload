// src/components/LocalBusinessSchema/index.tsx
// LocalBusiness JSON-LD for the homepage.
//
// Why this matters beyond classic SEO: this is the structured record search
// engines and AI assistants use to resolve "Top Cleaning Team" as an entity,
// tying the name, phone, hours and service area together. It is the schema
// layer behind the AEO/GEO work.
//
// Deliberately NO `aggregateRating` or `review`. Marking up your own reviews on
// your own site is self-serving markup: Google will not render stars for it and
// since July 2026 it carries manual-action risk. Reviews belong on the Google
// Business Profile, and `sameAs` below is what links the two.
//
// NAP must stay identical to the Google Business Profile. If the phone or name
// changes there, change it here too.

import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Header } from '@/payload-types'

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.topcleaningteam.com'

const BUSINESS = {
  name: 'Top Cleaning Team',
  telephone: '+1-954-833-4276',
  email: 'topcleaningservicefl@gmail.com',
  priceRange: '$$',
  // Service-area business: no walk-in address, so areaServed carries the
  // geography instead of a PostalAddress.
  areaServed: [
    'Broward County, FL',
    'Miami-Dade County, FL',
    'Palm Beach County, FL',
  ],
  // Mon–Sat 7:00–18:00, closed Sunday.
  openingHours: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '07:00',
    closes: '18:00',
  },
}

// Paste the Google Business Profile URL here once available. `sameAs` is what
// tells Google the site and the GBP listing are the same entity, so the reviews
// and the website reinforce each other rather than looking like two businesses.
const GOOGLE_BUSINESS_PROFILE_URL = ''

export async function LocalBusinessSchema() {
  const header = (await getCachedGlobal('header', 1)()) as Header
  const socials = header?.socialLinks ?? {}

  const sameAs = [
    GOOGLE_BUSINESS_PROFILE_URL,
    socials.facebook,
    socials.instagram,
    socials.tiktok,
    socials.twitter,
  ].filter((v): v is string => Boolean(v && v.trim()))

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#business`,
    name: BUSINESS.name,
    url: SITE_URL,
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    priceRange: BUSINESS.priceRange,
    image: `${SITE_URL}/images/hero/herotopcleaning.jpg`,
    description:
      'Professional residential, commercial, AirBnB and post-construction cleaning across Broward, Miami-Dade and Palm Beach counties. Licensed, insured and eco-friendly.',
    areaServed: BUSINESS.areaServed.map((name) => ({
      '@type': 'AdministrativeArea',
      name,
    })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: BUSINESS.openingHours.days,
        opens: BUSINESS.openingHours.opens,
        closes: BUSINESS.openingHours.closes,
      },
    ],
    ...(sameAs.length > 0 ? { sameAs } : {}),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Cleaning Services',
      itemListElement: [
        'Residential Cleaning',
        'Deep Cleaning',
        'Move In / Move Out Cleaning',
        'Commercial Cleaning',
        'AirBnB Turnover Cleaning',
        'Post Construction Cleaning',
      ].map((service) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: service },
      })),
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
