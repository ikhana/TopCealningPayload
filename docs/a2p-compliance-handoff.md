# Top Cleaning Team: A2P 10DLC Compliance Brief

**Owner:** Inaam, Lead Developer / CTO, BrandBloom
**Client:** Top Cleaning Team (topcleaningteam.com)
**Platform:** HighLevel / LeadConnector (Twilio path, `30xxx` rejection codes)
**Status:** nothing submitted. No campaign exists. No SMS is currently sent.
**Date:** 2026-08-20

Companion documents, same rulebook:
- `SmplAPP/a2p-compliance-handoff.md` (SMPL, RingCentral path, approved 2026-08-12)
- `SmplAPP/a2p-progress.md` (worked example of the audit discipline)
- `brandbloom-a2p-payload-brief.md` (BrandBloom, HighLevel path)

---

## 1. Why this document is strict

A HighLevel user posted in mid-2026 that their A2P campaign was approved only
after **eight months** of rejections. That is not bad luck. It is the predictable
output of the normal workflow:

> Get rejected, read the stated reason, fix that one thing, resubmit, get rejected
> on the *next* thing the reviewer noticed, repeat.

**Reviewers stop at the first failure.** They do not produce a complete defect
list. The rejection code tells you where they stopped reading, not what is wrong
with the submission.

**Therefore: the rejection code is not a task list.** Every submission is preceded
by a full audit against section 6.

**Top Cleaning has an advantage the other two did not: nothing has been submitted
yet.** No rejection history, no burned attempts, no 808 lockout risk. A first
submission that passes is worth more here than anywhere else, because the whole
cost of this discipline gets paid before the first review rather than after the
fifth.

The SMPL remediation is the proof: full audit, three campaign-fatal issues found
that the rejection notice never mentioned, approved on the next attempt.

---

## 2. Operating principles

**Verify, never assume.** Read the actual file or the actual rendered page. Every
finding in section 4 states how it was established.

**Label every claim.** `VERIFIED` (read the file or fetched the page, with the
reference), `UNVERIFIED` (checkable, not yet checked), `INFERENCE` (reasoned from
verified facts, not stated by any source).

**Report before changing** anything touching business decisions: service
offerings, pricing claims, legal entity naming.

**Never fabricate compliance status.** The submission includes an attestation
checklist. Do not tick an item that cannot be demonstrated.

**Distinguish TCPA-safe from carrier-safe.** See section 3.

**Test behaviour, not configuration.** A settings panel saying a field is optional
is not evidence. Submitting the form with the box unticked is evidence.

---

## 3. Core concept: two rulebooks pulling opposite directions

| | TCPA | CTIA + carrier rules |
|---|---|---|
| What it is | Federal law | Industry standards enforced by carriers |
| Enforced by | FCC, private litigation | AT&T, T-Mobile, Verizon (filtering, campaign rejection) |
| Wants | Broadest disclosed scope you can get agreement to | Narrowest, most specific, obviously optional consent |
| Penalty | $500 to $1,500 per message | Campaign rejected, traffic blocked |

**A2P registration only measures the second one.**

Top Cleaning has an advantage here too: the site carries **no** TCPA-defensive
boilerplate. The "automated technology / Do Not Call Lists" block that is
carrier-fatal for BrandBloom does not exist on this site. `VERIFIED` by grep
across `src/`.

That is the good news and the bad news. There is no toxic language to remove.
There is also no consent language of any kind.

---

## 4. Verified current state

### 4.1 The structural problem: consent is collected after the phone number is used

`VERIFIED` (`docs/ABANDONED_BOOKING.md:11`): "Step 1 of the wizard fires a
background request to `/api/ghl/lead-capture`". The phone number reaches the CRM
at Step 1 and the contact is tagged `website-lead`.

`VERIFIED` (`docs/ABANDONED_BOOKING.md:31`): the abandoned-booking workflow is
triggered by that `website-lead` tag.

`VERIFIED` (`src/components/booking/BookingAgreement.tsx`): the only agreement
checkbox in the wizard sits on the **last** step, and its label reads "I have read
and agree to the [Terms]". It is a terms acceptance, not an SMS consent.

**INFERENCE, and it is the most important line in this document:** every abandoned
lead's phone number is already in GHL with **no consent of any kind**, because by
definition an abandoned booking never reached the last step. The planned abandoned
booking SMS sequence would therefore text people who never opted in to anything.

That is not a checkbox-wording defect. It is a sequencing defect. It is
campaign-fatal if declared honestly, and a TCPA exposure if not.

**The SMS consent checkbox has to live on Step 1, beside the phone field.** Any
other placement makes the abandoned-booking SMS unsendable.

### 4.2 No SMS consent language exists anywhere

`VERIFIED` (grep across `src/` for `sms`, `text message`, `opt-in`, `consent`,
`STOP`, `message and data`): zero relevant matches. The only hit is an unrelated
"Text Message" option in a preferred-contact-method dropdown on the careers form.

**Five forms collect a phone number.** `VERIFIED` by grep:

| Form | File |
|---|---|
| Booking wizard, Step 1 | `src/components/booking/sections/Step01Customer.tsx` |
| Booking form block | `src/blocks/TCBookingForm/Component.client.tsx` |
| Contact form | `src/blocks/TCContactForm/Component.client.tsx` |
| Contact form (generic) | `src/blocks/ContactForm/Component.client.tsx` |
| Join our team | `src/blocks/TCJoinTeam/Component.client.tsx` |

Section 6.1 applies to **all five**, not just the declared opt-in form. Reviewers
crawl the site.

This maps to simultaneous failures 30925 (no checkbox), 30924 (no disclosures at
point of consent) and 30913 (no marketing / non-marketing split), before a
reviewer even reaches the legal pages.

### 4.3 Privacy policy has no mobile carve-out

`VERIFIED` (fetched `https://www.topcleaningteam.com/privacy`, counted occurrences):

| Term | Occurrences |
|---|---|
| `SMS` | **0** |
| `text messag` | **0** |
| `opt-in` / `opt in` | **0** |
| `mobile` | 1 |

The policy does contain "We do not sell, rent, or trade your personal information
to third parties" and a "We may share your information only with:" list.

**That is not sufficient.** The required clause is specifically about mobile opt-in
data. Its absence is the exact defect that rejected SMPL (7103 on the TCR path,
30896 umbrella on the Twilio path). SMPL's approval came only after this clause
was present *and* an unqualified exclusion was added ahead of the sharing list.

⚠️ **The registration URL is `/privacy`, not `/privacy-policy`.** `VERIFIED`:
`/privacy-policy` returns **404**. Submitting the wrong URL is rejection code
30891.

### 4.4 Terms of Service is missing all five required clauses

`VERIFIED` (fetched `https://www.topcleaningteam.com/terms`, counted occurrences):

| Required element | Occurrences |
|---|---|
| `STOP` | **0** |
| `HELP` | **0** |
| `START` | **0** |
| `carrier` | **0** |
| `message and data` | **0** |

The page exists and is publicly reachable. It contains none of the messaging
clauses section 6.3 requires.

### 4.5 No SMS is currently sent

`VERIFIED` (`docs/GHL_WORKFLOWS_PLAN.md:283`): "No SMS in Phase 9: A2P 10DLC
registration not done yet. All v1 channels are email + GHL Mobile push for staff.
SMS variants of recovery/reminder workflows added when A2P approves."

That is the correct posture and it should hold until approval. It also means the
use case is declared on the basis of what is *planned*, and the plan must then be
honoured exactly.

`VERIFIED` planned SMS, from `GHL_WORKFLOWS_PLAN.md` and `ABANDONED_BOOKING.md`:

| Message | Character |
|---|---|
| Abandoned booking 1hr / 24hr / 72hr | **Promotional** |
| Booking reminder | Transactional |
| Payment authorisation failure | Transactional |
| Review request after service | Marketing-adjacent |

Both categories are present, which decides the use case. See section 5.

### 4.6 Website issues

`VERIFIED` (grep `src/`, and live fetch):

- **Geography contradicts itself.** `src/blocks/TCContactMap/Component.client.tsx:134`
  reads "Fort Myers & Miami Area Operations", and the `/privacy` and `/terms` page
  titles both read "Top Cleaning Fort Myers & Miami, FL". The declared service area
  everywhere else is Broward, Miami-Dade and Palm Beach. Fort Myers is on the
  opposite coast. `src/blocks/TCJoinTeam/Component.client.tsx:484` offers
  "Fort Myers" as a location option.
- **No legal entity name appears anywhere on the site.** No LLC, Inc or d/b/a
  disclosure. Section 6.4 requires it, and the brand registration requires a legal
  name that matches.
- **Leftover storefront routes are live.** `/shop` returns 200 and `/find-stores`
  returns 200. `src/components/StoreLocator/StoreLocator.tsx:343` renders
  "Google Maps integration coming soon". These are Payload template scaffolding
  with no relationship to a cleaning business. A crawling reviewer finding a
  half-built shop reads as 30919, website lacks sufficient business information.
- **No `href="#"` dead links.** `VERIFIED` by grep. This one is clean.
- **No prohibited-category content.** `INFERENCE` from the service list: no
  cannabis, lending, gambling or adult content exists on this site.

### 4.7 Business name mismatch (shared with the SEO work)

`VERIFIED` (resolved the Google Business Profile share link): the GBP business
name is **"Team Top Cleaning"**. The website, schema and domain all say
**"Top Cleaning Team"**.

For A2P this matters twice: the brand registration must carry the legal name, and
a reviewer comparing the registered name against the site sees two businesses.

**This now blocks two workstreams.** The legal registered name is needed for the
NAP fix and for the brand registration.

### 4.8 Registration identity, confirmed 2026-08-20

`VERIFIED` (supplied by Geraldine, and corroborated by the GHL location record):

| Field | Value |
|---|---|
| Legal entity | **TEAM TOP CLEANING LLC** |
| EIN | **39-4300652** |
| Address | 8802 NW 38th Dr, Coral Springs, FL 33065 |
| GHL account name | Top Cleaning Team |

**This resolves section 5 in favour of Standard Brand.** An EIN exists, so Sole
Proprietor is not forced and promotional messaging stays available. The
abandoned-booking sequence is viable.

**It also reverses the assumption in section 4.7.** The Google Business Profile
name "Team Top Cleaning" matches the legal entity. **The website is the one that is
wrong**, not the profile. Do not rename the GBP listing.

The correct fix is a DBA disclosure: the site trades as "Top Cleaning Team" on the
domain `topcleaningteam.com`, and must disclose that it is a d/b/a of TEAM TOP
CLEANING LLC. Section 6.4 requires the alternate name to be disclosed, and the
brand registration must carry the legal name exactly as the IRS holds it or brand
vetting fails on a name mismatch.

Coral Springs is in Broward County, which is consistent with the declared service
area.

### 4.9 Timezone defect (not A2P, found during this audit)

`VERIFIED` (GHL API, `/locations` and `/calendars`):

- Calendar "Top Cleaning Round Robin" has **no timezone set** and inherits the account
- Account timezone is **`America/Cancun`**
- `.env` sets `GHL_CALENDAR_TIMEZONE=US/Eastern`
- `submit-flow.ts:582` sends the datetime **without an offset**, so GHL interprets
  it in the calendar timezone
- `submit-flow.ts:121` and `:132` format the confirmation email in
  `America/New_York`

`America/Cancun` is GMT-5 year round and does not observe daylight saving. Florida
does. Measured at the time of writing: New York 10:06 EDT, Cancun 09:06 EST.

**Consequence:** a booking made for 11:00 is written to the calendar as 12:00
Florida time, while the confirmation email tells the customer 11:00. Wrong for
every booking since March, self-correcting in November when EST resumes, which is
why it would never be diagnosed from the symptom.

**Fix, both halves:**
1. Set the GHL account (or the calendar explicitly) to `America/New_York`. Check
   existing appointments after the change; they may shift.
2. Send an explicit UTC offset from `submit-flow` so correctness stops depending
   on a CRM setting nobody audits.

Also shifts the "no SMS before 8am / after 9pm" quiet-hours rule by an hour, which
matters once SMS is live.

### 4.10 Unverified, do not act on without checking

- Whether all five phone-collecting forms post to GHL, or whether some are inert.
  Only the booking wizard path was traced.
- Whether `/shop`, `/products`, `/cart` and `/orders` are linked from any
  navigation, or merely reachable by direct URL.
- Whether the LLC has a registered DBA filing for "Top Cleaning Team", or whether
  the trading name is informal. Affects how the disclosure should be worded.

---

## 5. Campaign type recommendation

### Brand registration

**Standard Brand, if an EIN exists.** `UNVERIFIED` whether it does.

If there is no EIN the only route is **Sole Proprietor**, and that is a materially
worse position: one campaign only, very low throughput, and promotional messaging
is generally not permitted. The abandoned-booking sequence, which is the entire
commercial reason for wanting SMS, would not be sendable.

**This is the first question to answer.** Everything below assumes Standard Brand.

### Use case: **Low Volume Mixed**

Reasoning, in order:

**It must be a Mixed variant, not Customer Care and not Marketing.**
`VERIFIED` from section 4.5 that both transactional (booking reminders, payment
failure) and promotional (abandoned booking recovery) messages are planned.
Declaring Customer Care and then sending abandoned-cart nudges is a 30893 sample
mismatch. Declaring Marketing alone would misdescribe the reminders and forfeit the
transactional path.

**Low Volume rather than Standard, on measured volume.** `VERIFIED` via the GHL
API: 100 contacts total, CRM history 2026-05-22 to 2026-08-05. Even at ten
messages per customer per month this sits well inside the Low Volume ceiling. Low
Volume Mixed is cheaper and typically clears review faster.

**INFERENCE on the trade-off:** Low Volume campaigns carry lower throughput and can
attract slightly heavier carrier filtering than a Standard Mixed campaign. At this
volume that is not a constraint. If the business grows past roughly a few thousand
messages a month, moving to Standard Mixed is a new campaign submission, not an
edit. Worth knowing before choosing.

**Confirm the current fee schedule inside the HighLevel A2P wizard rather than
trusting any figure quoted from memory, including mine.**

### What must be declared

- **Opt-in method:** web form only. One method, described specifically.
- **Opt-in URL:** `https://www.topcleaningteam.com/booking`, a real page with
  business context. Not a `link.` widget URL. That was the failure that hurt
  BrandBloom.
- **Website URL:** `https://www.topcleaningteam.com`, with the scheme and the
  `www`. The apex 308-redirects to www, so declaring the apex sends a reviewer
  through a redirect for no reason.
- **Privacy policy URL:** `https://www.topcleaningteam.com/privacy`. Not
  `/privacy-policy`, which 404s.
- **Terms URL:** `https://www.topcleaningteam.com/terms`. A different URL from the
  privacy policy. Verify the registration does not point both fields at one page.

---

## 6. THE CHECKLIST

Every item passes before submission.

### 6.1 Opt-in form mechanics

- [ ] **SMS consent checkbox sits on Step 1, beside the phone field.** Not on the
      final step. See section 4.1. This is the item that unblocks abandoned-booking SMS.
- [ ] A real checkbox exists for SMS consent, not consent bundled into "By
      submitting this form, you agree..."
- [ ] **Two** separate checkboxes: one marketing/promotional, one
      service/transactional
- [ ] Both unchecked on page load, never pre-selected
- [ ] Both optional. The form submits successfully with both unticked. **Verify by
      actually submitting.**
- [ ] Phone field may be required; consent checkboxes may not be
- [ ] Checkbox wording references the actual message types from the campaign
      description, not generic "marketing messages"
- [ ] All five disclosures are present **in the consent panel**: message type,
      frequency, message and data rates, STOP, HELP

      **Placement, not repetition.** Researched during the SMPL remediation: the
      rule is "clear and conspicuous text directly adjacent to the consent
      mechanism, on the same screen as the checkbox, before the user submits, not
      behind a link, collapsed accordion, or in a footer". Nothing requires
      duplicating the boilerplate inside each label.

      **What we built:** message type and brand name sit in each checkbox label
      (that is what separates marketing from service consent, and HighLevel's DBA
      guidance wants the brand in the CTA). Frequency, rates, STOP, HELP and the
      Privacy/Terms links sit once, in a shared block directly below both
      checkboxes.

      One source phrases it "adjacent to *each* consent mechanism", so a pedantic
      reviewer could object. SMPL kept full repetition because it had a single
      clean attempt left. Top Cleaning has used none, and this is a booking funnel
      where two 40-word labels cost conversions. Accepted trade-off.

      ⚠️ The shared block must stay on the page. Compliance is ongoing, not a
      one-time gate: carriers spot-check and complaints trigger re-review.
      Swapping one compliant layout for another is fine; removing the disclosures
      is not.
- [ ] Privacy Policy and Terms links visible on the form page
- [ ] Consent values reach GHL as contact custom fields, not silently dropped
- [ ] The `/api/ghl/lead-capture` Step 1 payload carries the consent values
- [ ] GHL workflows honour the values: abandoned-booking and review-request
      sequences gated on marketing consent, reminders on service consent
- [ ] Applied to **all five** phone-collecting forms in section 4.2
- [ ] No stale duplicate forms carrying old language

**Approved checkbox copy** (as built, and what the other four forms must match):

> **Service / transactional:** I agree to receive account and service text messages
> from Top Cleaning Team, such as booking confirmations, appointment reminders, and
> replies to my enquiry.

> **Marketing:** I agree to receive marketing and promotional text messages from
> Top Cleaning Team about cleaning services, offers, and updates.

**Shared disclosure block**, directly below both checkboxes, inside the same panel:

> Message frequency varies. Message and data rates may apply. Reply STOP to opt out
> or HELP for help. See our [Privacy Policy](/privacy) and
> [Terms of Service](/terms).

Nothing else. No "by submitting this form, you consent" phrasing anywhere, which
contradicts optional consent regardless of what the checkboxes say.

**Suggested field names:** `sms_service_consent`, `sms_marketing_consent`

**Priority ordering if scope is ever cut** (carried from the SMPL research):
unbundling is **mandatory**; the marketing/transactional split is **defensive
depth**. Cut the split, never the unbundling. And never cut the Step 1 placement,
which is a correctness issue rather than a compliance nicety.

### 6.2 Privacy policy (`/privacy`)

- [ ] Add the non-sharing clause. Prescribed language:
      *"No mobile information will be shared with third parties/affiliates for
      marketing/promotional purposes. Information sharing to subcontractors in
      support services, such as customer service, is permitted. All other use case
      categories exclude text messaging originator opt-in data and consent; this
      information will not be shared with any third parties."*
- [ ] Add an **unqualified** exclusion ahead of the existing "We may share your
      information only with:" list. SMPL's rejection survived the prescribed clause
      alone because the carve-out came after the sharing list and was qualified with
      "for their own marketing purposes". Put the absolute sentence first and make
      the list subject to it.
- [ ] Does not mention affiliation, selling, or buying of leads anywhere
- [ ] Does not name referral partners, resellers or affiliates as data recipients
- [ ] "Last updated" date current and consistent everywhere it appears
- [ ] Publicly accessible, no login
- [ ] URL exactly matches the registration

### 6.3 Terms of Service (`/terms`)

All five clauses are currently **absent**. All five must be added:

- [ ] **Business identity.** Legal company name and a description of the messages
      users can expect
- [ ] **Opt-out and support.** STOP cancels, confirmation message sent, START to
      rejoin, HELP for assistance, plus support email or phone number
- [ ] **Message frequency.** Rates may apply, stated frequency, contact wireless
      provider for plan questions
- [ ] **Privacy policy link.** Direct to `/privacy`, not the homepage
- [ ] **Carrier liability.** Carriers not liable for delayed or undelivered messages
- [ ] Separate URL from the privacy policy

### 6.4 Website

- [ ] Legal business name and contact details displayed: address, email, phone
- [ ] Any DBA or alternate business name disclosed
- [ ] **Resolve the Fort Myers contradiction** in `TCContactMap`, both legal page
      titles, and the careers form location list
- [ ] **Resolve the "Team Top Cleaning" vs "Top Cleaning Team" mismatch** against
      the legal registered name
- [ ] **Deal with `/shop` and `/find-stores`.** Remove them, or make them real. A
      live half-built storefront on a cleaning company site is 30919 material.
- [ ] No placeholder content: "coming soon", lorem ipsum, TODO, scaffold text
- [ ] No `href="#"` or dead links (currently clean)
- [ ] No 404s on internal links
- [ ] No fake testimonials or invented client logos (30962, non-resubmittable)
- [ ] Site content supports the stated use case

### 6.5 Prohibited categories

Cannabis/CBD, loan marketing and high-risk lending, third-party lead generation
and MLM, gambling, adult content, deceptive marketing.

**Assessment: no exposure.** Cleaning services are unrestricted, and none of these
categories appear on the site or in linked content. This is the one section where
Top Cleaning is materially safer than either SMPL or BrandBloom.

### 6.6 Campaign submission fields

- [ ] Use case matches what the samples and site actually show
- [ ] Campaign description states the **consent path**: who ticks what checkbox at
      what URL with what wording. Not just what messages get sent.
- [ ] Description matches the live site exactly
- [ ] No language implying consent is required to submit
- [ ] No "prospective clients" or cold-outreach phrasing
- [ ] Opt-in URL is a real page on the main domain
- [ ] All opt-in methods named individually with specific URLs
- [ ] Website URL includes `https://` and the `www`, and resolves
- [ ] Promotional sample genuinely promotional, transactional sample genuinely
      transactional
- [ ] Business name in at least one sample; opt-out language in at least one sample
- [ ] **Every claim in a sample message is substantiated on the destination page**,
      including pricing and discount claims. The recurring discounts (20/15/10 per
      cent) and the $120 minimum must be visible on the site if a sample mentions
      them.
- [ ] Embedded-content checkboxes (link / phone) match what the samples contain.
      **Cannot be changed post-submission without a new campaign.**
- [ ] Any keyword in a sample is declared in the keyword config
- [ ] HELP response contains brand name plus phone or email, and any URL resolves
- [ ] Opt-in confirmation message includes brand, rates, frequency, HELP, STOP

---

## 7. Rejection code reference (Twilio / HighLevel path)

| Code | Meaning |
|---|---|
| 30889 | Embedded link/phone declared but absent from samples |
| 30890 | HELP response missing brand name, phone, or email |
| 30891 | Invalid or non-functioning URL |
| 30893 | Sample messages do not match the use case |
| 30896 | Opt-in workflow insufficient, or opt-in shared with third parties |
| 30913 | Marketing consent not collected separately from transactional |
| 30916 | Lead generation vs lead nurture mismatch |
| 30917 | Multiple opt-in methods listed but not all described |
| 30919 | Website lacks sufficient business information |
| 30923 | Consent bundled into mandatory terms |
| 30924 | Missing required disclosures at point of consent |
| 30925 | Opt-in form missing checkbox |
| 30931 | Form mechanics prevent declining messaging |
| 30940 | Cannabis. **Non-resubmittable** |
| 30942 | Loan marketing. **Non-resubmittable** |
| 30951 | Third-party lead generation / MLM. **Non-resubmittable** |
| 30962 | Deceptive marketing / fake endorsements. **Non-resubmittable** |
| 808 | 5+ declines without sufficient updates |

---

## 8. Task queue

**Task 1. Consent checkboxes on Step 1** of the booking wizard, per 6.1. Wire the
values through `/api/ghl/lead-capture` so they exist on the contact from the first
request, and through `submit-flow` on completion. This is the task that makes the
abandoned-booking sequence legal.

**Task 2. Consent checkboxes on the other four forms** in section 4.2.

**Task 3. Privacy policy.** Add the non-sharing clause and the unqualified
exclusion ahead of the sharing list, per 6.2.

**Task 4. Terms of Service.** Write all five clauses, per 6.3.

**Task 5. Website sweep.** Fort Myers contradiction, legal name, entity disclosure,
`/shop` and `/find-stores` decision. Report before changing anything with a
business dimension.

**Task 6. Workflow gating in GHL.** Marketing sequences gated on
`sms_marketing_consent`, service sequences on `sms_service_consent`. A contact who
ticked service only must not enter the abandoned-booking sequence.

**Task 7. Registration.** Only after tasks 1 to 6 ship and are verified live.

**Do not submit until every section 6 item passes.**

---

## 9. Open items (not code)

| Item | Owner | Why it matters |
|---|---|---|
| ~~EIN~~ | ✅ | **Resolved 2026-08-20.** 39-4300652. Standard Brand is available. |
| ~~Legal name~~ | ✅ | **Resolved 2026-08-20.** TEAM TOP CLEANING LLC. GBP is correct; the website needs the DBA disclosure. |
| ~~Business address~~ | ✅ | **Resolved 2026-08-20.** 8802 NW 38th Dr, Coral Springs, FL 33065. |
| Is "Top Cleaning Team" a filed DBA? | Geraldine | Decides whether the site discloses "d/b/a" or just names the parent LLC. |
| Fort Myers references | Geraldine / Inaam | Either the service area is wrong on the site or the legal page titles are. Cannot attest the site is accurate while both exist. |
| Timezone change on the live GHL account | Inaam / Geraldine | See 4.9. Existing appointments may shift when corrected. Do it deliberately, not mid-week. |
| `/shop` and `/find-stores` | Inaam | Remove or build. Leftover template scaffolding, live to crawlers. |
| Whether review-request SMS counts as marketing | Inaam | Decides which consent flag gates it. Treat as marketing unless there is a reason not to. |

---

## 10. Sources

- HighLevel: *How to get your phone number A2P approved in 2026*,
  `help.gohighlevel.com/support/solutions/articles/155000007237`
- HighLevel: *A2P Campaign Rejections, Required Fixes & Vetting Errors*,
  `help.gohighlevel.com/support/solutions/articles/155000007572`
- CTIA Messaging Principles and Best Practices
- `SmplAPP/a2p-compliance-handoff.md` and `SmplAPP/a2p-progress.md`, the approved
  worked example
- `brandbloom-a2p-payload-brief.md`
