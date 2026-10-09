// .seed/legal-hours.ts
//
// The website's hours are the business's hours (owner decision, 2026-10-09): Monday to
// Sunday, 8:00 AM to 10:00 PM. The /privacy contact block still said
// "Monday — Sunday, 08:00 AM – 06:00 PM", so it disagreed with the footer, the schema, the
// contact page and the map card. This rewrites only that hours text, in whichever legal page
// (privacy, terms) carries it, and also drops the dash characters from it.
//
//   DRY=1 PAYLOAD_MIGRATING=true pnpm payload run .seed/legal-hours.ts      (preview)
//         PAYLOAD_MIGRATING=true pnpm payload run .seed/legal-hours.ts      (apply)
//
// Walks the rich text and edits only text nodes that match, so nothing else on the page is
// touched. Revalidation is disabled (revalidatePath throws outside a Next request), so the
// change shows after the next deploy. `_status: 'published'` is asserted on write, because
// omitting it once flipped /terms to draft (docs/a2p-compliance-handoff.md, section 4.10).
// Old content is backed up first.

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '@payload-config'

const DRY = Boolean(process.env.DRY)
const SLUGS = ['privacy', 'terms']
const NEW_HOURS = 'Monday to Sunday, 8:00 AM to 10:00 PM'

// "Monday — Sunday, 08:00 AM – 06:00 PM" in any dash style and zero-padding.
const HOURS_RE = /Monday\s*(?:—|–|-|to)\s*Sunday,?\s*0?\d:\d\d\s*[AP]M\s*(?:—|–|-|to)\s*0?\d:\d\d\s*[AP]M/gi

const payload = await getPayload({ config })
console.log(`\n  ${DRY ? 'DRY RUN, nothing will be written' : 'APPLYING'}\n`)

const backup: Record<string, unknown> = {}
let changed = 0

for (const slug of SLUGS) {
  const found = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, depth: 0, draft: false })
  const page: any = found.docs[0]
  if (!page) { console.log(`  /${slug}: not found, skipped`); continue }

  const latest = await payload.findVersions({
    collection: 'pages', where: { parent: { equals: page.id } }, sort: '-updatedAt', limit: 1, depth: 0,
  })
  if ((latest.docs[0] as any)?.version?._status === 'draft') {
    console.log(`  /${slug}: SKIPPED, has an unpublished draft newer than the live version`)
    continue
  }

  const layout = JSON.parse(JSON.stringify(page.layout ?? []))
  const hits: Array<[string, string]> = []
  const walk = (n: any) => {
    if (!n || typeof n !== 'object') return
    if (n.type === 'text' && typeof n.text === 'string' && HOURS_RE.test(n.text)) {
      HOURS_RE.lastIndex = 0
      const before = n.text
      n.text = n.text.replace(HOURS_RE, NEW_HOURS)
      hits.push([before, n.text])
    }
    HOURS_RE.lastIndex = 0
    for (const v of Object.values(n)) if (v && typeof v === 'object') walk(v)
  }
  walk(layout)

  if (!hits.length) { console.log(`  /${slug}: no hours text found, nothing to do`); continue }
  for (const [b, a] of hits) console.log(`  /${slug}\n      "${b}"\n   -> "${a}"`)
  backup[slug] = { id: page.id, layout: page.layout }
  if (DRY) continue

  await payload.update({
    collection: 'pages', id: page.id,
    data: { layout, _status: 'published' },
    context: { disableRevalidate: true },
  })
  const check: any = await payload.findByID({ collection: 'pages', id: page.id, depth: 0, draft: false })
  const ok = check._status === 'published' && !/06:00 PM|6:00 PM/.test(JSON.stringify(check.layout))
  console.log(`      ${ok ? 'verified in the database' : 'VERIFY FAILED, check this page in the admin'}\n`)
  if (ok) changed++
}

if (!DRY && changed) {
  const file = path.join(process.env.SEO_BACKUP_DIR || os.tmpdir(), `legal-hours-backup-${Date.now()}.json`)
  fs.writeFileSync(file, JSON.stringify(backup, null, 2))
  console.log(`  previous content saved to ${file}`)
}
console.log(`  ${DRY ? 'pages that would change' : 'changed'}: ${DRY ? Object.keys(backup).length : changed}\n`)
process.exit(0)
