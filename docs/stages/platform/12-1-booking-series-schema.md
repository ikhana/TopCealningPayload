# Stage 12.1 — BookingSeries collection + series link on Bookings

**Status**: `[~]` in progress · **Time**: ~30 min · **Code changes**: 3 files

---

## The story

We're moving Top Cleaning's recurring booking architecture from "silent
fire-and-forget appointments" to a properly-modeled recurring series.
Before any of the customer-visible features (success screen schedule,
account page grouping, skip/reschedule, cancel-series modal) can ship,
we need the database to understand what a "series" actually is.

This stage adds the foundational schema. No business logic changes yet.
Submit flow still creates bookings the same way. We just have the data
structure ready for Stage 12.2+ to plug into.

---

## Why a separate collection

Recap of the decision (full reasoning in chat history):
- Series-level state (status, anchor day/time, payment method later)
  needs ONE place to live, not denormalized across N bookings
- Pause/cancel-series operations become 1-row updates
- Future cron-based auto-extension queries are clean
- One-time bookings don't have a series → `Booking.series = null` for them

---

## What's in the schema

### New collection: `booking-series` slug

| Field | Type | Notes |
|---|---|---|
| `id` | auto | Payload-assigned |
| `user` | relationship to users | Null for guest series |
| `status` | select | `active` / `paused` / `cancelled` |
| `frequency` | select | weekly, biweekly, 3weekly, monthly, 8weekly |
| `anchorDayOfWeek` | number 0–6 | 0=Sunday, 6=Saturday |
| `anchorTime` | text | "11:00" — calendar timezone, HH:mm |
| `cancelledAt` | date | When series was cancelled |
| `cancellationReason` | textarea | Why (admin or customer note) |
| `createdAt` / `updatedAt` | auto | Payload timestamps |

### New fields on `bookings`

| Field | Type | Notes |
|---|---|---|
| `series` | relationship to booking-series | Null for one-time bookings |
| `seriesOccurrence` | number ≥1 | Which occurrence within the series (1 = first) |

### Access rules on the new collection

- **Create**: anyone (backend uses this during booking submit, even for guests)
- **Read**: admin or owner only (matches Bookings access pattern)
- **Update / Delete**: admins only

---

## Files changed

1. `src/collections/BookingSeries/index.ts` — new
2. `src/collections/Bookings/index.ts` — added `series` and `seriesOccurrence` fields
3. `src/payload.config.ts` — registered the new collection

---

## Verify (done when all checked)

After restarting the dev server:

- [ ] Open Payload admin → sidebar shows **Bookings** group with **Bookings** and **Booking Series** items
- [ ] Click into **Booking Series** → "Create New" → see all fields render correctly
- [ ] Don't actually save — we'll create them programmatically in Stage 12.2
- [ ] Run `pnpm generate:types` → no errors, `src/payload-types.ts` regenerates with new types

---

## What this does NOT do

- **Doesn't create any BookingSeries records yet** — Stage 12.2 wires the submit flow
- **Doesn't fix the recurring 400 errors** — Stage 12.3
- **Doesn't change customer UX** — Stages 12.4–12.6
- **Doesn't sync to GHL** — Stage 12.7+
- **Doesn't touch payment** — Stage 18

---

## Unlocks

- **Stage 12.2** — Submit flow can now create + link series
- **Stage 12.3** — Recurring scheduler bug fix has a place to record what it scheduled
- **Stage 12.4+** — All UI changes can read from the series record

---

## When done

1. Restart dev server
2. Run `pnpm generate:types`
3. Confirm Payload admin shows the new collection
4. Update [`MASTER_PLAN.md`](../MASTER_PLAN.md) — replace Stage 12 row with 12.1–12.3 breakdown
5. Commit: `Stage 12.1: BookingSeries collection + series link on Bookings`
6. Move to Stage 12.2
