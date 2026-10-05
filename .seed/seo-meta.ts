// .seed/seo-meta.ts
//
// Replaces the SEO title and description on the six CMS pages that said
// "Fort Myers & Miami" (and, on /contact-us, carried a stale phone number and a
// 6 PM closing time). Touches ONLY meta.title and meta.description.
//
//   DRY=1 PAYLOAD_MIGRATING=true pnpm payload run .seed/seo-meta.ts      (preview)
//         PAYLOAD_MIGRATING=true pnpm payload run .seed/seo-meta.ts      (apply)
//
// WHY A SCRIPT RATHER THAN THE ADMIN: it is twelve fields across six pages.
//
// WHY IT DISABLES REVALIDATION: the page afterChange hook calls revalidatePath()
// from next/cache, which throws outside a Next request. So this skips it. The
// pages pick the change up on the next deploy (a new deployment starts with an
// empty route cache), and the home page also re-renders hourly on its own. If you
// need it live without deploying, re-save the page once in the admin.
//
// Old values are written to a backup file before anything changes.

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '@payload-config'

const DRY = Boolean(process.env.DRY)

// Brand: "Top Cleaning Team". Geography: Broward County / Fort Lauderdale, per the
// keyword map (docs/stages/seo/02-keyword-map.md) and the GBP service-area list.
// Phone and hours match the schema, the emails and the GHL location.
// No em dashes: these are external-facing.
const NEW_META: Record<string, { title: string; description: string }> = {
  home: {
    title: 'Top Cleaning Team | Cleaning Service in Broward County, FL',
    // "Request", not "Book": the form submits a request that is confirmed by a
    // person, and the success screen says so. A search result promising instant
    // booking sets the expectation that screen was changed to remove.
    description:
      'Licensed and insured house and commercial cleaning across Broward County. Residential, deep, AirBnB turnover and more. Request a cleaning online in minutes.',
  },
  services: {
    title: 'Cleaning Services in Broward County, FL | Top Cleaning Team',
    description:
      'Residential, deep cleaning, move-in/out, AirBnB turnover and commercial cleaning across Broward County. Eco-friendly products, satisfaction guaranteed.',
  },
  booking: {
    title: 'Book a Cleaning in Fort Lauderdale | Top Cleaning Team',
    description:
      'Request your cleaning in minutes. Serving Fort Lauderdale and Broward County. Licensed, insured and eco-friendly. Final pricing confirmed before your visit.',
  },
  'contact-us': {
    title: 'Contact Top Cleaning Team | Fort Lauderdale | (954) 833-4276',
    description:
      'Call (954) 833-4276, email us or use the contact form. Serving Fort Lauderdale and Broward County, open Monday to Sunday, 8 AM to 10 PM.',
  },
  privacy: {
    title: 'Privacy Policy | Top Cleaning Team',
    description:
      'How Top Cleaning Team collects, uses and protects your personal information when you book or contact us. Serving Broward County, Florida.',
  },
  terms: {
    title: 'Terms of Service | Top Cleaning Team',
    description:
      'Booking terms, cancellation policy and service conditions for residential and commercial cleaning from Top Cleaning Team in Broward County, FL.',
  },
}

// Refuse to write anything that breaks the rules these strings were written to.
for (const [slug, m] of Object.entries(NEW_META)) {
  const problems: string[] = []
  if (m.title.length > 60) problems.push(`title ${m.title.length} chars (max 60)`)
  if (m.description.length > 160 || m.description.length < 70) problems.push(`description ${m.description.length} chars (70-160)`)
  if (/—/.test(m.title + m.description)) problems.push('contains an em dash')
  if (/fort myers|754/i.test(m.title + m.description)) problems.push('contains a known-bad value')
  if (problems.length) {
    console.error(`\n  REFUSING: ${slug}: ${problems.join('; ')}\n`)
    process.exit(1)
  }
}

const payload = await getPayload({ config })
console.log(`\n  ${DRY ? 'DRY RUN, nothing will be written' : 'APPLYING'}\n`)

const backup: Record<string, unknown> = {}
let changed = 0
let skipped = 0

for (const [slug, next] of Object.entries(NEW_META)) {
  const found = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    draft: false,
  })
  const page: any = found.docs[0]
  if (!page) {
    console.log(`  /${slug.padEnd(11)} NOT FOUND, skipped`)
    skipped++
    continue
  }

  // If the newest version is an unpublished draft, an edit here would publish over
  // work someone saved but never released. Leave those for a human.
  const latest = await payload.findVersions({
    collection: 'pages',
    where: { parent: { equals: page.id } },
    sort: '-updatedAt',
    limit: 1,
    depth: 0,
  })
  const latestStatus = (latest.docs[0] as any)?.version?._status
  if (latestStatus === 'draft') {
    console.log(`  /${slug.padEnd(11)} SKIPPED: has an unpublished draft newer than the live version`)
    skipped++
    continue
  }

  const prev = page.meta ?? {}
  backup[slug] = { id: page.id, meta: { title: prev.title, description: prev.description } }

  const same = prev.title === next.title && prev.description === next.description
  console.log(`  /${slug}${same ? '   (already correct)' : ''}`)
  console.log(`      title : ${prev.title}`)
  if (!same) console.log(`           -> ${next.title}   [${next.title.length}]`)
  console.log(`      desc  : ${prev.description}`)
  if (!same) console.log(`           -> ${next.description}   [${next.description.length}]`)
  console.log('')

  if (same || DRY) continue

  await payload.update({
    collection: 'pages',
    id: page.id,
    // Spread the existing meta so meta.image (and anything else in the group)
    // survives; only title and description change.
    data: { meta: { ...prev, title: next.title, description: next.description }, _status: 'published' },
    context: { disableRevalidate: true },
  })

  const check: any = await payload.findByID({ collection: 'pages', id: page.id, depth: 0, draft: false })
  const ok = check.meta?.title === next.title && check.meta?.description === next.description
  console.log(`      ${ok ? 'verified in the database' : 'VERIFY FAILED, check this page in the admin'}\n`)
  if (ok) changed++
}

if (!DRY && changed) {
  const file = path.join(process.env.SEO_BACKUP_DIR || os.tmpdir(), `seo-meta-backup-${Date.now()}.json`)
  fs.writeFileSync(file, JSON.stringify(backup, null, 2))
  console.log(`  previous values saved to ${file}`)
}
console.log(`  ${DRY ? 'would change' : 'changed'}: ${DRY ? Object.keys(NEW_META).length - skipped : changed}   skipped: ${skipped}\n`)
process.exit(0)
