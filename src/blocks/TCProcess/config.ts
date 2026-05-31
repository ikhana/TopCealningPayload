import type { Block } from 'payload'

export const TCProcess: Block = {
  slug: 'tcProcess',
  interfaceName: 'TCProcessBlock',
  dbName: 'tc_process',
  labels: { singular: 'TC Process', plural: 'TC Process' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'monolith',
      required: true,
      admin: {
        description:
          'Monolith: 3 large hover-expand cards with photo backgrounds (rich). Simple Steps: 2-column layout — clickable step cards on the left, active step image on the right, auto-rotates (matches the old-site design).',
      },
      options: [
        {
          label: 'Monolith — Hover-expand cards with photos',
          value: 'monolith',
        },
        {
          label: 'Simple Steps — Step list left, image right (auto-rotates)',
          value: 'simple-steps',
        },
      ],
    },
  ],
}
