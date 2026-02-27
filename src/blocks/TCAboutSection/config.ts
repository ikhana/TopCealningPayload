// src/blocks/TCAboutSection/config.ts
// Minimal config — all design & content is hardcoded in the component.
// Fields can be added later as CMS-editable content is introduced.

import type { Block } from 'payload'

export const TCAboutSection: Block = {
  slug: 'tcAboutSection',
  interfaceName: 'TCAboutSectionBlock',
  dbName: 'tc_about_section',
  labels: {
    singular: 'TC About Section',
    plural: 'TC About Sections',
  },
  fields: [
    // Intentionally empty — content is hardcoded for now.
  ],
}
