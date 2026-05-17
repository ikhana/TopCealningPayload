# Stage 12.5 — Group bookings by series on `/account/bookings`

**Status**: `[~]` in progress · **Time**: ~30 min · **Code changes**: 2 files

---

## The story

After Stage 12.3b, a customer with a recurring series has 4 individual
Booking records in Payload. Without grouping, `/account/bookings` shows
4 separate cards in a flat list — visually noisy and confusing
("am I in a series, or did I book 4 separate cleanings?").

This stage groups bookings by their series. A weekly customer now sees
**one collapsible series card** with all 4 occurrences nested inside.
One-time bookings still render as standalone cards.

---

## What the page looks like now

### One-time customer
```
[Booking card — Service: Residential, May 25, Confirmed]
[Booking card — Service: Move-out, Apr 12, Completed]
```
(Same as before.)

### Recurring customer
```
┌─ 🔁 Weekly Cleaning Series · 4 cleanings · Next: Thu May 28      [^]
│   #1  Thu May 21, 10:00 AM    TC-2026-0001    confirmed   [View →]
│   #2  Thu May 28, 10:00 AM    TC-2026-0002    confirmed   [View →]
│   #3  Thu Jun 4,  10:00 AM    TC-2026-0003    confirmed   [View →]
│   #4  Thu Jun 11, 10:00 AM    TC-2026-0004    confirmed   [View →]
└─
```

### Mixed customer
```
┌─ 🔁 Biweekly Cleaning Series · 4 cleanings · Next: ...  [^]
│   #1 ... #2 ... #3 ... #4 ...
└─
[Standalone one-time booking]
```

---

## What changed

### `src/app/(app)/account/bookings/SeriesCard.tsx` (new)
- Client component (uses `useState` for expand/collapse)
- Header: frequency label + status pill + count + "Next: ..." preview
- Expanded body: numbered list of all occurrences
- Each occurrence row: occurrence #, date/time, confirmation code, status, View button
- Cancelled occurrences fade to 55% opacity

### `src/app/(app)/account/bookings/page.tsx`
- Fetches with `depth=1` so the `series` relationship hydrates
- `groupBookings()` helper splits bookings into:
  - `series` groups (multiple bookings sharing the same series)
  - `single` groups (one-time bookings, `series = null`)
- Sorts groups by most-recent-first (using series.createdAt for series, booking.createdAt for singles)
- Renders `SeriesCard` for series groups + existing `BookingCard` for singles

---

## Verify

1. Make a fresh **weekly** booking → log in → go to `/account/bookings`
2. Should see ONE series card (not 4 flat cards)
3. Click the card header → list of 4 occurrences expands/collapses
4. Make a separate **one-time** booking with the same user
5. Reload → see TWO things: the weekly series card AND a standalone one-time card
6. The "Next: ..." preview should show the earliest non-cancelled future occurrence

---

## What this does NOT do

- **No cancel button on series-level** — Stage 12.9
- **No skip / reschedule per occurrence** — Stages 12.10, 12.11
- **No series detail page** — could add later if needed; the expand/collapse on this page may be enough

---

## Unlocks

- Stage 12.9 — cancellation modal now has a clear "series-level" affordance
- Stage 12.6 (series detail page) — optional, may not be needed

---

## When done

1. Make weekly + one-time bookings, verify grouping
2. Update [`MASTER_PLAN.md`](../MASTER_PLAN.md) — Stage 12.5 to `[x]`
3. Commit: `Stage 12.5: group /account/bookings by series with expandable card`
