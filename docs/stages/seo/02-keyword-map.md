# Stage S1.5 — Keyword Map

Status: `[~]` in progress
Created: 2026-08-06
Blocks: S2 (GBP categories + services), S3 (service and location pages)
Blocked by: nothing — the light pass needs no paid tool

---

## Why this stage exists

The original plan jumped from S1 (technical) straight to S2 (GBP) and S3 (content).
Both of those stages ask you to make keyword decisions — GBP categories, the GBP
services list, service-area cities, page URLs, H1s, meta titles — and once made,
they are expensive to undo. GBP category changes can trigger re-verification, and
changing a live URL means a redirect plus lost equity.

So the map comes first. One page owns one primary keyword. Nothing ships until it
has a row in the table below.

---

## What the live SERP told us (2026-08-06)

Two searches, real results, three findings that shape everything downstream.

### 1. Head-term organic is not winnable in year one

Page one for `house cleaning service Fort Lauderdale` is aggregators and national
franchises: Yelp, Groupon, Care.com, The Maids, MaidPro, The Cleaning Authority.
Not one independent local operator on page one.

Those aggregators have domain authority we will not approach, and the franchises
have twenty-year-old domains with national link profiles. Chasing
`house cleaning fort lauderdale` as a primary target in 2026 burns the year.

**Consequence:** the head terms belong to the Local Pack, not organic. That is a
review-count and proximity game, which is S2 and S5 — not a content game. Our
organic targets are long-tail and service×city.

### 2. Competitors are already running the service×city page pattern

Real URLs found in the AirBnB SERP:

- `elevated.cleaning/airbnb-cleaning-service-fort-lauderdale/`
- `sparklymaidmiami.com/airbnb-cleaning-fort-lauderdale`
- `thebluemop.com/vacation-rental-cleaning-fort-lauderdale`
- `suncleaninginc.com/airbnb-turnover-cleaning-in-broward-county-south-florida/`

This is direct evidence the S3 service×location structure works in this niche and
is table stakes rather than a clever edge. It also means these pages are the ones
we have to beat, not the aggregators.

### 3. We are missing an entire vocabulary: "maid"

Look at who ranks: The **Maids**, **Maid**Pro, Blue Chip **Maids**, Sparkly **Maid**
Miami, "**Maid** Service Broward", Care.com's "cleaning **lady** near me" page.

`maid service` and `cleaning lady` are how a large share of this market searches.
The phrase "maid" appears **nowhere** on our site. Same for `vacation rental
cleaning`, which ranks alongside `airbnb cleaning` and is the phrase that survives
if Airbnb branding ever shifts.

**Consequence:** we need this vocabulary in H2s, body copy, and the GBP services
list. Not as stuffing — as the natural synonym set we are currently blind to.

---

## Finding: every service page targets a phrase nobody searches

All six service pages in `src/data/serviceContent.ts` carry a meta title ending in
**"South Florida"**:

> `Post Construction Cleaning South Florida | Top Cleaning Team`
> `Residential Cleaning Service South Florida | Top Cleaning Team`
> ... and four more

"South Florida" is how *businesses* describe the region. It is not how *customers*
search. Customers search their own city. Every competitor title in both SERPs used
a city name or county, never the regional blob — and the plan itself already warns
against this for GBP service areas (line 111: "NOT a blob like 'South Florida'").
We made exactly that mistake in the page titles.

**Fix:** retarget each service page's title to the anchor city, and let the
service×city pages in S3 cover the rest. Anchor city is Fort Lauderdale unless the
volume data in the deep pass says otherwise.

---

## The map

Rule: **one page, one primary keyword.** If two pages want the same primary, one of
them is wrong.

Volume and difficulty columns are deliberately blank. I will not invent numbers —
they get filled in the deep pass once there's tool access. The *structure* below
does not depend on them.

### Existing pages

| URL | Primary keyword | Secondary cluster | Vol | KD |
|---|---|---|---|---|
| `/` | top cleaning team (brand) | cleaning service broward county, maid service near me | | |
| `/services` | cleaning services broward county | house cleaning services near me | | |
| `/services/residential` | house cleaning service fort lauderdale | maid service, home cleaning, cleaning lady | | |
| `/services/deep-cleaning` | deep cleaning service fort lauderdale | one time deep clean, spring cleaning, detailed cleaning | | |
| `/services/move-in-out` | move out cleaning service fort lauderdale | move in cleaning, apartment move out cleaning, end of lease cleaning | | |
| `/services/airbnb` | airbnb cleaning service fort lauderdale | vacation rental cleaning, short term rental turnover, turnover cleaning | | |
| `/services/commercial` | commercial cleaning service fort lauderdale | office cleaning, janitorial service | | |
| `/services/post-construction` | post construction cleaning fort lauderdale | construction cleanup, renovation cleaning, after builders clean | | |

### Gaps — pages that should exist and don't

| URL | Primary keyword | Why | Priority |
|---|---|---|---|
| `/services/handyman` | handyman service fort lauderdale | **The booking wizard already sells this.** We take handyman bookings with zero page to rank, zero schema, and no entry in the GBP services list. Straight revenue leak. | **High** |
| `/services/recurring` | recurring cleaning service fort lauderdale | Weekly/biweekly is the highest-LTV customer. The wizard has four frequency options; no page targets the subscription intent. | High |

`/services/recurring` needs care — see cannibalization below.

---

## Cannibalization risk

Three pages plausibly want the phrase "house cleaning". Left alone, Google picks
one at random and the others suppress it. Each needs a distinct job:

| Page | Intent it owns | Differentiator in copy |
|---|---|---|
| `/services/residential` | the hub — "I need my house cleaned" | broadest, links to the other two |
| `/services/deep-cleaning` | one-time, intensive, problem-solving | "when surface clean isn't enough", first-time or neglected |
| `/services/recurring` | ongoing, subscription, same crew | frequency, scheduling, price-per-visit savings |

Residential is the parent and must link down to both. Deep and recurring link back
up but not to each other.

---

## Modifier layers

The map above is the base. Real long-tail comes from stacking modifiers:

- **City:** fort lauderdale, pompano beach, hollywood, coral springs, sunrise, plantation, pembroke pines, weston, miramar, boca raton, delray beach, miami, aventura
- **Commercial intent:** cost, price, how much, rates, near me, quote
- **Qualifier:** eco friendly, insured, bonded, same day, pet friendly, background checked, spanish speaking
- **Property:** apartment, condo, townhouse, office, vacation rental

`service × city` is the S3 goldmine. `service × cost` is S6 blog territory —
"how much does house cleaning cost in Fort Lauderdale" is a real query with
commercial intent and no good local answer.

---

## City priority — needs Geraldine's input

**Do not build a page for a city the crew won't drive to.** Ranking for
Boynton Beach and then declining the jobs is worse than not ranking.

Before S3, confirm with Geraldine:

1. What is the actual maximum drive radius?
2. Which cities do current customers already come from? (pull from GHL contacts —
   we now write `city` on every booking, so this is queryable)
3. Is there a minimum job size that makes a longer drive worthwhile?

Then rank cities by real coverage, not by population. Proposed starting eight,
pending that answer:

Fort Lauderdale · Pompano Beach · Hollywood · Coral Springs · Plantation ·
Sunrise · Weston · Pembroke Pines

Miami-Dade and Palm Beach come in wave two — they're in the schema's `areaServed`
and the booking form accepts them, but city pages there are premature until
Broward is won.

---

## Free-tool research protocol (the light pass)

No subscription needed. This is enough to unblock S2.

1. **Google autocomplete** — type each primary keyword, record every suggestion.
   Repeat with `a`–`z` appended to expand the tree.
2. **People Also Ask** — expand three levels deep. Every question is a potential
   FAQ entry, and FAQ entries already have schema support on our service pages.
3. **Related searches** — bottom of the SERP, the single best free source of
   the synonym vocabulary we just found we were missing.
4. **Competitor GBP listings** — open the top three in the Local Pack for
   `house cleaning fort lauderdale`. Record their primary category, their full
   services list, and their review count. Their category choice is a strong
   signal, and their review count is the number we have to beat.
5. **Competitor page titles** — the four service×city URLs above. Read their H1
   and H2 structure.

Record everything in this doc as it comes in.

## Deep pass (needs Ahrefs or SEMrush)

Only needed for S3, not S2:

- Fill the Vol and KD columns
- Pull competitor ranking keywords to find gaps we haven't thought of
- Validate that the eight priority cities have enough volume to justify pages

---

## Definition of done

- [ ] Every existing page has a primary keyword and nothing shares one
- [ ] Autocomplete + PAA + related searches captured for all eight primaries
- [ ] Top three Local Pack competitors' categories and services recorded
- [ ] City list confirmed against the real service radius
- [ ] Service page meta titles retargeted off "South Florida"
- [ ] Handyman and recurring pages scoped
- [ ] GBP services list drafted from this map, ready for S2

---

## Feeds into

- **S2** — GBP primary/secondary categories, services list, service-area cities all
  come from this doc
- **S3** — page inventory, URLs, H1s, focus keywords
- **S6** — the `cost` and `how to` modifier sets are the blog backlog
