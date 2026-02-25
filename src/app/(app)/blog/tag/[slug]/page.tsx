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

  const tag = await payload.find({
    collection: 'blog-tags',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (!tag.docs[0]) {
    return {}
  }

  return {
    title: `#${tag.docs[0].name} | Blog`,
    description: `Browse all articles tagged with ${tag.docs[0].name}`,
  }
}

export default async function TagPage({ params, searchParams }: Args) {
  const { slug } = await params
  const searchParamsResolved = await searchParams
  const currentPage = typeof searchParamsResolved.page === 'string' ? parseInt(searchParamsResolved.page, 10) : 1
  const postsPerPage = 12

  const payload = await getPayload({ config: configPromise })

  const tagResult = await payload.find({
    collection: 'blog-tags',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const tag = tagResult.docs[0]

  if (!tag) {
    notFound()
  }

  const posts = await payload.find({
    collection: 'blog-posts',
    where: {
      and: [
        {
          tags: {
            contains: tag.id,
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
      <section className="relative py-16 lg:py-20 bg-gradient-to-br from-muted/10 to-background">
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
                <span className="text-muted-foreground">Tags</span>
              </li>
              <span className="text-muted-foreground">→</span>
              <li className="text-foreground font-medium">#{tag.name}</li>
            </ol>
          </nav>

          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 relative bg-muted text-foreground text-sm font-semibold shadow-lg">
                <GradientBorders />
                <span className="relative z-10 text-lg">#</span>
                <span className="relative z-10">Tag</span>
              </span>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground">
              #{tag.name}
            </h1>
            
            {tag.description && (
              <p className="text-lg text-muted-foreground mb-6">{tag.description}</p>
            )}

            <p className="text-lg text-muted-foreground">
              {posts.totalDocs} {posts.totalDocs === 1 ? 'article' : 'articles'} tagged with{' '}
              <span className="font-semibold text-primary">#{tag.name}</span>
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent" />
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
            
            <div className="flex items-center gap-2 px-3 py-1 text-xs relative bg-muted/50 text-muted-foreground">
              <GradientBorders />
              <span className="relative z-10 w-2 h-2 rounded-full bg-muted-foreground/60" />
              <span className="relative z-10">Tagged: #{tag.name}</span>
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

          {posts.docs.length > 0 && (
            <div className="mt-16 max-w-6xl mx-auto">
              <RelatedTags currentTag={tag} />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

async function RelatedTags({ currentTag }: { currentTag: any }) {
  const payload = await getPayload({ config: configPromise })

  const relatedTags = await payload.find({
    collection: 'blog-tags',
    where: {
      id: {
        not_equals: currentTag.id,
      },
    },
    limit: 8,
    sort: 'name',
  })

  if (relatedTags.docs.length === 0) return null

  return (
    <div className="p-6 relative bg-muted/40">
      <GradientBorders />
      <h3 className="relative z-10 font-heading text-lg font-semibold mb-4 text-foreground">
        Explore Other Tags
      </h3>
      <div className="relative z-10 flex flex-wrap gap-2">
        {relatedTags.docs.map((tag) => (
          <Link
            key={tag.id}
            href={`/blog/tag/${tag.slug}`}
            className="text-xs px-3 py-1 bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          >
            #{tag.name}
          </Link>
        ))}
      </div>
    </div>
  )
}