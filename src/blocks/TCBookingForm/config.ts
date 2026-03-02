// src/blocks/TCBookingForm/config.ts
import type { Block } from 'payload'

export const TCBookingForm: Block = {
  slug: 'tcBookingForm',
  interfaceName: 'TCBookingFormBlock',
  labels: {
    singular: 'TC Booking Form',
    plural: 'TC Booking Forms',
  },
  fields: [
    // Minimal for now — add CMS-configurable fields in the future:
    // e.g. headingOverride, enabledServices, enabledAddons, etc.
  ],
}
