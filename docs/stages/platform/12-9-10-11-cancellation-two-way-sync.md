# Stages 12.9 + 12.10 + 12.11 — Cancellation modal + two-way Payload↔GHL sync

**Status**: `[~]` in progress · **Time**: ~60 min combined · **Code changes**: 4 files

These three stages ship together because they're tightly coupled — the
modal needs the server endpoint, the server endpoint needs the GHL push
logic, and the reverse webhook needs the same data model on both sides.

---

## 12.9 — Cancellation modal: this-one vs whole-series

### What changed

`src/app/(app)/account/bookings/[id]/CancelButton.tsx`:
- New `hasSeries` + `totalInSeries` props
- When the booking is part of a series with more than one occurrence, the
  confirm dialog shows two radio options:
  - **Just this cleaning** (default) — only this occurrence cancels
  - **Cancel the entire series** — all remaining occurrences cancel
- Confirm button label adapts: "Yes, Cancel" vs "Yes, Cancel Series"
- Sends `?scope=series` to the cancel endpoint when series is selected

`src/app/(app)/account/bookings/[id]/page.tsx`:
- Fetches with `depth=1` so `series` is hydrated
- Queries siblings (non-cancelled bookings in same series) to compute `totalInSeries`
- Passes both props down

For **one-time bookings**, the modal looks identical to before — no scope selector.

---

## 12.10 — Forward sync: Payload cancel → GHL cancel

### What changed

`src/app/(payload)/api/bookings/[id]/cancel/route.ts`:
- Accepts `?scope=single|series` query param (default: single)
- Refactored cancel logic into `cancelOneBooking()` helper:
  - Skips already-cancelled / completed bookings (idempotent)
  - Deletes the GHL appointment (best-effort)
  - Moves the GHL opportunity to Cancelled stage (best-effort)
  - Marks Payload booking status `cancelled`
- For `scope=series`:
  - Loads all bookings in the series
  - Cancels each cancellable one via the helper
  - Marks the `BookingSeries` record itself `cancelled` with `cancelledAt` + reason

Response shape:
```json
// scope=single
{ ok: true, scope: 'single', bookingId, policy, chargeRequired, feePercent }

// scope=series
{ ok: true, scope: 'series', seriesId, cancelledCount, skippedCount, results: [...] }
```

---

## 12.11 — Reverse sync: GHL webhook → Payload update

### Why we need it

Right now, an admin could log into GHL UI and cancel an appointment directly.
Our Payload would stay out of sync — the booking would still show as
confirmed in `/account/bookings`. Customer sees one reality, GHL has another.

The reverse-sync webhook closes that gap.

### What changed

New endpoint `src/app/(payload)/api/webhooks/ghl/route.ts`:
- `POST /api/webhooks/ghl`
- Handles `AppointmentDelete` and `AppointmentUpdate` (when status changes to cancelled)
- Extracts the appointment id from various possible payload shapes (GHL is inconsistent)
- Looks up the Payload booking by `ghlAppointmentId`
- Marks it `cancelled` with `failureReason: "Cancelled in GHL via webhook"`
- Idempotent — if already cancelled, no-op
- Logs everything for audit

### How to configure GHL → Payload webhook

This is a **one-time setup in GHL UI** (cannot be done via API):

1. GHL → **Settings → Integrations → Webhooks → Add Webhook**
2. URL: `https://<your-domain>/api/webhooks/ghl` (must be publicly accessible — use Vercel preview URL or production after deploy)
3. Events: tick `AppointmentCreate`, `AppointmentUpdate`, `AppointmentDelete`
4. Copy the signing secret → paste into `.env` as `GHL_WEBHOOK_SIGNING_SECRET`
5. Save

**For local dev testing**: use ngrok or Vercel preview. Localhost is not reachable from GHL.

### TODO: signature verification

The endpoint currently accepts any payload without verifying the HMAC
signature. This is fine for dev, **not safe for production**. When the
secret is set in GHL, we add a check like:

```typescript
const signature = request.headers.get('x-ghl-signature')
const expected = hmac('sha256', GHL_WEBHOOK_SIGNING_SECRET, body)
if (signature !== expected) return 401
```

This is a small follow-up task — add a `// TODO` comment in the file so
we remember.

---

## Verify the full loop

### Scenario A: Customer cancels one of 4 weekly bookings

1. Make a weekly booking → 4 records in Payload (occurrences 1-4)
2. Log in → `/account/bookings` → expand the series card
3. Click into occurrence #2 (the second Thursday) → click Cancel
4. Modal shows scope selector → choose "Just this cleaning" → confirm
5. Verify:
   - Payload booking #2 → status `cancelled`
   - GHL appointment for that date → deleted (check calendar)
   - GHL opportunity (if exists) → moved to Cancelled stage
   - Series record → still `active`
   - Bookings 1, 3, 4 → still confirmed

### Scenario B: Customer cancels the entire series

1. Same setup as above
2. Click into any occurrence → Cancel
3. Choose "Cancel the entire series" → confirm
4. Verify:
   - All 4 Payload bookings → status `cancelled`
   - All 4 GHL appointments → deleted
   - Series record → status `cancelled`, `cancelledAt` set, reason saved

### Scenario C: Admin cancels in GHL UI (reverse sync)

*Needs webhook configured in GHL. Skip if not yet set up.*
1. Make a booking
2. Open GHL → Calendar → delete that appointment
3. Check Payload admin → that booking should be `cancelled` within seconds
4. `failureReason` field shows: "Cancelled in GHL via webhook (event: AppointmentDelete)"

---

## What this does NOT do

- **No skip-this-cleaning** — only cancel. Skip-without-cancel is Stage 12.10b
- **No reschedule** — separate stage
- **No webhook signature verification** — TODO once secret is in env
- **No fee handling** — `chargeRequired: true` returned in response, but no charge fires yet (Stage 18)
- **No customer email on cancellation** — that's a GHL workflow on the Cancelled stage transition (Stage 9 territory)

---

## Unlocks

- Customer self-service is real — they can cancel individual cleanings OR the whole series
- Admin sync is real — manual GHL changes flow back to Payload
- Stage 18 (payment) can wire into the same flow for refund handling

---

## When done

1. Test scenarios A + B (C requires webhook config in GHL)
2. Update [`MASTER_PLAN.md`](../MASTER_PLAN.md) — Stages 12.9, 12.10 to `[x]`, add 12.11 row
3. Commit: `Stages 12.9-12.11: cancellation scope (single vs series) + two-way sync`
