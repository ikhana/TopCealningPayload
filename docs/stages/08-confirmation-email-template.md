# Stage 8 — Design + build the confirmation email template in GHL

**Status**: `[ ]` not started · **Time**: ~30 min · **Code changes**: minimal
(maybe push email HTML via API)

---

## The story

When a customer completes a booking, three things land in GHL: contact,
appointment, opportunity, plus the custom object record. But **nothing
sends them an email yet** because we haven't built the GHL Workflow that
fires the email.

This stage builds the email template alone (the actual workflow is Stage 9).
We split them because:
- Template design is a "what does it look like" question (Geraldine + brand)
- Workflow wiring is a "when does it fire" question (technical)
- Doing them separately lets us iterate on the template without touching
  the workflow each time

---

## What you'll learn

- GHL Email Templates vs Workflow Email Actions — the difference
- Available **merge variables** for booking emails (`{{contact.first_name}}`,
  `{{custom_values.last_order_total}}`, etc.) — and the custom-values
  side of it
- Pushing HTML templates to GHL via `POST /emails/builder` (so we can
  version-control the design alongside code)
- The 320px–600px responsive email design pattern (since 60-70% of email
  is read on mobile)

---

## Builds on

- **Stage 2.7** — booking custom object records carry all the data we'll
  show in the email (confirmation code, service type, address, total)
- **Stage 2.8** — contact ↔ booking association so the email can be
  triggered from contact-level events but read booking-level data

---

## Steps

### 1. Decide the email content (you + Fabien)

What information should the customer see immediately after booking?

Minimum:
- Customer's first name
- Confirmation code (TC-YYYY-XXXX)
- Service type
- Service date (formatted, e.g. "Wednesday, May 20")
- Service time (formatted, e.g. "11:00 AM")
- Address
- Estimated total
- Contact info if they need to change anything (phone, email)
- Cancellation policy summary
- Link to manage booking (`/account/bookings/[id]` — only works for
  logged-in users; guests get the confirmation screen)

Nice-to-have:
- Selected extras
- Frequency (one-time / weekly / etc.)
- Crew assigned name (we have this in GHL — `{{appointment.assignedUserName}}`)
- Image header (Top Cleaning logo)
- Social links
- "What to expect on the day" copy

### 2. Decide the design tone (Geraldine call)

Two extremes:

**Minimal / transactional**
- Plain HTML, brand colors only at header/footer
- Reads like an Amazon order confirmation
- Pro: looks professional, lands in inbox not spam
- Con: less brand love

**Designed / branded**
- Hero image, full Top Cleaning palette (teal, navy, sand)
- Reads like a marketing piece
- Pro: brand identity
- Con: more spam-filter risk, slower to load, harder to maintain

**My pick for v1: Minimal/transactional** — get something live, then iterate.

### 3. Build the HTML template

Two paths:

**(A) Build in GHL UI** — drag-and-drop editor
- Pros: visual, no code, Geraldine can update
- Cons: not version-controlled, can drift

**(B) Hand-write HTML, push via API**
- Pros: in git, reviewable, reproducible
- Cons: must be done by a developer, no easy WYSIWYG

**Recommendation: B** — but only after a v1 in A to capture Geraldine's
design choices. So workflow becomes:
1. Build a v1 in GHL UI (Geraldine's call on copy)
2. Pull final HTML out of GHL UI
3. Save it to `docs/email-templates/booking-confirmation.html` in repo
4. Future updates: edit the file, push via API

### 4. Push the template via API (if going path B)

```
POST /emails/builder
{
  "locationId": "...",
  "name": "Booking Confirmation",
  "type": "html",
  "html": "<the HTML>",
  "subject": "Booking Confirmed — {{custom_values.last_booking_code}}",
  "fromName": "Top Cleaning Team",
  "fromEmail": "noreply@topcleaningteam.com"
}
```

Save the returned template ID — we'll reference it in the workflow (Stage 9).

### 5. Merge variables — what's available

From the contact:
- `{{contact.first_name}}`
- `{{contact.last_name}}`
- `{{contact.email}}`
- `{{contact.phone}}`

From the appointment (only when triggered by an appointment event):
- `{{appointment.start_time}}`
- `{{appointment.title}}`
- `{{appointment.address}}`
- `{{appointment.notes}}`
- `{{appointment.assigned_user_name}}`

From contact **custom fields** (we set `Confirmation Code` already):
- `{{contact.confirmation_code}}`

From the **Booking custom object** (Stage 2.7):
- Accessed via `{{custom_values.last_booking_*}}` style — need to test
  exact syntax in GHL

Note: GHL custom object merge vars are quirky. Build the email in GHL UI
first to use the auto-complete and find exact variable names.

---

## Verify (done when all checked)

- [ ] Email template exists in GHL → **Marketing → Emails → Templates**
- [ ] Template includes all minimum fields (name, code, date/time, address, total)
- [ ] Template renders correctly in:
  - [ ] Gmail web preview
  - [ ] Gmail mobile app
  - [ ] Apple Mail
- [ ] Subject line includes confirmation code (helps discoverability in inbox)
- [ ] All merge variables resolve correctly (no `{{...}}` leaking through)
- [ ] (If path B) HTML file committed to `docs/email-templates/`

---

## What this does NOT do

- **Doesn't actually send emails yet** — that's Stage 9 (workflow wiring)
- **Doesn't replace GHL's built-in notifications** — those are still on at
  the calendar level. We disable them in Stage 9 when the custom flow is live.
- **Doesn't handle SMS** — that's Stage 9+ if Geraldine wants SMS too

---

## Unlocks

- **Stage 9 — Workflow setup** — once template exists, the workflow has
  something to fire
- **Stage 11 — Full smoke test** — book → email lands
- **Stage 13–16 — Abandoned booking emails** — same template pattern,
  different content per stage of the funnel

---

## When done

1. Update [`MASTER_PLAN.md`](../MASTER_PLAN.md) — Stage 8 to `[x]`
2. Commit the HTML file (if path B): `Stage 8: booking confirmation email template`
3. Move to Stage 9 (workflow setup)
