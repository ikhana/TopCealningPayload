# Stage 10 — Add `booking-confirmed` tag in code

**Status**: `[x]` done · **Time**: ~10 min · **Code changes**: 1 file

---

## The story

Today, when a contact completes a booking, the only GHL tag they carry is
`website-lead` (set at Step 1 lead capture). There's nothing distinguishing
"this person finished a booking" from "this person started but never
finished."

That binary signal is the foundation for:
- **Confirmation email workflow** (Stage 9) — trigger on `booking-confirmed`
- **Abandoned booking workflow** (Stages 13–16) — GOAL condition exits
  the recovery sequence when `booking-confirmed` appears

This stage adds the tag in `submit-flow.ts` right after the booking is
confirmed in Payload.

---

## Builds on

- **Stage 1** — successful booking submit flow
- **Stage 2** — the GHL contact upsert pattern with tags

## Done out of order

Stage 8 (email template) is blocked on Fabien's content. This was
unblocking work — pure code, no client input.

---

## What changed

`src/lib/booking/submit-flow.ts` — after the final `payload.update` (Step 8),
fire-and-forget call to `upsertContact` with `tags: ['booking-confirmed']`.

Non-blocking: if the tag write fails, the booking is still complete. We log
and continue. Worst case: a confirmed booking doesn't trigger the
confirmation email automatically (manual recovery is possible).

```typescript
// Step 8b: Tag the contact `booking-confirmed`
upsertContact({
  firstName: formData.customer.firstName,
  lastName: formData.customer.lastName,
  email: formData.customer.email,
  phone: formData.customer.phone,
  locationId: process.env.GHL_LOCATION_ID!,
  tags: ['booking-confirmed'],
}).catch((err) => { /* log only — don't fail the booking */ })
```

---

## Tag inventory after this stage

| Tag | Set when | Used by |
|---|---|---|
| `website-lead` | Step 1 of wizard (name + email + phone entered) | Stages 13–16 abandoned recovery trigger |
| `booking-confirmed` | After full booking is saved to Payload | Stage 9 confirmation email trigger; Stages 13–16 recovery exit |

---

## Verify

- [ ] Make a fresh test booking through the wizard end-to-end
- [ ] In GHL → Contacts → open the contact you just booked with
- [ ] Tags panel shows BOTH `website-lead` AND `booking-confirmed`
- [ ] If only `website-lead` appears, check the dev server log for
      `[booking:tag] Failed to add booking-confirmed tag` line — that
      tells you GHL rejected the tag write (likely a scope or rate-limit issue)

---

## What this does NOT do

- **Doesn't actually send the email** — that requires the GHL workflow (Stage 9)
- **Doesn't remove the tag on cancellation** — Stage 5 cancellation flow
  could optionally untag, but for now we leave the tag (history is useful)
- **Doesn't tag at lead-capture step 1** — that's already done elsewhere
  (`/api/ghl/lead-capture` adds `website-lead`)

---

## Unlocks

- **Stage 9** — workflow can fire on tag add
- **Stages 13–16** — abandoned booking workflow can use this tag as the
  GOAL condition to exit the recovery sequence

---

## When done

1. Update [`MASTER_PLAN.md`](../MASTER_PLAN.md) — Stage 10 to `[x]`
2. Commit: `Stage 10: tag contact booking-confirmed on successful submit`
3. Move to Stage 8 (email template, once Fabien provides content) OR
   Stage 12 (recurring scheduler fix) — whichever has client unblock first
