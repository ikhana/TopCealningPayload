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
// Every package total is exactly the sum of its areas, so the per-area unit prices
// below are the atomic truth and any package figure is derived, not stored.
//
// REPRICED 2026-10-18 (Geraldine, round 3). The 2026-08-06 sheet priced a kitchen,
// a living room and a dining room separately; they are now one combined area.
// Current totals, with one Kitchen/Living/Dining area included:
//
//   1 Bed / 1 Bath regular:  20 +  30 + 70 = $120   (the default selection)
//   2 Bed / 2 Bath regular:  40 +  60 + 70 = $170   (her slide example)
//   3 Bed / 2 Bath regular:  60 +  60 + 70 = $190   (was $205)
//   1 Bed / 1 Bath deep:     40 +  60 + 100 = $200  (her stated deep minimum)
//   3 Bed / 2 Bath deep:    120 + 120 + 100 = $340  (was $365)
//
// The old sheet figures ($120 / $145 / $205 regular, $365 / $565 deep) no longer
// hold and should not be used to cross-check this table.

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
  // Repriced 2026-10-18 (Geraldine, round 3): Bedroom $20 (was $25), Full Bathroom
  // $30 (was $35) for Regular; Deep Bedroom $40 and Full Bathroom $60 are unchanged.
  bedroom:      { regular: 20, deep: 40 },
  fullBathroom: { regular: 30, deep: 60 },
  halfBathroom: { regular: 20, deep: 35 },
  // One combined selection replacing kitchen + living room + dining room.
  // Regular $70, Deep $100 (Geraldine, 2026-10-18). Flat, whether or not the home
  // has a dining room: for Regular that is $10 MORE than the old kitchen + living
  // pair, for Deep it is $60 LESS than the old kitchen + living + dining ($160).
  kitchenLivingDining: { regular: 70, deep: 100 },

  // LEGACY keys, no longer offered in the picker (see ROOM_LABELS). They stay in
  // this table so a booking or a saved draft that already holds them still prices
  // and renders. Drafts are migrated on load by migrateLegacyAreas(); this is the
  // safety net underneath that.
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
 * Display names and the order areas are shown in.
 *
 * Lives here rather than in the step component because the summary panel has to
 * name the same areas the picker does. When the two kept their own lists, the
 * summary simply had no way to say "Full Bathroom" for the key `fullBathroom`.
 */
export const ROOM_LABELS: Array<{ key: RoomKey; label: string }> = [
  { key: 'bedroom',       label: 'Bedroom' },
  { key: 'fullBathroom',  label: 'Full Bathroom' },
  { key: 'halfBathroom',  label: 'Half Bathroom' },
  // Replaces separate Kitchen, Living Room and Dining Room rows (2026-10-18).
  { key: 'kitchenLivingDining', label: 'Kitchen, Living & Dining Area' },
  { key: 'familyRoom',    label: 'Family Room' },
  // 'office' removed 2026-09-21 (Geraldine: an office counts as a bedroom).
  // It stays in ROOM_PRICES on purpose: bookings already taken with an office
  // have to keep pricing and rendering, and dropping the key would make those
  // rooms vanish from the record and from the total. Removed from this list
  // only, which is what the picker and the summary read.
  { key: 'laundryRoom',   label: 'Laundry Room' },
  { key: 'stairsHallway', label: 'Stairs / Hallway' },
  { key: 'patioBalcony',  label: 'Patio / Balcony' },
]

// Names for keys that are no longer offered but can still turn up in an old
// booking record, an old crew note, or a draft that has not been migrated yet.
const LEGACY_ROOM_LABELS: Partial<Record<RoomKey, string>> = {
  kitchen: 'Kitchen',
  livingRoom: 'Living Room',
  diningRoom: 'Dining Room',
  office: 'Office',
}

const ROOM_LABEL_BY_KEY = new Map<RoomKey, string>([
  ...(Object.entries(LEGACY_ROOM_LABELS) as Array<[RoomKey, string]>),
  ...ROOM_LABELS.map((r) => [r.key, r.label] as [RoomKey, string]),
])

export function roomLabel(key: RoomKey): string {
  return ROOM_LABEL_BY_KEY.get(key) ?? key
}

/**
 * What the booking form opens with (Geraldine, 2026-10-18): one bedroom, one full
 * bathroom and one Kitchen/Living/Dining area. At Regular prices that is
 * $20 + $30 + $70 = $120, which is exactly the regular minimum, so the customer's
 * first number is the floor and everything they add moves it up from there.
 */
export const DEFAULT_AREAS: RoomCounts = { bedroom: 1, fullBathroom: 1, kitchenLivingDining: 1 }

/**
 * Rewrites areas saved under the old room list into the current one.
 *
 * Needed because abandoned-booking recovery emails link back into a saved draft
 * (?resume=...). A draft written before this change can hold `kitchen`,
 * `livingRoom` and `diningRoom`, which the picker no longer shows: the customer
 * would be charged for areas they cannot see and cannot remove, and the summary
 * would not add up. Office was retired the same way on 2026-09-21 and had the same
 * gap, so it is handled here too.
 *
 *   kitchen / livingRoom / diningRoom  ->  kitchenLivingDining
 *       one combined area per home, so the LARGEST of the three counts, not the sum
 *       (a home with one kitchen, one living room and one dining room is ONE area)
 *   office                             ->  bedroom   (Geraldine: count it as a bedroom)
 *
 * Returns the same object untouched when there is nothing to migrate.
 */
export function migrateLegacyAreas(areas: RoomCounts | undefined): RoomCounts | undefined {
  if (!areas) return areas
  const { kitchen = 0, livingRoom = 0, diningRoom = 0, office = 0 } = areas
  if (!kitchen && !livingRoom && !diningRoom && !office) return areas

  const next: RoomCounts = { ...areas }
  delete next.kitchen
  delete next.livingRoom
  delete next.diningRoom
  delete next.office

  const combined = Math.max(kitchen, livingRoom, diningRoom)
  if (combined > 0) next.kitchenLivingDining = Math.max(next.kitchenLivingDining ?? 0, combined)
  if (office > 0) next.bedroom = (next.bedroom ?? 0) + office
  return next
}

/**
 * Selected areas as priced line items, in display order.
 *
 * Quantity is included in `total` and shown as "2 Bedrooms" rather than a bare
 * count, because Geraldine's example summary lists the count alongside the
 * money: "2 Bedrooms — $50".
 */
export function areaLineItems(
  counts: RoomCounts,
  tier: CleaningTier,
): Array<{ key: RoomKey; label: string; qty: number; unit: number; total: number }> {
  return ROOM_LABELS.filter(({ key }) => (counts[key] ?? 0) > 0).map(({ key, label }) => {
    const qty = counts[key] as number
    const unit = ROOM_PRICES[key][tier]
    return { key, label, qty, unit, total: unit * qty }
  })
}

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
// Was ['kitchen', 'livingRoom']. Both, and the dining room, are now one combined area.
export const IMPLIED_ROOMS: RoomKey[] = ['kitchenLivingDining']

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
 * `deep` was INFERRED as $225 (the old 1 Bed / 1 Bath deep package) until
 * 2026-10-18, when Geraldine gave the new deep prices and said: "The minimum
 * standard Deep Cleaning configuration (1 bedroom, 1 bathroom, up to 1,000 sqft,
 * Well Maintained) should calculate to exactly $200."
 *
 * 1 bedroom $40 + 1 full bathroom $60 + Kitchen/Living/Dining $100 = $200, so the
 * deep floor is now $200, exactly as regular's $120 is its own default selection
 * ($20 + $30 + $70). She described a configuration rather than naming a floor; we asked,
 * and on 2026-10-18 she confirmed: "that is our minimum for deep clean".
 */
export const MINIMUM_BOOKING: Record<CleaningTier, number> = {
  regular: 120,
  deep: 200,
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

// ─── HOME CONDITION ──────────────────────────────────────────────────────────
//
// Geraldine, 2026-09-08: "two homes with the same number of bedrooms and
// bathrooms can require very different amounts of work." Per-area prices stay
// exactly as they are; this adds a multiplier on top of the AREA total only.
//
// Two questions, the second conditional on the first. Asking "when was it last
// cleaned" first matters: it is a fact the customer knows, whereas "what
// condition is your home in" is a judgement they will flatter themselves on.
// The date question sets the frame before the judgement is asked.

export const LAST_CLEANED_OPTIONS = [
  { value: 'within-1-month', label: 'Within the last month' },
  { value: '1-3-months', label: '1-3 months ago' },
  { value: '3-6-months', label: '3-6 months ago' },
  { value: 'over-6-months', label: 'More than 6 months ago' },
  { value: 'not-sure', label: "I'm not sure" },
] as const

/**
 * Does this answer open the condition question?
 *
 * Everything except "within the last month" — including "I'm not sure", which
 * Geraldine grouped with the long gaps deliberately. Someone who cannot
 * remember when it was last done is far more likely to be a long gap than a
 * short one.
 */
export function asksCondition(lastCleaned?: string): boolean {
  return !!lastCleaned && lastCleaned !== 'within-1-month'
}

/**
 * `uplift` multiplies the AREA subtotal only, never add-ons. Geraldine:
 * "The 25% condition adjustment should apply only to the base area cleaning
 * price. It should NOT apply to add-ons."
 *
 * `heavy` carries an uplift of 0 on purpose. It is not a surcharge — it
 * switches the whole job to the Deep tier and re-prices from the deep column,
 * which is a much larger change than 25% (a 3 bed / 2 bath goes $205 → $365,
 * or +78%). See effectiveTier().
 */
export const HOME_CONDITION_OPTIONS = [
  {
    value: 'maintained',
    label: 'Generally Maintained',
    desc: 'The home is regularly picked up and cleaned, with little to no buildup.',
    uplift: 0,
  },
  {
    value: 'attention',
    label: 'Needs Extra Attention',
    desc: "There is some dust, buildup, pet hair, or areas that haven't been cleaned recently.",
    uplift: 0.25,
  },
  {
    value: 'heavy',
    label: 'Heavy Buildup: Needs Significant Attention',
    desc: 'The home has significant buildup or has not been thoroughly cleaned for an extended period.',
    uplift: 0,
  },
  // Deep Cleaning only (Geraldine, 2026-10-18). Selecting it removes the automatic price and
  // the automatic booking: the customer submits their details for a personalised quote
  // instead. The wording of the description is ours, not hers: she specified the behaviour
  // and the customer message (QUOTE_MESSAGES.severe) but not this line.
  {
    value: 'severe',
    label: 'Severe Condition',
    desc: 'The property needs far more than a standard deep clean. We will review it and send you a personalised quote.',
    uplift: 0,
    quoteOnly: true,
  },
] as const

export type HomeConditionValue = (typeof HOME_CONDITION_OPTIONS)[number]['value']

/**
 * The condition answer that actually counts, or undefined.
 *
 * The condition question is only shown for some answers to the first question,
 * so a stored value can be stale: pick "3-6 months ago", answer "Needs Extra
 * Attention", then go back and change the first answer to "within the last
 * month" and the second question disappears — but its answer is still in state.
 * Charging for an answer the customer can no longer see is exactly the kind of
 * thing that turns into a chargeback, so every caller normalises through here.
 */
export function activeCondition(lastCleaned?: string, homeCondition?: string): string | undefined {
  return asksCondition(lastCleaned) ? homeCondition : undefined
}

/**
 * The condition cards to offer. Severe is Deep-only (her slide: "under the Property
 * Condition section for Deep Cleaning"), so it appears once the clean is Deep, whether the
 * customer picked Deep or a Regular customer picked Heavy Buildup and was moved there.
 */
export function conditionOptionsFor(tier: CleaningTier) {
  return HOME_CONDITION_OPTIONS.filter((o) => !('quoteOnly' in o && o.quoteOnly) || tier === 'deep')
}

export function conditionUplift(condition?: string): number {
  return HOME_CONDITION_OPTIONS.find((o) => o.value === condition)?.uplift ?? 0
}

export function conditionLabel(condition?: string): string | undefined {
  return HOME_CONDITION_OPTIONS.find((o) => o.value === condition)?.label
}

export function lastCleanedLabel(value?: string): string | undefined {
  return LAST_CLEANED_OPTIONS.find((o) => o.value === value)?.label
}

/**
 * The tier the job is actually priced and staffed at.
 *
 * SINGLE SOURCE OF TRUTH. Three places used to derive the tier with their own
 * copy of `cleaningType === 'Deep' ? 'deep' : 'regular'` — the step component,
 * the pricing hook and the submit flow. Adding a second way to reach the deep
 * tier meant a fourth divergence waiting to happen, so they all call this now.
 *
 * Heavy buildup wins over the customer's "Type of Cleaning" answer because it
 * describes the property, not a preference. Geraldine: "Do NOT add a
 * percentage. Instead, recommend Deep Cleaning and recalculate the service
 * using our Deep Cleaning pricing."
 */
export function effectiveTier(cleaningType?: string, homeCondition?: string): CleaningTier {
  // Severe is a Deep-only option, so it implies the deep tier for the same reason heavy does:
  // it describes the property, not a preference.
  if (homeCondition === 'heavy' || homeCondition === 'severe') return 'deep'
  // Move-In / Move-Out is priced from the DEEP column (Geraldine, 2026-10-18: "Final Deep
  // Cleaning Price + $60"). See MOVE_OUT_FEE for the fee itself.
  if (cleaningType === 'Deep' || cleaningType === MOVE_OUT_TYPE) return 'deep'
  return 'regular'
}

/** The "Type of Cleaning" value for a move-in or move-out clean. Also the GHL option label. */
export const MOVE_OUT_TYPE = 'Move-in/Move-out'

/**
 * The flat extra charge on a Move-In / Move-Out clean.
 *
 *   Move-In / Move-Out Price = Final Deep Cleaning Price + $60
 *
 * "Please make sure the $60 fee is added AFTER all size and condition adjustments, so it
 * is not affected by any percentages." Her example: a $465 Deep clean (after adjustments)
 * becomes $525. So the fee is added to the total, never to the area subtotal: it is not
 * multiplied by the size band or the condition uplift, and it is not part of what the
 * recurring discount or the minimum booking floor act on.
 */
export const MOVE_OUT_FEE = 60

export function isMoveOut(cleaningType?: string): boolean {
  return cleaningType === MOVE_OUT_TYPE
}

// ─── PROPERTY SIZE ───────────────────────────────────────────────────────────
//
// Geraldine, 2026-10-18: the free "Approx. Size (sq ft)" box becomes a choice of bands,
// and the band is a PRICE MULTIPLIER on the selected areas:
//
//   Subtotal of Selected Cleaning Areas x Property Size Multiplier = Adjusted Price
//
// This deliberately reverses her 2026-08-20 decision that square footage should only
// sharpen the time estimate and never touch price. It stays true that no exact figure
// is asked for: a band is coarse on purpose, and "I don't know my exact square footage"
// stops being a reason to skip the question.
//
// Applies to Regular and Deep. The size selector is only shown for the area-priced
// service; commercial, post-construction and the rest keep the plain number box.

export type PropertySizeBand = {
  value: string
  /** "S, Small" etc. */
  label: string
  range: string
  /** Fraction added to the area subtotal: 0.10 means +10%. */
  uplift: number
  /**
   * A representative square footage for this band: its UPPER bound, so the time
   * estimate (sqft / 500) is never lower than the home really needs. It is also what
   * is stored in the numeric squareFootage field the booking record and the GHL
   * booking object still expect.
   */
  sqft: number
  /** No automatic price: the customer is routed to a custom quote instead. */
  quoteOnly?: boolean
}

export const PROPERTY_SIZES: readonly PropertySizeBand[] = [
  { value: 'small',     label: 'S, Small',        range: 'Up to 1,000 sq ft',     uplift: 0,    sqft: 1000 },
  { value: 'medium',    label: 'M, Medium',       range: '1,001 to 1,500 sq ft',  uplift: 0.1,  sqft: 1500 },
  { value: 'large',     label: 'L, Large',        range: '1,501 to 2,000 sq ft',  uplift: 0.2,  sqft: 2000 },
  { value: 'xl',        label: 'XL, Extra Large', range: '2,001 to 2,500 sq ft',  uplift: 0.3,  sqft: 2500 },
  { value: 'oversized', label: 'Oversized',       range: '2,501 to 2,999 sq ft',  uplift: 0.4,  sqft: 2999 },
  // No uplift: there is no price to adjust. 3,000+ is "Custom Quote Required".
  { value: 'estate',    label: 'Estate',          range: '3,000+ sq ft',          uplift: 0,    sqft: 3000, quoteOnly: true },
]

/** What the form opens on. Her Deep "standard configuration" is "up to 1,000 sqft". */
export const DEFAULT_PROPERTY_SIZE = 'small'

export function propertySize(value?: string): PropertySizeBand | undefined {
  return PROPERTY_SIZES.find((s) => s.value === value)
}

export function sizeUplift(value?: string): number {
  return propertySize(value)?.uplift ?? 0
}

/** Which band a typed square footage falls in. For drafts saved before the bands existed. */
export function sizeFromSqft(sqft?: number): string {
  if (!sqft || sqft <= 0) return DEFAULT_PROPERTY_SIZE
  return (PROPERTY_SIZES.find((s) => sqft <= s.sqft && !s.quoteOnly) ?? PROPERTY_SIZES[PROPERTY_SIZES.length - 1]!).value
}

export type QuoteReason = 'severe' | 'estate'

/**
 * What the customer is told when there is no automatic price.
 *
 * `severe` is Geraldine's wording, verbatim (2026-10-18). `estate` is ours, modelled on it:
 * her slides say Estate is "Custom Quote Required" but do not give a message for it.
 */
export const QUOTE_MESSAGES: Record<QuoteReason, string> = {
  severe:
    'Your property requires additional cleaning time and special attention. Please submit your information, and our team will contact you with a personalized quote.',
  estate:
    'Homes of 3,000 sq ft or more are quoted individually. Please submit your information, and our team will contact you with a personalized quote.',
}

/**
 * EVERYTHING that adjusts the area price, resolved in one place.
 *
 * Five call sites used to each work out the tier and the uplift for themselves (the form,
 * the summary panel, the estimate, the pricing hook and the submit flow). That is how the
 * condition rule could drift between them, so they all call this now and cannot disagree.
 *
 * Size and condition are ADDED, not multiplied. Her answer, 2026-10-18, to a Large (+20%)
 * home that also Needs Extra Attention (+25%): "add them together (+45%) = $246.50" on a
 * $170 base. Multiplying would have given +50% = $255.
 */
export function areaPricing(extras: {
  cleaningType?: string
  lastCleaned?: string
  homeCondition?: string
  propertySize?: string
}) {
  const condition = activeCondition(extras.lastCleaned, extras.homeCondition)
  const tier = effectiveTier(extras.cleaningType, condition)
  const size = sizeUplift(extras.propertySize)
  const cond = conditionUplift(condition)

  // No automatic price at all, for either of two reasons. A Severe condition can only be
  // reached on the deep tier, but check it anyway: a stale 'severe' left in state after the
  // customer switched away must not keep them out of the instant quote.
  const quoteReason: QuoteReason | undefined =
    condition === 'severe' && tier === 'deep'
      ? 'severe'
      : propertySize(extras.propertySize)?.quoteOnly
        ? 'estate'
        : undefined

  return {
    condition,
    tier,
    sizeUplift: size,
    conditionUplift: cond,
    /** The combined fraction applied to the area subtotal. */
    uplift: size + cond,
    /** True when the customer must be routed to a custom quote instead of a price. */
    quoteOnly: quoteReason !== undefined,
    quoteReason,
    /** The Move-In / Move-Out fee, added after all percentages. Zero for every other clean. */
    flatFee: isMoveOut(extras.cleaningType) ? MOVE_OUT_FEE : 0,
  }
}

export type Quote = {
  /** Sum of the per-area list prices, exactly as shown next to each row. */
  roomsList: number
  /** Dollars the condition multiplier added. Internal — never shown itemised. */
  conditionAmount: number
  /** Raw sum of selected areas, before the minimum is applied. */
  subtotal: number
  /** The floor for this tier. */
  minimum: number
  /**
   * A flat fee added AFTER every percentage, the Move-In / Move-Out $60. Zero otherwise.
   * Included in `subtotal` and `total`; shown to the customer as its own line.
   */
  flatFee: number
  /** What the customer actually pays: MAX(minimum, subtotal), plus any flat fee. */
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
  uplift = 0,
  flatFee = 0,
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
  // The condition multiplier lands HERE — on the rooms, before the minimum and
  // before the discount. That ordering is what makes Geraldine's stated formula
  // true (Area Price + Home Condition Adjustment + Add-ons − Recurring Discount)
  // while keeping the two rules she gave separately intact: the uplift never
  // touches `extrasTotal`, and the minimum still floors rooms-only.
  const roomsList = priceRooms(counts, tier)
  // Rounded to the cent: 170 * 1.45 is 246.49999999999997 in floating point, which would
  // round to $246 instead of the $246.50 (so $247) the arithmetic says.
  const roomsSubtotal = Math.round(roomsList * (1 + uplift) * 100) / 100
  const conditionAmount = Math.round(roomsSubtotal - roomsList)

  const subtotal = Math.max(minimum, roomsSubtotal) + extrasTotal + flatFee

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
  // The flat fee goes on LAST, after the rounding, the discount and the minimum, so no
  // percentage and no floor can touch it.
  const total = Math.round(roomsFinal) + extrasTotal + flatFee

  // The upsell message is about ROOMS only, for the same reason: telling someone
  // they can "add $20 more" when an add-on would satisfy it would be telling them
  // add-ons count toward the floor, which they do not.
  const minimumApplied = roomsSubtotal < minimum

  return {
    roomsList,
    conditionAmount,
    flatFee,
    subtotal: Math.round(subtotal),
    minimum,
    total,
    minimumApplied,
    // Expressed in LIST dollars — the numbers printed beside each area row —
    // because that is what the customer is being invited to add. With an uplift
    // active the raw gap to the minimum is not reachable by adding that many
    // dollars of rooms, since each dollar added carries the multiplier with it.
    remainingToMinimum: minimumApplied ? Math.round((minimum - roomsSubtotal) / (1 + uplift)) : 0,
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

/**
 * Custom Hourly Cleaning is its own service category (Geraldine, 2026-10-18: "It should
 * only be available as its own service category"). It reuses the stored value `custom`,
 * which has been in ServiceCategory, the Bookings collection and the GHL service map all
 * along, so no booking record or CRM option had to change.
 *
 * It is NOT area-priced: no area picker, no add-ons, no size band, no condition question,
 * no minimum booking and no recurring discount. The price is total labour hours x a rate.
 */
export function isHourlyService(serviceType: string): boolean {
  return serviceType === 'custom'
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

// History of the rate, because it has changed three times and the earlier comments
// below still quote old figures:
//   - 2026-08-20: a flat $45/hr, never wired to any UI.
//   - 2026-09-21: tiered $35 / $32 / $30, banded on TOTAL combined labour hours.
//   - 2026-10-18: tiered $45 / $42 / $40 (her "1) Custom Hourly rate" slide, which says
//     "replace the previous $35/$32/$30 hourly pricing structure"). Same rule: banded on
//     total combined labour hours, the lower rate applies to ALL booked hours, and the
//     minimum is 3 hours per cleaner. Her pricing-examples slide is the test table in
//     the comment on quoteHourly() below.

export const HOURLY_MIN_HOURS_PER_CLEANER = 3
export const HOURLY_MAX_HOURS_PER_CLEANER = 12
export const HOURLY_MIN_CLEANERS = 1
/**
 * One or two. Her 2026-10-18 slide: "3 to 5 hours: 1 cleaner only. 6+ hours: option to
 * select 1 or 2 cleaners." It was 6 before, which her slide does not allow.
 *
 * The 6-hour threshold for a second cleaner needs no separate check: with a 3-hour
 * minimum per cleaner, two cleaners are always at least 6 combined hours.
 */
export const HOURLY_MAX_CLEANERS = 2

/**
 * Rate per labour hour, banded by TOTAL COMBINED LABOUR HOURS (see hourlyRate()).
 * Highest band first so the first match wins.
 *
 *   3 to 4 hours  $45
 *   5 to 6 hours  $42
 *   7 or more     $40
 */
export const HOURLY_RATE_TIERS = [
  { minHours: 7, rate: 40 },
  { minHours: 5, rate: 42 },
  { minHours: 3, rate: 45 },
] as const

/** The undiscounted rate: the top of the card. What "savings" are measured against. */
export const HOURLY_BASE_RATE = HOURLY_RATE_TIERS[HOURLY_RATE_TIERS.length - 1].rate

/**
 * The rate for a booking.
 *
 * Banded on TOTAL COMBINED LABOUR HOURS (cleaners x hours each).
 *
 * Her first written spec said the opposite: "the rate is determined by the hours
 * selected per cleaner, not total combined labor hours." We raised it because the two
 * readings differ by real money, and she changed the rule on 2026-09-21, and restated it
 * on 2026-10-18: "Discounts are based on total combined labor hours, regardless of the
 * number of cleaners. The discounted hourly rate applies to ALL booked hours, not just
 * the additional hours."
 *
 * Her 2026-10-18 worked examples (the test table for this function):
 *
 *   1 cleaner  x 3h = 3 combined   $45   $135
 *   1 cleaner  x 4h = 4            $45   $180
 *   1 cleaner  x 5h = 5            $42   $210
 *   1 cleaner  x 6h = 6            $42   $252
 *   2 cleaners x 3h = 6            $42   $252    (same price as 1 x 6: hours are divided,
 *   1 cleaner  x 7h = 7            $40   $280     never doubled, when a second cleaner is added)
 *   2 cleaners x 4h = 8            $40   $320
 *
 * The comment is long on purpose: an older printed spec still says per-cleaner, so anyone
 * checking this code against that document will think it is wrong.
 */
export function hourlyRate(totalLaborHours: number): number {
  const hours = Math.max(HOURLY_MIN_HOURS_PER_CLEANER, totalLaborHours)
  return (HOURLY_RATE_TIERS.find((t) => hours >= t.minHours) ?? HOURLY_RATE_TIERS[2]).rate
}

export type HourlyQuote = {
  cleaners: number
  hoursPerCleaner: number
  /** cleaners x hoursPerCleaner. This is what the rate band is chosen from. */
  totalLaborHours: number
  rate: number
  total: number
  /**
   * What booking this many hours saves against the undiscounted rate: total labour hours x
   * (base rate - rate). Her slide: "the website should automatically calculate the total
   * price and display the customer's savings." Zero in the top band.
   */
  savings: number
}

/** The smallest booking. Her slide: "Each cleaner must work at least 3 hours." */
export const HOURLY_MIN_TOTAL_HOURS = HOURLY_MIN_HOURS_PER_CLEANER

/**
 * Combined hours needed before a second cleaner can be requested. Her slide: "Customers
 * should only be able to request a second cleaner when booking at least 6 combined labor
 * hours." It is exactly two cleaners at the 3-hour minimum each.
 */
export const HOURLY_SECOND_CLEANER_MIN_TOTAL = HOURLY_MIN_HOURS_PER_CLEANER * 2

/** The most combined hours one booking can hold with this many cleaners. */
export function hourlyMaxTotal(cleaners: number): number {
  return HOURLY_MAX_HOURS_PER_CLEANER * Math.max(HOURLY_MIN_CLEANERS, cleaners)
}

/** Is a second cleaner allowed at this many combined hours? */
export function canAddSecondCleaner(totalHours: number): boolean {
  return totalHours >= HOURLY_SECOND_CLEANER_MIN_TOTAL
}

/**
 * Forces a requested (total hours, cleaners) pair into one the rules allow, instead of
 * rejecting it, so the form can never sit in an invalid state:
 *
 *   - total hours is at least 3 and a whole number
 *   - cleaners is 1, or 2 only once the booking reaches 6 combined hours
 *   - a total that is too small for the cleaners asked for drops to ONE cleaner (rather
 *     than raising the hours: the customer asked for a time, not a bigger booking)
 *   - total never exceeds 12 hours per cleaner
 */
export function normalizeHourly(totalHours: number, cleaners: number): { totalHours: number; cleaners: number } {
  let c = Math.min(HOURLY_MAX_CLEANERS, Math.max(HOURLY_MIN_CLEANERS, Math.floor(cleaners) || HOURLY_MIN_CLEANERS))
  let t = Math.max(HOURLY_MIN_TOTAL_HOURS, Math.floor(totalHours) || HOURLY_MIN_TOTAL_HOURS)
  if (c > 1 && !canAddSecondCleaner(t)) c = 1
  t = Math.min(hourlyMaxTotal(c), t)
  return { totalHours: t, cleaners: c }
}

/**
 * THE PRIMITIVE: total combined labour hours, divided between the cleaners.
 *
 * Total hours is the input and the cleaners split it, which is how she describes it:
 * "When customers select 2 cleaners, please explain that the total labor hours are
 * divided between both cleaners... 6 combined hours can be 1 cleaner working 6 hours or
 * 2 cleaners working 3 hours each. Both options cost the same: $252. Please ensure the
 * website calculates the hours correctly and does not accidentally double the total when
 * a second cleaner is selected."
 *
 * That last sentence is the reason this exists. The form used to ask for HOURS PER CLEANER
 * and a cleaner count, and the total was their product, so adding a second cleaner to a
 * 6-hour booking silently made it 12 hours: $252 became $480. With total hours as the
 * input, the cleaner count cannot change the price at all.
 *
 * This REPLACES the area price entirely (Geraldine, 2026-09-21): no area total, no
 * add-ons, no minimum booking and no recurring discount are applied on top. The customer
 * is buying a block of time, not a scope of work.
 *
 * `hoursPerCleaner` can be a half hour (7 hours between 2 cleaners is 3.5 each), which her
 * rules allow because each cleaner still works at least 3.
 */
export function quoteHourlyTotal(totalHours: number, cleaners: number): HourlyQuote {
  const n = normalizeHourly(totalHours, cleaners)
  const rate = hourlyRate(n.totalHours)
  return {
    cleaners: n.cleaners,
    hoursPerCleaner: n.totalHours / n.cleaners,
    totalLaborHours: n.totalHours,
    rate,
    total: n.totalHours * rate,
    savings: n.totalHours * (HOURLY_BASE_RATE - rate),
  }
}

/**
 * Cleaners x hours each, for callers that think in that shape (the After Party page's
 * worked example). Same price as quoteHourlyTotal(c * h, c): the price only ever depends
 * on the product.
 */
export function quoteHourly(cleaners: number, hoursPerCleaner: number): HourlyQuote {
  const c = Math.max(HOURLY_MIN_CLEANERS, Math.floor(cleaners) || HOURLY_MIN_CLEANERS)
  const h = Math.max(HOURLY_MIN_HOURS_PER_CLEANER, Math.floor(hoursPerCleaner) || HOURLY_MIN_HOURS_PER_CLEANER)
  return quoteHourlyTotal(c * h, c)
}

/**
 * The quote for what is stored in the booking form. Reads `totalHours`, and falls back to
 * cleaners x hoursPerCleaner for a draft saved before the form switched to total hours, so
 * an abandoned-booking resume link does not come back as a different price.
 */
export function quoteHourlyFromState(state?: {
  cleaners?: number
  totalHours?: number
  hoursPerCleaner?: number
} | null): HourlyQuote {
  const cleaners = state?.cleaners ?? HOURLY_MIN_CLEANERS
  const total =
    state?.totalHours ??
    (state?.hoursPerCleaner ? cleaners * state.hoursPerCleaner : HOURLY_MIN_TOTAL_HOURS)
  return quoteHourlyTotal(total, cleaners)
}

/**
 * The wording that keeps an hourly booking from becoming a dispute. Verbatim
 * from Geraldine, 2026-09-21 — it has to appear wherever hourly is quoted.
 */
export const HOURLY_DISCLAIMER =
  'Custom Hourly Cleaning is a time-based service focused on your selected priorities. ' +
  "Our cleaning professionals will work on the areas you've requested within the booked time. " +
  "Completion of all selected areas is not guaranteed and will depend on the property's condition and the time reserved."

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
  // 40 + 25 + 15: the three rooms it replaces, at the same minutes as before.
  kitchenLivingDining: 80,
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
  uplift = 0,
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

  // A home that needs extra attention takes longer, not just more money. The
  // uplift is Geraldine's own measure of "the actual amount of work required",
  // so it belongs on the duration for the same reason it belongs on the price.
  // This only reaches the crew note — appointmentHours() still blocks the
  // minimum — but that note is what tells a scheduler to extend the slot.
  const rounded = Math.ceil(Math.max(fromAreas, fromSqft) * (1 + uplift) * 2) / 2

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
