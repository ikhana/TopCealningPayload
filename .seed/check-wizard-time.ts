import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })
const drafts = await payload.find({ collection: 'booking-drafts', limit: 500, depth: 0 })

// How long each draft stayed under active edit: first save -> last save.
const spans = (drafts.docs as any[])
  .filter((d) => d.createdAt && d.updatedAt)
  .map((d) => (Date.parse(d.updatedAt) - Date.parse(d.createdAt)) / 60000)
  .filter((m) => m >= 0)
  .sort((a, b) => a - b)

const pct = (p: number) => spans[Math.min(spans.length - 1, Math.floor((spans.length * p) / 100))]
const over = (m: number) => ((spans.filter((s) => s > m).length / spans.length) * 100).toFixed(0)

console.log(`\nactive editing time per draft (minutes), n = ${spans.length}\n`)
console.log('  median ', pct(50).toFixed(1))
console.log('  p75    ', pct(75).toFixed(1))
console.log('  p90    ', pct(90).toFixed(1))
console.log('  max    ', spans[spans.length - 1].toFixed(1))
console.log('\n  still editing after:')
for (const m of [5, 10, 15, 20, 30, 45, 60]) {
  console.log(`    ${String(m).padStart(3)} min   ${over(m).padStart(3)}%`)
}
process.exit(0)
