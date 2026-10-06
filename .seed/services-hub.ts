// .seed/services-hub.ts
//
// Rewrites the top of the /services hub page, which an independent SEO audit (2026-10-06)
// found had: no <h1>, a one-word h2 ("Services"), a generic intro with no place name, and a
// title that targeted the same phrase as the home page title.
//
// Touches ONLY the 'services' page:
//   • meta.title, meta.description
//   • layout[0] (the aboutSplit block): its rich-text `content`. Image, card style and every
//     other field are left alone, and layout[1] (the service grid) is not touched.
//
//   DRY=1 PAYLOAD_MIGRATING=true pnpm payload run .seed/services-hub.ts      (preview)
//         PAYLOAD_MIGRATING=true pnpm payload run .seed/services-hub.ts      (apply)
//
// Same pattern as seo-meta.ts: revalidation is disabled (revalidatePath throws outside a Next
// request), so the page picks the change up on the next deploy or after one admin save.
// Previous values are written to a backup file before anything changes.
//
// Copy rules: external-facing, so no em dashes. It states only what the site already says
// elsewhere: Fort Lauderdale / Broward County, the service list, "price confirmed before your
// visit" (the /booking meta says the same). No city list: the service-area cities are not
// confirmed yet, so none are named beyond Fort Lauderdale.

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '@payload-config'

const DRY = Boolean(process.env.DRY)

const NEW = {
  // Differs from the home title ("Top Cleaning Team | Cleaning Service in Broward County, FL")
  // so the two pages stop competing for one phrase: home is the brand page, this one is the
  // list of what is offered.
  title: 'House, Deep, Move-Out & Commercial Cleaning | Broward, FL',
  description:
    'House, deep, move-in/out, Airbnb, commercial and post-construction cleaning in Fort Lauderdale and Broward County. See what is included and request a date.',
  h1: 'Cleaning Services in Broward County, FL',
  paragraphs: [
    'Top Cleaning Team cleans homes and businesses in Fort Lauderdale and across Broward County. Choose from residential cleaning, deep cleaning, move-in and move-out cleaning, Airbnb turnovers, commercial cleaning, post-construction cleaning, handyman services and after-party cleaning.',
    'Every service page lists exactly what is included, so you know what you are booking before you request a date. Not sure which one fits? Pick the closest match and tell us the details in the request form. We confirm the price before your visit.',
  ],
}

const problems: string[] = []
if (NEW.title.length > 60) problems.push(`title ${NEW.title.length} chars (max 60)`)
if (NEW.description.length > 160 || NEW.description.length < 70) problems.push(`description ${NEW.description.length} chars (70-160)`)
if (/—|–/.test([NEW.title, NEW.description, NEW.h1, ...NEW.paragraphs].join(' '))) problems.push('contains a dash character')
if (problems.length) {
  console.error(`\n  REFUSING: ${problems.join('; ')}\n`)
  process.exit(1)
}

const text = (t: string) => ({ mode: 'normal', text: t, type: 'text', style: '', detail: 0, format: 0, version: 1 })
const heading = (tag: string, t: string) => ({
  tag, type: 'heading', format: '', indent: 0, version: 1, direction: 'ltr', children: [text(t)],
})
const para = (t: string) => ({
  type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textStyle: '', textFormat: 0, children: [text(t)],
})
const content = {
  root: {
    type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
    children: [heading('h1', NEW.h1), ...NEW.paragraphs.map(para)],
  },
}

const payload = await getPayload({ config })
console.log(`\n  ${DRY ? 'DRY RUN, nothing will be written' : 'APPLYING'}\n`)

const found = await payload.find({ collection: 'pages', where: { slug: { equals: 'services' } }, limit: 1, depth: 0, draft: false })
const page: any = found.docs[0]
if (!page) { console.error('  /services page not found'); process.exit(1) }

const latest = await payload.findVersions({
  collection: 'pages', where: { parent: { equals: page.id } }, sort: '-updatedAt', limit: 1, depth: 0,
})
if ((latest.docs[0] as any)?.version?._status === 'draft') {
  console.log('  SKIPPED: /services has an unpublished draft newer than the live version. Resolve it in the admin first.')
  process.exit(0)
}

const layout: any[] = page.layout ?? []
if (layout[0]?.blockType !== 'aboutSplit') {
  console.error(`  REFUSING: layout[0] is "${layout[0]?.blockType}", expected aboutSplit. The page has changed shape; check it in the admin.`)
  process.exit(1)
}

const prevHeading = layout[0].content?.root?.children?.[0]
const prevHeadingText = prevHeading?.children?.map((c: any) => c.text).join('') ?? '(none)'
console.log(`  meta.title : ${page.meta?.title}\n          -> ${NEW.title}   [${NEW.title.length}]`)
console.log(`  meta.desc  : ${page.meta?.description}\n          -> ${NEW.description}   [${NEW.description.length}]`)
console.log(`  heading    : <${prevHeading?.tag}> "${prevHeadingText}"\n          -> <h1> "${NEW.h1}"`)
console.log(`  intro      : replaced with ${NEW.paragraphs.length} paragraphs\n`)

if (DRY) { console.log('  would change: 1\n'); process.exit(0) }

const backupFile = path.join(process.env.SEO_BACKUP_DIR || os.tmpdir(), `services-hub-backup-${Date.now()}.json`)
fs.writeFileSync(backupFile, JSON.stringify({ id: page.id, meta: page.meta, aboutSplitContent: layout[0].content }, null, 2))

const nextLayout = layout.map((b, i) => (i === 0 ? { ...b, content } : b))
await payload.update({
  collection: 'pages',
  id: page.id,
  data: { meta: { ...(page.meta ?? {}), title: NEW.title, description: NEW.description }, layout: nextLayout, _status: 'published' },
  context: { disableRevalidate: true },
})

const check: any = await payload.findByID({ collection: 'pages', id: page.id, depth: 0, draft: false })
const h = check.layout?.[0]?.content?.root?.children?.[0]
const ok = check.meta?.title === NEW.title && h?.tag === 'h1' && check.layout?.length === layout.length && check.layout?.[1]?.blockType === 'tcServicesSection'
console.log(`  ${ok ? 'verified in the database' : 'VERIFY FAILED, check /services in the admin'}`)
console.log(`  previous values saved to ${backupFile}\n`)
process.exit(ok ? 0 : 1)
