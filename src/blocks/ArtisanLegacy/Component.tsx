// src/blocks/ArtisanLegacy/Component.tsx
import type { ArtisanLegacyBlock as ArtisanLegacyBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/cn'
import { Award, Crown, Star } from 'lucide-react'
import React from 'react'

export const ArtisanLegacyBlock: React.FC<
  ArtisanLegacyBlockProps & {
    id?: string
  }
> = (props) => {
  const {
    heroImage,
    heroImageAlt,
    overlayHeight,
    overlayBackground,
    heroContent,
    contentAlignment,
    galleryTitle,
    testimonials,
    legacyStats,
    layout,
    imageStyle,
    enableHoverEffects,
    sectionPadding,
  } = props

  // Safe defaults following HeritageStory pattern
  const safeOverlayHeight = overlayHeight || 'third'
  const safeOverlayBackground = overlayBackground || 'bourbon'
  const safeContentAlignment = contentAlignment || 'center'
  const safeLayout = layout || 'gallery'
  const safeImageStyle = imageStyle || 'cover'
  const safeSectionPadding = sectionPadding || 'large'

  // Overlay height classes - matching HeritageStory
  const overlayHeightClasses: Record<string, string> = {
    quarter: 'bottom-0 h-1/4',
    third: 'bottom-0 h-1/3',
    half: 'bottom-0 h-1/2',
  }

  // Overlay background classes - enhanced for artisan feel
  const overlayBackgroundClasses: Record<string, string> = {
    gradient: 'bg-gradient-to-t from-black/80 via-black/50 to-transparent',
    dark: 'bg-black/70',
    bourbon: 'bg-gradient-to-t from-charcoal/90 via-bourbon/40 to-transparent',
    minimal: 'bg-transparent',
  }

  // Content alignment classes
  const contentAlignmentClasses: Record<string, string> = {
    center: 'text-center items-center justify-center',
    left: 'text-left items-end justify-start',
    right: 'text-right items-end justify-end',
  }

  // Section padding classes
  const paddingClasses: Record<string, string> = {
    small: 'py-12',
    medium: 'py-16',
    large: 'py-20',
  }

  return (
    <section className={cn('relative', paddingClasses[safeSectionPadding])}>
      
      {/* Hero Image Section with Overlay Content - Following HeritageStory pattern */}
      <div className="container">
        {heroImage && typeof heroImage === 'object' && (
          <div className="relative mb-16">
            {/* Hero Image Container */}
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg">
              <Media
                resource={typeof heroImage === 'number' ? String(heroImage) : heroImage}
                className="w-full h-full"
                imgClassName="w-full h-full object-cover"
              />
            </div>
            
            {/* Content Overlay Area - Full Width, positioned at bottom */}
            {heroContent && (
              <div className={cn(
                'absolute left-0 right-0 flex px-8 md:px-12 lg:px-16 py-8 md:py-12',
                overlayHeightClasses[safeOverlayHeight],
                overlayBackgroundClasses[safeOverlayBackground],
                contentAlignmentClasses[safeContentAlignment]
              )}>
                <div className="w-full max-w-none">
                  <div className={cn(
                    'prose prose-lg dark:prose-invert max-w-none',
                    safeContentAlignment === 'center' && 'mx-auto text-center',
                    safeContentAlignment === 'left' && 'text-left',
                    safeContentAlignment === 'right' && 'text-right ml-auto'
                  )}>
                    <div className={cn(
                      '[&_p]:font-sourcesans [&_p]:text-lg [&_p]:leading-relaxed [&_p]:text-parchment [&_h2]:font-playfair [&_h3]:font-playfair [&_h4]:font-playfair [&_strong]:text-bourbon [&_em]:text-bourbon/80',
                      // Add text shadows for minimal overlay option
                      safeOverlayBackground === 'minimal' && '[&_p]:text-shadow-lg [&_h2]:text-shadow-lg [&_h3]:text-shadow-lg [&_h4]:text-shadow-lg [&_strong]:text-shadow-lg'
                    )}>
                      <RichText data={heroContent} enableGutter={false} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Heritage accent badge */}
            <div className="absolute top-6 right-6 bg-bourbon/90 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
              <Crown className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wider uppercase">Heritage</span>
            </div>
            
            {/* Image Alt Text for Screen Readers */}
            {heroImageAlt && (
              <span className="sr-only">{heroImageAlt}</span>
            )}
          </div>
        )}
      </div>

      {/* Legacy Statistics Section */}
      {legacyStats?.enabled && legacyStats.stats && legacyStats.stats.length > 0 && (
        <div className="container mb-16">
          <div className="text-center mb-12">
            {legacyStats.title && (
              <h3 className="text-2xl md:text-3xl font-bold font-playfair text-foreground mb-6">
                {legacyStats.title}
              </h3>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {legacyStats.stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="mb-4">
                    <div className={cn(
                      'text-3xl lg:text-4xl xl:text-5xl font-bold text-bourbon mb-2 font-playfair',
                      enableHoverEffects && 'transition-transform duration-300 group-hover:scale-110'
                    )}>
                      {stat.number}
                    </div>
                    <div className="text-sm lg:text-base text-charcoal font-semibold uppercase tracking-wider mb-2">
                      {stat.label}
                    </div>
                    {stat.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {stat.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Testimonial Gallery Section */}
      <div className="container">
        {/* Gallery Title */}
        {galleryTitle && (
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold font-playfair text-foreground mb-4">
              {galleryTitle}
            </h3>
            <div className="w-24 h-1 bg-bourbon mx-auto rounded-full"></div>
          </div>
        )}

        {/* Testimonials Gallery */}
        {testimonials && testimonials.length > 0 && (
          <div className={cn(
            safeLayout === 'gallery' && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
            safeLayout === 'masonry' && 'columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8',
            safeLayout === 'stories' && 'space-y-16'
          )}>
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={cn(
                  'group',
                  safeLayout === 'gallery' && 'break-inside-avoid',
                  safeLayout === 'masonry' && 'break-inside-avoid mb-8',
                  safeLayout === 'stories' && 'grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'
                )}
              >
                {/* Showcase Image */}
                <div className={cn(
                  'relative overflow-hidden rounded-lg shadow-lg',
                  safeLayout === 'stories' && (index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'),
                  enableHoverEffects && 'transition-all duration-500 hover:scale-[1.02] hover:shadow-xl'
                )}>
                  <div className={cn(
                    'relative',
                    safeLayout === 'gallery' && 'aspect-[4/3]',
                    safeLayout === 'masonry' && 'aspect-auto',
                    safeLayout === 'stories' && 'aspect-[5/4]'
                  )}>
                    <Media
                      resource={typeof testimonial.showcaseImage === 'number' ? String(testimonial.showcaseImage) : testimonial.showcaseImage}
                      className="w-full h-full"
                      imgClassName={cn(
                        'w-full h-full transition-transform duration-700',
                        safeImageStyle === 'cover' ? 'object-cover' : 'object-contain',
                        enableHoverEffects && 'group-hover:scale-105'
                      )}
                    />
                    
                    {/* Heritage texture overlay */}
                    {enableHoverEffects && (
                      <div className="absolute inset-0 bg-bourbon/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    )}
                    
                    {/* Featured badge */}
                    {testimonial.featured && (
                      <div className="absolute top-4 left-4 bg-bourbon text-white px-3 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                        <Star className="w-4 h-4 fill-current" />
                        Featured
                      </div>
                    )}
                    
                    {/* Project type badge */}
                    {testimonial.projectType && (
                      <div className="absolute bottom-4 right-4 bg-charcoal/90 backdrop-blur-sm text-parchment px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                        {testimonial.projectType}
                      </div>
                    )}
                  </div>
                  
                  {/* Alt text for accessibility */}
                  {testimonial.showcaseImageAlt && (
                    <span className="sr-only">{testimonial.showcaseImageAlt}</span>
                  )}
                </div>

                {/* Testimonial Content */}
                <div className={cn(
                  'bg-white rounded-lg shadow-lg p-6 lg:p-8',
                  safeLayout === 'gallery' && 'mt-6',
                  safeLayout === 'masonry' && 'mt-4',
                  safeLayout === 'stories' && (index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'),
                  testimonial.featured && 'border-l-4 border-bourbon',
                  enableHoverEffects && 'transition-all duration-300 hover:shadow-xl'
                )}>
                  
                  {/* Quote icon for featured testimonials */}
                  {testimonial.featured && (
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 bg-bourbon/10 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-bourbon" />
                      </div>
                    </div>
                  )}
                  
                  <div className={cn(
                    'prose prose-sm max-w-none',
                    '[&_p]:font-sourcesans [&_p]:text-gray-700 [&_p]:leading-relaxed',
                    '[&_h3]:font-playfair [&_h3]:text-charcoal [&_h3]:mb-3',
                    '[&_h4]:font-playfair [&_h4]:text-bourbon [&_h4]:mb-2',
                    '[&_strong]:text-bourbon [&_em]:text-bourbon/80',
                    '[&_blockquote]:border-l-4 [&_blockquote]:border-bourbon/20 [&_blockquote]:pl-4 [&_blockquote]:italic'
                  )}>
                    <RichText data={testimonial.testimonialContent} enableGutter={false} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Heritage texture overlay for entire section */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C28033' fill-opacity='0.3'%3E%3Cpath d='M0 0h120v2H0zm0 6h120v2H0zm0 6h120v1H0zm0 3h120v1H0zm0 3h120v2H0zm0 6h120v1H0zm0 3h120v1H0zm0 3h120v2H0zm0 6h120v1H0zm0 3h120v1H0zm0 3h120v2H0zm0 6h120v1H0zm0 3h120v1H0zm0 3h120v2H0zm0 6h120v1H0zm0 3h120v1H0zm0 3h120v2H0zm0 6h120v1H0zm0 3h120v1H0zm0 3h120v2H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
        aria-hidden="true"
      />
      
      {/* Distillery barrel ring pattern */}
      <div 
        className="absolute inset-0 opacity-[0.01] pointer-events-none z-[2]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C28033' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3Ccircle cx='0' cy='30' r='1'/%3E%3Ccircle cx='60' cy='30' r='1'/%3E%3Ccircle cx='30' cy='0' r='1'/%3E%3Ccircle cx='30' cy='60' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
        aria-hidden="true"
      />
    </section>
  )
}