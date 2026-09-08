import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

for (const slug of ['footer', 'header'] as const) {
  const g: any = await payload.findGlobal({ slug, depth: 0 })
  console.log(`\n=== ${slug} ===`)
  const ci = g?.contactInfo ?? {}
  console.log('  contactInfo:', JSON.stringify(ci, null, 1))
  if (g?.legalLinks) console.log('  legalLinks:', g.legalLinks.map((l: any) => l?.link?.label).join(', '))
}
process.exit(0)
