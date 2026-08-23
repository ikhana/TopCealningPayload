import { getPayload } from 'payload'
import config from '@payload-config'
const allText = (n: any): string => {
  if (typeof n?.text === 'string') return n.text
  return (n?.children ?? []).map(allText).join('')
}
const run = async () => {
  const payload = await getPayload({ config })
  const r = await payload.find({ collection: 'pages', where: { slug: { equals: 'privacy' } }, limit: 1, depth: 0 })
  const block = ((r.docs[0] as any).layout ?? []).find((b: any) => b.blockType === 'textContent')
  block.content.root.children.forEach((n: any, i: number) => {
    if (!/Business partners|Service providers/i.test(allText(n))) return
    console.log(`\n[${i}] ${n.type}${n.listType ? ' ('+n.listType+')' : ''}`)
    const walk = (node: any, d = 0) => {
      for (const c of node.children ?? []) {
        if (typeof c.text === 'string') console.log(`${'  '.repeat(d+1)}fmt=${c.format} ${JSON.stringify(c.text)}`)
        else { console.log(`${'  '.repeat(d+1)}<${c.type}>`); walk(c, d + 1) }
      }
    }
    walk(n)
  })
  process.exit(0)
}
run().catch((e) => { console.error(e?.message); process.exit(1) })
