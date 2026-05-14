// Per-step validation for the booking wizard.
// Mirrors the server-side rules in submit-flow.ts validateBookingData, but
// per-step so the wizard can block "Next" until the current step is complete.
//
// Keyed by REAL step number (1..10), not wizard index. The wizard maps its
// position to a real step number via STEP_NUM_AT — that way this stays stable
// whether or not Step 9 (Payment) is filtered out by the feature flag.

import type { BookingFormData } from '@/types/booking'

export interface StepValidationResult {
  valid: boolean
  missingField?: string  // human-readable label, used in the inline error
}

const ok: StepValidationResult = { valid: true }

export function validateStep(
  realStepNum: number,
  data: BookingFormData,
  options: { paymentEnabled: boolean; paymentNonceSet: boolean; termsAccepted: boolean } = {
    paymentEnabled: false,
    paymentNonceSet: false,
    termsAccepted: false,
  },
): StepValidationResult {
  switch (realStepNum) {
    case 1: {
      const { customer } = data
      if (!customer.firstName?.trim()) return { valid: false, missingField: 'First Name' }
      if (!customer.email?.trim()) return { valid: false, missingField: 'Email' }
      if (!customer.phone?.trim()) return { valid: false, missingField: 'Phone' }
      // Light email format check — bad email is the #1 cause of unreachable leads
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
        return { valid: false, missingField: 'a valid Email' }
      }
      return ok
    }
    case 2: {
      if (!data.serviceType) return { valid: false, missingField: 'Service Type' }
      return ok
    }
    case 3: {
      const { property } = data
      if (!property.squareFootage || property.squareFootage <= 0) {
        return { valid: false, missingField: 'Square Footage' }
      }
      if (!property.bedrooms?.toString().trim()) return { valid: false, missingField: 'Bedrooms' }
      if (!property.bathrooms || property.bathrooms <= 0) {
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
    case 8: {
      const { address } = data
      if (!address.street?.trim()) return { valid: false, missingField: 'Street Address' }
      if (!address.city?.trim()) return { valid: false, missingField: 'City' }
      if (!address.state?.trim()) return { valid: false, missingField: 'State' }
      if (!address.zipCode?.trim()) return { valid: false, missingField: 'ZIP Code' }
      return ok
    }
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
