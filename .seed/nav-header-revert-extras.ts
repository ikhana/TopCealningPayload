// .seed/nav-header-revert-extras.ts
//
//   DRY=1 PAYLOAD_MIGRATING=true pnpm payload run .seed/nav-header-revert-extras.ts    (preview)
//         PAYLOAD_MIGRATING=true pnpm payload run .seed/nav-header-revert-extras.ts    (apply)
//
// Puts the header Services dropdown back to the four items Geraldine approved:
// Residential, Commercial Cleaning Services, Air Bnb Cleaning, Moving In / Moving Out.
//
// nav-service-links.ts added Deep Cleaning, Post Construction Cleaning and Handyman
// Services to that dropdown on top of repointing the four. The repointing was the
// agreed step; the three additions were not, and they changed a menu the client had
// signed off. A link count of the live site shows they were also mostly redundant:
// the footer already carries Deep Cleaning and Handyman on every page, so the only
// service that depended on its header slot was Post Construction.
//
// KEPT: the four items still point at their own pages (not at /services). That change
// is invisible to a visitor and is the part that helps Google find the pages.
// REMOVED: only the three dropdown items added by nav-service-links.ts, matched by URL.
//
// Idempotent. Old values are backed up first.

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '@payload-config'

const DRY = Boolean(process.env.DRY)
const EXTRAS = new Set(['/services/deep-cleaning', '/services/post-construction', '/services/handyman'])

const payload = await getPayload({ config })
console.log(`\n  ${DRY ? 'DRY RUN, nothing will be written' : 'APPLYING'}\n`)

const header: any = await payload.findGlobal({ slug: 'header', depth: 0 })
const before = JSON.parse(JSON.stringify(header.navItems ?? []))
const navItems: any[] = JSON.parse(JSON.stringify(header.navItems ?? []))

const services = navItems.find((i) => i?.type === 'dropdown' && /services/i.test(i?.dropdown?.label ?? ''))
if (!services) {
  console.error('  No "Services" dropdown found. Refusing to guess.')
  process.exit(1)
}

const removed: string[] = []
services.dropdown.items = (services.dropdown.items ?? []).filter((it: any) => {
  const url = it?.link?.url
  if (url && EXTRAS.has(url)) {
    removed.push(`${String(it.link.label).trim()}  (${url})`)
    return false
  }
  return true
})

if (!removed.length) {
  console.log('  The three extra items are not in the dropdown. Nothing to do.\n')
  process.exit(0)
}
if (services.dropdown.items.length < 1) {
  console.error('  That would empty the dropdown. Refusing.')
  process.exit(1)
}

console.log('  removing from the Services dropdown:')
removed.forEach((r) => console.log(`    - ${r}`))
console.log('\n  dropdown will read:')
services.dropdown.items.forEach((it: any) => console.log(`    ${String(it.link?.label).trim().padEnd(30)} ${it.link?.url ?? ''}`))
console.log('')
if (DRY) process.exit(0)

const file = path.join(process.env.SEO_BACKUP_DIR || os.tmpdir(), `nav-header-before-revert-${Date.now()}.json`)
fs.writeFileSync(file, JSON.stringify(before, null, 2))
console.log(`  previous values saved to ${file}\n`)

await payload.updateGlobal({ slug: 'header', data: { navItems } as any, context: { disableRevalidate: true } })

const after: any = await payload.findGlobal({ slug: 'header', depth: 0 })
const drop = (after.navItems ?? []).find((i: any) => i?.type === 'dropdown')
const urls = (drop?.dropdown?.items ?? []).map((d: any) => d.link?.url)
const stillThere = urls.filter((u: string) => EXTRAS.has(u))
console.log(`  ${stillThere.length ? 'STILL PRESENT: ' + stillThere.join(', ') : `verified: dropdown now has ${urls.length} items`}\n`)
process.exit(stillThere.length ? 1 : 0)
