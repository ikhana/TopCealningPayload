// src/blocks/TCServiceCommitment/config.ts
// Minimal config — all design & content is hardcoded in the component.
// Fields can be added later as CMS-editable content is introduced.

import type { Block } from 'payload'

export const TCServiceCommitment: Block = {
  slug: 'tcServiceCommitment',
  interfaceName: 'TCServiceCommitmentBlock',
  dbName: 'tc_service_commitment',
  labels: {
    singular: 'TC Service Commitment',
    plural: 'TC Service Commitments',
  },
  fields: [
    // Intentionally empty — content is hardcoded for now.
  ],
}
