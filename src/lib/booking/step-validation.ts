// Per-step validation for the booking wizard.
// Mirrors the server-side rules in submit-flow.ts validateBookingData, but
// per-step so the wizard can block "Next" until the current step is complete.
//
// Keyed by REAL step number (1..10), not wizard index. The wizard maps its
// position to a real step number via STEP_NUM_AT — that way this stays stable
// whether or not Step 9 (Payment) is filtered out by the feature flag.

import type { BookingFormData } from '@/types/booking'
import { isBrowardZip } from './broward-zips'

export interface StepValidationResult {
  valid: boolean
  missingField?: string  // human-readable label, used in the inline error
}

const ok: StepValidationResult = { valid: true }

export function validateStep(
  realStepNum: number,
  data: BookingFormData,
  options: { paymentEnabled: boolean; paymentNonceSet: boolean; termsAccepted: boolean; mediaCount?: number } = {
    paymentEnabled: false,
    paymentNonceSet: false,
    termsAccepted: false,
  },
): StepValidationResult {
  switch (realStepNum) {
    case 1: {
      const { customer, address } = data
      if (!customer.firstName?.trim()) return { valid: false, missingField: 'First Name' }
      if (!customer.email?.trim()) return { valid: false, missingField: 'Email' }
      if (!customer.phone?.trim()) return { valid: false, missingField: 'Phone' }
      // Light email format check — bad email is the #1 cause of unreachable leads
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
        return { valid: false, missingField: 'a valid Email' }
      }
      // Address merged into this step (was Step 8).
      if (!address.street?.trim()) return { valid: false, missingField: 'Street Address' }
      if (!address.city?.trim()) return { valid: false, missingField: 'City' }
      if (!address.state?.trim()) return { valid: false, missingField: 'State' }
      if (!address.zipCode?.trim()) return { valid: false, missingField: 'ZIP Code' }
      // Service-area gate — Broward County only (Geraldine's PDF slide 15)
      if (!isBrowardZip(address.zipCode)) {
        return { valid: false, missingField: 'a Broward County zip code (we don\'t service this area yet)' }
      }
      return ok
    }
    case 2: {
      if (!data.serviceType) return { valid: false, missingField: 'Service Type' }
      return ok
    }
    case 3: {
      // Service-aware specs. Square footage is now optional (approx size) for
      // all services. Required fields differ per service.
      const { property, serviceType, serviceExtras } = data
      const needsBedrooms = ['residential', 'movein-out', 'airbnb', 'custom', 'hoarding'].includes(serviceType)
      const needsBathrooms = ['residential', 'movein-out', 'airbnb', 'custom', 'hoarding'].includes(serviceType)

      // Handyman has its own question set + mandatory photos.
      if (serviceType === 'handyman') {
        if (!data.handyman?.serviceTypes?.length) {
          return { valid: false, missingField: 'the type of handyman service' }
        }
        if ((options.mediaCount ?? 0) < 1) {
          return { valid: false, missingField: 'at least one photo of the area' }
        }
        return ok
      }

      if (serviceType === 'residential' && !serviceExtras.cleaningType) {
        return { valid: false, missingField: 'Type of Cleaning' }
      }
      if (serviceType === 'commercial' && !serviceExtras.typeOfSpace) {
        return { valid: false, missingField: 'Type of Space' }
      }
      if (serviceType === 'airbnb' && !serviceExtras.propertiesManaged) {
        return { valid: false, missingField: 'how many properties you manage' }
      }
      if (serviceType === 'renovation') {
        if (!serviceExtras.propertyType) return { valid: false, missingField: 'Property Type' }
        if (!serviceExtras.completionStatus) return { valid: false, missingField: 'Completion Status' }
      }
      if (needsBedrooms && !property.bedrooms?.toString().trim()) {
        return { valid: false, missingField: 'Bedrooms' }
      }
      if (needsBathrooms && (!property.bathrooms || property.bathrooms <= 0)) {
        return { valid: false, missingField: 'Bathrooms' }
      }
      return ok
    }
    case 4: {
      // Extras are optional
      return ok
    }
    case 5: {
      if (!data.frequency) return { valid: false, missingField: 'Frequency' }
      return ok
    }
    case 6: {
      if (!data.serviceDate) return { valid: false, missingField: 'Service Date' }
      if (!data.serviceTime) return { valid: false, missingField: 'Service Time' }
      return ok
    }
    case 7: {
      if (!data.accessMethod) return { valid: false, missingField: 'Access Method' }
      return ok
    }
    // case 8 (Address) removed — merged into Step 1 (Contact & Address).
    case 9: {
      if (options.paymentEnabled && !options.paymentNonceSet) {
        return { valid: false, missingField: 'Payment Method' }
      }
      return ok
    }
    case 10: {
      if (!options.termsAccepted) return { valid: false, missingField: 'Terms agreement' }
      return ok
    }
    default:
      return ok
  }
}
