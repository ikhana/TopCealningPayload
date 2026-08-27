// src/lib/consent.ts

/**
 * Identifies WHICH consent wording a contact agreed to.
 *
 * A2P consent evidence is three things: when it was given, from where, and
 * against what text. This constant is the third. It is recorded on every
 * contact alongside the yes/no flags so a consent collected today stays
 * attributable to the exact words that were on screen today, even after the
 * wording is later revised.
 *
 * BUMP THIS whenever the labels in src/components/SmsConsent/index.tsx change
 * in substance — the brand name, the message type, or any of the five
 * disclosures. Cosmetic edits (punctuation, line breaks) do not need a bump.
 *
 * Never reuse a version string for different wording. That link is the whole
 * point: a reviewer asking "what exactly did this person agree to?" is answered
 * by looking up the version, and a reused string makes the answer a guess.
 */
export const CONSENT_VERSION = 'tc-sms-v1'

/**
 * Best-effort originating IP for a request behind Vercel's proxy.
 *
 * `x-forwarded-for` is a comma-separated chain that each hop appends to, so the
 * ORIGINAL client is the leftmost entry. Taking the last one would record
 * Vercel's own edge address on every contact, which is evidence of nothing.
 *
 * Returns undefined rather than a placeholder when no header is present. An
 * absent IP is honest; a fabricated one is worse than nothing in an audit.
 */
export function clientIp(req: Request): string | undefined {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) {
    const first = fwd.split(',')[0]?.trim()
    if (first) return first
  }
  return req.headers.get('x-real-ip')?.trim() || undefined
}
