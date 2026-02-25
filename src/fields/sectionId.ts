import type { Field } from 'payload'
import { deepMerge } from '@/utilities/deepMerge'

type SectionIdType = (overrides?: Partial<Field>) => Field

export const sectionIdField: SectionIdType = (overrides = {}) => {
  const sectionIdFieldConfig: Field = {
    name: 'sectionId',
    type: 'text',
    admin: {
      description: 'Unique identifier for this section (used for anchor links). Auto-generated if left empty.',
      placeholder: 'e.g., services, about, contact',
    },
    label: 'Section ID',
    hooks: {
      beforeValidate: [
        ({ value, data, operation }) => {
          // Auto-generate section ID if not provided
          if (operation === 'create' && !value) {
            const blockType = data?.blockType || 'section'
            const timestamp = Date.now().toString(36).slice(-4)
            return `${blockType}-${timestamp}`
          }
          
          // Sanitize the section ID
          if (value) {
            return value
              .toLowerCase()
              .replace(/[^a-z0-9-_]/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '')
          }
          
          return value
        },
      ],
    },
  }

  return deepMerge(sectionIdFieldConfig, overrides)
}