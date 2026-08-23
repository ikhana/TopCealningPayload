/**
 * Adds the A2P 10DLC messaging clauses to /privacy and /terms.
 *
 * Modelled on BrandBloomPayload/.seed/seed-legal.ts, with one deliberate
 * difference. BrandBloom's legal copy lived in WordPress and had to be ported
 * wholesale into JSON. Top Cleaning's already lives in Payload and is
 * substantial and real, so per the brief section 2 ("report before changing")
 * this script INSERTS the missing clauses and touches nothing else. No existing
 * paragraph is rewritten, reordered, or removed.
 *
 * WHAT IT ADDS
 *
 * /privacy   a "SMS and Text Messaging" section, inserted immediately BEFORE the
 *            existing "Data Sharing" heading.
 *
 *            Placement is the whole point. SMPL was rejected under 7103 even
 *            though it carried the prescribed non-sharing clause, because the
 *            clause sat AFTER the sharing list and was qualified with "for their
 *            own marketing purposes". A reviewer reads a section that opens "we
 *            may share your information with..." and stops there. The exclusion
 *            has to come first and has to be unqualified.
 *
 * /terms     an "SMS and Text Messaging Program" section carrying all five
 *            clauses the carriers require, inserted before "Changes to These
 *            Terms" so it sits with the substantive terms rather than after the
 *            housekeeping ones.
 *
 * IDEMPOTENT. Both insertions are keyed on their heading text, so running twice
 * does not duplicate anything.
 *
 * Run with:  pnpm payload run .seed/seed-legal.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

/* ── lexical builders ─────────────────────────────────────────────── */

const txt = (text: string) => ({
  type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1,
})

const para = (text: string) => ({
  type: 'paragraph', format: '' as const, indent: 0, version: 1,
  direction: 'ltr' as const, textFormat: 0, textStyle: '',
  children: [txt(text)],
})

/** Paragraph with one inline link. `before` + [linkText](url) + `after`. */
const paraWithLink = (before: string, linkText: string, url: string, after: string) => ({
  type: 'paragraph', format: '' as const, indent: 0, version: 1,
  direction: 'ltr' as const, textFormat: 0, textStyle: '',
  children: [
    ...(before ? [txt(before)] : []),
    {
      type: 'link', version: 3, format: '' as const, indent: 0, direction: 'ltr' as const,
      fields: { linkType: 'custom' as const, newTab: false, url },
      children: [txt(linkText)],
    },
    ...(after ? [txt(after)] : []),
  ],
})

const heading = (text: string, tag: 'h2' | 'h3' = 'h2') => ({
  type: 'heading', tag, format: '' as const, indent: 0, version: 1,
  direction: 'ltr' as const,
  children: [txt(text)],
})

/* ── the clauses ──────────────────────────────────────────────────── */

const LEGAL_ENTITY = 'TEAM TOP CLEANING LLC'
const TRADING_NAME = 'Top Cleaning Team'
const SUPPORT_EMAIL = 'topcleaningservicefl@gmail.com'
const SUPPORT_PHONE = '(954) 833-4276'

/**
 * The CTIA-prescribed wording. Reviewers pattern-match on this almost verbatim,
 * so it goes in as-is rather than paraphrased, even though the absolute sentence
 * that follows it is stronger.
 */
const PRESCRIBED_NON_SHARING =
  'No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. ' +
  'Information sharing to subcontractors in support services, such as customer service, is permitted. ' +
  'All other use case categories exclude text messaging originator opt-in data and consent; ' +
  'this information will not be shared with any third parties.'

const PRIVACY_SMS_HEADING = 'SMS and Text Messaging'

const PRIVACY_SMS_NODES = [
  heading(PRIVACY_SMS_HEADING),
  para(
    `If you choose to receive text messages from ${TRADING_NAME}, you do so by ticking an optional consent box on our booking form. ` +
    'Consent is never required in order to book a service, and you may decline and still submit the form. ' +
    'You can withdraw consent at any time by replying STOP to any message.',
  ),
  para(PRESCRIBED_NON_SHARING),
  // The unqualified exclusion. This is the sentence that has to precede the
  // Data Sharing list, not follow it.
  para(
    'Mobile opt-in data and SMS consent are excluded from everything described in the Data Sharing section below. ' +
    'They are never shared with, sold, or rented to any third party or affiliate, for any purpose. ' +
    'This exclusion applies without exception, including to any merger, acquisition, sale of assets, ' +
    'or other transfer of the business.',
  ),
]

const TERMS_SMS_HEADING = 'SMS and Text Messaging Program'

const TERMS_SMS_NODES = [
  heading(TERMS_SMS_HEADING),

  // Clause 1 — business identity and what messages to expect.
  //
  // Phrased as "does business as (DBA)" rather than "is a trading name of".
  // Semantically identical, but Twilio 30918 fires when "the website, campaign
  // description, or sample messages identify a business name that does not match
  // the registered brand information", and the documented remedy is to declare
  // "[Legal Name] DBA [Brand Name]" consistently across the site, the privacy
  // policy, the terms, the checkbox labels and the campaign description.
  // Reviewers pattern-match on the literal "DBA" formulation.
  para(
    `${LEGAL_ENTITY} does business as (DBA) ${TRADING_NAME}. If you opt in to text messages, you may receive ` +
    'booking confirmations, appointment reminders, replies to your enquiry, and, where you have separately ' +
    'agreed to marketing messages, occasional offers and service updates. ' +
    'These are two separate consents and you may give either, both, or neither.',
  ),

  // Clause 3 — frequency and rates. Placed early because it is the one customers
  // actually care about.
  para(
    'Message frequency varies. Message and data rates may apply. ' +
    'Contact your wireless provider for details of your messaging plan.',
  ),

  // Clause 2 — opt-out and support.
  para(
    'Reply STOP to any message to cancel. You will receive a single confirmation message and then no further ' +
    'texts from us. Reply START to rejoin. Reply HELP for assistance, or contact us at ' +
    `${SUPPORT_EMAIL} or ${SUPPORT_PHONE}.`,
  ),

  // Clause 5 — carrier liability.
  para(
    'Carriers are not liable for delayed or undelivered messages.',
  ),

  // Clause 4 — direct privacy policy link, not to the homepage.
  paraWithLink(
    'For details of how we handle mobile opt-in data, see our ',
    'Privacy Policy',
    '/privacy',
    '.',
  ),
]

/* ── text fixups ──────────────────────────────────────────────────── */

/**
 * Applied to every paragraph on every run, independently of whether the section
 * insertion happens. Needed because the insertion is idempotent and skips once
 * the heading exists, so wording corrections to already-seeded copy would
 * otherwise never land.
 *
 * Self-idempotent: once a replacement is applied the pattern no longer matches.
 */
const TEXT_FIXUPS: Array<{ find: RegExp; replace: string; why: string }> = [
  {
    find: /Top Cleaning Team is a trading name of TEAM TOP CLEANING LLC\./,
    replace: 'TEAM TOP CLEANING LLC does business as (DBA) Top Cleaning Team.',
    why: 'Twilio 30918 — reviewers pattern-match the literal "DBA" formulation',
  },
]

const applyFixups = (children: any[]): { children: any[]; applied: string[] } => {
  const applied: string[] = []

  const next = children.map((node) => {
    if (!Array.isArray(node?.children)) return node

    let touched = false
    const kids = node.children.map((child: any) => {
      if (typeof child?.text !== 'string') return child
      let text = child.text
      for (const fix of TEXT_FIXUPS) {
        if (fix.find.test(text)) {
          text = text.replace(fix.find, fix.replace)
          touched = true
          if (!applied.includes(fix.why)) applied.push(fix.why)
        }
      }
      return touched ? { ...child, text } : child
    })

    return touched ? { ...node, children: kids } : node
  })

  return { children: next, applied }
}

/* ── insertion ────────────────────────────────────────────────────── */

const headingText = (node: any): string => {
  if (node?.type !== 'heading') return ''
  return (node.children ?? []).map((c: any) => c?.text ?? '').join('').trim()
}

/**
 * Insert `nodes` immediately before the first heading matching `beforeHeading`.
 * Falls back to appending if that heading is not found, and says so loudly.
 */
const insertBefore = (children: any[], beforeHeading: RegExp, nodes: any[], marker: string) => {
  if (children.some((n) => headingText(n) === marker)) {
    return { children, status: 'already present, skipped' as const }
  }

  const idx = children.findIndex((n) => beforeHeading.test(headingText(n)))
  if (idx === -1) {
    console.warn(`  ! anchor ${beforeHeading} not found, appending to the end instead`)
    return { children: [...children, ...nodes], status: 'appended at end' as const }
  }

  return {
    children: [...children.slice(0, idx), ...nodes, ...children.slice(idx)],
    status: `inserted before "${headingText(children[idx])}"` as const,
  }
}

const PAGES = [
  {
    slug: 'privacy',
    anchor: /^Data Sharing/i,
    nodes: PRIVACY_SMS_NODES,
    marker: PRIVACY_SMS_HEADING,
  },
  {
    slug: 'terms',
    anchor: /^Changes to These Terms/i,
    nodes: TERMS_SMS_NODES,
    marker: TERMS_SMS_HEADING,
  },
]

const run = async () => {
  const payload = await getPayload({ config })

  for (const page of PAGES) {
    const found = await payload.find({
      collection: 'pages', where: { slug: { equals: page.slug } }, limit: 1, depth: 0,
    })

    const doc = found.docs[0] as any
    if (!doc) {
      console.error(`/${page.slug}: page not found, skipping`)
      continue
    }

    const layout = doc.layout ?? []
    const blockIdx = layout.findIndex((b: any) => b.blockType === 'textContent')
    if (blockIdx === -1) {
      console.error(`/${page.slug}: no textContent block on this page, skipping`)
      continue
    }

    const block = layout[blockIdx]
    const root = block.content?.root
    if (!root?.children) {
      console.error(`/${page.slug}: textContent block has no lexical root, skipping`)
      continue
    }

    const inserted = insertBefore(root.children, page.anchor, page.nodes, page.marker)
    const fixed = applyFixups(inserted.children)
    const children = fixed.children
    const status = inserted.status

    const nextLayout = layout.map((b: any, i: number) =>
      i === blockIdx ? { ...b, content: { ...b.content, root: { ...root, children } } } : b,
    )

    // `_status: 'published'` is REQUIRED, not decorative. Pages have drafts
    // enabled, and an update that omits it can leave the document as a draft,
    // which 404s the live route. The first run of this script did exactly that
    // to /terms. Asserted on every run, including when the content insert is
    // skipped, so a page can never be left unpublished by this script.
    await payload.update({
      collection: 'pages',
      id: doc.id,
      data: { layout: nextLayout, _status: 'published' } as any,
      context: { disableRevalidate: true },
    })

    console.log(
      `/${page.slug}: ${status}  (${root.children.length} -> ${children.length} nodes)  [published]`,
    )
    for (const why of fixed.applied) console.log(`           fixup applied: ${why}`)
  }

  console.log('\nNot changed by this script, still open:')
  console.log('  - "Fort Myers & Miami" in both page meta titles (awaiting Geraldine)')
  console.log('  - Legal entity disclosure in the site footer')

  process.exit(0)
}

run().catch((err) => {
  console.error(err?.message)
  if (err?.data?.errors) console.error(JSON.stringify(err.data.errors, null, 2))
  process.exit(1)
})
