import { BlogCategoryFilter, BlogHero, BlogSearchBar } from '@/components/blog'
import { BlogPostCard } from '@/components/ui/BlogPostCard'
import { cn } from '@/utilities/cn'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'

const GradientBorders = () => (
  <>
    <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
  </>
)

export const metadata: Metadata = {
  title: 'Blog | Mazco LLC',
  description: 'Insights and updates from our team',
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams
  const searchQuery = typeof params.search === 'string' ? params.search : ''
  const categoryFilter = typeof params.categories === 'string' ? params.categories : ''
  const selectedCategories = categoryFilter ? categoryFilter.split(',').filter(Boolean) : []
  
  const payload = await getPayload({ config: configPromise })

  let whereQuery: any = {
    _status: { equals: 'published' }
  }

  if (searchQuery) {
    whereQuery = {
      ...whereQuery,
      or: [
        { title: { contains: searchQuery } },
        { excerpt: { contains: searchQuery } },
        { keywords: { contains: searchQuery } }
      ]
    }
  }

  if (selectedCategories.length > 0) {
    const categoriesResult = await payload.find({
      collection: 'blog-categories',
      where: {
        slug: { in: selectedCategories }
      },
    })

    const categoryIds = categoriesResult.docs.map(cat => cat.id)
    
    if (categoryIds.length > 0) {
      whereQuery = {
        ...whereQuery,
        categories: { in: categoryIds }
      }
    }
  }

  const posts = await payload.find({
    collection: 'blog-posts',
    depth: 2,
    limit: 12,
    sort: '-publishedAt',
    where: whereQuery,
  })

  const categories = await payload.find({
    collection: 'blog-categories',
    limit: 20,
    sort: 'displayOrder',
  })

  return (
    <div className="min-h-screen pt-20 lg:pt-24 bg-background dark:bg-card">
      <BlogHero />

      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
            <aside className="lg:col-span-1">
              <div className="sticky top-36 space-y-6">
                <div className="p-6 relative bg-muted/60 backdrop-blur-sm">
                  <GradientBorders />
                  <h3 className="relative z-10 font-heading text-lg mb-4 text-foreground">
                    Search Articles
                  </h3>
                  <div className="relative z-10">
                    <BlogSearchBar />
                  </div>
                </div>

                <div className="p-6 relative bg-muted/60 backdrop-blur-sm">
                  <GradientBorders />
                  <div className="relative z-10">
                    <BlogCategoryFilter 
                      categories={categories.docs}
                      showPostCounts={true}
                    />
                  </div>
                </div>
              </div>
            </aside>

            <main className="lg:col-span-3">
              {(searchQuery || selectedCategories.length > 0) && (
                <div className="mb-8">
                  <p className="text-sm text-muted-foreground">
                    {posts.totalDocs > 0 ? (
                      <>
                        Found {posts.totalDocs} {posts.totalDocs === 1 ? 'article' : 'articles'}
                        {searchQuery && ` for "${searchQuery}"`}
                        {selectedCategories.length > 0 && ` in ${selectedCategories.join(', ')}`}
                      </>
                    ) : (
                      <>
                        No articles found
                        {searchQuery && ` for "${searchQuery}"`}
                        {selectedCategories.length > 0 && ` in ${selectedCategories.join(', ')}`}
                      </>
                    )}
                  </p>
                </div>
              )}

              {posts.docs.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {posts.docs.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-6 relative bg-muted/40">
                  <GradientBorders />
                  <p className="relative z-10 text-lg mb-4 text-muted-foreground">
                    {(searchQuery || selectedCategories.length > 0) ? (
                      <>
                        No articles found for your filters.
                        <br />
                        Try different keywords or categories.
                      </>
                    ) : (
                      'No articles yet. Check back soon!'
                    )}
                  </p>
                  
                  {(searchQuery || selectedCategories.length > 0) && (
                    <Link
                      href="/blog"
                      className="relative z-10 inline-block px-6 py-3 text-primary hover:text-primary-foreground border border-primary hover:bg-primary transition-all duration-200"
                    >
                      View All Articles
                    </Link>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  )
}