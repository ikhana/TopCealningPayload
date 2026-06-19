// src/types/booking.ts
// Ported from TopCleaningwebsite/src/types/booking.ts

export type ServiceCategory =
  | 'residential'
  | 'movein-out'
  | 'airbnb'
  | 'custom'
  | 'commercial'
  | 'renovation'
  | 'hoarding'
  | 'handyman'

export type FrequencyOption =
  | 'one-time'
  | 'weekly'
  | 'biweekly'
  | '3weekly'
  | 'monthly'
  | '8weekly'

export type ExtraServiceId = string

export interface PropertySize {
  squareFootage: number
  bedrooms: string
  bathrooms: number
}

// Per-service extra questions shown on Step 3, conditional on serviceType.
// Each maps to a GHL SINGLE_OPTIONS contact custom field (values must match
// the GHL options exactly).
export interface ServiceExtras {
  cleaningType?: string       // Residential:       Regular | Deep | Move-in/Move-out
  typeOfSpace?: string        // Commercial:        Office | Store | Other
  propertiesManaged?: string  // Airbnb:            1 | 2-5 | 6-10 | 10+
  propertyType?: string       // Post-Construction: House | Apartment | Commercial
  completionStatus?: string   // Post-Construction: New build | Renovation
}

// Handyman-specific questions (Step 3, handyman only). serviceTypes and
// jobConditions are multi-select → arrays.
export interface HandymanDetails {
  serviceTypes?: string[]     // TV mounting | Plumbing… | Other  (MULTIPLE_OPTIONS)
  otherDetail?: string        // free text when "Other" is selected
  jobConditions?: string[]    // Urgent | Attempted before | Damage risk  (CHECKBOX)
  toolsMaterials?: string     // I have them | Please bring them
  partsNeeded?: string        // e.g. TV bracket, paint color
}

export interface CustomerInfo {
  firstName: string
  lastName?: string
  email: string
  phone: string
  countryCode: string
}

export interface AddressInfo {
  street: string
  apt?: string
  city: string
  state: string
  zipCode: string
}

export interface BookingSummaryData {
  serviceType: string
  propertySize: string
  bathrooms: number
  extras: ExtraServiceId[]
  recurringType: string
  subtotal: number
  discount: number
  total: number
  estimatedTime: number
}

export interface PricingDetails {
  basePrice: number
  pricePerSqft: number
  extrasTotal: number
  subtotal: number
  discount: number
  total: number
  estimatedTime: number
}

export interface BookingFormData {
  customer: CustomerInfo
  property: PropertySize
  serviceExtras: ServiceExtras
  handyman: HandymanDetails
  specialInstructions: string
  serviceType: ServiceCategory
  frequency: FrequencyOption
  hasChildren: boolean
  hasPets: boolean
  selectedExtras: ExtraServiceId[]
  address: AddressInfo
  serviceDate: string
  serviceTime: string
  pricing: PricingDetails
  isFirstTimeClient: boolean
  accessMethod: string
  flexibleTimes: string[]
  pets: string[]
  referralSource: string
}
