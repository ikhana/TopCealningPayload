// src/hooks/useBookingForm.ts
// Ported from TopCleaningwebsite/src/hooks/useBookingForm.ts
'use client'

import { useState, useEffect } from 'react'
import type {
  BookingFormData,
  CustomerInfo,
  PropertySize,
  AddressInfo,
  ServiceCategory,
  FrequencyOption,
  ExtraServiceId,
} from '@/types/booking'
import { calculateTotalPrice } from '@/utilities/booking-helpers'

const initialBookingData: BookingFormData = {
  customer: {
    firstName: '',
    email: '',
    phone: '',
    countryCode: 'US',
  },
  property: {
    squareFootage: 0,
    bedrooms: '',
    bathrooms: 1,
  },
  serviceType: 'residential',
  frequency: 'one-time',
  hasChildren: false,
  hasPets: false,
  selectedExtras: [],
  address: {
    street: '',
    city: '',
    state: '',
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

export const useBookingForm = () => {
  const [bookingData, setBookingData] = useState<BookingFormData>(initialBookingData)

  const updateCustomerInfo = (data: Partial<CustomerInfo>) => {
    setBookingData((prev) => ({ ...prev, customer: { ...prev.customer, ...data } }))
  }

  const updatePropertySize = (data: Partial<PropertySize>) => {
    setBookingData((prev) => ({ ...prev, property: { ...prev.property, ...data } }))
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

  // Recalculate pricing whenever relevant fields change
  useEffect(() => {
    const { serviceType, property, hasChildren, hasPets, frequency, isFirstTimeClient, selectedExtras } =
      bookingData
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
  ])

  return {
    bookingData,
    updateCustomerInfo,
    updatePropertySize,
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
  }
}
