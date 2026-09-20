// src/utilities/pageHref.ts

/**
 * The URL a Pages document is actually served at.
 *
 * The home document is reachable at `/` — app/(app)/page.tsx renders it by
 * defaulting the slug — so linking to `/home` creates a SECOND live URL for
 * one page. That is not just untidy. Only `/` is ever revalidated
 * (revalidatePage calls revalidatePath('/')), so `/home` keeps serving whatever
 * render happened to be cached when it was last requested. It was 12 days stale
 * when this was reported, still advertising services that had been removed.
 *
 * The collection hooks in src/collections/Pages already encoded this rule, but
 * every link-rendering component had its own copy of `/${slug}` and none of
 * them knew about it. One function so they cannot drift apart again.
 */
export function pageHref(slug: string | null | undefined): string {
  if (!slug) return '/'
  return slug === 'home' ? '/' : `/${slug}`
}
