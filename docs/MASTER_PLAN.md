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
| 2 | Verify the GHL handshake | `[ ]` | [stages/02-verify-ghl-handshake.md](stages/02-verify-ghl-handshake.md) |
| 3 | Logged-in booking — create account + book | `[ ]` | |
| 4 | Account bookings list + detail page | `[ ]` | |
| 5 | Cancellation flow — Payload + GHL sync | `[ ]` | |
| 6 | GHL Calendar settings tour | `[ ]` | *(learn-only, no code)* |
| 7 | GHL Calendar edge cases | `[ ]` | *(learn-only, no code)* |
| 8 | Design + build the confirmation email template | `[ ]` | |
| 9 | Workflow setup — trigger + send action | `[ ]` | |
| 10 | Add `booking-confirmed` tag in code | `[ ]` | |
| 11 | Full smoke test — book → email lands | `[ ]` | |
| 12 | Walk through the recurring scheduler | `[ ]` | |
| 13 | Tag `booking-abandoned` on idle leads | `[ ]` | |
| 14 | Test abandoned detection | `[ ]` | |
| 15 | First recovery email (1-hour nudge) | `[ ]` | |
| 16 | Full recovery sequence (24h + 3d) | `[ ]` | |
| 17 | localStorage snapshot + resume in emails | `[ ]` | |

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

- **GHL Private Integration Token may lack DELETE permission for appointments** (discovered during Stage 1 test on 2026-05-12)
  - **Symptom**: When rollback tried to cancel a successfully-created appointment after a downstream failure, GHL returned 401 Unauthorized. Token authenticates fine for `POST /opportunities/`, `POST /calendars/events/appointments`, etc., but fails for `DELETE /calendars/events/appointments/{id}`.
  - **Where it surfaces**: `src/lib/ghl/appointments.ts:19` (`cancelAppointment`), called from rollback path AND from the customer-facing cancel endpoint `src/app/(payload)/api/bookings/[id]/cancel/route.ts`.
  - **Fix in Stage 5**: Go to GHL → Settings → Integrations → Private Integrations → edit the token → ensure the **Calendars / Write** scope is enabled (likely needs `calendars/events.write` or similar). May need to regenerate the token.
  - **Token ID to inspect**: `pit-84c5a264-03c5-4731-8bc4-78dd79ac5cb1`

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

### Stage 6 — GHL Calendar settings tour

- **Only 4 time slots showing in the wizard** (discovered during Stage 1 test on 2026-05-12)
  - **Root cause**: GHL calendar `openHours = {}` and `availabilities = []`. With no hours on the calendar itself, GHL falls back to the assigned team member's personal working hours, which appear to be ~4 hours of the afternoon.
  - **Calendar config**: 2-hour slot duration, 1-hour interval, 1 appointment per slot, auto-confirm true, advance booking 1 day → 60 days.
  - **Fix in Stage 6**: Either (a) set business hours directly on the calendar (`Calendars → Top Cleaning Appointments → Availability → Open Hours`, e.g. Mon–Sat 8 AM – 6 PM), or (b) update the team member's working hours. Option (a) is recommended — the business open hours should be independent of which cleaner is assigned.
  - **Assigned team member ID**: `m2qNAZYlill0w0nmEjpS` (for reference when we look at this in Stage 6)
