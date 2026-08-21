// src/data/pricing.ts
// Room-based price table — source of truth for booking estimates.
//
// Source: Geraldine's pricing sheet, 2026-08-06.
// https://docs.google.com/spreadsheets/d/17qW89TRYU4kQZV3qwfyiJ8vqIf8BCXXZsZ0-kWPY9l8
//
// WHY THIS FILE EXISTS
// Prices change. They used to be buried in booking-helpers.ts mixed in with the
// calculation logic, derived from Florida minimum wage times a percentage per
// service. That model could not reproduce the numbers Geraldine actually quotes,
// and updating it meant editing formulas. This file is plain data: to change a
// price, change one number here.
//
// THE MODEL
// Every package total in her sheet is exactly the sum of its rooms, with one
// kitchen and one living room assumed included. Verified against the sheet:
//
//   1 Bed / 1 Bath regular:  25 +  35 + 40 + 20 = $120  ✓
//   2 Bed / 1 Bath regular:  50 +  35 + 40 + 20 = $145  ✓
//   3 Bed / 2 Bath regular:  75 +  70 + 40 + 20 = $205  ✓
//   3 Bed / 2 Bath deep:    120 + 120 + 80 + 45 = $365  ✓
//   5 Bed / 4 Bath deep:    200 + 240 + 80 + 45 = $565  ✓
//
// So the per-room unit prices below are the atomic truth and the package table
// is derived, not stored. That means the two can never drift apart.

export type CleaningTier = 'regular' | 'deep'

export type RoomPrice = {
  regular: number
  deep: number
}

/**
 * Per-room unit prices. Both tiers, in USD.
 *
 * `stairs` is quoted as a range ($10–$15 regular) in the sheet. We use the top of
 * the range so a quoted estimate is never lower than what gets charged — an
 * estimate that creeps upward on the confirmation call is the one thing that
 * costs a booking.
 */
export const ROOM_PRICES = {
  bedroom:      { regular: 25, deep: 40 },
  fullBathroom: { regular: 35, deep: 60 },
  halfBathroom: { regular: 20, deep: 35 },
  kitchen:      { regular: 40, deep: 80 },
  livingRoom:   { regular: 20, deep: 45 },
  diningRoom:   { regular: 15, deep: 35 },
  office:       { regular: 20, deep: 35 },
  laundryRoom:  { regular: 15, deep: 30 },
  familyRoom:   { regular: 20, deep: 45 },
  stairsHallway:{ regular: 15, deep: 25 },
  patioBalcony: { regular: 25, deep: 45 },
} as const satisfies Record<string, RoomPrice>

export type RoomKey = keyof typeof ROOM_PRICES

/**
 * Rooms the *package table* assumes, regardless of bedroom/bathroom count. A
 * 1 Bed / 1 Bath in her sheet is a bedroom, a bathroom, a kitchen and a living
 * room — which is why $120 and not $60.
 *
 * NOT used by the live quote. Geraldine, 2026-08-06: "the client can select the
 * areas and we can calculate based on the areas that they select." So the customer
 * picks every area explicitly and we never silently add one they did not choose.
 * These constants exist only to reproduce and cross-check the package table.
 */
export const IMPLIED_ROOMS: RoomKey[] = ['kitchen', 'livingRoom']

export type RoomCounts = Partial<Record<RoomKey, number>>

/**
 * Minimum booking value per tier. Geraldine, 2026-08-06:
 *
 *   "If our minimum booking is $120 and the customer selects only one bathroom
 *    ($35), the system should NOT allow a $35 booking. The final price would
 *    remain $120."
 *
 * Note $120 is exactly her 1 Bed / 1 Bath regular package, so the floor is
 * "one small home's worth of work" rather than an arbitrary number.
 *
 * ⚠️ `deep` is INFERRED, not given. She said "each service may have its own
 * minimum booking amount" without stating the deep figure. $225 is the 1 Bed /
 * 1 Bath deep package — the same logic that produced $120 for regular. Confirm
 * before this goes live; it is a one-number change.
 */
export const MINIMUM_BOOKING: Record<CleaningTier, number> = {
  regular: 120,
  deep: 225, // TODO: confirm with Geraldine
}

/**
 * Sum a set of room counts at the given tier. This is the live quote path.
 *
 * `includeImplied` defaults to FALSE: the customer selects every area, so adding
 * an unselected kitchen would quote them for work they did not ask for. Pass true
 * only to reproduce the package table.
 */
export function priceRooms(
  counts: RoomCounts,
  tier: CleaningTier,
  includeImplied = false,
): number {
  let total = 0

  for (const [key, count] of Object.entries(counts) as [RoomKey, number][]) {
    if (!count || count < 0) continue
    total += ROOM_PRICES[key][tier] * count
  }

  if (includeImplied) {
    for (const key of IMPLIED_ROOMS) {
      // Only add an implied room if the caller has not already counted it.
      if (!counts[key]) total += ROOM_PRICES[key][tier]
    }
  }

  return total
}

/**
 * Package price for the common case: N bedrooms + N full bathrooms, with the
 * implied kitchen and living room. Reproduces Geraldine's "Home Size" table
 * exactly for every row from 1 Bed / 1 Bath through 5 Bed / 4 Bath.
 */
export function priceHome(
  bedrooms: number,
  fullBathrooms: number,
  tier: CleaningTier,
): number {
  return priceRooms({ bedroom: bedrooms, fullBathroom: fullBathrooms }, tier, true)
}

/**
 * Recurring discounts (Geraldine, 2026-08-20). The first-time-customer discount
 * was removed from the site entirely on the same instruction.
 *
 * Her wizard labels "Twice a Month" and her message says "Every 2 Weeks"; both
 * map to `biweekly`.
 */
export const FREQUENCY_DISCOUNTS: Record<string, number> = {
  'one-time': 0,
  weekly: 0.2,
  biweekly: 0.15,
  monthly: 0.1,
  // Not offered in the wizard any more, kept so old saved bookings do not break.
  '3weekly': 0.1,
  '8weekly': 0.1,
}

export type Quote = {
  /** Raw sum of selected areas, before the minimum is applied. */
  subtotal: number
  /** The floor for this tier. */
  minimum: number
  /** What the customer actually pays: MAX(minimum, subtotal). */
  total: number
  /** True when the minimum is doing the work — drives the upsell message. */
  minimumApplied: boolean
  /** Headroom left before they stop paying for nothing. 0 once subtotal ≥ minimum. */
  remainingToMinimum: number
  /** Recurring discount rate actually applied. 0 when suppressed by the minimum. */
  discountRate: number
  /** Dollars saved. 0 when no discount applied. */
  discountAmount: number
}

/**
 * The live quote.
 *
 *   Final Price = MAX(Minimum Booking Price, Total Price of Selected Areas)
 *
 * When the minimum bites, `remainingToMinimum` is what powers her requested
 * message: the customer is paying $120 regardless, so they may as well add areas
 * until they reach it. That framing turns a floor into an upsell instead of a
 * surcharge the customer resents.
 */
export function quoteAreas(
  counts: RoomCounts,
  tier: CleaningTier,
  frequency: string = 'one-time',
  extrasTotal = 0,
): Quote {
  const minimum = MINIMUM_BOOKING[tier]

  // The minimum is a floor on the ROOMS, not on rooms-plus-extras. Geraldine,
  // 2026-08-20: extras "should be added on TOP of the room/area prices. They
  // should not count as replacements for the selected rooms."
  //
  // If extras counted toward the floor they would substitute for rooms: one
  // bathroom ($35) plus fridge and oven ($65) would reach $100, floor to $120,
  // and the customer would have bought their way under the minimum with add-ons.
  // Flooring the rooms first prevents that — same example becomes $120 + $65.
  const roomsSubtotal = priceRooms(counts, tier)
  const subtotal = Math.max(minimum, roomsSubtotal) + extrasTotal

  // Discount rule (Geraldine, 2026-08-20): "The discount should only be applied
  // when the discounted price remains above the minimum booking amount. I don't
  // want the website to display a discount if the minimum price would override
  // it, as that could be confusing for the customer."
  //
  // So we test the discounted figure against the floor FIRST, and only keep the
  // discount if it survives. Otherwise the customer sees a clean minimum price
  // with no phantom saving next to it.
  const candidateRate = FREQUENCY_DISCOUNTS[frequency] ?? 0

  // The discount applies to the ROOMS, then the minimum floors the result:
  //   Final Price = MAX(Minimum Booking Price, Price After Discount)
  // Extras are added afterwards and are not discounted — the recurring discount
  // is on the recurring cleaning, not on one-off add-on tasks.
  const roomsDiscounted = roomsSubtotal * (1 - candidateRate)
  const roomsFinal = Math.max(minimum, roomsDiscounted)

  // Show the discount only when it actually changed what they pay. If the floor
  // swallowed it, displaying "20% off" next to the minimum price is confusing.
  const discountSurvives = candidateRate > 0 && roomsDiscounted > minimum

  const discountRate = discountSurvives ? candidateRate : 0
  const total = Math.round(roomsFinal) + extrasTotal

  // The upsell message is about ROOMS only, for the same reason: telling someone
  // they can "add $20 more" when an add-on would satisfy it would be telling them
  // add-ons count toward the floor, which they do not.
  const minimumApplied = roomsSubtotal < minimum

  return {
    subtotal,
    minimum,
    total,
    minimumApplied,
    remainingToMinimum: minimumApplied ? minimum - roomsSubtotal : 0,
    discountRate,
    discountAmount: discountSurvives ? Math.round(roomsSubtotal - roomsFinal) : 0,
  }
}

/**
 * Services priced by selected area. Only what Geraldine's sheet covers — the rest
 * stay quote-only rather than us inventing numbers for jobs she prices by hand.
 *
 * Lives here, not in the Step 3 component, because step-validation needs the same
 * list. If the two drifted, the picker would render while validation still
 * demanded a bathroom count the picker no longer collects.
 */
// 'custom' was here until 2026-08-20. It is now the Hourly / Custom option, which
// sells time rather than areas — see HOURLY_* below.
export const AREA_PRICED_SERVICES = ['residential'] as const

export function isAreaPriced(serviceType: string): boolean {
  return (AREA_PRICED_SERVICES as readonly string[]).includes(serviceType)
}

/** Has the customer selected anything at all? Used to gate the estimate display. */
export function hasSelection(counts: RoomCounts): boolean {
  return Object.values(counts).some((n) => (n ?? 0) > 0)
}

// ─── HOURLY / CUSTOM CLEANING ────────────────────────────────────────────────
//
// Third booking option (Geraldine, 2026-08-20). Exists so a customer who only
// wants their oven and fridge done is not forced to select rooms they do not
// need just to clear the Regular minimum.
//
// They are buying TIME, not a checklist. Completion of every requested task is
// explicitly not guaranteed — the crew works to the customer's stated priorities
// for the hours booked. That disclaimer has to appear on the form; it is the
// thing that keeps an hourly booking from turning into a dispute.

export const HOURLY_RATE = 45

/** Labor-hour options. Her stated set; 3 is the minimum. */
export const HOURLY_OPTIONS = [3, 4, 6] as const

export const HOURLY_MINIMUM_HOURS = 3

export function priceHourly(laborHours: number): number {
  return Math.max(HOURLY_MINIMUM_HOURS, laborHours) * HOURLY_RATE
}

// ─── TEAM SIZE ───────────────────────────────────────────────────────────────
//
// Geraldine, 2026-08-20: the customer SEES the estimated team size but does not
// choose it. "Smaller jobs → 1 cleaner, larger jobs → 2." It affects scheduling
// and the time shown at the property, never the price.
//
// ⚠️ The threshold below is mine, not hers — she gave the principle, not a
// number. 4 labor hours is the point where a single cleaner stops fitting a
// job comfortably into a morning. Confirm before launch.
export const TWO_CLEANER_THRESHOLD_HOURS = 4

export function estimateTeamSize(laborHours: number): number {
  return laborHours > TWO_CLEANER_THRESHOLD_HOURS ? 2 : 1
}

/**
 * Wall-clock time the crew is at the property, as a range for display.
 *
 * Labor hours divided by team size. Shown as a range rather than a single figure
 * because she asked us to say the estimate may change, and a range communicates
 * that honestly instead of implying a precision we do not have.
 */
export function timeAtProperty(laborHours: number, teamSize: number): { low: number; high: number } {
  const centre = laborHours / Math.max(1, teamSize)
  return {
    low: Math.max(1, Math.floor(centre * 2) / 2),
    high: Math.ceil(centre * 2) / 2 + 0.5,
  }
}

// ─── DURATION ────────────────────────────────────────────────────────────────
//
// Square footage used to drive this (`Math.max(2, sqft / 500)`). With sqft gone,
// duration comes from the same areas that drive the price — which is strictly
// better: four bathrooms is far more work than 2,000 sq ft of open-plan living
// room, and the old model could not tell those apart.
//
// These are WALL-CLOCK minutes for a standard crew, not labour-hours, because the
// value becomes the GHL appointment slot length. If a two-person team is sent,
// wall-clock is what blocks the calendar.
//
// Deliberately NOT derived from price. Price and time do not scale together: deep
// cleaning is 1.875x the price of regular but nowhere near 1.875x the time — the
// premium reflects intensity and materials, not just hours. Deriving one from the
// other would over-block the calendar on every deep clean.

/** Wall-clock minutes per area, regular tier. */
export const AREA_MINUTES: Record<RoomKey, number> = {
  bedroom: 25,
  fullBathroom: 35,
  halfBathroom: 15,
  kitchen: 40,
  livingRoom: 25,
  diningRoom: 15,
  office: 20,
  laundryRoom: 15,
  familyRoom: 25,
  stairsHallway: 15,
  patioBalcony: 20,
}

/** Deep cleaning takes longer, but not proportionally to its price premium. */
export const DEEP_TIME_MULTIPLIER = 1.75

/**
 * Minimum billable visit, in hours. Matches the 3-hour minimum on Geraldine's
 * PDF (slide 16) and lines up with the $120 floor at a ~$40/hr effective rate.
 *
 * NOTE: the old calculateEstimatedTime() floored at 2 hours, which contradicted
 * that stated 3-hour minimum. This corrects it.
 */
export const MINIMUM_HOURS = 3

/**
 * Estimated wall-clock hours for a set of areas, rounded to the nearest half hour.
 *
 * Always returns at least MINIMUM_HOURS — never 0. A zero-duration appointment
 * makes GHL reject the booking with "Invalid slot range", which is a bug we have
 * already shipped once.
 */
export function estimateHours(
  counts: RoomCounts,
  tier: CleaningTier,
  squareFootage?: number,
): number {
  let minutes = 0

  for (const [key, count] of Object.entries(counts) as [RoomKey, number][]) {
    if (!count || count < 0) continue
    minutes += AREA_MINUTES[key] * count
  }

  if (tier === 'deep') minutes *= DEEP_TIME_MULTIPLIER

  const fromAreas = minutes / 60

  // Square footage refines the estimate rather than adding to it. Geraldine,
  // 2026-08-20: "we can still use the square footage, but mainly for the time
  // estimation rather than the price calculation."
  //
  // Taking the MAX rather than summing, because the two overlap — a bedroom's
  // minutes already include its floor. Adding them would double-count every room
  // and inflate a large house to absurdity. MAX means whichever signal implies
  // more work wins, and a blank square footage simply never wins.
  //
  // sqft / 500 is the rate the old model used, kept so estimates stay comparable
  // to what the calendar held before.
  const fromSqft =
    typeof squareFootage === 'number' && Number.isFinite(squareFootage) && squareFootage > 0
      ? (squareFootage / 500) * (tier === 'deep' ? DEEP_TIME_MULTIPLIER : 1)
      : 0

  const rounded = Math.ceil(Math.max(fromAreas, fromSqft) * 2) / 2

  return Math.max(MINIMUM_HOURS, rounded)
}

/**
 * Hours to actually block on the GHL calendar.
 *
 * Currently the minimum, NOT the full estimate (decision 2026-08-20). The full
 * estimate reaches 10 hours for a 5 bed / 4 bath deep clean, which would blank
 * out a whole working day from a form submission that Geraldine has not yet
 * confirmed. Blocking the minimum keeps the calendar usable while the real
 * duration gets settled on the confirmation call, the same way the price is.
 *
 * TRADE-OFF, accepted deliberately: a 3-hour block on a job that genuinely takes
 * eight means the calendar shows availability that does not exist. The mitigation
 * is that `estimateHours()` is still sent through to GHL as booking data, so
 * whoever schedules can see "estimated 8h" on a 3h slot and extend it.
 *
 * To switch to real durations later, return `estimateHours(counts, tier)` here.
 * Everything downstream already handles a variable value.
 */
export function appointmentHours(_counts: RoomCounts, _tier: CleaningTier): number {
  return MINIMUM_HOURS
}

// ─── STILL OPEN ──────────────────────────────────────────────────────────────
//
// 1. DEEP MINIMUM. Inferred as $225 above. Needs one word from Geraldine.
//
// 2. REGULAR vs DEEP. The sheet has two columns but the wizard's service list has
//    no "Deep Cleaning" option (residential, movein-out, airbnb, custom,
//    commercial, renovation, hoarding, handyman). How does the customer pick a
//    tier — a toggle on the areas step, or a new service option?
//
// 3. OTHER SERVICES. The sheet only prices Regular and Deep. Move-in/out, AirBnB,
//    commercial, post-construction, hoarding and handyman have no numbers. Same
//    area model at a different rate, or stay quote-only?
//
// 4. APPOINTMENT DURATION. calculateEstimatedTime() derives hours from square
//    footage, which is now dead. Duration must come from the selected areas
//    instead. Not cosmetic: a zero-duration appointment makes GHL reject the
//    booking with "Invalid slot range" — we hit that exact bug before.
