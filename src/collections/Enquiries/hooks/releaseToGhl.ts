// src/collections/Enquiries/hooks/releaseToGhl.ts
//
// Sends an enquiry to GoHighLevel when somebody sets its status back to Pending.
//
// This is the recovery path for the two ways a lead can be held back: a QUARANTINED one
// (a spam check caught it, possibly wrongly) and a FAILED one (GoHighLevel was down).
// Both are released the same way, from the admin, a script or the API, because the hook
// is on the field and not on a button: one path, no second implementation to keep in step.
//
// WHY THE SYNC IS DEFERRED AND NOT RUN HERE
//
// An afterChange hook runs INSIDE the database transaction of the save that triggered it,
// and that transaction holds a lock on this very row. The first version of this hook ran
// the sync inline. The sync makes network calls to GoHighLevel and then writes its outcome
// back onto the same row, from its own connection. That write waits for the lock the
// outer transaction holds, and the outer transaction is waiting for the sync: a deadlock
// that ended with Postgres killing the connection (25P03, idle in transaction).
//
// Network calls do not belong inside a transaction at all. So the hook only decides that
// a release was requested, and the sync runs once the save has committed:
//   - in a request (admin save, REST/GraphQL): Next's `after()`, which runs after the
//     response is sent and keeps the function alive until it finishes;
//   - outside a request (a script): a short timer, long enough for the commit.
// Either way the admin sees "Pending" first and the real outcome (Synced, or Failed with
// the reason in the sync log) a few seconds later, on reload.
//
// BrandBloomPayload's version of this hook runs its job queue inside the hook and may have
// the same problem; it has not been verified there.

import type { CollectionAfterChangeHook } from 'payload'
import { after } from 'next/server'

import { syncEnquiry } from '@/lib/leads/sync'

/** Long enough for the save's transaction to commit, short enough to feel immediate. */
const COMMIT_GRACE_MS = 1000

export const releaseToGhl: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
  // The sync writes its own outcome back onto the row. Without this, recording
  // 'pending' mid-run would start a second copy of the sync that is already running.
  if (req.context?.skipSync) return doc

  // Creation is handled by the two routes, where the spam checks decide whether to sync
  // at all. Syncing here as well would send every quarantined lead the moment it was
  // caught, which is exactly what quarantine exists to prevent.
  if (operation !== 'update') return doc

  // Only a real transition INTO pending. Saving an already-pending row for an unrelated
  // edit is not a request to sync it.
  if (doc?.syncStatus !== 'pending') return doc
  if (previousDoc?.syncStatus === 'pending') return doc

  const payload = req.payload
  const id = doc.id

  const run = async () => {
    try {
      await syncEnquiry(payload, id)
    } catch (err) {
      // syncEnquiry records its own failures on the row and never throws, so reaching here
      // means something unexpected. There is nobody to tell by now; the log is the record.
      payload.logger.error(
        `[enquiries] ${id} released but the sync threw: ${err instanceof Error ? err.message : String(err)}`,
      )
    }
  }

  payload.logger.info(`[enquiries] ${id} released from ${previousDoc?.syncStatus ?? 'unknown'}, sync scheduled`)

  try {
    // Inside a request: runs after the response, once the transaction has committed.
    after(async () => {
      await new Promise((resolve) => setTimeout(resolve, COMMIT_GRACE_MS))
      await run()
    })
  } catch {
    // `after()` throws outside a request scope (a script, the Payload CLI).
    setTimeout(run, COMMIT_GRACE_MS)
  }

  return doc
}
