// src/components/product/ProductGalleryWithCart.tsx
'use client'

import type { ProductConfiguration } from '@/components/product/ProductConfigurator'
import type { Media as MediaType, Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { EnhancedAddToCart } from '@/components/product/EnhancedAddToCart'
import { createUrl } from '@/utilities/createUrl'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React from 'react'

interface ProductGalleryWithCartProps {
  images: MediaType[]
  product: Product
  configuration?: ProductConfiguration | null
}

export function ProductGalleryWithCart({ 
  images, 
  product, 
  configuration 
}: ProductGalleryWithCartProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const imageSearchParam = searchParams.get('image')
  const imageIndex = imageSearchParam ? parseInt(imageSearchParam) : 0

  const nextSearchParams = new URLSearchParams(searchParams.toString())
  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0
  nextSearchParams.set('image', nextImageIndex.toString())
  const nextUrl = createUrl(pathname, nextSearchParams)

  const previousSearchParams = new URLSearchParams(searchParams.toString())
  const previousImageIndex = imageIndex === 0 ? images.length - 1 : imageIndex - 1
  previousSearchParams.set('image', previousImageIndex.toString())
  const previousUrl = createUrl(pathname, previousSearchParams)

  const buttonClassName =
    'h-full px-6 transition-all ease-in-out hover:scale-110 hover:text-antique-brass dark:hover:text-antique-white hover:bg-copper-bourbon/10 dark:hover:bg-charcoal-gold/10 flex items-center justify-center rounded-lg'

  return (
    <React.Fragment>
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden rounded-lg">
        {images[imageIndex] && <Media resource={images[imageIndex]} />}

        {/* Gallery Navigation Controls */}
        {images.length > 1 ? (
          <div className="absolute bottom-[15%] flex w-full justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-antique-brass/30 dark:border-charcoal-gold/30 bg-antique-white/90 dark:bg-charcoal-black/90 text-antique-brass dark:text-smoky-gray backdrop-blur-sm shadow-lg shadow-copper-bourbon/10 dark:shadow-charcoal-gold/10">
              <Link
                aria-label="Previous product image"
                className={buttonClassName}
                href={previousUrl}
                scroll={false}
              >
                <ArrowLeftIcon className="h-5" />
              </Link>
              <div className="mx-1 h-6 w-px bg-antique-brass/30 dark:bg-charcoal-gold/30" />
              <Link
                aria-label="Next product image"
                className={buttonClassName}
                href={nextUrl}
                scroll={false}
              >
                <ArrowRightIcon className="h-5" />
              </Link>
            </div>
          </div>
        ) : null}

        {/* Floating Add to Cart - Now properly positioned inside Gallery */}
        <div className="absolute bottom-4 right-4 z-30">
          <div className="backdrop-blur-md bg-white/30 dark:bg-charcoal-black/30 border border-white/50 dark:border-charcoal-gold/50 rounded-xl p-2.5 shadow-xl shadow-copper-bourbon/30 dark:shadow-charcoal-gold/30 hover:bg-white/40 dark:hover:bg-charcoal-black/40 transition-all duration-300">
            <EnhancedAddToCart 
              product={product}
              variants={product.variants}
              configuration={configuration}
              compact={true}
            />
          </div>
        </div>
      </div>

      {/* Heritage Thumbnail Navigation */}
      {images.length > 1 ? (
        <ul className="my-8 flex items-center justify-center gap-3 overflow-auto py-2 lg:mb-0">
          {images.map((image, index) => {
            const isActive = index === imageIndex

            const imageSearchParams = new URLSearchParams(searchParams.toString())
            imageSearchParams.set('image', index.toString())

            return (
              <li key={image.id || index} className="h-20 w-20 flex-shrink-0">
                <Link
                  aria-label={`View product image ${index + 1}`}
                  href={createUrl(pathname, imageSearchParams)}
                  scroll={false}
                  className="h-full w-full block group"
                >
                  <div
                    className={`relative h-full w-full overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                      isActive
                        ? 'border-copper-bourbon dark:border-charcoal-gold shadow-lg shadow-copper-bourbon/25 dark:shadow-charcoal-gold/25'
                        : 'border-antique-brass/30 dark:border-charcoal-gold/30 hover:border-copper-bourbon dark:hover:border-charcoal-gold'
                    } group-hover:scale-105`}
                  >
                    <Media resource={image} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    {isActive && (
                      <div className="absolute inset-0 bg-copper-bourbon/10 dark:bg-charcoal-gold/10" />
                    )}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      ) : null}
    </React.Fragment>
  )
}