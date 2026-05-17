# Stage 12.6 — Series detail page

**Status**: `[~]` in progress · **Time**: ~30 min · **Code changes**: 3 files

---

## The story

After Stage 12.5, recurring bookings group nicely on `/account/bookings`
with an expandable card. That works for quick overview, but as soon as
a customer wants to *manage* a series — see all its history, cancel the
whole sequence, pause it — they need a focused page.

This stage adds `/account/series/[id]` — a dedicated page for one series
showing its schedule, stats, full occurrence list, and series-level
actions.

---

## What you see

```
← All Bookings

Weekly Cleaning Series                            [ACTIVE]
Series #5

┌────────────┬────────────┬────────────┬────────────┐
│   TOTAL    │  UPCOMING  │ COMPLETED  │ CANCELLED  │
│     4      │     3      │     1      │     0      │
└────────────┴────────────┴────────────┴────────────┘

SCHEDULE
  Frequency        Weekly
  Anchor day       Thursday
  Anchor time      10:00
  Created          May 17, 2026
  Next cleaning    Thursday, May 28 at 10:00 AM

ALL OCCURRENCES
  #1  Thu May 21, 10:00 AM    TC-2026-0010  completed  [View →]
  #2  Thu May 28, 10:00 AM    TC-2026-0011  confirmed  [View →]
  #3  Thu Jun 4,  10:00 AM    TC-2026-0012  confirmed  [View →]
  #4  Thu Jun 11, 10:00 AM    TC-2026-0013  confirmed  [View →]

                                    [Cancel Entire Series]
```

Click "Cancel Entire Series" → confirmation card → cancels the whole
series + cascades to GHL (all appointments deleted, opportunities moved
to Cancelled, series record marked cancelled).

---

## What changed

### `src/app/(app)/account/series/[id]/page.tsx` (new)
- Server component
- Fetches series + all its bookings (ordered by seriesOccurrence)
- Renders: header / stat tiles / schedule details / occurrences list / cancel action
- Auth: owner or admin only (matches BookingSeries collection access)
- Returns 404 if series doesn't belong to the user

### `src/app/(app)/account/series/[id]/CancelSeriesButton.tsx` (new)
- Client component
- Two-step confirmation (button → confirmation card)
- Uses the existing `/api/bookings/[id]/cancel?scope=series` endpoint
- Looks up any booking in the series first to get a valid ID for the endpoint
- Redirects to /account/bookings on success

### `src/app/(app)/account/bookings/SeriesCard.tsx`
- Added a **Manage →** link in the series card header that goes to `/account/series/[id]`
- Clicking the link doesn't toggle the expand/collapse (stopPropagation)

---

## Verify

1. Make a recurring booking (weekly)
2. Go to `/account/bookings` — see the series card with a new **Manage →** button
3. Click Manage → land on `/account/series/[id]` showing all 4 occurrences
4. Verify the stat tiles count correctly (4 total, 4 upcoming, 0 completed, 0 cancelled)
5. Click "Cancel Entire Series" → confirmation card → click "Yes, Cancel Series"
6. Should redirect to `/account/bookings` and show the series as cancelled

In GHL → all 4 appointments deleted, opportunity moved to Cancelled.
In Payload → all 4 bookings `status: cancelled`, series `status: cancelled`.

---

## What this does NOT do

- **No per-occurrence skip/reschedule** — Stages 12.10b / 12.11b (future)
- **No pause series action** — could add as a quick follow-up (just sets series.status = paused)
- **No edit series schedule** — power-user feature for later

---

## Unlocks

- Customer has a single place to manage their recurring relationship
- Future series-level actions (pause, edit schedule, change crew preference) have a home

---

## When done

1. Test the full flow: create → view detail page → cancel series → verify cascade
2. Update [`MASTER_PLAN.md`](../MASTER_PLAN.md) — Stage 12.6 to `[x]`
3. Commit: `Stage 12.6: series detail page with stats, occurrence list, and cancel-series action`
