// .seed/seo-audit.mjs
//
// On-page SEO audit of every URL in the LIVE sitemap. Read-only: it fetches pages
// and prints; it changes nothing.
//
//   node .seed/seo-audit.mjs
//   node .seed/seo-audit.mjs https://staging.example.com      (other host)
//
// Run it after any CMS edit or deploy. The "KNOWN DEFECTS" block checks for the
// specific problems found on 2026-10-05, so a clean run is a real pass rather than
// an absence of output.

const base = (process.argv[2] || 'https://www.topcleaningteam.com').replace(/\/$/, '')

// Things that must not appear on any page. Each was found live.
const KNOWN_DEFECTS = [
  // The business is in Broward. Fort Myers is a different coast, ~2 hours away.
  { re: /Fort Myers/i, why: 'wrong city (business serves Broward / Fort Lauderdale)' },
  // Stale phone number. The real one is (954) 833-4276.
  { re: /\(?754\)?[\s.-]*307[\s.-]*4034/, why: 'stale phone number (754) 307-4034' },
  // Hours are Mon-Sun 8 AM - 10 PM. Older copy said 6 PM.
  { re: /8\s?AM\s?[–-]\s?6\s?PM|08:00\s?[—–-]\s?18:00/i, why: 'stale 6 PM closing time (hours are 8 AM - 10 PM)' },
]

const decode = (s) => s?.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"')
const pick = (h, re) => decode((h.match(re) || [])[1]?.trim())

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text()
const urls = [...new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]))]
console.log(`\n${urls.length} URLs in ${base}/sitemap.xml\n`)

const dupes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
const dupeList = dupes.filter((u, i) => dupes.indexOf(u) !== i)
if (dupeList.length) console.log(`SITEMAP DUPLICATES: ${dupeList.join(', ')}\n`)

let problems = 0
for (const u of urls) {
  const r = await fetch(u, { redirect: 'manual' })
  const h = await r.text()
  const path = u.replace(base, '') || '/'

  const title = pick(h, /<title[^>]*>([^<]*)<\/title>/i)
  const desc =
    pick(h, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i) ||
    pick(h, /<meta[^>]+content="([^"]*)"[^>]+name="description"/i)
  const canon = pick(h, /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i)
  const robots = pick(h, /<meta[^>]+name="robots"[^>]+content="([^"]*)"/i)
  const h1s = [...h.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    decode(m[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()),
  )
  const schema = [...h.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => {
    try { return JSON.parse(m[1])['@type'] ?? 'graph' } catch { return 'INVALID-JSON' }
  })

  const flags = []
  if (r.status !== 200) flags.push(`HTTP ${r.status}`)
  if (!title) flags.push('NO TITLE')
  // Google truncates titles by pixel width (about 580px), not by character count,
  // so 61-64 characters usually still fits. Only flag the ones that clearly will not.
  else if (title.length > 65) flags.push(`title ${title.length} chars (will truncate in results)`)
  if (!desc) flags.push('NO META DESCRIPTION')
  else if (desc.length > 160) flags.push(`description ${desc.length} chars (over 160)`)
  else if (desc.length < 70) flags.push(`description ${desc.length} chars (short)`)
  if (!canon) flags.push('NO CANONICAL')
  if (h1s.length === 0) flags.push('NO H1')
  else if (h1s.length > 1) flags.push(`${h1s.length} H1s`)
  if (/noindex/i.test(robots ?? '')) flags.push('NOINDEX (but listed in sitemap)')
  if (schema.includes('INVALID-JSON')) flags.push('INVALID JSON-LD')

  // Body text only. <title> and <meta> live in <head>, so without this a wrong
  // city in the title would ALSO be reported as a body hit and every defect would
  // show up twice. Scripts and styles are stripped so framework payloads (the
  // serialized page data Next embeds) cannot produce false matches.
  const bodyHtml = h.split(/<body/i)[1] ?? h
  const visible = bodyHtml.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  for (const d of KNOWN_DEFECTS) {
    const inMeta = d.re.test(`${title} ${desc}`)
    const inBody = d.re.test(visible)
    if (inMeta || inBody) flags.push(`${d.why} [${[inMeta && 'meta', inBody && 'body'].filter(Boolean).join('+')}]`)
  }

  problems += flags.length
  console.log(`${path}`)
  console.log(`  title : ${title}`)
  console.log(`  h1    : ${JSON.stringify(h1s)}   schema: ${schema.join(', ') || '(none)'}`)
  console.log(flags.length ? flags.map((f) => `  !! ${f}`).join('\n') : '  ok')
  console.log('')
}

console.log(problems ? `${problems} issue(s) found.` : 'No issues found.')
process.exit(problems ? 1 : 0)
