# 05. Questions for the owner (Geraldine)

Opened 2026-10-08, after a read-only scan of the Google Business Profile editor and an
independent SEO audit (`Audit.txt` in the repo root).

Each question says why it matters and what it unblocks. Answers go on the `Answer:` line so
this file stays the record. Nothing in the Google profile should be changed until questions
1 and 2 are settled, because adding or changing an address can trigger re-verification.

Status key: `[ ]` open, `[x]` answered.

---

## A. Google Business Profile (decides the map-pack ranking)

### [ ] 1. Is there a real base address we can put on the profile, kept hidden from the public?

**What we saw (screenshots, 2026-10-08):** Business location reads "No location; deliveries and
home services only", and the service area is "Florida, USA". With no address on file, Google
appears to anchor the listing at the middle of the service area, which is why the public pin
sits in the middle of the state. That is the most likely cause of weak Broward map results.
(Likely, not confirmed.)

**Why it matters:** For a service-area business, an address kept hidden from customers is
allowed. It gives Google a real starting point. Without one, the map-pack work below is
mostly wasted.

**Already known (from `docs/a2p-compliance-handoff.md`, section 4.8):** the LLC's registered
principal address on the Florida record is a residential apartment in Coral Springs, which is
also the registered agent's home. So the likely base is Coral Springs, and the question is no
longer "where" but "may we use it".

**What we need:**
- Her OK to add that address to the Google profile as a **hidden** service-area address (it
  is never shown to customers; the website already shows only "Coral Springs, FL").
- Confirmation that the work really is run from there (a mailbox or virtual office is not
  allowed and can get the profile suspended).
- That she understands Google may ask for re-verification (usually a short video).

**Unblocks:** which city the map pack can be won in, the city pages, the citations.

Answer:

### [ ] 2. Can we narrow the service area from "Florida" to Broward County?

> **Status 2026-10-09: her answer is recorded below, but the website changes made from it
> were reversed at Inaam's request, pending a discussion.** The site currently describes the
> service area as before (Fort Lauderdale and Broward County in text; Broward, Miami-Dade and
> Palm Beach counties in the schema; the booking ZIP gate unchanged). Nothing below is live.

**Why it matters:** "Florida" is too wide to mean anything to Google. A county, or up to 20
named cities, tells it where to show the business. To be decided together with question 1.

Answer (WhatsApp, 2026-10-08): all of Broward County, with 19 cities (Coconut Creek, Coral
Springs, Dania Beach, Deerfield Beach, Fort Lauderdale, Hollywood, Lauderhill, Margate, North
Lauderdale, Oakland Park, Parkland, Pembroke Pines, Plantation, Pompano Beach, Sunrise,
Tamarac, West Park, Weston, Wilton Manors). Palm Beach County: only Boca Raton, Delray Beach
and Boynton Beach "right now". Miami-Dade County: only Aventura, Golden Beach, Miami Gardens,
Miami Lakes and North Miami Beach. Focus on places about 45 minutes or less from Coral
Springs, and availability depends on the customer's exact address.

Was done in the repo, now reversed: a shared city list (`src/data/serviceArea.ts`, deleted),
the schema `areaServed`, the `/services` intro paragraph and the `llms.txt` area section.
Re-creating them takes about ten minutes once the area is agreed.

**Still to do on the Google profile (manager can do it):** replace "Florida, USA" with this
list. Google allows up to 20 service areas (as understood), and this is 27 places, so enter
"Broward County" as one area plus the 8 outside cities (9 entries). Service-area text on
Google does not move rankings by itself; the address does (see question 1).

**Still open:** the booking form's ZIP gate still accepts every ZIP in all of Miami-Dade and
Palm Beach, much wider than this list. Narrow it to these cities, or leave it wide and decline
by hand?

### [ ] 3. What are the real opening hours?

**Today:** Google says Mon to Sat 8 AM to 7 PM and Sun 8 AM to 5 PM. The website, footer and
structured data say every day 8 AM to 10 PM. The contact page said 6 PM until it was changed
on 2026-10-07.

**Why it matters:** The hours must match everywhere. Mismatches are a trust signal problem.
Once she decides, the website, Google and every directory listing get the same hours.

Answer (2026-10-09, via Inaam): the website's hours are the real hours: **Monday to Sunday,
8:00 AM to 10:00 PM**. Done on the website: footer, schema, contact page, map card, `/privacy`
and `/terms` (the last two said 6 PM), `llms.txt`.

**Still to do on the Google profile (manager can do it):** change Mon to Sat from 8 AM to 7 PM
and Sun from 8 AM to 5 PM, to Monday to Sunday 8:00 AM to 10:00 PM.

### [ ] 4. One public business name

**Today:** Google says "Team Top Cleaning". The website says "Top Cleaning Team". The footer
says "TEAM TOP CLEANING LLC DBA Top Cleaning". A search for the brand also surfaces a different
company, "Top Cleaning and More".

**Already known (A2P brief, section 4.8):** the legal entity is **TEAM TOP CLEANING LLC**
(active, filed 2025-06-13). The Google name "Team Top Cleaning" matches it. Live pages
(footer, Terms, booking consent text) say the trade name is **"Top Cleaning"**, while the
domain, page titles and most copy say **"Top Cleaning Team"**. That is three names in use.

**Still unknown:** which trade name is actually filed. The A2P brief marks this UNVERIFIED.
Check "Fictitious Name Search" on sunbiz.org for "Top Cleaning" and "Top Cleaning Team".

**What we need:**
- The result of that search (or a copy of the filing).
- Her decision: which single trade name customers should see. Recommendation: file "Top
  Cleaning Team" (about $50 on Sunbiz) and use it everywhere, because customers, the domain
  and the SMS wording already use it.

Answer:

### [ ] 5. Does she want the main category changed to "House cleaning service"?

**Today:** the only category visible is "Cleaners".

**Why it matters:** the category is one of the strongest local ranking signals. Changing it
can sometimes prompt re-verification, so it should be done on purpose, after question 1.

**What we need:** her OK, and which extra categories fit what she really does (for example
commercial cleaning, janitorial, handyman).

Answer:

### [ ] 6. Profile description

**Today:** "We are a residential and commercial cleaning company committed to providing clean,
organized, and healthy spaces". It names no place and no service.

**What we need:** her OK for a rewrite naming Fort Lauderdale and Broward County and the main
services. Draft to follow after questions 1 to 5.

Answer:

---

## B. Locations and contact details

### [x] 7. Are Fort Myers and Miami real, staffed locations?

**Today:** the contact page used to say "Florida Regional HQ, Fort Myers & Miami Area
Operations". It was replaced with Broward County on 2026-10-07. The "Join Our Team" form still
has a Fort Myers option.

**Why it matters:** A location only counts for Google if people actually work there. If the
answer is yes, each location needs its own page, address, phone and Google profile. If no,
Broward County everywhere is correct and the Fort Myers option should go.

Answer (inferred from her 2026-10-08 service-area message, not asked in so many words): there
is one base, Coral Springs, and the service area is Broward plus a few nearby cities within
about 45 minutes of it. Fort Myers is not mentioned. **To confirm:** remove the "Fort Myers"
option from the Join Our Team form (`src/blocks/TCJoinTeam/Component.client.tsx`, line 535).

### [ ] 8. The (701) 238-3301 number

**What we found:** it is the WhatsApp chat number on the Google profile (marked primary). It
was removed from the contact page on 2026-10-07 because it was shown as a second phone line.

**What we need:** Is it her WhatsApp business line? Does she want a "Chat on WhatsApp" button
on the website? (The main phone stays (954) 833-4276.)

Answer (2026-10-09, via Inaam): yes, a WhatsApp button on the website is fine. Done: "Chat on
WhatsApp" link on `/contact-us`, in the phone block. Not shown as a second phone number.

---

## C. Claims on the website (legal and trust)

### [ ] 9. The 15% first-booking discount

**Today:** a "Save 15% First Book" badge on the home page hero, and an exit popup offering
15% off with code WELCOME15. The discount was removed in August.

**What we need:** Does the offer still exist? If not, remove the badge and the popup. If it
does, the rules need to be written down.

Answer:

### [ ] 10. "Licensed" and insured

**Today the site says:** "Licensed and insured" (home page and booking descriptions, About
section, structured data), "full liability and worker's compensation coverage" (commercial FAQ),
and "fully insured crews, background checked" (handyman page).

**What we need:**
- What license or registration does the business hold, and in what name?
- Is general liability insurance in place, and does it cover handyman work?
- Does she carry worker's compensation? (Certificates can be requested by commercial clients.)

Anything not confirmed will be removed or reworded.

Answer:

### [ ] 11. Handyman scope

**Today:** the page lists "minor plumbing: leaking faucets, running toilets, shower heads,
P-traps". Plumbing in Florida generally needs a licensed plumber.

**What we need:** which handyman jobs the team actually does and is allowed to do. Anything
doubtful comes off the page.

Answer:

### [ ] 12. Two statements on the service pages that need a real source

- Airbnb page: "several South Florida hosts who have maintained Superhost status".
- Move-out page: "several South Florida landlords and property managers".

**What we need:** are these true, and can she name a client who agrees to be referenced? If
not, they become general statements.

Answer:

---

## D. Growth

### [ ] 13. Where do bookings come from?

**What we need:** the top cities and services in the last 90 days from GoHighLevel. This
decides which city pages are worth building first.

Answer:

### [ ] 14. Google reviews

**Today:** 9 reviews, 5.0 stars. A named local competitor has far more.

**What we need:** will she ask every satisfied customer for a Google review after each job
(a short text with the link)? Target: at least 4 a month. Reviews that mention the service and
the city help most. Do not ask for Yelp reviews. Yelp penalises that.

Answer:

---

## What will happen after the answers

1. Questions 1, 2 and 5: plan and apply the profile changes together, in the right order.
2. Questions 3, 4 and 8: update the website, schema and the profile so they match exactly.
3. Questions 9 to 12: remove or correct claims on the site.
4. Question 7 and 13: decide whether location pages or city pages are the next build.
5. Then the directory listings (Bing, Apple, Yelp, Facebook, Nextdoor, BBB), copied from one
   master record with the agreed name, address, phone and hours.
