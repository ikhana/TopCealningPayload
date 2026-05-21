# Stage 3 — Logged-in booking (create account + book)

**Status**: `[ ]` not started · **Time**: ~15 min · **Code changes**: none

---

## The story

Stages 1, 2, 2.7, 2.8 all tested the **guest** path: a visitor with no
account books, gets a contact + appointment + opportunity + custom object
record. Everything works, but the `user` field on the Payload booking
was empty.

Now we test the **logged-in** path: a user creates an account, logs in,
then books. The expectation:

- Same flow, same UI, same GHL side
- **But** the Payload booking record now has `user` populated, linking
  back to the user account
- This unlocks Stage 4 (the user can see their bookings in `/account/bookings`)

If this works, we know our auth-aware code paths are correct.

---

## What you'll learn

- How Payload handles auth in the booking API (`getMeUser` with optional `user`)
- The one branch in `submit-flow.ts` that conditionally includes `user` —
  this is the entire difference between guest and logged-in
- How `useBookingForm` / form state stays the same regardless of auth status

---

## Builds on

- **Stage 1** — booking submit works
- **Stage 2** — GHL data flow works
- **Stage 2.7 / 2.8** — custom object + association work

This stage adds **no new code** — it just exercises the auth branch we
already wrote.

---

## Steps

### 1. Create an account

In a fresh **incognito window** (no cached sessions from the guest test):

- Go to `http://localhost:3000/create-account`
- Use a **different email** from your guest test (e.g., add `+test` to
  your gmail: `inaa.eth+test@gmail.com` — Gmail routes that to the same
  inbox, but Payload sees it as a different user)
- Set a password you'll remember (we'll reuse this account in Stage 4)
- Submit

You should be redirected to `/account` (or `/login`, depending on the flow).

### 2. Log in

If not already logged in from account creation:
- Go to `http://localhost:3000/login`
- Email + password → submit

Verify by visiting `http://localhost:3000/account` — should show account
details, not a login prompt.

### 3. Run the booking wizard while logged in

Open `http://localhost:3000/booking` in the **same browser session** (do
NOT use a new incognito window — we need the auth cookie).

Run the wizard end-to-end the same way as Stage 1:
- Use the `+test` email in Step 1 (so it matches the logged-in user)
- Fill all required fields properly (Stage 2.5 validation will block bad
  inputs — confirm it's working)
- Click **Simulate Payment & Continue** on Step 9
- Confirm on Step 10

### 4. Verify the booking has `user` populated

Open Payload admin → **Bookings** → the new booking should be **TC-2026-0005**
(or next sequential).

Check:
- [ ] `user` field is **populated** (this is the key difference!)
- [ ] Click the user reference — should open the user record you just created
- [ ] All other fields match what Stage 1 verified (status, GHL IDs, etc.)

### 5. Verify GHL side is the same

In GHL → contacts, search for the `+test` email. The contact should be
**new** (different from the guest test contact, because different email).
- [ ] Contact created with confirmation code custom field
- [ ] Appointment on calendar
- [ ] Opportunity in Booked stage
- [ ] Booking custom object record created
- [ ] **Association** between contact and booking record visible

The association part is now the real test of Stage 2.8 working end-to-end
on a fresh booking (not just the manual backfill).

---

## Verify (done when all checked)

- [ ] Account created successfully
- [ ] Login works
- [ ] Wizard accessible while logged in
- [ ] Booking submitted with green confirmation screen
- [ ] Payload booking has `user` field populated (the key data-flow difference)
- [ ] GHL contact + appointment + opportunity + booking object + association all created
- [ ] Stage 2.8's auto-association fired correctly (no manual backfill needed this time)

---

## What if it doesn't work

| Symptom | Likely cause |
|---|---|
| Cannot create account (form errors) | Check `Users` collection config in `src/collections/Users/index.ts` — auth may need email verification disabled in dev |
| Logged-in but `user` is empty on booking | `getMeUser({})` in `/api/bookings/route.ts` returned null; check auth cookie is being sent (browser dev tools → Application → Cookies) |
| GHL contact created with `+test` alias not displaying nicely | GHL stores the raw email; the `+test` part is technically part of the address. Cosmetic only — automation still works. |
| Association not created on new booking (Stage 2.8 regression) | Check `[booking:custom-object]` logs; verify `GHL_PRIVATE_TOKEN` is still the regenerated one with the right scopes |

---

## Unlocks

- **Stage 4** — Account bookings list + detail page. Now that the booking
  is linked to a user, `/account/bookings` should show it.
- **Stage 5** — Cancellation flow. Cancellations are user-scoped; only
  works for logged-in bookings.
- **Future loyalty / repeat-customer features** — anything that needs to
  identify a returning customer by user account (not just email).

---

## When done

1. Update [`MASTER_PLAN.md`](../MASTER_PLAN.md) — Stage 3 status to `[x]`
2. Commit: `Stage 3 verified: logged-in booking links to user account`
   (docs-only commit)
3. Move to Stage 4
