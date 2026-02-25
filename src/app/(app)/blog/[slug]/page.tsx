import { RenderBlocks } from '@/blocks/RenderBlocks'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { BlogPostCard } from '@/components/ui/BlogPostCard'
import type { BlogPost } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { formatDateTime } from '@/utilities/formatDateTime'
import { generateMeta } from '@/utilities/generateMeta'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Image from 'next/image'
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

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const posts = await payload.find({
      collection: 'blog-posts',
      draft: false,
      limit: 1000,
      overrideAccess: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    return posts.docs.map(({ slug }) => ({ slug }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

type Args = {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPostPage({ params }: Args) {
  const { slug } = await params
  const url = `/blog/${slug}`

  const post = await queryBlogPostBySlug({ slug })

  if (!post) {
    return <PayloadRedirects url={url} />
  }

  const featuredImage = typeof post.featuredImage === 'object' ? post.featuredImage : null
  const author = typeof post.author === 'object' ? post.author : null
  const authorName = author?.authorProfile?.displayName || author?.name || 'Anonymous'

  return (
    <article className="min-h-screen pt-20 lg:pt-24 bg-background dark:bg-card">
      <header className="relative py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <span className="text-muted-foreground">→</span>
                <li className="text-foreground font-medium">{post.title}</li>
              </ol>
            </nav>

            {post.categories && post.categories.length > 0 && (
              <div className="flex gap-2 mb-6">
                {post.categories.map((cat) => {
                  if (typeof cat === 'number' || typeof cat === 'string') return null
                  return (
                    <Link
                      key={cat.id}
                      href={`/blog/category/${cat.slug}`}
                      className="text-xs font-semibold px-3 py-1 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {cat.name}
                    </Link>
                  )
                })}
              </div>
            )}
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-6 text-foreground">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
              <span>By {authorName}</span>
              <time>{formatDateTime({ date: post.publishedAt })}</time>
            </div>

            {featuredImage && (
              <div className="relative aspect-[16/9] mb-12 overflow-hidden">
                <GradientBorders />
                <Image
                  src={featuredImage.url!}
                  alt={featuredImage.alt || post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className={cn(
            'prose prose-lg max-w-none',
            'prose-headings:text-foreground prose-p:text-muted-foreground',
            'prose-a:text-primary hover:prose-a:text-primary/80',
            'prose-headings:font-heading prose-p:font-body'
          )}>
            {post.excerpt && (
              <div className="text-xl leading-relaxed mb-8 p-6 relative bg-muted">
                <GradientBorders />
                <p className="relative z-10 text-foreground font-medium">{post.excerpt}</p>
              </div>
            )}

            {post.flexibleContent && post.flexibleContent.length > 0 && (
              <RenderBlocks blocks={post.flexibleContent} />
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm font-medium mb-3 text-foreground">Tagged:</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => {
                  if (typeof tag === 'number' || typeof tag === 'string') return null
                  return (
                    <Link
                      key={tag.id}
                      href={`/blog/tag/${tag.slug}`}
                      className="text-xs px-3 py-1 bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <RelatedPosts post={post} />
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const post = await queryBlogPostBySlug({ slug })

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  return generateMeta({ doc: post })
}

async function RelatedPosts({ post }: { post: BlogPost }) {
  const payload = await getPayload({ config: configPromise })

  const categoryIds = post.categories
    ?.filter(cat => typeof cat === 'object' && cat !== null)
    .map(cat => (cat as any).id) || []

  if (categoryIds.length === 0) return null

  const relatedPosts = await payload.find({
    collection: 'blog-posts',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { id: { not_equals: post.id } },
        { categories: { in: categoryIds } }
      ]
    },
    limit: 3,
    sort: '-publishedAt',
    depth: 2,
  })

  if (relatedPosts.docs.length === 0) return null

  return (
    <section className="py-16 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-center mb-12 text-foreground">
            Related Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPosts.docs.map((relatedPost) => (
              <BlogPostCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const queryBlogPostBySlug = async ({ slug }: { slug: string }) => {
  try {
    const { isEnabled: isDraftMode } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'blog-posts',
      draft: isDraftMode,
      limit: 1,
      overrideAccess: isDraftMode,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return result.docs?.[0] || null
  } catch (error) {
    console.error('Error querying blog post:', error)
    return null
  }
}