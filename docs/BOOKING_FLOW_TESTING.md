# Booking Flow — End-to-End Test Guide

Tests the full guest booking journey: wizard → Payload record → GHL contact +
appointment + opportunity → confirmation screen.

Run this top to bottom in order. Each phase depends on the previous one passing.

---

## Phase 0 — Pre-flight checks

1. **Dev server running** — `pnpm run dev` from the project root, confirm
   `http://localhost:3000` loads.

2. **`.env` values present** — open `.env` and confirm these are not empty:

   ```
   GHL_PRIVATE_TOKEN=pit-...
   GHL_LOCATION_ID=yI9kN6pMxVVk486ciX3N
   GHL_CALENDAR_ID=UJqUlxKgZKXkSQIQyHD1
   GHL_PIPELINE_ID=qfDzRP0n1liA1gO2PQbP
   GHL_PIPELINE_STAGE_BOOKED=e60cee83-...
   GHL_FIELD_CONFIRMATION_CODE=ODqjmoT5Ts00Uv2yboZV
   NEXT_PUBLIC_PAYMENT_ENABLED=true
   PAYMENT_ENABLED=false
   ```

3. **Payload admin accessible** — go to `http://localhost:3000/admin`, log in,
   confirm the **Bookings** collection is visible under the Bookings group.

4. **GHL accessible** — log in to GHL, open **Contacts** — confirm you can see
   existing contacts (verifies the token is live).

---

## Phase 1 — Run the booking wizard as a guest (~5 min)

Open `http://localhost:3000/booking` in an **incognito / private window**
(to simulate a real guest — no account).

Fill in the wizard with test data:

| Step | Field | Test value |
|---|---|---|
| 1 — Customer | First Name | `Test` |
| 1 — Customer | Last Name | `Guest` |
| 1 — Customer | Email | *(your own email — you need to receive GHL emails later)* |
| 1 — Customer | Phone | `(602) 555-0100` |
| 2 — Service | Type | `Residential` |
| 3 — Property | Sq Footage | `1200` |
| 3 — Property | Bedrooms | `2` |
| 3 — Property | Bathrooms | `1` |
| 4 — Add-Ons | *(optional)* | Select any one extra |
| 5 — Frequency | | `One-time` |
| 6 — Schedule | | Pick any available date + time slot |
| 7 — Access | | `Lockbox` |
| 8 — Address | Street | `123 Test St` |
| 8 — Address | City | `Phoenix` |
| 8 — Address | State | `AZ` |
| 8 — Address | ZIP | `85004` |
| 9 — Payment | | Click **Simulate Payment & Continue** (yellow button) |
| 10 — Terms | | Check the box → click **Confirm Booking** |

**Expected result on screen:**
- Green confirmation screen appears
- Shows a confirmation code in format `TC-YYYY-XXXX` (year is dynamic — current year + a 4-digit sequence)
- Shows the booked date and time

If you see an error message, stop here and check Phase 0.

---

## Phase 2 — Verify Payload record (~2 min)

Go to `http://localhost:3000/admin` → **Bookings**.

Open the most recent booking. Confirm:

- [ ] `confirmationCode` matches what was shown on screen (e.g. `TC-2026-0001` — year is whatever current year is)
- [ ] `status` is `confirmed`
- [ ] `serviceType` is `residential`
- [ ] `serviceDate` and `serviceTime` match what you picked
- [ ] `address.city` is `Phoenix`
- [ ] `pricing.total` is a positive number
- [ ] `ghlContactId` is populated (not empty)
- [ ] `ghlAppointmentId` is populated
- [ ] `ghlOpportunityId` is populated
- [ ] `user` field is **empty** (guest booking — no account)
- [ ] `idempotencyKey` is populated

---

## Phase 3 — Verify GHL contact (~3 min)

Go to GHL → **Contacts** → search for the email you used.

Open the contact. Confirm:

- [ ] Contact exists (created or updated by the booking)
- [ ] First name / last name / phone are correct
- [ ] **Confirmation Code** custom field = same code shown on screen
- [ ] Tags include `website-lead` (set at Step 1 when user first clicked Next)

---

## Phase 4 — Verify GHL calendar appointment (~2 min)

Go to GHL → **Calendars** → find the Top Cleaning calendar.

Navigate to the date you booked. Confirm:

- [ ] Appointment exists at the correct time
- [ ] Title includes the service type and customer name (e.g. `Residential Cleaning — Test Guest`)
- [ ] Address is shown correctly
- [ ] Contact is linked (click the contact name — should open the GHL contact from Phase 3)

---

## Phase 5 — Verify GHL pipeline opportunity (~2 min)

Go to GHL → **Opportunities** (or **Pipeline**).

Find the **Booked** stage column. Confirm:

- [ ] A new opportunity exists with the name matching the appointment title
- [ ] The monetary value matches the booking total
- [ ] The contact is linked

---

## Phase 6 — Test idempotency (double-submit protection)

In the browser's developer tools console, run:

```javascript
fetch('/api/bookings/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    idempotencyKey: '<paste the idempotencyKey from the Payload record>',
    formData: {},
    paymentNonce: { dataDescriptor: 'TEST_MODE', dataValue: 'TEST_MODE' }
  })
}).then(r => r.json()).then(console.log)
```

**Expected result:** Returns the same `confirmationCode` and `bookingId` as the
original — no duplicate booking, no duplicate GHL entries.

---

## Phase 7 — Test lead capture (Step 1 abandon)

Open `http://localhost:3000/booking` in a fresh incognito window.

Fill in **Step 1 only** (name + email + phone), then click **Next**.
Do NOT proceed further — close the tab.

Go to GHL → **Contacts** → search for the email you used.

- [ ] Contact exists with `website-lead` tag
- [ ] No appointment or opportunity was created (those only happen on full submit)

---

## Phase 8 — Test cancellation (logged-in user only)

*Skip if you don't want to create an account right now — cancellation requires login.*

1. Create an account at `/create-account`, log in.
2. Run through the booking wizard again while logged in.
3. Go to `/account/bookings` — confirm the new booking appears.
4. Open the booking detail page → click **Cancel Booking**.
5. Confirm the two-step dialog appears, confirm cancellation.

Verify:
- [ ] Booking status changes to `cancelled` in Payload admin
- [ ] GHL appointment is deleted (check the calendar)
- [ ] Opportunity moves to **Cancelled** stage in GHL pipeline

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Wizard submits but returns 500 | Check terminal for error. Most common: `GHL_LOCATION_ID` or `GHL_CALENDAR_ID` missing or wrong. |
| "Payment nonce required" error | `NEXT_PUBLIC_PAYMENT_ENABLED=true` but nonce wasn't set — confirm Step 9 simulate button was clicked. |
| Booking saved in Payload but `ghlContactId` empty | GHL token expired or wrong. Re-check `GHL_PRIVATE_TOKEN` in `.env`. |
| Confirmation code on screen doesn't match Payload | Shouldn't happen — both come from the same `submitBooking` response. If it does, hard-refresh the page and re-test. |
| GHL appointment not on calendar | `GHL_CALENDAR_ID` wrong, or the calendar has availability restrictions blocking the test date. Try a weekday during business hours. |
| Simulate button not showing on Step 9 | `NEXT_PUBLIC_AUTHNET_CLIENT_KEY` is set in `.env` — remove it or leave it blank to see the simulate button. |
| Double booking created | Idempotency key was regenerated. Confirm the key is stable (generated once on reaching the last step, not on every render). |
| Lead capture not creating GHL contact at Step 1 | Check terminal for `[lead-capture]` log lines. Likely a phone normalisation issue — try a US number format `(602) 555-0100`. |

---

## What's not tested here (next phases)

- **GHL workflow emails** — Booking Confirmation email firing when appointment is created. Needs the workflow set up in GHL UI first (see `docs/GHL_WORKFLOWS.md` — to be written).
- **Real payment** — Authorize.net or Stripe card vault. Blocked until credentials are added; flip `PAYMENT_ENABLED=true` in `.env` when ready.
- **Recurring appointments** — Fire-and-forget scheduling for weekly/biweekly/monthly bookings. Visible in GHL calendar on subsequent dates.
- **Post-completion charge** — Stage 6, not yet built.
