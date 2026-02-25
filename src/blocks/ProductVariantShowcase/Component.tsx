// src/blocks/ProductVariantShowcase/Component.tsx
import type { Product, VariantShowBlock as VariantShowBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { WorkshopButton } from '@/components/ui/WorkshopButton/WorkshopButton'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { ProductShowcaseClient } from './Component.client'

export const VariantShowBlock: React.FC<
  VariantShowBlockProps & {
    id?: string
  }
> = async (props) => {
  const {
    secTitle,
    items,
  } = props

  // Use first product showcase (no more random selection)
  const selectedShowcase = items?.[0]
  if (!selectedShowcase) {
    return null
  }

  // Fetch full product data
  let product = selectedShowcase.product
  if (typeof selectedShowcase.product === 'string' || typeof selectedShowcase.product === 'number') {
    const payload = await getPayload({ config: configPromise })
    const fetchedProduct = await payload.findByID({
      collection: 'products',
      id: String(selectedShowcase.product),
      depth: 2,
    })
    product = fetchedProduct
  }

  if (!product || typeof product === 'string' || typeof product === 'number') {
    return null
  }

  const fullProduct = product as Product
  const productUrl = `/products/${fullProduct.slug || fullProduct.id}`

  // Get product price (simplified logic)
  const productPrice = fullProduct.enableVariants && fullProduct.variants && fullProduct.variants.length > 0
    ? Math.min(...fullProduct.variants.map(v => v.price || 0))
    : fullProduct.price

  return (
    <section className="relative bg-antique-white dark:bg-deep-charcoal w-full py-16 lg:py-24">
      <div className="container">
        
        {/* Product Showcase Hero Section - STEP 1: Minimal Top/Bottom Overlays */}
        {selectedShowcase.hero && typeof selectedShowcase.hero === 'object' && (
          <div className="relative w-full mb-16 lg:mb-24">
            
            {/* Hero Container - Original Size */}
            <div className="relative min-h-[60vh] lg:min-h-[70vh] overflow-hidden shadow-2xl bg-deep-charcoal">
              
              {/* Product Hero Image - Full Coverage */}
              <div className="absolute inset-0">
                <Media
                  resource={selectedShowcase.hero}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover object-center"
                  alt={`${fullProduct.title} - Product Showcase`}
                  priority
                />
              </div>
              
              {/* Top Overlay - 25% from top, deeper gradient */}
              <div 
                className="absolute top-0 left-0 right-0 bg-gradient-to-b from-deep-charcoal/90 via-deep-charcoal/100 to-transparent"
                style={{ height: '25%' }}
              />
              
              {/* Bottom Overlay - 25% from bottom, deeper gradient */}
              <div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-deep-charcoal/90 via-deep-charcoal/100 to-transparent"
                style={{ height: '25%' }}
              />
              
              {/* Top Content - Showcase Heading */}
              <div className="absolute top-0 left-0 right-0 flex items-center justify-center px-6 sm:px-8 lg:px-12" style={{ height: '25%' }}>
                <h1 className="font-playfair text-antique-white font-semibold text-xl sm:text-2xl lg:text-3xl text-center tracking-wide leading-tight">
                  {selectedShowcase.title}
                </h1>
              </div>
              
              {/* Bottom Content - CTA Button */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center px-6 sm:px-8 lg:px-12 pb-8" style={{ height: '25%' }}>
                {selectedShowcase.cta?.enabled && selectedShowcase.cta?.label && (
                  <WorkshopButton
                    as="link"
                    href={productUrl}
                    variant="primary"
                    size="lg"
                  >
                    {selectedShowcase.cta.label}
                  </WorkshopButton>
                )}
              </div>
              
            </div>
          </div>
        )}

        {/* Additional Product Images Section */}
        {selectedShowcase.additionalImages && selectedShowcase.additionalImages.length > 0 && (
          <div className="relative">
            
            {/* Section Title */}
            {secTitle && (
              <div className="text-center mb-12">
                <h2 className="font-playfair text-xl sm:text-2xl lg:text-3xl font-semibold tracking-wide text-deep-charcoal dark:text-antique-white mb-4">
                  {secTitle}
                </h2>
                <div className="w-16 h-0.5 bg-copper-bourbon mx-auto" />
              </div>
            )}
            
            {/* Product Images Grid/Carousel */}
            <ProductShowcaseClient 
              images={selectedShowcase.additionalImages}
              productName={fullProduct.title}
            />
          </div>
        )}
      </div>
    </section>
  )
}