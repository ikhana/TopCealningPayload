import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })
const TARGETS = ['tcContactForm', 'tcContactMap', 'scheduleCallCTA']

const pages = await payload.find({ collection: 'pages', limit: 200, depth: 0, draft: false })
console.log(`\npages: ${pages.docs.length}\n`)

for (const t of TARGETS) {
  const hits = pages.docs.filter((p: any) =>
    (p.layout ?? []).some((b: any) => b?.blockType === t),
  )
  console.log(
    `  ${t.padEnd(16)} used on ${hits.length}:`,
    hits.map((p: any) => `/${p.slug} [${p._status}]`).join(', ') || '(nowhere)',
  )
}
process.exit(0)
