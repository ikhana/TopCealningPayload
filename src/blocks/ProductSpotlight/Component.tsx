// src/blocks/ProductSpotlight/Component.tsx
import type { Category, Media as MediaType, Product, ProductSpotlightBlock as ProductSpotlightBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'
import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

export const ProductSpotlightBlock: React.FC<
  ProductSpotlightBlockProps & {
    id?: string
  }
> = async (props) => {
  const {
    ctaButton,
    spotlightType,
    selectedProducts,
    selectedCategories,
    spotlightLabels,
    layout,
    enableHoverEffects,
    bg,
    pad,
  } = props

  // Get the selected items based on spotlight type
  const selectedItems = spotlightType === 'products' ? selectedProducts : selectedCategories

  if (!selectedItems || selectedItems.length === 0 || !spotlightLabels || spotlightLabels.length === 0) {
    return null
  }

  // Fetch full data following your established patterns
  const payload = await getPayload({ config: configPromise })
  
  const enrichedItems = await Promise.all(
    selectedItems.slice(0, 3).map(async (item, index) => {
      let fullData: Product | Category | null = null
      let linkUrl = ''
      let imageResource: number | MediaType | null = null

      // Get corresponding label data
      const labelData = spotlightLabels[index]
      if (!labelData) {
        return null
      }

      if (spotlightType === 'products') {
        // Handle products - following your ProductVariantShowcase pattern
        if (typeof item === 'string' || typeof item === 'number') {
          fullData = await payload.findByID({
            collection: 'products',
            id: String(item),
            depth: 2, // Get gallery images
          }) as Product
        } else {
          fullData = item as Product
        }
        
        // Generate product URL (following your established pattern)
        linkUrl = `/products/${fullData?.slug || fullData?.id}`
        
        // Image priority: custom image > first gallery image
        imageResource = labelData.customImage || (fullData as Product)?.gallery?.[0] || null
        
      } else if (spotlightType === 'categories') {
        // Handle categories - following your ShopByCategories pattern
        if (typeof item === 'string' || typeof item === 'number') {
          fullData = await payload.findByID({
            collection: 'categories',
            id: String(item),
            depth: 1,
          }) as Category
        } else {
          fullData = item as Category
        }
        
        // Generate category URL (following your ShopByCategories pattern)
        linkUrl = `/shop/${fullData?.slug || fullData?.id}`
        
        // Image priority: custom image > category image
        imageResource = labelData.customImage || (fullData as Category)?.image || null
      }

      return {
        fullData,
        linkUrl,
        imageResource,
        customLabel: labelData.customLabel,
        id: index,
      }
    })
  )

  // Filter out any null items
  const validItems = enrichedItems.filter(Boolean)

  if (validItems.length === 0) {
    return null
  }

  // Safe defaults (following your utility patterns)
  const safeLayout = layout || 'even'
  const safeBg = bg || 'parchment'
  const safePad = pad || 'large'
  const safeHoverEffects = enableHoverEffects !== false

  // Background classes (consistent with your other blocks)
  const backgroundClasses = {
    parchment: 'bg-parchment',
    white: 'bg-white',
    charcoal: 'bg-charcoal text-parchment',
    bourbon: 'bg-gradient-to-br from-parchment to-bourbon/10',
  }

  // Padding classes (consistent with your other blocks)
  const paddingClasses = {
    small: 'py-8 lg:py-12',
    medium: 'py-12 lg:py-16',
    large: 'py-16 lg:py-24',
    xl: 'py-20 lg:py-32',
  }

  return (
    <section className={cn('w-full relative', backgroundClasses[safeBg], paddingClasses[safePad])}>
      <div className="container mx-auto px-4">
        
        {/* CTA Button - Top Right */}
        {ctaButton?.enabled && (
          <div className="flex justify-end mb-8">
            <Button
              asChild
              variant={ctaButton.style === 'outline' ? 'outline' : 'default'}
              className={cn(
                'px-6 py-2 text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105',
                ctaButton.style === 'bourbon' && 'bg-bourbon hover:bg-bourbon/90 text-white',
                ctaButton.style === 'charcoal' && 'bg-charcoal hover:bg-charcoal/90 text-white',
                ctaButton.style === 'outline' && 'border-2 border-bourbon text-bourbon hover:bg-bourbon hover:text-white',
              )}
            >
              <Link href={ctaButton.link || (spotlightType === 'products' ? '/products' : '/shop')}>
                {ctaButton.label || 'SHOP GIFTS'}
              </Link>
            </Button>
          </div>
        )}

        {/* Spotlight Grid */}
        {safeLayout === 'even' ? (
          // Even 3-column grid
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {validItems.map((item, index) => {
              if (!item) return null
              
              return (
                <Link
                  key={item.id || index}
                  href={item.linkUrl}
                  className={cn(
                    'group block relative overflow-hidden rounded-lg shadow-lg bg-white',
                    safeHoverEffects && 'hover:shadow-xl transition-all duration-300 hover:-translate-y-2'
                  )}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden aspect-[4/3] lg:aspect-[10/9]">
                    {item.imageResource ? (
                      <Media
                        resource={typeof item.imageResource === 'number' ? String(item.imageResource) : item.imageResource}
                        className="w-full h-full"
                        imgClassName={cn(
                          'w-full h-full object-cover',
                          safeHoverEffects && 'transition-transform duration-500 group-hover:scale-105'
                        )}
                      />
                    ) : (
                      // Fallback for items without images
                      <div className="w-full h-full bg-gradient-to-br from-parchment to-bourbon/20 flex items-center justify-center">
                        <span className="text-bourbon/60 text-sm font-medium">
                          {spotlightType === 'products' ? 'Product Image' : 'Category Image'}
                        </span>
                      </div>
                    )}
                    
                    {/* Subtle heritage overlay on hover */}
                    {safeHoverEffects && (
                      <div className="absolute inset-0 bg-bourbon/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    )}
                  </div>

                  {/* Custom Label - Bottom Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-bourbon/90 backdrop-blur-sm text-white p-4 text-center">
                    <h3 className="font-bold text-sm md:text-base tracking-wider uppercase leading-tight">
                      {item.customLabel}
                    </h3>
                  </div>

                  {/* Heritage texture overlay */}
                  <div 
                    className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C28033' fill-opacity='0.3'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3Ccircle cx='0' cy='20' r='1'/%3E%3Ccircle cx='40' cy='20' r='1'/%3E%3Ccircle cx='20' cy='0' r='1'/%3E%3Ccircle cx='20' cy='40' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      backgroundRepeat: 'repeat'
                    }}
                  />
                </Link>
              )
            })}
          </div>
        ) : (
          // Featured + 2 side layout - adjusted proportions
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Featured item (60% width on desktop, full width on mobile) */}
            {validItems[0] && (
              <div className="lg:w-[58%]">
                <Link
                  href={validItems[0].linkUrl}
                  className={cn(
                    'group block relative overflow-hidden rounded-lg shadow-lg bg-white h-full',
                    safeHoverEffects && 'hover:shadow-xl transition-all duration-300 hover:-translate-y-2'
                  )}
                >
                  {/* Featured Image Container */}
                  <div className="relative overflow-hidden aspect-[4/3] lg:aspect-[5/2] h-full">
                    {validItems[0].imageResource ? (
                      <Media
                        resource={typeof validItems[0].imageResource === 'number' ? String(validItems[0].imageResource) : validItems[0].imageResource}
                        className="w-full h-full"
                        imgClassName={cn(
                          'w-full h-full object-cover',
                          safeHoverEffects && 'transition-transform duration-500 group-hover:scale-105'
                        )}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-parchment to-bourbon/20 flex items-center justify-center">
                        <span className="text-bourbon/60 text-sm font-medium">
                          {spotlightType === 'products' ? 'Product Image' : 'Category Image'}
                        </span>
                      </div>
                    )}
                    
                    {safeHoverEffects && (
                      <div className="absolute inset-0 bg-bourbon/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    )}
                  </div>

                  {/* Featured Label */}
                  <div className="absolute bottom-0 left-0 right-0 bg-bourbon/90 backdrop-blur-sm text-white p-6 text-center">
                    <h3 className="font-bold text-lg md:text-xl tracking-wider uppercase leading-tight">
                      {validItems[0].customLabel}
                    </h3>
                  </div>

                  {/* Heritage texture overlay */}
                  <div 
                    className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C28033' fill-opacity='0.3'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3Ccircle cx='0' cy='20' r='1'/%3E%3Ccircle cx='40' cy='20' r='1'/%3E%3Ccircle cx='20' cy='0' r='1'/%3E%3Ccircle cx='20' cy='40' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      backgroundRepeat: 'repeat'
                    }}
                  />
                </Link>
              </div>
            )}

            {/* Side items (42% width on desktop, stack vertically) */}
            <div className="lg:w-[42%] space-y-6 lg:flex lg:flex-col lg:justify-between">
              {validItems.slice(1, 3).map((item, index) => {
                if (!item) return null
                
                return (
                  <Link
                    key={item.id || (index + 1)}
                    href={item.linkUrl}
                    className={cn(
                      'group block relative overflow-hidden rounded-lg shadow-lg bg-white flex-1',
                      safeHoverEffects && 'hover:shadow-xl transition-all duration-300 hover:-translate-y-2'
                    )}
                  >
                    {/* Side Image Container */}
                    <div className="relative overflow-hidden aspect-[4/3] lg:aspect-[3/2]">
                      {item.imageResource ? (
                        <Media
                          resource={typeof item.imageResource === 'number' ? String(item.imageResource) : item.imageResource}
                          className="w-full h-full"
                          imgClassName={cn(
                            'w-full h-full object-cover',
                            safeHoverEffects && 'transition-transform duration-500 group-hover:scale-105'
                          )}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-parchment to-bourbon/20 flex items-center justify-center">
                          <span className="text-bourbon/60 text-sm font-medium">
                            {spotlightType === 'products' ? 'Product Image' : 'Category Image'}
                          </span>
                        </div>
                      )}
                      
                      {safeHoverEffects && (
                        <div className="absolute inset-0 bg-bourbon/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      )}
                    </div>

                    {/* Side Label */}
                    <div className="absolute bottom-0 left-0 right-0 bg-bourbon/90 backdrop-blur-sm text-white p-3 text-center">
                      <h3 className="font-bold text-sm md:text-base tracking-wider uppercase leading-tight">
                        {item.customLabel}
                      </h3>
                    </div>

                    {/* Heritage texture overlay */}
                    <div 
                      className="absolute inset-0 opacity-[0.02] pointer-events-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C28033' fill-opacity='0.3'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3Ccircle cx='0' cy='20' r='1'/%3E%3Ccircle cx='40' cy='20' r='1'/%3E%3Ccircle cx='20' cy='0' r='1'/%3E%3Ccircle cx='20' cy='40' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat'
                      }}
                    />
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {validItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No {spotlightType} selected for spotlight.
            </p>
          </div>
        )}
      </div>

      {/* Section heritage texture background (consistent with your other blocks) */}
      <div 
        className="absolute inset-0 opacity-[0.01] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C28033' fill-opacity='0.2'%3E%3Cpath d='M0 0h120v2H0zm0 6h120v2H0zm0 6h120v1H0zm0 3h120v1H0zm0 3h120v2H0zm0 6h120v1H0zm0 3h120v1H0zm0 3h120v2H0zm0 6h120v1H0zm0 3h120v1H0zm0 3h120v2H0zm0 6h120v1H0zm0 3h120v1H0zm0 3h120v2H0zm0 6h120v1H0zm0 3h120v1H0zm0 3h120v2H0zm0 6h120v1H0zm0 3h120v1H0zm0 3h120v2H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />
    </section>
  )
}