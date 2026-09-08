import { getPayload } from 'payload'
import config from '@payload-config'
const run = async () => {
  const payload = await getPayload({ config })
  for (const slug of ['privacy', 'terms']) {
    const r = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 5, depth: 0 })
    console.log(`\n--- slug "${slug}" : ${r.totalDocs} doc(s) ---`)
    for (const d of r.docs as any[]) {
      const block = (d.layout ?? []).find((b: any) => b.blockType === 'textContent')
      const n = block?.content?.root?.children?.length ?? 0
      console.log(`  id=${d.id}  status=${d._status}  title="${d.title}"  layoutBlocks=${(d.layout ?? []).length}  textNodes=${n}  updatedAt=${d.updatedAt}`)
    }
  }
  process.exit(0)
}
run().catch((e) => { console.error(e?.message); process.exit(1) })
