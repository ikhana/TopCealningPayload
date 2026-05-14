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
}

export interface SubmitBookingResult {
  confirmationCode: string
  bookingId: string
  appointmentTime: string
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
  const { customer, property, serviceDate, serviceTime, address, paymentConfirmed } = data as BookingFormData & { paymentConfirmed?: boolean }

  if (!customer.firstName?.trim()) throw new BookingValidationError('First name required', 1, 'firstName')
  if (!customer.email?.trim()) throw new BookingValidationError('Email required', 1, 'email')
  if (!customer.phone?.trim()) throw new BookingValidationError('Phone required', 1, 'phone')
  if (!property.squareFootage || property.squareFootage <= 0) throw new BookingValidationError('Square footage required', 3, 'squareFootage')
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

function buildServiceTitle(data: BookingFormData): string {
  const serviceLabels: Record<string, string> = {
    residential: 'Residential Cleaning',
    'movein-out': 'Move In/Out Cleaning',
    airbnb: 'Airbnb Cleaning',
    commercial: 'Commercial Cleaning',
    renovation: 'Post-Renovation Cleaning',
    hoarding: 'Hoarding Cleanup',
    custom: 'Custom Cleaning',
  }
  return `${serviceLabels[data.serviceType] ?? 'Cleaning Service'} — ${data.customer.firstName} ${data.customer.lastName ?? ''}`.trim()
}

export async function submitBooking(params: SubmitBookingParams): Promise<SubmitBookingResult> {
  const { formData, paymentNonce, idempotencyKey, userId } = params

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
      return {
        confirmationCode: prev.confirmationCode,
        bookingId: String(prev.id),
        appointmentTime: `${prev.serviceDate}T${prev.serviceTime}`,
      }
    }
  }

  // Step 3: Create pending Booking record
  const selectedExtras = formData.selectedExtras.map((id) => ({
    extraId: id,
    label: EXTRA_LABELS[id] ?? id,
    price: EXTRA_PRICES[id] ?? 0,
  }))

  const pendingBooking = await payload.create({
    collection: 'bookings',
    data: {
      ...(userId ? { user: parseInt(userId, 10) } : {}),
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
    // Step 4: Upsert GHL contact — booking details live in the GHL Booking custom object,
    // so the only contact custom field we set is the confirmation code (needed by workflow emails)
    const contactCustomFields = GHL_FIELDS.confirmationCode
      ? [{ id: GHL_FIELDS.confirmationCode, field_value: confirmationCode }]
      : []

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

    // Step 6b: Schedule recurring appointments (fire-and-forget — don't fail booking if extras fail)
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
    }).catch((err) => console.error('[booking:recurring] Unexpected error', err))

    // Step 7: Create GHL opportunity (Booked stage)
    const ghlOpportunity = await createOpportunity({
      pipelineId: process.env.GHL_PIPELINE_ID!,
      locationId: process.env.GHL_LOCATION_ID!,
      pipelineStageId: process.env.GHL_PIPELINE_STAGE_BOOKED!,
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

    return { confirmationCode, bookingId, appointmentTime: startTime }

  } catch (err) {
    await payload.update({
      collection: 'bookings',
      id: pendingBooking.id,
      data: {
        status: 'cancelled',
        failureReason: err instanceof Error ? err.message : String(err),
      },
    }).catch(() => {})

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

// How many ADDITIONAL appointments to create after the first, and at what interval
const RECURRENCE: Record<string, { intervalDays: number; count: number }> = {
  weekly:   { intervalDays: 7,  count: 3 }, // 4 total (1 month)
  biweekly: { intervalDays: 14, count: 3 }, // 4 total (2 months)
  '3weekly':{ intervalDays: 21, count: 3 }, // 4 total (3 months)
  monthly:  { intervalDays: 28, count: 2 }, // 3 total (3 months)
  '8weekly':{ intervalDays: 56, count: 1 }, // 2 total
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
}): Promise<void> {
  const rule = RECURRENCE[params.frequency]
  if (!rule) return

  const { intervalDays, count } = rule

  const tasks = Array.from({ length: count }, (_, i) => {
    const startTime = addDaysToIso(params.firstStartTime, intervalDays * (i + 1))
    const endTime = addHours(startTime, params.estimatedHours)
    return createAppointment({
      calendarId: params.calendarId,
      locationId: params.locationId,
      contactId: params.contactId,
      startTime,
      endTime,
      title: params.title,
      address: params.address,
      notes: params.notes,
    })
  })

  const results = await Promise.allSettled(tasks)
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      const err = r.reason as { status?: number; body?: unknown; message?: string }
      console.error(`[booking:recurring] Appointment ${i + 2} failed`, {
        status: err?.status,
        message: err?.message,
        body: JSON.stringify(err?.body),
      })
    }
  })
}
