# Stage 4 — Account bookings list + detail page

**Status**: `[~]` in progress · **Time**: ~10 min · **Code changes**: 2 files

---

## The story

In Stage 3 we proved the booking data layer links to the user correctly.
But `/account/bookings` showed "no bookings yet" anyway.

Root cause: our custom POST handler at `src/app/(payload)/api/bookings/route.ts`
was an App Router file that owned the **entire** `/api/bookings` path,
including GET. Next.js returned 405 for GET, and Payload's auto-generated
list/read/update/delete handlers never got a chance to run.

This stage fixes the route conflict so the account page can finally see
the user's bookings.

---

## What you'll learn

- Why a Next.js App Router `route.ts` file shadows ALL methods at that path,
  not just the ones it exports
- Payload's auto-generated REST routes at `/api/{collection}` (GET, PATCH,
  DELETE, etc.) and how App Router files override them
- The cleanest pattern for custom endpoints when Payload owns a collection
  route: namespace your custom action under a sub-path
  (`/api/bookings/submit`)

---

## Builds on

- **Stage 3** — confirmed user-linked bookings exist in the DB
- All earlier stages — the booking submit POST must continue to work

---

## Steps

### 1. Move the custom POST endpoint to a sub-path

- **New file**: `src/app/(payload)/api/bookings/submit/route.ts` (POST handler)
- **Delete**: `src/app/(payload)/api/bookings/route.ts`

Now Payload's auto-routes at `/api/bookings` are unshadowed and the existing
sub-routes (`/api/bookings/[id]/cancel`) continue to work.

### 2. Update the frontend caller

In `src/blocks/TCBookingForm/Component.client.tsx`, change:
```ts
fetch('/api/bookings', { method: 'POST', ... })
```
to:
```ts
fetch('/api/bookings/submit', { method: 'POST', ... })
```

That's the only caller of the custom POST — all other `/api/bookings` calls
in the codebase are reads (GET on the list or single record) and they
just need Payload's defaults to be unblocked.

---

## Verify (done when all checked)

- [ ] Restart dev server
- [ ] **Submit a new booking** from `/booking` while logged in →
      confirmation screen appears with `TC-YYYY-XXXX`
- [ ] Go to `/account/bookings` → the booking appears in the list with
      service type / date / status badge
- [ ] Click the booking card → navigates to `/account/bookings/[id]` →
      detail page renders with full info
- [ ] In Payload admin: try to **delete** a booking → no 405 error
- [ ] Existing endpoints still work:
  - Cancel button at `/account/bookings/[id]` still hits PATCH `/api/bookings/[id]/cancel`
  - Payload admin Bookings list loads correctly

---

## What if it doesn't work

| Symptom | Likely cause |
|---|---|
| New booking submits return 404 | Frontend still calling old `/api/bookings` path — confirm `Component.client.tsx` was updated |
| Account page still empty | Dev server not restarted, or `NEXT_PUBLIC_SERVER_URL` env var missing |
| Account page errors with "unauthorized" | Auth cookie not present — verify you're still logged in |
| Payload admin still 405 on delete | The deleted `route.ts` file might still be in Next.js's cache — fully restart, not just hot-reload |

---

## Unlocks

- **Stage 5 — Cancellation flow**. Cancellation already exists at
  `/api/bookings/[id]/cancel` — this stage just ensures the bookings
  list/detail pages display correctly so the cancel button is reachable.
- **Payload admin** — admins can now properly manage bookings (edit
  statuses, fix wrong addresses, delete test bookings).

---

## When done

1. Update [`MASTER_PLAN.md`](../MASTER_PLAN.md) — Stage 4 status to `[x]`
2. Commit: `Stage 4: fix /api/bookings route conflict (move POST to /submit)`
3. Move to Stage 5
