import { getPayload } from 'payload'
import config from '@payload-config'
const payload = await getPayload({ config })
const header = await payload.findGlobal({ slug: 'header', depth: 1 })
console.log('\n  HEADER nav:')
for (const n of ((header as any).navItems ?? [])) {
  const l = n.link ?? {}
  const ref = l.reference?.value
  const to = l.url ?? (ref ? (typeof ref === 'object' ? `/${ref.slug}` : ref) : '-')
  console.log(`    "${l.label ?? '(no label)'}"  -> ${to}`)
  for (const d of (n.dropdown?.items ?? [])) {
    const dl = d.link ?? {}
    const dref = dl.reference?.value
    const dto = dl.url ?? (dref ? (typeof dref === 'object' ? `/${dref.slug}` : dref) : '-')
    console.log(`        - "${dl.label}"  -> ${dto}`)
  }
}
const footer = await payload.findGlobal({ slug: 'footer', depth: 1 })
console.log('\n  FOOTER links:')
const walk = (o: any, d = 0): void => {
  if (!o || typeof o !== 'object') return
  if (o.label && (o.reference || o.url !== undefined)) {
    const r = o.reference?.value
    console.log(`    ${'  '.repeat(d)}"${o.label}" -> ${o.url ?? (r ? (typeof r === 'object' ? `/${r.slug}` : r) : '-')}`)
  }
  for (const v of Object.values(o)) if (v && typeof v === 'object') walk(v, d)
}
walk(footer)
process.exit(0)
