# Stages 8.1 + 8.2 — Contact snapshot fields for email templates

**Status**: `[~]` in progress · **Time**: ~20 min combined · **Code changes**: 2 files + 4 new GHL contact fields

---

## The story

Email workflows triggered by a contact tag (like `booking-confirmed`)
only have access to contact-level data — not appointment placeholders.
So for the booking confirmation email to show service / date / time / total,
we denormalize them onto the contact as a "latest booking snapshot."

The full booking history still lives in the Booking custom object.
These contact fields are a convenience cache for emails, overwritten on
each new booking.

---

## What changed

### 4 new GHL contact custom fields (parent: Top Cleaning folder)

| Field | Type | ID | Merge var |
|---|---|---|---|
| Service | TEXT | `SFEXLd9lZVTXsOfeSSah` | `{{contact.service}}` |
| Service Date | TEXT | `tEctGJqYEl53s2GjiGWF` | `{{contact.service_date}}` |
| Service Time | TEXT | `6OnYENXxxLzbzUlPhsHy` | `{{contact.service_time}}` |
| Service Total | TEXT | `VWsKRs8UViYwjWT9C8WN` | `{{contact.service_total}}` |

All TEXT (pre-formatted strings, no fancy types — GHL templates don't reformat).

### `.env`

```
GHL_FIELD_SERVICE=SFEXLd9lZVTXsOfeSSah
GHL_FIELD_SERVICE_DATE=tEctGJqYEl53s2GjiGWF
GHL_FIELD_SERVICE_TIME=6OnYENXxxLzbzUlPhsHy
GHL_FIELD_SERVICE_TOTAL=VWsKRs8UViYwjWT9C8WN
```

### `src/lib/ghl/custom-fields.ts`
- `GHL_FIELDS` exports gain `service`, `serviceDate`, `serviceTime`, `serviceTotal`

### `src/lib/booking/submit-flow.ts`
- Extracted `SERVICE_LABELS` constant to module scope
- New helpers: `formatServiceDate(YYYY-MM-DD)` → "Thursday, May 21, 2026" (US/Eastern)
- New helper: `formatServiceTime(ISO or string)` → "10:00 AM" (US/Eastern)
- Step 4 upsertContact now writes the 5 contact fields (confirmation code + 4 snapshot fields)

---

## Example values written

For a "Residential Cleaning" booking on 2026-05-21 at 10:00 AM totaling $159:

```
contact.confirmation_code  =  "TC-2026-0014"
contact.service            =  "Residential Cleaning"
contact.service_date       =  "Thursday, May 21, 2026"
contact.service_time       =  "10:00 AM"
contact.service_total      =  "$159.00"
```

---

## Verify

1. Make a fresh booking
2. In GHL → Contacts → open the contact → expand "All Fields" / "Custom Fields"
3. All 4 fields populated with pre-formatted strings

---

## Unlocks

- Stage 8.3 — push the email template (use these merge vars directly)
- Stage 9 — create the workflow with no extra fetch steps

---

## When done

1. Test a booking, verify fields populate
2. Update [`MASTER_PLAN.md`](../MASTER_PLAN.md) — Stage 8 to `[~]` (in progress, 8.3 and 9 still pending)
3. Commit: `Stages 8.1+8.2: contact snapshot fields for email templates`
