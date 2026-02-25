// blocks/TestimonialsCarousel/Component.client.tsx

'use client'

import React, { useEffect, useState } from 'react'
import type { TestimonialsCarouselBlock } from '@/payload-types'
import { BlockWrapper } from '@/components/BlockWrapper'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/CMSLink'
import { BorderButton } from '@/components/ui/BorderButton'
import type { Media } from '@/payload-types'
import { cn } from '@/utilities/cn'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'

// Card with gradient borders
const GradientCard = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) => (
  <div className={cn('relative', className)}>
    {/* Gradient Borders */}
    <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    
    {/* Content */}
    {children}
  </div>
)

export function TestimonialsCarouselClient(props: TestimonialsCarouselBlock) {
  const {
    sectionId,
    backgroundStyle = 'muted',
    content,
    cta,
    testimonials,
    carouselSettings,
  } = props

  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [snapCount, setSnapCount] = useState(0)

  const backgroundClasses = {
    default: 'bg-white dark:bg-[#0b111a]',
    muted: 'bg-muted dark:bg-[#0b111a]',
    card: 'bg-card dark:bg-[#0b111a]',
  }

  // Get image URL
  const getImageUrl = (img: any): string => {
    if (typeof img === 'object' && img !== null && (img as Media).url) {
      return (img as Media).url!
    }
    return ''
  }

  // Carousel selection tracking
  useEffect(() => {
    if (!carouselApi) return

    const onSelect = () => {
      setSelectedIndex(carouselApi.selectedScrollSnap())
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
    }

    setSnapCount(carouselApi.scrollSnapList().length)
    onSelect()

    carouselApi.on('select', onSelect)
    carouselApi.on('reInit', () => {
      setSnapCount(carouselApi.scrollSnapList().length)
      onSelect()
    })

    return () => {
      carouselApi.off('select', onSelect)
    }
  }, [carouselApi])

  // Autoplay
  useEffect(() => {
    if (!carouselApi || !carouselSettings?.autoplay) return

    const interval = setInterval(() => {
      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext()
      } else if (carouselSettings.loop) {
        carouselApi.scrollTo(0)
      }
    }, carouselSettings.autoplayDelay || 5000)

    return () => clearInterval(interval)
  }, [carouselApi, carouselSettings])

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  return (
    <BlockWrapper sectionId={sectionId}>
      <section className={cn(backgroundClasses[backgroundStyle as keyof typeof backgroundClasses], 'py-12 sm:py-16 lg:py-20')}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8 md:mb-12 lg:mb-16 flex items-start flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <div className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:font-heading prose-headings:tracking-wide prose-headings:mb-2 prose-headings:mt-0
                prose-h1:text-2xl prose-h1:sm:text-3xl prose-h1:md:text-4xl prose-h1:lg:text-5xl prose-h1:font-semibold prose-h1:text-primary
                prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:md:text-3xl prose-h2:lg:text-4xl prose-h2:font-semibold prose-h2:text-primary
                prose-h3:text-lg prose-h3:sm:text-xl prose-h3:font-semibold prose-h3:text-foreground
                prose-p:text-base prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:my-0
              ">
                <RichText 
                  data={content} 
                  enableGutter={false}
                  enableProse={true}
                />
              </div>
            </div>
            
            {cta?.link && (
              <div className="shrink-0">
                <CMSLink link={cta.link}>
                  <BorderButton
                    text={cta.link.label || 'Learn More'}
                    variant="filled"
                  />
                </CMSLink>
              </div>
            )}
          </div>

          {/* Carousel */}
          <div className="relative">
            <Carousel
              setApi={setCarouselApi}
              className="overflow-hidden -mr-[max(2rem,calc((100vw-103rem)/2+3rem))]"
              opts={{
                loop: carouselSettings?.loop ?? true,
                align: 'start',
                containScroll: 'trimSnaps',
                slidesToScroll: 1,
                breakpoints: {
                  '(max-width: 768px)': {
                    dragFree: true,
                  },
                },
              }}
            >
              <CarouselContent className="-ml-2 sm:-ml-3">
                {testimonials.map((testimonial, idx) => {
                  const isSelected = idx === selectedIndex

                  return (
                    <CarouselItem
                      key={idx}
                      className="min-w-0 shrink-0 grow-0 pl-0 basis-4/5 md:basis-1/2 lg:basis-[34%]"
                    >
                      <GradientCard className="flex cursor-pointer ml-6 flex-col items-start rounded-xl bg-card dark:bg-[#0f131b] transition-all duration-300 hover:shadow-lg">
                        <div className="relative w-full h-full flex flex-col rounded-xl overflow-hidden">
                          {/* Image or Placeholder */}
                          <div className="relative aspect-[3/2] overflow-hidden">
                            {testimonial.image && getImageUrl(testimonial.image) ? (
                              <>
                                <Image
                                  src={getImageUrl(testimonial.image)}
                                  alt={testimonial.name || 'Testimonial'}
                                  fill
                                  className="object-cover transition duration-300 hover:scale-105"
                                />
                                {/* Overlay on non-selected cards */}
                                {!isSelected && (
                                  <div className="absolute inset-0 bg-primary/30 dark:bg-black/50 transition-opacity duration-300 pointer-events-none" />
                                )}
                              </>
                            ) : (
                              <>
                                {/* Placeholder gradient background */}
                                <div className={cn(
                                  'absolute inset-0 bg-gradient-to-br transition-colors duration-300',
                                  isSelected
                                    ? 'from-muted/50 to-muted'
                                    : 'from-primary/20 to-primary/40'
                                )} />
                                
                                {/* Placeholder icon/text */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className={cn(
                                    'text-center transition-colors duration-300',
                                    isSelected
                                      ? 'text-muted-foreground/40'
                                      : 'text-primary/60'
                                  )}>
                                    <svg
                                      className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                      />
                                    </svg>
                                    <p className="text-xs sm:text-sm font-medium">
                                      {testimonial.name || 'Testimonial'}
                                    </p>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-4 sm:p-5 flex-1 flex flex-col">
                            {/* Quote */}
                            {testimonial.quote && (
                              <p
                                className={cn(
                                  'mb-4 text-sm sm:text-base leading-relaxed',
                                  isSelected
                                    ? 'text-foreground dark:text-white/80'
                                    : 'text-primary'
                                )}
                              >
                                "{testimonial.quote}"
                              </p>
                            )}

                            {/* Name & Role */}
                            {(testimonial.name || testimonial.role) && (
                              <div className="mt-auto pt-2 border-t border-border/50">
                                {testimonial.name && (
                                  <p
                                    className={cn(
                                      'text-base sm:text-lg font-semibold font-heading',
                                      isSelected
                                        ? 'text-foreground dark:text-white'
                                        : 'text-primary'
                                    )}
                                  >
                                    {testimonial.name}
                                  </p>
                                )}
                                {testimonial.role && (
                                  <p
                                    className={cn(
                                      'text-xs sm:text-sm mt-1',
                                      isSelected
                                        ? 'text-muted-foreground'
                                        : 'text-primary/80'
                                    )}
                                  >
                                    {testimonial.role}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </GradientCard>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Controls */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Pagination Dots */}
            <div className="order-2 sm:order-1 flex items-center justify-center gap-2 md:gap-3">
              {Array.from({ length: snapCount }).map((_, i) => {
                const active = i === selectedIndex
                return (
                  <button
                    key={i}
                    onClick={() => carouselApi?.scrollTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={active ? 'true' : undefined}
                    className={cn(
                      'h-2.5 w-2.5 rounded-full transition-all',
                      active 
                        ? 'bg-primary scale-110' 
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    )}
                  />
                )
              })}
            </div>

            {/* Navigation Arrows */}
            <div className="order-1 sm:order-2 flex items-center justify-center gap-3 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => carouselApi?.scrollPrev()}
                disabled={!canScrollPrev}
                aria-label="Previous"
                className="
                  h-10 w-10 sm:h-12 sm:w-12 rounded-full
                  bg-background/80 text-foreground ring-1 ring-border/50
                  shadow-lg backdrop-blur transition-all
                  hover:bg-background hover:shadow-xl hover:scale-105
                  active:scale-95
                  disabled:opacity-40 disabled:shadow-none disabled:pointer-events-none
                "
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => carouselApi?.scrollNext()}
                disabled={!canScrollNext}
                aria-label="Next"
                className="
                  h-10 w-10 sm:h-12 sm:w-12 rounded-full
                  bg-background/80 text-foreground ring-1 ring-border/50
                  shadow-lg backdrop-blur transition-all
                  hover:bg-background hover:shadow-xl hover:scale-105
                  active:scale-95
                  disabled:opacity-40 disabled:shadow-none disabled:pointer-events-none
                "
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </BlockWrapper>
  )
}