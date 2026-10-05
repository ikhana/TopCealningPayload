// Can Googlebot actually read our pages? Fetches each sitemap URL as Googlebot and
// as a normal browser, and compares. A firewall, bot challenge or noindex header
// that only fires for crawlers would never show up in a normal browser test.
const base = 'https://www.topcleaningteam.com'
const GOOGLEBOT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
const BROWSER = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36'
const sm = await (await fetch(`${base}/sitemap.xml`)).text()
const urls = [...new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]))]
let bad = 0
for (const u of urls) {
  const [g, b] = await Promise.all([GOOGLEBOT, BROWSER].map((ua) => fetch(u, { headers: { 'User-Agent': ua }, redirect: 'manual' })))
  const [gh, bh] = await Promise.all([g.text(), b.text()])
  const xr = g.headers.get('x-robots-tag')
  const flags = []
  if (g.status !== 200) flags.push(`GOOGLEBOT GOT HTTP ${g.status}`)
  if (xr) flags.push(`X-Robots-Tag: ${xr}`)
  if (/noindex/i.test(gh.split('</head>')[0])) flags.push('noindex in head')
  if (Math.abs(gh.length - bh.length) / Math.max(bh.length, 1) > 0.3) flags.push(`content differs (${gh.length} vs ${bh.length} bytes)`)
  if (flags.length) bad++
  console.log(`${(u.replace(base, '') || '/').padEnd(32)} googlebot ${g.status}  browser ${b.status}  ${flags.length ? '!! ' + flags.join(' | ') : 'ok'}`)
}
console.log(bad ? `\n${bad} page(s) behave differently for Googlebot.` : '\nGooglebot sees every page the same as a visitor.')
