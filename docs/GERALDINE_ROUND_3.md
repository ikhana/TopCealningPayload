# Geraldine corrections, round 3

Source: Google Slides deck "CORRECTIONS & RECOMMENDATIONS FOR WEBSITE ONLY ONE", slides
received 2026-10-18. This file records **what she is asking**, how it compares to what is
already built, and what we need to decide before building. Nothing here has been
implemented yet.

Her slides are **visual references**, not designs to copy. We take the requirement, not the
styling of her mockups.

Status of the deck: the Custom Hourly spec is complete (sections 1 to 6). Nothing else is
known to be outstanding, but ask Inaam if any slide is still to come.

---

## Progress

**Phase 1 built 2026-10-18** (sections 3 and 4, plus the removal in section 7):

- Regular: Bedroom $20, Full Bathroom $30, new combined "Kitchen, Living & Dining Area" $70.
- Deep: combined area $100, deep minimum now $200 (was $225, our reading of her "exactly $200").
- The form seeds 1 bedroom + 1 full bathroom + 1 combined area when an area-priced service is chosen (Regular $120, Deep $200).
- Legacy areas (kitchen, living room, dining room, office) are migrated when a saved draft is resumed, so old abandoned-booking links do not charge for rooms the picker no longer shows.
- The "Want Something Custom?" prompt is removed from Step 4. The hourly panel stays in the code, unreachable, until Custom Hourly is rebuilt as its own category.

**Still to build:** section 5 (size bands), section 6 (Severe and Estate quote path), section 7 (Custom Hourly category), section 8 (deposit). Blocked on her answers: hourly rate and deposit (and how size stacks with the condition surcharge).

---

## 1. Summary

| # | Ask | Against current code | Size |
|---|-----|----------------------|------|
| A | "Booking Confirmed" becomes "request received, we will contact you in 24h" | **Already done** (`request-not-confirmed`) | none |
| B | Add-on price table | **Already done** (`addon-pricing`), 4 questions still open | none |
| C | Regular: Bedroom $20, Full Bath $30, new combined "Kitchen, Living & Dining Area" $70 | **New, changes prices** | medium |
| D | Auto-select 1 Bedroom + 1 Full Bath + 1 Kitchen/Living/Dining on open (total $120) | **New** | small |
| E | Deep: KLD $100, Bedroom $40, Full Bath $60, standard config = exactly $200 | **New, changes prices and the deep minimum** | medium |
| F | Replace the sq ft box with size bands S / M / L / XL / Oversized / Estate | **New, reverses an earlier decision** | large |
| G | Severe Condition option, forces Custom Quote, no auto booking | **New, needs a quote-request path** | large |
| H | Custom Hourly Cleaning as its **own service category**, remove the "Want Something Custom?" block | **New, conflicts with what is built** | large |
| I | $30 booking deposit on hourly bookings | **New, payments are switched off** | large |

---

## 2. Already done, confirm only

**A. Request received, not confirmed.** Slide title says "Handyman correction" but the
screenshot is the generic success screen. We applied the wording to every service. Heading
is now "Request Received", body says someone will contact them within 24 hours.
Still wrong on the **GoHighLevel side**: the confirmation email still reads
"you're all set" (see section 8).

**B. Add-on price table.** Implemented. Open questions that are still with Geraldine:
baseboards ($40 "Detail" in the table vs her WhatsApp "$25 per room"), Basement $45,
and whether Garage Sweep, Change Bed Linens, Air Vents and Window Tracks are real
services. Dishes was later replaced by Small $10 / Medium $20 / Large $30.

---

## 3. Regular cleaning adjustments

### 3.1 What she asked

1. Combine **Kitchen + Living Room + Dining Room** into one selection:
   **"Kitchen, Living & Dining Area", $70**.
2. Update prices:
   - Bedroom **$20** (was $25)
   - Full Bathroom **$30** (was $35)
   - Kitchen, Living & Dining Area **$70**
3. When the booking form opens, these are **pre-selected**:
   1 Bedroom $20, 1 Full Bathroom $30, 1 Kitchen/Living/Dining $70. **Starting total $120.**
4. Replace the manual "Approx. Size (sq ft)" box with selectable size bands (section 5).

### 3.2 Current code

`ROOM_PRICES` in `src/data/pricing.ts`: bedroom 25, fullBathroom 35, kitchen 40,
livingRoom 20, diningRoom 15 (regular). Nothing is pre-selected. Minimum booking is $120.

### 3.3 Checks and consequences

- Her numbers are self-consistent: 20 + 30 + 70 = **$120**, which is the existing regular
  minimum. So the default selection lands exactly on the floor.
- Old vs new regular totals:

  | Home | Old | New |
  |------|-----|-----|
  | 1 bed, 1 bath, kitchen + living | $120 | $120 |
  | 2 bed, 2 bath, KLD (her slide example) | n/a | $170 |
  | 3 bed, 2 bath, kitchen + living | $205 | $190 |
  | Any home with **no dining room** | kitchen + living = $60 | KLD = $70 (**+$10**) |

- The combined area is a flat $70 whether or not the home has a dining room. That is her
  stated intent. Flagging it because it raises the price for homes without one.
- Pre-selecting areas means the Step 3 validation "at least one area" is satisfied from
  the start. That is fine, but a customer can click through without ever looking. Worth
  knowing, not worth fighting.
- Unchanged and not mentioned: Half Bathroom $20, Family Room $20, Laundry $15,
  Stairs/Hallway $15, Patio/Balcony $25. We assume they stay.

### 3.4 Open questions

- Should the combined area have a quantity stepper (a home with two kitchens), or be a
  simple on/off? Recommend keep the stepper, cap low.
- Old bookings stored `kitchen`, `livingRoom`, `diningRoom`. Keep those keys in the price
  table so history still prices and renders, hide them from the picker (same approach as
  Office).

---

## 4. Deep cleaning

### 4.1 What she asked

Area prices:

- Kitchen + Living + Dining: **$100**
- Each Bedroom: **$40**
- Each Full Bathroom: **$60**

"The minimum standard Deep Cleaning configuration (1 bedroom, 1 bathroom, up to 1,000
sqft, Well Maintained) should calculate to exactly **$200**."

Square footage adjustment applies to Deep too (same bands as section 5), applied to the
base price from the selected areas.

### 4.2 Current code

Deep: bedroom 40, fullBathroom 60, kitchen 80, livingRoom 45, diningRoom 35.
`MINIMUM_BOOKING.deep = 225` with a `TODO: confirm with Geraldine`.

### 4.3 Checks and consequences

- 100 + 40 + 60 = **$200**. Consistent with her statement.
- This **resolves the old TODO**: the deep minimum was inferred as $225 from the old
  1 bed / 1 bath package (40 + 60 + 80 + 45). With her new numbers the standard config is
  $200, so the deep minimum should become **$200**. Confirm with her.
- Big change in the combined area: old kitchen + living + dining in deep was
  80 + 45 + 35 = **$160**. New is **$100**, a drop of $60 per deep clean.
  3 bed / 2 bath deep: old $365, new $340.
- Half Bathroom (deep $35), Family Room, Laundry, Stairs, Patio deep prices are not
  mentioned. Assume unchanged.

### 4.4 Open question

- She wrote "Well Maintained" and, on the next slide, "Well Maintained, Moderate Buildup,
  and Heavy Buildup". Our labels are **Generally Maintained / Needs Extra Attention /
  Heavy Buildup: Needs Significant Attention**. Is she paraphrasing, or does she want the
  labels renamed? Pricing logic would not change either way.

---

## 5. Property size bands (replaces the sq ft input)

### 5.1 What she asked

Replace the manual "Approx. Size (sq ft, optional)" input with a dropdown or selectable
options:

| Band | Sq ft | Adjustment |
|------|-------|------------|
| S, Small | up to 1,000 | none (base price) |
| M, Medium | 1,001 to 1,500 | +10% |
| L, Large | 1,501 to 2,000 | +20% |
| XL, Extra Large | 2,001 to 2,500 | +30% |
| Oversized | 2,501 to 2,999 | +40% |
| Estate | 3,000+ | **Custom Quote Required** |

Formula: **Subtotal of selected cleaning areas x size multiplier = adjusted cleaning
price.** The total must update immediately when size or areas change.

Her worked example (new Regular prices): 2 bedrooms $40 + 2 bathrooms $60 + KLD $70 =
**base $170**. Small $170, Medium $187, Large $204, Extra Large $221, Oversized $238
(she wrote only "40% more"), Estate custom quote.

Applies to Regular and Deep.

### 5.2 Current code

`property.squareFootage` is a free number. It does **not** affect price. It only feeds the
time estimate (`estimateHours`, sqft / 500) and is saved on the booking and to the GHL
booking object.

### 5.3 This reverses an earlier instruction

2026-08-20: "we are not using the square based prices any more... we can still use the
square footage, but mainly for the time estimation rather than the price calculation."
She is now deliberately bringing size back as a price multiplier, through bands instead
of an exact figure. Not a conflict to resolve, but the doc comment in `pricing.ts` that
says sqft never affects price will need rewriting.

### 5.4 Decisions needed (these change the price)

1. **How does size combine with the home-condition uplift (+25%)?** Both are percentages
   on the same area subtotal. Example, base $170, Large (+20%) and Needs Extra Attention
   (+25%):
   - additive (1 + 0.20 + 0.25): **$246.50**
   - compounding (1.20 x 1.25): **$255.00**

   $8.50 apart on a small job, more on a big one. She has not said. Recommend
   **compounding**, because each factor describes a separate reason the job is larger and
   multiplying is how percentage surcharges normally stack, but this is her call.
2. Does the size multiplier apply to the **minimum booking** floor? Recommend the floor
   applies after the multiplier, as it does for the condition uplift today.
3. Does it apply to **add-ons**? Her formula says "selected cleaning areas", so no.
   Recommend areas only, consistent with the condition uplift rule.
4. **Required or optional?** Today sq ft is optional. A required band is safer for price
   accuracy (a skipped field would silently mean "Small"). Recommend required.
5. Estate: custom quote, so no automatic price and no automatic booking, same handling as
   Severe (section 6).

### 5.5 Knock-on effects

- Time estimate: a band replaces an exact number. Use the **upper bound of the band** for
  `estimateHours` so the crew is never under-scheduled. Estate has no upper bound.
- `squareFootage` is stored as a number on the booking and sent to the GHL booking object.
  Store the band as the source of truth and keep deriving a representative number for
  those two places, so the Payload field and the GHL custom object keep working.
- Her mockup shows house illustrations next to each band. Optional visual, not required.

---

## 6. Severe Condition (Deep cleaning)

### 6.1 What she asked

Add **Severe Condition** under the Property Condition section for Deep Cleaning. When
selected:

- Automatically switch to **Custom Quote Required**.
- **Do not show** an automatic cleaning price.
- **Do not allow** automatic booking or payment.
- Let the customer **submit contact information and property details** so the team can
  review and send a personalised estimate.

Customer-facing message, verbatim:

> "Your property requires additional cleaning time and special attention. Please submit
> your information, and our team will contact you with a personalized quote."

Keep the existing calculations for the other conditions unchanged.

### 6.2 Current code

Condition options are Generally Maintained (0%), Needs Extra Attention (+25%), Heavy
Buildup (switches the job to Deep). There is no Severe option and **no path that submits
without creating a booking and an appointment**.

### 6.3 What building this needs

- A new condition value and a "quote only" state that hides the price, hides the
  estimate panel, and replaces the final submit with a quote-request submit.
- A **quote-request submission route**: create the GHL contact with consent evidence, tag
  it (suggest `custom-quote`), and create an opportunity in "Website Enquiries". **No
  appointment, no booking record, no payment.** `/api/ghl/form-submit` already does most
  of this for the contact form and is the natural base.
- The new condition must also exist as an **option on the GHL "Home Condition" field**,
  otherwise the value is silently dropped on write (same trap as "None of the above").
  Estate (section 5) needs the same path.

### 6.4 Open questions

- **Deep only, or Regular too?** She said Deep. In our model, picking Heavy on a Regular
  booking silently switches it to Deep. Should that customer then also be offered Severe?
  Recommend Severe is shown whenever the effective tier is Deep.
- Should the date and time still be collected for a quote request? Probably not required.

---

## 7. Custom Hourly Cleaning

This is the largest item, and it **conflicts with what we built in September**.

### 7.1 What she asked

**Placement.** Custom Hourly is "a separate booking option rather than displaying it
underneath the estimated total". Remove the "Want Something Custom? Prefer to book by time
instead?" section from under the estimated total, because a second pricing option at
that point "could distract customers from completing their booking". Spec section 6:
"Please do not display Custom Hourly Cleaning as an alternative underneath the estimated
price of Regular, Deep, or Move-Out Cleaning. It should only be available as **its own
service category**."

**Service details (1).** $45 per hour per cleaner. Minimum 3 hours per cleaner. Starting
price $135 for one cleaner. Customers choose number of hours and cleaners, total updates
automatically.

**Customer information (2).** Full name, phone, email, property address, preferred date
and time, number of bedrooms and bathrooms, pets Yes/No, children Yes/No.

**Cleaning priorities (3).** Required multi-select: Kitchen, Bathrooms, Bedrooms, Living
Room, Dining Room, Hallways / Common Areas, Laundry Room, Other (please specify). Plus a
text box: "Is there anything specific you'd like our cleaners to focus on?"

**Disclaimer (4).** Clearly visible before the customer completes the booking, verbatim:

> "Custom Hourly Cleaning is a time-based service focused on your selected priorities. Our
> cleaning professionals will work on the areas you've requested within the booked time.
> Completion of all selected areas is not guaranteed and will depend on the property's
> condition and the time reserved."

Reason given: they do not want customers expecting a whole house deep cleaned in a few
hours.

**Pricing and checkout (5).** $45/hour per cleaner, 3 hour minimum per cleaner, automatic
total, a **standard $30 booking deposit deducted from the service total**, estimated total
shown before checkout, process "simple and easy".

**Booking flow (6).** 1 Select Custom Hourly Cleaning. 2 Enter property and contact
information. 3 Select date and time. 4 Select number of cleaners and hours. 5 Select
cleaning priority areas. 6 Review the estimated total. 7 Pay the $30 deposit and submit.

### 7.2 Current code

- Hourly is a **toggle inside Step 4**, under the estimate (`Want Something Custom?`).
- Removed from the Step 2 service picker earlier, at her request ("it should be under the
  residential section").
- Pricing is the **tiered** model: $35 / $32 / $30, banded on **combined** labour hours,
  min 3 hours per cleaner. Her own earlier reversal on 2026-09-21.
- Add-ons, areas, minimum and recurring discount are already set aside in hourly mode.
- The summary panel, crew note and `quoteHourly` already exist and can be reused.

### 7.3 Conflicts to resolve before building

**1. $45 flat vs the tiered rates.** Same selection, very different price:

| Selection | Tiered (current, combined hours) | $45 flat (new spec) |
|-----------|----------------------------------|---------------------|
| 1 cleaner, 3 hours | $105 (3h at $35) | **$135** |
| 2 cleaners, 3 hours | $192 (6h at $32) | **$270** |
| 2 cleaners, 4 hours | $240 (8h at $30) | **$360** |

The new spec says nothing about tiers or discounts. Either she dropped them, or this is
a second, separate document that forgot them. **Needs her answer.** Her new spec is the
later and more specific one, and the earlier slides describe the "alternative under the
estimate" version she has now cancelled, so the likely reading is $45 flat. Do not assume.

**2. Placement.** Own service category in Step 2, and nothing under the Regular/Deep
estimate. That removes the Step 4 block and puts Custom Hourly back in the picker, which
is the reverse of the removal we did in September. The slide that said "under the
residential section" is superseded by "its own service category".

**3. The $30 deposit.** See section 8.

### 7.4 What building this needs

- Step 2 picker card "Custom Hourly Cleaning". New `ServiceCategory` handling: the value
  `custom` already exists in the type, the bookings collection and the label maps, which
  is why it was kept when the picker option was removed.
- A dedicated step flow for it (like handyman has), following her 7 steps. Date and time
  first, then cleaners and hours, then priorities, then review.
- **Bedrooms and bathrooms inputs.** Today they are derived from the area picker. In the
  hourly flow there is no area picker, so they need their own fields. The crew needs
  them.
- Priority areas multi-select plus free text, saved to the booking, the GHL contact, and
  the crew note.
- Disclaimer shown on the review step with the exact wording, and ideally an
  acknowledgement tick (a tick is evidence, text alone is not). Ask whether she wants it.
- Remove the Step 4 hourly block and its entry point.
- Pets and children questions already exist in the Access step.

---

## 8. The $30 deposit and payments

### 8.1 What she asked

Hourly bookings take a **$30 deposit at checkout, deducted from the service total**. She
calls it "our standard $30 booking deposit", which implies it applies to everything, but
only the hourly spec mentions it.

### 8.2 Current state

- Card payment is **switched off**. The wizard is deliberately request-only: no Payment
  step, the summary panel says "This is a request form only", the success screen now says
  "Request Received".
- Authorize.Net code exists (`tokenizeCard`, `chargeNonce`, `createCustomerProfile`,
  `chargeCustomerProfile`, `refundTransaction`) and credentials are in `.env`.
- There is **no concept of a deposit** anywhere: no partial charge, no "deducted from
  total", no record of what was paid.

### 8.3 This contradicts the rest of the model

If hourly takes a card payment and says "booking", then hourly is a **confirmed booking**,
while every other service is a **request we confirm by phone**. Two different promises on
one site. It also reintroduces everything the request-only model avoided: failed cards,
refunds, a cancellation policy for the deposit, chargebacks.

### 8.4 Decisions needed

1. Is the $30 deposit for **hourly only**, or for every booking? This decides whether we
   turn the Payment step back on globally or only inside one flow.
2. Is a paid deposit a **confirmed** booking, or still a request? If confirmed, the
   confirmation email wording is correct for hourly and wrong for the rest.
3. **Refund and cancellation rules** for the deposit. Not covered anywhere in her slides.
4. If payment stays off for now, hourly could ship with the deposit **described but not
   collected** ("a $30 deposit will be requested when we confirm"). Cheaper, honest, and
   can be switched on later.

Recommend asking her to choose between "collect now" and "request-only for launch". It is
the single biggest piece of work in this round and the least specified.

---

## 9. GoHighLevel: what to do by hand

The API token can **read** workflows but cannot **write** them (`POST /workflows/` returns
401 not authorized for this scope), and there is no read-one-workflow route. Decision: do
workflow changes **manually in the GHL UI** for now. Custom fields are different: the
token can create and edit those, so they can be scripted via `.seed/ghl-provision.ts`.

### 9.1 Manual, in the GHL UI

| Item | Why |
|------|-----|
| Reword the **Booking Confirmation Email & SMS** workflow and email template `01-booking-confirmation` from "you're all set" to request received, someone contacts you within 24 hours | Matches her "Handyman correction". The site now says request received; the email still says confirmed. |
| New workflow for tag `custom-quote` (Severe Condition and Estate): acknowledgement email and SMS to the customer, alert to staff | The quote path has no confirmation at all today. Keep consent gating and the 8 AM to 8 PM window. |
| **Staff Alert, New Booking**: include the hourly fields (cleaners, hours, total labour hours, priorities, focus note) and deposit status | Staff need the staffing shape to schedule. |
| Check **24h Appointment Reminder** against hourly bookings | The reminder reads appointment time, which for a multi-hour block should still be right, but confirm. |

### 9.2 Scriptable (custom fields), when we build

- **Home Condition**: add the Severe option. Silently dropped on write if missing.
- **Property Size**: SINGLE_OPTIONS (Small, Medium, Large, Extra Large, Oversized, Estate).
- **Cleaners**, **Hours Per Cleaner**: numbers (or text).
- **Cleaning Priorities**: MULTIPLE_OPTIONS (option set must match the wizard exactly).
- **Priority Notes**: text.

Option labels live in code and GHL, so they must be declared in one place and synced by
the provision script, like `@/data/handyman`.

---

## 10. Suggested order of work

1. **Regular and Deep area prices, combined KLD area, defaults, deep minimum** (sections
   3 and 4). Pure data plus the picker. Contained, and unblocks the size work.
2. **Remove the "Want Something Custom?" block** from Step 4 (section 7). Tiny, safe,
   and exactly what she asked for. Can ship alone.
3. **Size bands and the multiplier** (section 5), after we know how they stack with the
   condition uplift.
4. **Severe Condition and Estate quote path** (section 6), with the quote-request route.
5. **Custom Hourly as its own category** (section 7), once the rate and the deposit are
   settled. Do not start before those two answers.
6. GHL manual items (section 9) alongside each step as it ships.

---

## 11. Questions for Geraldine

Plain wording, no em dashes, ready to send.

1. **Custom Hourly rate.** Your newest spec says $45 per hour per cleaner. Earlier you
   gave $35 for 3 to 4 hours, $32 for 5 to 7 and $30 for 8 or more. Which should the
   website use? Example: 2 cleaners for 3 hours is $270 at $45, or $192 at the lower rates.
2. **The $30 deposit.** Should we collect it by card at checkout, or keep hourly as a
   request for now and take the deposit when you confirm? Is it only for hourly, or for
   every booking? What is the refund policy if the customer cancels?
3. **Size and the condition surcharge together.** If a home is Large (+20%) and also Needs
   Extra Attention (+25%), do we add them (+45%) or multiply them (+50%)?
4. **Size bands.** Should the size question be required? And does the percentage apply
   to the cleaning areas only, not to add-ons?
5. **Deep minimum.** With the new prices the smallest Deep clean is $200. Should the
   minimum booking for Deep be $200?
6. **Severe Condition.** Only for Deep Cleaning, or also when a Regular customer picks
   Heavy Buildup? And should Estate homes (3,000+ sq ft) follow the same quote request
   process?
7. **Condition names.** You wrote Well Maintained, Moderate Buildup and Heavy Buildup. The
   site says Generally Maintained, Needs Extra Attention and Heavy Buildup. Do you want
   the names changed?
8. **Combined area.** Kitchen, Living and Dining is one $70 selection even for a home with
   no dining room. That is a $10 increase for those homes. Is that intended?
9. **Baseboards**, still open from before: $40 "Detail" or $25 "handwash" per room, or two
   separate services?
10. **Basement**: keep at $45? And are Garage Sweep, Change Bed Linens, Air Vents and
    Window Tracks all services you offer?
