# Stage S2 — Google Business Profile

Status: `[ ]` not started
Created: 2026-08-06
Weight: **32% of Local Pack ranking** (Whitespark 2026) — the single biggest asset
Access: blocked by the June 2026 invitation bug. **This checklist is designed to be
executed on a screen share with Geraldine driving**, so the work is not blocked even
though access is.

> Ordered by ranking impact. If the call runs short, everything above the line in
> each section is what matters.

---

## Step 0 — Screenshot before touching anything

Capture the current state of: business name, primary + secondary categories,
service area list, services list, website URL, hours, description.

Two reasons. If an edit triggers a re-verification or a suspension we need to know
exactly what changed. And this is the S0 "before" baseline the plan asks for.

---

## Priority 1 — Service area (do this first)

**Suspected problem:** the profile's map pin resolves to `27.698, -83.804`, which is
in the Gulf of Mexico and almost exactly the bounding-box centre of Florida. The
share link opens at zoom 7 (state level). Google computes that centroid when the
service area is very large. **Verify this on the call.**

If it is set statewide, it is diluting local relevance across 20 million people and
is likely the largest single constraint on ranking.

**Set it to actual cities, not a region or radius:**

Fort Lauderdale · Pompano Beach · Hollywood · Coral Springs · Plantation ·
Sunrise · Weston · Pembroke Pines · Davie · Oakland Park

Rules:
- Google caps service areas at **20**. Do not fill all 20 for the sake of it.
- **Do not list a city the crew will not drive to.** Ranking then declining the job
  is worse than not ranking.
- Miami-Dade and Palm Beach cities are deliberately excluded for now. Local Pack
  ranking is proximity-driven; we cannot rank in Miami's pack from a Broward base.
  Those counties are an organic play via S3 pages, not a GBP play.

**Confirm with Geraldine:** the real maximum drive radius. This also unblocks S3.

---

## Priority 2 — Primary category

Should be **House cleaning service**.

Primary category is the strongest single lever inside the 32% GBP bucket. Copy what
already ranks rather than guessing — check the top three Local Pack competitors for
`house cleaning fort lauderdale` first.

Secondary categories (add, do not replace):
- Cleaners
- Commercial cleaning service
- Janitorial service
- Handyman (if offered as a category — we now sell it)

⚠️ **Category changes can trigger re-verification.** Only do this when Geraldine is
able to complete a verification step in the following days. Do not change categories
and then go on holiday.

---

## Priority 3 — Business name (decide, do not reflex-fix)

**The mismatch:** GBP says **"Team Top Cleaning"**. The website, schema, and domain
say **"Top Cleaning Team"**.

**Do not simply change GBP to match the site.** Google's naming guidelines require
the name to match the real-world business name — signage, legal registration,
branding. If the registered entity is "Team Top Cleaning", editing GBP to something
else is a guidelines violation and risks suspension of the whole profile.

**Ask Geraldine first:** what is the legal registered name?

- If legal name is **Top Cleaning Team** → fix GBP.
- If legal name is **Team Top Cleaning** → fix the *website*, schema, and llms.txt
  instead. That is the cheaper and safer direction.

Either way both must converge. Name is the "N" in NAP and inconsistency here
directly confuses the local algorithm.

⚠️ Name edits also commonly trigger re-verification.

---

## Priority 4 — Services list

Currently reads roughly: *Deep clean, Office and workplace cleaning, Standard
cleaning, Interior and exterior window…*

Missing services we actively sell and have pages for. Add all of these, each with a
short description using customer vocabulary (`maid service`, `vacation rental
cleaning`) rather than industry vocabulary:

| Service | Note |
|---|---|
| House Cleaning / Maid Service | "maid service" is a phrase we are blind to sitewide |
| Deep Cleaning | already present |
| Move In / Move Out Cleaning | page exists, missing from GBP |
| AirBnB & Vacation Rental Turnover | page exists, missing from GBP |
| Commercial & Office Cleaning | present |
| Post Construction Cleaning | page exists, missing from GBP |
| **Handyman Services** | sold in the booking wizard, page now live |
| **Hoarding Cleanup** | sold in the booking wizard, no page yet |

This is a low-risk edit — services do not trigger re-verification.

---

## Priority 5 — Website URL

Must be `https://www.topcleaningteam.com` — **with the `www`**. The apex 308-redirects
to www, so pointing at the apex sends every click through an extra hop.

Also confirm the **Appointments** link (currently correct: topcleaningteam.com).

---

## Priority 6 — Everything else

- **Hours** — must match the site: Mon–Sat 07:00–18:00, closed Sunday
- **Attributes** — family-owned, eco-friendly, online estimates, online booking,
  background-checked staff, LGBTQ+ friendly if applicable
- **Description** — 750 chars, lead with the service and the area
- **Photos** — worth doing for conversion, but note the Sterling Sky study found
  photos correlate with rankings for *visual* industries (restaurants, salons) and
  showed **minimal correlation for service industries**. Do not let photo collection
  block anything above this line.
- **Q&A** — seed 5–10 owner-answered questions. Genuinely useful for AEO.

---

## Priority 7 — Reviews (the real long game)

Currently **6 reviews**. Benchmark competitor *Top Level Cleaning* has **138**.

Reviews are **20%** of Local Pack weight, and review **recency** moved from #20 in
2023 to a **top-five factor** in 2025. Two consequences:

1. **A steady drip beats a burst.** Three per month forever outperforms thirty in one
   month followed by silence.
2. **Ask for text, not stars.** The study found reviews containing written text carry
   more ranking weight than the star rating alone. Change the crew script from
   "please leave us 5 stars" to **"please mention what we cleaned and where"** —
   same effort, and the text carries service and city keywords.

Also: reply to all 6 existing reviews on the call. Response rate is a counted signal
and it takes five minutes.

---

## Access — fix separately, do not let it block the above

The June 2026 invitation bug is documented and unresolved. Attempted and failed:
manager invite to two Gmail accounts, and adding Business Group ID `5368204687`
under People and access (group remains empty).

Remaining path: **Geraldine raises a support case** (Support → Contact us from her
dashboard). It must be her — GBP support is gated behind owning a profile, and our
account has none. Wording that gets past first-line triage:

> Manager invitations from my Business Profile are not being delivered. I have tried
> two Gmail addresses and also added a Business Group ID under People and access.
> Neither grants access. This matches the known June 2026 invitation delivery issue.
> Please add [email] as a Manager directly.

**Separately, and regardless:** a single person holding the only credentials to the
most valuable marketing asset the business owns is an operational risk that just cost
us days. Geraldine should add a **second owner** once access works.
