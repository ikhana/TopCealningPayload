# Stage 2.5 — Wizard validation + UX polish

**Status**: `[ ]` not started · **Time**: ~45 min · **Code changes**: 3-4 files

---

## The story

During Stage 1 testing, two real UX problems surfaced:

1. **Validation only fires at final submit** — a user could click through all
   10 steps with empty required fields and only find out on Step 10 that
   they're missing something from Step 3. Bad enough that the user explicitly
   called it out: *"when clicking the confirm step button then it tells what
   I am missing on the previous stages to be filled lol"*

2. **The Conditions & Access step jiggles like an earthquake** when you click
   Yes/No on pets. The user said: *"the screen kind of joggles like earth quake"*

Both are in the same wizard files, both ship together.

---

## What you'll learn

- How to add per-step validation without rewriting every step component
- The CSS pattern for stable transitions: never use `transition: all`,
  always be explicit (`transition: border-color 0.2s, background 0.2s`)
- How to handle conditional show/hide without content-pop using `max-height`
  + `overflow: hidden` (or reserve space with min-height)

---

## Builds on

- **Stage 1** — where we discovered both issues
- **Stage 2.7** — same submit-flow file we just touched

---

## Part A — Per-step validation

### Steps

#### A1. Create the validator module

New file `src/lib/booking/step-validation.ts`:

- Export `validateStep(stepNum, bookingData) → { valid, missingField? }`
- Keyed by real step number (1–10), not wizard index (so it works the same
  whether or not Step 9 Payment is filtered)
- Required field rules (mirrors what `validateBookingData` in submit-flow does):

| Step | Required |
|---|---|
| 1 | `customer.firstName`, `customer.email`, `customer.phone` |
| 2 | `serviceType` |
| 3 | `property.squareFootage > 0`, `property.bedrooms`, `property.bathrooms` |
| 4 | (no required — extras optional) |
| 5 | `frequency` |
| 6 | `serviceDate`, `serviceTime` |
| 7 | `accessMethod` |
| 8 | `address.street`, `address.city`, `address.state`, `address.zipCode` |
| 9 | `paymentNonce` (only if `PAYMENT_ENABLED`) |
| 10 | `termsAccepted` |

#### A2. Hook into `goNext()`

In `src/blocks/TCBookingForm/Component.client.tsx`:

- Get current real step number via `STEP_NUM_AT(currentStep)`
- Before advancing, call `validateStep(realStepNum, bookingData)`
- If invalid → show an inline error message + don't advance + scroll to top
  of the form so the user sees the error

#### A3. Display the error

Add a small error banner above the step content when `stepError` is set —
something like:

```
⚠ Please fill in: <missing field name>
```

Auto-clears when the user starts editing.

---

## Part B — Step 7 earthquake fix

### Steps

#### B1. Stable transitions on access method cards

In `src/components/booking/sections/Step07Access.tsx` line 182:

```ts
transition: 'all 0.3s cubic-bezier(0.25,1,0.5,1)'
```

becomes:

```ts
transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s'
```

Drop the `translateY(-2px)` hover entirely — or move it to a `:hover` rule
that doesn't conflict with the active state.

#### B2. Smooth show/hide of pet type chips

In `Step07Access.tsx` ~line 62 (the marginBottom-flip + conditional render):

Replace the `{hasPets && <div>...</div>}` block with a permanent container
that uses `max-height` for animation:

```tsx
<div
  style={{
    maxHeight: hasPets ? '200px' : '0',
    overflow: 'hidden',
    opacity: hasPets ? 1 : 0,
    transition: 'max-height 0.3s ease-out, opacity 0.2s',
    marginTop: hasPets ? '18px' : '0',
  }}
>
  {/* pet type chips */}
</div>
```

The content is always rendered (so React doesn't tear-down), but visually
collapses to 0 height. No content pop.

---

## Verify (done when all checked)

### Part A
- [ ] Open wizard, click Next on Step 1 with no name → inline error shows, doesn't advance
- [ ] Fill name only, click Next → error updates to point at missing email
- [ ] Same flow on Step 3 (sqft empty) → blocks correctly
- [ ] Same flow on Step 6 (no date/time) → blocks correctly
- [ ] Same flow on Step 8 (missing address fields) → blocks correctly
- [ ] When all fields are valid → advances normally

### Part B
- [ ] Open Step 7, click Yes on pets — pet type section appears smoothly, no big jump
- [ ] Click No on pets — section collapses smoothly
- [ ] Click an access method card — no wobble on click

---

## Unlocks

- **Stage 3** — logged-in booking flow can be tested with confidence that
  any data entry mistakes get caught at the right step
- **Better lead capture quality** — Step 1 won't push a user forward with
  garbage data, which means the GHL contact has clean fields

---

## When done

1. Update [`MASTER_PLAN.md`](../MASTER_PLAN.md) — Stage 2.5 status to `[x]`
2. Commit with: `Stage 2.5: per-step wizard validation + Step 7 UX fixes`
3. Move to Stage 3
