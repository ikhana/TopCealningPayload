// UUID map for GHL custom fields — populate after Phase 1a (GHL sub-account access)
// Each value is the UUID from GHL's custom fields settings
export const GHL_FIELDS = {
  squareFootage:    process.env.GHL_FIELD_SQFT ?? '',
  bedrooms:         process.env.GHL_FIELD_BEDROOMS ?? '',
  bathrooms:        process.env.GHL_FIELD_BATHROOMS ?? '',
  serviceType:      process.env.GHL_FIELD_SERVICE_TYPE ?? '',
  frequency:        process.env.GHL_FIELD_FREQUENCY ?? '',
  accessMethod:     process.env.GHL_FIELD_ACCESS ?? '',
  hasPets:          process.env.GHL_FIELD_PETS ?? '',
  flexibleTimes:    process.env.GHL_FIELD_FLEX_TIMES ?? '',
  referralSource:   process.env.GHL_FIELD_REFERRAL ?? '',
  confirmationCode: process.env.GHL_FIELD_CONFIRMATION_CODE ?? '',
} as const

export type GhlFieldKey = keyof typeof GHL_FIELDS

// Returns only fields that have a configured UUID (safe to send to GHL)
export function buildCustomFields(
  data: Partial<Record<GhlFieldKey, string | number>>,
): Array<{ id: string; field_value: string | number }> {
  return Object.entries(data)
    .filter(([key, value]) => {
      const fieldId = GHL_FIELDS[key as GhlFieldKey]
      return fieldId && value !== undefined && value !== null && value !== ''
    })
    .map(([key, value]) => ({
      id: GHL_FIELDS[key as GhlFieldKey],
      field_value: value as string | number,
    }))
}
