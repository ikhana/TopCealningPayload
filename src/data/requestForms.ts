// src/data/requestForms.ts
//
// The two short request-only forms (Geraldine, 2026-10-18): Airbnb and Commercial.
//
// Neither has an automatic price, a deposit, or a property address. Each collects a handful
// of required answers and sends a "Request a Custom Quote". They ride the existing quote path
// (/api/ghl/form-submit, audience 'quote') so they are stored first, spam screened and synced
// to GoHighLevel the same way as a Severe Condition or Estate quote.
//
// Commercial deliberately has NO medical or restaurant space type: "we're not offering those
// yet". Add them here, and nowhere else, when she says so.

export type RequestFormKind = 'airbnb' | 'commercial'

/** Display labels, matching the booking wizard's service labels (and so the GHL Service field). */
export const REQUEST_FORM_SERVICE_LABEL: Record<RequestFormKind, string> = {
  airbnb: 'AirBnB Special',
  commercial: 'Commercial Office',
}

export const REQUEST_FORM_TITLE: Record<RequestFormKind, string> = {
  airbnb: 'Request a Custom Airbnb Quote',
  commercial: 'Request a Custom Commercial Quote',
}

export const REQUEST_FORM_BUTTON = 'Request a Custom Quote'

export const COMMERCIAL_SPACE_TYPES = [
  'Office / Corporate Space',
  'Car Dealership / Showroom',
  'Fitness / Pilates / Yoga Studio',
  'Retail Store',
  'Other Commercial Space',
] as const

export const COMMERCIAL_FREQUENCIES = [
  'Daily',
  'Several times per week',
  'Weekly',
  'Bi-weekly',
  'One-time',
  'Not sure yet',
] as const
