// src/lib/ghl/custom-fields.ts
import { FIELD_KEYS, type FieldKey, clearFieldCache, resolveFieldIds } from './fields'

/**
 * Contact-level GHL custom field ids, resolved by `fieldKey` at runtime.
 *
 * This used to be a plain object read straight out of `process.env` — twenty
 * `GHL_FIELD_*` variables holding opaque ids. See `./fields.ts` for why that
 * was replaced. Nothing here needs an environment variable any more.
 *
 * The SHAPE is unchanged on purpose: a record of logical name to id string,
 * with `''` for anything that did not resolve. Every write site already guards
 * with `FIELDS.x && { id: FIELDS.x, ... }`, so those guards keep working
 * verbatim and the migration is one added line per call site.
 */
export type GhlFieldKey = FieldKey
export type GhlFieldMap = Record<GhlFieldKey, string>

const EMPTY: GhlFieldMap = Object.fromEntries(
  Object.keys(FIELD_KEYS).map((k) => [k, '']),
) as GhlFieldMap

// Logged once per process rather than once per booking. A missing field is a
// standing configuration fact, not a per-request event, and repeating it on
// every submission would bury it.
let warned = false

export async function getGhlFields(): Promise<GhlFieldMap> {
  try {
    const { ids, missing } = await resolveFieldIds()

    if (missing.length && !warned) {
      warned = true
      console.warn(
        `[ghl] custom fields not present in location, their values will not be sent: ${missing.join(', ')}`,
      )
    }

    const out: GhlFieldMap = { ...EMPTY }
    for (const [name, id] of ids) out[name] = id
    return out
  } catch (err) {
    // Deliberately not fatal. This runs inside a live booking submission, and
    // failing the whole booking because a metadata lookup timed out is worse
    // than writing the contact without its extras — the customer's name, phone
    // and email still land, and the booking still completes.
    //
    // But it is logged as an error, not swallowed: the previous env-based code
    // could drop consent with no trace at all, which is the failure this file
    // exists to prevent. The cache is cleared so the next request retries
    // rather than inheriting a poisoned resolution for the rest of the process.
    clearFieldCache()
    console.error('[ghl] custom field resolution failed; sending contact without custom fields', err)
    return { ...EMPTY }
  }
}
