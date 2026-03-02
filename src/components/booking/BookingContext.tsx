// src/components/booking/BookingContext.tsx
// Ported from TopCleaningwebsite/src/contexts/BookingContext.tsx
'use client'

import React, { createContext, useContext } from 'react'
import { useBookingForm } from '@/hooks/useBookingForm'

const BookingContext = createContext<ReturnType<typeof useBookingForm> | undefined>(undefined)

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const bookingFormState = useBookingForm()
  return <BookingContext.Provider value={bookingFormState}>{children}</BookingContext.Provider>
}

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}
