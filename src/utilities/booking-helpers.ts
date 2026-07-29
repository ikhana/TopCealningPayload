// src/utilities/booking-helpers.ts
// Ported from TopCleaningwebsite/src/utils/booking-helpers.ts

import type { ServiceCategory, FrequencyOption, ExtraServiceId } from '@/types/booking'

/** Florida Minimum Wage as of 2025 */
export const MINIMUM_WAGE = 13

/** Service type percentage ranges (based on minimum wage) */
export const SERVICE_PERCENTAGES: Record<ServiceCategory, number | { min: number; max: number }> = {
  residential: { min: 0.01, max: 0.02 }, // 1–2%
  'movein-out': 0.02,
  airbnb: 0.02,
  custom: 0.02,
  commercial: 0.02,
  renovation: 0.02,
  hoarding: { min: 0.02, max: 0.06 }, // 2–6%
  handyman: 0.02,
}

/** Price modifiers for different frequency options (per sq ft) */
export const FREQUENCY_ADJUSTMENTS: Record<FrequencyOption, number> = {
  'one-time': 0,
  weekly: 0,
  biweekly: 0.02,
  '3weekly': 0.035,
  monthly: 0.05,
  '8weekly': 0.05,
}

export const CHILDREN_MODIFIER = 0.01
export const PETS_MODIFIER = 0.01
export const BOTH_MODIFIER = 0.02
export const FIRST_TIME_DISCOUNT = 0.15

/** Extra service fixed prices */
export const EXTRA_PRICES: Record<string, number> = {
  'inside-fridge': 30,
  'inside-oven': 35,
  'inside-cabinets': 35,
  'inside-windows': 30,
  baseboards: 25,
  walls: 35,
  dishes: 25,
  closets: 45,
  ironing: 35,
  laundry: 30,
  organizing: 45,
  balcony: 40,
  'pet-hair': 30,
  office: 35,
  'ceiling-fans': 25,
  chandeliers: 35,
  'same-day': 40,
}

/** Legacy base prices (fallback) */
export const BASE_PRICES: Record<string, number> = {
  residential: 120,
  'movein-out': 180,
  airbnb: 150,
  custom: 120,
  commercial: 200,
  renovation: 220,
  hoarding: 250,
  handyman: 150,
}

/** Calculate price per square foot */
export const calculatePricePerSqft = (
  serviceType: ServiceCategory,
  hasChildren: boolean,
  hasPets: boolean,
  frequency: FrequencyOption,
): number => {
  let basePercentage: number
  const servicePercent = SERVICE_PERCENTAGES[serviceType]

  if (typeof servicePercent === 'object') {
    basePercentage = hasChildren || hasPets ? servicePercent.max : servicePercent.min
  } else {
    basePercentage = servicePercent
  }

  let pricePerSqft = MINIMUM_WAGE * basePercentage

  if (hasChildren && hasPets) {
    pricePerSqft += BOTH_MODIFIER
  } else if (hasChildren) {
    pricePerSqft += CHILDREN_MODIFIER
  } else if (hasPets) {
    pricePerSqft += PETS_MODIFIER
  }

  pricePerSqft += FREQUENCY_ADJUSTMENTS[frequency]
  return pricePerSqft
}

/** Estimate cleaning time based on sq footage + extras */
export const calculateEstimatedTime = (squareFootage: number, extras: ExtraServiceId[]): number => {
  const baseTime = Math.max(2, squareFootage / 500)
  const extraTime = extras.length * 0.5
  return Math.ceil((baseTime + extraTime) * 2) / 2
}

/** Full pricing calculation */
export const calculateTotalPrice = (
  serviceType: ServiceCategory,
  squareFootage: number,
  bathrooms: number,
  hasChildren: boolean,
  hasPets: boolean,
  frequency: FrequencyOption,
  isFirstTimeClient: boolean,
  extras: ExtraServiceId[],
) => {
  const pricePerSqft = calculatePricePerSqft(serviceType, hasChildren, hasPets, frequency)
  const basePrice = pricePerSqft * squareFootage
  const extrasTotal = extras.reduce((total, id) => total + (EXTRA_PRICES[id] || 0), 0)
  const subtotal = basePrice + extrasTotal

  const recurringDiscount = frequency !== 'one-time' ? getDiscountPercentageByFrequency(frequency) : 0
  const firstTimeDiscount = isFirstTimeClient ? FIRST_TIME_DISCOUNT : 0
  const discountPercentage = Math.max(recurringDiscount, firstTimeDiscount)
  const discount = subtotal * discountPercentage
  const total = subtotal - discount
  const estimatedTime = calculateEstimatedTime(squareFootage, extras)

  return { basePrice, pricePerSqft, extrasTotal, subtotal, discount, total, estimatedTime }
}

/** Discount % by frequency */
export function getDiscountPercentageByFrequency(frequency: FrequencyOption): number {
  switch (frequency) {
    case 'weekly':
      return 0.15
    case 'biweekly':
      return 0.1
    case '3weekly':
      return 0.05
    case 'monthly':
      return 0.05
    default:
      return 0
  }
}
