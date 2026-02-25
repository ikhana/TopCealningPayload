'use client'
import type { ProductConfiguration } from '@/components/product/ProductConfigurator'
import type { Product } from '@/payload-types'

import { ProductConfigurator } from '@/components/product/ProductConfigurator'
import { ProductDescription } from '@/components/product/ProductDescription'
import { ProductGalleryWithCart } from '@/components/product/ProductGalleryWithCart'
import React, { useCallback, useState } from 'react'

interface ProductClientWrapperProps {
  product: Product
  gallery?: any[]
}

export const ProductClientWrapper: React.FC<ProductClientWrapperProps> = ({
  product,
  gallery
}) => {
  const [configuration, setConfiguration] = useState<ProductConfiguration | null>(null)

  const handleConfigurationChange = useCallback((config: ProductConfiguration) => {
    setConfiguration(config)
  }, [])

  const hasCustomization = Boolean(
    product.enableComponentCustomization ||
    product.availableAddOns?.length ||
    product.personalizationOptions?.length
  )

  return (
    <div className="flex flex-col rounded-xl border border-antique-brass/20 dark:border-charcoal-gold/20 p-6 md:p-8 lg:p-10 lg:flex-row lg:gap-10 bg-gradient-to-br from-antique-white via-white to-antique-white/80 dark:from-charcoal-black/90 dark:via-charcoal-black dark:to-charcoal-black/80 shadow-xl shadow-copper-bourbon/5 dark:shadow-charcoal-gold/5">
      
      <div className="h-full w-full basis-full lg:basis-1/2">
        {gallery?.length && (
          <ProductGalleryWithCart 
            images={gallery}
            product={product}
            configuration={configuration}
          />
        )}
      </div>

      <div className="basis-full lg:basis-1/2 space-y-8">
        
        <div>
          <ProductDescription 
            product={product} 
            onConfigurationChange={handleConfigurationChange}
          />
        </div>

        {hasCustomization && (
          <div className="relative">
            <div className="absolute -top-4 left-0 right-0 flex items-center">
              <div className="flex-1 border-t border-copper-bourbon/20 dark:border-charcoal-gold/20"></div>
              <h2 className="px-4 text-xs font-bold uppercase tracking-wider text-copper-bourbon dark:text-charcoal-gold">
                Customize Your Product
              </h2>
              <div className="flex-1 border-t border-copper-bourbon/20 dark:border-charcoal-gold/20"></div>
            </div>
            
            <div className="relative pt-2 pb-5 px-5 mt-6 bg-gradient-to-br from-white via-antique-white/50 to-white dark:from-charcoal-black/80 dark:via-charcoal-black dark:to-charcoal-black/80 border border-antique-brass/15 dark:border-charcoal-gold/20 rounded-xl shadow-lg shadow-copper-bourbon/5 dark:shadow-charcoal-gold/5">
              <ProductConfigurator 
                product={product} 
                onConfigurationChange={handleConfigurationChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}