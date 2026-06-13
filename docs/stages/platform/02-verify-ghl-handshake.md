# Stage 2 — Verify the GHL handshake

**Status**: `[ ]` not started · **Time**: ~10 min · **Code changes**: none

---

## The story

In Stage 1 we confirmed the booking lands in Payload with the right data and
a confirmation code. But the booking record only stores **IDs** (`ghlContactId`,
`ghlAppointmentId`, `ghlOpportunityId`). We don't actually know if those IDs
point to anything real in GHL.

This stage opens GHL itself and confirms: yes, the contact got created (or
updated), yes, the appointment is on the calendar at the right time, yes, the
opportunity landed in the right pipeline stage. After this we can trust the
end-to-end data flow.

---

## What you'll learn

- Where to find a contact in GHL by email
- How GHL contact custom fields appear (specifically the confirmation code)
- How to navigate to the calendar and find an appointment
- How to find an opportunity in a pipeline and what its stage means
- The difference between a "contact" (the person), an "appointment" (the
  scheduled job), and an "opportunity" (the sales record). Three separate
  GHL entities that we link together.

---

## Builds on

- **Stage 1** — we need the booking record (TC-2026-0003 or whichever) with
  populated `ghlContactId`, `ghlAppointmentId`, `ghlOpportunityId` to look up.

---

## Steps

### 1. Pull the three GHL IDs from Payload

Open Payload admin → Bookings → click the booking from Stage 1. Note these
three values from the sidebar — you'll paste them into GHL:

- `ghlContactId` = `___________`
- `ghlAppointmentId` = `___________`
- `ghlOpportunityId` = `___________`

Also note: the email address used (we'll search by this), the booked
date/time, and the service total ($ amount).

### 2. Verify the GHL contact

In GHL → **Contacts** → search bar → paste the email address.

- [ ] Contact appears in results
- [ ] First name / last name / phone match what you entered in the wizard
- [ ] Tags include `website-lead` (set at Step 1 lead capture)
- [ ] The contact's **ID** in the URL matches the `ghlContactId` from Payload
- [ ] **Custom fields panel** — look for a field called "Confirmation Code"
  with the value matching the booking's `confirmationCode` (e.g. `TC-2026-0003`)

> **If the confirmation code field is empty or missing** — that's the race
> condition we fixed earlier (generate code before `createAppointment`).
> If it's missing here, the fix didn't take. Stop and tell me.

### 3. Verify the GHL appointment

In GHL → **Calendars** → switch to the **Top Cleaning Appointments** calendar
view → navigate to the date you booked (2026-05-20 or whatever you picked).

- [ ] Appointment exists at the right time (1:00 PM Eastern, which is what
  you stored as `2026-05-20T13:00:00-04:00`)
- [ ] Appointment title includes the service type and customer name
  (e.g. `Residential Cleaning — Test Guest`)
- [ ] Click the appointment to expand. The detail panel should show:
  - The address you entered
  - The contact (clickable — should open the contact from Step 2 above)
  - The appointment ID in the URL or details matches `ghlAppointmentId` from Payload

### 4. Verify the GHL opportunity

In GHL → **Opportunities** (or **Pipeline**) → find the Top Cleaning pipeline
→ look at the **Booked** stage column.

- [ ] An opportunity card exists, named like the appointment title
- [ ] Monetary value matches `pricing.total` from Payload
- [ ] Contact name links to the contact from Step 2
- [ ] Click into it → URL or detail should match `ghlOpportunityId` from Payload
- [ ] Status is `Open` (not `Won` / `Lost` / `Abandoned`) — this is the
  default we set after the 422 fix in Stage 1

---

## Verify (done when all checked)

- [ ] All three GHL entities exist (contact, appointment, opportunity)
- [ ] All three reference IDs in Payload match what's in GHL
- [ ] Confirmation code is on the contact's custom field
- [ ] Appointment is at the correct date/time
- [ ] Opportunity is in the **Booked** stage with the correct value

---

## What if something is off

| Symptom | Likely cause |
|---|---|
| Contact not found | Phone normalization issue at lead-capture step; or the booking actually used a different email than you remember. Re-check the email in the Payload record. |
| Confirmation code missing on contact | The race fix didn't apply, or `GHL_FIELD_CONFIRMATION_CODE` env var is wrong. Check it's `ODqjmoT5Ts00Uv2yboZV` in `.env`. |
| Appointment at wrong time | Timezone bug. Compare the stored ISO (`-04:00`) vs what GHL shows. If GHL shows it 4 hours off, the calendar timezone in GHL settings doesn't match what we send. |
| Opportunity not in Cleaning Booked stage | `GHL_PIPELINE_STAGE_CLEANING_BOOKED` env var is wrong, or the pipeline structure in GHL changed. Compare env value against GHL → Settings → Pipelines (or run a quick `curl` against `/opportunities/pipelines?locationId=...` to inspect live stage IDs). |

---

## Unlocks

- **Stage 3** — Now that we know guest bookings work, we can test the
  logged-in path: create an account, book again, verify the `user` field
  gets populated in Payload (it was empty for the guest booking).
- **Stage 6** (Calendar tour) — We'll come back to GHL Calendar settings
  to fix the "only 4 slots" issue noted in the master plan.

---

## When done

1. Update [`MASTER_PLAN.md`](../MASTER_PLAN.md) — Stage 2 status to `[x]`
2. Commit with: `Stages 1-2: verify booking flow end-to-end (Payload + GHL)`
   along with the code fixes from Stage 1 testing (timezone, opportunity
   status default, simulate payment button, etc.) — this is the natural
   commit point.
3. Move to Stage 3.
