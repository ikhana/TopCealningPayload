# Stage 6 — GHL Calendar settings tour

**Status**: `[~]` in progress · **Time**: ~30 min · **Code changes**: none
(this is a learn-and-configure stage in GHL UI)

---

## The story

We've been working with a GHL Calendar that someone set up before we
started. It works enough for booking, but Stage 1 testing surfaced two
weird behaviors:

1. The wizard only shows **4 time slots per day**, not the 8-10 we'd
   expect for a business with 8 AM – 6 PM hours
2. Appointment times come back in **Pacific time** instead of Eastern,
   which is confusing in API responses and potentially in customer-facing
   notifications

**Plus a new business detail from Geraldine** (2026-05-14):
> "We can send multiple teams to the same time slot."

This changes the capacity model. Today's calendar accepts **1 booking per
slot** because only 1 team member is configured. To unlock parallel
bookings — where 2 PM Saturday can have 3 different homes being cleaned
at once — we need to model crews properly in GHL.

Before we build automations on top of this calendar (Stage 8+ workflows,
Stage 12 recurring), we should understand what's actually configured
and pick the right capacity model.

This stage is pure learning + configuration. No code.

---

## What you'll learn

- The four layers that determine a GHL slot: business hours, slot
  duration, slot interval, team member availability
- Why an empty `openHours: {}` makes GHL fall back to team-member hours
- How GHL renders times: tied to the assigned team member's timezone, not
  the calendar's
- What `slotInterval` vs `slotDuration` mean (they're different)
- How `appointmentPerSlot` and `appointmentPerDay` interact with team
  size to determine concurrent bookings
- The two ways to model "multiple crews at once" in GHL — and which one
  fits Top Cleaning

---

## Builds on

- **Stage 1** — we observed the 4-slot symptom
- **Stage 2.8** — the regenerated PIT can now read calendar settings fully
- The full carry-forward finding in `MASTER_PLAN.md` ("Stage 6 — GHL
  Calendar settings tour")

---

## Steps

### 1. Read the current state (no changes)

Open GHL → **Calendars** → click **Top Cleaning Appointments** → review the
following tabs. Don't change anything yet — just look:

| Tab | Look for | Note what you see |
|---|---|---|
| **Calendar Info** | Calendar name, color, description | |
| **Availability** | Open Hours / Custom Availabilities | likely empty (`{}` per API) |
| **Slot details** | Slot Duration, Slot Interval, Buffer, Appointments per slot | 120/60/0/1 per API |
| **Team & Event Distribution** | Who's assigned, RoundRobin or specific user | One member: `m2qNAZYlill0w0nmEjpS` |
| **Forms & Payment** | Linked form, payment toggle | |
| **Notifications** | Email/SMS templates that fire on book/cancel | |
| **Connections** | Zoom, Google Meet, etc. | likely none for cleaning |
| **Advanced** | Allow Reschedule/Cancel, Auto-confirm, Date range | autoConfirm true, 1d→60d window |

### 2. Inspect the team member's profile

GHL → **Settings → My Staff** → click the user `m2qNAZYlill0w0nmEjpS` →
look at:

- **Working Hours** — this is what's flowing through as availability
  because the calendar's own hours are empty
- **Timezone** — currently Pacific (`-07:00`); this is why API responses
  render in PT instead of ET

### 3. Understand the two capacity models in GHL

GHL has two different mechanisms for "multiple bookings at the same time."
They solve different problems — pick the one that matches Top Cleaning's
operations.

**Mechanism A — Increase `appointmentPerSlot` on a single calendar/user**

```
Calendar settings: appointmentPerSlot: 3
Team: 1 user (or 1 placeholder user)
Result: 3 different bookings can land in 10:00 AM
```

- Simplest setup
- All 3 bookings get "assigned" to the same user in GHL — they appear
  stacked on the same crew's calendar
- Real-world dispatch happens off-platform (Geraldine assigns crews
  manually)
- Pros: minimal GHL admin, fewer moving parts
- Cons: GHL can't tell you which crew goes to which job; reporting by
  crew is impossible

**Mechanism B — Multiple Team Members + RoundRobin**

```
Calendar settings: appointmentPerSlot: 1
Team: 3 users — "Crew A", "Crew B", "Crew C"
Event type: RoundRobin_OptimizeForEqualDistribution
Result: 3 different bookings at 10:00 AM each get assigned to a
        different crew automatically
```

- More setup (each crew is a GHL user with their own profile/hours)
- GHL auto-assigns: first booking → Crew A, second → Crew B, etc.
- Each crew has their own calendar view in GHL → they see only their
  own jobs
- Pros: real visibility per crew, reporting by crew, crews can have
  different days off, you can grant each crew login access if needed
- Cons: more admin, each new crew = new user setup

**Top Cleaning recommendation: Mechanism B.**

The business already speaks in terms of "send a team" — that implies
named, distinct crews. With Mechanism B, "Team A is doing Smith house
at 10 AM" is real data, not a sticky note. As the business grows, this
scales — each new crew becomes another user, RoundRobin distributes
automatically.

For now, **don't change anything yet** — just decide the model. We'll
apply it in Stage 7.

### 4. Pick where business hours live

**Option A — Set open hours on the CALENDAR itself** (recommended)
- Calendar → Availability → Open Hours → add Mon–Sat 8 AM – 6 PM
- Business hours are independent of who's actually cleaning
- New crews just set their own days off; they don't define when the
  business is open
- Plays cleanly with Mechanism B above — calendar hours act as a global
  filter, each crew's hours filter further

**Option B — Update the team member's working hours**
- Settings → My Staff → user → Working Hours → expand to 8 AM – 6 PM
- Simpler short-term but couples business hours to one person
- Breaks when you add a second crew with different hours

**Pick A.** Set the hours on the calendar.

### 5. Fix the team member timezone

While you're in Settings → My Staff → user → change Timezone to
**Eastern Time (US/Eastern)** to match the business. Without this, GHL
notification emails to *the customer* may render in Pacific time.

### 6. Don't change yet — just look

Make a list of what you want to change. We'll go through them together
in Stage 7 (calendar edge cases) before any settings get saved.

---

## Verify (done when all checked)

- [ ] You've opened every tab on the Top Cleaning calendar and noted
      what's configured
- [ ] You've looked at the assigned team member's profile and noted
      their working hours and timezone
- [ ] You understand the 4-slot symptom (team member hours, not
      calendar hours, are what's flowing through)
- [ ] You can articulate: what's a slotInterval vs slotDuration?
- [ ] You've picked a capacity model: Mechanism A (single user, higher
      per-slot count) or Mechanism B (multiple crew users + RoundRobin)
- [ ] You have a list of changes to apply in Stage 7

---

## Unlocks

- **Stage 7** — apply the calendar changes (open hours, timezone) and
  test edge cases like no-availability dates and holidays
- **Stage 8+** — when we build the GHL confirmation email workflow, we'll
  reference the calendar's notification settings (and possibly disable
  GHL's built-in ones in favor of our custom one)

---

## When done

1. Update [`MASTER_PLAN.md`](../MASTER_PLAN.md) — Stage 6 to `[x]`
2. Move to Stage 7 (calendar edge cases — where we actually click "Save")
