# Top Cleaning — Build & Learn Plan

This is the map. Each stage is small (~30–60 min), self-contained, and ends
with a clean commit. We learn one GHL or code concept per stage, build one
concrete thing, verify, commit, move on.

If a stage feels too big in practice → split it. If a stage feels redundant
once we get there → skip and update this doc.

> **Rule**: never start the next stage until the current one is committed.
> No "I'll come back to it." If something later needs to enrich an earlier
> stage, that's a new stage with its own doc.

---

## The narrative

We've already shipped the booking system (wizard, GHL contact + appointment +
opportunity, guest checkout, payment-step feature flag, confirmation code race
fix). What's left is:

1. **Prove the booking flow works end-to-end** — Stages 1–2
2. **Prove the customer self-service flow works** (account, view, cancel) — Stages 3–5
3. **Understand the calendar system we built on** — Stages 6–7
4. **Close the customer loop with a confirmation email** — Stages 8–11
5. **Handle returning / recurring customers** — Stage 12
6. **Catch the customers who almost booked** — Stages 13–16
7. **Polish: let them resume where they left off** — Stage 17

Each stage points forward (what it unlocks) and backward (what it builds on),
but does NOT edit earlier stages. Refinements become new stages.

---

## Stages

Status legend: `[ ]` not started · `[~]` in progress · `[x]` done & committed

| # | Stage | Status | Doc |
|---|---|---|---|
| 1 | Test the full booking submit | `[x]` | [stages/01-test-booking-submit.md](stages/01-test-booking-submit.md) |
| 2 | Verify the GHL handshake | `[x]` | [stages/02-verify-ghl-handshake.md](stages/02-verify-ghl-handshake.md) |
| 2.5 | Wizard validation + UX polish | `[ ]` | [stages/02-5-wizard-validation-and-polish.md](stages/02-5-wizard-validation-and-polish.md) |
| 2.7 | Wire GHL Booking custom object | `[x]` | [stages/02-7-wire-ghl-booking-custom-object.md](stages/02-7-wire-ghl-booking-custom-object.md) |
| 2.8 | Contact ↔ Booking association | `[x]` | [stages/02-8-contact-booking-association.md](stages/02-8-contact-booking-association.md) |
| 3 | Logged-in booking — create account + book | `[x]` | [stages/03-logged-in-booking.md](stages/03-logged-in-booking.md) |
| 4 | Account bookings list + detail page | `[x]` | [stages/04-account-bookings-list.md](stages/04-account-bookings-list.md) |
| 5 | Cancellation flow — Payload + GHL sync (basic) | `[~]` deferred | [stages/05-cancellation-flow.md](stages/05-cancellation-flow.md) |
| 6 | GHL Calendar settings tour | `[x]` | [stages/06-ghl-calendar-tour.md](stages/06-ghl-calendar-tour.md) |
| 7 | GHL Calendar — multi-crew RoundRobin (rebuild as Round Robin type) | `[x]` | *(folded into Stage 6 — discovery + rebuild + verification)* |
| 8 | Design + build the confirmation email template | `[x]` | [stages/08-confirmation-email-template.md](stages/08-confirmation-email-template.md), [stages/08-1-and-8-2-contact-snapshot-fields.md](stages/08-1-and-8-2-contact-snapshot-fields.md), [stages/08-3-push-confirmation-email.md](stages/08-3-push-confirmation-email.md) |
| 9 | Workflow setup — trigger + send action | `[ ]` | |
| 10 | Add `booking-confirmed` tag in code | `[x]` | [stages/10-booking-confirmed-tag.md](stages/10-booking-confirmed-tag.md) |
| 11 | Full smoke test — book → email lands | `[ ]` | |
| 12 | Recurring booking system (broken into sub-stages below) | `[~]` | |
| 12.1 | BookingSeries collection + series link on Bookings | `[x]` | [stages/12-1-booking-series-schema.md](stages/12-1-booking-series-schema.md) |
| 12.2 | Submit flow creates + links series for recurring bookings | `[~]` | [stages/12-2-submit-flow-creates-series.md](stages/12-2-submit-flow-creates-series.md) |
| 12.3 | Fix recurring scheduler 400 errors (cap by booking window, skip unavailable slots) | `[x]` | [stages/12-3-recurring-bug-fix.md](stages/12-3-recurring-bug-fix.md) |
| 12.3b | Create Payload Booking records for each future occurrence | `[x]` | [stages/12-3b-payload-records-for-future-occurrences.md](stages/12-3b-payload-records-for-future-occurrences.md) |
| 12.4 | Show recurring schedule on success screen | `[~]` | [stages/12-4-recurring-schedule-on-success.md](stages/12-4-recurring-schedule-on-success.md) |
| 12.5 | Group bookings by series on /account/bookings | `[~]` | [stages/12-5-account-page-series-grouping.md](stages/12-5-account-page-series-grouping.md) |
| 12.6 | Series detail page /account/series/[id] | `[~]` | [stages/12-6-series-detail-page.md](stages/12-6-series-detail-page.md) |
| 12.7 | Tag GHL contact `recurring-customer` on series creation | `[x]` | [stages/12-7-8-ghl-series-tags-and-fields.md](stages/12-7-8-ghl-series-tags-and-fields.md) |
| 12.8 | Add series_id to GHL Booking custom object records | `[x]` | [stages/12-7-8-ghl-series-tags-and-fields.md](stages/12-7-8-ghl-series-tags-and-fields.md) |
| 12.9 | Cancellation modal — single occurrence vs whole series scope | `[~]` | [stages/12-9-10-11-cancellation-two-way-sync.md](stages/12-9-10-11-cancellation-two-way-sync.md) |
| 12.10 | Forward sync: cancel in Payload → GHL appointment + opportunity | `[~]` | [stages/12-9-10-11-cancellation-two-way-sync.md](stages/12-9-10-11-cancellation-two-way-sync.md) |
| 12.11 | Reverse sync: GHL webhook → Payload (when cancelled in GHL UI) | `[~]` | [stages/12-9-10-11-cancellation-two-way-sync.md](stages/12-9-10-11-cancellation-two-way-sync.md) |
| 13 | Tag `booking-abandoned` on idle leads | `[ ]` | |
| 14 | Test abandoned detection | `[ ]` | |
| 15 | First recovery email (1-hour nudge) | `[ ]` | |
| 16 | Full recovery sequence (24h + 3d) | `[ ]` | |
| 17 | localStorage snapshot + resume in emails | `[ ]` | |
| 18 | **Full cancellation + refund flow** (revisit Stage 5) | `[ ]` | *(needs payment credentials — depends on Stripe/Authnet integration)* |

---

## How a stage doc is structured

Every stage doc has the same 6 sections:

1. **The story** — why this stage exists, what real-world thing it solves
2. **What you'll learn** — the concept (GHL or code) in plain words
3. **Builds on** — explicit links to earlier stage(s) we rely on
4. **Steps** — exact clicks in GHL + exact code changes
5. **Verify** — checkboxes for "done"
6. **Unlocks** — forward links: what later stages can now happen

When a stage is done: tick it in this file, commit, move to the next.

---

## Known docs not in the stages list

- [`BOOKING_FLOW_TESTING.md`](BOOKING_FLOW_TESTING.md) — full test playbook,
  referenced by Stages 1 and 2
- [`ABANDONED_BOOKING.md`](ABANDONED_BOOKING.md) — design notes for Stages 13–16

---

## Carry-forward findings

Things we noticed while testing earlier stages that we'll address in later
stages. Each entry says **what we saw** and **which stage will handle it**.

### Stage 4 — Account bookings list + detail page

- **Custom `/api/bookings` POST route shadows all Payload-generated routes** (discovered 2026-05-12)
  - **Symptom**: `DELETE /api/bookings?...` returns **405 Method Not Allowed** when trying to delete from Payload admin UI. Same will happen for any non-POST method our custom file doesn't export.
  - **Root cause**: We created `src/app/(payload)/api/bookings/route.ts` to handle the booking submit POST. Next.js App Router uses this file for ALL methods at `/api/bookings`, blocking Payload's auto-generated GET/PATCH/DELETE handlers.
  - **Fix options**:
    1. **Move the custom submit endpoint to a different path** like `/api/bookings/submit` so Payload's standard routes work at `/api/bookings`. (Cleanest — recommended.)
    2. Add DELETE/PATCH/GET handlers in `route.ts` that proxy to Payload's local API (`payload.delete`, `payload.find`, etc.). Verbose, easy to drift.
    3. Convert to a Payload custom endpoint registered on the Bookings collection instead of an App Router file. (Most idiomatic Payload but requires refactor.)
  - **Caller updates needed**: Anywhere we POST to `/api/bookings` from the frontend must be updated to the new path. Grep `fetch('/api/bookings'` to find them.
  - **Insert in Stage 4** since that stage is about the customer-facing bookings list which uses Payload's GET endpoint — the bug will surface there too.

### Stage 5 — Cancellation flow

- **~~GHL token DELETE scope issue~~ → was actually a wrong endpoint URL** (originally noted 2026-05-12, root-caused 2026-05-15)
  - **Symptom**: `DELETE /calendars/events/appointments/{id}` returned 401 "GHL authentication failed" or "This route is not yet supported by the IAM Service" even after PIT regeneration with full scopes
  - **Real root cause**: GHL API path inconsistency — `POST /calendars/events/appointments` creates, but `DELETE /calendars/events/{id}` (without `/appointments/`) deletes. The DELETE path with `/appointments/` is simply not supported.
  - **Fix applied**: Updated `cancelAppointment` in `src/lib/ghl/appointments.ts` to use the correct DELETE path. Verified via curl: `DELETE /calendars/events/bnpKsxCrfY1wPRELabJk` → `{"succeeded":true}`
  - **Status**: ✅ Resolved — cancellation flow can now actually cancel GHL appointments. Stage 5 unblocked for proper testing (still gated by Stage 18 for the payment/refund half).

### Stage 12 — Walk through the recurring scheduler

- **Recurring appointment 2 fails with GHL 400 Bad Request** (discovered during Stage 1 test on 2026-05-12)
  - **Symptom**: Main booking succeeds. The fire-and-forget recurring scheduler tries to create appointment #2 (and presumably more) and gets a 400 from GHL.
  - **Where it happens**: `src/lib/booking/submit-flow.ts:348` inside `scheduleRecurringAppointments` → `createAppointment` (`src/lib/ghl/appointments.ts:7`).
  - **Likely cause**: The recurring scheduler builds the future start time with `addDaysToIso()` which doesn't preserve the proper format GHL needs, OR the slot is outside business hours, OR the calendar rejects duplicate same-time bookings. Need to log the actual 400 body to confirm.
  - **Impact**: Main booking is fine (logs say the error was on recurring appointment 2, not the first). Customers booking weekly/biweekly/monthly won't have future appointments auto-created.
  - **Fix in Stage 12**: Add detailed logging in the recurring path, reproduce with a known-good weekly booking, fix whatever GHL complains about.

### Stage 2.5 — Wizard validation + UX polish (NEW STAGE — to insert)

This is a single stage covering all wizard issues found during Stage 1 testing.

**A) Per-step validation** (discovered 2026-05-12)
- **Symptom**: User can click through all 10 steps with empty required fields. Errors only appear on final submit, pointing back to a previous step.
- **Root cause**: `validateBookingData()` in `src/lib/booking/submit-flow.ts` runs server-side only at submit. The wizard's `goNext()` advances on every click without checking the current step's required fields.
- **Fix**: New file `src/lib/booking/step-validation.ts` keyed by step number, called from `goNext()` in `src/blocks/TCBookingForm/Component.client.tsx`. Returns `{ valid, missingField? }`. If invalid → highlight missing field, don't advance.

**B) Earthquake jiggle on Step 7 (Conditions & Access)** (discovered 2026-05-12)
- **Symptom**: When clicking Yes/No on pets, the screen jumps significantly.
- **Root cause 1**: `src/components/booking/sections/Step07Access.tsx:62` — `marginBottom` flips from 0 to 18px AND ~100px of "What kind of pets?" content appears. Total: ~120px content pop.
- **Root cause 2**: Same file:182 — access method cards have `transition: all 0.3s` plus a hover `translateY(-2px)` that interacts badly with active state.
- **Fix**: (1) Reserve space for the pet type section with min-height or a CSS fade-in animation, not a hard show/hide. (2) Replace `transition: all` with explicit `transition: border-color 0.2s, background 0.2s` to skip transform.

**Insertion**: Insert between current Stage 2 and Stage 3; renumber everything after.

### Stage 5 — Cancellation flow (deferred decision)

- **Basic cancellation logic exists but full flow needs payment integration first** (decided 2026-05-14)
  - **What works today**: PATCH `/api/bookings/[id]/cancel` flips Payload status, deletes GHL appointment, moves opportunity to Cancelled stage. Token scopes are correct since Stage 2.8.
  - **What's missing**: the fee/refund half. Policy logic returns `chargeRequired: true` for <24h cancellations but no charge actually fires because `PAYMENT_ENABLED=false`. The customer-facing dialog mentions a fee, but there's no card to charge it against (we haven't vaulted the card since payment is disabled).
  - **Decision**: defer full testing of Stage 5 to **Stage 18 (Full cancellation + refund flow)** which will run after payment integration is live. Stage 5 stays `[~] deferred` in the plan as a reminder.
  - **What this means in practice**: customers can still cancel from `/account/bookings/[id]` today — the booking flips to cancelled, GHL syncs, no money moves. That's actually the right behavior for the no-upfront-payment phase. We just don't claim end-to-end verification until refunds are real.

### Stage 6 — GHL Calendar settings tour (additional findings)

- **GHL offers slots based on start time only, not full duration** (discovered 2026-05-15)
  - **Symptom**: Tuesday 5 PM slot was offered even though Crew 1's shift ends at 6 PM and the 2-hour appointment runs to 7 PM (and with 30-min post buffer, effectively to 7:30 PM)
  - **Implication**: Crews can be assigned to appointments that run past their working hours. Operationally this means a crew may need to work late.
  - **Discussion point with Geraldine**: Is it acceptable for crews to occasionally work past their listed end time? Or should we tighten the calendar to only offer slots where the FULL appointment fits within crew hours?
  - **If tightening is needed**: The fix is to set each crew's working hours to end 2.5 hours earlier than their actual stop time (e.g., Crew 1 working 8 AM - 6 PM in real life would be configured as 8 AM - 3:30 PM in GHL so the latest 2-hr slot + 30-min buffer fits). Tedious; not recommended unless Geraldine insists.

- **Calendar is assigned to Tashana Dees — an NBL leftover user** (discovered 2026-05-14)
  - **Symptom**: User `m2qNAZYlill0w0nmEjpS` in API = "Tashana Dees" in UI = NBL contact, not a Top Cleaning crew
  - **Root cause**: Calendar was created on a shared sub-account that already had NBL users
  - **Impact**:
    - Her working hours flow through as the only available slots (cause of "only 4 slots showing" finding)
    - Her Pacific timezone causes appointment times to render as `-07:00` instead of Eastern (cause of "Pacific time in API" finding)
    - Wrong source-of-truth: jobs are assigned to her name in GHL, not to actual Top Cleaning crews
  - **Fix prerequisites** (need decisions from Geraldine before we can act):
    1. How many cleaning crews to model in GHL (1 placeholder or N real crews)
    2. Names + emails for each crew (can be shared `crew1@topcleaningteam.com` etc.)
    3. Working hours per crew (all same, or each different)
    4. Confirm Eastern timezone for all crews
  - **Fix plan**:
    1. Settings → My Staff → create real Top Cleaning user(s) with Eastern timezone
    2. Calendar settings → Staff & location → remove Tashana, add new users
    3. Optionally remove Tashana from the sub-account entirely (Settings → My Staff → her profile)

- **Calendar Meeting Location set to "Custom" with empty text** (discovered 2026-05-14)
  - **Status**: ✅ Correct as-is. Cleaning service goes to the customer's address (collected in booking form). No fixed location to enter. Empty field is fine.

- **Appointment times stored/returned in team-member's timezone (Pacific)** (discovered Stage 2, 2026-05-14)
  - **Symptom**: Booking sent as `2026-05-20T13:00:00-04:00` (Eastern). GHL API returns `2026-05-20T10:00:00-07:00` (Pacific). Same UTC instant, different rendering.
  - **Root cause**: Assigned team member `m2qNAZYlill0w0nmEjpS` has Pacific timezone in their GHL user profile.
  - **Impact**: GHL email/SMS notifications may show Pacific time to the customer unless template formatting forces calendar timezone. Test by sending a notification and inspecting the rendered time.
  - **Fix in Stage 6**: Change the team member's user timezone to US/Eastern in GHL → Settings → My Staff → [user] → Timezone. Or override per-email-template using GHL's date-format placeholder.

### Stage 2.7 — Wire GHL Booking custom object (NEW STAGE)

- **Booking custom object is configured in GHL but no code writes to it** (discovered Stage 2, 2026-05-14)
  - **Symptom**: GHL has a custom object `custom_objects.bookings` (id `69f6725066de6bc00b0149f8`) with 16 fields defined, but the records list is empty. Confirmation codes, service details, addresses — none of it lands in this object.
  - **Root cause**: `src/lib/booking/submit-flow.ts` creates contact + appointment + opportunity, but never calls the GHL Custom Objects API.
  - **Fix plan**:
    1. Add `src/lib/ghl/custom-objects.ts` with a `createBookingRecord()` function that POSTs to `/objects/custom_objects.bookings/records`.
    2. Build the payload from the Payload booking record — map all 16 fields (table in submit-flow comment).
    3. Call it from `submit-flow.ts` right after `createOpportunity` (or in parallel with it).
    4. Associate the record with the contact using GHL's associations API (`POST /associations/relations/{recordId}` or via the create call's body — verify which works first).
    5. Store the returned `customObjectRecordId` on the Payload Booking record (add a new field `ghlBookingObjectId`).
  - **Fields and their GHL field keys**: see schema dump in the conversation that produced this finding. All keys are `custom_objects.bookings.{snake_name}`.
  - **Map of Payload → GHL field**:
    - `confirmationCode` → `custom_objects.bookings.confirmation_code` (required, unique)
    - `serviceType` → `custom_objects.bookings.service_type` (map: `movein-out` → `move_inout`, `renovation` → `postrenovation`)
    - `serviceDate` → `custom_objects.bookings.service_date`
    - `serviceTime` → `custom_objects.bookings.service_time`
    - `property.squareFootage` → `custom_objects.bookings.square_footage`
    - `property.bedrooms` → `custom_objects.bookings.bedrooms` (5+ maps to `5`)
    - `property.bathrooms` → `custom_objects.bookings.bathrooms` (cap at `5`)
    - `accessMethod` → `custom_objects.bookings.access_method`
    - `pricing.total` → `custom_objects.bookings.booking_total`
    - `hasPets` → `custom_objects.bookings.has_pets` (`yes`/`no`)
    - `hasChildren` → `custom_objects.bookings.has_children` (`yes`/`no`)
    - `address.street` → `custom_objects.bookings.street_address`
    - `address.city` → `custom_objects.bookings.city`
    - `address.state` → `custom_objects.bookings.state`
    - `address.zipCode` → `custom_objects.bookings.zip_code`
    - `selectedExtras` → `custom_objects.bookings.selected_extras` (JSON-stringify or comma-join labels)

### Stage X (to slot) — Update contact address on booking

- **Booking-time address doesn't update the GHL contact's address** (discovered Stage 2, 2026-05-14)
  - **Symptom**: Existing contact had address "Islamabad, AZ" from a prior interaction. Booking submitted "123 Test St, Phoenix, IL 44000" — the appointment got the right address, but the contact record was not updated.
  - **Root cause**: `upsertContact` in `src/lib/ghl/contacts.ts` only sends name/email/phone/customFields. Address fields aren't included in the payload.
  - **Decision needed**: Should every booking overwrite the contact's address? For cleaning, yes — the address IS the service location and the most recent booking is the most relevant.
  - **Fix**: Add `address1`, `city`, `state`, `postalCode`, `country` to the `upsertContact` payload from `submit-flow.ts`.
  - **Stage placement**: Either small dedicated stage (e.g. 2.7), or fold into Stage 2.5 (wizard polish stage).

### Stage 6 — GHL Calendar settings tour

- **Only 4 time slots showing in the wizard** (discovered during Stage 1 test on 2026-05-12)
  - **Root cause**: GHL calendar `openHours = {}` and `availabilities = []`. With no hours on the calendar itself, GHL falls back to the assigned team member's personal working hours, which appear to be ~4 hours of the afternoon.
  - **Calendar config**: 2-hour slot duration, 1-hour interval, 1 appointment per slot, auto-confirm true, advance booking 1 day → 60 days.
  - **Fix in Stage 6**: Either (a) set business hours directly on the calendar (`Calendars → Top Cleaning Appointments → Availability → Open Hours`, e.g. Mon–Sat 8 AM – 6 PM), or (b) update the team member's working hours. Option (a) is recommended — the business open hours should be independent of which cleaner is assigned.
  - **Assigned team member ID**: `m2qNAZYlill0w0nmEjpS` (for reference when we look at this in Stage 6)
