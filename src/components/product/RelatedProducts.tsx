// src/components/product/RelatedProducts.tsx
import type { Product } from '@/payload-types'
import { cn } from '@/utilities/cn'
import Link from 'next/link'
import React from 'react'

interface RelatedProductsProps {
  products: Product[]
  className?: string
}

const getEffectivePrice = (product: Product): { 
  price: number
  originalPrice?: number
  isOnSale: boolean
  salePercentage?: number
  maxPrice?: number
  isRange?: boolean
} => {
  if (!product.enableVariants) {
    if (product.saleConfiguration?.saleActive && product.saleConfiguration?.salePrice) {
      return {
        price: product.saleConfiguration.salePrice,
        originalPrice: product.price || undefined,
        isOnSale: true,
        salePercentage: product.price ? Math.round((1 - product.saleConfiguration.salePrice / product.price) * 100) : 0
      }
    }
    return {
      price: product.price || 0,
      isOnSale: false,
      salePercentage: 0
    }
  }
  
  if (product.variants && product.variants.length > 0) {
    const activePrices = product.variants
      .filter(v => v.active)
      .map(v => ({
        regular: v.price || 0,
        sale: v.saleActive && v.salePrice ? v.salePrice : null,
        effective: v.saleActive && v.salePrice ? v.salePrice : v.price || 0,
        hasDiscount: v.saleActive && v.salePrice && v.salePrice < (v.price || 0)
      }))
      .filter(p => p.regular > 0)
    
    if (activePrices.length > 0) {
      const effectivePrices = activePrices.map(p => p.effective)
      const minPrice = Math.min(...effectivePrices)
      const maxPrice = Math.max(...effectivePrices)
      const hasDiscount = activePrices.some(p => p.hasDiscount)
      
      const lowestPriceVariant = activePrices.find(p => p.effective === minPrice)
      const salePercentage = lowestPriceVariant && lowestPriceVariant.hasDiscount && lowestPriceVariant.regular
        ? Math.round((1 - minPrice / lowestPriceVariant.regular) * 100)
        : 0
      
      return {
        price: minPrice,
        maxPrice: minPrice !== maxPrice ? maxPrice : undefined,
        isOnSale: hasDiscount,
        isRange: minPrice !== maxPrice,
        salePercentage
      }
    }
  }
  
  return {
    price: 0,
    isOnSale: false,
    salePercentage: 0
  }
}

const formatPrice = (amount: number): string => {
  return `$${(amount / 100).toFixed(2)}`
}

const getProductImage = (product: Product): string | undefined => {
  if (product.meta?.image && typeof product.meta.image === 'object' && 'url' in product.meta.image) {
    return product.meta.image.url || undefined
  }
  
  if (product.gallery?.length) {
    const firstImage = product.gallery[0]
    if (typeof firstImage === 'object' && 'url' in firstImage) {
      return firstImage.url || undefined
    }
  }
  
  return undefined
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products, className }) => {
  if (!products.length) return null

  return (
    <section className={cn("py-16 bg-gradient-to-br from-antique-white via-white to-antique-white/80 dark:from-charcoal-black/90 dark:via-charcoal-black dark:to-charcoal-black/80", className)}>
      <div className="container">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-copper-bourbon dark:bg-charcoal-gold" />
            <div className="w-2 h-2 bg-copper-bourbon dark:bg-charcoal-gold rounded-full" />
            <div className="w-8 h-px bg-copper-bourbon dark:bg-charcoal-gold" />
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-deep-charcoal dark:text-antique-white mb-3">
            You Might Also Love
          </h2>
          
          <p className="text-antique-brass dark:text-smoky-gray font-sourcesans text-lg max-w-md mx-auto">
            Handpicked selections that complement your choice
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const priceInfo = getEffectivePrice(product)
            const imageUrl = getProductImage(product)
            
            return (
              <div key={product.id} className="group">
                <Link 
                  href={`/products/${product.slug}`}
                  className="block"
                >
                  <div className="relative bg-white dark:bg-charcoal-black rounded-xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden border border-antique-brass/10 dark:border-charcoal-gold/10 hover:border-copper-bourbon/30 dark:hover:border-charcoal-gold/30 group-hover:-translate-y-2">
                    
                    <div className="relative aspect-square overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-copper-bourbon/10 to-antique-brass/10 dark:from-charcoal-gold/10 dark:to-charcoal-gold/5 flex items-center justify-center">
                          <div className="text-center text-copper-bourbon/40 dark:text-charcoal-gold/40">
                            <div className="text-4xl mb-2">📦</div>
                            <div className="text-sm font-sourcesans">No Image</div>
                          </div>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {priceInfo.isOnSale && priceInfo.salePercentage && priceInfo.salePercentage > 0 && (
                        <div className="absolute top-4 left-4 z-10">
                          <div className="bg-copper-bourbon text-antique-white px-3 py-1.5 rounded-full text-sm font-bold font-sourcesans shadow-lg">
                            -{priceInfo.salePercentage}%
                          </div>
                        </div>
                      )}
                      
                      <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="bg-white/90 dark:bg-charcoal-black/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                          <svg className="w-4 h-4 text-copper-bourbon dark:text-charcoal-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-playfair font-semibold text-lg text-deep-charcoal dark:text-antique-white mb-3 line-clamp-2 leading-tight group-hover:text-copper-bourbon dark:group-hover:text-charcoal-gold transition-colors duration-300">
                        {product.title}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          {priceInfo.isOnSale && priceInfo.originalPrice ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold font-sourcesans text-copper-bourbon dark:text-charcoal-gold">
                                {formatPrice(priceInfo.price)}
                                {priceInfo.isRange && priceInfo.maxPrice && (
                                  <span className="text-lg"> - {formatPrice(priceInfo.maxPrice)}</span>
                                )}
                              </span>
                              <span className="text-sm font-sourcesans text-antique-brass dark:text-smoky-gray line-through">
                                {formatPrice(priceInfo.originalPrice)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xl font-bold font-sourcesans text-deep-charcoal dark:text-antique-white">
                              {formatPrice(priceInfo.price)}
                              {priceInfo.isRange && priceInfo.maxPrice && (
                                <span className="text-lg"> - {formatPrice(priceInfo.maxPrice)}</span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-copper-bourbon via-antique-brass to-copper-bourbon dark:from-charcoal-gold dark:via-charcoal-gold/60 dark:to-charcoal-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                </Link>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-copper-bourbon hover:bg-antique-brass dark:bg-charcoal-gold dark:hover:bg-charcoal-gold/80 text-antique-white px-8 py-3 rounded-lg font-semibold font-sourcesans transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View All Products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}