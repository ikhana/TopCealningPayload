// src/components/product/EnhancedAddToCart.tsx
"use client"
import type { ProductConfiguration } from '@/components/product/ProductConfigurator'
import type { Product } from '@/payload-types'

import { Button } from '@/components/ui/button'
import { useCart } from '@/providers/Cart'
import { cn } from '@/utilities/cn'
import { AlertCircle, Check, Package, ShoppingCart } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useCallback, useMemo, useState } from 'react'

type ProductVariant = NonNullable<Product['variants']>[number]

interface EnhancedAddToCartProps {
  product: Product
  variants?: ProductVariant[]
  configuration?: ProductConfiguration | null
  className?: string
  compact?: boolean
}

export function EnhancedAddToCart({ 
  product, 
  variants, 
  configuration,
  className,
  compact = false
}: EnhancedAddToCartProps) {
  const { addItemToCart } = useCart()
  const searchParams = useSearchParams()
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const selectedVariantId = searchParams.get('variant')

  const productUrl = useMemo(() => {
    const base = `/products/${product.slug}`
    const params = new URLSearchParams()

    if (selectedVariantId) {
      params.set('variant', selectedVariantId)
    }

    // Add configuration to URL for sharing
    if (configuration) {
      if (configuration.selectedAddOns.length > 0) {
        params.set('addons', configuration.selectedAddOns.join(','))
      }
      if (configuration.personalization.length > 0) {
        // Encode personalization data safely
        const personalizationData = configuration.personalization.map(p => ({
          o: p.optionId,
          v: p.value,
          s: p.subValues // Include subValues for style fields
        }))
        params.set('p', btoa(JSON.stringify(personalizationData)))
      }
      if (Object.keys(configuration.selectedComponents || {}).length > 0) {
        params.set('components', btoa(JSON.stringify(configuration.selectedComponents)))
      }
    }

    return params.toString() ? `${base}?${params.toString()}` : base
  }, [product.slug, selectedVariantId, configuration])

  const addToCart = useCallback(
    async (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault()
      setIsAdding(true)

      try {
        let unitPrice = product.price || 0

        // Handle variant pricing
        if (selectedVariantId && product.enableVariants && product?.variants?.length) {
          const variant = product?.variants?.find((variant) => variant.id === selectedVariantId)
          unitPrice = variant?.price || 0
        }

        // Use configured price if available
        if (configuration?.calculatedPrice) {
          unitPrice = configuration.calculatedPrice
        }

        // Create a unique ID for this cart item that includes configuration
        // This ensures that the same product with different configurations are treated as separate items
        const configurationHash = configuration 
          ? `-${btoa(JSON.stringify({
              a: configuration.selectedAddOns.sort(),
              c: configuration.selectedComponents,
              p: configuration.personalization
                .sort((a, b) => a.optionId.localeCompare(b.optionId))
                .map(p => ({ o: p.optionId, v: p.value, s: p.subValues }))
            })).substring(0, 12)}`
          : ''
        
        const cartItemId = `${product.id}${selectedVariantId ? `-${selectedVariantId}` : ''}${configurationHash}`

        addItemToCart({
          id: cartItemId,
          product: product.id,
          quantity: 1,
          url: productUrl,
          unitPrice,
          variant: selectedVariantId ?? undefined,
          // Store full configuration data in variantID field for now
          // In production, you might want to add a dedicated field for configuration
          variantID: configuration ? JSON.stringify(configuration) : selectedVariantId ?? undefined,
        })

        // Show success state
        setJustAdded(true)
        setTimeout(() => setJustAdded(false), 2000)

      } catch (error) {
        console.error('Error adding to cart:', error)
      } finally {
        setIsAdding(false)
      }
    },
    [addItemToCart, product, productUrl, selectedVariantId, configuration],
  )

  // Validation for add to cart
  const { isDisabled, disabledReason } = useMemo(() => {
    // Stock validation
    if (product.enableVariants) {
      if (!selectedVariantId) {
        return { isDisabled: true, disabledReason: 'Please select a variant' }
      }

      const variant = product.variants?.find((variant) => variant.id === selectedVariantId)

      if (!variant) {
        return { isDisabled: true, disabledReason: 'Invalid variant selected' }
      }

      if (variant.stock === 0) {
        return { isDisabled: true, disabledReason: 'Out of stock' }
      }
    } else {
      if (product.stock === 0) {
        return { isDisabled: true, disabledReason: 'Out of stock' }
      }
    }

    // Component validation (check if required components are selected)
    if (product.enableComponentCustomization && product.componentConfig?.components) {
      const requiredComponents = product.componentConfig.components.filter(comp => {
        if (typeof comp === 'number' || !comp) return false
        return comp.required === true
      })

      for (const component of requiredComponents) {
        if (typeof component === 'number' || !component) continue
        const componentId = String(component.id)
        const isSelected = configuration?.selectedComponents?.[componentId]
        
        if (!isSelected) {
          return { 
            isDisabled: true, 
            disabledReason: `Please select ${component.title.toLowerCase()}` 
          }
        }
      }
    }

    // Required personalization validation
    if (product.personalizationOptions && product.personalizationOptions.length > 0) {
      const requiredOptions = product.personalizationOptions.filter(opt => {
        if (typeof opt === 'number' || !opt) return false
        return opt.required === true
      })

      for (const option of requiredOptions) {
        if (typeof option === 'number' || !option) continue
        const hasValue = configuration?.personalization?.find(p => p.optionId === String(option.id))
        
        if (!hasValue || !hasValue.value) {
          return { 
            isDisabled: true, 
            disabledReason: `Please complete ${option.label.toLowerCase()}` 
          }
        }
      }
    }

    return { isDisabled: false, disabledReason: '' }
  }, [selectedVariantId, product, configuration])

  return (
    <div className={cn('space-y-3', className)}>
      
      {/* Add to Cart Button */}
      <Button
        onClick={addToCart}
        disabled={isDisabled || isAdding}
        className={cn(
          // Base styling
          'font-sourcesans font-semibold transition-all duration-300',
          'text-antique-white dark:text-charcoal-black',
          'border border-copper-bourbon/20 dark:border-charcoal-gold/20',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          justAdded && 'bg-green-600 hover:bg-green-600 shadow-green-600/25',
          
          // Compact mode for floating button
          compact ? {
            'w-auto h-10 text-sm px-4': true,
            'bg-copper-bourbon/90 hover:bg-copper-bourbon': true,
            'dark:bg-charcoal-gold/90 dark:hover:bg-charcoal-gold': true,
            'shadow-lg shadow-copper-bourbon/30 dark:shadow-charcoal-gold/30': true,
            'hover:shadow-xl hover:shadow-copper-bourbon/40 dark:hover:shadow-charcoal-gold/40': true,
            'backdrop-blur-sm': true
          } : {
            // Full size styling  
            'w-full h-14 text-lg': true,
            'bg-gradient-to-r from-copper-bourbon to-copper-bourbon/90': true,
            'hover:from-copper-bourbon/90 hover:to-copper-bourbon/80': true,
            'dark:from-charcoal-gold dark:to-charcoal-gold/90': true,
            'dark:hover:from-charcoal-gold/90 dark:hover:to-charcoal-gold/80': true,
            'shadow-lg shadow-copper-bourbon/25 dark:shadow-charcoal-gold/25': true,
            'hover:shadow-xl hover:shadow-copper-bourbon/35 dark:hover:shadow-charcoal-gold/35': true,
            'hover:transform hover:scale-[1.02]': true
          }
        )}
        type="submit"
      >
        <div className="flex items-center justify-center gap-3">
          {isAdding ? (
            <>
              <div className={cn(
                "border-2 border-antique-white/30 border-t-antique-white rounded-full animate-spin",
                compact ? 'w-4 h-4' : 'w-5 h-5'
              )} />
              <span className={compact ? 'hidden sm:inline' : ''}>
                Adding...
              </span>
            </>
          ) : justAdded ? (
            <>
              <Check className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
              <span className={compact ? 'hidden sm:inline' : ''}>
                Added!
              </span>
            </>
          ) : (
            <>
              <ShoppingCart className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
              <span className={compact ? 'hidden sm:inline' : ''}>
                Add to Cart
              </span>
              {configuration?.calculatedPrice && !compact && (
                <span className="ml-2 text-sm opacity-90">
                  ${configuration.calculatedPrice.toFixed(2)}
                </span>
              )}
            </>
          )}
        </div>
      </Button>

      {/* Validation Message - Hide in compact mode */}
      {isDisabled && disabledReason && !compact && (
        <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-300 font-sourcesans">
            {disabledReason}
          </p>
        </div>
      )}

      {/* Configuration Summary - Hide in compact mode */}
      {configuration && !compact && (configuration.selectedAddOns.length > 0 || 
          configuration.personalization.length > 0 || 
          Object.keys(configuration.selectedComponents || {}).length > 0) && (
        <div className="p-4 bg-copper-bourbon/5 dark:bg-charcoal-gold/5 border border-copper-bourbon/20 dark:border-charcoal-gold/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-copper-bourbon dark:text-charcoal-gold" />
            <span className="text-sm font-sourcesans font-medium text-deep-charcoal dark:text-antique-white">
              Your Configuration
            </span>
          </div>
          
          <div className="space-y-1 text-xs text-antique-brass dark:text-smoky-gray font-sourcesans">
            {Object.keys(configuration.selectedComponents || {}).length > 0 && (
              <div>Components: {Object.keys(configuration.selectedComponents).length} selected</div>
            )}
            {configuration.selectedAddOns.length > 0 && (
              <div>Add-ons: {configuration.selectedAddOns.length} selected</div>
            )}
            {configuration.personalization.length > 0 && (
              <div>Personalization: {configuration.personalization.length} options</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}