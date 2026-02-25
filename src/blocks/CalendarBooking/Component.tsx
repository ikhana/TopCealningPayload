// src/blocks/CalendarBooking/Component.tsx
import type { CalendarBookingBlock as CalendarBookingBlockType } from '@/payload-types'
import React from 'react'
import { CalendarBookingClient } from './Component.client'

export const CalendarBookingBlock: React.FC<CalendarBookingBlockType & { id?: string }> = (props) => {
  return <CalendarBookingClient {...props} />
}