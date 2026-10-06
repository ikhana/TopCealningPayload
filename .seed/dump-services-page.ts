// Read-only: prints the layout blocks of the /services page so edits can target them.
//   PAYLOAD_MIGRATING=true pnpm payload run .seed/dump-services-page.ts
import { getPayload } from 'payload'
import config from '@payload-config'

const run = async () => {
  const payload = await getPayload({ config })
  const res = await payload.find({ collection: 'pages', where: { slug: { equals: 'services' } }, limit: 1, depth: 0 })
  const d: any = res.docs[0]
  if (!d) { console.log('no services page'); process.exit(0) }
  console.log(`id ${d.id}  status ${d._status}  hero.type ${d.hero?.type}`)
  console.log('meta:', JSON.stringify(d.meta))
  ;(d.layout ?? []).forEach((b: any, i: number) => {
    const { blockType, id, ...rest } = b
    console.log(`\n[${i}] ${blockType}`)
    console.log(JSON.stringify(rest, null, 1).slice(0, 1800))
  })
  process.exit(0)
}
run().catch((e) => { console.error(e?.message); process.exit(1) })
