// src/components/Header/Search.tsx - CHARCOAL & BOURBON LUXURY THEME
'use client'

import { cn } from '@/utilities/cn'
import { createUrl } from '@/utilities/createUrl'
import { Search as SearchIcon, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

export function Search() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams?.get('q') || '')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Update search value when URL changes
  useEffect(() => {
    setSearchValue(searchParams?.get('q') || '')
  }, [searchParams])

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const newParams = new URLSearchParams(searchParams.toString())

    if (searchValue.trim()) {
      newParams.set('q', searchValue.trim())
    } else {
      newParams.delete('q')
    }

    router.push(createUrl('/search', newParams))
  }

  const handleClear = () => {
    setSearchValue('')
    inputRef.current?.focus()
    
    // Clear search results
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete('q')
    router.push(createUrl('/search', newParams))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      inputRef.current?.blur()
      setIsFocused(false)
    }
  }

  return (
    <form 
      className="relative w-full max-w-xl lg:w-80 xl:w-full group" 
      onSubmit={onSubmit}
      role="search"
      aria-label="Search products"
    >
      
      {/* Enhanced search input container */}
      <div className={cn(
        'relative transition-all duration-300',
        isFocused && 'transform scale-[1.02]'
      )}>
        
        {/* Search input - Luxury Charcoal & Bourbon styling */}
        <input
          ref={inputRef}
          autoComplete="off"
          className={cn(
            // Base styling - professional typography and spacing
            'w-full px-4 py-2.5 pl-11 pr-10 text-sm font-sourcesans rounded-lg transition-all duration-300',
            
            // Charcoal & Bourbon theme colors
            'bg-charcoal-black/5 dark:bg-charcoal-black/20',
            'text-deep-charcoal dark:text-antique-white',
            'placeholder:text-smoky-gray/60 dark:placeholder:text-antique-white/50',
            
            // Border and focus states
            'border border-smoky-gray/20 dark:border-antique-brass/20',
            'focus:outline-none focus:ring-2 focus:ring-copper-bourbon/40 focus:border-copper-bourbon',
            'hover:border-copper-bourbon/30',
            
            // Enhanced shadows
            'shadow-sm hover:shadow-md focus:shadow-lg',
            'hover:shadow-copper-bourbon/10 focus:shadow-copper-bourbon/20',
            
            // Accessibility
            'motion-reduce:transition-none'
          )}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          name="search"
          placeholder="Search handcrafted pieces..."
          type="search"
          aria-label="Search for products"
        />
        
        {/* Search icon - positioned on the left */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <SearchIcon 
            className={cn(
              'w-4 h-4 transition-colors duration-300',
              isFocused 
                ? 'text-copper-bourbon' 
                : 'text-smoky-gray/60 dark:text-antique-white/60'
            )} 
            strokeWidth={2}
          />
        </div>
        
        {/* Clear button - appears when there's text */}
        {searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              'absolute right-3 top-1/2 transform -translate-y-1/2',
              'w-5 h-5 rounded-full bg-smoky-gray/20 dark:bg-antique-white/20',
              'flex items-center justify-center transition-all duration-300',
              'hover:bg-copper-bourbon/20 hover:scale-110',
              'focus:outline-none focus:ring-2 focus:ring-copper-bourbon/40'
            )}
            aria-label="Clear search"
          >
            <X className="w-3 h-3 text-smoky-gray dark:text-antique-white" strokeWidth={2} />
          </button>
        )}
        
        {/* Heritage corner accent - appears on focus */}
        <div className={cn(
          'absolute top-1 right-1 w-1.5 h-1.5 border-r border-t border-copper-bourbon/40 transition-opacity duration-300',
          isFocused ? 'opacity-100' : 'opacity-0'
        )} />
      </div>
      
      {/* Enhanced submit button - hidden but accessible */}
      <button 
        type="submit" 
        className="sr-only"
        aria-label="Submit search"
      >
        Search
      </button>
      
      {/* Professional search suggestions container (for future enhancement) */}
     {isFocused && searchValue && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-antique-white dark:bg-deep-charcoal border border-smoky-gray/20 dark:border-antique-brass/20 rounded-lg shadow-xl shadow-copper-bourbon/10 z-50 overflow-hidden">
          <div className="p-3 text-sm font-sourcesans text-smoky-gray dark:text-antique-white/70">
            <p>Press Enter to search for &ldquo;{searchValue}&rdquo;</p>
          </div>
        </div>
      )}
    </form>
  )
}

// Enhanced skeleton with Charcoal & Bourbon theme
export function SearchSkeleton() {
  return (
    <div className="relative w-full max-w-xl lg:w-80 xl:w-full">
      <div className="relative">
        <div className={cn(
          'w-full px-4 py-2.5 pl-11 pr-10 rounded-lg animate-pulse',
          'bg-charcoal-black/5 dark:bg-charcoal-black/20',
          'border border-smoky-gray/20 dark:border-antique-brass/20'
        )} />
        
        {/* Search icon skeleton */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 bg-smoky-gray/30 dark:bg-antique-white/30 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}