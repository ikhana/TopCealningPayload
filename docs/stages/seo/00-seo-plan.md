# SEO Plan — Top Cleaning Team

Domain: **topcleaningteam.com**
Market: South Florida (Fort Lauderdale, Miami, Boca Raton, Pompano Beach, surrounding)
Business type: Service-area business (SAB), home + commercial cleaning
Status as of 2026-05-21: domain live, Phase 9 email workflows shipped, no SEO work done yet

---

## The honest reality

"Rank #1" isn't a single destination. You earn different ranks for different keywords. For a brand-new domain in a competitive market like South Florida:

| Goal | Realistic timeline |
|---|---|
| Local Pack top 3 (Google Maps) in a few cities | 3–9 months |
| Organic first page for long-tail keywords (`airbnb cleaning pompano beach`) | 6–12 months |
| Organic first page for head keywords (`house cleaning miami`) | 12–24 months |
| #1 organic for competitive head keywords | 18–36 months |
| Local Pack #1 across all target cities | 12–18 months |

Anyone promising "page 1 in 3 months" for competitive head keywords is lying.

---

## Pillars (what we need and why)

| Pillar | Why it matters | Owner |
|---|---|---|
| **Technical foundation** | Google can't rank what it can't crawl or what's slow | Dev |
| **On-page content** | Each page ranks for its own keywords. Surface area = ranking opportunities | Content writer |
| **Google Business Profile** | THE single most impactful asset for a local service business. Powers the Local Pack. | Geraldine |
| **Reviews** | Google ranks Local Pack heavily by review velocity + quality. Stage 9.5 workflow handles ask. | Geraldine + crew |
| **Citations** | NAP-consistent listings on Yelp, BBB, Angie's, etc. Validates legitimacy. | Geraldine or outsourced |
| **Backlinks** | Authority signal. Slowest to build, biggest long-term impact. | Outreach (ongoing) |
| **Content marketing** | Captures top-of-funnel intent ("how to deep clean"). Builds topical authority. | Content writer |

---

## Stages

Status legend: `[ ]` not started · `[~]` in progress · `[x]` done

| # | Stage | Status | Effort | Doc |
|---|---|---|---|---|
| S0 | Measurement baseline + domain canonicalization | `[ ]` | 3 hrs | (this doc) |
| S1 | Technical SEO foundation (sitemap, schema, Core Web Vitals) | `[ ]` | 15–25 dev hrs | (TBD) |
| S2 | Google Business Profile optimization + ongoing posting | `[ ]` | 4–6 hrs initial + 30–60 min/week | (TBD) |
| S3 | On-page content (service pages, location pages) | `[ ]` | 30–60 hrs (10–15 pages) | (TBD) |
| S4 | Citations & directories | `[ ]` | 8–12 hrs | (TBD) |
| S5 | Reviews engine (already built — just operationalize) | `[~]` | 30 min/week | (TBD) |
| S6 | Content marketing / blog | `[ ]` | 3–5 hrs/post, ongoing | (TBD) |
| S7 | Backlinks / authority building | `[ ]` | 5–10 hrs/week, ongoing | (TBD) |

---

## Stage S0 — Measurement baseline + canonical (DO FIRST)

Before any SEO work, set the measurement infrastructure so we can SEE whether work is moving the needle.

- [ ] Vercel → Project Settings → Domains → pick canonical (apex `topcleaningteam.com` OR `www.topcleaningteam.com`), set the other as a redirect
- [ ] Verify domain in **Google Search Console** at https://search.google.com/search-console
- [ ] Verify in **Bing Webmaster Tools** at https://www.bing.com/webmasters
- [ ] Set up **Google Analytics 4** (GA4) tracking — basic page views + conversion events
- [ ] Set up **BrightLocal** trial ($35/mo) or **Whitespark** for citation tracking — gives baseline
- [ ] Verify Google Business Profile claimed and accessible (already true if Geraldine has been managing reviews)
- [ ] Take screenshots of current rankings for target keywords (PageSpeed Insights for tech, Google searches for rankings) — baseline

**Effort**: ~3 hrs. **Output**: dashboards we can revisit at 30/60/90 days.

---

## Stage S1 — Technical SEO foundation

Most of this is dev work — possibly already partially in place via Payload's SEO plugin.

### Checklist

- [ ] **Sitemap.xml** auto-generated from Payload pages (Payload has a plugin)
- [ ] **Robots.txt**: allow crawlers, block `/admin`, `/api`, `/account`
- [ ] **Structured data (JSON-LD)** on every page:
  - `LocalBusiness` schema on homepage (NAP, hours, areas served, price range)
  - `Service` schema on each service page
  - `BreadcrumbList` on inner pages
  - `Review` / `AggregateRating` (once we have 5+ reviews — pull from GBP API)
  - `FAQPage` schema on FAQ sections (eligible for rich results)
- [ ] **Meta tags** — unique `<title>` and `<meta description>` per page
- [ ] **Core Web Vitals**: LCP < 2.5s, INP < 200ms, CLS < 0.1 — verify on PageSpeed Insights
- [ ] **Canonical URLs** — `<link rel="canonical">` pointing to chosen canonical domain
- [ ] **HTTPS** + redirect www↔apex (single canonical)
- [ ] **Image optimization** — alt text on every image, use `next/image` for automatic optimization, lazy loading
- [ ] **Internal linking** — service pages link to each other, blog posts link to service pages
- [ ] **404 handling** — custom 404 page with search and CTAs
- [ ] **OG tags** — for social sharing previews

**Effort**: 15–25 dev hours.
**Tools**: PageSpeed Insights, Lighthouse, Schema Markup Validator, Search Console URL Inspection.

---

## Stage S2 — Google Business Profile (highest ROI in months 1–6)

This is the single most impactful thing for a local cleaning service. Skip nothing here.

### Initial setup checklist

- [ ] Claim/verify GBP at business.google.com
- [ ] **Categories**: primary "House cleaning service"; secondary "Cleaners", "Commercial cleaning service", "Janitorial service"
- [ ] **NAP**: business name, address (or service-area mode), phone — consistent everywhere
- [ ] **Hours**: full week schedule (match what's on website)
- [ ] **Service areas**: list every city/neighborhood you serve (NOT a blob like "South Florida")
- [ ] **Services**: list every service offered with descriptions + price ranges
- [ ] **Attributes**: family-owned, eco-friendly, online estimates, online booking (if applicable)
- [ ] **Photos**: 20+ at minimum
  - Logo
  - Team photos
  - Before/after shots (5+)
  - Vehicle/branded materials
  - Service area photos (homes you've cleaned, with permission)
  - Tools/equipment
- [ ] **Q&A**: pre-seed 5–10 common questions and answer them yourself (Google allows owner Q&A)
- [ ] **Booking link**: link to `topcleaningteam.com/booking`

### Ongoing (weekly)

- [ ] **GBP Posts**: 1+ post per week (offer, tip, before/after photo, service announcement)
- [ ] **Review replies**: respond to every review within 24 hours (positive AND negative)
- [ ] **Photo uploads**: add new photos monthly
- [ ] **Q&A monitoring**: answer customer-submitted questions within 24 hours

**Effort**: 4–6 hours initial, 30–60 minutes/week ongoing.

---

## Stage S3 — On-page content

Build URL structure that lets us rank for each service × location combination.

### Service pages (one per service)

- `/services/residential-cleaning`
- `/services/move-in-out-cleaning`
- `/services/airbnb-turnover-cleaning`
- `/services/post-construction-cleaning`
- `/services/commercial-cleaning`
- `/services/deep-cleaning`
- `/services/recurring-cleaning`

### Location pages (one per priority city)

Pick 5–8 to start, expand later:

- `/locations/fort-lauderdale`
- `/locations/miami`
- `/locations/boca-raton`
- `/locations/pompano-beach`
- `/locations/hollywood`
- `/locations/coral-springs`
- `/locations/sunrise`

### Service + location combos (long-tail goldmine)

- `/locations/fort-lauderdale/move-in-cleaning`
- `/locations/miami/airbnb-turnover`
- `/locations/boca-raton/deep-cleaning`
- (etc.)

### Page requirements

Each page must have:

- 800–1200 words minimum (more for competitive keywords)
- One `<h1>`, structured `<h2>` subheadings
- One focus keyword + 3–5 related secondary keywords
- Local proof (testimonials from that area when available)
- Real photos (NOT stock — Google penalizes generic stock imagery for local)
- Internal links to related service/location pages
- One clear CTA above-the-fold + repeated below
- FAQ section (5–8 questions, with `FAQPage` schema)
- Schema.org `Service` markup

**Effort**: 3–5 hours per page. Total ~30–60 hours for initial 10–15 page rollout.

---

## Stage S4 — Citations & directories

Submit consistent NAP to every relevant directory.

### Tier 1 (priority — do first)

- [ ] Google Business Profile (covered in S2)
- [ ] Bing Places
- [ ] Apple Maps Connect
- [ ] Facebook Business Page
- [ ] Yelp for Business
- [ ] Better Business Bureau (BBB)
- [ ] Nextdoor for Business

### Tier 2

- [ ] Angi (formerly Angie's List)
- [ ] Thumbtack
- [ ] HomeAdvisor
- [ ] Houzz (if commercial focus)
- [ ] Yellowpages.com

### Tier 3

- [ ] Local Florida directories (Chamber of Commerce, Visit Lauderdale, etc.)
- [ ] Industry-specific (CleaningBusinessExpo, ISSA, etc.)

**Effort**: 8–12 hours manual. Or use BrightLocal Citation Builder (~$35/mo subscription) for automation.

**Important**: NAP must be IDENTICAL across all directories. Any variation (e.g., "Top Cleaning" vs "Top Cleaning Team" vs "Top Cleaning LLC") confuses Google's local algorithm.

---

## Stage S5 — Reviews engine (already built — just operationalize)

Stage 9.5 + 9.8 in `GHL_WORKFLOWS_PLAN.md` is live. To make it work:

- [ ] **Train every crew member**: after each cleaning, before leaving the home, mark the appointment as "Showed" in the GHL Mobile app
- [ ] **Train every crew member**: verbally ask happy customers to look for the review email
- [ ] **Geraldine replies to every review within 24 hours** — positive AND negative
- [ ] **Target**: 30 reviews in first 6 months, 60+ in first 12 months
- [ ] **Tag `reviewed`** when a customer leaves a review (manually until automation in S6)

**Effort**: ~30 minutes/week for Geraldine. Crew training is one-time + reminders.

**ROI**: Reviews are the dominant signal in the Local Pack algorithm. Every review compounds future bookings via SEO + social proof.

---

## Stage S6 — Content marketing / blog

Start once S1–S4 are done. Aim for 1 post/week.

### Keyword targets (top of funnel)

- "how often should you deep clean your house"
- "what's the difference between regular and deep cleaning"
- "move-in cleaning checklist"
- "best cleaning products for [marble / granite / hardwood]"
- "how to prep your Airbnb between guests"
- "spring cleaning checklist florida humidity"
- "post-construction cleaning what to expect"
- "how much does house cleaning cost in [city]"

### Post requirements

- 1500–2500 words
- Clear H1, structured H2s/H3s
- Internal links to relevant service + location pages
- Schema markup (Article, optionally HowTo for guides)
- One CTA mid-post + one at end
- Featured image + 3–5 supporting images (real, not stock)

**Effort**: 3–5 hours per post in-house, or outsource at $100–$200/post.
**Pacing**: 1 post/week sustainable. 4 posts/month = 48/year.

---

## Stage S7 — Backlinks / authority building (ongoing, slow)

The slowest-moving but highest-impact long-term lever.

### Tactics

- **Local press releases**: when launching new service, sponsoring an event, or community involvement
- **Sponsor local events** (Little League, charity 5K, school events) → backlink from event website
- **Guest posts**: contribute articles to local lifestyle blogs (Visit Fort Lauderdale, Miami New Times, etc.)
- **Partner cross-referrals**: realtors, property managers, Airbnb hosts → mutual backlinks
- **HARO (Help A Reporter Out)**: respond to journalist queries about cleaning, home maintenance — quoted in articles
- **Industry directories**: ISSA, Better Business Bureau, BNI groups

**Effort**: 5–10 hours/week of outreach. Often outsourced ($300–$800/month for an outreach agency) or skipped early.

**Don't buy backlinks.** Google penalizes paid links. Stick to earned links from real publications.

---

## Timeline by month

| Month | What you should see |
|---|---|
| 1 | S0 + S1 done. GBP optimized. Tracking + measurement in place. |
| 2 | 5–8 service pages live. First citations submitted. 5+ new reviews via 9.5 workflow. |
| 3 | 10–15 pages live, 15+ reviews, ranking long-tail in Search Console. Local Pack appearing for branded searches. |
| 6 | 30+ reviews. Local Pack top 5 in target cities. First-page organic for long-tail keywords. |
| 9 | 50+ reviews. Local Pack top 3 in most target cities. Blog content gaining traction. |
| 12 | First-page organic for some head keywords (`house cleaning [city]`). Local Pack #1 in several cities. Blog generating 500+ visits/month. |
| 18–24 | #1 organic for some head keywords. Dominant Local Pack. Blog 2K+ visits/month. Backlinks compounding. |

---

## Budget options

### Bare-minimum DIY (Year 1)

| Item | Cost |
|---|---|
| GBP | Free |
| BrightLocal (citations + tracking) | $420/year |
| Google Search Console + GA4 | Free |
| Domain | $15/year |
| Crew training time | Internal |
| **Total** | **~$435/year** |

### With outsourced content (Year 1)

| Item | Cost |
|---|---|
| Bare-minimum above | $435 |
| Blog content (1 post/week × 52 × $150) | $7,800 |
| **Total** | **~$8,235/year** |

### Full agency (Year 1)

| Item | Cost |
|---|---|
| Bare-minimum tools | $435 |
| Outsourced content + outreach + citations | $1,500–3,500/month |
| **Total** | **$18K–42K/year** |

---

## The single highest-ROI action

If only one thing happens this year: **drive reviews + optimize GBP**.

For local cleaning, the Local Pack delivers more leads than organic search in the first 6–12 months. Reviews dominate Local Pack ranking. The Stage 9.5 email workflow is built — it just needs the operational habit of crew marking "Showed" + Geraldine replying to reviews.

If we never wrote a blog post, never built a backlink, but Geraldine got to 50 5-star reviews via crew discipline → we'd outrank most local competitors in the Local Pack alone.

---

## What's NOT in this plan (and why)

- **Paid ads (Google Ads, Facebook Ads)**: separate channel, separate budget, different tracking. Worth $1K–3K/mo trial after GBP + organic foundation is set.
- **Social media organic** (Instagram, TikTok): low ROI for cleaning services unless you have time to invest. Most leads come via Search + Maps, not feeds.
- **Email newsletter to customers**: defer until customer base > 200 active. Then a monthly tips newsletter is fine.
- **YouTube SEO**: rich payoff but big effort. Defer until business has bandwidth.

---

## Next sub-stages to write up

Once we start executing, each S1–S7 stage gets its own doc following the pattern in `docs/stages/platform/` (story, what you'll learn, builds on, steps, verify, unlocks). Numbering convention:

- `docs/stages/seo/01-measurement-baseline.md` (Stage S0)
- `docs/stages/seo/02-technical-foundation.md` (Stage S1)
- `docs/stages/seo/03-google-business-profile.md` (Stage S2)
- `docs/stages/seo/04-service-pages.md` (Stage S3)
- ... etc.

This doc is the umbrella plan. Sub-stage docs go deep on execution.
