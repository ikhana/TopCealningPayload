# Website Corrections — Geraldine's Review (2026-05-21)

Source: "TOP CLEANING WEBSITE CORRECTIONS" PDF (21 slides).

## The honest read

Geraldine is NOT scrapping the platform. She wants a **visual re-skin** —
take everything the new site DOES (booking wizard, recurring, workflows,
account portal) and make it LOOK like the old site: **light, baby blue +
white, friendly fonts, no dark navy**.

Her instinct is correct for the vertical. Cleaning sells "fresh, light,
airy, spotless" — baby blue + white nails it. The dark navy "premium tech
agency" aesthetic we built fights the category. All functional engineering
stays; only the paint + some copy/features change.

## Decisions locked (2026-05-21)

| Question | Decision |
|---|---|
| Canonical email | Use PDF's `topcleaningservicefl@gmail.com` (most recent owner instruction). VERIFY with Geraldine — trivial to flip back. |
| Google review link | Use PDF's `share.google/xOJZoCCgBCXaReT4u`. VERIFY — trivial to flip. |
| Service minimums (slide 16) | ALL services show "Recommended minimum: 3 hours" uniformly |
| Square footage (slide 17) | Google Places address autocomplete + manual sq ft with size-range fallback. NO paid property-data API. |

## Already done ✅

- **Slide 18 — 48h advance notice**: built last session (GHL `allowBookingAfter: 2 days` + dynamic fetch in Step06Schedule). Live.

---

## Sub-stages

### R1 — Design tokens (foundation) `[ ]`

The foundation everything visual sits on. Flip the palette from dark-navy-led to light/baby-blue-led.

- [ ] `src/app/(app)/globals.css` — adjust brand tokens:
  - Keep teal `#17b0ab` as accent
  - Replace deep navy `#0d1b2e` usage with light backgrounds (white / very-light-blue)
  - Introduce baby-blue token (light cyan/blue tint) for section backgrounds
  - `--secondary` currently maps to navy → remap to baby-blue or keep navy ONLY for text where contrast needs it
- [ ] Fonts: revert headings to old style (verify what old site used — likely a friendlier sans). Current: Soleil headings + Poppins body.
- [ ] Audit: grep every TC* block for hardcoded `#0d1b2e`, `var(--color-navy-deep)`, dark backgrounds → replace with light equivalents

**Check in with user after R1 before propagating** — Geraldine should see the new palette on the hero/header before we repaint the whole site.

### R2 — Header re-skin `[ ]` (slides 3, 4, 6)

- [ ] Revert to old header design (light, not dark navy band)
- [ ] Make logo lettering bigger
- [ ] Add **Contact Us** to nav (HOME · SERVICES · JOIN OUR TEAM · CONTACT US · BOOK YOUR CLEANING)
- [ ] Add **social icons** top-right (FB, IG, TikTok) — links in Data section below
- [ ] Top contact bar: show both phone numbers + email + "Now servicing Broward County"

### R3 — Hero re-skin `[ ]` (slide 7)

- [ ] Light background (no dark photo overlay or lighten significantly)
- [ ] Replace stock-woman photo → AI image of lady in Top Cleaning polo (teal/white) — needs image generation
- [ ] New hero phrase: *"At Top Cleaning, we create clean and comfortable spaces so you can focus on what matters most. Our team delivers reliable, detailed, and high-quality cleaning services you can trust."*
- [ ] Keep Residential / Commercial cards + 15% discount badge

### R4 — Content sections `[ ]` (slides 8, 9, 10, 11, 13)

- [ ] **About Us → "Why Choose Top Cleaning"** (slide 8) — remove duplicate, rename. Keep the 4 pillars (Eco-Friendly, Trained Professionals, Insured, Custom Solutions)
- [ ] Keep **Vision / Mission / Values** (slide 9) — no change
- [ ] Maintenance/Guarantee/Discounts row (slide 10): keep design, add the new site's animation, **make 3 boxes equal size**
- [ ] Update **Customized Maintenance Programs** text (slide 11) to the new paragraph
- [ ] "Our Process Is Simple" 3-step (slide 13) — keep
- [ ] "Ready to experience our exceptional cleaning service?" — **remove word "tomorrow"** from the sub-line

### R5 — Services grid `[ ]` (slide 12)

- [ ] Keep grid design + animation
- [ ] Services: Residential, Commercial, Deep Cleaning, Move In/Out, After Party, AirBnB
- [ ] **ADD: Post Construction Cleaning** card

### R6 — Booking wizard changes `[ ]` (slides 14, 15, 16, 17)

- [ ] Step 1: "Who are you?" → **"Contact Information"** (slide 14)
- [ ] Step 2: all service cards → "Recommended minimum: 3 hours" (slide 16)
- [ ] Property step: **Google Places address autocomplete**; sq ft stays manual with size-range fallback (slide 17)
- [ ] **NEW: Zip-code gate** (slide 15) — after contact info, "Where Will The Service Be Taking Place? Enter Zip Code For Pricing." Validate against Broward County zips. If outside → "We don't service this area yet."

### R7 — Terms & policy copy `[ ]` (slides 19, 20)

- [ ] **Terms & Conditions** (slide 19) — replace with new 5-bullet text
- [ ] **Satisfaction Policy** (slide 20) — replace with new paragraph (note: references the service email + 24h photo window)

### R8 — Data / config updates `[ ]` (slides 4, 5)

- [ ] Email → `topcleaningservicefl@gmail.com` across: email templates (×9), GHL workflows, footer, satisfaction policy *(pending Geraldine confirm)*
- [ ] Phone: add second number `701-238-3301` alongside `754-307-4034` in header, footer, templates
- [ ] Google review link → `share.google/xOJZoCCgBCXaReT4u` in review templates 04 + 12 *(pending confirm)*
- [ ] Service area copy → "Broward County, Florida" everywhere ("Now servicing your area" badge → "Now servicing Broward County")
- [ ] Social URLs:
  - Facebook: `https://www.facebook.com/profile.php?id=61567295163475`
  - Instagram: `https://www.instagram.com/topcleaning_team`
  - TikTok: *(PDF reused the IG link — get the real TikTok URL from Geraldine)*

---

## Proposed sequence

1. **R8 data + R4/R7 copy** first — low-risk, ships immediately, visible progress (hours of work)
2. **R1 design tokens** — the foundation Geraldine cares most about. Check in after.
3. **R2 / R3 / R4 / R5** — propagate the re-skin across header, hero, sections, services
4. **R6 booking changes** — zip gate is the only net-new feature (rest are tweaks)

## Open items needing Geraldine

- Confirm canonical email (service@ vs fl@)
- Confirm Google review link
- Real **TikTok URL** (PDF reused the Instagram link)
- Old-site **font** name (so we match exactly) — or approve a close friendly sans
- Approve the AI-generated hero image once produced

## What does NOT change

Everything functional: booking submission, recurring series, GHL sync,
abandoned recovery, account portal, email workflow logic. This is paint +
copy + two small features (zip gate, address autocomplete).
