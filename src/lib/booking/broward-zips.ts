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

// Miami-Dade County (added 2026-07 — service area expanded beyond Broward).
export const MIAMI_DADE_ZIPS: ReadonlySet<string> = new Set([
  // Hialeah / Hialeah Gardens / Miami Lakes
  '33002', '33010', '33011', '33012', '33013', '33014', '33015', '33016', '33018',
  // Homestead / Florida City / Redland
  '33030', '33031', '33032', '33033', '33034', '33035', '33039', '33090', '33092',
  // Opa-locka, Miami Gardens, Miami Springs, Key Biscayne
  '33054', '33055', '33056', '33166', '33266', '33149',
  // Miami (city + greater)
  '33101', '33102', '33106', '33109', '33111', '33112', '33114', '33116',
  '33119', '33122', '33124', '33125', '33126', '33127', '33128', '33129',
  '33130', '33131', '33132', '33133', '33134', '33135', '33136', '33137',
  '33138', '33142', '33143', '33144', '33145', '33146', '33147', '33150',
  '33155', '33156', '33157', '33158', '33165', '33167', '33168', '33169',
  '33170', '33172', '33173', '33174', '33175', '33176', '33177', '33178',
  '33182', '33183', '33184', '33185', '33186', '33187', '33189', '33190',
  '33193', '33194', '33196', '33197', '33199',
  // Miami Beach / Bal Harbour / Surfside / Sunny Isles / Aventura
  '33139', '33140', '33141', '33154', '33160', '33162', '33179', '33180', '33181',
])

// Palm Beach County (added 2026-07).
export const PALM_BEACH_ZIPS: ReadonlySet<string> = new Set([
  // West Palm Beach / Palm Beach / Riviera Beach / Lake Worth
  '33401', '33402', '33403', '33404', '33405', '33406', '33407', '33408',
  '33409', '33410', '33411', '33412', '33413', '33414', '33415', '33416',
  '33417', '33418', '33419', '33420', '33421', '33422', '33424', '33425',
  '33426', '33427', '33428', '33429', '33430', '33431', '33432', '33433',
  '33434', '33435', '33436', '33437', '33438', '33439', '33440', '33444',
  '33445', '33446', '33448', '33449', '33454', '33458', '33459', '33460',
  '33461', '33462', '33463', '33465', '33466', '33467', '33468', '33469',
  '33470', '33472', '33473', '33474', '33476', '33477', '33478', '33480',
  '33481', '33482', '33483', '33484', '33486', '33487', '33488', '33493',
  '33496', '33497', '33498', '33499',
  // Jupiter / Tequesta / Palm Beach Gardens
  '33455', '33475', '33464',
])

/** Every zip we currently service: Broward + Miami-Dade + Palm Beach. */
export const SERVICE_AREA_ZIPS: ReadonlySet<string> = new Set([
  ...BROWARD_ZIPS,
  ...MIAMI_DADE_ZIPS,
  ...PALM_BEACH_ZIPS,
])

/**
 * Returns true if the zip is inside our service area
 * (Broward, Miami-Dade or Palm Beach County).
 */
export function isServiceAreaZip(zip: string): boolean {
  const trimmed = (zip ?? '').trim()
  if (!/^\d{5}$/.test(trimmed)) return false
  return SERVICE_AREA_ZIPS.has(trimmed)
}

/** @deprecated Use isServiceAreaZip — kept so older imports keep working. */
export const isBrowardZip = isServiceAreaZip
