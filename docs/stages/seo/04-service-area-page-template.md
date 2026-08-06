# Stage S3 — Service Area Page Template

Status: `[ ]` not started
Created: 2026-08-06
Source: Sterling Sky (Joy Hawkins) — service area page guide + the 8,186-business
"near me" study. Links at the bottom.
Blocked by: S1.5 city list (needs GHL revenue data)

> Read this before writing a single city page. The plan's original S3 section was
> written on instinct and is wrong in at least three places. Corrections are marked
> **PLAN CHANGE** below.

---

## The findings that reshape S3

### 1. Do not build a page per city

**PLAN CHANGE.** The plan lists seven speculative city pages plus service×city
combos, chosen by intuition. Sterling Sky's answer to "do I need a page for every
city I serve" is *"typically, no."*

Their rule instead:

> "Pick the cities in each service area that generate the most revenue according to
> your records and make sure you have a page for each."

**Revenue data, not population.** We can actually do this — every booking now writes
`city` to the GHL contact. That query decides the city list. Until it's run, the
city list in `02-keyword-map.md` is a placeholder, not a plan.

This also cuts scope. Fewer, deeper pages beat ten thin ones, and ten thin ones is
exactly what gets filtered as doorway content.

### 2. Hidden addresses correlate with *worse* rankings

The 8,186-business study found **hidden addresses showed a negative correlation with
rankings**, and displaying a real office location improved local pack performance
significantly — *contradicting Google's own service-area-business guidance*.

We are currently a hidden-address SAB. This may matter more than every page we write.

**This is Geraldine's decision, not ours**, and it has a real cost: if the registered
address is her home, publishing it is a privacy and safety tradeoff, not just an SEO
lever. It is also correlation from an observational study, not proof of causation.
But it is the single highest-leverage question on the board, and it should be asked
explicitly rather than defaulted into.

Options if she doesn't want her home address public: a commercial mailbox that
qualifies as a real staffed location, or co-working space with a genuine presence.
Both carry GBP eligibility rules that need checking before spending money — fake
addresses get listings suspended, permanently.

### 3. Review recency beats review count, and gaps are punished

Confirmed by the study: **monthly review volume mattered more than total count.**
Their headline example — a dental client at 60+ reviews/month saw rankings
"fall off a cliff" after an **18-day pause**.

Caveat, stated honestly: that's a high-velocity account, and the cliff is steeper the
higher you were. At four reviews we are not going to see that dynamic. The
transferable lesson is directional — **never let the pipeline go quiet** — not that
an 18-day gap will hurt *us* specifically.

### 4. Review *text* outranks star rating

Reviews containing written text had stronger ranking impact than stars alone.

**Consequence for S5:** the ask has to change. "Please leave us 5 stars" is the wrong
script. "Please leave a review and mention what we cleaned and where" is the right
one — it produces text, and the text carries service and city keywords.

### 5. Myth busted: "near you" in copy does nothing

Simply adding "near you" / "near me" phrasing to organic content **did not** improve
local pack rankings. Don't waste copy on it.

### 6. Photos matter far less for us than assumed

**PLAN CHANGE.** Photos correlated for visual industries (restaurants, salons) but
showed **minimal correlation for service industries**. The plan's "Photos: 20+ at
minimum" in S2 is worth doing for conversion and profile completeness, but it is not
the ranking lever it's presented as. Don't let it block S2.

### 7. Substantive content correlates — measured in real words

More meaningful words (excluding stop words like "and", "the") on landing pages
correlated with better rankings. Quality and depth, not keyword density.

---

## The page template

Every service-area page ships with **all** of these. A page missing the first-party
sections is a doorway page with a city name pasted in, and will be treated as one.

### Required — baseline

- [ ] Service description + how to contact (the irreducible core)
- [ ] One `<h1>`, structured `<h2>`s
- [ ] One focus keyword from `02-keyword-map.md`, no page sharing a primary
- [ ] CTA above the fold, repeated below
- [ ] `Service` + `BreadcrumbList` schema (our service pages already do this)
- [ ] FAQ section with `FAQPage` schema

### Required — first-party data (the part that's hard to fake, which is the point)

- [ ] **Our own pricing / cost ranges for that city.** Sterling Sky: Google "loves
      highlighting this info in a featured snippet." We have real booking data to
      derive this from.
- [ ] **Staff bios** — short, with photos, for people who work that area. Include a
      direct quote from a crew member. This demonstrates first-hand expertise.
- [ ] **Customer proof tied to that city** — testimonial with photo, case study, or
      video. Generic site-wide testimonials do not count.
- [ ] **Unique job photos** — before/after from actual jobs in that area. Not stock.
      Not reused across pages.

### Required — genuine local connection

- [ ] Local landmarks, neighborhoods, parks the crew actually services
- [ ] Any sponsorship, Chamber of Commerce membership, or nonprofit work, linked
- [ ] Employee connections to the area (lives there, studied there)
- [ ] **"Related businesses" section** linking out to well-rated local companies.
      Sterling Sky's note: "they might even be inclined to return the favor" — this
      is a low-effort local link-building side effect.

### Required — internal linking

- [ ] Linked from the homepage
- [ ] Linked from the relevant service page
- [ ] A **service-area hub page** listing all of them
- [ ] **Each service-area page links to all the others**

> "You never want to create service area pages for SEO and then hide them from users
> and Googlebot because it's not linked anywhere."

---

## Hard don'ts

| Don't | Why |
|---|---|
| **Don't generate local details with AI** | Sterling Sky's own study found ChatGPT "failed pretty epically" at hyper-local content. It invents landmarks and businesses that don't exist. Every local fact on these pages must be verified by a human who has been there. This applies to me too — I should not be writing the landmark sections. |
| **Don't duplicate content across city pages** | The template is shared; the content is not. Swapping the city name is the doorway pattern. |
| **Don't create both a city page and a service×city page for the same intent** | Self-cannibalization. Pick one. |
| **Don't build pages for cities we won't service** | Ranking then declining the job is worse than not ranking. |
| **Don't set and forget** | "Continuously evaluate how you can provide the most value possible." Monitor and expand pages whose rankings stall. |

---

## Revised S3 scope

**PLAN CHANGE.** Original plan: 10–15 pages, 30–60 hours, city list picked by
intuition.

Revised:

1. **Run the GHL city-revenue query first.** No page count is decidable before this.
2. Build pages **only** for cities with real revenue concentration — likely 3–5, not 7.
3. Each page carries the full first-party payload above. Budget more hours per page
   and fewer pages.
4. Service×city combos come **after** the base city pages prove they rank, not in the
   same wave.

Two gaps from `02-keyword-map.md` still stand and are higher priority than any city
page, because they serve services we already sell with zero surface area:

- `/services/handyman` — the booking wizard sells it today
- `/services/recurring` — highest-LTV customer, no page

---

## Open questions for Geraldine

1. **Do we publish a real business address?** (Highest-leverage item here. Privacy
   tradeoff is hers to weigh.)
2. What is the true maximum drive radius?
3. Can we get crew photos, names, and a usable quote from each?
4. Any Chamber membership, sponsorship, or local nonprofit involvement to cite?
5. Can we get permission for before/after photos from real jobs, per city?

Items 3–5 are the actual bottleneck for S3. The writing is the easy part; the
first-party proof is what we cannot manufacture.

---

## Sources

- Sterling Sky — [How to Create Unique and Helpful Service Area Pages](https://www.sterlingsky.ca/how-to-create-unique-and-helpful-service-area-pages-for-local-businesses/)
- Sterling Sky — [What Actually Gets You Ranking for "Near Me" in 2025](https://www.sterlingsky.ca/what-gets-you-ranking-for-near-me-2025/) (8,186 businesses, 200 cities)
- Whitespark — [Local Search Ranking Factors](https://whitespark.ca/local-search-ranking-factors/)
