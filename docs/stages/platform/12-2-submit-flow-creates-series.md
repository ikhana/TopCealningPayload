# Stage 12.2 — Submit flow creates + links series for recurring bookings

**Status**: `[~]` in progress · **Time**: ~20 min · **Code changes**: 1 file

---

## The story

Stage 12.1 added the schema. Now the submit flow needs to actually USE it:

- One-time booking → 1 Booking record, `series: null` (unchanged behavior)
- Recurring booking (weekly/biweekly/etc.) → 1 BookingSeries record + 1 Booking record linked with `seriesOccurrence: 1`

Future occurrences (the +7, +14, +21 day bookings) are NOT created as Payload
records yet — that happens in Stage 12.3 when we fix the recurring scheduler.

This stage is just: get the series and first-booking link working.

---

## Builds on

- **Stage 12.1** — BookingSeries collection + series fields on Bookings
- **Stage 1** — booking submit flow

---

## What changed

`src/lib/booking/submit-flow.ts`:

**Step 3a (new)** — before creating the Booking:
- If frequency != `one-time`, create a `booking-series` record
- Extract `anchorDayOfWeek` from `serviceDate`
- Extract `anchorTime` from `serviceTime` (handles both ISO and "09:00 AM" formats)
- Record the user (or null for guests)
- Status starts as `active`

**Step 3b** (was Step 3) — when creating the Booking:
- If a series was created above, set `series: seriesId, seriesOccurrence: 1`

**Catch block** (error path) — if the booking submit fails after the series was created:
- Mark the series `cancelled` with reason "First occurrence failed: ..."
- This keeps the database consistent — no orphan "active" series with no successful booking

---

## Verify

After restarting dev server + regenerating types (if not already done):

### One-time booking
1. Submit a One-Time booking via the wizard
2. Payload admin → Bookings → open the new record
3. Confirm: `series` field is **empty**, `seriesOccurrence` is empty
4. Booking Series collection: no new record created

### Weekly booking
1. Submit a Weekly booking via the wizard
2. Payload admin → Booking Series → open the new record
3. Confirm: `status: active`, `frequency: weekly`, `anchorDayOfWeek` matches the day, `anchorTime` matches the time picked
4. Payload admin → Bookings → open the new booking
5. Confirm: `series` field links to the series above, `seriesOccurrence: 1`

### Error path (manual test)
- Temporarily break a downstream step (e.g. wrong GHL_LOCATION_ID)
- Submit a Weekly booking → should fail
- Check Booking Series → most recent record should be `status: cancelled` with a reason
- Restore the env var

---

## What this does NOT do

- **Doesn't create future occurrences as Payload Bookings** — Stage 12.3
- **Doesn't update the GHL Booking custom object with seriesId** — Stage 12.8
- **Doesn't show the series anywhere in the UI** — Stage 12.4+
- **Doesn't sync series cancellation back to GHL appointments** — Stage 12.10

---

## Unlocks

- **Stage 12.3** — recurring scheduler can now also create Payload records for each future occurrence, linking them to the same seriesId
- **Stage 12.4** — success screen can read the series to show the recurring schedule
- **Stage 12.5/12.6** — account page can group bookings by series

---

## When done

1. Update [`MASTER_PLAN.md`](../MASTER_PLAN.md) — Stage 12.2 to `[x]`
2. Commit: `Stage 12.2: submit flow creates BookingSeries for recurring bookings`
3. Move to Stage 12.3 (fix recurring scheduler + create future occurrence Booking records)
