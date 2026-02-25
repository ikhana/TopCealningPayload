import PageTemplate, { generateMetadata } from './[slug]/page'

// Force dynamic rendering - prevents static generation during build
export const dynamic = 'force-dynamic'

export default PageTemplate

export { generateMetadata }
