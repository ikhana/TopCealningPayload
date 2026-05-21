# Stage 5 — Cancellation flow (Payload + GHL sync)

**Status**: `[ ]` not started · **Time**: ~15 min · **Code changes**: probably none (verifying)

---

## The story

A customer needs a way to cancel their own booking without calling the
business. The endpoint and UI already exist — but two earlier issues
should have blocked it from working:

1. The PIT token didn't have DELETE scope on appointments (fixed in Stage 2.8 by regenerating with full scopes)
2. The `/api/bookings` route was shadowed (fixed in Stage 4)

This stage proves cancellation now works end-to-end: customer clicks Cancel,
the booking flips to cancelled in Payload, GHL appointment is deleted,
GHL opportunity moves to the Cancelled stage.

---

## What you'll learn

- How a cancellation cascades across three systems (Payload + GHL Calendar + GHL Pipeline)
- The cancellation policy logic: >24h = free, 1-24h = 50%, <1h = full charge
- Why "best-effort" sync matters — if GHL fails, we still mark cancelled
  in Payload (the customer's request is honored)
- The 24-hour confirmation dialog pattern: protect users from accidental clicks

---

## Builds on

- **Stage 2.8** — token has `calendars/events.write` scope (needed to DELETE appointments)
- **Stage 4** — Payload's auto-routes work at `/api/bookings/[id]` (needed by detail page)
- Existing `/api/bookings/[id]/cancel` PATCH endpoint
  (`src/app/(payload)/api/bookings/[id]/cancel/route.ts`)
- Existing `CancelButton.tsx` client component on the detail page

---

## Steps

### 1. Pre-flight

- Make sure you're logged in and have at least one **confirmed** booking
  in `/account/bookings`
- Pick a booking that's **more than 24 hours in the future** to test the
  no-fee path first

### 2. Trigger the cancel

1. Open the booking's detail page (`/account/bookings/[id]`)
2. Scroll down — there's a **Cancel Booking** button below the Help CTA
3. Click it → confirmation dialog appears with the policy info
4. Click **Yes, Cancel** to confirm

### 3. Verify the cascade

**In Payload admin**:
- [ ] Booking status flipped to `cancelled`
- [ ] `failureReason` field is empty (no error during cancel)

**In GHL → Calendars**:
- [ ] Navigate to the booked date
- [ ] The appointment is **gone** (DELETE worked thanks to Stage 2.8 token fix)

**In GHL → Opportunities**:
- [ ] Open the Top Cleaning pipeline
- [ ] The opportunity has moved from **Booked** → **Cancelled** stage

**In `/account/bookings`**:
- [ ] The list still shows the booking but with the **CANCELLED** badge
- [ ] Clicking into it shows the detail page in cancelled state
- [ ] The Cancel button is no longer shown (only renders for pending/confirmed)

### 4. Test the policy logic (optional)

Open Payload admin → manually edit a booking's `serviceDate` to
**tomorrow at the same time** (so it's <24h away) → save → go back to
the account page → try to cancel.

The dialog should now show the **50% fee** warning. Since `PAYMENT_ENABLED=false`,
no charge actually fires, but the API response includes
`{ chargeRequired: true, feePercent: 50, policy: "50% fee" }` — verify in
the browser network tab.

---

## What if it doesn't work

| Symptom | Likely cause |
|---|---|
| Cancel button does nothing | Browser console — check the PATCH response. 401 = auth cookie issue, 403 = ownership check failing (booking has wrong user), 404 = route or ID issue |
| Cancel succeeds in Payload but appointment still in GHL | Token scope issue. Re-check `calendars/events.write` on the PIT in GHL settings; regenerate token if recently changed |
| Cancel succeeds but opportunity stays in Booked stage | `GHL_PIPELINE_STAGE_CANCELLED` env var missing or wrong. Check `.env` |
| 405 Method Not Allowed | Stage 4 route fix didn't take — restart dev server |
| Booking not appearing as cancelled on list page | The list page caches with `cache: 'no-store'`, so a refresh should show it. Otherwise check the booking has `status: cancelled` in admin |

---

## What this does NOT do

- **No actual refund** — Stage 6 will handle that (auto-charge fees on the
  saved card). Right now `chargeRequired: true` is reported in the response
  but no money moves
- **No customer email notification** — Stage 8+ (GHL workflow) will fire a
  cancellation-confirmation email when the opportunity moves to Cancelled
- **No GHL Booking custom object status update** — the booking record in
  `custom_objects.bookings` still exists with original data. If we want to
  reflect cancellation there, we either delete the record or add a status
  field to the custom object schema. Defer to a future small stage.

---

## Unlocks

- **Stage 6 (Calendar tour)** — we'll see deleted appointments in the
  trash/audit log
- **Stage 8+ (GHL workflows)** — cancellation triggers an "opportunity stage
  changed to Cancelled" event that can power a cancellation email

---

## When done

1. Update [`MASTER_PLAN.md`](../MASTER_PLAN.md) — Stage 5 status to `[x]`
2. Commit (if any code changed, otherwise skip):
   `Stage 5: verify cancellation flow end-to-end`
3. Move to Stage 6 (GHL Calendar settings tour)
