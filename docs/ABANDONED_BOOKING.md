# Abandoned Booking Recovery — Plan

Recovers users who start the booking wizard but don't complete it.
The goal is a sequence of GHL emails/SMS that bring them back with a
resume link — not spam, just a smart nudge at the right time.

---

## What we already have today

Step 1 of the wizard fires a background request to `/api/ghl/lead-capture`
the moment the user clicks Next. That means:

- GHL contact is created with `website-lead` tag
- We have their name, email, and phone
- If they abandon at any point after Step 1, GHL already knows about them

This is our trigger point. Everything below builds on top of it.

---

## The recovery sequence (proposed)

| Delay | Channel | Message |
|---|---|---|
| 1 hour after abandon | Email | "You left your booking unfinished — here's where you were" + resume link |
| 24 hours | Email + SMS | Softer nudge — "Still interested? We'll hold your slot." |
| 3 days | Email | Final follow-up — optionally include a small incentive |
| After 3 days | Stop | Do not continue beyond this — avoid feeling like harassment |

All three steps are one GHL workflow triggered by the `website-lead` tag.
Each step has a **goal** condition: if the contact gets the `booking-confirmed`
tag (set when a booking is completed), the workflow exits immediately and no
more emails are sent.

---

## What needs to be decided before building

### 1. Resume link strategy

Three options — pick one:

**Option A — Restart link (simplest)**
The email links back to `/booking`. User starts over.
- Pros: zero extra code
- Cons: user has to re-enter everything, high friction

**Option B — Step snapshot in localStorage (good middle ground)**
When the user leaves, we save their current step + form data to
`localStorage` with a timestamp. The resume link is just `/booking?resume=1`.
On load, the wizard checks for a saved snapshot and restores from it.
- Pros: seamless resume, no DB needed, works without an account
- Cons: only works on the same browser/device — link in email opens on phone
  won't restore data from desktop session

**Option C — Server-side snapshot (best experience, most work)**
On each step advance, silently POST the partial form data to a
`/api/bookings/draft` endpoint. Store it in the DB (new `BookingDrafts`
collection) keyed by email. The resume link is `/booking?draft=<token>`.
On load, the wizard fetches the draft and hydrates the form.
- Pros: works across devices, survives browser clears, can track drop-off step
- Cons: new collection + API endpoint + token generation needed

**Recommendation**: Start with Option B for the first version. It handles
the most common case (same device, different tab). Upgrade to Option C
if analytics show mobile-first abandon rates are high.

### 2. How far into the wizard to track

We only capture leads at Step 1 today. Options:

- **Step 1 only** (current) — simplest, already live
- **Every step** — update GHL contact custom field with last step reached;
  lets you tailor the email ("You were almost done — just need your address")
- **Decision**: defer to Option B/C implementation — both make this easy to add

### 3. Incentive on final follow-up (Day 3)

Options: no incentive (just a reminder), or a small offer
("Book in the next 48 hours and get 10% off your first clean").
- **Decision**: Fabien/client to decide — leave a placeholder in the email template

---

## GHL Workflow structure

### Workflow: "Abandoned Booking — Recovery Sequence"

```
Trigger: Contact Tag added → "website-lead"

Wait: 1 hour

Condition: Does contact have tag "booking-confirmed"?
  → YES: Exit workflow
  → NO: Continue

Action: Send Email — "Complete your booking" (include resume link)

Wait: 23 hours  (total 24h from trigger)

Condition: Does contact have tag "booking-confirmed"?
  → YES: Exit workflow
  → NO: Continue

Action: Send Email + SMS — "Still thinking it over?"

Wait: 2 days  (total 3 days from trigger)

Condition: Does contact have tag "booking-confirmed"?
  → YES: Exit workflow
  → NO: Continue

Action: Send Email — "Last reminder" (optional incentive)

End
```

> **Re-entry setting**: Allow Re-entry OFF — if the same person starts
> a second booking attempt, we don't want to restart the sequence.

### Workflow: "Mark Booking Confirmed" (already part of submit flow)

When a booking is successfully submitted, the GHL contact needs the
`booking-confirmed` tag so the recovery workflow exits cleanly.

**To add** in `submit-flow.ts` step 4 (`upsertContact`): include
`tags: ['booking-confirmed']` alongside the confirmation code custom field.
This is a one-line change — do it when building the recovery workflow.

---

## Resume link implementation plan (Option B — localStorage snapshot)

When ready to build:

1. **In `BookingContext.tsx`** — add a `useEffect` that watches `currentStep`
   and `bookingData`. On every step change past Step 1, write to localStorage:
   ```typescript
   localStorage.setItem('tc_booking_draft', JSON.stringify({
     step: currentStep,
     data: bookingData,
     savedAt: Date.now(),
   }))
   ```

2. **On wizard mount** — check for a saved draft less than 48 hours old.
   If found, offer "Resume your booking from Step X" banner. User clicks
   to restore, or dismisses to start fresh.

3. **On successful submit** — clear the draft:
   ```typescript
   localStorage.removeItem('tc_booking_draft')
   ```

4. **Resume link in email** — just `/booking` with a note in the email
   "Resume on the same device where you started."

---

## What the email should include

Minimum for each email:

- Customer's first name
- The resume link (CTA button)
- The date/time slot they had selected (if captured — needs step snapshot)
- The service type they chose (if captured)
- Support contact (phone/email) in case they have questions

Email HTML design: to be provided by client (same process as confirmation email).

---

## Implementation order

1. Build and test the full booking flow first (see `BOOKING_FLOW_TESTING.md`)
2. Add `booking-confirmed` tag to `upsertContact` in submit-flow
3. Set up the GHL workflow in the UI (trigger + sequence + exit condition)
4. Implement Option B localStorage snapshot + resume banner in the wizard
5. Test: start a booking, abandon at Step 4, wait (or manually trigger in GHL),
   confirm email arrives, click resume, confirm wizard restores to Step 4
6. Upgrade to Option C (server-side draft) if needed based on real usage

---

## Open decisions

| Decision | Owner | Status |
|---|---|---|
| Resume strategy: Option B vs C | Inaam + Fabien | Pending |
| Incentive on Day 3 email | Client (Fabien) | Pending |
| Which steps to snapshot (Step 1 only vs all steps) | Inaam | Pending |
| Email HTML design for recovery sequence | Client | Pending |
