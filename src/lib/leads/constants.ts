// src/lib/leads/constants.ts
//
// Values the browser and the server must agree on. Kept in a file with NO server-only
// imports on purpose: the Honeypot component runs in the browser, and importing these from
// spam.ts would drag the server-side bot-detection module into the client bundle.

/**
 * The honeypot field's name. Not `website`, which is what a honeypot is usually called:
 * a honeypot that shares a name with a field people are meant to fill in rejects every
 * genuine submission. `fax` collides with nothing on this site's forms (checked).
 */
export const HONEYPOT_NAME = 'fax'

/**
 * A form completed faster than this was not completed by a person. Kept low on purpose:
 * the cost of a false positive is a quarantined row, but the honeypot and the bot
 * challenge already catch the bulk of it without any timing assumption.
 */
export const MIN_FILL_MS = 2000

/** The form field the browser puts its on-screen time in. See spam.ts for why it is a duration. */
export const FILL_MS_FIELD = 'fillMs'
