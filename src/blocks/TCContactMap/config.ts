// src/blocks/TCContactMap/config.ts
// Full-width map section with floating dark overlay card.
// Design reference: design/contactpage.html ".map-section"

import type { Block } from 'payload'

export const TCContactMap: Block = {
  slug: 'tcContactMap',
  interfaceName: 'TCContactMapBlock',
  dbName: 'tc_contact_map',
  labels: {
    singular: 'TC Contact Map',
    plural: 'TC Contact Maps',
  },
  fields: [
    {
      name: 'embedUrl',
      type: 'text',
      label: 'Google Maps Embed URL',
      admin: {
        description: 'Paste the embed URL from Google Maps → Share → Embed a map (the src="..." value)',
      },
    },
    {
      name: 'mapsUrl',
      type: 'text',
      label: 'Google Maps Direct Link',
      admin: {
        description: 'Direct link that opens Google Maps when the user clicks "OPEN NAV-SYS"',
      },
    },
  ],
}
