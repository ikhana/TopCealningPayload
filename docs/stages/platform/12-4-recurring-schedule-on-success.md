# Stage 12.4 — Show recurring schedule on success screen

**Status**: `[~]` in progress · **Time**: ~25 min · **Code changes**: 2 files

---

## The story

Today, after a customer completes a recurring booking (weekly / biweekly /
etc.), the success screen shows ONE date — the first cleaning. The customer
has no idea their next cleanings are already on the calendar. They might
even think they have to re-book manually.

This stage closes that visibility gap. The success screen now lists every
upcoming cleaning explicitly, so the customer leaves with full confidence
about what they signed up for.

---

## What you'll see now

### Before
```
Booking Confirmed!
TC-2026-0013
Thursday, May 21 at 10:00 AM

Thank you — we've received your booking...
```

### After (for a weekly booking)
```
Booking Confirmed!
TC-2026-0013

Your first cleaning: Thursday, May 21 at 10:00 AM

YOUR UPCOMING CLEANINGS
  • Thu, May 28, 10:00 AM
  • Thu, Jun 4, 10:00 AM
  • Thu, Jun 11, 10:00 AM

Each cleaning can be rescheduled or skipped individually from your account.

Thank you — we've received your booking...
```

For **one-time bookings**, the upcoming-cleanings block is hidden — same as before.

---

## What changed

### Server (`src/lib/booking/submit-flow.ts`)

- **New helper**: `computeOccurrenceSchedule(frequency, firstStartTime)` — pure
  function, no API calls. Computes which future occurrences would be
  scheduled (after window-cap). Used by:
  - The submit endpoint, to include the schedule in the response
  - The recurring scheduler, to avoid duplicating the math
- **`SubmitBookingResult`** interface adds `futureOccurrences: Array<{occurrence, startTime}>`
- **`submitBooking`** returns the computed schedule alongside confirmation code

### Frontend (`src/blocks/TCBookingForm/Component.client.tsx`)

- **`BookingSuccess`** component accepts a `futureOccurrences` prop and
  renders a list block when present
- Captures `futureOccurrences` from API response into a new state hook
- Renders only when the array is non-empty (one-time bookings still
  see the simpler layout)
- All times rendered in `America/New_York` (consistent with timezone fix)

---

## Verify

1. Refresh `/booking` in incognito
2. Submit a **weekly** booking — success screen shows main + 3 future occurrences
3. Submit a **biweekly** booking — same pattern, 14-day spacing
4. Submit a **3-weekly** booking — 2 future occurrences only (3rd window-skipped)
5. Submit a **one-time** booking — no upcoming-cleanings block

Times shown in Eastern (correct for the business), styled as small bullet list.

---

## What this does NOT do

- **Doesn't make the dates interactive** — just informational. Customer can't yet click a date to reschedule that specific cleaning. (Stage 12.10 / 12.11 — single-occurrence actions)
- **Doesn't show same data on `/account/bookings`** — Stage 12.5 will group by series
- **Doesn't email the schedule** — Stage 8/9 confirmation email will include it

---

## Unlocks

- Customer ships out of the wizard with clarity about their recurring commitment
- Stage 12.5+ can use the same data model (already in Payload) to power the account page

---

## When done

1. Test all 5 frequency types via the wizard, verify display
2. Update [`MASTER_PLAN.md`](../MASTER_PLAN.md) — Stage 12.4 to `[x]`
3. Commit: `Stage 12.4: show recurring schedule on booking success screen`
