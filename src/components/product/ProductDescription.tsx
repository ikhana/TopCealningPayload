'use client'

import type { ProductConfiguration } from '@/components/product/ProductConfigurator'
import type { Product } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { Heart, Share2 } from 'lucide-react'
import React, { useState } from 'react'

interface ProductDescriptionProps {
  product: Product
  onConfigurationChange?: (config: ProductConfiguration) => void
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({ 
  product,
  onConfigurationChange 
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false)

  const extractTextFromRichText = (richText: any): string => {
    if (typeof richText === 'string') return richText
    if (!richText?.root?.children) return ''
    
    const extractText = (node: any): string => {
      if (typeof node === 'string') return node
      if (node.text) return node.text
      if (node.children) {
        return node.children.map(extractText).join(' ')
      }
      return ''
    }
    
    return richText.root.children.map(extractText).join(' ').trim()
  }

  const getCategoryTitles = (): string[] => {
    if (!product.categories) return []
    
    return product.categories
      .map(cat => {
        if (typeof cat === 'number') return null
        return cat?.title || null
      })
      .filter((title): title is string => title !== null)
  }

  const getProductPrice = () => {
    if (!product.enableVariants) {
      if (product.saleConfiguration?.saleActive && product.saleConfiguration?.salePrice) {
        return {
          price: product.saleConfiguration.salePrice,
          originalPrice: product.price || undefined,
          isOnSale: true,
          discountPercentage: product.price ? Math.round((1 - product.saleConfiguration.salePrice / product.price) * 100) : 0
        }
      }
      return {
        price: product.price || 0,
        isOnSale: false,
        discountPercentage: 0
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
        const discountPercentage = lowestPriceVariant && lowestPriceVariant.hasDiscount && lowestPriceVariant.regular
          ? Math.round((1 - minPrice / lowestPriceVariant.regular) * 100)
          : 0
        
        return {
          price: minPrice,
          maxPrice: minPrice !== maxPrice ? maxPrice : undefined,
          isOnSale: hasDiscount,
          isRange: minPrice !== maxPrice,
          discountPercentage
        }
      }
    }
    
    return {
      price: 0,
      isOnSale: false,
      discountPercentage: 0
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: extractTextFromRichText(product.description),
      url: window.location.href,
    }

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
      }
    } catch (err) {
      console.error('Error sharing:', err)
    }
  }

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted)
  }

  const priceInfo = getProductPrice()
  const categories = getCategoryTitles()
  const hasStock = product.enableVariants 
    ? product.variants?.some(v => v.active && (v.stock || 0) > 0)
    : (product.stock || 0) > 0

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="px-3 py-1 text-xs font-medium bg-copper-bourbon/10 text-copper-bourbon rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleWishlistToggle}
            className={cn(
              "p-2 rounded-full transition-all duration-200",
              isWishlisted 
                ? "bg-red-50 text-red-600" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
          </button>
          
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
            aria-label="Share product"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight font-playfair text-deep-charcoal dark:text-antique-white">
          {product.title}
        </h1>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-3 flex-wrap">
          {priceInfo.isOnSale && priceInfo.originalPrice && (
            <span className="text-2xl text-smoky-gray line-through">
              ${(priceInfo.originalPrice / 100).toFixed(2)}
            </span>
          )}
          <span className={cn(
            "text-3xl font-bold",
            priceInfo.isOnSale ? "text-red-600 dark:text-red-500" : "text-deep-charcoal dark:text-antique-white"
          )}>
            ${(priceInfo.price / 100).toFixed(2)}
            {priceInfo.isRange && priceInfo.maxPrice && (
              <span className="text-2xl"> - ${(priceInfo.maxPrice / 100).toFixed(2)}</span>
            )}
          </span>
          {priceInfo.isOnSale && priceInfo.discountPercentage > 0 && (
            <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded-full">
              SAVE {priceInfo.discountPercentage}%
            </span>
          )}
        </div>
        
        {product.enableVariants && priceInfo.isRange && (
          <p className="text-sm text-smoky-gray dark:text-antique-white/70">
            Price varies by selection
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className={cn(
          "w-2 h-2 rounded-full",
          hasStock ? "bg-green-500" : "bg-red-500"
        )} />
        <span className={cn(
          "text-sm font-medium",
          hasStock ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
        )}>
          {hasStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {product.description && (
        <div className="prose prose-sm max-w-none text-smoky-gray dark:text-antique-white/80">
          <p className="leading-relaxed">
            {extractTextFromRichText(product.description)}
          </p>
        </div>
      )}

      {product.id && (
        <div className="text-xs text-smoky-gray dark:text-antique-white/60 pt-4 border-t border-gray-200 dark:border-gray-700">
          SKU: {product.id}
        </div>
      )}
    </div>
  )
}