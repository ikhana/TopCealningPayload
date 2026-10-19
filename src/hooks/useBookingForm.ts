// src/hooks/useBookingForm.ts
// Ported from TopCleaningwebsite/src/hooks/useBookingForm.ts
'use client'

import { useState, useEffect } from 'react'
import type {
  BookingFormData,
  CustomerInfo,
  SmsConsent,
  PropertySize,
  ServiceExtras,
  HandymanDetails,
  AddressInfo,
  ServiceCategory,
  FrequencyOption,
  ExtraServiceId,
} from '@/types/booking'
import { calculateTotalPrice } from '@/utilities/booking-helpers'
import { JOB_CONDITION_NONE } from '@/data/handyman'
import { HOURLY_PRIORITY_OTHER } from '@/data/hourly'
import { addOnsTotal, getAddOn, MAX_ADDON_QTY } from '@/data/addons'
import {
  isAreaPriced,
  priceRooms,
  quoteAreas,
  estimateHours,
  areaPricing,
  quoteHourlyFromState,
  normalizeHourly,
  HOURLY_MIN_CLEANERS,
  HOURLY_MIN_TOTAL_HOURS,
  DEFAULT_AREAS,
  isHourlyService,
  migrateLegacyAreas,
  DEFAULT_PROPERTY_SIZE,
  propertySize,
  sizeFromSqft,
} from '@/data/pricing'

const initialBookingData: BookingFormData = {
  customer: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: 'US',
  },
  // Both false on load. Never pre-selected: a pre-ticked consent box is Twilio
  // 30931 and invalidates the consent record regardless of what the label says.
  smsConsent: {
    service: false,
    marketing: false,
  },
  property: {
    squareFootage: 0,
    bedrooms: '',
    bathrooms: 1,
  },
  serviceExtras: {},
  handyman: {},
  specialInstructions: '',
  // Empty until the user picks on Step 2 — keeps the summary from showing a
  // service prematurely and forces an explicit choice (Step 2 validation requires it).
  serviceType: '' as ServiceCategory,
  frequency: 'one-time',
  hasChildren: false,
  hasPets: false,
  selectedExtras: [],
  extraQuantities: {},
  extraVariants: {},
  address: {
    street: '',
    city: '',
    // Always Florida — service area gated to Broward County in Step 1.
    // State field removed from Step 8 UI; set here so submit-flow validation passes.
    state: 'FL',
    zipCode: '',
  },
  serviceDate: '',
  serviceTime: '',
  pricing: {
    basePrice: 0,
    pricePerSqft: 0,
    extrasTotal: 0,
    subtotal: 0,
    discount: 0,
    total: 0,
    estimatedTime: 0,
  },
  isFirstTimeClient: false,
  accessMethod: '',
  flexibleTimes: [],
  pets: [],
  referralSource: '',
}

export interface PaymentNonce {
  dataDescriptor: string
  dataValue: string
}

// Photo upload constraints (GHL "Top Cleaning Service Media" field allows
// up to 6 files; we cap size client-side to keep uploads quick).
export const MAX_MEDIA_FILES = 6
export const MAX_MEDIA_BYTES = 10 * 1024 * 1024 // 10 MB per file

export const useBookingForm = () => {
  const [bookingData, setBookingData] = useState<BookingFormData>(initialBookingData)
  const [paymentNonce, setPaymentNonce] = useState<PaymentNonce | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [idempotencyKey, setIdempotencyKey] = useState<string | null>(null)

  // Service photos — kept OUT of bookingData so the JSON submit body stays
  // serializable. Uploaded to GHL after the booking is created (needs a contactId).
  const [mediaFiles, setMediaFiles] = useState<File[]>([])

  // Adds image files, de-duping by name+size and enforcing count/size/type limits.
  // Returns a human-readable reason if anything was rejected (for inline UI feedback).
  const addMediaFiles = (incoming: File[]): string | null => {
    let rejected: string | null = null
    setMediaFiles((prev) => {
      const next = [...prev]
      for (const file of incoming) {
        if (next.length >= MAX_MEDIA_FILES) { rejected = `Up to ${MAX_MEDIA_FILES} photos.`; break }
        if (!file.type.startsWith('image/')) { rejected = 'Images only (JPG, PNG, GIF).'; continue }
        if (file.size > MAX_MEDIA_BYTES) { rejected = 'Each photo must be under 10 MB.'; continue }
        if (next.some((f) => f.name === file.name && f.size === file.size)) continue
        next.push(file)
      }
      return next
    })
    return rejected
  }

  const removeMediaFile = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const clearMediaFiles = () => setMediaFiles([])

  const updateCustomerInfo = (data: Partial<CustomerInfo>) => {
    setBookingData((prev) => ({ ...prev, customer: { ...prev.customer, ...data } }))
  }

  const updateSmsConsent = (data: Partial<SmsConsent>) => {
    setBookingData((prev) => ({ ...prev, smsConsent: { ...prev.smsConsent, ...data } }))
  }

  const updatePropertySize = (data: Partial<PropertySize>) => {
    setBookingData((prev) => ({ ...prev, property: { ...prev.property, ...data } }))
  }

  const updateServiceExtras = (data: Partial<ServiceExtras>) => {
    setBookingData((prev) => ({ ...prev, serviceExtras: { ...prev.serviceExtras, ...data } }))
  }

  const updateHandyman = (data: Partial<HandymanDetails>) => {
    setBookingData((prev) => ({ ...prev, handyman: { ...prev.handyman, ...data } }))
  }

  // Toggle a value in one of the handyman multi-select arrays.
  const toggleHandymanMulti = (key: 'serviceTypes' | 'jobConditions', value: string) => {
    setBookingData((prev) => {
      const cur = prev.handyman[key] ?? []
      let next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]

      // "None of the above" is mutually exclusive with every real condition.
      // Selecting it drops the rest; selecting a real one drops it. Otherwise a
      // job can arrive flagged both "Urgent / same-day" and "None of the above",
      // and whoever picks up the phone has to work out which the customer meant.
      if (key === 'jobConditions' && next.includes(value)) {
        next =
          value === JOB_CONDITION_NONE
            ? [JOB_CONDITION_NONE]
            : next.filter((v) => v !== JOB_CONDITION_NONE)
      }

      return { ...prev, handyman: { ...prev.handyman, [key]: next } }
    })
  }

  const updateSpecialInstructions = (value: string) => {
    setBookingData((prev) => ({ ...prev, specialInstructions: value }))
  }

  const updateServiceType = (serviceType: ServiceCategory) => {
    setBookingData((prev) => {
      // The form opens on a starting selection (Geraldine, 2026-10-18): 1 bedroom,
      // 1 full bathroom, 1 Kitchen/Living/Dining area = $120.
      //
      // Seeded HERE, when an area-priced service is chosen, rather than in the
      // initial state. In the initial state it would also ride along on a
      // commercial or handyman booking, which has no area picker and would end up
      // with areas nobody chose in its crew note.
      //
      // "Not seeded yet" is `areas === undefined`, not "empty". A customer who
      // deliberately sets every area to zero has made a choice, and walking back
      // to this step must not quietly put the defaults back.
      const seed = isAreaPriced(serviceType) && prev.property.areas === undefined
      return {
        ...prev,
        serviceType,
        // Nothing about Custom Hourly recurs (it has no Frequency step), so a frequency left over
        // from an earlier choice must not follow the customer into it.
        frequency: isHourlyService(serviceType) ? 'one-time' : prev.frequency,
        property: seed
          ? { ...prev.property, areas: { ...DEFAULT_AREAS }, bedrooms: '1', bathrooms: 1, squareFootage: propertySize(DEFAULT_PROPERTY_SIZE)!.sqft }
          : prev.property,
        serviceExtras:
          seed && !prev.serviceExtras.propertySize
            ? { ...prev.serviceExtras, propertySize: DEFAULT_PROPERTY_SIZE }
            : prev.serviceExtras,
        // Custom Hourly opens on its smallest booking: 1 cleaner, 3 hours, $135, which is
        // the "starting price" on her spec. Seeded only once, so going back a step and
        // forward again keeps whatever the customer chose.
        customHourly:
          isHourlyService(serviceType) && !prev.customHourly
            ? {
                enabled: true,
                cleaners: HOURLY_MIN_CLEANERS,
                totalHours: HOURLY_MIN_TOTAL_HOURS,
                priorities: [],
              }
            : prev.customHourly,
      }
    })
  }

  const updateFrequency = (frequency: FrequencyOption) => {
    setBookingData((prev) => ({ ...prev, frequency }))
  }

  const toggleChildren = () => {
    setBookingData((prev) => ({ ...prev, hasChildren: !prev.hasChildren }))
  }

  const togglePets = () => {
    setBookingData((prev) => ({ ...prev, hasPets: !prev.hasPets }))
  }

  const toggleExtra = (extraId: ExtraServiceId) => {
    setBookingData((prev) => {
      const removing = prev.selectedExtras.includes(extraId)
      const selectedExtras = removing
        ? prev.selectedExtras.filter((id) => id !== extraId)
        : [...prev.selectedExtras, extraId]

      // Drop the quantity when the add-on is deselected. Leaving it behind means
      // a customer who picks 6 windows, changes their mind, then picks windows
      // again silently gets 6 back — and pays for them.
      const extraQuantities = { ...(prev.extraQuantities ?? {}) }
      if (removing) delete extraQuantities[extraId]
      else if (getAddOn(extraId)?.quantity) extraQuantities[extraId] = 1

      return { ...prev, selectedExtras, extraQuantities }
    })
  }

  const updateCustomHourly = (data: Partial<NonNullable<BookingFormData['customHourly']>>) => {
    setBookingData((prev) => {
      const merged = {
        enabled: false,
        cleaners: HOURLY_MIN_CLEANERS,
        totalHours: HOURLY_MIN_TOTAL_HOURS,
        ...(prev.customHourly ?? {}),
        ...data,
      }
      // Normalised on every write so the form cannot hold an impossible booking, e.g.
      // two cleaners on a 4-hour job. Dropping the total below 6 hours quietly puts the
      // booking back to one cleaner rather than leaving a state her rules forbid.
      const n = normalizeHourly(
        merged.totalHours ?? (merged.hoursPerCleaner ?? 0) * merged.cleaners,
        merged.cleaners,
      )
      return {
        ...prev,
        customHourly: {
          enabled: merged.enabled,
          cleaners: n.cleaners,
          totalHours: n.totalHours,
          priorities: merged.priorities ?? [],
          priorityOther: merged.priorityOther,
        },
      }
    })
  }

  // Add or remove one cleaning priority. Picking "Other" opens a text box; un-picking it
  // clears what was typed, so a stale note cannot ride along on a booking that no longer
  // lists "Other".
  const togglePriority = (value: string) => {
    setBookingData((prev) => {
      const ch = prev.customHourly ?? {
        enabled: true,
        cleaners: HOURLY_MIN_CLEANERS,
        totalHours: HOURLY_MIN_TOTAL_HOURS,
      }
      const cur = ch.priorities ?? []
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]
      return {
        ...prev,
        customHourly: {
          ...ch,
          priorities: next,
          priorityOther: next.includes(HOURLY_PRIORITY_OTHER) ? ch.priorityOther : '',
        },
      }
    })
  }

  const setExtraVariant = (extraId: ExtraServiceId, variant: string) => {
    setBookingData((prev) => ({
      ...prev,
      extraVariants: { ...(prev.extraVariants ?? {}), [extraId]: variant },
    }))
  }

  const setExtraQuantity = (extraId: ExtraServiceId, qty: number) => {
    setBookingData((prev) => ({
      ...prev,
      extraQuantities: {
        ...(prev.extraQuantities ?? {}),
        [extraId]: Math.max(1, Math.min(MAX_ADDON_QTY, Math.floor(qty) || 1)),
      },
    }))
  }

  const updateAddress = (data: Partial<AddressInfo>) => {
    setBookingData((prev) => ({ ...prev, address: { ...prev.address, ...data } }))
  }

  const updateServiceDateTime = (date: string, time: string) => {
    setBookingData((prev) => ({ ...prev, serviceDate: date, serviceTime: time }))
  }

  const toggleFirstTimeClient = () => {
    setBookingData((prev) => ({ ...prev, isFirstTimeClient: !prev.isFirstTimeClient }))
  }

  const updateAccessMethod = (method: string) => {
    setBookingData((prev) => ({ ...prev, accessMethod: method }))
  }

  const toggleFlexibleTime = (time: string) => {
    setBookingData((prev) => ({
      ...prev,
      flexibleTimes: prev.flexibleTimes.includes(time)
        ? prev.flexibleTimes.filter((t) => t !== time)
        : [...prev.flexibleTimes, time],
    }))
  }

  const togglePetType = (petType: string) => {
    setBookingData((prev) => ({
      ...prev,
      pets: prev.pets.includes(petType)
        ? prev.pets.filter((p) => p !== petType)
        : [...prev.pets, petType],
    }))
  }

  const updateReferralSource = (source: string) => {
    setBookingData((prev) => ({ ...prev, referralSource: source }))
  }

  // Bulk replace — used by resume URL hydration in Stage 9.7.3
  const setBookingDataAll = (incoming: BookingFormData) => {
    // A draft saved while Custom Hourly was a toggle on Residential (customHourly.enabled on
    // an area-priced service) becomes a Custom Hourly booking, which is what that customer
    // was in the middle of. Left alone it would resume as a Residential booking priced from
    // an area list they never filled in.
    const data: BookingFormData =
      incoming.customHourly?.enabled && isAreaPriced(incoming.serviceType)
        ? { ...incoming, serviceType: 'custom' }
        : incoming

    // A saved draft may predate the combined Kitchen/Living/Dining area. Without
    // this the customer resumes with rooms the picker no longer shows and cannot
    // remove. See migrateLegacyAreas().
    const areas = migrateLegacyAreas(data.property?.areas)

    // A draft saved before the size bands has a typed square footage and no band. Derive
    // the band from it so the customer does not resume with the size question blank (it is
    // required) or silently priced as Small.
    const needsSize = isAreaPriced(data.serviceType) && !data.serviceExtras?.propertySize
    const withSize: BookingFormData = needsSize
      ? {
          ...data,
          serviceExtras: { ...data.serviceExtras, propertySize: sizeFromSqft(data.property?.squareFootage) },
        }
      : data

    if (areas === data.property?.areas) {
      setBookingData(withSize)
      return
    }
    // bedrooms and bathrooms are derived from the areas (see handleAreasChange in
    // Step03Property) and still feed the GHL record, so recompute them too.
    setBookingData({
      ...withSize,
      property: {
        ...data.property,
        areas,
        bedrooms: String(areas?.bedroom ?? 0),
        bathrooms: (areas?.fullBathroom ?? 0) + (areas?.halfBathroom ?? 0),
      },
    })
  }

  // Recalculate pricing whenever relevant fields change
  useEffect(() => {
    const { serviceType, property, hasChildren, hasPets, frequency, isFirstTimeClient, selectedExtras } =
      bookingData

    // Area-priced services use Geraldine's model (2026-08-20):
    //   Final Price = MAX(Minimum Booking Price, Total Price of Selected Areas)
    // The legacy square-footage path below is kept only for services her sheet
    // does not cover. Without this branch both models would write `pricing` and
    // whichever ran last would win — two different prices for the same booking.
    // Custom Hourly replaces the area model outright (Geraldine, 2026-09-21:
    // "stop using the Regular/Deep Cleaning pricing completely"). No areas, no
    // add-ons, no minimum and no recurring discount — the customer is buying a
    // block of time. Checked BEFORE the area branch so it wins.
    if (isHourlyService(serviceType)) {
      const h = quoteHourlyFromState(bookingData.customHourly)
      setBookingData((prev) => ({
        ...prev,
        pricing: {
          basePrice: h.total,
          pricePerSqft: 0,
          extrasTotal: 0,
          subtotal: h.total,
          discount: 0,
          total: h.total,
          // Wall-clock hours the crew is on site, which is hours PER CLEANER —
          // not the labour-hour figure. Two cleaners for 3 hours blocks 3 hours
          // of calendar, not 6.
          estimatedTime: h.hoursPerCleaner,
        },
      }))
      return
    }

    if (isAreaPriced(serviceType)) {
      const areas = property.areas ?? {}
      const extras = bookingData.serviceExtras ?? {}
      const { tier, uplift, conditionUplift: condUplift, flatFee } = areaPricing(extras)

      const areaSubtotal = priceRooms(areas, tier)
      const extrasTotal = addOnsTotal(selectedExtras, bookingData.extraQuantities, bookingData.extraVariants)

      // Recurring discounts only — the first-time-customer discount was removed
      // from the site on Geraldine's instruction (2026-08-20). quoteAreas also
      // enforces her rule that a discount is dropped entirely if the minimum
      // would swallow it.
      const quote = quoteAreas(areas, tier, frequency, extrasTotal, uplift, flatFee)

      setBookingData((prev) => ({
        ...prev,
        pricing: {
          basePrice: areaSubtotal,
          pricePerSqft: 0,
          extrasTotal,
          subtotal: quote.subtotal,
          discount: quote.discountAmount,
          total: quote.total,
          // Condition only: the property size is already in the time estimate through
          // property.squareFootage, so adding its uplift here would count size twice.
          estimatedTime: estimateHours(areas, tier, property.squareFootage, condUplift),
        },
      }))
      return
    }

    if (property.squareFootage <= 0) return

    const pricing = calculateTotalPrice(
      serviceType,
      property.squareFootage,
      property.bathrooms,
      hasChildren,
      hasPets,
      frequency,
      isFirstTimeClient,
      selectedExtras,
    )
    setBookingData((prev) => ({ ...prev, pricing }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    bookingData.serviceType,
    bookingData.property.squareFootage,
    bookingData.property.bathrooms,
    bookingData.hasChildren,
    bookingData.hasPets,
    bookingData.frequency,
    bookingData.isFirstTimeClient,
    bookingData.selectedExtras,
    bookingData.extraQuantities,
    bookingData.extraVariants,
    bookingData.customHourly,
    // Area model inputs. Without these the price would not move when the customer
    // adds a room or switches Regular/Deep — the two things that actually change it.
    bookingData.property.areas,
    bookingData.serviceExtras?.cleaningType,
    // Home condition also moves the price — via a multiplier on the areas, or
    // by switching the whole job to the deep tier.
    bookingData.serviceExtras?.lastCleaned,
    bookingData.serviceExtras?.homeCondition,
  ])

  return {
    bookingData,
    updateCustomerInfo,
    updateSmsConsent,
    updatePropertySize,
    updateServiceExtras,
    updateHandyman,
    toggleHandymanMulti,
    updateSpecialInstructions,
    updateServiceType,
    updateFrequency,
    toggleChildren,
    togglePets,
    toggleExtra,
    setExtraQuantity,
    setExtraVariant,
    updateCustomHourly,
    togglePriority,
    updateAddress,
    updateServiceDateTime,
    toggleFirstTimeClient,
    updateAccessMethod,
    toggleFlexibleTime,
    togglePetType,
    updateReferralSource,
    setBookingDataAll,
    // Service photos
    mediaFiles,
    addMediaFiles,
    removeMediaFile,
    clearMediaFiles,
    // Payment + submission state
    paymentNonce,
    setPaymentNonce,
    isSubmitting,
    setIsSubmitting,
    submissionError,
    setSubmissionError,
    idempotencyKey,
    setIdempotencyKey,
  }
}
