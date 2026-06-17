// Server-side only — orchestrates: validate → persist → GHL contact → vault card → GHL appointment → GHL opportunity → confirm
import type { BookingFormData } from '@/types/booking'
import type { PaymentNonce } from '@/hooks/useBookingForm'
import { createCustomerProfile } from '@/lib/authnet/charge'
import { upsertContact } from '@/lib/ghl/contacts'
import { createAppointment } from '@/lib/ghl/appointments'
import { createOpportunity } from '@/lib/ghl/opportunities'
import { createBookingRecord, associateBookingWithContact } from '@/lib/ghl/custom-objects'
import { GHL_FIELDS } from '@/lib/ghl/custom-fields'
import { rollbackAppointment } from './rollback'
import { EXTRA_PRICES } from '@/utilities/booking-helpers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Booking } from '@/payload-types'

const EXTRA_LABELS: Record<string, string> = {
  'inside-fridge': 'Inside Fridge',
  'inside-oven': 'Inside Oven',
  'inside-cabinets': 'Inside Cabinets',
  'inside-windows': 'Inside Windows',
  baseboards: 'Baseboards',
  walls: 'Walls',
  dishes: 'Dishes',
  closets: 'Closets',
  ironing: 'Ironing',
  laundry: 'Laundry',
  organizing: 'Organizing',
  balcony: 'Balcony / Patio',
  'pet-hair': 'Pet Hair Removal',
  office: 'Office Area',
  'ceiling-fans': 'Ceiling Fans',
  chandeliers: 'Chandeliers',
  'same-day': 'Same-Day Service',
}

export interface SubmitBookingParams {
  formData: BookingFormData
  paymentNonce: PaymentNonce
  idempotencyKey: string
  userId?: string // undefined for guest checkouts
  draftToken?: string // present when the wizard had a saved draft (Stage 9.7.5)
}

export interface SubmitBookingResult {
  confirmationCode: string
  bookingId: string
  appointmentTime: string
  // If the booking is recurring, list of future occurrence start times (ISO).
  // Empty array for one-time bookings or if the frequency has no future occurrences.
  futureOccurrences: Array<{ occurrence: number; startTime: string }>
}

export class BookingValidationError extends Error {
  step: number
  field: string
  constructor(message: string, step: number, field: string) {
    super(message)
    this.name = 'BookingValidationError'
    this.step = step
    this.field = field
  }
}

export function validateBookingData(data: BookingFormData): void {
  const { customer, serviceDate, serviceTime, address, paymentConfirmed } = data as BookingFormData & { paymentConfirmed?: boolean }

  if (!customer.firstName?.trim()) throw new BookingValidationError('First name required', 1, 'firstName')
  if (!customer.email?.trim()) throw new BookingValidationError('Email required', 1, 'email')
  if (!customer.phone?.trim()) throw new BookingValidationError('Phone required', 1, 'phone')
  // Square footage is optional now (approx size). Per-service Step 3 fields are
  // enforced client-side in step-validation.ts.
  if (!serviceDate) throw new BookingValidationError('Service date required', 6, 'serviceDate')
  if (!serviceTime) throw new BookingValidationError('Service time required', 6, 'serviceTime')
  if (!address.street?.trim()) throw new BookingValidationError('Street address required', 8, 'street')
  if (!address.city?.trim()) throw new BookingValidationError('City required', 8, 'city')
  if (!address.state?.trim()) throw new BookingValidationError('State required', 8, 'state')
  if (!address.zipCode?.trim()) throw new BookingValidationError('ZIP code required', 8, 'zipCode')
}

function generateConfirmationCode(bookingId: string | number): string {
  const year = new Date().getFullYear()
  const seq = String(bookingId).slice(-4).padStart(4, '0')
  return `TC-${year}-${seq}`
}

function formatAddress(address: BookingFormData['address']): string {
  const parts = [address.street]
  if (address.apt) parts.push(`Apt ${address.apt}`)
  parts.push(`${address.city}, ${address.state} ${address.zipCode}`)
  return parts.join(', ')
}

const SERVICE_LABELS: Record<string, string> = {
  residential: 'Residential Cleaning',
  'movein-out': 'Move In/Out Cleaning',
  airbnb: 'Airbnb Cleaning',
  commercial: 'Commercial Cleaning',
  renovation: 'Post-Renovation Cleaning',
  hoarding: 'Hoarding Cleanup',
  handyman: 'Handyman Services',
  custom: 'Custom Cleaning',
}

function buildServiceTitle(data: BookingFormData): string {
  return `${SERVICE_LABELS[data.serviceType] ?? 'Cleaning Service'} — ${data.customer.firstName} ${data.customer.lastName ?? ''}`.trim()
}

// Format a YYYY-MM-DD date string into "Thursday, May 21, 2026" (US/Eastern)
function formatServiceDate(serviceDate: string): string {
  try {
    return new Date(`${serviceDate}T12:00:00Z`).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      timeZone: 'America/New_York',
    })
  } catch { return serviceDate }
}

// Format a serviceTime (ISO or "09:00 AM") into "9:00 AM" (US/Eastern)
function formatServiceTime(serviceTime: string): string {
  if (!serviceTime.includes('T')) return serviceTime // already display format like "9:00 AM"
  try {
    return new Date(serviceTime).toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true,
      timeZone: 'America/New_York',
    })
  } catch { return serviceTime }
}

export async function submitBooking(params: SubmitBookingParams): Promise<SubmitBookingResult> {
  const { formData, paymentNonce, idempotencyKey, userId, draftToken } = params

  // Step 1: Validate
  validateBookingData(formData)

  const payload = await getPayload({ config: configPromise })

  // Step 2: Check idempotency — prevent double-submit
  const existing = await payload.find({
    collection: 'bookings',
    where: { idempotencyKey: { equals: idempotencyKey } },
    limit: 1,
  })
  if (existing.docs.length > 0) {
    const prev = existing.docs[0] as Booking
    if (prev.status === 'confirmed' || prev.status === 'pending') {
      // Idempotent re-submit — re-compute the schedule so the success screen still gets it
      const prevStart = prev.serviceTime?.includes('T') ? prev.serviceTime : `${prev.serviceDate}T${prev.serviceTime}`
      const prevFutureOccurrences = computeOccurrenceSchedule(prev.frequency, prevStart)
        .map(({ occurrence, startTime: occStartTime }) => ({ occurrence, startTime: occStartTime }))
      return {
        confirmationCode: prev.confirmationCode,
        bookingId: String(prev.id),
        appointmentTime: prevStart,
        futureOccurrences: prevFutureOccurrences,
      }
    }
  }

  // Step 3a: For recurring bookings, create a BookingSeries record first.
  // This holds the series-level state (status, frequency, anchor day/time) and links
  // all occurrences together. One-time bookings get seriesId = null.
  const isRecurring = formData.frequency && formData.frequency !== 'one-time'
  let seriesId: number | null = null

  if (isRecurring) {
    const anchorDate = new Date(`${formData.serviceDate}T12:00:00`)
    const anchorDayOfWeek = anchorDate.getDay() // 0=Sunday, 6=Saturday

    // Extract HH:mm from serviceTime — it can be ISO (preferred) or "09:00 AM"
    let anchorTime = '09:00'
    if (formData.serviceTime.includes('T')) {
      // ISO like "2026-05-20T11:00:00-04:00" — pull the HH:mm in the ISO's own timezone
      anchorTime = formData.serviceTime.slice(11, 16)
    } else {
      const ampm = formData.serviceTime.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i)
      if (ampm) {
        let h = parseInt(ampm[1]!, 10)
        const m = ampm[2]!
        const meridiem = ampm[3]!.toUpperCase()
        if (meridiem === 'PM' && h !== 12) h += 12
        if (meridiem === 'AM' && h === 12) h = 0
        anchorTime = `${String(h).padStart(2, '0')}:${m}`
      }
    }

    const series = await payload.create({
      collection: 'booking-series',
      data: {
        ...(userId ? { user: parseInt(userId, 10) } : {}),
        status: 'active',
        frequency: formData.frequency as 'weekly' | 'biweekly' | '3weekly' | 'monthly' | '8weekly',
        anchorDayOfWeek,
        anchorTime,
      },
    })
    seriesId = series.id as number
  }

  // Step 3b: Create pending Booking record (linked to series if recurring)
  const selectedExtras = formData.selectedExtras.map((id) => ({
    extraId: id,
    label: EXTRA_LABELS[id] ?? id,
    price: EXTRA_PRICES[id] ?? 0,
  }))

  const pendingBooking = await payload.create({
    collection: 'bookings',
    data: {
      ...(userId ? { user: parseInt(userId, 10) } : {}),
      ...(seriesId ? { series: seriesId, seriesOccurrence: 1 } : {}),
      confirmationCode: `TC-PENDING-${idempotencyKey.slice(0, 8).toUpperCase()}`,
      serviceType: formData.serviceType,
      frequency: formData.frequency,
      serviceDate: formData.serviceDate,
      serviceTime: formData.serviceTime,
      address: formData.address,
      property: formData.property,
      selectedExtras,
      hasChildren: formData.hasChildren,
      hasPets: formData.hasPets,
      accessMethod: formData.accessMethod,
      customerNotes: '',
      pricing: {
        basePrice: formData.pricing.basePrice,
        extrasTotal: formData.pricing.extrasTotal,
        discount: formData.pricing.discount,
        total: formData.pricing.total,
        currency: 'usd',
      },
      status: 'pending',
      idempotencyKey,
    },
  })

  const bookingId = String(pendingBooking.id)
  const bookingCtx = { bookingId, idempotencyKey, userId }

  // Generate confirmation code NOW — must be on GHL contact before appointment is created
  // so the workflow email has it available when it fires on "Appointment Confirmed"
  const confirmationCode = generateConfirmationCode(pendingBooking.id)

  let ghlContactId: string | null = null
  let ghlAppointmentId: string | null = null

  try {
    // Step 4: Upsert GHL contact.
    // Most booking details live in the GHL Booking custom object, but we ALSO denormalize
    // a "latest booking" snapshot onto the contact's custom fields. This is so the
    // tag-triggered confirmation email workflow can read everything via `{{contact.*}}`
    // without complex custom-object lookups.
    const serviceName = SERVICE_LABELS[formData.serviceType] ?? 'Cleaning Service'
    const serviceDateFmt = formatServiceDate(formData.serviceDate)
    const serviceTimeFmt = formatServiceTime(formData.serviceTime)
    const serviceTotalFmt = `$${(formData.pricing.total ?? 0).toFixed(2)}`

    // Per-service extras (Step 3) — only push the ones the chosen service uses.
    const extras = formData.serviceExtras ?? {}

    const contactCustomFields = [
      GHL_FIELDS.confirmationCode && { id: GHL_FIELDS.confirmationCode, field_value: confirmationCode },
      GHL_FIELDS.service && { id: GHL_FIELDS.service, field_value: serviceName },
      GHL_FIELDS.serviceDate && { id: GHL_FIELDS.serviceDate, field_value: serviceDateFmt },
      GHL_FIELDS.serviceTime && { id: GHL_FIELDS.serviceTime, field_value: serviceTimeFmt },
      GHL_FIELDS.serviceTotal && { id: GHL_FIELDS.serviceTotal, field_value: serviceTotalFmt },
      GHL_FIELDS.cleaningType && extras.cleaningType && { id: GHL_FIELDS.cleaningType, field_value: extras.cleaningType },
      GHL_FIELDS.typeOfSpace && extras.typeOfSpace && { id: GHL_FIELDS.typeOfSpace, field_value: extras.typeOfSpace },
      GHL_FIELDS.propertiesManaged && extras.propertiesManaged && { id: GHL_FIELDS.propertiesManaged, field_value: extras.propertiesManaged },
      GHL_FIELDS.propertyType && extras.propertyType && { id: GHL_FIELDS.propertyType, field_value: extras.propertyType },
      GHL_FIELDS.completionStatus && extras.completionStatus && { id: GHL_FIELDS.completionStatus, field_value: extras.completionStatus },
    ].filter(Boolean) as Array<{ id: string; field_value: string }>

    const ghlContact = await upsertContact({
      firstName: formData.customer.firstName,
      lastName: formData.customer.lastName,
      email: formData.customer.email,
      phone: formData.customer.phone,
      locationId: process.env.GHL_LOCATION_ID!,
      customFields: contactCustomFields,
    })
    ghlContactId = ghlContact.id

    // Step 5: Vault card (skipped when payment is disabled or in test mode)
    const paymentDisabled = process.env.PAYMENT_ENABLED !== 'true'
    const isTestMode = process.env.BOOKING_TEST_MODE === 'true' || paymentNonce.dataDescriptor === 'TEST_MODE' || paymentNonce.dataDescriptor === 'PAYMENT_DISABLED'
    const profile = (paymentDisabled || isTestMode)
      ? { customerProfileId: null, paymentProfileId: null }
      : await createCustomerProfile({
          opaqueData: { dataDescriptor: paymentNonce.dataDescriptor, dataValue: paymentNonce.dataValue },
          email: formData.customer.email,
          merchantCustomerId: userId ?? formData.customer.email,
        })

    // Step 6: Create GHL appointment (first occurrence)
    const startTime = buildIsoDateTime(formData.serviceDate, formData.serviceTime)
    const estimatedHours = (formData.pricing as { estimatedTime?: number }).estimatedTime ?? 2
    const endTime = addHours(startTime, estimatedHours)
    const appointmentTitle = buildServiceTitle(formData)
    const appointmentAddress = formatAddress(formData.address)
    const appointmentNotes = formData.accessMethod ? `Access: ${formData.accessMethod}` : undefined

    const ghlAppointment = await createAppointment({
      calendarId: process.env.GHL_CALENDAR_ID!,
      locationId: process.env.GHL_LOCATION_ID!,
      contactId: ghlContactId,
      startTime,
      endTime,
      title: appointmentTitle,
      address: appointmentAddress,
      notes: appointmentNotes,
    })
    ghlAppointmentId = ghlAppointment.id

    // Step 6b: Schedule recurring appointments + create Payload records for each occurrence
    // (fire-and-forget — don't fail booking if recurring scheduling fails)
    if (seriesId) {
      scheduleRecurringAppointments({
        frequency: formData.frequency,
        firstStartTime: startTime,
        estimatedHours,
        calendarId: process.env.GHL_CALENDAR_ID!,
        locationId: process.env.GHL_LOCATION_ID!,
        contactId: ghlContactId,
        title: appointmentTitle,
        address: appointmentAddress,
        notes: appointmentNotes,
        // Payload Booking creation context — each successful GHL appointment also gets a Payload record
        payload,
        seriesId,
        userId,
        formData,
        selectedExtras,
        idempotencyKey,
      }).catch((err) => console.error('[booking:recurring] Unexpected error', err))
    }

    // Step 7: Create GHL opportunity in the Cleaning Booked stage —
    // website bookings represent a confirmed appointment, not a lead-in-funnel.
    const ghlOpportunity = await createOpportunity({
      pipelineId: process.env.GHL_PIPELINE_ID!,
      locationId: process.env.GHL_LOCATION_ID!,
      pipelineStageId: process.env.GHL_PIPELINE_STAGE_CLEANING_BOOKED!,
      contactId: ghlContactId,
      name: appointmentTitle,
      monetaryValue: formData.pricing.total,
    })

    // Step 7b: Create GHL Booking custom object record (non-blocking — log + continue on failure)
    let ghlBookingObjectId: string | null = null
    try {
      const bookingRecord = await createBookingRecord({
        locationId: process.env.GHL_LOCATION_ID!,
        confirmationCode,
        serviceType: formData.serviceType,
        serviceDate: formData.serviceDate,
        serviceTime: formData.serviceTime,
        squareFootage: formData.property.squareFootage,
        bedrooms: formData.property.bedrooms ?? '',
        bathrooms: formData.property.bathrooms ?? 1,
        accessMethod: formData.accessMethod,
        bookingTotal: formData.pricing.total,
        hasPets: formData.hasPets,
        hasChildren: formData.hasChildren,
        streetAddress: formData.address.street,
        city: formData.address.city,
        state: formData.address.state,
        zipCode: formData.address.zipCode,
        selectedExtras: selectedExtras,
        // Stage 12.8: link this record to the series (null/undefined for one-time bookings)
        seriesId: seriesId ? String(seriesId) : null,
        seriesOccurrence: seriesId ? 1 : null,
      })
      ghlBookingObjectId = bookingRecord.id

      // Link the booking record to the contact (so it shows under the contact's Related Records)
      const associationId = process.env.GHL_ASSOCIATION_CONTACT_BOOKING
      if (associationId && ghlContactId) {
        try {
          await associateBookingWithContact({
            locationId: process.env.GHL_LOCATION_ID!,
            bookingRecordId: bookingRecord.id,
            contactId: ghlContactId,
            associationId,
          })
        } catch (assocErr) {
          console.error('[booking:custom-object] Failed to associate booking with contact', {
            bookingId,
            confirmationCode,
            bookingRecordId: bookingRecord.id,
            contactId: ghlContactId,
            error: assocErr instanceof Error ? assocErr.message : String(assocErr),
          })
        }
      }
    } catch (err) {
      console.error('[booking:custom-object] Failed to create booking record', {
        bookingId,
        confirmationCode,
        error: err instanceof Error ? err.message : String(err),
      })
    }

    // Step 8: Confirm booking
    // Note: confirmationCode was generated before this block and already written to GHL contact
    await payload.update({
      collection: 'bookings',
      id: pendingBooking.id,
      data: {
        confirmationCode,
        status: 'confirmed',
        ghlContactId,
        ghlAppointmentId,
        ghlOpportunityId: ghlOpportunity.id,
        ...(ghlBookingObjectId ? { ghlBookingObjectId } : {}),
        ...(profile.customerProfileId ? { authnetCustomerProfileId: profile.customerProfileId } : {}),
        ...(profile.paymentProfileId ? { authnetPaymentProfileId: profile.paymentProfileId } : {}),
      },
    })

    // Step 8b: Tag the contact for downstream GHL workflows.
    // - `booking-confirmed`: triggers confirmation email; exits abandoned-recovery sequence
    // - `recurring-customer`: marks contact as in a recurring series (Stage 12.7)
    // - `frequency-<weekly|biweekly|...>`: lets workflows target specific cadences
    // Non-blocking — if tagging fails, the booking is still complete.
    const contactTags = ['booking-confirmed']
    if (formData.frequency && formData.frequency !== 'one-time') {
      contactTags.push('recurring-customer', `frequency-${formData.frequency}`)
    }
    upsertContact({
      firstName: formData.customer.firstName,
      lastName: formData.customer.lastName,
      email: formData.customer.email,
      phone: formData.customer.phone,
      locationId: process.env.GHL_LOCATION_ID!,
      tags: contactTags,
    }).catch((err) => {
      console.error('[booking:tag] Failed to add post-booking tags', {
        bookingId,
        confirmationCode,
        tags: contactTags,
        error: err instanceof Error ? err.message : String(err),
      })
    })

    // Compute the future occurrence schedule for the success screen (deterministic, no API calls)
    const futureOccurrences = computeOccurrenceSchedule(formData.frequency, startTime)
      .map(({ occurrence, startTime: occStartTime }) => ({ occurrence, startTime: occStartTime }))

    // Stage 9.7.5 — mark the draft as converted so it won't be hydrated again
    // and the abandonment workflow exits via the booking-confirmed goal.
    // Awaited (not fire-and-forget) so the update reliably completes before
    // the response returns. A failed update is logged but never fails the
    // booking — best-effort with visibility.
    if (draftToken) {
      try {
        const draftRes = await payload.find({
          collection: 'booking-drafts',
          where: { token: { equals: draftToken } },
          limit: 1,
          depth: 0,
        })
        if (draftRes.docs.length > 0) {
          await payload.update({
            collection: 'booking-drafts',
            id: draftRes.docs[0].id,
            data: { convertedToBookingId: bookingId },
          })
        } else {
          console.warn('[booking:draft] No draft found for token', { draftToken, bookingId })
        }
      } catch (err) {
        console.error('[booking:draft] Failed to mark draft converted', {
          draftToken,
          bookingId,
          error: err instanceof Error ? err.message : String(err),
        })
      }
    }

    return { confirmationCode, bookingId, appointmentTime: startTime, futureOccurrences }

  } catch (err) {
    await payload.update({
      collection: 'bookings',
      id: pendingBooking.id,
      data: {
        status: 'cancelled',
        failureReason: err instanceof Error ? err.message : String(err),
      },
    }).catch(() => {})

    // If we created a series for this booking, mark it cancelled too — the series
    // can't exist as 'active' if its first occurrence never made it through.
    if (seriesId) {
      await payload.update({
        collection: 'booking-series',
        id: seriesId,
        data: {
          status: 'cancelled',
          cancelledAt: new Date().toISOString(),
          cancellationReason: `First occurrence failed: ${err instanceof Error ? err.message : String(err)}`,
        },
      }).catch(() => {})
    }

    // Rollback GHL appointment if it was created (no charge to refund — card was only vaulted)
    if (ghlAppointmentId) {
      await rollbackAppointment({ appointmentId: ghlAppointmentId, bookingContext: bookingCtx })
    }

    throw err
  }
}

function buildIsoDateTime(date: string, timeSlot: string): string {
  // date: YYYY-MM-DD, timeSlot: "09:00 AM" or ISO string from GHL
  if (timeSlot.includes('T')) return timeSlot  // already ISO
  const tz = process.env.GHL_CALENDAR_TIMEZONE ?? 'America/New_York'
  // Parse "09:00 AM" into 24h
  const match = timeSlot.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i)
  if (!match) return `${date}T${timeSlot}:00`
  let hours = parseInt(match[1]!, 10)
  const minutes = match[2]!
  const meridiem = match[3]!.toUpperCase()
  if (meridiem === 'PM' && hours !== 12) hours += 12
  if (meridiem === 'AM' && hours === 12) hours = 0
  const h = String(hours).padStart(2, '0')
  // Return without tz offset — GHL interprets in the calendar's timezone
  return `${date}T${h}:${minutes}:00`
}

function addHours(isoString: string, hours: number): string {
  const ms = new Date(isoString).getTime() + hours * 3600 * 1000
  return new Date(ms).toISOString().replace(/\.\d{3}Z$/, '')
}

function addDaysToIso(iso: string, days: number): string {
  const datePart = iso.slice(0, 10)
  const timePart = iso.slice(10)
  const d = new Date(`${datePart}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10) + timePart
}

// How many ADDITIONAL appointments to create after the first, and at what interval.
// Note: GHL's calendar has `allowBookingFor: 60` days hard limit. Any occurrence
// past that window is automatically skipped at runtime (see check below).
// Example: 3weekly's 3rd future occurrence is +63 days — past the window, skipped.
const RECURRENCE: Record<string, { intervalDays: number; count: number }> = {
  weekly:   { intervalDays: 7,  count: 3 }, // +7, +14, +21 days
  biweekly: { intervalDays: 14, count: 3 }, // +14, +28, +42 days
  '3weekly':{ intervalDays: 21, count: 3 }, // +21, +42, +63 (+63 silently skipped — past 60d window)
  monthly:  { intervalDays: 28, count: 2 }, // +28, +56 days
  '8weekly':{ intervalDays: 56, count: 1 }, // +56 days
}

// GHL calendar's allowBookingFor (set in calendar config). Keep this in sync.
const GHL_BOOKING_WINDOW_DAYS = 60

/**
 * Pure function: compute which future occurrences WOULD be scheduled for a given
 * frequency + first start time. Window-caps to GHL_BOOKING_WINDOW_DAYS.
 * No API calls — used by both the recurring scheduler AND the success screen.
 */
function computeOccurrenceSchedule(
  frequency: string,
  firstStartTime: string,
): Array<{ occurrence: number; startTime: string; daysOut: number }> {
  const rule = RECURRENCE[frequency]
  if (!rule) return []

  const nowMs = Date.now()
  const firstStartMs = new Date(firstStartTime).getTime()
  const result: Array<{ occurrence: number; startTime: string; daysOut: number }> = []

  for (let i = 0; i < rule.count; i++) {
    const occurrence = i + 2 // 1 is the main booking
    const daysOut = rule.intervalDays * (i + 1)
    const futureStartMs = firstStartMs + daysOut * 24 * 60 * 60 * 1000
    const daysFromNow = (futureStartMs - nowMs) / (1000 * 60 * 60 * 24)

    if (daysFromNow > GHL_BOOKING_WINDOW_DAYS) continue

    result.push({ occurrence, startTime: addDaysToIso(firstStartTime, daysOut), daysOut })
  }

  return result
}

async function scheduleRecurringAppointments(params: {
  frequency: string
  firstStartTime: string
  estimatedHours: number
  calendarId: string
  locationId: string
  contactId: string
  title: string
  address: string
  notes?: string
  // Payload context — each successful GHL appointment also gets a Payload Booking record
  payload: Awaited<ReturnType<typeof getPayload>>
  seriesId: number
  userId?: string
  formData: BookingFormData
  selectedExtras: Array<{ extraId: string; label: string; price: number }>
  idempotencyKey: string
}): Promise<void> {
  // Shared helper computes which occurrences are in-window (DRY with computeOccurrenceSchedule)
  const inWindow = computeOccurrenceSchedule(params.frequency, params.firstStartTime)
  const occurrences = inWindow.map(({ occurrence, startTime, daysOut }) => ({
    occurrence,
    daysOut,
    startTime,
    endTime: addHours(startTime, params.estimatedHours),
  }))

  // Diagnostic log — how many were window-capped
  const rule = RECURRENCE[params.frequency]
  if (rule && occurrences.length < rule.count) {
    console.log(`[booking:recurring] ${rule.count - occurrences.length} occurrence(s) skipped (past ${GHL_BOOKING_WINDOW_DAYS}d window)`)
  }

  // For each occurrence: create GHL appointment first, then Payload Booking linked to series
  for (const occ of occurrences) {
    try {
      // 1. Create the GHL appointment
      const ghlAppt = await createAppointment({
        calendarId: params.calendarId,
        locationId: params.locationId,
        contactId: params.contactId,
        startTime: occ.startTime,
        endTime: occ.endTime,
        title: params.title,
        address: params.address,
        notes: params.notes,
      })

      // 2. Create the paired Payload Booking record
      try {
        const serviceDate = occ.startTime.slice(0, 10) // YYYY-MM-DD
        const occurrenceIdempotencyKey = `${params.idempotencyKey}-occ${occ.occurrence}`

        const pendingOccurrence = await params.payload.create({
          collection: 'bookings',
          data: {
            ...(params.userId ? { user: parseInt(params.userId, 10) } : {}),
            series: params.seriesId,
            seriesOccurrence: occ.occurrence,
            confirmationCode: `TC-PENDING-${occurrenceIdempotencyKey.slice(0, 12).toUpperCase()}`,
            serviceType: params.formData.serviceType,
            frequency: params.formData.frequency,
            serviceDate,
            serviceTime: occ.startTime,
            address: params.formData.address,
            property: params.formData.property,
            selectedExtras: params.selectedExtras,
            hasChildren: params.formData.hasChildren,
            hasPets: params.formData.hasPets,
            accessMethod: params.formData.accessMethod,
            customerNotes: '',
            pricing: {
              basePrice: params.formData.pricing.basePrice,
              extrasTotal: params.formData.pricing.extrasTotal,
              discount: params.formData.pricing.discount,
              total: params.formData.pricing.total,
              currency: 'usd',
            },
            status: 'confirmed',
            ghlAppointmentId: ghlAppt.id,
            idempotencyKey: occurrenceIdempotencyKey,
          },
        })

        // Update with the real confirmation code (uses the new booking's id)
        await params.payload.update({
          collection: 'bookings',
          id: pendingOccurrence.id,
          data: { confirmationCode: generateConfirmationCode(pendingOccurrence.id) },
        })
      } catch (payloadErr) {
        // GHL appointment exists but Payload record failed — log so we can reconcile manually
        console.error(`[booking:recurring] Payload booking creation failed for occurrence ${occ.occurrence}`, {
          ghlAppointmentId: ghlAppt.id,
          seriesId: params.seriesId,
          error: payloadErr instanceof Error ? payloadErr.message : String(payloadErr),
        })
      }
    } catch (ghlErr) {
      const err = ghlErr as { status?: number; body?: unknown; message?: string }
      console.error(`[booking:recurring] Appointment ${occ.occurrence} failed`, {
        status: err?.status,
        message: err?.message,
        body: JSON.stringify(err?.body),
      })
    }
  }
}
