// src/lib/booking/quote-request.ts
//
// Builds the submission for a CUSTOM QUOTE REQUEST: the end of the booking wizard when
// there is no automatic price (Severe Condition on a Deep clean, or an Estate-size home of
// 3,000+ sq ft). Geraldine, 2026-10-18: "Do not display an automatic cleaning price. Do not
// allow the customer to proceed with automatic booking or payment. Allow the customer to
// submit their contact information and property details so our team can review the request
// and provide a personalized estimate."
//
// It goes to /api/ghl/form-submit as audience "quote", NOT to /api/bookings/submit. That
// route creates a booking and an appointment and reserves a time on the calendar, which is
// exactly what must not happen for a job nobody has priced. form-submit stores the request
// in the enquiries collection first (so a bot flag or a CRM outage cannot lose it) and then
// syncs it to GoHighLevel as a contact and an opportunity.
//
// Client-safe: imports data tables only, nothing server-side.

import type { BookingFormData } from '@/types/booking'
import { addOnVariant, getAddOn } from '@/data/addons'
import {
  areaPricing,
  conditionLabel,
  lastCleanedLabel,
  propertySize,
  roomLabel,
  type QuoteReason,
  type RoomKey,
} from '@/data/pricing'

const REASON_LABEL: Record<QuoteReason, string> = {
  severe: 'Severe Condition (Deep Cleaning)',
  estate: 'Estate size (3,000+ sq ft)',
}

function longDate(iso: string): string {
  try {
    return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/New_York',
    })
  } catch {
    return iso
  }
}

function clockTime(slot: string): string {
  if (!slot.includes('T')) return slot
  try {
    return new Date(slot).toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/New_York',
    })
  } catch {
    return slot
  }
}

/**
 * @param files photos the customer attached on the Specs step. Sent as `files`, the same
 *              field name the booking's own photo upload uses.
 */
export function buildQuoteFormData(data: BookingFormData, files: File[], draftToken?: string): FormData {
  const fd = new FormData()
  const set = (key: string, value: string | undefined | null) => {
    if (value && value.trim()) fd.set(key, value.trim())
  }

  const { customer, address, serviceExtras: extras } = data
  const pricing = areaPricing(extras)

  fd.set('audience', 'quote')
  set('first_name', customer.firstName)
  set('last_name', customer.lastName)
  set('email', customer.email)
  set('phone', customer.phone)

  // Consent, exactly as the wizard collected it on Step 1. The server stamps the time, IP and
  // wording version itself; only the choices come from here.
  fd.set('sms_service_consent', data.smsConsent?.service ? 'yes' : 'no')
  fd.set('sms_marketing_consent', data.smsConsent?.marketing ? 'yes' : 'no')

  set('draftToken', draftToken)

  if (pricing.quoteReason) set('quote_reason', REASON_LABEL[pricing.quoteReason])
  set('service', 'Residential Cleaning')
  // The tier actually in force: a Severe condition implies Deep even if "Regular" is still
  // what the select held before the customer picked it.
  set('cleaning_type', pricing.tier === 'deep' ? 'Deep' : extras.cleaningType)
  set('property_size', propertySize(extras.propertySize)?.label)
  set('last_cleaned', lastCleanedLabel(extras.lastCleaned))
  set('home_condition', conditionLabel(pricing.condition))

  const areas = Object.entries(data.property?.areas ?? {})
    .filter(([, n]) => (n ?? 0) > 0)
    .map(([k, n]) => `${n} x ${roomLabel(k as RoomKey)}`)
    .join(', ')
  set('areas', areas)

  // Names only, never prices: there is no price to attach them to.
  const addOns = data.selectedExtras
    .map((id) => {
      const a = getAddOn(id)
      if (!a) return id
      const variant = addOnVariant(id, data.extraVariants)?.label
      const qty = a.quantity ? ` x${data.extraQuantities?.[id] ?? 1}` : ''
      return `${a.label}${variant ? ` (${variant})` : ''}${qty}`
    })
    .join(', ')
  set('add_ons', addOns)

  // Date and time are optional for a quote (the customer has not been quoted yet), but if
  // they chose a preference it is useful to the person writing the estimate.
  if (data.serviceDate) set('preferred_date', longDate(data.serviceDate))
  if (data.serviceTime) set('preferred_time', clockTime(data.serviceTime))
  if (data.flexibleTimes?.length) set('flexible_times', data.flexibleTimes.join(', '))

  set('access_method', data.accessMethod)
  set('pets', data.hasPets ? ['Yes', ...(data.pets ?? [])].join(', ') : 'No')
  set('children', data.hasChildren ? 'Yes' : 'No')
  set('referral', data.referralSource)
  set('instructions', data.specialInstructions)

  // The address twice: parts for the CRM contact record, one line for the readable note.
  set('address_street', address.street)
  set('address_apt', address.apt)
  set('address_city', address.city)
  set('address_state', address.state)
  set('address_zip', address.zipCode)
  set(
    'address',
    [address.street, address.apt ? `Apt ${address.apt}` : '', `${address.city}, ${address.state} ${address.zipCode}`]
      .filter(Boolean)
      .join(', '),
  )

  for (const f of files) fd.append('files', f)
  return fd
}
