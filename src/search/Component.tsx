// src/search/Component.tsx - CHARCOAL & BOURBON LUXURY THEME
'use client'

import { cn } from '@/utilities/cn'
import { useDebounce } from '@payloadcms/ui'
import { Search as SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export const Search: React.FC = () => {
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const router = useRouter()

  const debouncedValue = useDebounce(value, 300) // Add 300ms debounce delay

  useEffect(() => {
    router.push(`/search${debouncedValue ? `?q=${encodeURIComponent(debouncedValue)}` : ''}`)
  }, [debouncedValue, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`)
    }
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} role="search" aria-label="Search products">
        
        {/* Hidden label for screen readers */}
        <label htmlFor="search-main" className="sr-only">
          Search for handcrafted products
        </label>
        
        {/* Enhanced search input container */}
        <div className={cn(
          'relative transition-all duration-300',
          isFocused && 'transform scale-[1.01]'
        )}>
          
          {/* Main search input - Professional Charcoal & Bourbon styling */}
          <input
            id="search-main"
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search for handcrafted tasting boards, cigar accessories&hellip;"
            autoComplete="off"
            className={cn(
              // Base styling - professional typography and spacing
              'w-full px-5 py-4 pl-14 text-base font-sourcesans rounded-xl transition-all duration-300',
              
              // Charcoal & Bourbon theme colors
              'bg-antique-white dark:bg-deep-charcoal',
              'text-deep-charcoal dark:text-antique-white',
              'placeholder:text-smoky-gray/60 dark:placeholder:text-antique-white/50',
              
              // Enhanced borders and focus states
              'border-2 border-smoky-gray/20 dark:border-antique-brass/20',
              'focus:outline-none focus:ring-4 focus:ring-copper-bourbon/30 focus:border-copper-bourbon',
              'hover:border-copper-bourbon/40',
              
              // Professional shadows
              'shadow-lg hover:shadow-xl focus:shadow-2xl',
              'hover:shadow-copper-bourbon/15 focus:shadow-copper-bourbon/25',
              
              // Accessibility
              'motion-reduce:transition-none'
            )}
            aria-describedby="search-description"
          />
          
          {/* Search icon - professional positioning */}
          <div className="absolute left-5 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <SearchIcon 
              className={cn(
                'w-5 h-5 transition-colors duration-300',
                isFocused 
                  ? 'text-copper-bourbon' 
                  : 'text-smoky-gray/60 dark:text-antique-white/60'
              )} 
              strokeWidth={2}
            />
          </div>
          
          {/* Heritage corner accents - subtle luxury touches */}
          <div className={cn(
            'absolute top-2 right-2 w-2 h-2 border-r border-t border-copper-bourbon/40 transition-opacity duration-300',
            isFocused ? 'opacity-100' : 'opacity-30'
          )} />
          <div className={cn(
            'absolute bottom-2 left-2 w-2 h-2 border-l border-b border-copper-bourbon/40 transition-opacity duration-300',
            isFocused ? 'opacity-100' : 'opacity-30'
          )} />
        </div>
        
        {/* Hidden submit button for accessibility */}
        <button 
          type="submit" 
          className="sr-only"
          aria-label="Submit search"
        >
          Search
        </button>
        
        {/* Search description for screen readers */}
        <div id="search-description" className="sr-only">
          Search through our collection of handcrafted bourbon tasting boards, cigar accessories, and premium craftsmanship pieces
        </div>
        
      </form>
      
      {/* Professional search hints */}
      {value && (
        <div className="mt-3 text-center">
          <p className="text-sm font-sourcesans text-smoky-gray dark:text-antique-white/70">
            Searching for &ldquo;{value}&rdquo;&hellip;
          </p>
        </div>
      )}
    </div>
  )
}