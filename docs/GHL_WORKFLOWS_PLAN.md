# GHL Workflows — Complete Plan

Every workflow Top Cleaning will need, with triggers, actions, exit conditions,
and edge cases. Workflows are tiered by priority — Tier 1 ships first, Tier 4
is polish.

This doc is the source of truth for *what* each workflow does. The actual
build instructions per workflow live in their corresponding stage docs.

---

## Triggers we have (current state)

These are the events GHL workflows can listen on, based on what our code emits:

| Trigger source | Fires when | Available context |
|---|---|---|
| **Tag added: `website-lead`** | Step 1 of wizard (name+email+phone entered) | Contact |
| **Tag added: `booking-confirmed`** | Booking submit succeeds end-to-end | Contact + custom fields (snapshot) |
| **Tag added: `recurring-customer`** | Same as above, only when frequency != one-time | Contact |
| **Tag added: `frequency-weekly/biweekly/...`** | Same as above, per cadence | Contact |
| **Appointment status: Confirmed** | We create appointment with auto-confirm (per occurrence) | Contact + appointment |
| **Appointment status: Cancelled** | Customer/admin cancels (we sync) OR cancelled in GHL UI | Contact + appointment |
| **Appointment status: Showed** | Crew marks complete in GHL Mobile (Stage 18) | Contact + appointment |
| **Appointment status: No-Show** | Crew marks no-show | Contact + appointment |
| **Opportunity stage: Cancelled** | Our cancel flow moves it (sync) | Contact + opportunity |
| **Time-based: N hours before appointment** | Built-in GHL "X time before appointment" | Contact + appointment |
| **Webhook from our backend** | We POST to GHL workflow webhook URL | Whatever we send |

---

## Tier 1 — Critical (must ship before launch)

These three workflows must work or customers feel something is broken.

### W1 — Booking Confirmation Email (Stage 9)

| | |
|---|---|
| **Trigger** | Contact Tag added: `booking-confirmed` |
| **Action** | Send Email: "Booking Confirmation" (template id `6a0a0b7188f5577e47a4d501`) |
| **Re-entry** | OFF — never send twice per contact |
| **Exit condition** | None (one-shot) |
| **Edge cases** | If tag is re-added later (rare), Re-entry: Off prevents resend |
| **Why this trigger** | Contact tag fires once per submit (not per occurrence). Appointment-status trigger would over-fire for recurring (4 emails for a weekly customer). |

### W2 — 24-Hour Reminder Email

| | |
|---|---|
| **Trigger** | Time-based: 24 hours before appointment start |
| **Filter** | Appointment status = Confirmed (skip cancelled/already-shown) |
| **Action** | Send Email: "Booking Reminder" (template `02-booking-reminder.html`) |
| **Re-entry** | ON — once per appointment (each occurrence in a series gets its own reminder) |
| **Exit condition** | None — fires per appointment |
| **Edge cases** | If customer cancels in the 24h window, the reminder is already scheduled — GHL handles cancellation gracefully (appointment-based triggers auto-cancel when status changes). Time-zone safe: GHL fires in the calendar's timezone. |

### W3 — Cancellation Confirmation Email

| | |
|---|---|
| **Trigger** | Appointment status changed: Cancelled |
| **Action** | Send Email: "Cancellation / Reschedule" (template `08-cancellation-reschedule.html`) |
| **Re-entry** | ON — fires once per cancellation event |
| **Exit condition** | None |
| **Edge cases** | When a SERIES is cancelled (all occurrences), customer might get multiple emails — one per appointment. Mitigation: add a "wait 10 seconds, check if more cancellations follow" condition; OR send only on the FIRST cancellation in a series window. Defer this optimization to later. |

---

## Tier 2 — Operational (within first 2 weeks)

These ship soon after launch. Not blockers but customer-experience essentials.

### W4 — Post-Clean Thank You + Review Request

| | |
|---|---|
| **Trigger** | Appointment status changed: Showed (when crew marks complete in GHL Mobile) |
| **Wait** | 2 hours (give the customer time to settle before asking for a review) |
| **Action** | Send Email: "Thank You / Review" (template `04-thank-you-review.html`) |
| **Re-entry** | ON — once per completed appointment |
| **Exit condition** | If customer already left a review (manually tagged `reviewed`), skip the email |
| **Edge cases** | What if Showed is never set? → no email fires. Need a fallback: scheduled task that flips Showed automatically N days after appointment if no manual update. Stage 18 handles this. |

### W5 — Invoice / Receipt Email

| | |
|---|---|
| **Trigger** | Webhook from our backend after capture succeeds (Stage 18) |
| **Action** | Send Email: "Invoice / Receipt" (template `03-invoice-receipt.html`) |
| **Re-entry** | OFF — never duplicate receipts |
| **Edge cases** | If charge retries fail → don't send receipt. If refund issued → send "Refund processed" instead. |

### W6 — New Booking Internal Alert (instant)

| | |
|---|---|
| **Trigger** | Contact Tag added: `booking-confirmed` |
| **Action** | Send Email to fixed recipient (Geraldine's email) with booking summary (template `05-staff-notification.html`) |
| **Re-entry** | ON — every new booking |
| **Purpose** | Awareness — Geraldine sees new revenue / new appointment as it lands |
| **Edge cases** | Recipient could be different per crew (dispatch routing) — defer to later |

### W6b — 48-Hour Pre-Service Staff Briefing

> **Added per Geraldine 2026-05-18**: she needs notification 48 hours before each cleaning so she has time to prep crews, supplies, and call customer if needed.

| | |
|---|---|
| **Trigger** | Time-based: **48 hours before appointment start** |
| **Filter** | Appointment status = Confirmed (skip cancelled or already shown) |
| **Action** | Send Email to Geraldine with operational details (address, access method, customer name, crew assigned, special notes) |
| **Re-entry** | ON — fires per appointment (so a weekly customer generates one briefing per occurrence) |
| **Purpose** | Operational — gives Geraldine 2 days to prep dispatch, supplies, call customer |
| **Edge cases** | If cancelled within the 48h window, the briefing still fires unless the workflow checks status mid-wait. GHL handles status-change-cancellation natively for appointment-based triggers. |
| **Why separate from W6** | W6 is "new sale awareness" (could be 60 days out). W6b is "act now" (cleaning in 2 days). Different urgency = different operational meaning. |

---

## Tier 3 — Growth (within first month)

These drive revenue: bringing back abandoned leads, welcoming new customers,
encouraging reviews.

### W7 — Abandoned Booking Recovery — 1 Hour

| | |
|---|---|
| **Trigger** | Contact Tag added: `website-lead` |
| **Wait** | 1 hour |
| **Goal condition** | If contact has `booking-confirmed` → exit immediately (they completed the booking) |
| **Action** | Send Email + SMS: "You left your booking unfinished" (new template — Stage 15) |
| **Re-entry** | OFF — don't restart sequence on repeated step-1 visits |

### W8 — Abandoned Booking Recovery — 24 Hour

| | |
|---|---|
| **Trigger** | Continuation of W7 (Wait 23 more hours after W7 fires) |
| **Goal condition** | Same — exit if `booking-confirmed` |
| **Action** | Softer email + SMS: "Still interested? We'll hold a slot" |

### W9 — Abandoned Booking Recovery — 3 Day Final

| | |
|---|---|
| **Trigger** | Continuation of W7 (Wait 2 days after W8) |
| **Goal condition** | Same |
| **Action** | Final email with optional incentive ("Book in 48 hours and get 10% off") |
| **Re-entry** | OFF — series ends after this |

### W10 — Welcome New Client

| | |
|---|---|
| **Trigger** | Contact Tag added: `booking-confirmed` |
| **Filter** | Contact does NOT have tag `is-returning-customer` (custom logic — we'd add this tag when a customer's 2nd+ booking is confirmed) |
| **Action** | Send Email: "Welcome to Top Cleaning" (template `07-welcome-new-client.html`) — includes service tips, what to expect, contact info |
| **Re-entry** | OFF — only once per contact |
| **Edge cases** | Need our code to detect "first booking" — query past bookings for this contact, if count == 1 it's their first |

### W11 — Mid-Service Review Reminder

| | |
|---|---|
| **Trigger** | Time-based: 3 days after appointment Showed |
| **Filter** | Contact does NOT have tag `reviewed` |
| **Action** | Send Email: "How did we do?" follow-up |
| **Re-entry** | OFF |

---

## Tier 4 — Polish / Operations (when needed)

### W12 — Pre-auth Failed Notification (Stage 18)

| | |
|---|---|
| **Trigger** | Webhook from our backend when 12h pre-auth fails |
| **Action** | SMS + Email: "Your card couldn't be authorized. Update by 6 AM to keep your cleaning." |
| **Re-entry** | ON — could happen multiple times if customer doesn't fix |
| **Edge cases** | If customer fixes card within grace period, our backend retries. If still failed at grace cutoff, skip the cleaning (different workflow). |

### W13 — Auto-Skip Notification

| | |
|---|---|
| **Trigger** | Our backend auto-skips a cleaning due to card failure |
| **Action** | Email: "We couldn't authorize your card so we've skipped this cleaning. Your series continues." |

### W14 — Series Paused / Cancelled

| | |
|---|---|
| **Trigger** | Contact Tag added: `series-cancelled` (we'd add this in our cancel flow) |
| **Action** | Email: "Your recurring series has been cancelled. We hope to see you again." |
| **Re-entry** | OFF |

### W15 — Stale Customer Re-engagement

| | |
|---|---|
| **Trigger** | Time-based: contact has tag `booking-confirmed` but no NEW booking in 60 days |
| **Action** | Email: "We miss you" + optional re-booking incentive |
| **Re-entry** | ON, with a 90-day cooldown |

### W16 — Daily Dispatch Summary (internal)

| | |
|---|---|
| **Trigger** | Time-based: every day at 6 AM ET |
| **Action** | Send email to Geraldine + crews with that day's appointments |
| **Re-entry** | ON daily |

---

## Cross-cutting concerns (apply to ALL workflows)

### Re-entry rules

- **OFF (one-shot)**: Confirmation, Welcome, Series Cancelled, Abandoned Recovery final, Invoice
- **ON (multiple)**: Reminders, Reviews, Cancellation per-appointment, Pre-auth failures

### Time-of-day restrictions

For workflows that send SMS or could wake someone up:
- **No SMS before 8 AM or after 9 PM** in customer's timezone
- Email is OK 24/7 (people choose when to check)
- GHL has a "Quiet Hours" setting per workflow — enable on SMS-sending workflows

### Customer opt-out

- GHL handles unsubscribe automatically via the link in our email footer
- A2P SMS compliance: STOP keyword auto-handled by GHL (when A2P is registered)
- We respect both — workflows must skip contacts who unsubscribed

### Timezone

- Time-based triggers respect the **calendar's timezone** (US/Eastern). Good.
- Email rendering: customer's local time? No — we render in Eastern (Stage 12.4 fix).
- SMS: same — Eastern-formatted strings.

### Edge cases checklist (applies to every workflow)

For each workflow we build, verify:

- [ ] What happens if the customer cancels mid-workflow?
- [ ] What happens if a contact unsubscribes?
- [ ] What happens if it fires twice (re-entry collision)?
- [ ] What if a contact doesn't have the merge variable (e.g., no `service_total`)?
- [ ] What if email delivery fails?
- [ ] What if SMS isn't A2P-registered yet?
- [ ] What if the appointment is in the past at trigger time?

---

## Build order (Stage 9 sub-stages) — final status

Phase 9 wrapped 2026-05-21. 7 production workflows shipped + tested.

| Sub-stage | Workflow | Status | Notes |
|---|---|---|---|
| 9.1 | W1 Booking Confirmation | ✅ Shipped + tested | Gmail-bulletproof template (font-color wraps to defeat Gmail link-color override) |
| 9.2 | W2 24h Reminder | ✅ Shipped + tested | Appointment-triggered, fires per occurrence for recurring |
| 9.3 | W3 Cancellation Confirmation | ✅ Shipped + tested | Per-appointment; series cancellation fires N times (known v1 limitation) |
| 9.4 | W6 New Booking Internal Alert | ✅ Shipped + tested | Push (Internal Notification) + Email (Send Internal Email); Particular User → Geraldine |
| ~~9.4b~~ | ~~W6b 48h Pre-Service Briefing~~ | ❌ **Skipped** | Redundant with 9.4 given 48h minimum lead time. Geraldine already has 48h+ notice from instant 9.4 alert. |
| 9.5 | W4 Post-Clean Review Ask | ✅ Shipped + tested | Trigger: Appointment Status = Showed. Two-CTA deflection (Google review + reply-to-fix). |
| ~~9.6~~ | ~~W10 Welcome New Client~~ | ❌ **Skipped** | Confirmation email already covers expectations. Revisit if customer support load grows. |
| 9.7 | W7+W8+W9 Abandoned Booking Recovery | ✅ Shipped + tested | Single workflow with 3 emails (1h / 24h / 72h). Resume URL via custom GHL field `cart_resume_url` + Payload BookingDrafts collection. Replaced original Stages 13-17 in MASTER_PLAN. |
| 9.8 | W11 Review Follow-up Reminder | ✅ Shipped + tested | Combined with 9.5 in same workflow. Fires 5 days after Email 1 if no `reviewed` tag. |
| ~~9.9~~ | ~~W14 Series Paused / Cancelled~~ | ❌ **Skipped** | Low-frequency event. Existing 9.3 fires per-appointment for series cancels (annoying but not broken). Defer until customer complains. |
| Deferred | W5 Invoice, W12 Pre-auth Failed, W13 Auto-Skip, W15 Stale, W16 Dispatch | ⏸️ Phase 18 | All depend on payment integration |

## Phase 9 decisions (record of "why we built it this way")

- **Email reputation isolation**: subdomain `mail.topcleaningteam.com` (not root domain) so spam complaints don't contaminate the main domain.
- **Sender split**: customer emails use `bookings@mail.topcleaningteam.com`; internal alerts use `alerts@mail.topcleaningteam.com` for inbox visual separation.
- **Two-CTA deflection on review email** (not star-gate): routes unhappy customers to private feedback BEFORE they go nuclear on Google. Star-gate violates Google's review-gating policy; two side-by-side CTAs do not.
- **48h minimum scheduling notice**: enforced via GHL calendar's `allowBookingAfter: 2 days`. Fetched live by the wizard via `/api/calendar-config` (single source of truth, no env-var drift). Drop to 24h via the GHL setting only when Geraldine is comfortable.
- **Drafts as separate collection** (not Bookings status:draft): keeps Bookings schema clean, isolates retention policy, prevents GHL sync collisions.
- **Token = auth for drafts**: same pattern as Stripe Checkout Sessions. Anyone with the token can read/write that specific draft. Token is opaque UUID v4.
- **No SMS in Phase 9**: A2P 10DLC registration not done yet. All v1 channels are email + GHL Mobile push for staff. SMS variants of recovery/reminder workflows added when A2P approves.
- **Status state machine** = tags, NOT a single "state" field on the contact. Tags are additive (`website-lead`, `booking-confirmed`, `recurring-customer`, `reviewed`, etc.). Industry standard for CRMs.
- **Recurring customer review re-ask**: single ask via `reviewed` tag. Long-term customers won't be re-asked. Acceptable tradeoff for v1; add time-based re-ask logic later when review volume grows.

## Phase 9 deferred items (revisit triggers)

- **Custom calendar widget** (Step 6 date picker): replace native `<input type="date">` with a calendar that visibly grays out unavailable days. Revisit when first customer complains about confusing UX, or before mobile booking traffic > 50%.
- **`reviewed` tag time-based re-ask**: currently single-ask. Add 6-month re-ask logic when review volume > 30 reviews OR when first recurring customer hits 12 months without re-ask.
- **Series-cancelled single email**: 9.9 deferred. Build when a customer complains about getting N cancellation emails for one series cancel action.
- **W12 / W13 / W15 / W16**: all require Stage 18 (payments) or operational maturity. Don't touch until then.
- **GHL Reputation Management integration**: auto-detects new Google reviews, auto-tags contacts with `reviewed`. Replace manual Geraldine-tagging. Worth it once review volume > 20/month.
- **Backend cron to auto-mark `Showed`**: defensive fallback if crew forgets. Add if Stage 9.5 starts missing too many cleanings.

Each shipped sub-stage's click-by-click history is in commit messages and the email template files under `docs/email-templates/`.

---

## What we DON'T build via API

GHL workflows must be **created in the UI** — the workflows API is read-only.
This means each Stage 9.x doc is a step-by-step UI walkthrough, not a code change.

What WE build in code:
- Tags (already have `booking-confirmed`, `recurring-customer`, `website-lead`)
- Custom fields (done)
- Webhook endpoint for receiving GHL events (Stage 12.11)
- Webhook senders to GHL (when our backend triggers something — Stage 18)

What lives in GHL UI (Stage 9.x):
- Triggers (which event fires this workflow)
- Conditions / filters
- Action sequences (send email, wait, send SMS, etc.)
- Re-entry settings
- Goal conditions
