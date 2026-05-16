# Stage 12.3 — Fix recurring scheduler 400 errors

**Status**: `[~]` in progress · **Time**: ~15 min · **Code changes**: 1 file

---

## The bug

During Stage 1 testing we saw this in the logs after a recurring booking:

```
[booking:recurring] Appointment 3 failed
status: 400
body: '{"message":"The slot you have selected is no longer available."}'
```

GHL's error message was **misleading**. The actual cause:

The GHL calendar has `allowBookingFor: 60` days configured. Anything past
60 days from today is rejected by GHL's create-appointment endpoint with
"slot no longer available" — but the real reason is "past the booking window."

### Why only 3weekly hit it

| Frequency | 3rd recurring occurrence | Within 60d window? |
|---|---|---|
| weekly | +21 days | ✅ |
| biweekly | +42 days | ✅ |
| **3weekly** | **+63 days** | ❌ **Fails** |
| monthly | +56 days | ✅ |
| 8weekly | +56 days | ✅ |

3weekly is the only frequency whose 3rd recurring appointment falls past
the 60-day window.

---

## The fix

Add a runtime check that skips any occurrence past the 60-day window
**before** trying to POST it to GHL. Logged for diagnostics, not surfaced
to the user.

```typescript
const GHL_BOOKING_WINDOW_DAYS = 60

for each scheduled occurrence:
  if daysFromNow > GHL_BOOKING_WINDOW_DAYS → skip + log
  else → attempt to create
```

Defensive — keeps existing failures handled by Promise.allSettled (already
in place from earlier improvement), but PREVENTS the predictable failures
from happening in the first place.

### What the code looks like now

```typescript
const tasks: Array<Promise<unknown>> = []
const skipped: Array<{ occurrence; daysOut; reason }> = []

for (let i = 0; i < count; i++) {
  const occurrence = i + 2
  const daysOut = intervalDays * (i + 1)
  const futureStartMs = firstStartMs + daysOut * 86400000
  const daysFromNow = (futureStartMs - nowMs) / 86400000

  if (daysFromNow > GHL_BOOKING_WINDOW_DAYS) {
    skipped.push({ occurrence, daysOut, reason: '...exceeds window' })
    continue
  }
  
  tasks.push(createAppointment(...))
}

if (skipped.length > 0) console.log('[booking:recurring] Skipped:', skipped)
const results = await Promise.allSettled(tasks)
// ... log failures as before
```

---

## Behavior change per frequency

| Frequency | Before | After |
|---|---|---|
| weekly | 3 attempts, 3 succeed | 3 attempts, 3 succeed (no change) |
| biweekly | 3 attempts, 3 succeed | 3 attempts, 3 succeed (no change) |
| 3weekly | 3 attempts, 2 succeed + 1 errors | **2 attempts, 2 succeed** (3rd silently skipped) |
| monthly | 2 attempts, 2 succeed | 2 attempts, 2 succeed (no change) |
| 8weekly | 1 attempt, 1 succeeds | 1 attempt, 1 succeeds (no change) |

---

## Verify

1. Restart dev server
2. Submit a **3weekly** booking
3. Check terminal — should see:
   ```
   [booking:recurring] Skipped occurrences past booking window
     [{ occurrence: 4, daysOut: 63, reason: '63d out exceeds 60d window' }]
   ```
4. No more `[booking:recurring] Appointment 3 failed` red error
5. GHL calendar should show original + 2 future appointments (at +21 and +42)

---

## What this does NOT do

- **Doesn't create Payload Booking records for future occurrences** — Stage 12.3b (or roll into next stage)
- **Doesn't pre-check slot availability** — only checks the 60-day window. Future occurrences could still fail if the slot is booked, but that's rare and Promise.allSettled handles it gracefully
- **Doesn't reschedule failed occurrences** — if a failure happens, it's logged and we move on

---

## Unlocks

- Stage 12.3b — Create Payload Booking records for each successful future occurrence (linked to series)
- Stage 12.4 — Success screen can show the full schedule (now we know how many were scheduled)

---

## When done

1. Test a 3weekly booking, verify no errors in log
2. Update [`MASTER_PLAN.md`](../MASTER_PLAN.md) — Stage 12.3 to `[x]`
3. Commit: `Stage 12.3: skip recurring occurrences past 60-day GHL window`
4. Move to Stage 12.3b (Payload records for future occurrences) or Stage 12.4
