// Broward County, Florida — list of every 5-digit ZIP code we accept
// for bookings. Compiled from US Census + USPS public data 2026-05.
//
// Decision (2026-05-21): accept all of Broward for v1. Geraldine can
// narrow this later if she finds certain areas unprofitable (e.g. only
// east Broward, or excluding the western edge near the Everglades).
//
// Update process:
//   - Adding a zip: just push it into the Set. No other changes needed.
//   - Removing a zip: same. The validator (isBrowardZip) re-reads on each call.
//   - Switching to API-based lookup: replace isBrowardZip's body.

export const BROWARD_ZIPS: ReadonlySet<string> = new Set([
  // Dania Beach
  '33004',
  // Hallandale Beach
  '33008', '33009',
  // Hollywood (incl. Beach)
  '33019', '33020', '33021', '33022',
  // Pembroke Pines, Miramar, Cooper City
  '33023', '33024', '33025', '33026', '33027', '33028', '33029',
  // Pompano Beach, Lighthouse Point
  '33060', '33061', '33062', '33064',
  // Coconut Creek, Margate
  '33063', '33066', '33068', '33073', '33076', '33077', '33093', '33097',
  // Coral Springs, Parkland
  '33065', '33067', '33071', '33075',
  // Wilton Manors, Fort Lauderdale (downtown + east + west)
  '33301', '33302', '33303', '33304', '33305', '33306', '33307', '33308',
  '33309', '33310', '33311', '33312', '33313', '33314', '33315', '33316',
  '33317', '33318', '33334', '33335', '33336', '33337', '33338', '33339',
  '33340',
  // Tamarac, Lauderhill, Sunrise, Plantation
  '33319', '33320', '33321', '33322', '33323', '33324', '33325', '33345',
  '33351', '33388',
  // Weston, Davie, Cooper City
  '33326', '33327', '33328', '33329', '33330', '33331', '33332',
  // North Lauderdale / outliers
  '33394',
  // Deerfield Beach
  '33441', '33442', '33443',
])

/** Returns true if the given string is a valid 5-digit zip in Broward County. */
export function isBrowardZip(zip: string): boolean {
  const trimmed = (zip ?? '').trim()
  if (!/^\d{5}$/.test(trimmed)) return false
  return BROWARD_ZIPS.has(trimmed)
}
