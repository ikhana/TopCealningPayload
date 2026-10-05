// Two things that decide whether Google bothers to crawl a page it has discovered:
//   1. Does the page have strong INTERNAL links pointing at it?
//   2. Does the server answer quickly and consistently?
const base = 'https://www.topcleaningteam.com'
const sm = await (await fetch(`${base}/sitemap.xml`)).text()
const urls = [...new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]))]
const path = (u) => u.replace(base, '') || '/'

// ---- 1. internal link graph --------------------------------------------------
const inbound = new Map(urls.map((u) => [path(u), new Set()]))
const total = urls.length
for (const u of urls) {
  const h = await (await fetch(u)).text()
  for (const m of h.matchAll(/<a[^>]+href="([^"#?]+)[^"]*"/gi)) {
    let href = m[1].replace(/&amp;/g, '&')
    if (href.startsWith(base)) href = href.slice(base.length)
    if (!href.startsWith('/')) continue
    href = href.replace(/\/$/, '') || '/'
    if (href !== path(u) && inbound.has(href)) inbound.get(href).add(path(u))
  }
}
console.log('INTERNAL LINKS pointing at each page (distinct pages that link to it)\n')
for (const [p, from] of [...inbound].sort((a, b) => a[1].size - b[1].size)) {
  const sitewide = from.size >= total - 2
  console.log(`  ${String(from.size).padStart(2)}  ${p.padEnd(30)} ${sitewide ? '(sitewide: nav or footer)' : from.size <= 2 ? '<< weak: ' + [...from].join(', ') : ''}`)
}

// ---- 2. response time ---------------------------------------------------------
console.log('\nSERVER RESPONSE TIME to first byte, 3 requests each (ms)\n')
const ms = []
for (const u of urls) {
  const t = []
  let cache = ''
  for (let i = 0; i < 3; i++) {
    const s = performance.now()
    const r = await fetch(u, { headers: { 'Cache-Control': 'no-cache' } })
    t.push(Math.round(performance.now() - s))
    cache = r.headers.get('x-vercel-cache') || cache
    await r.text()
  }
  ms.push(Math.max(...t))
  console.log(`  ${path(u).padEnd(30)} ${t.map((x) => String(x).padStart(5)).join(' ')}   cache: ${cache || 'n/a'}`)
}
console.log(`\n  slowest single response: ${Math.max(...ms)} ms`)
