// .seed/contact-hero.ts
//
// Fixes the hero text at the top of /contact-us (layout[0], an aboutSplit block):
//   • the heading "Get in Touch" was an <h2>, so the page had no <h1>
//   • the intro used an em dash (external-facing copy) and never named the place
//   • the "Book a Cleaning" link pointed at the OLD Vercel domain
//     (https://topcleaningg.vercel.app/booking) and opened a new tab
//
// Mutates the existing rich text in place, so the eyebrow paragraph, the image, the card
// style and every other field stay exactly as they are. layout[1] (form) and layout[2] (map)
// are not touched. Their fixes are in code.
//
//   DRY=1 PAYLOAD_MIGRATING=true pnpm payload run .seed/contact-hero.ts      (preview)
//         PAYLOAD_MIGRATING=true pnpm payload run .seed/contact-hero.ts      (apply)
//
// Revalidation is disabled (revalidatePath throws outside a Next request): the page picks the
// change up on the next deploy or after one admin save. Old content is backed up first.

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '@payload-config'

const DRY = Boolean(process.env.DRY)

const H1 = 'Contact Top Cleaning Team'
const INTRO =
  'Serving Fort Lauderdale and Broward County. Have a question, need a quote, or ready to schedule? Reach out and we will get back to you within 24 hours.'
const BOOKING_URL = '/booking'

if (/—|–/.test(H1 + INTRO)) { console.error('REFUSING: dash character in new copy'); process.exit(1) }

const payload = await getPayload({ config })
console.log(`\n  ${DRY ? 'DRY RUN, nothing will be written' : 'APPLYING'}\n`)

const found = await payload.find({ collection: 'pages', where: { slug: { equals: 'contact-us' } }, limit: 1, depth: 0, draft: false })
const page: any = found.docs[0]
if (!page) { console.error('  /contact-us not found'); process.exit(1) }

const latest = await payload.findVersions({
  collection: 'pages', where: { parent: { equals: page.id } }, sort: '-updatedAt', limit: 1, depth: 0,
})
if ((latest.docs[0] as any)?.version?._status === 'draft') {
  console.log('  SKIPPED: /contact-us has an unpublished draft newer than the live version. Resolve it in the admin first.')
  process.exit(0)
}

const layout: any[] = JSON.parse(JSON.stringify(page.layout ?? []))
const block = layout[0]
if (block?.blockType !== 'aboutSplit') {
  console.error(`  REFUSING: layout[0] is "${block?.blockType}", expected aboutSplit`)
  process.exit(1)
}
const kids: any[] = block.content?.root?.children ?? []
const headingNode = kids.find((n) => n.type === 'heading')
const introNode = kids.find((n) => n.type === 'paragraph' && /Have a question/.test(JSON.stringify(n)))
const linkNode = kids.flatMap((n) => n.children ?? []).find((c) => c.type === 'link')
if (!headingNode || !introNode || !linkNode) {
  console.error(`  REFUSING: expected a heading, the intro paragraph and a link; found heading=${!!headingNode} intro=${!!introNode} link=${!!linkNode}. The content has changed shape; check it in the admin.`)
  process.exit(1)
}

const before = {
  heading: `<${headingNode.tag}> ${headingNode.children?.[0]?.text}`,
  intro: introNode.children?.[0]?.text,
  link: `${linkNode.fields?.url} (newTab: ${linkNode.fields?.newTab})`,
}
console.log(`  heading : ${before.heading}\n         -> <h1> ${H1}`)
console.log(`  intro   : ${before.intro}\n         -> ${INTRO}`)
console.log(`  link    : ${before.link}\n         -> ${BOOKING_URL} (newTab: false)\n`)

headingNode.tag = 'h1'
headingNode.children[0].text = H1
introNode.children = [{ ...introNode.children[0], text: INTRO }]
linkNode.fields = { ...linkNode.fields, url: BOOKING_URL, newTab: false }

if (DRY) { console.log('  would change: 1\n'); process.exit(0) }

const backupFile = path.join(process.env.SEO_BACKUP_DIR || os.tmpdir(), `contact-hero-backup-${Date.now()}.json`)
fs.writeFileSync(backupFile, JSON.stringify({ id: page.id, layout: page.layout }, null, 2))

await payload.update({
  collection: 'pages',
  id: page.id,
  data: { layout, _status: 'published' },
  context: { disableRevalidate: true },
})

const check: any = await payload.findByID({ collection: 'pages', id: page.id, depth: 0, draft: false })
const h = check.layout?.[0]?.content?.root?.children?.find((n: any) => n.type === 'heading')
const ok = h?.tag === 'h1' && check.layout?.length === layout.length && check.layout?.[1]?.blockType === 'tcContactForm' && check.layout?.[2]?.blockType === 'tcContactMap'
console.log(`  ${ok ? 'verified in the database' : 'VERIFY FAILED, check /contact-us in the admin'}`)
console.log(`  previous values saved to ${backupFile}\n`)
process.exit(ok ? 0 : 1)
