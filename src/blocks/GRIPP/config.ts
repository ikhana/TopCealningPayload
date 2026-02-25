// blocks/GRIPP/config.ts

import type { Block } from 'payload'
import { sectionIdField } from '@/fields/sectionId'

export const GRIPP: Block = {
  slug: 'gripp',
  interfaceName: 'GRIPPBlock',
  dbName: 'gripp',
  fields: [
    sectionIdField(),
    
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Putting a GRIPP on Investments',
    },
    
    {
      name: 'subtitle',
      type: 'text',
      required: false,
      defaultValue: 'Fixed Indexed Annuity concepts summarized.',
    },
    
    // Temporary placeholder - we'll expand this after UI is approved
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  labels: {
    plural: 'GRIPP Sections',
    singular: 'GRIPP Section',
  },
}