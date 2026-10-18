// src/data/hourly.ts
//
// What a Custom Hourly Cleaning customer is asked, apart from the price. The price rules
// (rates, the 3-hour minimum, one or two cleaners) live in src/data/pricing.ts.
//
// Geraldine, 2026-10-18, "3. SELECT CLEANING PRIORITIES": customers must select the areas
// they want the cleaners to focus on, from this list, plus a free-text question.
//
// The strings are written verbatim into a GoHighLevel MULTIPLE_OPTIONS field
// (contact.cleaning_priorities). GHL silently drops a value the field does not list, so
// .seed/ghl-provision.ts syncs the field's options from this array. Edit here, then run it.

/** The one option that opens a free-text box. */
export const HOURLY_PRIORITY_OTHER = 'Other (please specify)'

export const HOURLY_PRIORITIES = [
  'Kitchen',
  'Bathrooms',
  'Bedrooms',
  'Living Room',
  'Dining Room',
  'Hallways / Common Areas',
  'Laundry Room',
  HOURLY_PRIORITY_OTHER,
] as const

/** Her wording for the text box under the priorities. */
export const HOURLY_FOCUS_QUESTION = "Is there anything specific you'd like our cleaners to focus on?"
