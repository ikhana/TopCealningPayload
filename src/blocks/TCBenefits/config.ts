// src/blocks/TCBenefits/config.ts
// Three equal cards (Customized Maintenance / Satisfaction / Long-Term Discounts)
// per Geraldine's PDF slides 10 + 11. Replaces TCServiceCommitment which used
// a Z-flow + dark navy + diagonal CTA layout (kept around for backward compat).

import type { Block } from 'payload'

export const TCBenefits: Block = {
  slug: 'tcBenefits',
  interfaceName: 'TCBenefitsBlock',
  dbName: 'tc_benefits',
  labels: {
    singular: 'TC Benefits',
    plural: 'TC Benefits',
  },
  fields: [
    // Hardcoded content for now — matches Geraldine's exact copy.
    // Add CMS-editable fields later if content needs to change frequently.
  ],
}
