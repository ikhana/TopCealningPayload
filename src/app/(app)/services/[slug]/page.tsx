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

// Fallback must be the canonical production host (www), never the vercel.app
// preview domain. If the env var were ever missing, a vercel.app fallback would
// emit canonicals and JSON-LD pointing at the wrong domain.
const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.topcleaningteam.com'

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
      siteName: 'Top Cleaning Team',
      locale: 'en_US',
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
    // The service's NAME, not its marketing line. These two fields used to be
    // hero.title, so Google was told the service was called "Spotless Handoff,
    // Both Directions." and was categorised as that. serviceType in particular is
    // a classification and has to read like one.
    name: service.name,
    description: service.meta.description,
    serviceType: service.name,
    // A REFERENCE to the business, not a second copy of it. The homepage
    // (LocalBusinessSchema) declares the business once under this @id; pointing at
    // the same @id from every service page is how a crawler learns that these seven
    // pages all belong to the one entity. Declaring a fresh, unlinked LocalBusiness
    // here, as this used to, describes eight businesses that happen to share a name.
    //
    // It also used to carry its own seven-city areaServed (including Miami and Boca
    // Raton, outside the Broward service area the GBP plan targets) and an SVG
    // logo, which Google does not accept as a structured-data image. Both lived in a
    // copy that disagreed with the homepage, which is the failure the comment on the
    // top-level areaServed below was written to prevent. One source now.
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#business`,
      name: 'Top Cleaning Team',
      url: SITE_URL,
      // NAP stays here as well: identical to the Google Business Profile.
      telephone: '+1-954-833-4276',
    },
    // Counties, not "South Florida". The latter is not an AdministrativeArea that
    // resolves to anything, and it disagreed with LocalBusinessSchema on the
    // homepage. Both must name the same geography or we describe two different
    // businesses to the same crawler.
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Broward County, FL' },
      { '@type': 'AdministrativeArea', name: 'Miami-Dade County, FL' },
      { '@type': 'AdministrativeArea', name: 'Palm Beach County, FL' },
    ],
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
      { '@type': 'ListItem', position: 3, name: service.name, item: canonical },
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
    // The Faq block prints `title` followed by a hard-coded "Questions", so a title
    // of "Common Questions" rendered as the heading "Common Questions Questions" on
    // every service page. Strip a trailing "Questions" here so the data can keep
    // reading naturally and the component's suffix is not doubled.
    title: service.faq.title.replace(/\s*questions\s*$/i, '').trim() || 'Common',
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

        {/* Visible breadcrumb. The BreadcrumbList JSON-LD above describes a trail that
            was never shown on the page; markup is meant to reflect what visitors can
            actually see, so this is the visible half of the same three names. A slim
            strip below the hero rather than above it, so the full-bleed hero keeps its
            design. */}
        <nav
          aria-label="Breadcrumb"
          className="bg-white border-b border-slate-100 px-[5%] py-3"
        >
          <ol className="max-w-[1400px] mx-auto flex flex-wrap items-center gap-2 font-mono text-[0.72rem] text-navy-deep/60 list-none m-0 p-0">
            <li>
              <Link href="/" className="no-underline text-teal hover:underline">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/services" className="no-underline text-teal hover:underline">Services</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-navy-deep/80 font-bold">{service.name}</li>
          </ol>
        </nav>

        {/* 2. What's Included — service-specific checklist */}
        <TCWhatsIncludedClient
          ghostKicker={service.whatsIncluded.ghostKicker}
          mainLine={service.whatsIncluded.mainLine}
          secondaryLine={service.whatsIncluded.secondaryLine}
          intro={service.whatsIncluded.intro}
          sections={service.whatsIncluded.sections}
        />

        {/* Price table, only for services that publish one. This is the page's
            answer to the "prices" and "cost" searches that show up for nearly every
            service: competitors either hide the number or give a $400 to $1,600
            range. The rows are generated from the booking form's own rate constants
            (see afterPartyPricing in serviceContent.ts), so it cannot drift. */}
        {service.pricing && (
          <section id="pricing" className="bg-white py-[80px] lg:py-[100px] px-[5%]">
            <div className="max-w-[900px] mx-auto">
              <TCHeadingStack
                ghostKicker={service.pricing.ghostKicker}
                mainLine={service.pricing.mainLine}
                secondaryLine={service.pricing.secondaryLine}
                level="h2"
                theme="light"
                size="md"
                className="mb-8"
              />
              <p className="text-[1rem] lg:text-[1.05rem] leading-[1.7] text-navy-deep/70 mb-8">
                {service.pricing.intro}
              </p>

              <table className="w-full border-collapse border border-slate-200 mb-6">
                <caption className="sr-only">{service.name} hourly rates</caption>
                <thead>
                  <tr className="bg-[#f4f7f6]">
                    <th scope="col" className="text-left font-mono text-[0.72rem] uppercase tracking-[1.5px] text-navy-deep/70 px-5 py-3">
                      Total labor hours booked
                    </th>
                    <th scope="col" className="text-right font-mono text-[0.72rem] uppercase tracking-[1.5px] text-navy-deep/70 px-5 py-3">
                      Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {service.pricing.rows.map((row) => (
                    <tr key={row.label} className="border-t border-slate-200">
                      <td className="px-5 py-4 text-[0.95rem] text-navy-deep">{row.label}</td>
                      <td className="px-5 py-4 text-right text-[0.95rem] font-bold text-navy-deep">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="text-[0.95rem] leading-[1.7] text-navy-deep/80 mb-4">
                <strong className="text-navy-deep">Example:</strong> {service.pricing.example}
              </p>
              <p className="text-[0.82rem] leading-[1.6] text-navy-deep/60 mb-8">{service.pricing.note}</p>

              <TCButton variant="primary" href={service.hero.ctaHref}>{service.hero.ctaText}</TCButton>
            </div>
          </section>
        )}

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

// First sentence of a meta description, for a link blurb. Never cuts mid-word: if
// the sentence is too long it is trimmed back to the last whole word.
function firstSentence(text: string, max = 130): string {
  const sentence = (text.match(/^.*?[.!?](\s|$)/)?.[0] ?? text).trim()
  if (sentence.length <= max) return sentence
  return sentence.slice(0, max).replace(/\s+\S*$/, '').replace(/[,;:]$/, '') + '…'
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
            Request your date in under two minutes.
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
                  {/* The anchor text of this link is what tells Google what the target
                      page is about. It used to be the tagline ("When Surface Clean
                      Isn't Enough.") followed by the meta description cut at a fixed
                      110 characters, which lands mid-word, so the link text said
                      nothing about the service it pointed to. Now: the service's
                      name, then its first whole sentence. */}
                  <h3 className="text-[1.15rem] font-extrabold text-navy-deep mb-2 tracking-[-0.3px]">
                    {rel.name} in Fort Lauderdale
                  </h3>
                  <p className="text-[0.9rem] leading-[1.5] text-navy-deep/65 mb-4">
                    {firstSentence(rel.meta.description)}
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
