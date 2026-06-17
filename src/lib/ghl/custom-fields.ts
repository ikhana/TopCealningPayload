// Contact-level GHL custom field UUIDs.
// Most booking details live in the GHL Booking custom object — these contact fields
// are a denormalized "latest booking" snapshot for use in email templates that are
// triggered by contact-tag events (where appointment placeholders aren't available).
export const GHL_FIELDS = {
  confirmationCode: process.env.GHL_FIELD_CONFIRMATION_CODE ?? '',
  // Stage 8 — booking snapshot for email merge variables
  service: process.env.GHL_FIELD_SERVICE ?? '',
  serviceDate: process.env.GHL_FIELD_SERVICE_DATE ?? '',
  serviceTime: process.env.GHL_FIELD_SERVICE_TIME ?? '',
  serviceTotal: process.env.GHL_FIELD_SERVICE_TOTAL ?? '',
  // Stage 9.7.4 — resume URL for abandoned booking recovery emails
  cartResumeUrl: process.env.GHL_FIELD_CART_RESUME_URL ?? '',
  // Per-service extras (SINGLE_OPTIONS) — pushed from Step 3 based on serviceType
  cleaningType: process.env.GHL_FIELD_CLEANING_TYPE ?? '',
  typeOfSpace: process.env.GHL_FIELD_TYPE_OF_SPACE ?? '',
  propertiesManaged: process.env.GHL_FIELD_PROPERTIES_MANAGED ?? '',
  propertyType: process.env.GHL_FIELD_PROPERTY_TYPE ?? '',
  completionStatus: process.env.GHL_FIELD_COMPLETION_STATUS ?? '',
  // Special Instructions (all services) → GHL "NOTES" large-text field
  notes: process.env.GHL_FIELD_NOTES ?? '',
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
