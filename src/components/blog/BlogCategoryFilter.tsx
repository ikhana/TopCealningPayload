'use client'

import type { BlogCategory } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

interface BlogCategoryFilterProps {
  categories: BlogCategory[]
  className?: string
  showPostCounts?: boolean
}

export const BlogCategoryFilter: React.FC<BlogCategoryFilterProps> = ({
  categories,
  className,
  showPostCounts = true,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedCategories = searchParams.get('categories')?.split(',').filter(Boolean) || []

  const handleCategoryToggle = (categorySlug: string) => {
    const newParams = new URLSearchParams(searchParams.toString())
    let newCategories = [...selectedCategories]

    if (newCategories.includes(categorySlug)) {
      newCategories = newCategories.filter(cat => cat !== categorySlug)
    } else {
      newCategories.push(categorySlug)
    }

    if (newCategories.length > 0) {
      newParams.set('categories', newCategories.join(','))
    } else {
      newParams.delete('categories')
    }

    const searchQuery = searchParams.get('search')
    if (searchQuery) {
      newParams.set('search', searchQuery)
    }

    const newUrl = newParams.toString() ? `/blog?${newParams.toString()}` : '/blog'
    router.push(newUrl)
  }

  const handleClearAll = () => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete('categories')
    
    const searchQuery = searchParams.get('search')
    if (searchQuery) {
      newParams.set('search', searchQuery)
    }

    const newUrl = newParams.toString() ? `/blog?${newParams.toString()}` : '/blog'
    router.push(newUrl)
  }

  const sortedCategories = [...categories].sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return (a.displayOrder || 0) - (b.displayOrder || 0)
  })

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          Filter by Category
        </h3>
        
        {selectedCategories.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {sortedCategories.map((category) => {
          const isSelected = selectedCategories.includes(category.slug!)
          
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryToggle(category.slug!)}
              className={cn(
                'px-3 py-2 text-xs font-semibold transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary/40',
                'transform hover:scale-105 active:scale-95',
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              )}
            >
              <span className="flex items-center gap-2">
                {category.name}
                {showPostCounts && category.postCount && (
                  <span className={cn(
                    'px-1.5 py-0.5 rounded-full text-xs font-bold',
                    isSelected 
                      ? 'bg-primary-foreground/20 text-primary-foreground' 
                      : 'bg-foreground/10 text-foreground'
                  )}>
                    {category.postCount}
                  </span>
                )}
              </span>
            </button>
          )
        })}
      </div>

      {selectedCategories.length > 0 && (
        <div className="p-3 bg-primary/10 border border-primary/20">
          <p className="text-xs text-primary">
            Filtering by: {selectedCategories.join(', ')}
          </p>
        </div>
      )}
    </div>
  )
}