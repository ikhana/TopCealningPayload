// src/hooks/revalidateGlobal.ts
import type { GlobalAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Refreshes the site when a global (header, footer) is saved in the admin.
 *
 * WHY THIS EXISTS: getCachedGlobal() (src/utilities/getGlobals.ts) reads globals
 * through unstable_cache under the tag `global_<slug>`, with no expiry time. That
 * means the cached copy lives until something revalidates the tag, and nothing
 * did: Pages, Products and Redirects each had a revalidate hook, the two globals
 * had none. So a header or footer edit saved in the admin could sit invisible on
 * the live site until the next deploy. It is the same family of problem as
 * /home serving a 12-day-old page, and just as hard to spot, because the admin
 * confirms the save and the database is correct.
 *
 * Both calls, because they cover different layers. The tag drops the cached
 * data; the path drops the already-rendered pages that have the old header baked
 * into their HTML, and the header is on every page, hence the 'layout' scope.
 * That is a whole-site refresh, which is cheap here and only happens when the
 * navigation changes.
 *
 * `context.disableRevalidate` is the project convention for seed scripts, which
 * run outside a Next request where revalidate* throws.
 */
export const revalidateGlobal =
  (slug: 'header' | 'footer'): GlobalAfterChangeHook =>
  ({ doc, req: { payload, context } }) => {
    if (context?.disableRevalidate) return doc

    payload.logger.info(`Revalidating global: ${slug}`)
    revalidateTag(`global_${slug}`)
    revalidatePath('/', 'layout')

    return doc
  }
