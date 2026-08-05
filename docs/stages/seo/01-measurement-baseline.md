# S0 — Measurement Baseline & Canonicalization

Status: `[~]` in progress
Started: 2026-08-05

Goal: make the site measurable and unambiguous to crawlers before any content
work begins. Nothing here is content optimisation — this stage is control and
instrumentation only.

---

## Audit findings (before)

Four issues found on production, all of which would have distorted any
measurement taken afterwards.

| # | Finding | Impact |
|---|---|---|
| 1 | `/robots.txt` returned **404** | No crawl directives at all. `/admin`, `/api`, `/account`, `/checkout` were crawlable by default |
| 2 | `/sitemap.xml` **did not exist** | robots referenced it; Google had no page index to discover from |
| 3 | Canonical pointed to the **apex**, but the apex 307-redirects to **www** | Canonical named a URL that redirects. Self-contradictory signal |
| 4 | Click-to-call on service pages linked the **old phone number** | Displayed `(954) 833 4276`, dialled `+1 754 307 4034`. NAP inconsistency plus a real lost-call bug |

Root cause of 1 and 2: `robots.ts` sat inside the `(app)` route group. With two
root groups (`(app)` and `(payload)`), metadata routes in a group do not
resolve, so the `[slug]` catch-all swallowed `/robots.txt` and 404'd.

---

## Work completed

- [x] **Moved `robots.ts` to the app root** so the metadata route resolves.
      Verified: build emits `○ /robots.txt`.
- [x] **Wrote real crawl directives.** Admin, API, account, checkout, cart,
      orders, auth and search paths now disallowed. Previously there were none.
      Verified: generated body contains 13 `Disallow` rules.
- [x] **Built `sitemap.ts`** at the app root. Pulls static routes, the six
      service pages (from `serviceContent.ts`, so it cannot drift from the
      routes that actually exist), plus CMS pages and blog posts from Payload.
      Fails soft if the database is unreachable rather than 500ing.
      Verified: build emits `○ /sitemap.xml`, 14 URLs, valid XML.
- [x] **Fixed NAP on service pages.** Click-to-call corrected, email corrected,
      `telephone` and `email` added to the `LocalBusiness` JSON-LD so the
      structured data matches the Google Business Profile.
- [x] **Canonical decision: www.** Vercel already serves www and redirects the
      apex to it, so the canonical was aligned to reality rather than reversing
      a working redirect.

---

## Outstanding

**Blocking, and it is one environment variable.**

- [ ] Set `NEXT_PUBLIC_SERVER_URL=https://www.topcleaningteam.com` in Vercel.
      It currently resolves to the apex, which is why canonicals disagree with
      the serving domain. This single variable drives canonical tags, OG URLs,
      JSON-LD URLs, `robots.txt` host and every URL in the sitemap. Nothing
      else in S0 is correct until it is set.
- [ ] Deploy, then re-verify `/robots.txt` and `/sitemap.xml` on production.

**Account access required (not code).**

- [ ] Google Search Console — verify domain, submit sitemap
- [ ] Bing Webmaster Tools — verify
- [ ] GA4 — install, confirm pageviews and a booking conversion event
- [ ] Confirm Google Business Profile is claimed and accessible
- [ ] Baseline capture: PageSpeed Insights (mobile), current rankings for
      target keywords, review count

> Search Console data is **not retroactive**. It only collects from the day of
> verification, so every week unverified is baseline data that cannot be
> recovered later.

---

## Case study points

- Found and fixed a routing bug that had left the site with **no robots.txt at
  all**, exposing admin, API and customer account paths to crawlers.
- Built a sitemap generated from the same source of truth as the routes, so it
  cannot drift out of sync as services are added.
- Resolved a canonical/redirect contradiction where the site declared one
  domain authoritative while serving another.
- Caught a click-to-call defect where service pages displayed the correct phone
  number but dialled a decommissioned one. Invisible in analytics, directly
  costing calls.
- Added NAP to structured data, matching the Google Business Profile, which is
  the entity signal AI search uses to resolve a local business.

---

## Notes for later stages

Three corrections are needed in `00-seo-plan.md` before S1 and S3 begin:

1. **Delete the `Review` / `AggregateRating` instruction in S1.** Self-serving
   review markup is prohibited, never renders stars, and since July 2026
   carries manual-action risk.
2. **Add a GEO/AEO stage.** The plan predates AI search mattering. 45% of
   consumers now use AI tools for local recommendations, up from 6%.
3. **Update the service area.** The plan assumes Broward only; the site now
   serves Broward, Miami-Dade and Palm Beach, which roughly triples the
   location-page opportunity.

A **keyword mapping stage** is also missing entirely. S3 assumes a keyword map
exists but nothing upstream produces one. It belongs between S0 and S3, and no
location pages should be built before it.

Deferred to S1: performance. Lighthouse showed 34 on mobile, though that run
was distorted by browser extensions and needs re-testing via PageSpeed Insights.
Known culprits: ~380 KB of render-blocking OTF fonts (WOFF2 would cut ~260 KB),
22 files still using raw `<img>` instead of `next/image`, and a 1.1 MB hero
image.
