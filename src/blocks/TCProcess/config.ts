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
          'Monolith: 3 large hover-expand cards with photos (rich, current default). Simple Steps: compact numbered stepper matching the old-site / PDF slide 13 design.',
      },
      options: [
        {
          label: 'Monolith — Hover-expand cards with photos',
          value: 'monolith',
        },
        {
          label: 'Simple Steps — Compact numbered stepper',
          value: 'simple-steps',
        },
      ],
    },
  ],
}
