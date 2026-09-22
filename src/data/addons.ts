// src/data/addons.ts
// Add-on services and their prices.
//
// Source: Geraldine's add-on price table, 2026-09-21, plus her quantity
// specification of the same date.
//
// WHY THIS FILE EXISTS
// The prices used to live in EXTRA_PRICES in src/utilities/booking-helpers.ts,
// mixed in with the dead square-footage pricing model, and they were never
// shown to the customer: Step04AddOns rendered the label and the icon and threw
// the price away. Eleven of the seventeen were also wrong against the table
// above. Worse, several of them CANNOT be a single number — "$8 per window" is
// not a price until you know how many windows — so the flat Record<string,
// number> could not express what is actually being sold.
//
// A unit price plus a unit plus "does it take a quantity" is the smallest model
// that covers every row of her table.

/**
 * What one unit of this add-on is.
 *
 * `area` is deliberately distinct from `each` even though both multiply the
 * same way. Geraldine, 2026-09-21: for baseboards and cabinets the quantity is
 * "the number of rooms or areas, NOT individual pieces" — a customer counting
 * 40 individual baseboards instead of 6 rooms would quote themselves a number
 * nobody intends to charge. The two units exist so the UI can say which is
 * meant.
 */
export type AddOnUnit = 'flat' | 'each' | 'area' | 'hour' | 'window' | 'load' | 'bed'

/**
 * A size band, for add-ons priced by how much there is rather than how many.
 *
 * Dish washing is the case this exists for: "up to 15 items including 3 pans" is
 * not a quantity the customer can step through, it is a bracket they recognise
 * their sink in. The description is not decoration — it is the whole mechanism,
 * because without it Small/Medium/Large means whatever the customer hopes.
 */
export type AddOnVariant = {
  value: string
  label: string
  price: number
  desc: string
}

export type AddOn = {
  id: string
  label: string
  /**
   * Price for ONE unit, multiplied by the quantity when `quantity` is true.
   * When `variants` is set this is the cheapest band, used only for the "From $X"
   * on the card face; the charged figure always comes from the chosen variant.
   */
  price: number
  unit: AddOnUnit
  /** Does the customer pick how many? False means a single flat charge. */
  quantity: boolean
  /** Mutually exclusive with `quantity`: the customer picks one band. */
  variants?: AddOnVariant[]
  /** Shown after the price, e.g. "$8 /window". Omitted for flat charges. */
  unitSuffix?: string
  /** Shown under the quantity stepper, when counting needs explaining. */
  hint?: string
  /** Extra caveat shown under the variant list. */
  note?: string
  /** Renders "From $35" rather than "$35" — the real figure needs a look. */
  startingAt?: boolean
}

/** Nobody needs 30 ovens cleaned. Also stops a fat finger quoting $4,000. */
export const MAX_ADDON_QTY = 20

export const ADD_ONS: AddOn[] = [
  { id: 'inside-fridge',   label: 'Inside Fridge',        price: 35, unit: 'each',   quantity: true,  unitSuffix: 'each', hint: 'How many refrigerators?' },
  { id: 'inside-oven',     label: 'Inside Oven',          price: 35, unit: 'each',   quantity: true,  unitSuffix: 'each', hint: 'How many ovens?' },
  {
    id: 'inside-cabinets', label: 'Inside Cabinets',      price: 45, unit: 'area',   quantity: true,  unitSuffix: 'per area',
    hint: 'How many areas need the inside of the cabinets cleaned? Kitchen = 1 area, bathroom = 1 area.',
  },
  { id: 'inside-windows',  label: 'Inside Windows',       price: 8,  unit: 'window', quantity: true,  unitSuffix: 'per window', hint: 'How many windows?' },
  {
    id: 'baseboards',      label: 'Baseboards',           price: 40, unit: 'area',   quantity: true,  unitSuffix: 'per area',
    hint: 'How many rooms or areas? Each bedroom, bathroom, kitchen or living room counts as 1 area.',
  },
  { id: 'walls',           label: 'Wall Spot Cleaning',   price: 35, unit: 'flat',   quantity: false },
  // Sized, not hourly (Geraldine, 2026-09-21: "remove the hourly selector for
  // Dish Washing. Instead, the customer should select Small, Medium, or Large
  // based on the amount of dishes and cookware").
  //
  // This replaced a per-hour price, which was the wrong shape for the job: a
  // customer standing at their sink can count plates, but has no idea how long
  // washing them takes. Sizing by what they can see removes the guess, and the
  // pot/pan cap is what stops one greasy roasting tin landing in "Small".
  {
    id: 'dishes',
    label: 'Washing Dishes',
    price: 10,
    unit: 'flat',
    quantity: false,
    startingAt: true,
    variants: [
      { value: 'small',  label: 'Small',  price: 10, desc: 'Up to 15 standard dishes or items, including up to 3 pots or pans.' },
      { value: 'medium', label: 'Medium', price: 20, desc: '16 to 30 standard dishes or items, including up to 6 pots or pans.' },
      { value: 'large',  label: 'Large',  price: 30, desc: '31 to 45 standard dishes or items, including up to 10 pots or pans.' },
    ],
    note: 'Excessively greasy, burnt or heavily soiled cookware may require an additional charge.',
  },
  { id: 'closets',         label: 'Basement',             price: 45, unit: 'flat',   quantity: false },
  { id: 'ironing',         label: 'Ironing',              price: 30, unit: 'hour',   quantity: true,  unitSuffix: 'per hour', hint: 'How many hours?' },
  { id: 'laundry',         label: 'Laundry Service',      price: 30, unit: 'load',   quantity: true,  unitSuffix: 'per load', hint: 'How many loads?' },
  { id: 'organizing',      label: 'Home Organization',    price: 45, unit: 'hour',   quantity: true,  unitSuffix: 'per hour', hint: 'How many hours?' },
  { id: 'balcony',         label: 'Balcony / Patio',      price: 35, unit: 'each',   quantity: true,  unitSuffix: 'each', hint: 'How many balconies or patios?', startingAt: true },
  { id: 'pet-hair',        label: 'Pet Hair Removal',     price: 25, unit: 'flat',   quantity: false },
  // 'office' removed 2026-09-21 (Geraldine: "the office can be considered as a
  // bedroom"). Dropped from the areas list in ./pricing.ts for the same reason,
  // so a home office is now counted as a bedroom in both places rather than
  // being a room, an add-on, and a bedroom depending on where you look.
  //
  // Not deleted from history: bookings already taken store their own label and
  // price in selectedExtras, so they still render with the figure charged.
  { id: 'ceiling-fans',    label: 'Ceiling Fans',         price: 5,  unit: 'each',   quantity: true,  unitSuffix: 'each', hint: 'How many fans?' },
  { id: 'chandeliers',     label: 'Chandeliers / Lights', price: 15, unit: 'each',   quantity: true,  unitSuffix: 'each', hint: 'How many chandeliers or light fixtures?' },
  { id: 'same-day',        label: 'Same Day Booking',     price: 40, unit: 'flat',   quantity: false },

  // ── Added 2026-09-21 ────────────────────────────────────────────────────────
  // On Geraldine's price table but never offered in the booking form. Added on
  // my judgement rather than her explicit instruction, so worth one confirming
  // word from her that these are genuinely available before they go live.
  { id: 'garage-sweep',    label: 'Garage Sweep',         price: 30, unit: 'flat',   quantity: false, startingAt: true },
  { id: 'bed-linens',      label: 'Change Bed Linens',    price: 10, unit: 'bed',    quantity: true,  unitSuffix: 'per bed', hint: 'How many beds?' },
  { id: 'air-vents',       label: 'Air Vents',            price: 8,  unit: 'each',   quantity: true,  unitSuffix: 'each', hint: 'How many vents?' },
  { id: 'window-tracks',   label: 'Window Tracks',        price: 30, unit: 'flat',   quantity: false, startingAt: true },
]

const BY_ID = new Map(ADD_ONS.map((a) => [a.id, a]))

export function getAddOn(id: string): AddOn | undefined {
  return BY_ID.get(id)
}

/** How many units of `id` are selected. Always ≥ 1 for a selected add-on. */
export function addOnQty(id: string, quantities: Record<string, number> | undefined): number {
  const addon = BY_ID.get(id)
  if (!addon?.quantity) return 1
  const n = quantities?.[id]
  return Number.isFinite(n) && (n as number) > 0 ? Math.min(MAX_ADDON_QTY, n as number) : 1
}

/**
 * The band chosen for a variant add-on. Falls back to the FIRST (cheapest) band
 * rather than to nothing, so a selected add-on always has a real price.
 */
export function addOnVariant(id: string, variants?: Record<string, string>): AddOnVariant | undefined {
  const addon = BY_ID.get(id)
  if (!addon?.variants?.length) return undefined
  return addon.variants.find((v) => v.value === variants?.[id]) ?? addon.variants[0]
}

/** Price for one selected add-on, quantity or chosen size included. */
export function addOnTotal(
  id: string,
  quantities?: Record<string, number>,
  variants?: Record<string, string>,
): number {
  const addon = BY_ID.get(id)
  if (!addon) return 0
  const variant = addOnVariant(id, variants)
  if (variant) return variant.price
  return addon.price * addOnQty(id, quantities)
}

/**
 * Total for every selected add-on.
 *
 * Deliberately NOT affected by the home-condition uplift or the recurring
 * discount. Geraldine, 2026-09-08: the condition adjustment applies "only to the
 * base area cleaning price", and the recurring discount is on the recurring
 * cleaning rather than one-off extras. See quoteAreas() in ./pricing.ts.
 */
export function addOnsTotal(
  selected: string[],
  quantities?: Record<string, number>,
  variants?: Record<string, string>,
): number {
  return selected.reduce((sum, id) => sum + addOnTotal(id, quantities, variants), 0)
}

/** "$8 per window" / "$35" / "From $35". For the card face. */
export function addOnPriceLabel(addon: AddOn): string {
  const money = `$${addon.price}`
  const base = addon.startingAt ? `From ${money}` : money
  return addon.unitSuffix ? `${base} ${addon.unitSuffix}` : base
}
