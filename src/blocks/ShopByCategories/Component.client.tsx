// src/blocks/ShopByCategories/Component.client.tsx
'use client'

import type { Category } from '@/payload-types'

import { Media } from '@/components/Media'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import AutoScroll from 'embla-carousel-auto-scroll'
import Link from 'next/link'
import React from 'react'

interface ShopByCategoriesClientProps {
  categories: Category[]
  title?: string
  description?: string
  imageStyle: 'cover' | 'contain' | 'fill'
}

export const ShopByCategoriesClient: React.FC<ShopByCategoriesClientProps> = ({
  categories,
  title,
  description,
  imageStyle,
}) => {
  if (!categories?.length) return null

  return (
    <section className="container py-16">
      {/* Header */}
      {(title || description) && (
        <div className="text-center mb-12">
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold font-playfair text-foreground mb-4">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-sourcesans">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Categories Carousel */}
      <Carousel
        className="w-full"
        opts={{
          align: 'start',
          loop: true,
          skipSnaps: false,
          dragFree: true,
        }}
        plugins={[
          AutoScroll({
            playOnInit: false, // Don't auto-scroll by default
            speed: 1,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
          }),
        ]}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {categories.map((category) => {
            const categoryImage = category.image || null

            return (
              <CarouselItem
                key={category.id}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <Link
                  href={`/shop/${category.slug}`}
                  className="group relative overflow-hidden rounded-lg aspect-[4/3] block transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  {/* Category Image */}
                  <div className="absolute inset-0">
                    {categoryImage && typeof categoryImage === 'object' ? (
                      <Media
                        resource={categoryImage}
                        className="w-full h-full"
                        imgClassName={`w-full h-full transition-transform duration-700 group-hover:scale-110 ${
                          imageStyle === 'cover'
                            ? 'object-cover'
                            : imageStyle === 'contain'
                            ? 'object-contain'
                            : 'object-fill'
                        }`}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40" />
                    )}
                  </div>

                  {/* Bottom Text Banner - Matching Reference Style */}
                  <div className="absolute bottom-0 left-0 right-0 bg-bourbon/90 backdrop-blur-sm py-3 px-4 transition-all duration-300 group-hover:bg-bourbon">
                    <h3 className="text-white font-bold text-sm md:text-base font-sourcesans uppercase tracking-[0.12em] leading-tight text-center">
                      {category.title}
                    </h3>
                  </div>

                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        
        {/* Navigation arrows - only show if there are more items than visible */}
        {categories.length > 3 && (
          <>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </>
        )}
      </Carousel>

      {/* View All Categories Link */}
      <div className="text-center mt-12">
        <Link
          href="/shop"
          className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold font-sourcesans uppercase tracking-wider hover:bg-primary/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          View All Categories
          <svg
            className="ml-3 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5-5 5M6 12h12"
            />
          </svg>
        </Link>
      </div>
    </section>
  )
}