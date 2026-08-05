import PageTemplate, { generateMetadata } from './[slug]/page'
import { LocalBusinessSchema } from '@/components/LocalBusinessSchema'

// ISR rather than force-dynamic.
//
// This route was previously `force-dynamic`, which meant every visitor paid for
// a serverless render plus a Payload/Postgres query. Measured TTFB was 1.2s warm
// and 4.7s cold, which alone accounted for most of the homepage LCP.
//
// With `revalidate` the page is pre-rendered and served from the CDN, and the
// existing `revalidatePage` afterChange hook (which already calls
// revalidatePath('/')) purges it the moment the home page is published — so
// edits still appear immediately. The one hour value is only a safety net in
// case a hook ever fails to fire.
export const revalidate = 3600

// LocalBusiness JSON-LD lives on the homepage only. Service pages carry their
// own Service/FAQ/Breadcrumb schema and reference the business as `provider`.
export default function HomePage(props: { params: Promise<{ slug?: string }> }) {
  return (
    <>
      <LocalBusinessSchema />
      <PageTemplate {...props} />
    </>
  )
}

export { generateMetadata }
