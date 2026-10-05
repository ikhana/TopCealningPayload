// .seed/nav-service-links.ts
//
//   DRY=1 PAYLOAD_MIGRATING=true pnpm payload run .seed/nav-service-links.ts     (preview)
//         PAYLOAD_MIGRATING=true pnpm payload run .seed/nav-service-links.ts     (apply)
//
// Points the header and footer at the individual service pages.
//
// WHY: Google's Search Console reports all 13 sitemap pages as "Discovered,
// currently not indexed", with a last-crawled date that is a placeholder, so
// Google has never visited them. A link count of the live site showed why that
// is easy to believe: Privacy and Terms had 13 internal links each (the footer),
// while the pages that earn money had 1 to 7, and /contact-us had none. The
// header dropdown and the footer "Specialties" column were all pointing at the
// /services hub instead of at the pages they are named after.
//
// A page linked from every page tells Google "this matters". A page linked from
// one tells it "afterthought". Header links are in the HTML of every page, so
// putting the seven service pages in the dropdown gives each of them a sitewide
// link, which is the single biggest internal-linking change available here.
//
// WHAT IT CHANGES
//   Header > Services dropdown
//     repoints Residential, Commercial, Air Bnb, Moving In/Out at their pages
//     adds Deep Cleaning, Post Construction Cleaning, Handyman Services
//   Footer > Quick Links
//     "Our Services" pointed at the HOMEPAGE; it now points at /services
//     adds Contact -> /contact-us (that page had no inbound links at all)
//   Footer > Specialties
//     repoints Deep Cleaning, Airbnb, Move-In/Out, Handyman at their pages
//
// WHAT IT DELIBERATELY LEAVES ALONE
//   "After-Party Cleaning": there is no such page and it is not in the service
//     list, so it stays pointed at the hub. Whether to keep it is a business call.
//   "Join Our Team", "About Us", "FAQs": all point at the homepage with no anchor.
//     Fixing them needs the section ids, which is a separate job.
//   Link labels, including the trailing spaces on "Residential " and
//     "Air Bnb Cleaning ": changing wording was not the brief.
//
// Idempotent: a second run finds nothing to do.
// Old values are written to a backup file first.
//
// Revalidation is disabled for the reason in seo-meta.ts (revalidatePath throws
// outside a Next request). The header and footer are ALSO read through
// unstable_cache with a tag that nothing revalidates, so whether a deploy is
// enough to show this change is verified afterwards rather than assumed.

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '@payload-config'

const DRY = Boolean(process.env.DRY)

const norm = (s: unknown) => String(s ?? '').trim().toLowerCase()
const custom = (link: any, url: string) => ({
  ...link,
  type: 'custom',
  url,
  reference: null,
  anchor: null,
  newTab: false,
})
const target = (l: any) => (l?.type === 'custom' ? l.url : l?.type === 'reference' ? `ref:${l.reference?.value}` : `anchor:${l?.anchor}`)

// ── desired state ──────────────────────────────────────────────────────────────
const HEADER_REPOINT: Record<string, string> = {
  residential: '/services/residential',
  'commercial cleaning services': '/services/commercial',
  'air bnb cleaning': '/services/airbnb',
  'moving in, moving out': '/services/move-in-out',
}
const HEADER_ADD: Array<[string, string]> = [
  ['Deep Cleaning', '/services/deep-cleaning'],
  ['Post Construction Cleaning', '/services/post-construction'],
  ['Handyman Services', '/services/handyman'],
]
const FOOTER_QUICK_REPOINT: Record<string, string> = { 'our services': '/services' }
const FOOTER_QUICK_ADD: Array<[string, string]> = [['Contact', '/contact-us']]
const FOOTER_SPEC_REPOINT: Record<string, string> = {
  'deep cleaning': '/services/deep-cleaning',
  'airbnb cleaning': '/services/airbnb',
  'move-in / move-out cleaning.': '/services/move-in-out',
  'handyman services': '/services/handyman',
}

const payload = await getPayload({ config })
console.log(`\n  ${DRY ? 'DRY RUN, nothing will be written' : 'APPLYING'}\n`)

const log: string[] = []
const note = (area: string, what: string, from: string, to: string) => log.push(`  ${area.padEnd(18)} ${what.padEnd(30)} ${from.padEnd(14)} -> ${to}`)

// ── header ─────────────────────────────────────────────────────────────────────
const header: any = await payload.findGlobal({ slug: 'header', depth: 0 })
const navBefore = JSON.parse(JSON.stringify(header.navItems ?? []))
const navItems: any[] = JSON.parse(JSON.stringify(header.navItems ?? []))

const services = navItems.find((i) => i?.type === 'dropdown' && /services/i.test(i?.dropdown?.label ?? ''))
if (!services) {
  console.error('  No "Services" dropdown found in the header. Refusing to guess.')
  process.exit(1)
}
services.dropdown.items = (services.dropdown.items ?? []).map((it: any) => {
  const url = HEADER_REPOINT[norm(it.link?.label)]
  if (!url || (it.link?.type === 'custom' && it.link?.url === url)) return it
  note('header dropdown', String(it.link?.label).trim(), target(it.link), url)
  return { ...it, link: custom(it.link, url) }
})
for (const [label, url] of HEADER_ADD) {
  if (services.dropdown.items.some((it: any) => it.link?.url === url)) continue
  note('header dropdown', `+ ${label}`, '(new)', url)
  services.dropdown.items.push({ description: null, featured: false, link: { type: 'custom', url, label, newTab: false } })
}
if (services.dropdown.items.length > 10) {
  console.error(`  Dropdown would have ${services.dropdown.items.length} items (max 10).`)
  process.exit(1)
}

// ── footer ─────────────────────────────────────────────────────────────────────
const footer: any = await payload.findGlobal({ slug: 'footer', depth: 0 })
const sectionsBefore = JSON.parse(JSON.stringify(footer.sections ?? []))
const sections: any[] = JSON.parse(JSON.stringify(footer.sections ?? []))

const repoint = (section: any, map: Record<string, string>, area: string) => {
  section.links = (section.links ?? []).map((it: any) => {
    const url = map[norm(it.link?.label)]
    if (!url || (it.link?.type === 'custom' && it.link?.url === url)) return it
    note(area, String(it.link?.label).trim(), target(it.link), url)
    return { ...it, link: custom(it.link, url) }
  })
}
const addTo = (section: any, additions: Array<[string, string]>, area: string) => {
  for (const [label, url] of additions) {
    if ((section.links ?? []).some((it: any) => it.link?.url === url)) continue
    note(area, `+ ${label}`, '(new)', url)
    section.links.push({ link: { type: 'custom', url, label, newTab: false } })
  }
  if (section.links.length > 8) {
    console.error(`  Footer section "${section.title}" would have ${section.links.length} links (max 8).`)
    process.exit(1)
  }
}
const quick = sections.find((s) => /quick/i.test(s?.title ?? ''))
const spec = sections.find((s) => /special/i.test(s?.title ?? ''))
if (!quick || !spec) {
  console.error('  Footer is missing a "Quick Links" or "Specialties" section. Refusing to guess.')
  process.exit(1)
}
repoint(quick, FOOTER_QUICK_REPOINT, 'footer quick links')
addTo(quick, FOOTER_QUICK_ADD, 'footer quick links')
repoint(spec, FOOTER_SPEC_REPOINT, 'footer specialties')

// ── report + write ─────────────────────────────────────────────────────────────
if (!log.length) {
  console.log('  Header and footer already point at the service pages. Nothing to do.\n')
  process.exit(0)
}
console.log(log.join('\n'))
console.log(`\n  ${log.length} change${log.length === 1 ? '' : 's'}\n`)
if (DRY) process.exit(0)

const file = path.join(process.env.SEO_BACKUP_DIR || os.tmpdir(), `nav-backup-${Date.now()}.json`)
fs.writeFileSync(file, JSON.stringify({ header: navBefore, footerSections: sectionsBefore }, null, 2))
console.log(`  previous values saved to ${file}\n`)

await payload.updateGlobal({ slug: 'header', data: { navItems } as any, context: { disableRevalidate: true } })
await payload.updateGlobal({ slug: 'footer', data: { sections } as any, context: { disableRevalidate: true } })

// verify by reading back, not by trusting the write
const h2: any = await payload.findGlobal({ slug: 'header', depth: 0 })
const f2: any = await payload.findGlobal({ slug: 'footer', depth: 0 })
const hUrls = new Set(
  (h2.navItems ?? []).flatMap((i: any) => [i.link?.url, ...(i.dropdown?.items ?? []).map((d: any) => d.link?.url)]).filter(Boolean),
)
const fUrls = new Set((f2.sections ?? []).flatMap((s: any) => (s.links ?? []).map((l: any) => l.link?.url)).filter(Boolean))
const wantH = [...Object.values(HEADER_REPOINT), ...HEADER_ADD.map((a) => a[1])]
const wantF = [...Object.values(FOOTER_QUICK_REPOINT), ...FOOTER_QUICK_ADD.map((a) => a[1]), ...Object.values(FOOTER_SPEC_REPOINT)]
const missH = wantH.filter((u) => !hUrls.has(u))
const missF = wantF.filter((u) => !fUrls.has(u))
console.log(`  header: ${missH.length ? 'MISSING ' + missH.join(', ') : `all ${wantH.length} service links present`}`)
console.log(`  footer: ${missF.length ? 'MISSING ' + missF.join(', ') : `all ${wantF.length} links present`}\n`)
process.exit(missH.length || missF.length ? 1 : 0)
