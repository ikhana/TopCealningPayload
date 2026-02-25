'use client'

import { cn } from '@/utilities/cn'
import { Search as SearchIcon, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface BlogSearchBarProps {
  placeholder?: string
  className?: string
  onSearch?: (query: string) => void
}

export const BlogSearchBar: React.FC<BlogSearchBarProps> = ({
  placeholder = 'Search articles...',
  className,
  onSearch,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams?.get('search') || '')
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    setSearchValue(searchParams?.get('search') || '')
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedValue = searchValue.trim()
    
    if (onSearch) {
      onSearch(trimmedValue)
      return
    }

    const newParams = new URLSearchParams(searchParams.toString())
    if (trimmedValue) {
      newParams.set('search', trimmedValue)
    } else {
      newParams.delete('search')
    }
    
    router.push(`/blog?${newParams.toString()}`)
  }

  const handleClear = () => {
    setSearchValue('')
    
    if (onSearch) {
      onSearch('')
      return
    }

    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete('search')
    const newUrl = newParams.toString() ? `/blog?${newParams.toString()}` : '/blog'
    
    router.push(newUrl)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsFocused(false)
      ;(e.target as HTMLInputElement).blur()
    }
  }

  return (
    <form 
      className={cn('relative w-full max-w-lg', className)}
      onSubmit={handleSubmit}
      role="search"
      aria-label="Search blog posts"
    >
      <label htmlFor="blog-search" className="sr-only">
        Search blog posts
      </label>
      
      <div className={cn(
        'relative transition-all duration-300',
        isFocused && 'transform scale-[1.02]'
      )}>
        <input
          id="blog-search"
          type="text" 
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            'w-full px-4 py-3 pl-11 pr-10 text-sm font-body transition-all duration-300',
            'bg-background dark:bg-card',
            'text-foreground',
            'placeholder:text-muted-foreground',
            'border border-border',
            'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary',
            'hover:border-primary/30',
            'shadow-sm hover:shadow-md focus:shadow-lg',
          )}
        />
        
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <SearchIcon 
            className={cn(
              'w-4 h-4 transition-colors duration-300',
              isFocused ? 'text-primary' : 'text-muted-foreground'
            )} 
            strokeWidth={2}
          />
        </div>
        
        {searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              'absolute right-3 top-1/2 transform -translate-y-1/2',
              'w-5 h-5 rounded-full transition-all duration-300',
              'bg-muted hover:bg-primary/20 hover:scale-110',
              'focus:outline-none focus:ring-2 focus:ring-primary/40',
              'flex items-center justify-center'
            )}
            aria-label="Clear search"
          >
            <X className="w-3 h-3 text-muted-foreground" strokeWidth={2} />
          </button>
        )}
      </div>
      
      <button type="submit" className="sr-only" aria-label="Submit search">
        Search
      </button>
    </form>
  )
}