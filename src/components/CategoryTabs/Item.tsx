// src/components/CategoryTabs/Item.tsx - LUXURY TAB STYLING
'use client'
import { cn } from '@/utilities/cn'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

type Props = {
  href: string
  title: string
}

export function Item({ href, title }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const q = searchParams.get('q')
  
  // Enhanced active state detection
  const isActive = pathname === href || (href === '/shop' && pathname.startsWith('/shop') && !pathname.includes('/shop/'))
  
  const baseClassName = cn(
    // Base styles - professional typography and spacing
    'relative inline-flex items-center px-4 py-2.5 text-sm font-semibold font-sourcesans tracking-wide rounded-lg transition-all duration-300 cursor-pointer group whitespace-nowrap',
    
    // Focus states for accessibility
    'focus:outline-none focus:ring-2 focus:ring-copper-bourbon/50 focus:ring-offset-2 focus:ring-offset-antique-white dark:focus:ring-offset-deep-charcoal',
    
    // Reduced motion support
    'motion-reduce:transition-none',
    
    // Active state - Copper bourbon luxury styling
    isActive ? [
      'bg-copper-bourbon text-antique-white shadow-lg shadow-copper-bourbon/25',
      'border border-copper-bourbon/20',
    ] : [
      // Inactive state - subtle charcoal & bourbon theme
      'text-smoky-gray dark:text-antique-white/80 bg-charcoal-black/5 dark:bg-charcoal-black/10',
      'border border-smoky-gray/10 dark:border-antique-brass/10',
      'hover:bg-copper-bourbon/10 hover:text-copper-bourbon hover:border-copper-bourbon/20',
      'hover:shadow-md hover:shadow-copper-bourbon/15 hover:-translate-y-0.5',
    ]
  )

  if (isActive) {
    return (
      <span
        className={baseClassName}
        aria-current="page"
      >
        {/* Tab content */}
        <span className="relative z-10">
          {title}
        </span>
        
        {/* Active indicator accent */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-4 h-0.5 bg-antique-white/80 rounded-full" />
      </span>
    )
  }

  return (
    <Link
      className={baseClassName}
      href={href}
      prefetch={false}
      role="link"
    >
      {/* Tab content */}
      <span className="relative z-10">
        {title}
      </span>
      
      {/* Hover indicator for inactive tabs */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-0 h-0.5 bg-copper-bourbon rounded-full transition-all duration-300 group-hover:w-4" />
      
      {/* Heritage corner accent - appears on hover for inactive tabs */}
      <div className="absolute top-1 right-1 w-1 h-1 border-r border-t border-copper-bourbon/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Link>
  )
}