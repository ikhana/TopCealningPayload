import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface CategoryPageHeaderProps {
  categoryTitle: string
  categoryDescription?: string | null
  productCount: number
  searchValue?: string | null
}

export const CategoryPageHeader: React.FC<CategoryPageHeaderProps> = ({
  categoryTitle,
  categoryDescription,
  productCount,
  searchValue
}) => {
  const resultsText = productCount > 1 ? 'products' : 'product'

  return (
    <div className="bg-antique-white dark:bg-deep-charcoal border-b border-smoky-gray/10 dark:border-antique-brass/10">
      <div className="container py-8 lg:py-12">
        
        {/* Breadcrumb Navigation */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm font-sourcesans">
            
            {/* Home */}
            <li>
              <Link 
                href="/" 
                className="flex items-center text-smoky-gray dark:text-antique-white/70 hover:text-copper-bourbon transition-colors duration-300"
              >
                <Home className="w-4 h-4 mr-1" />
                <span>Home</span>
              </Link>
            </li>
            
            {/* Separator */}
            <li>
              <ChevronRight className="w-4 h-4 text-smoky-gray/50 dark:text-antique-white/40" />
            </li>
            
            {/* Shop */}
            <li>
              <Link 
                href="/shop" 
                className="text-smoky-gray dark:text-antique-white/70 hover:text-copper-bourbon transition-colors duration-300"
              >
                Shop
              </Link>
            </li>
            
            {/* Separator */}
            <li>
              <ChevronRight className="w-4 h-4 text-smoky-gray/50 dark:text-antique-white/40" />
            </li>
            
            {/* Current Category */}
            <li>
              <span className="text-copper-bourbon font-semibold" aria-current="page">
                {categoryTitle}
              </span>
            </li>
            
          </ol>
        </nav>

        {/* Category Header Content */}
        <div className="relative">
          
          {/* Heritage corner accents */}
          <div className="absolute -top-2 -left-2 w-3 h-3 border-l-2 border-t-2 border-copper-bourbon/40" />
          <div className="absolute -bottom-2 -right-2 w-3 h-3 border-r-2 border-b-2 border-copper-bourbon/40" />
          
          {/* Category Title */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-wide font-playfair text-deep-charcoal dark:text-antique-white mb-4">
            {categoryTitle}
          </h1>
          
          {/* Category Description */}
          {categoryDescription && (
            <p className="text-sm font-sourcesans leading-relaxed text-smoky-gray dark:text-antique-white/70 max-w-3xl mb-6">
              {categoryDescription}
            </p>
          )}
          
          {/* Results Summary with Search Query */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
           {/* Product Count & Search Info */}
            <div className="text-sm font-sourcesans text-smoky-gray dark:text-antique-white/70">
              {searchValue ? (
                <span>
                  {productCount === 0 
                    ? `No ${categoryTitle.toLowerCase()} products found for ` 
                    : `${productCount} ${resultsText} in ${categoryTitle} for `
                  }
                  <span className="font-semibold text-copper-bourbon">&ldquo;{searchValue}&rdquo;</span>
                </span>
              ) : (
                <span>
                  {productCount} {resultsText} in {categoryTitle}
                </span>
              )}
            </div>
            {/* Heritage accent line */}
            <div className="w-16 h-0.5 bg-gradient-to-r from-copper-bourbon via-copper-bourbon/80 to-transparent sm:ml-auto" />
          </div>
          
        </div>
      </div>
    </div>
  )
}