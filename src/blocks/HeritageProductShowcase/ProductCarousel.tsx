// src/blocks/HeritageProductShowcase/ProductCarousel.tsx
'use client'
import { cn } from '@/utilities/cn'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import Link from 'next/link'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { formatProductPrice } from './utils/priceFormatter'

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

interface ProductCarouselProps {
  products: ShowcaseProduct[]
  autoplay?: boolean
  speed?: number
  dots?: boolean
  arrows?: boolean
  slides?: string
  theme?: 'light' | 'dark' | 'bourbon'
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  autoplay = true,
  speed = 5000,
  dots = true,
  arrows = true,
  slides = '5',
  theme = 'bourbon',
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const getVisibleCards = useCallback(() => {
    if (!isClient) return 1
    
    if (window.innerWidth < 640) return 1
    if (window.innerWidth < 768) return 2
    if (window.innerWidth < 1024) return 2.5
    if (window.innerWidth < 1280) return 3
    return 3.5
  }, [isClient])

  const [visibleCards, setVisibleCards] = useState(1)

  const duplicatedProducts = [...products, ...products, ...products]
  const totalSlides = duplicatedProducts.length
  const startIndex = products.length

  useEffect(() => {
    setIsClient(true)
    setCurrentSlide(startIndex)
  }, [startIndex])

  useEffect(() => {
    if (!isClient) return

    const handleResize = () => {
      setVisibleCards(getVisibleCards())
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isClient, getVisibleCards])

  useEffect(() => {
    if (!autoplay || !isClient) return

    intervalRef.current = setInterval(() => {
      goToNext()
    }, speed)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [autoplay, speed, isClient])

  const goToNext = useCallback(() => {
    if (isTransitioning) return
    
    setIsTransitioning(true)
    setCurrentSlide(prev => prev + 1)
    
    setTimeout(() => {
      setIsTransitioning(false)
      setCurrentSlide(prev => {
        if (prev >= startIndex + products.length) {
          return startIndex
        }
        return prev
      })
    }, 500)
  }, [isTransitioning, startIndex, products.length])

  const goToPrev = useCallback(() => {
    if (isTransitioning) return
    
    setIsTransitioning(true)
    setCurrentSlide(prev => prev - 1)
    
    setTimeout(() => {
      setIsTransitioning(false)
      setCurrentSlide(prev => {
        if (prev < startIndex) {
          return startIndex + products.length - 1
        }
        return prev
      })
    }, 500)
  }, [isTransitioning, startIndex, products.length])

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return
    setCurrentSlide(startIndex + index)
  }, [startIndex, isTransitioning])

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-smoky-gray dark:text-antique-white/70">No products to display</p>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <div 
        ref={containerRef}
        className="overflow-hidden"
        style={{
          height: '384px'
        }}
      >
        <div 
          className={cn(
            'flex',
            isTransitioning ? 'transition-transform duration-500 ease-out' : ''
          )}
          style={{
            transform: `translateX(-${currentSlide * (100 / visibleCards)}%)`,
          }}
        >
          {duplicatedProducts.map((item, index) => (
            <div
              key={`${item.product.id}-${index}`}
              className="flex-shrink-0 px-3"
              style={{
                width: `${100 / visibleCards}%`,
                minWidth: `${100 / visibleCards}%`,
              }}
            >
              <CharcoalBourbonProductCard
                product={item.product}
                customDescription={item.customDescription}
                featured={item.featured}
                priceConfig={{
                  priceType: item.priceType,
                  customPrice: item.customPrice,
                  unitText: item.unitText,
                  overridePrice: item.overridePrice,
                }}
                theme={theme}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>

      {arrows && (
        <>
          <button
            onClick={goToPrev}
            disabled={isTransitioning}
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6',
              'w-14 h-14 rounded-full shadow-xl',
              'bg-antique-white dark:bg-charcoal-black',
              'border-2 border-copper-bourbon/30',
              'text-copper-bourbon hover:text-antique-white',
              'hover:bg-copper-bourbon hover:border-copper-bourbon',
              'transition-all duration-300 ease-out',
              'flex items-center justify-center',
              'hover:shadow-2xl hover:scale-110',
              'z-10 backdrop-blur-sm',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            aria-label="Previous products"
          >
            <ChevronLeft className="w-7 h-7" strokeWidth={2.5} />
          </button>

          <button
            onClick={goToNext}
            disabled={isTransitioning}
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 translate-x-6',
              'w-14 h-14 rounded-full shadow-xl',
              'bg-antique-white dark:bg-charcoal-black',
              'border-2 border-copper-bourbon/30',
              'text-copper-bourbon hover:text-antique-white',
              'hover:bg-copper-bourbon hover:border-copper-bourbon',
              'transition-all duration-300 ease-out',
              'flex items-center justify-center',
              'hover:shadow-2xl hover:scale-110',
              'z-10 backdrop-blur-sm',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            aria-label="Next products"
          >
            <ChevronRight className="w-7 h-7" strokeWidth={2.5} />
          </button>
        </>
      )}

      {dots && (
        <div className="flex justify-center mt-10 gap-3">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={cn(
                'w-4 h-4 rounded-full transition-all duration-300',
                'border border-copper-bourbon/30',
                (currentSlide - startIndex) % products.length === index
                  ? 'bg-copper-bourbon shadow-lg shadow-copper-bourbon/30 scale-125 border-copper-bourbon'
                  : 'bg-transparent hover:bg-copper-bourbon/20 hover:border-copper-bourbon/50',
                'disabled:opacity-50'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface CharcoalBourbonProductCardProps {
  product: ProductType
  customDescription: string
  featured: boolean
  priceConfig: {
    priceType?: 'auto' | 'from' | 'starting' | 'unit' | 'custom' | 'hidden'
    customPrice?: string
    unitText?: string
    overridePrice?: number
  }
  theme?: 'light' | 'dark' | 'bourbon'
  index: number
}

const CharcoalBourbonProductCard: React.FC<CharcoalBourbonProductCardProps> = ({
  product,
  customDescription,
  featured,
  priceConfig,
  theme = 'bourbon',
  index,
}) => {
  const formattedPrice = formatProductPrice(product, priceConfig)
  
  const productImage = product.gallery?.[0] || null
  const productUrl = `/products/${product.slug || String(product.id)}`
  const productTitle = product.title || 'Untitled Product'

  const cardStyles = cn(
    'group h-full flex flex-col overflow-hidden cursor-pointer rounded-xl border',
    'bg-antique-white dark:bg-charcoal-black',
    'border-smoky-gray/20 dark:border-copper-bourbon/25',
    'transition-all duration-300 ease-out',
    'hover:shadow-lg hover:border-copper-bourbon/40 hover:-translate-y-1',
    'h-96'
  )

  return (
    <Link href={productUrl} className="block h-full">
      <article className={cardStyles}>
        
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-antique-white/50">
          {productImage && (
            <>
              <img
                src={productImage.url}
                alt={productImage.alt || productTitle}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading={index < 3 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={index === 0 ? "high" : "low"}
                width={400}
                height={300}
                style={{
                  aspectRatio: '4/3'
                }}
              />
            </>
          )}
          
          {featured && (
            <div className={cn(
              'absolute top-3 left-3 z-20',
              'bg-copper-bourbon text-antique-white rounded-full px-3 py-1.5',
              'text-xs font-semibold uppercase tracking-wider',
              'border border-copper-bourbon/80 flex items-center gap-1'
            )}>
              <Star className="w-3 h-3 fill-current" />
              Featured
            </div>
          )}
        </div>
        
        <div className="flex flex-col flex-grow p-4">
          <h3 className={cn(
            'text-base font-semibold line-clamp-2 leading-tight mb-3',
            'text-deep-charcoal dark:text-antique-white group-hover:text-copper-bourbon',
            'transition-colors duration-300'
          )}>
            {productTitle}
          </h3>
          
          <p className={cn(
            'text-sm leading-relaxed line-clamp-3 mb-4 flex-grow',
            'text-smoky-gray dark:text-antique-white/80',
            'transition-colors duration-300'
          )}>
            {customDescription}
          </p>
          
          {formattedPrice.shouldShow && (
            <div className="mt-auto">
              <span className={cn(
                'text-sm font-semibold inline-block rounded px-3 py-1.5',
                formattedPrice.isCustom 
                  ? 'bg-copper-bourbon text-antique-white border border-copper-bourbon/80'
                  : 'bg-copper-bourbon/10 text-copper-bourbon border border-copper-bourbon/25'
              )}>
                {formattedPrice.display}
              </span>
            </div>
          )}
        </div>

      </article>
    </Link>
  )
}