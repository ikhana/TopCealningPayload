
import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatNumberToCurrency } from '@/utilities/formatNumberToCurrency'
import Link from 'next/link'

export function ProductGridItem({ product }: { product: Partial<Product> }) {
  const { gallery, price, title, categories } = product

  const image = gallery?.[0] && typeof gallery[0] !== 'string' ? gallery[0] : false
  const primaryCategory = Array.isArray(categories) && categories.length > 0 
    ? (typeof categories[0] === 'object' ? categories[0]?.title : null)
    : null

  return (
    <Link 
      className="group block w-full transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-copper-bourbon/50 focus:ring-offset-2 focus:ring-offset-antique-white dark:focus:ring-offset-deep-charcoal rounded-lg motion-reduce:transition-none motion-reduce:hover:transform-none" 
      href={`/products/${product.slug}`}
      aria-label={`View ${title || 'product'} details${price ? ` - ${formatNumberToCurrency(price)}` : ''}`}
    >
      <article 
        className="relative bg-antique-white dark:bg-deep-charcoal rounded-lg overflow-hidden shadow-md hover:shadow-lg hover:shadow-copper-bourbon/20 transition-all duration-300 border border-smoky-gray/10 dark:border-antique-brass/10 hover:border-copper-bourbon/30"
        role="article"
        aria-labelledby={`product-title-${product.slug}`}
      >
        
        {/* Mobile-optimized image container */}
        <div className="relative aspect-square overflow-hidden">
          {image ? (
            <Media
              className="w-full h-full"
              imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-active:scale-100"
              resource={image}
              alt={`${title || 'Product'} - handcrafted ${primaryCategory || 'item'}`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-charcoal-black/5 to-smoky-gray/10 dark:from-deep-charcoal/30 dark:to-charcoal-black/20 flex items-center justify-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-copper-bourbon/20 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-copper-bourbon/40 rounded-sm" />
              </div>
            </div>
          )}
          
          {/* Mobile-optimized category badge */}
          {primaryCategory && (
            <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-copper-bourbon/90 text-antique-white px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs font-semibold font-sourcesans tracking-wide rounded shadow-sm">
              <span className="sr-only">Category: </span>
              <span className="hidden sm:inline">{primaryCategory}</span>
              <span className="sm:hidden">{primaryCategory.slice(0, 8)}{primaryCategory.length > 8 ? '...' : ''}</span>
            </div>
          )}

          {/* Touch-friendly corner accent */}
          <div 
            className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 border-r border-t border-copper-bourbon/40 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 motion-reduce:transition-none" 
            aria-hidden="true"
          />
        </div>

        {/* Mobile-optimized content section */}
        <div className="p-2.5 sm:p-3">
          
          {/* Mobile-optimized product title with accessibility */}
          <h3 
            id={`product-title-${product.slug}`}
            className="text-sm sm:text-base font-semibold tracking-wide font-playfair text-deep-charcoal dark:text-antique-white mb-1 line-clamp-2 group-hover:text-copper-bourbon group-focus:text-copper-bourbon transition-colors duration-300"
          >
            {title}
          </h3>

          {/* Mobile-optimized price display with semantic markup */}
          {price && (
            <div className="text-sm sm:text-base font-semibold font-sourcesans text-copper-bourbon">
              <span className="sr-only">Price: </span>
              {formatNumberToCurrency(price)}
            </div>
          )}
        </div>

      </article>
    </Link>
  )
}

// Loading skeleton component for when products are loading
export function ProductGridItemSkeleton() {
  return (
    <div className="block w-full">
      <article className="relative bg-antique-white dark:bg-deep-charcoal rounded-lg overflow-hidden border border-smoky-gray/10 dark:border-antique-brass/10">
        
        {/* Skeleton image */}
        <div className="relative aspect-square overflow-hidden bg-charcoal-black/5 dark:bg-charcoal-black/20">
          <div className="w-full h-full bg-gradient-to-br from-smoky-gray/20 via-smoky-gray/10 to-smoky-gray/20 dark:from-charcoal-black/40 dark:via-charcoal-black/20 dark:to-charcoal-black/40 animate-pulse" />
          
          {/* Skeleton category badge */}
          <div className="absolute top-2 left-2 bg-smoky-gray/20 dark:bg-charcoal-black/40 w-16 h-5 rounded animate-pulse" />
        </div>

        {/* Skeleton content */}
        <div className="p-2.5 sm:p-3 space-y-2">
          {/* Skeleton title */}
          <div className="space-y-1">
            <div className="bg-smoky-gray/20 dark:bg-charcoal-black/40 h-4 w-full rounded animate-pulse" />
            <div className="bg-smoky-gray/20 dark:bg-charcoal-black/40 h-4 w-3/4 rounded animate-pulse" />
          </div>
          
          {/* Skeleton price */}
          <div className="bg-smoky-gray/20 dark:bg-charcoal-black/40 h-5 w-20 rounded animate-pulse" />
        </div>

      </article>
    </div>
  )
}

// Error state component for when product data fails to load
export function ProductGridItemError({ retry }: { retry?: () => void }) {
  return (
    <div className="block w-full">
      <article className="relative bg-antique-white dark:bg-deep-charcoal rounded-lg overflow-hidden border border-smoky-gray/10 dark:border-antique-brass/10">
        
        {/* Error image placeholder */}
        <div className="relative aspect-square overflow-hidden bg-charcoal-black/5 dark:bg-charcoal-black/20">
          <div className="w-full h-full bg-gradient-to-br from-smoky-gray/10 to-smoky-gray/20 dark:from-charcoal-black/20 dark:to-charcoal-black/40 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 mx-auto bg-smoky-gray/30 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-smoky-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <span className="text-xs font-sourcesans text-smoky-gray dark:text-antique-white/60">
                Failed to load
              </span>
            </div>
          </div>
        </div>

        {/* Error content */}
        <div className="p-2.5 sm:p-3 text-center">
          <p className="text-sm font-sourcesans text-smoky-gray dark:text-antique-white/70 mb-2">
            Product unavailable
          </p>
          {retry && (
            <button 
              onClick={retry}
              className="text-xs font-semibold font-sourcesans text-copper-bourbon hover:text-copper-bourbon/80 transition-colors duration-300"
            >
              Try again
            </button>
          )}
        </div>

      </article>
    </div>
  )
}