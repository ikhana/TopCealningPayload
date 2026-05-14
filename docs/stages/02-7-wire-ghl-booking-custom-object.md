# Stage 2.7 — Wire GHL Booking custom object

**Status**: `[~]` in progress · **Time**: ~30 min · **Code changes**: 3 files

---

## The story

Stage 2 verified that the booking creates a contact, appointment, and
opportunity in GHL — all good. But you also designed a **custom object**
called `Booking` in GHL with 16 fields (service type, sqft, address,
extras, pricing, etc.) — and **nothing in our code was writing to it**.

The custom object is what powers booking-level segmentation, reporting,
and any workflow that needs to read booking details by confirmation code.
Without records in it, those things can't work.

This stage wires up that write.

---

## What you'll learn

- The shape of GHL's Custom Objects API (`/objects/{key}/records`)
- Two quirks discovered during testing:
  - Property keys in the create payload use the **short name** only
    (`confirmation_code`, NOT `custom_objects.bookings.confirmation_code`)
  - `CHECKBOX` fields require **array values** (`["no"]`, not `"no"`)
- How fire-and-forget pattern works for non-critical GHL calls
  (failures log, don't break the booking)

---

## Builds on

- **Stage 1** — booking submit flow works end-to-end
- **Stage 2** — confirmed GHL contact/appointment/opportunity creation
- **The 16-field custom object schema** already configured in GHL UI
  (see master plan finding for full field list)

---

## Steps

### 1. Add the GHL custom objects client

New file: [`src/lib/ghl/custom-objects.ts`](../../src/lib/ghl/custom-objects.ts)

- Exports `createBookingRecord(params)` which POSTs to
  `/objects/custom_objects.bookings/records`
- Handles property key formatting (no prefix), checkbox array wrapping,
  service type mapping (`movein-out` → `move_inout`, etc.), bedroom/bathroom
  normalization to GHL's `1`–`5` options

### 2. Add `ghlBookingObjectId` field on the Bookings collection

In [`src/collections/Bookings/index.ts`](../../src/collections/Bookings/index.ts),
right after the existing `ghlOpportunityId` field, add a new text field with
`admin: { position: 'sidebar' }` so the ID is visible in the admin sidebar
alongside the other GHL IDs.

### 3. Call `createBookingRecord` from `submit-flow.ts`

In [`src/lib/booking/submit-flow.ts`](../../src/lib/booking/submit-flow.ts),
right after the opportunity is created, wrap the call in try/catch.
**Non-blocking** — if it fails, log and continue. The main booking is more
important than the custom object record.

### 4. Persist the returned ID on the booking

In the final `payload.update` block (Step 8 of submit-flow), add
`ghlBookingObjectId` to the data spread (only if not null).

---

## Verify (done when all checked)

- [ ] Make a fresh test booking in the wizard (any service type)
- [ ] Confirmation screen appears with a new `TC-YYYY-XXXX` code
- [ ] Open Payload admin → the new booking has `ghlBookingObjectId` populated
- [ ] In GHL, go to **Custom Objects** → **Bookings** — the new record appears
- [ ] Click into the record — all 16 fields are populated correctly:
  - `confirmation_code` matches the booking
  - `service_type` is in GHL's option format (e.g. `move_inout` not `movein-out`)
  - `service_date` / `service_time` correct
  - Address fields populated
  - `has_pets` / `has_children` show as Yes/No
  - `selected_extras` is a readable comma-joined string

---

## What if it fails

| Symptom | Likely cause |
|---|---|
| Booking record doesn't appear in GHL | `[booking:custom-object]` log line should show the error. Likely a malformed property — check the API response in the log. |
| "Missing required properties" error in logs | Property key has wrong format — should be short name only (`confirmation_code`), not the full prefix. |
| "Has Pets must be a list of values" | Checkbox field needs array — `["yes"]` not `"yes"`. |
| "Property option not valid" | The `service_type` value isn't in GHL's allowed options. Check the mapping in `SERVICE_TYPE_MAP` matches the GHL field's options. |
| Booking succeeds but `ghlBookingObjectId` is empty in Payload | The custom object call failed (check logs). Booking continued because the call is non-blocking — that's by design. |

---

## What this does NOT do (yet)

- **Contact ↔ Booking association**: GHL currently has no association schema
  between `contact` and `custom_objects.bookings`. The booking record is
  created standalone. If you want bookings to show up under a contact's
  "Related Records" panel in GHL UI, we need to:
  1. Create an association schema via `POST /associations/` (one-time setup)
  2. Then `POST /associations/relations/` per booking to link them
  This can be a small follow-up stage.

---

## Unlocks

- **Future stage** — Contact ↔ Booking associations so bookings appear under
  the contact in GHL UI
- **Stage 8 (Confirmation Email)** — the email template can now read booking
  fields directly from the Booking custom object instead of relying only on
  contact custom fields
- **GHL reporting & segmentation** — "show me all residential bookings over
  $300 in May" is now a real query

---

## When done

1. Update [`MASTER_PLAN.md`](../MASTER_PLAN.md) — Stage 2.7 status to `[x]`
2. Commit with: `Stage 2.7: write booking records to GHL custom object`
3. Move to Stage 2.5 (wizard validation + UX polish) — or pick the next
   stage you prefer
