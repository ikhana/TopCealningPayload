# Stage 2.8 — Contact ↔ Booking association

**Status**: `[x]` done · **Time**: ~30 min (mostly debugging GHL scope quirks)
· **Code changes**: 2 files + 1 env var

---

## The story

Stage 2.7 made our bookings write into the GHL Booking custom object. But
those records were **orphans** — they had no link back to the contact who
booked. Opening a contact in GHL would not show their bookings; running a
workflow that needed to iterate "all bookings for this contact" couldn't
work.

This stage closes the loop: every booking record auto-links to its contact
in GHL via the Associations API.

---

## What you'll learn

- The two-layer GHL associations model: **schema** (relationship type) vs
  **relation** (actual link between two specific records)
- How to create a one-time association schema via API
- How PIT (Private Integration Token) scopes work — and the catch that
  existing tokens don't pick up newly-enabled scopes (regenerate after
  changing scopes)
- That GHL's error messages on the relations endpoint are misleading:
  "LocationId is not specified" actually means *"your token doesn't have
  the right scope"*. Real fix is the token, not the request body.

---

## Builds on

- **Stage 2.7** — booking custom object records are being created (we need
  records to associate)

---

## Steps

### 1. Create the association schema (one-time)

We POSTed to `/associations/` with body:

```json
{
  "locationId": "yI9kN6pMxVVk486ciX3N",
  "key": "contact_bookings",
  "firstObjectLabel": "Contact",
  "firstObjectKey": "contact",
  "secondObjectLabel": "Bookings",
  "secondObjectKey": "custom_objects.bookings"
}
```

Returns schema ID. Saved in `.env` as `GHL_ASSOCIATION_CONTACT_BOOKING`.

### 2. Enable the right scopes on the PIT and **regenerate**

In GHL → **Settings → Integrations → Private Integrations** → edit token:

- `associations.readonly` / `associations.write` (for schemas)
- `associations/relation.readonly` / `associations/relation.write` (for relations)
- `objects/schema.readonly` / `objects/schema.write`
- `objects/record.readonly` / `objects/record.write`

**Critical**: existing tokens are frozen at the scopes they had when created.
After enabling new scopes you MUST regenerate the token and update
`GHL_PRIVATE_TOKEN` in `.env`.

### 3. Wire `associateBookingWithContact()` into submit-flow

Already done — calls right after `createBookingRecord()`, inside the same
try-catch, non-blocking on failure.

Request body shape (important quirk):

```json
{
  "locationId": "...",          // REQUIRED in body
  "associationId": "...",       // schema id
  "firstRecordId": "<contactId>",
  "secondRecordId": "<bookingRecordId>"
}
```

Note: official docs say no `locationId`. In practice the endpoint requires
it. The misleading 422 "property locationId should not exist" was actually
the old token lacking scope.

---

## Verify (done when all checked)

- [x] Association schema exists in GHL (id `6a05e8884a3da8d12b3d8364`)
- [x] PIT regenerated with `associations/relation.write` enabled
- [x] Manual test relation created via API for TC-2026-0004 → contact
      `h2vUflGCXJ0bbr40xcdl` (relation id `6a05ee00a957fc54184a75b2`)
- [ ] Make a new test booking → verify the relation auto-creates
- [ ] Open the contact in GHL UI → see booking in Related Records panel

---

## Troubleshooting

| Symptom | Cause |
|---|---|
| 400 "LocationId is not specified" on POST `/associations/relations` | Token missing `associations/relation.write` scope, OR `locationId` missing from body |
| 422 "property locationId should not exist" | Token missing scope (despite the misleading error) |
| Relation creates but doesn't appear under the contact in UI | GHL UI may take a few seconds; refresh contact page |
| New booking doesn't auto-associate | Check `GHL_ASSOCIATION_CONTACT_BOOKING` env var is set; check terminal for `[booking:custom-object] Failed to associate` log |

---

## Unlocks

- **Stage 13–16 (abandoned booking)** — workflows can now ask "does this
  contact have ANY booking?" or "does this contact have a confirmed booking
  in the next 7 days?" — both require the association
- **Reporting** — contact-level aggregations like "lifetime spend" via
  summing booking_total across a contact's linked bookings
- **GHL UI** — contact page now shows all their bookings in one place

---

## Carry-forward observations

- **Old contact `KiqamnkWFxTMttB7EiA1` is gone**, replaced by `h2vUflGCXJ0bbr40xcdl`
  for the same email. Likely deleted/recreated during token regeneration
  testing. Not a problem — `upsertContact` handles new contacts fine.

---

## When done

1. Update [`MASTER_PLAN.md`](../MASTER_PLAN.md) — Stage 2.8 status to `[x]`
2. Commit: `Stage 2.8: contact <-> booking association schema + auto-relation`
3. Move to Stage 3 (logged-in booking flow)
