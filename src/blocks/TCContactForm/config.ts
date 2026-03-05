// src/blocks/TCContactForm/config.ts
// 2-column contact section: info panel (left) + inquiry form (right).
// Design reference: design/contactpage1.html ".contact-grid"

import type { Block } from 'payload'

export const TCContactForm: Block = {
  slug: 'tcContactForm',
  interfaceName: 'TCContactFormBlock',
  dbName: 'tc_contact_form',
  labels: {
    singular: 'TC Contact Form',
    plural: 'TC Contact Forms',
  },
  fields: [
    // Intentionally minimal — content hardcoded from brand data.
    // Fields can be added later for CMS-editable phone/email/social links.
  ],
}
