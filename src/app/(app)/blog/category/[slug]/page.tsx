import { BlogPostGrid } from '@/components/blog'
import { cn } from '@/utilities/cn'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

const GradientBorders = () => (
  <>
    <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
  </>
)

type Args = {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const category = await payload.find({
    collection: 'blog-categories',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (!category.docs[0]) {
    return {}
  }

  const cat = category.docs[0]

  return {
    title: cat.meta?.title || `${cat.name} | Blog`,
    description: cat.meta?.description || cat.description || `Browse all ${cat.name} articles`,
  }
}

export default async function CategoryPage({ params, searchParams }: Args) {
  const { slug } = await params
  const searchParamsResolved = await searchParams
  const currentPage = typeof searchParamsResolved.page === 'string' ? parseInt(searchParamsResolved.page, 10) : 1
  const postsPerPage = 12

  const payload = await getPayload({ config: configPromise })

  const categoryResult = await payload.find({
    collection: 'blog-categories',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const category = categoryResult.docs[0]

  if (!category) {
    notFound()
  }

  const posts = await payload.find({
    collection: 'blog-posts',
    where: {
      and: [
        {
          categories: {
            contains: category.id,
          },
        },
        {
          _status: {
            equals: 'published',
          },
        },
      ],
    },
    depth: 2,
    limit: postsPerPage,
    page: currentPage,
    sort: '-publishedAt',
  })

  return (
    <div className="min-h-screen pt-20 lg:pt-24 bg-background dark:bg-card">
      <section className="relative py-16 lg:py-20 bg-gradient-to-br from-muted/20 to-background">
        <div className="container mx-auto px-4">
          <nav className="mb-8 max-w-4xl mx-auto" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <span className="text-muted-foreground">→</span>
              <li>
                <span className="text-muted-foreground">Categories</span>
              </li>
              <span className="text-muted-foreground">→</span>
              <li className="text-foreground font-medium">{category.name}</li>
            </ol>
          </nav>

          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 relative bg-primary text-primary-foreground text-sm font-semibold shadow-lg">
                <GradientBorders />
                <span className="relative z-10 w-2 h-2 rounded-full bg-primary-foreground/30" />
                <span className="relative z-10">Category</span>
              </span>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground">
              {category.name}
            </h1>
            
            {category.description && (
              <p className="text-lg text-muted-foreground mb-6">{category.description}</p>
            )}

            <p className="text-lg text-muted-foreground">
              {posts.totalDocs} {posts.totalDocs === 1 ? 'article' : 'articles'}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </section>

      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
            <Link
              href="/blog"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to blog
            </Link>
            
            <div className="px-3 py-1 text-xs bg-primary/10 text-primary">
              Filtered by {category.name}
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <BlogPostGrid
              posts={posts.docs}
              totalPages={posts.totalPages}
              currentPage={posts.page || 1}
              totalPosts={posts.totalDocs}
              gridColumns="two"
            />
          </div>
        </div>
      </section>
    </div>
  )
}