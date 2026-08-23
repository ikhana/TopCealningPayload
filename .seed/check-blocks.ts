import { getPayload } from 'payload'
import config from '@payload-config'
const TARGETS = ['tcContactForm', 'tcJoinTeam', 'contactForm', 'scheduleCallCTA', 'tcBookingForm']
const run = async () => {
  const payload = await getPayload({ config })
  const res = await payload.find({ collection: 'pages', limit: 200, depth: 0 })
  const hits: Record<string, string[]> = {}
  for (const d of res.docs as any[]) {
    for (const b of (d.layout ?? [])) {
      if (TARGETS.includes(b.blockType)) {
        hits[b.blockType] = hits[b.blockType] ?? []
        hits[b.blockType].push(`/${d.slug} (${d._status})`)
      }
    }
  }
  console.log(`scanned ${res.totalDocs} pages\n`)
  for (const t of TARGETS) {
    console.log(`${t.padEnd(18)} ${hits[t]?.join(', ') ?? '— not used on any page'}`)
  }
  process.exit(0)
}
run().catch((e) => { console.error(e?.message); process.exit(1) })
