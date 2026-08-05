// src/app/(app)/services/[slug]/page.tsx
// Static, server-rendered service pages. Each slug is built at compile time
// via generateStaticParams, so Google sees fully-formed HTML on crawl.
//
// SEO baked in:
//   • generateMetadata per slug (title, description, OG, canonical)
//   • JSON-LD: Service + BreadcrumbList + FAQPage
//   • Semantic h1 (hero) → h2 (section headings) → h3 (cards/items)
//   • Internal links to /booking + related services
//
// Layout:
//   1. AboutSplit blade   → hero (imported as a component, fed Lexical content)
//   2. TCWhatsIncluded    → service-specific checklist
//   3. TCWhyTop           → universal value props (same on every service)
//   4. Faq                → service-specific Q&A (FAQPage schema)
//   5. Bottom CTA + related services

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AboutSplitClient } from '@/blocks/AboutSplit/Component.client'
import { FaqClient } from '@/blocks/Faq/Component.client'
import { TCWhatsIncludedClient } from '@/blocks/TCWhatsIncluded/Component.client'
import { TCWhyTopSectionClient } from '@/blocks/TCWhyTop/Component.client'
import { TCButton } from '@/components/ui/TCButton'
import { TCHeadingStack } from '@/components/ui/TCHeading'
import { buildHeroLexical, buildPlainLexical } from '@/utilities/serviceLexical'

import {
  getService,
  listServiceSlugs,
  SERVICES,
  type ServiceContent,
} from '@/data/serviceContent'

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://topcleaningg.vercel.app'

// ── Static generation ─────────────────────────────────────────
export function generateStaticParams() {
  return listServiceSlugs().map((slug) => ({ slug }))
}

type Args = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return {}

  const url = `${SITE_URL}/services/${service.slug}`
  const ogImage = `${SITE_URL}${service.hero.image}`

  return {
    title: service.meta.title,
    description: service.meta.description,
    alternates: { canonical: url },
    openGraph: {
      title: service.meta.title,
      description: service.meta.description,
      url,
      type: 'website',
      images: [{ url: ogImage, alt: service.hero.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: service.meta.title,
      description: service.meta.description,
      images: [ogImage],
    },
  }
}

// ── JSON-LD builders ──────────────────────────────────────────
function buildServiceJsonLd(service: ServiceContent, canonical: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.hero.title,
    description: service.meta.description,
    serviceType: service.hero.title,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Top Cleaning Team',
      image: `${SITE_URL}/images/logo.svg`,
      url: SITE_URL,
      // NAP in structured data: keep these identical to the Google Business
      // Profile. Consistency is a local ranking signal and is what AI search
      // uses to resolve the business entity.
      telephone: '+1-954-833-4276',
      email: 'topcleaningservicefl@gmail.com',
      areaServed: [
        'Fort Lauderdale, FL',
        'Miami, FL',
        'Boca Raton, FL',
        'Pompano Beach, FL',
        'Hollywood, FL',
        'Coral Springs, FL',
        'Sunrise, FL',
      ],
      priceRange: '$$',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'South Florida',
    },
    url: canonical,
  }
}

function buildBreadcrumbJsonLd(service: ServiceContent, canonical: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
      { '@type': 'ListItem', position: 3, name: service.hero.title, item: canonical },
    ],
  }
}

function buildFaqJsonLd(service: ServiceContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faq.items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }
}

// ── Page ──────────────────────────────────────────────────────
export default async function ServicePage({ params }: Args) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  const canonical = `${SITE_URL}/services/${service.slug}`

  // Build AboutSplit-shaped props from plain service hero data
  const aboutSplitProps = {
    blockType: 'aboutSplit' as const,
    sectionId: `hero-${service.slug}`,
    content: buildHeroLexical({
      kicker: service.hero.kicker,
      title: service.hero.title,
      body: service.hero.body,
      ctaText: service.hero.ctaText,
      ctaHref: service.hero.ctaHref,
    }) as any,
    image: { url: service.hero.image, alt: service.hero.imageAlt } as any,
  }

  // Build Faq-shaped props from plain FAQ items
  const faqProps = {
    blockType: 'faq' as const,
    sectionId: `faq-${service.slug}`,
    backgroundStyle: 'default' as const,
    eyebrow: service.faq.eyebrow,
    title: service.faq.title,
    description: undefined as any,
    contactItems: [
      { label: 'Call us', value: '(954) 833 4276', link: 'tel:+19548334276' },
      { label: 'Email', value: 'topcleaningservicefl@gmail.com', link: 'mailto:topcleaningservicefl@gmail.com' },
    ],
    faqs: service.faq.items.map(({ question, answer }) => ({
      question,
      answer: buildPlainLexical(answer) as any,
    })),
    ctaHeading: 'Still have questions?',
    ctaDescription: buildPlainLexical(
      'Book a free quote and we will walk through every detail of your project before we lift a finger.',
    ) as any,
    cta: {
      link: {
        type: 'custom' as const,
        label: 'Book Your Cleaning',
        url: '/booking',
      } as any,
    },
    disclaimer: '',
  }

  return (
    <>
      {/* JSON-LD — Service + Breadcrumb + FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildServiceJsonLd(service, canonical)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbJsonLd(service, canonical)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildFaqJsonLd(service)),
        }}
      />

      <article>
        {/* 1. Hero — AboutSplit blade reused with service-specific content.
              The pt-20 lg:pt-24 spacer counteracts AboutSplit's built-in
              -mt-20 lg:-mt-24 (which tucks the blade under the preceding
              section on multi-block pages). On a service page where the
              blade is the first thing under the header, this keeps the
              hero text from being clipped by the sticky header. */}
        <div className="pt-20 lg:pt-24">
          <AboutSplitClient {...aboutSplitProps} />
        </div>

        {/* 2. What's Included — service-specific checklist */}
        <TCWhatsIncludedClient
          ghostKicker={service.whatsIncluded.ghostKicker}
          mainLine={service.whatsIncluded.mainLine}
          secondaryLine={service.whatsIncluded.secondaryLine}
          intro={service.whatsIncluded.intro}
          sections={service.whatsIncluded.sections}
        />

        {/* 3. Why Top Cleaning — universal value props */}
        <TCWhyTopSectionClient />

        {/* 4. FAQ — service-specific Q&A */}
        <FaqClient {...faqProps} />

        {/* 5. Bottom CTA + related services cross-links */}
        <ServiceCloser service={service} />
      </article>
    </>
  )
}

// ── Bottom CTA + related services ─────────────────────────────
function ServiceCloser({ service }: { service: ServiceContent }) {
  const related = service.related
    .map((relSlug) => SERVICES[relSlug as keyof typeof SERVICES])
    .filter(Boolean) as ServiceContent[]

  return (
    <section className="bg-[#f4f7f6] py-[100px] lg:py-[120px] px-[5%]">
      <div className="max-w-[1400px] mx-auto">

        {/* Big CTA card */}
        <div
          className="text-center px-[40px] py-[60px] lg:px-[80px] lg:py-[80px] bg-white border border-slate-200"
          style={{ boxShadow: '0 24px 60px -28px rgba(13,27,46,0.18)' }}
        >
          <TCHeadingStack
            ghostKicker="Ready When You Are"
            mainLine="Let&apos;s Get"
            secondaryLine="Started."
            level="h2"
            theme="light"
            size="md"
            className="mb-8 inline-block text-left"
          />
          <p className="text-[1rem] lg:text-[1.05rem] leading-[1.7] text-navy-deep/65 max-w-[560px] mx-auto mb-10">
            Free quotes, transparent pricing, and a satisfaction guarantee on every clean.
            Lock in your date in under two minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <TCButton variant="primary" href="/booking">Book Your Cleaning</TCButton>
            <TCButton variant="ghost" href="tel:+19548334276">Or call (954) 833 4276</TCButton>
          </div>
        </div>

        {/* Related services cross-links */}
        {related.length > 0 && (
          <div className="mt-16 lg:mt-20">
            <h2 className="font-mono text-teal font-bold uppercase text-[0.72rem] tracking-[2px] mb-6">
              Related Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/services/${rel.slug}`}
                  className="group block bg-white border border-slate-200 p-7 no-underline transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-22px_rgba(13,27,46,0.18)] hover:border-teal/40"
                >
                  <h3 className="text-[1.15rem] font-extrabold text-navy-deep mb-2 tracking-[-0.3px]">
                    {rel.hero.title}
                  </h3>
                  <p className="text-[0.9rem] leading-[1.5] text-navy-deep/65 mb-4">
                    {rel.meta.description.slice(0, 110)}…
                  </p>
                  <span className="inline-flex items-center gap-2 font-mono text-teal text-[0.72rem] font-bold uppercase tracking-[1.5px] group-hover:gap-3 transition-all">
                    See What&apos;s Included
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
