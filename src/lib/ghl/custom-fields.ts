// Contact-level GHL custom field UUIDs.
// Booking details (sqft, bedrooms, service type, frequency, etc.) live in the GHL Booking
// custom object — they do NOT need to be contact custom fields.
// Only the confirmation code is written to the contact so workflow emails can include it.
export const GHL_FIELDS = {
  confirmationCode: process.env.GHL_FIELD_CONFIRMATION_CODE ?? '',
} as const

export type GhlFieldKey = keyof typeof GHL_FIELDS

// Returns only fields that have a configured UUID (safe to send to GHL)
export function buildCustomFields(
  _data: Record<string, unknown> = {},
): Array<{ id: string; field_value: string | number }> {
  // Booking details are stored in the GHL Booking custom object, not contact fields.
  // This function is retained for the confirmation-code merge in submit-flow.
  return []
}
