// src/blocks/FeaturedPromotion/Component.tsx
import type { FeaturedPromotionBlock as FeaturedPromotionBlockProps, Media as MediaType, Product } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/cn'
import Link from 'next/link'
import React from 'react'

export const FeaturedPromotionBlock: React.FC<
  FeaturedPromotionBlockProps & {
    id?: string
  }
> = (props) => {
  const {
    title,
    description,
    mediaSource,
    media,
    featuredProduct,
    enableCTA,
    link,
    cornerLabel,
  } = props

  // Determine media to display
  let displayMedia: MediaType | null = null
  let productData: Product | null = null
  let promotionUrl = '#'

  if (mediaSource === 'upload' && media && typeof media === 'object') {
    displayMedia = media
    // Handle link URL properly with type checking
    if (link?.url) {
      promotionUrl = link.url
    } else if (link?.reference?.value && typeof link.reference.value === 'object') {
      promotionUrl = `/${link.reference.value.slug || ''}`
    }
  } else if (mediaSource === 'product' && featuredProduct && typeof featuredProduct === 'object') {
    productData = featuredProduct
    promotionUrl = `/products/${productData.slug || productData.id}`
    
    // Use product image as display media
    if (productData.meta?.image && typeof productData.meta.image === 'object') {
      displayMedia = productData.meta.image
    } else if (productData.gallery?.[0] && typeof productData.gallery[0] === 'object') {
      displayMedia = productData.gallery[0]
    }
  }

  if (!displayMedia) {
    return null
  }

  return (
    <section className="relative bg-antique-white dark:bg-deep-charcoal w-full py-16 lg:py-24">
      <div className="container">
        
        {/* Featured Promotion Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Promotional Content */}
          <div className="relative order-2 lg:order-2">
            
            {/* Corner Label Badge - Enhanced for black card */}
            {cornerLabel && (
              <div className="absolute -top-4 -left-4 bg-copper-bourbon text-antique-white px-4 py-2 rounded-lg shadow-xl border border-charcoal-gold/30 transform -rotate-3 z-10">
                <span className="font-sourcesans font-semibold text-sm tracking-wide uppercase">
                  {cornerLabel}
                </span>
              </div>
            )}
            
            {/* Content Card - Black Theme by Default */}
            <div className="bg-deep-charcoal rounded-lg shadow-xl border-2 border-copper-bourbon/30 p-8 lg:p-10 relative aspect-[4/3] lg:aspect-square flex flex-col justify-center">
              
              <div className="space-y-6">
                {/* Promotional Headline - Increased Size */}
                <h2 className="font-playfair text-antique-white font-semibold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl tracking-wide leading-tight">
                  {title}
                </h2>
                
                {/* Promotional Description */}
                {description && (
                  <div className={cn(
                    // Clean rich text styling for black theme
                    '[&_h2]:font-playfair [&_h2]:text-antique-white [&_h2]:font-semibold [&_h2]:text-lg [&_h2]:sm:text-xl [&_h2]:mb-4',
                    '[&_h3]:font-playfair [&_h3]:text-antique-white [&_h3]:font-semibold [&_h3]:text-base [&_h3]:sm:text-lg [&_h3]:mb-3',
                    '[&_h4]:font-sourcesans [&_h4]:text-antique-white [&_h4]:font-semibold [&_h4]:text-sm [&_h4]:uppercase [&_h4]:tracking-wide [&_h4]:mb-2',
                    '[&_p]:font-sourcesans [&_p]:text-antique-white/90 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:mb-4',
                    '[&_strong]:text-copper-bourbon [&_strong]:font-semibold',
                    '[&_em]:text-charcoal-gold [&_em]:italic',
                    '[&_ul]:space-y-2 [&_ul]:mb-4',
                    '[&_li]:font-sourcesans [&_li]:text-antique-white/90 [&_li]:text-sm [&_li]:leading-relaxed',
                    '[&_a]:text-copper-bourbon [&_a]:underline [&_a]:decoration-copper-bourbon/30 [&_a:hover]:decoration-copper-bourbon/60 [&_a]:transition-colors [&_a]:duration-300'
                  )}>
                    <RichText 
                      data={description} 
                      enableGutter={false} 
                      enableProse={false}
                    />
                  </div>
                )}
                
                {/* Product Price (if featuring a product) */}
                {productData && productData.price && (
                  <div>
                    <div className="bg-copper-bourbon/25 border border-copper-bourbon/50 rounded-lg px-4 py-3 inline-block">
                      <span className="font-sourcesans text-copper-bourbon font-semibold text-lg">
                        ${productData.price}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Custom Promotion Button */}
                {enableCTA && link?.label && (
                  <div className="flex justify-start">
                    {link.newTab || link.url?.startsWith('http') ? (
                      <a
                        href={promotionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'relative inline-flex items-center justify-center font-semibold font-sourcesans tracking-wide',
                          'transition-all duration-300 ease-out cursor-pointer rounded-lg',
                          'px-6 py-3 text-sm lg:text-base min-h-[44px]',
                          // Button styles optimized for black card background
                          link.appearance === 'outline' 
                            ? 'bg-transparent border-2 border-copper-bourbon text-copper-bourbon hover:bg-copper-bourbon hover:text-antique-white'
                            : 'bg-copper-bourbon text-antique-white border-2 border-copper-bourbon hover:bg-charcoal-gold hover:border-charcoal-gold',
                          'hover:scale-105 hover:-translate-y-1 active:scale-95',
                          'shadow-lg shadow-copper-bourbon/25 hover:shadow-xl hover:shadow-copper-bourbon/35',
                          'focus:outline-none focus:ring-4 focus:ring-copper-bourbon/40 focus:ring-offset-2 focus:ring-offset-deep-charcoal'
                        )}
                      >
                        <span className="relative z-10">
                          {link.label}
                        </span>
                        
                        {/* Button accent dot */}
                        <div className="absolute top-2 right-2 w-1 h-1 bg-antique-white/60 rounded-full" />
                      </a>
                    ) : (
                      <Link
                        href={promotionUrl}
                        className={cn(
                          'relative inline-flex items-center justify-center font-semibold font-sourcesans tracking-wide',
                          'transition-all duration-300 ease-out cursor-pointer rounded-lg',
                          'px-6 py-3 text-sm lg:text-base min-h-[44px]',
                          // Button styles optimized for black card background
                          link.appearance === 'outline' 
                            ? 'bg-transparent border-2 border-copper-bourbon text-copper-bourbon hover:bg-copper-bourbon hover:text-antique-white'
                            : 'bg-copper-bourbon text-antique-white border-2 border-copper-bourbon hover:bg-charcoal-gold hover:border-charcoal-gold',
                          'hover:scale-105 hover:-translate-y-1 active:scale-95',
                          'shadow-lg shadow-copper-bourbon/25 hover:shadow-xl hover:shadow-copper-bourbon/35',
                          'focus:outline-none focus:ring-4 focus:ring-copper-bourbon/40 focus:ring-offset-2 focus:ring-offset-deep-charcoal'
                        )}
                      >
                        <span className="relative z-10">
                          {link.label}
                        </span>
                        
                        {/* Button accent dot */}
                        <div className="absolute top-2 right-2 w-1 h-1 bg-antique-white/60 rounded-full" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
              
              {/* Heritage corner accents - enhanced for black theme */}
              <div className="absolute top-4 left-4 w-3 h-3 border-l-2 border-t-2 border-copper-bourbon/70" />
              <div className="absolute bottom-4 right-4 w-3 h-3 border-r-2 border-b-2 border-copper-bourbon/70" />
            </div>
          </div>
          
          {/* Promotional Media */}
          <div className="relative order-1 lg:order-1 group">
            <div className="relative aspect-[4/3] lg:aspect-square rounded-lg overflow-hidden shadow-xl">
              
              {/* Promotional Image */}
              <Media
                resource={displayMedia}
                className="w-full h-full"
                imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt={`${title} - Promotional Image`}
                priority
              />
              
              {/* Subtle overlay for better text contrast if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/20 via-transparent to-transparent" />
              
              {/* Product Badge (if featuring a product) */}
              {productData && (
                <div className="absolute top-4 right-4 bg-antique-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                  <span className="font-sourcesans text-deep-charcoal font-semibold text-xs uppercase tracking-wide">
                    Featured Product
                  </span>
                </div>
              )}
              
              {/* Professional frame border */}
              <div className="absolute inset-0 border-2 border-copper-bourbon/30 rounded-lg" />
              
              {/* Heritage corner details */}
              <div className="absolute top-3 left-3 w-2 h-2 border-l-2 border-t-2 border-antique-white/70" />
              <div className="absolute bottom-3 right-3 w-2 h-2 border-r-2 border-b-2 border-antique-white/70" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Section heritage texture background */}
      <div 
        className="absolute inset-0 opacity-[0.01] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B87333' fill-opacity='0.2'%3E%3Cpath d='M0 0h60v2H0zm0 8h60v2H0zm0 16h60v2H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />
    </section>
  )
}