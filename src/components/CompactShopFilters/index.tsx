'use client'

import { cn } from '@/utilities/cn'
import { ChevronDown, Search, SortAsc, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export const CompactShopFilters: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '')
  const [isFocused, setIsFocused] = useState(false)
  
  const currentSort = searchParams.get('sort') || 'title'
  
  // Update search value when URL changes
  useEffect(() => {
    setSearchValue(searchParams.get('q') || '')
  }, [searchParams])
  
  const sortOptions = [
    { label: 'Alphabetic A-Z', value: 'title' },
    { label: 'Alphabetic Z-A', value: '-title' },
    { label: 'Latest arrivals', value: '-createdAt' },
    { label: 'Price: Low to high', value: 'price' },
    { label: 'Price: High to low', value: '-price' },
  ]
  
  const currentSortLabel = sortOptions.find(opt => opt.value === currentSort)?.label || 'Sort'

  const handleSortChange = (sortValue: string) => {
    const newParams = new URLSearchParams(searchParams.toString())
    if (sortValue === 'title') {
      newParams.delete('sort')
    } else {
      newParams.set('sort', sortValue)
    }
    router.push(`${pathname}?${newParams.toString()}`)
    setSortDropdownOpen(false)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newParams = new URLSearchParams(searchParams.toString())
    if (searchValue.trim()) {
      newParams.set('q', searchValue.trim())
    } else {
      newParams.delete('q')
    }
    router.push(`${pathname}?${newParams.toString()}`)
  }

  const handleClearSearch = () => {
    setSearchValue('')
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete('q')
    router.push(`${pathname}?${newParams.toString()}`)
  }

  return (
    <div className="bg-antique-white dark:bg-deep-charcoal border-b border-smoky-gray/10 dark:border-antique-brass/10">
      <div className="container py-4">
        
        {/* Unified Horizontal Layout */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Left: Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search handcrafted pieces..."
                className={cn(
                  'w-full px-4 py-2.5 pl-11 pr-10 text-sm font-sourcesans rounded-lg transition-all duration-300',
                  'bg-charcoal-black/5 dark:bg-charcoal-black/20',
                  'text-deep-charcoal dark:text-antique-white',
                  'placeholder:text-smoky-gray/60 dark:placeholder:text-antique-white/50',
                  'border border-smoky-gray/20 dark:border-antique-brass/20',
                  'focus:outline-none focus:ring-2 focus:ring-copper-bourbon/40 focus:border-copper-bourbon',
                  'hover:border-copper-bourbon/30'
                )}
              />
              
              {/* Search icon */}
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Search 
                  className={cn(
                    'w-4 h-4 transition-colors duration-300',
                    isFocused 
                      ? 'text-copper-bourbon' 
                      : 'text-smoky-gray/60 dark:text-antique-white/60'
                  )} 
                />
              </div>
              
              {/* Clear button */}
              {searchValue && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className={cn(
                    'absolute right-3 top-1/2 transform -translate-y-1/2',
                    'w-5 h-5 rounded-full bg-smoky-gray/20 dark:bg-antique-white/20',
                    'flex items-center justify-center transition-all duration-300',
                    'hover:bg-copper-bourbon/20 hover:scale-110'
                  )}
                >
                  <X className="w-3 h-3 text-smoky-gray dark:text-antique-white" />
                </button>
              )}
            </div>
          </form>
          
          {/* Right: Sort Dropdown */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-semibold font-sourcesans tracking-wide rounded-lg transition-all duration-300 min-w-[180px] justify-between',
                'bg-charcoal-black/5 dark:bg-charcoal-black/20 text-deep-charcoal dark:text-antique-white',
                'border border-smoky-gray/20 dark:border-antique-brass/20',
                'hover:bg-copper-bourbon/10 hover:border-copper-bourbon/30 hover:text-copper-bourbon',
                'focus:outline-none focus:ring-2 focus:ring-copper-bourbon/50',
                sortDropdownOpen && 'bg-copper-bourbon/10 border-copper-bourbon/30 text-copper-bourbon'
              )}
            >
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4" />
                <span className="truncate">{currentSortLabel}</span>
              </div>
              <ChevronDown 
                className={cn(
                  'w-4 h-4 transition-transform duration-300',
                  sortDropdownOpen && 'rotate-180'
                )} 
              />
            </button>

            {/* Sort Dropdown Menu */}
            {sortDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setSortDropdownOpen(false)}
                />
                
                <div className="absolute right-0 top-full mt-2 w-56 bg-antique-white dark:bg-deep-charcoal border border-smoky-gray/20 dark:border-antique-brass/20 rounded-lg shadow-lg shadow-copper-bourbon/10 z-50 py-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={cn(
                        'w-full px-4 py-2.5 text-left text-sm font-sourcesans transition-colors duration-200',
                        currentSort === option.value
                          ? 'bg-copper-bourbon/20 text-copper-bourbon font-semibold'
                          : 'text-deep-charcoal dark:text-antique-white hover:bg-copper-bourbon/10 hover:text-copper-bourbon'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
        </div>
        
      </div>
    </div>
  )
}