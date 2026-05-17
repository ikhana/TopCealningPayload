import { ghlFetch } from './client'

export interface GhlCustomObjectRecord {
  id: string
  locationId: string
  properties: Record<string, unknown>
}

export interface CreateBookingRecordParams {
  locationId: string
  confirmationCode: string
  serviceType: string         // wizard value: residential, movein-out, airbnb, etc.
  serviceDate: string         // YYYY-MM-DD
  serviceTime: string         // ISO string or display string
  squareFootage: number
  bedrooms: string            // raw from Payload — we'll normalize to GHL options
  bathrooms: number
  accessMethod?: string
  bookingTotal: number
  hasPets: boolean
  hasChildren: boolean
  streetAddress: string
  city: string
  state: string
  zipCode: string
  selectedExtras: Array<{ extraId: string; label: string; price: number }>
  // Recurring series link (Stage 12.8) — null for one-time bookings
  seriesId?: string | null
  seriesOccurrence?: number | null
}

// Wizard service type → GHL custom object option key
const SERVICE_TYPE_MAP: Record<string, string> = {
  residential: 'residential',
  'movein-out': 'move_inout',
  airbnb: 'airbnb',
  commercial: 'commercial',
  renovation: 'postrenovation',
  hoarding: 'hoarding',
  custom: 'custom',
}

// Normalize bedrooms/bathrooms to GHL options: "1" | "2" | "3" | "4" | "5"
function normalizeRoomCount(input: string | number): string {
  const str = String(input).trim()
  if (!str) return '1'
  const num = parseInt(str, 10)
  if (isNaN(num) || num < 1) return '1'
  if (num >= 5) return '5'
  return String(num)
}

export async function createBookingRecord(
  params: CreateBookingRecordParams,
): Promise<GhlCustomObjectRecord> {
  const body = {
    locationId: params.locationId,
    properties: {
      // Property keys use the short name only (no `custom_objects.bookings.` prefix).
      // CHECKBOX fields require array values.
      confirmation_code: params.confirmationCode,
      service_type: SERVICE_TYPE_MAP[params.serviceType] ?? 'custom',
      service_date: params.serviceDate,
      service_time: params.serviceTime,
      square_footage: params.squareFootage,
      bedrooms: normalizeRoomCount(params.bedrooms),
      bathrooms: normalizeRoomCount(params.bathrooms),
      access_method: params.accessMethod ?? '',
      booking_total: params.bookingTotal,
      has_pets: [params.hasPets ? 'yes' : 'no'],
      has_children: [params.hasChildren ? 'yes' : 'no'],
      street_address: params.streetAddress,
      city: params.city,
      state: params.state,
      zip_code: params.zipCode,
      selected_extras: params.selectedExtras
        .map((e) => `${e.label} ($${e.price})`)
        .join(', '),
      // Stage 12.8: series link — only set when this booking is part of a recurring series
      ...(params.seriesId ? { series_id: params.seriesId } : {}),
      ...(params.seriesOccurrence ? { series_occurrence: params.seriesOccurrence } : {}),
    },
  }

  const res = await ghlFetch('/objects/custom_objects.bookings/records', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  const json = await res.json()
  return json.record ?? json
}

export async function associateBookingWithContact(params: {
  locationId: string
  bookingRecordId: string
  contactId: string
  associationId: string  // pre-fetched association schema id between contact ↔ booking
}): Promise<void> {
  // NOTE: this endpoint REQUIRES `locationId` in the body (despite some docs
  // suggesting it should not be there). The scope `associations/relation.write`
  // must be enabled on the token; otherwise GHL returns a misleading 400
  // "LocationId is not specified" or 422 instead of a clean 401.
  await ghlFetch('/associations/relations', {
    method: 'POST',
    body: JSON.stringify({
      locationId: params.locationId,
      associationId: params.associationId,
      firstRecordId: params.contactId,
      secondRecordId: params.bookingRecordId,
    }),
  })
}
