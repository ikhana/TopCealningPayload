# Stages 12.7 + 12.8 — GHL contact tags and custom-object fields for recurring series

**Status**: `[x]` done · **Time**: ~20 min combined · **Code changes**: 2 files + GHL custom-object schema

---

## The story

Now that bookings, series, and custom-object records all live in both
Payload and GHL, we close the last sync gap: **GHL needs to know which
contacts are in recurring series, and which booking records belong to
which series.**

Two small additions:

- **12.7 — Contact tags**: when a customer signs up for a recurring
  series, tag them `recurring-customer` + their cadence (`frequency-weekly`,
  etc.) so GHL workflows can segment them.
- **12.8 — Custom-object fields**: the GHL Booking custom-object record
  for each occurrence now carries `series_id` + `series_occurrence`, so
  GHL reports/workflows can group records by series.

---

## What changed

### `src/lib/booking/submit-flow.ts`
- Step 8b (`booking-confirmed` tagging) now adds `recurring-customer` +
  `frequency-<value>` tags when `frequency !== 'one-time'`
- `createBookingRecord` call now passes `seriesId` + `seriesOccurrence: 1`
  for the main booking (one-time bookings pass null)

### `src/lib/ghl/custom-objects.ts`
- `CreateBookingRecordParams` interface gains optional `seriesId` + `seriesOccurrence`
- Properties object conditionally includes `series_id` and `series_occurrence`
  fields when provided

### GHL custom-object schema (one-time setup, done via API)
- New field: `custom_objects.bookings.series_id` (TEXT)
- New field: `custom_objects.bookings.series_occurrence` (NUMERICAL)
- Both attached to the existing Bookings custom-object parent
- API calls (recorded for future reproduction):
  ```bash
  POST /custom-fields/
  Body: {locationId, name, dataType, objectKey: "custom_objects.bookings",
         fieldKey: "custom_objects.bookings.series_id", parentId, position}
  ```

---

## Tag inventory after 12.7

| Tag | Set when |
|---|---|
| `website-lead` | Step 1 of wizard fires lead-capture |
| `booking-confirmed` | Booking submit succeeds |
| `recurring-customer` | Booking submit succeeds AND frequency != one-time |
| `frequency-weekly` / `-biweekly` / `-3weekly` / `-monthly` / `-8weekly` | Booking submit succeeds with specific recurring cadence |

This lets future GHL workflows do:
- "Send retention email to all `recurring-customer` contacts every quarter"
- "Send weekly-cadence-specific tip emails to `frequency-weekly` contacts"
- "We miss you — for contacts who had `recurring-customer` but the series is now cancelled"

---

## What this does NOT do

- **Doesn't create custom-object records for future occurrences yet** — only the
  main booking gets a record. Future occurrences exist only in Payload + GHL
  calendar. If we want each occurrence to have its own GHL record (for
  workflow firing per cleaning), that's a future expansion of
  `scheduleRecurringAppointments`.
- **Doesn't sync existing data** — the new tags apply only to NEW bookings.
  Existing recurring contacts won't get retroactively tagged.

---

## Verify

1. Make a fresh **weekly** booking
2. In GHL → Contacts → find your contact
3. Tags panel should show: `website-lead`, `booking-confirmed`, `recurring-customer`, `frequency-weekly`
4. Custom Objects → Bookings → find the new record
5. `Series ID` field shows the Payload series id (e.g. "6")
6. `Series Occurrence` shows `1`

For one-time bookings:
- Tags: just `website-lead`, `booking-confirmed` (no recurring/frequency tags)
- Custom object record: `series_id` and `series_occurrence` fields are empty

---

## When done

1. Test verification above
2. Update [`MASTER_PLAN.md`](../MASTER_PLAN.md) — Stages 12.7 and 12.8 to `[x]`
3. Commit: `Stages 12.7 + 12.8: tag recurring contacts + series_id on GHL booking records`
