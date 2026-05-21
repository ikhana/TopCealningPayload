# Stage 1 — Test the full booking submit

**Status**: `[ ]` not started · **Time**: ~20 min · **Code changes**: none

---

## The story

Before we trust anything else (workflows, emails, abandoned-cart) we need to
*see with our own eyes* that the core booking flow does what we think it does.
A guest user walks in, fills the wizard, hits submit, and ends up with a real
Booking record in Payload and a real confirmation code on screen.

If this is broken, everything downstream is built on sand.

---

## What you'll learn

- How the wizard's 10 steps map to the data that ends up in Payload
- Where to look in Payload admin to inspect a booking
- What `idempotencyKey` does (and why double-submit doesn't create duplicates)
- The shape of a real `Booking` document — fields, status, relationships

No new GHL knowledge in this stage — that's Stage 2. This one is pure
*"does our code work?"*.

---

## Builds on

- Nothing — this is the foundation stage.

---

## Steps

### 1. Pre-flight

- Run `pnpm run dev` from the project root → confirm `http://localhost:3000` loads
- Open `.env` → confirm `NEXT_PUBLIC_PAYMENT_ENABLED=true` and `PAYMENT_ENABLED=false`
- Open Payload admin at `/admin` → log in, confirm **Bookings** collection is visible

### 2. Run the wizard end-to-end as a guest

Use [`BOOKING_FLOW_TESTING.md`](../BOOKING_FLOW_TESTING.md) — follow **Phase 1**
exactly. Use **your own email address** (we'll need it in later stages when
we test emails).

Use the test data table in that doc — don't improvise field values until
you've done one clean run with the canonical inputs.

### 3. Inspect the booking in Payload

Use [`BOOKING_FLOW_TESTING.md`](../BOOKING_FLOW_TESTING.md) — follow **Phase 2**.
Tick every checkbox in that section as you verify.

### 4. (Optional but recommended) Test idempotency

Follow **Phase 6** of `BOOKING_FLOW_TESTING.md`. This proves the system
won't double-charge or double-book if the browser retries a request.

---

## Verify (done when all checked)

- [ ] Wizard completed without errors
- [ ] Confirmation screen shows a `TC-YYYY-XXXX` code and the booked time
- [ ] Booking record exists in Payload admin
- [ ] Status is `confirmed`, all GHL ID fields populated (we'll inspect their actual content in Stage 2)
- [ ] `user` field is empty (guest booking)
- [ ] Idempotency test returns same booking, no duplicate created

---

## What if it doesn't work

Most common failures and where to look:

- **Submit returns 500** → terminal will show the error. Usually `GHL_LOCATION_ID` or `GHL_CALENDAR_ID` missing/wrong
- **Submit returns 422** → validation error on a specific field; the response says which step + field
- **Confirmation screen flashes then goes blank** → check browser console; likely a React error after submit

Full troubleshooting table is at the bottom of [`BOOKING_FLOW_TESTING.md`](../BOOKING_FLOW_TESTING.md).

---

## Unlocks

- **Stage 2** — Verify the GHL handshake. Now that we have a known-good booking, we can go to GHL and verify the contact, appointment, and opportunity look right.
- **Stage 5** — When we send a confirmation email, we'll re-run this test with the email step added to the workflow.

---

## When done

1. Update [`MASTER_PLAN.md`](../MASTER_PLAN.md) — change Stage 1 status to `[x]`
2. `git add docs/` → commit with message `Stage 1: booking submit verified end-to-end`
3. Move to Stage 2

(No code changes in this stage, so the commit is docs-only.)
