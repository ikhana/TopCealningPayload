// src/blocks/CleanTestimonials/Component.tsx
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { CleanTestimonialsBlock as CleanTestimonialsBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { Calendar, MapPin, Quote, Star } from 'lucide-react'
import React from 'react'

export const CleanTestimonialsBlock: React.FC<
  CleanTestimonialsBlockProps & {
    id?: string
  }
> = (props) => {
  const {
    sectionTitle,
    sectionSubtitle,
    testimonials,
    layout = 'grid',
    backgroundColor = 'clinical',
    sectionPadding = 'large',
    enableRatings = true,
    showTestType = true,
  } = props

  const safeTestimonials = testimonials || []
  const safeLayout = layout || 'grid'
  const safeBg = backgroundColor || 'clinical'
  const safePadding = sectionPadding || 'large'

  const backgroundClasses = {
    clinical: 'bg-clinical-white dark:bg-navy/90',
    white: 'bg-white dark:bg-dark-navy',
    subtle: 'bg-blue-gray/5 dark:bg-navy/70',
    gradient: 'bg-gradient-to-br from-clinical-white via-clinical-white to-blue-gray/5 dark:from-navy/90 dark:via-navy/90 dark:to-navy/70',
  }

  const paddingClasses = {
    small: 'py-12 lg:py-16',
    medium: 'py-16 lg:py-20', 
    large: 'py-20 lg:py-28',
    xl: 'py-28 lg:py-36',
  }

  const layoutClasses = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8',
    masonry: 'columns-1 md:columns-2 lg:columns-3 gap-6 lg:gap-8',
    single: 'max-w-4xl mx-auto space-y-8',
    carousel: 'flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory',
  }

  if (!safeTestimonials.length) return null

  return (
    <section className={cn('w-full', backgroundClasses[safeBg], paddingClasses[safePadding])}>
      <div className="container mx-auto px-4">
        
        <div className="mb-12 lg:mb-16">
          <SectionHeading
            title={sectionTitle || ''}
            subtitle={sectionSubtitle || undefined}
            size="lg"
            align="center"
            theme="auto"
            className="max-w-4xl mx-auto"
          />
        </div>

        <div className={cn(layoutClasses[safeLayout])}>
          {safeTestimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id || index}
              className={cn(
                'group relative',
                'bg-white dark:bg-navy/95',
                'border-2 border-blue-gray/20 dark:border-blue-gray/30',
                'rounded-lg shadow-lg shadow-navy/5 dark:shadow-dark-navy/20',
                'p-6 lg:p-8 transition-all duration-500',
                'hover:border-coral/40 dark:hover:border-coral/50',
                'hover:shadow-xl hover:shadow-navy/10 dark:hover:shadow-dark-navy/30',
                'hover:-translate-y-1',
                safeLayout === 'masonry' && 'break-inside-avoid mb-6',
                safeLayout === 'carousel' && 'flex-none w-80 snap-start'
              )}
            >
              
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-coral rounded-full flex items-center justify-center shadow-lg">
                <Quote className="w-3 h-3 text-white" />
              </div>

              {enableRatings && testimonial.rating && (
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star 
                      key={starIndex}
                      className={cn(
                        'w-4 h-4',
                        starIndex < testimonial.rating! 
                          ? 'text-coral fill-coral' 
                          : 'text-blue-gray/30 dark:text-blue-gray/40'
                      )}
                    />
                  ))}
                </div>
              )}

              <blockquote className={cn(
                'text-lg lg:text-xl font-body leading-relaxed mb-6',
                'text-dark-navy dark:text-clinical-white',
                'relative'
              )}>
                "{testimonial.quote}"
              </blockquote>

              <div className="space-y-2">
                <div>
                  <cite className={cn(
                    'not-italic font-semibold font-heading text-lg',
                    'text-dark-navy dark:text-clinical-white'
                  )}>
                    {testimonial.authorName}
                  </cite>
                  
                  {testimonial.authorTitle && (
                    <p className={cn(
                      'text-sm font-body',
                      'text-blue-gray dark:text-clinical-white/80'
                    )}>
                      {testimonial.authorTitle}
                    </p>
                  )}
                </div>

                {showTestType && testimonial.testType && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-brand-blue rounded-full" />
                    <span className={cn(
                      'font-medium font-body',
                      'text-brand-blue dark:text-brand-blue'
                    )}>
                      {testimonial.testType}
                    </span>
                  </div>
                )}

                {testimonial.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-3 h-3 text-blue-gray/60" />
                    <span className={cn(
                      'font-body',
                      'text-blue-gray dark:text-clinical-white/70'
                    )}>
                      {testimonial.location}
                    </span>
                  </div>
                )}

                {testimonial.testimonialDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-3 h-3 text-blue-gray/60" />
                    <span className={cn(
                      'font-body',
                      'text-blue-gray dark:text-clinical-white/70'
                    )}>
                      {new Date(testimonial.testimonialDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>

              <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-coral/30 dark:border-coral/40 transition-all duration-500 group-hover:border-coral dark:group-hover:border-coral opacity-50 group-hover:opacity-80" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-brand-blue/30 dark:border-brand-blue/40 transition-all duration-500 group-hover:border-brand-blue dark:group-hover:border-brand-blue opacity-50 group-hover:opacity-80" />
              
              <div className="absolute top-3 right-3 w-2 h-2 bg-coral dark:bg-coral opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
              <div className="absolute bottom-3 left-3 w-2 h-2 bg-brand-blue dark:bg-brand-blue opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {props.enableCTA && props.ctaText && (
          <div className="text-center mt-12 lg:mt-16">
            <a
              href={props.ctaLink || '/contact'}
              className={cn(
                'inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold font-heading',
                'bg-coral hover:bg-coral/90 text-white',
                'border-2 border-coral hover:border-coral/90',
                'transition-all duration-300 hover:scale-105',
                'shadow-lg hover:shadow-xl',
                'focus:outline-none focus:ring-4 focus:ring-coral/20'
              )}
            >
              {props.ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}