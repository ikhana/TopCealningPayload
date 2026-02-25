// src/blocks/BlogShowcase/Component.tsx
import { BlogPostCard } from '@/components/ui/BlogPostCard'
import { WorkshopButton } from '@/components/ui/WorkshopButton/WorkshopButton'
import type { BlogPost, BlogShowcaseBlock as BlogShowcaseBlockType } from '@/payload-types'
import { cn } from '@/utilities/cn'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export const BlogShowcaseBlock: React.FC<
  BlogShowcaseBlockType & {
    id?: string
  }
> = async (props) => {
  const {
    title = 'Health Insights & Research',
    description = 'Stay informed with the latest medical testing insights, health research, and laboratory innovations',
    displayType = 'featured',
    selectedPosts,
    limit = 3,
    ctaText,
    ctaLink = '/blog',
  } = props

  const payload = await getPayload({ config: configPromise })

  let posts: BlogPost[] = []
  
  if (displayType === 'manual' && selectedPosts && selectedPosts.length > 0) {
    const validPosts = await Promise.all(
      selectedPosts.map(async (post) => {
        if (typeof post === 'string' || typeof post === 'number') {
          try {
            const fullPost = await payload.findByID({
              collection: 'blog-posts',
              id: String(post),
              depth: 2,
            })
            return fullPost
          } catch (_error) {
            console.warn(`Failed to fetch blog post with ID: ${post}`)
            return null
          }
        }
        return post as BlogPost
      })
    )
    posts = validPosts.filter((post): post is BlogPost => post !== null)
  } else {
    const where: { _status: { equals: string }, featured?: { equals: boolean } } = { _status: { equals: 'published' } }
    
    if (displayType === 'featured') {
      const featuredResult = await payload.find({
        collection: 'blog-posts',
        where: { 
          ...where,
          featured: { equals: true } 
        },
        limit: limit || 3,
        sort: '-publishedAt',
        depth: 2,
      })
      
      if (featuredResult.docs.length < (limit || 3)) {
        const neededCount = (limit || 3) - featuredResult.docs.length
        const latestResult = await payload.find({
          collection: 'blog-posts',
          where,
          limit: neededCount,
          sort: '-publishedAt',
          depth: 2,
        })
        
        const featuredIds = featuredResult.docs.map(post => post.id)
        const additionalPosts = latestResult.docs.filter(post => !featuredIds.includes(post.id))
        
        posts = [...featuredResult.docs, ...additionalPosts.slice(0, neededCount)]
      } else {
        posts = featuredResult.docs
      }
    } else {
      const result = await payload.find({
        collection: 'blog-posts',
        where,
        limit: limit || 3,
        sort: '-publishedAt',
        depth: 2,
      })
      posts = result.docs
    }
  }

  if (posts.length === 0) return null

  const [featuredPost, ...gridPosts] = posts
  const showFeaturedLayout = posts.length > 1

  return (
    <section className="py-16 lg:py-24 bg-clinical-white dark:bg-navy">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-16">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-wide font-heading text-dark-navy dark:text-clinical-white mb-4">
            {title || 'Health Insights & Research'}
          </h2>
          {description && (
            <p className="text-sm font-body leading-relaxed text-blue-gray dark:text-clinical-white/80 max-w-2xl mx-auto mb-6">
              {description}
            </p>
          )}
          <div className="w-16 h-0.5 bg-coral mx-auto" />
        </div>

        <div className="space-y-12">
          {showFeaturedLayout ? (
            <>
              <div className="mb-12">
                <BlogPostCard 
                  post={featuredPost} 
                  featured={true}
                  className="max-w-5xl mx-auto"
                />
              </div>

              {gridPosts.length > 0 && (
                <div className={cn(
                  'grid gap-8',
                  gridPosts.length === 1 ? 'max-w-md mx-auto' :
                  gridPosts.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' :
                  'md:grid-cols-2 lg:grid-cols-3'
                )}>
                  {gridPosts.map((post) => (
                    <BlogPostCard 
                      key={post.id} 
                      post={post}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="max-w-2xl mx-auto">
              <BlogPostCard 
                post={featuredPost} 
                featured={true}
              />
            </div>
          )}
        </div>

        {ctaText && (
          <div className="text-center mt-16">
            <WorkshopButton
              as="link"
              href={ctaLink || '/blog'}
              variant="primary"
              size="lg"
              className="group bg-coral hover:bg-coral/90 text-clinical-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="flex items-center gap-3">
                {ctaText}
                <svg 
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </WorkshopButton>
          </div>
        )}

        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-coral/5 rounded-full blur-3xl" />
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl" />
        
      </div>
    </section>
  )
}

// ============================================
// src/blocks/BlogShowcase/config.ts
// ============================================

import type { Block } from 'payload'

export const BlogShowcase: Block = {
  slug: 'blogShowcase',
  interfaceName: 'BlogShowcaseBlock',
  labels: {
    singular: 'Blog Showcase',
    plural: 'Blog Showcases',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'Health Insights & Research',
      admin: {
        description: 'Main heading for the blog section',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Section Description',
      defaultValue: 'Stay informed with the latest medical testing insights, health research, and laboratory innovations',
      admin: {
        rows: 2,
        description: 'Subtitle text below the main heading',
      },
    },

    {
      name: 'displayType',
      type: 'select',
      defaultValue: 'featured',
      label: 'Which Posts to Show',
      options: [
        {
          label: 'Featured + Latest Posts',
          value: 'featured',
        },
        {
          label: 'Latest Posts Only',
          value: 'latest',
        },
        {
          label: 'Choose Specific Posts',
          value: 'manual',
        },
      ],
    },
    {
      name: 'selectedPosts',
      type: 'relationship',
      relationTo: 'blog-posts',
      hasMany: true,
      label: 'Selected Posts',
      admin: {
        condition: (_, { displayType }) => displayType === 'manual',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Number of Posts',
      defaultValue: 3,
      min: 2,
      max: 6,
      admin: {
        condition: (_, { displayType }) => displayType !== 'manual',
        description: 'First post will be featured prominently',
      },
    },

    {
      name: 'ctaText',
      type: 'text',
      label: 'Button Text (optional)',
      admin: {
        placeholder: 'e.g. "Read All Health Articles"',
        description: 'Leave empty to hide the button',
      },
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Button Link',
      defaultValue: '/blog',
      admin: {
        condition: (_, { ctaText }) => !!ctaText,
      },
    },
  ],
}