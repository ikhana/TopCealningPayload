'use client'

import { BlogPostCard } from '@/components/ui/BlogPostCard'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'
import type { BlogPost } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

interface BlogPostGridProps {
  posts: BlogPost[]
  totalPages: number
  currentPage: number
  totalPosts: number
  className?: string
  gridColumns?: 'one' | 'two' | 'three'
}

export const BlogPostGrid: React.FC<BlogPostGridProps> = ({
  posts,
  totalPages,
  currentPage,
  totalPosts,
  className,
  gridColumns = 'two',
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const getPageUrl = (page: number) => {
    const newParams = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      newParams.delete('page')
    } else {
      newParams.set('page', page.toString())
    }
    return newParams.toString() ? `/blog?${newParams.toString()}` : '/blog'
  }

  const getGridClasses = () => {
    switch (gridColumns) {
      case 'one':
        return 'grid grid-cols-1 gap-8 max-w-2xl mx-auto'
      case 'two':
        return 'grid md:grid-cols-2 gap-8'
      case 'three':
        return 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
      default:
        return 'grid md:grid-cols-2 gap-8'
    }
  }

  const generatePaginationRange = (): (number | string)[] => {
    if (totalPages <= 1) return []
    
    const delta = 2
    const range: number[] = []
    const rangeWithDots: (number | string)[] = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, 'ellipsis')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('ellipsis', totalPages)
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages)
      }
    }

    return rangeWithDots.filter((item, index, array) => array.indexOf(item) === index && item !== currentPage)
  }

  const paginationRange: (number | string)[] = totalPages > 1 ? generatePaginationRange() : []

  return (
    <div className={cn('space-y-8', className)}>
      {posts.length > 0 ? (
        <div className={getGridClasses()}>
          {posts.map((post) => (
            <BlogPostCard 
              key={post.id} 
              post={post}
              featured={gridColumns === 'one'}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 bg-muted/40 border border-border">
          <p className="text-lg text-muted-foreground">
            No articles found matching your criteria.
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * posts.length) + 1} to {Math.min(currentPage * posts.length, totalPosts)} of {totalPosts} articles
          </p>

          <Pagination className="w-full">
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious 
                    href={getPageUrl(currentPage - 1)}
                    className="transition-all duration-200 hover:scale-105 bg-muted/60 backdrop-blur-sm"
                  />
                </PaginationItem>
              )}

              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationLink 
                    href={getPageUrl(1)}
                    className="transition-all duration-200 hover:scale-105 bg-muted/60 backdrop-blur-sm"
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationLink 
                  href={getPageUrl(currentPage)}
                  isActive
                  className="bg-primary text-primary-foreground border-primary shadow-lg transform scale-105"
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>

              {paginationRange.map((page, index) => (
                <PaginationItem key={index}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis className="text-muted-foreground" />
                  ) : (
                    <PaginationLink 
                      href={getPageUrl(page as number)}
                      className="transition-all duration-200 hover:scale-105 bg-muted/60 backdrop-blur-sm"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext 
                    href={getPageUrl(currentPage + 1)}
                    className="transition-all duration-200 hover:scale-105 bg-muted/60 backdrop-blur-sm"
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}