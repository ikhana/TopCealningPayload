// src/blocks/TCHomeHero/config.ts
// Minimal config — all design & content is hardcoded in the component.
// Fields can be added later as CMS-editable content is introduced.

import type { Block } from 'payload'

export const TCHomeHero: Block = {
  slug: 'tcHomeHero',
  interfaceName: 'TCHomeHeroBlock',
  dbName: 'tc_home_hero',
  labels: {
    singular: 'TC Home Hero',
    plural:   'TC Home Heroes',
  },
  fields: [
    // Intentionally empty — content is hardcoded for now.
    // Future fields: backgroundImage, headline, description, reviewCount, ctaLink, etc.
  ],
}
