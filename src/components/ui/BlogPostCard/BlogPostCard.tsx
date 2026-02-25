// src/components/ui/BlogPostCard/BlogPostCard.tsx
import { Media } from '@/components/Media'
import type { BlogPost } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { formatDateTime } from '@/utilities/formatDateTime'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface BlogPostCardProps {
  post: BlogPost
  featured?: boolean
  className?: string
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({ 
  post, 
  featured = false, 
  className 
}) => {
  const category = post.categories?.[0]
  const categoryName = typeof category === 'object' && category !== null ? category.name : ''
  
  const readTime = post.excerpt ? Math.max(1, Math.ceil(post.excerpt.length / 200)) : 3

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article 
        className={cn(
          'relative overflow-hidden shadow-lg transition-all duration-500 ease-out cursor-pointer',
          featured ? 'aspect-[16/9] lg:aspect-[21/9]' : 'aspect-[4/3]',
          'hover:shadow-2xl hover:shadow-coral/20',
          'hover:-translate-y-2 active:translate-y-0',
          'transform-gpu will-change-transform',
          className
        )}
      >
        
        <div className="absolute inset-0 overflow-hidden">
          {post.featuredImage && typeof post.featuredImage === 'object' && (
            <Media
              resource={post.featuredImage}
              className="w-full h-full"
              imgClassName={cn(
                'w-full h-full object-cover transition-transform duration-700 ease-out',
                'group-hover:scale-110 transform-gpu'
              )}
              alt={post.title}
            />
          )}
        </div>

        <div 
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            'bg-gradient-to-t from-navy/90 via-navy/40 to-transparent',
            'opacity-70 group-hover:opacity-90'
          )}
        />

        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          {categoryName && (
            <span className={cn(
              'px-3 py-1 text-xs font-semibold tracking-wider rounded-full shadow-lg',
              'bg-coral text-clinical-white',
              'transform transition-transform duration-300 group-hover:scale-105'
            )}>
              {categoryName.toUpperCase()}
            </span>
          )}

          <div className={cn(
            'flex items-center gap-1 px-2 py-1 text-xs rounded-full',
            'bg-navy/60 backdrop-blur-sm text-clinical-white',
            'transition-all duration-300 group-hover:bg-navy/80'
          )}>
            <Clock className="w-3 h-3" />
            <span>{readTime} min read</span>
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
          <h3 className={cn(
            'font-heading font-bold text-clinical-white leading-tight mb-3',
            'transition-all duration-300 group-hover:text-coral',
            featured ? 'text-2xl lg:text-3xl' : 'text-lg lg:text-xl'
          )}>
            {post.title}
          </h3>

          <div className={cn(
            'transition-all duration-500 ease-out transform',
            'opacity-0 translate-y-4 max-h-0 overflow-hidden',
            'group-hover:opacity-100 group-hover:translate-y-0 group-hover:max-h-32'
          )}>
            {post.excerpt && (
              <p className="text-clinical-white/90 font-body text-sm leading-relaxed mb-4 line-clamp-2">
                {post.excerpt}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-clinical-white/70 text-xs">
                <Calendar className="w-3 h-3" />
                <span>
                  {post.publishedAt 
                    ? formatDateTime({ date: post.publishedAt })
                    : formatDateTime({ date: post.createdAt })
                  }
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-coral text-sm font-semibold group/btn">
                <span className="transition-transform duration-300 group-hover/btn:translate-x-1">
                  Read More
                </span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </div>
            </div>
          </div>

          <div className={cn(
            'absolute bottom-0 left-0 h-1 bg-coral transition-all duration-500',
            'w-0 group-hover:w-full'
          )} />
        </div>

        <div className={cn(
          'absolute top-0 right-0 w-0 h-0 transition-opacity duration-500',
          'border-l-[20px] border-l-transparent border-t-[20px] border-t-coral/30',
          'opacity-0 group-hover:opacity-100'
        )} />

        {featured && (
          <div className="absolute top-4 right-4 z-20">
            <div className={cn(
              'px-3 py-1 text-xs font-bold tracking-wider rounded-full',
              'bg-gradient-to-r from-coral to-brand-blue text-clinical-white',
              'shadow-lg border border-clinical-white/20',
              'animate-pulse'
            )}>
              FEATURED
            </div>
          </div>
        )}
      </article>
    </Link>
  )
}

export type { BlogPostCardProps }
