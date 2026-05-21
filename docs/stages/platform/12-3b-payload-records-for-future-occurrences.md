# Stage 12.3b — Create Payload Booking records for each future occurrence

**Status**: `[~]` in progress · **Time**: ~30 min · **Code changes**: 1 file

---

## The story

After Stage 12.3, recurring bookings successfully create future appointments
in GHL — but **only the first occurrence** has a record in Payload. Future
occurrences exist only on the GHL calendar.

This means:
- `/account/bookings` only shows the first cleaning
- Customer has no way to cancel or reschedule individual future cleanings
- The data model is incomplete

This stage closes that gap. Every successful GHL future appointment now also
gets a Payload `bookings` record, linked to the series via `seriesId` +
`seriesOccurrence`.

---

## What changed

`scheduleRecurringAppointments` in `src/lib/booking/submit-flow.ts`:

**Before (Stage 12.3)**:
- Loop builds list of future occurrence start times
- Skip any past 60-day window
- POST to GHL for each remaining occurrence
- Log failures

**After (Stage 12.3b)**:
- Same window-cap logic
- For each occurrence, sequentially:
  1. Create the **GHL appointment**
  2. If successful, create the matching **Payload Booking record**:
     - Linked via `series: seriesId` + `seriesOccurrence: N`
     - `serviceDate` / `serviceTime` set to the future occurrence's start time
     - `ghlAppointmentId` pointing at the GHL appointment
     - `status: 'confirmed'` (matches GHL auto-confirm behavior)
     - Unique `confirmationCode` per occurrence (`TC-YYYY-XXXX` based on the booking's own id)
     - Unique `idempotencyKey` (`${parentKey}-occ${N}`)
     - All customer/property/pricing data cloned from the parent submit
  3. If GHL succeeds but Payload fails → log a reconciliation message (rare; the GHL appointment stands)

We now use a `for` loop instead of `Promise.allSettled` because each
iteration depends on the GHL response (we need the appointment ID for the
Payload record). Sequential is slightly slower but much simpler.

---

## What's NOT created for future occurrences

Each future occurrence gets:
- ✅ GHL appointment
- ✅ Payload Booking record (this stage)

Each future occurrence does NOT yet get:
- ❌ Its own GHL opportunity (the deal is the series, not each cleaning)
- ❌ Its own GHL Booking custom-object record — this is Stage 12.8
- ❌ Confirmation email (deferred to email workflow stages)

These can be added later without rebuilding the data model.

---

## Field mapping for future-occurrence Booking records

| Field | Value |
|---|---|
| `user` | Same as parent booking (or null for guest) |
| `series` | Same `seriesId` as parent |
| `seriesOccurrence` | 2, 3, 4... (parent is 1) |
| `confirmationCode` | `TC-YYYY-XXXX` from the new booking's own id |
| `serviceType` | Same as parent |
| `frequency` | Same as parent |
| `serviceDate` | Future date (YYYY-MM-DD) |
| `serviceTime` | Future ISO start time |
| `address` | Same as parent |
| `property` | Same as parent |
| `selectedExtras` | Same as parent |
| `hasChildren` / `hasPets` / `accessMethod` | Same as parent |
| `pricing` | Same as parent (per-clean price) |
| `status` | `confirmed` (auto, mirrors GHL) |
| `ghlAppointmentId` | The future GHL appointment's id |
| `idempotencyKey` | `${parent}-occ${N}` for uniqueness |

---

## Verify

After dev server reload, submit a **weekly** booking:

1. Payload admin → Bookings → should see **4 records** (1 main + 3 weekly future)
2. All 4 share the same `series` (linked record)
3. `seriesOccurrence` values: 1, 2, 3, 4
4. Each has a unique `confirmationCode` (TC-YYYY-XXXX)
5. Each has a unique `idempotencyKey`
6. Each has its own `ghlAppointmentId`
7. All 4 GHL appointments exist on the Round Robin calendar

For **3-weekly**, the count should be 3 in Payload (occurrences 1, 2, 3 at days 0/+21/+42 — the +63 day one is window-skipped).

---

## What this does NOT do

- **No GHL custom-object record per occurrence** — Stage 12.8
- **No success screen update** — Stage 12.4
- **No account page grouping** — Stage 12.5
- **No cancellation cascade** — Stage 12.9 / 12.10

But all of those are now possible because the data exists.

---

## Unlocks

- Stage 12.4 — show full schedule on success screen (now we have records to read)
- Stage 12.5 — group `/account/bookings` by `series` (now we have multiple bookings per series)
- Stage 12.6 — `/account/series/[id]` page lists all occurrences
- Stage 12.9 — cancellation modal can target this occurrence OR all in series

---

## When done

1. Test a weekly booking → check Payload Bookings has 4 records, all linked
2. Update [`MASTER_PLAN.md`](../MASTER_PLAN.md) — add Stage 12.3b as `[x]`
3. Commit: `Stage 12.3b: create Payload records for each recurring future occurrence`
4. Move to Stage 12.4 (success screen)
