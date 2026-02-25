// src/blocks/HeritageProductShowcase/Component.tsx - LCP OPTIMIZED
import type { HeritageProductShowcaseBlock as HeritageProductShowcaseBlockProps } from '@/payload-types'

import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/utilities/cn'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { ProductCarousel } from './ProductCarousel'

type ProductType = {
  id?: string | number
  title?: string
  gallery?: any[]
  categories?: any[]
  description?: any
  price?: number
  enableVariants?: boolean
  variants?: any[]
  slug?: string
  [key: string]: any
}

type ShowcaseProduct = {
  product: ProductType
  customDescription: string
  featured: boolean
  priceType?: 'auto' | 'from' | 'starting' | 'unit' | 'custom' | 'hidden'
  customPrice?: string
  unitText?: string
  overridePrice?: number
}

export const HeritageProductShowcaseBlock: React.FC<
  HeritageProductShowcaseBlockProps & {
    id?: string
  }
> = async (props) => {
  const {
    sectionTitle,
    sectionSubtitle,
    items,
    autoplay,
    speed,
    dots,
    arrows,
  } = props

  let fullProducts: ShowcaseProduct[] = []
  
  if (items?.length) {
    const payload = await getPayload({ config: configPromise })
    
    const productIds = items.map((item: any) => {
      const productId = typeof item.product === 'string' ? item.product : item.product?.id
      return productId
    }).filter(Boolean)

    if (productIds.length > 0) {
      const fetchedProducts = await payload.find({
        collection: 'products',
        where: {
          id: {
            in: productIds,
          },
        },
        depth: 2,
        limit: 5,
      })
      
      const mappedProducts = items.map((item: any) => {
        const productId = typeof item.product === 'string' ? item.product : item.product?.id
        const productData = fetchedProducts.docs.find((p: any) => p.id === productId)
        
        if (!productData) return null
        
        return {
          product: productData as unknown as ProductType,
          customDescription: String(item.desc || ''),
          featured: Boolean(item.featured),
          priceType: item.priceType || 'auto',
          customPrice: item.customPrice || undefined,
          unitText: item.unitText || undefined,
          overridePrice: item.overridePrice || undefined,
        }
      })
      
      fullProducts = mappedProducts.filter((item): item is ShowcaseProduct => item !== null)
    }
  }

  if (!fullProducts.length) {
    return null
  }

  const criticalImages = fullProducts.slice(0, 3).map(item => 
    item.product.gallery?.[0]?.url
  ).filter(Boolean)

  return (
    <>
      {criticalImages.map((imageUrl, index) => (
        <link
          key={index}
          rel="preload"
          as="image"
          href={imageUrl}
          fetchPriority={index === 0 ? "high" : "low"}
        />
      ))}
      
      <section 
        className="relative py-16 lg:py-24 bg-antique-white dark:bg-charcoal-black"
        style={{
          contentVisibility: 'auto',
          containIntrinsicSize: '0 600px'
        }}
      >
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(184,115,51,0.15)_1px,_transparent_0)] bg-[length:20px_20px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {(sectionTitle || sectionSubtitle) && (
            <div className="mb-12 sm:mb-16">
              <SectionHeading
                title={sectionTitle || 'Heritage Collection'}
                subtitle={sectionSubtitle}
                level="h2"
                size="md"
                align="center"
                theme="bourbon" 
                className={cn(
                  'max-w-4xl mx-auto',
                  'text-xl sm:text-2xl lg:text-3xl font-semibold tracking-wide font-playfair'
                )}
              />
            </div>
          )}

          <ProductCarousel 
            products={fullProducts}
            autoplay={autoplay ?? true}
            speed={speed ?? 5000}
            dots={dots ?? true}
            arrows={arrows ?? true}
            slides="5"
            theme="bourbon"
          />
        </div>
      </section>
    </>
  )
}