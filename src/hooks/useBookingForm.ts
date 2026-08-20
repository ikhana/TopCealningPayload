// src/hooks/useBookingForm.ts
// Ported from TopCleaningwebsite/src/hooks/useBookingForm.ts
'use client'

import { useState, useEffect } from 'react'
import type {
  BookingFormData,
  CustomerInfo,
  PropertySize,
  ServiceExtras,
  HandymanDetails,
  AddressInfo,
  ServiceCategory,
  FrequencyOption,
  ExtraServiceId,
} from '@/types/booking'
import { calculateTotalPrice, EXTRA_PRICES } from '@/utilities/booking-helpers'
import {
  isAreaPriced,
  priceRooms,
  estimateHours,
  MINIMUM_BOOKING,
  type CleaningTier,
} from '@/data/pricing'

const initialBookingData: BookingFormData = {
  customer: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: 'US',
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
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]
      return { ...prev, handyman: { ...prev.handyman, [key]: next } }
    })
  }

  const updateSpecialInstructions = (value: string) => {
    setBookingData((prev) => ({ ...prev, specialInstructions: value }))
  }

  const updateServiceType = (serviceType: ServiceCategory) => {
    setBookingData((prev) => ({ ...prev, serviceType }))
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
    setBookingData((prev) => ({
      ...prev,
      selectedExtras: prev.selectedExtras.includes(extraId)
        ? prev.selectedExtras.filter((id) => id !== extraId)
        : [...prev.selectedExtras, extraId],
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
  const setBookingDataAll = (data: BookingFormData) => {
    setBookingData(data)
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
    if (isAreaPriced(serviceType)) {
      const areas = property.areas ?? {}
      const tier: CleaningTier =
        bookingData.serviceExtras?.cleaningType === 'Deep' ? 'deep' : 'regular'

      const areaSubtotal = priceRooms(areas, tier)
      const extrasTotal = selectedExtras.reduce((sum, id) => sum + (EXTRA_PRICES[id] ?? 0), 0)
      const subtotal = areaSubtotal + extrasTotal
      const minimum = MINIMUM_BOOKING[tier]

      // NOTE: no frequency or first-time discount applied here. Her formula does
      // not mention either, and quietly discounting below her stated minimum
      // would give away margin she did not agree to. Open question for her.
      setBookingData((prev) => ({
        ...prev,
        pricing: {
          basePrice: areaSubtotal,
          pricePerSqft: 0,
          extrasTotal,
          subtotal,
          discount: 0,
          total: Math.max(minimum, subtotal),
          estimatedTime: estimateHours(areas, tier, property.squareFootage),
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
    // Area model inputs. Without these the price would not move when the customer
    // adds a room or switches Regular/Deep — the two things that actually change it.
    bookingData.property.areas,
    bookingData.serviceExtras?.cleaningType,
  ])

  return {
    bookingData,
    updateCustomerInfo,
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
