// src/lib/leads/spam.ts
//
// The spam screen for the website's lead routes. Three independent signals, cheapest
// first. NONE of them rejects anything: a caught submission is stored like any other,
// marked quarantined, and simply not sent to GoHighLevel.
//
// Not a 403, for two reasons (the same two BrandBloomPayload settled on):
//   - A bot told it failed learns what to change. One that is thanked learns nothing.
//   - A false positive on a rejecting filter loses a real customer permanently and
//     silently. Here it costs one row an admin can read and release.
//
// Ported from BrandBloomPayload with one deliberate difference, see `fillMs`.

import { isBotRequest } from '@/lib/botid'
import { MIN_FILL_MS } from './constants'

// Re-exported so server code has one import for the whole screen.
export { FILL_MS_FIELD, HONEYPOT_NAME, MIN_FILL_MS } from './constants'

/**
 * HOW FILL TIME IS MEASURED
 *
 * The browser sends `fillMs`: how long the form had been on screen, measured entirely
 * on the browser's own clock. BrandBloomPayload sends an absolute `startedAt` timestamp
 * and the server subtracts it from ITS clock, which mixes two clocks. A visitor whose
 * device clock runs a few seconds ahead of the server would look like they filled the
 * form in under two seconds and be quarantined as a bot. A duration has no such problem.
 *
 * Missing or non-numeric means "unknown", which is NOT a failure: a client that does not
 * send it (an old cached page, a form without the timer) is not suspicious for that.
 */
export type ScreenInput = {
  /** route name, so the log line says which form was hit */
  label: string
  /** something identifying (email or phone), logged so a real person who reports
   *  "I filled the form and heard nothing" can be found and released */
  who: string
  /** the honeypot field's value, if the form has one */
  honeypot?: unknown
  /** milliseconds the form was on screen, from the browser's clock */
  fillMs?: unknown
}

/** Returns the list of reasons the submission looks automated. Empty means no flags. */
export async function screenSubmission(input: ScreenInput): Promise<string[]> {
  const reasons: string[] = []

  // 1. Honeypot. Catches scripts that fill every input they can find.
  if (typeof input.honeypot === 'string' && input.honeypot.trim() !== '') {
    reasons.push('honeypot filled')
  }

  // 2. Fill time. Nobody completes a form in under two seconds.
  const fillMs = Number(input.fillMs)
  if (input.fillMs !== undefined && input.fillMs !== '' && Number.isFinite(fillMs) && fillMs < MIN_FILL_MS) {
    reasons.push(`submitted in under ${MIN_FILL_MS / 1000}s (${Math.round(fillMs)}ms)`)
  }

  // 3. Proof of humanity. The first two ask a bot not to do something, which it can
  // learn; this asks it to solve a challenge, which requires actually being a browser.
  // Inert in development unless BOTID_DEV_VERDICT forces a verdict (src/lib/botid.ts).
  if (await isBotRequest(input.label, input.who)) {
    reasons.push('failed bot-detection challenge')
  }

  return reasons
}
