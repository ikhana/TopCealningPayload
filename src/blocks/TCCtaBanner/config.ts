// src/blocks/TCCtaBanner/config.ts
// Closing CTA banner — sits at the end of a section flow (e.g. after Process)
// to convert browsing into bookings.
//
// Two visual variants the admin can switch between:
//   - "teal"  : Solid teal bg, white text, diagonal clip-path. Lighter,
//               brand-pop, matches the "no dark colors" direction (recommended).
//   - "navy"  : Solid dark navy bg, white text, straight edges. Matches
//               Geraldine's PDF slide 13 original design — kept for the
//               admin who prefers the bolder, statement look.

import type { Block } from 'payload'

export const TCCtaBanner: Block = {
  slug: 'tcCtaBanner',
  interfaceName: 'TCCtaBannerBlock',
  dbName: 'tc_cta_banner',
  labels: {
    singular: 'TC CTA Banner',
    plural: 'TC CTA Banners',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'teal',
      required: true,
      admin: {
        description:
          'Visual style. Teal Spotlight = solid teal w/ diagonal edges (recommended, light direction). Navy Statement = dark navy banner (matches the original PDF slide 13 design).',
      },
      options: [
        { label: 'Teal Spotlight (Recommended)', value: 'teal' },
        { label: 'Navy Statement', value: 'navy' },
      ],
    },
    // Content stays hardcoded for now — matches Geraldine's slide 13 copy.
    // Convert to editable fields later if multiple banners need different text.
  ],
}
