// src/blocks/HeritageStory/Component.tsx - FIXED FOR LONG CONTENT
import type { HeritageStoryBlock as HeritageStoryBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { WorkshopButton } from '@/components/ui/WorkshopButton/WorkshopButton'
import { cn } from '@/utilities/cn'
import React from 'react'

export const HeritageStoryBlock: React.FC<
  HeritageStoryBlockProps & {
    id?: string
  }
> = (props) => {
  const {
    heroImage,
    heroImageAlt,
    storyContent,
    ctaButton,
    galleryTitle,
    leftImage,
    leftImageAlt,
    rightImage,
    rightImageAlt,
  } = props

  const hasGalleryImages = (leftImage && typeof leftImage === 'object') || (rightImage && typeof rightImage === 'object')

  return (
    <section className="relative bg-clinical-white dark:bg-navy w-full py-16 lg:py-24">
      <div className="container">
        
        {/* Medical Story Hero Section - FIXED FOR LONG CONTENT */}
        {heroImage && typeof heroImage === 'object' && (
          <div className="relative w-full mb-16 lg:mb-24">
            
            {/* MOBILE-OPTIMIZED: Flexible Background Container - Compact on mobile */}
            <div className="relative min-h-[50vh] sm:min-h-[55vh] lg:min-h-[70vh] overflow-hidden shadow-2xl bg-dark-navy rounded-xl lg:rounded-2xl">
              
              {/* Full-width Medical Background Image - seamless coverage */}
              <div className="absolute inset-0">
                <Media
                  resource={heroImage}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  alt={heroImageAlt || 'Medical laboratory story'}
                  priority
                />
              </div>
              
              {/* MOBILE-OPTIMIZED: Gradient Overlay - Optimized for both mobile and desktop */}
              <div 
                className="absolute inset-0" 
                style={{
                  background: 'linear-gradient(to right, rgba(30, 41, 59, 0.96) 0%, rgba(30, 41, 59, 0.96) 45%, rgba(30, 41, 59, 0.85) 60%, rgba(30, 41, 59, 0.70) 75%, rgba(30, 41, 59, 0.45) 85%, rgba(30, 41, 59, 0.20) 95%, transparent 100%)'
                }} 
              />
              
              {/* MOBILE-OPTIMIZED: Content Container - Compact on mobile, spacious on desktop */}
              <div className="relative z-10 flex items-start py-6 sm:py-8 lg:py-16 min-h-[50vh] sm:min-h-[55vh] lg:min-h-[70vh]">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
                  <div className="w-full max-w-lg sm:max-w-xl lg:max-w-2xl">
                    
                    {/* Medical texture overlay for content area - more organic pattern */}
                    <div className="relative">
                      <div 
                        className="absolute inset-0 opacity-5"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D84D2B' fill-opacity='0.2'%3E%3Cpath d='M0 0h60v2H0zm0 8h60v2H0zm0 16h60v2H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                          backgroundRepeat: 'repeat'
                        }}
                      />
                      
                      <div className="relative z-10 p-4 sm:p-6 lg:p-12 xl:p-16">
                        
                        {/* MOBILE-OPTIMIZED: Medical Story Rich Content - Compact mobile, spacious desktop */}
                        <div className={cn(
                          'w-full max-w-none mb-4 sm:mb-6 lg:mb-8',
                          // MOBILE-OPTIMIZED: Smaller typography on mobile, larger on desktop
                          '[&_h1]:font-heading [&_h1]:text-white [&_h1]:font-bold [&_h1]:w-full [&_h1]:max-w-none',
                          '[&_h1]:text-xl [&_h1]:sm:text-2xl [&_h1]:lg:text-4xl [&_h1]:xl:text-5xl [&_h1]:tracking-tight [&_h1]:leading-tight [&_h1]:mb-3 [&_h1]:sm:mb-4 [&_h1]:lg:mb-6',
                          '[&_h2]:font-heading [&_h2]:text-white [&_h2]:font-semibold [&_h2]:text-lg [&_h2]:sm:text-xl [&_h2]:lg:text-2xl [&_h2]:tracking-wide [&_h2]:mb-2 [&_h2]:sm:mb-3 [&_h2]:lg:mb-4',
                          '[&_p]:font-body [&_p]:text-white [&_p]:text-opacity-90 [&_p]:w-full [&_p]:max-w-none',
                          '[&_p]:text-sm [&_p]:sm:text-base [&_p]:lg:text-lg [&_p]:leading-relaxed [&_p]:mb-2 [&_p]:sm:mb-3 [&_p]:lg:mb-4',
                          // Medical theme emphasis colors with fallbacks
                          '[&_strong]:text-orange-400 [&_strong]:font-semibold',
                          '[&_em]:text-blue-300 [&_em]:italic',
                          // MOBILE-OPTIMIZED: Compact spacing for long content
                          '[&_ul]:mb-2 [&_ul]:sm:mb-3 [&_ul]:lg:mb-4 [&_ol]:mb-2 [&_ol]:sm:mb-3 [&_ol]:lg:mb-4 [&_li]:mb-1 [&_li]:sm:mb-2',
                          '[&_blockquote]:mb-3 [&_blockquote]:sm:mb-4 [&_blockquote]:lg:mb-6 [&_blockquote]:pl-3 [&_blockquote]:sm:pl-4 [&_blockquote]:border-l-2 [&_blockquote]:sm:border-l-4 [&_blockquote]:border-coral/50',
                        )}>
                          <RichText 
                            data={storyContent} 
                            enableGutter={false} 
                            enableProse={false}
                          />
                        </div>
                        
                        {/* MOBILE-OPTIMIZED: Medical CTA Button - Responsive sizing */}
                        {ctaButton?.enabled && ctaButton?.label && ctaButton?.link && (
                          <div className="flex justify-start mt-4 sm:mt-6 lg:mt-8">
                            <WorkshopButton
                              as="link"
                              href={ctaButton.link}
                              variant="primary"
                              size="lg"
                              className="bg-coral hover:bg-coral/90 text-clinical-white shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4"
                            >
                              {ctaButton.label}
                            </WorkshopButton>
                          </div>
                        )}
                        
                        {/* MOBILE-OPTIMIZED: Medical corner accents - smaller on mobile */}
                        <div className="absolute top-3 sm:top-4 lg:top-6 left-3 sm:left-4 lg:left-6 w-2 sm:w-2.5 lg:w-3 h-2 sm:h-2.5 lg:h-3 border-l-2 border-t-2 border-coral/60 rounded-tl-lg transition-colors duration-300 hover:border-coral" />
                        <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 right-3 sm:right-4 lg:right-6 w-2 sm:w-2.5 lg:w-3 h-2 sm:h-2.5 lg:h-3 border-r-2 border-b-2 border-coral/60 rounded-br-lg transition-colors duration-300 hover:border-coral" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* MOBILE-OPTIMIZED: Medical brand mark - smaller and better positioned on mobile */}
              <div className="absolute top-3 sm:top-4 lg:top-6 right-3 sm:right-4 lg:right-6 flex gap-1.5 sm:gap-2 opacity-80">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-coral rounded-full shadow-lg transition-transform duration-300 hover:scale-110" />
                <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-brand-blue rounded-full shadow-lg transition-transform duration-300 hover:scale-110" />
              </div>

              {/* MOBILE-OPTIMIZED: Organic floating elements - smaller on mobile */}
              <div className="hidden sm:block absolute top-1/4 right-1/4 w-3 sm:w-4 h-3 sm:h-4 bg-coral/20 rounded-full blur-sm animate-geometric-float" />
              <div className="hidden sm:block absolute bottom-1/3 right-1/3 w-2 sm:w-3 h-2 sm:h-3 bg-brand-blue/20 rounded-full blur-sm animate-geometric-float" style={{ animationDelay: '2s' }} />
            </div>
          </div>
        )}

        {/* Medical Gallery Section */}
        {hasGalleryImages && (
          <div className="relative">
            
            {/* Gallery Title */}
            {galleryTitle && (
              <div className="text-center mb-12">
                <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-semibold tracking-wide text-dark-navy dark:text-clinical-white mb-4">
                  {galleryTitle}
                </h2>
                {/* Medical theme divider with gradient */}
                <div className="w-16 h-1 bg-gradient-to-r from-coral to-brand-blue mx-auto rounded-full" />
              </div>
            )}
            
            {/* Gallery Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Left Medical Image */}
              {leftImage && typeof leftImage === 'object' && (
                <div className="group relative">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-xl">
                    <Media
                      resource={leftImage}
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      alt={leftImageAlt || 'Medical laboratory detail'}
                    />
                    
                    {/* Medical frame effect with organic border */}
                    <div className="absolute inset-0 border-2 border-coral/30 dark:border-brand-blue/30 rounded-xl transition-colors duration-300 group-hover:border-coral dark:group-hover:border-brand-blue" />
                    
                    {/* Medical corner details - organic */}
                    <div className="absolute top-3 left-3 w-2 h-2 border-l-2 border-t-2 border-clinical-white/70 rounded-tl-lg" />
                    <div className="absolute bottom-3 right-3 w-2 h-2 border-r-2 border-b-2 border-clinical-white/70 rounded-br-lg" />
                    
                    {/* Medical overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-coral/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  </div>
                </div>
              )}
              
              {/* Right Medical Image */}
              {rightImage && typeof rightImage === 'object' && (
                <div className="group relative">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-xl">
                    <Media
                      resource={rightImage}
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      alt={rightImageAlt || 'Medical laboratory detail'}
                    />
                    
                    {/* Medical frame effect with organic border */}
                    <div className="absolute inset-0 border-2 border-coral/30 dark:border-brand-blue/30 rounded-xl transition-colors duration-300 group-hover:border-coral dark:group-hover:border-brand-blue" />
                    
                    {/* Medical corner details - organic */}
                    <div className="absolute top-3 left-3 w-2 h-2 border-l-2 border-t-2 border-clinical-white/70 rounded-tl-lg" />
                    <div className="absolute bottom-3 right-3 w-2 h-2 border-r-2 border-b-2 border-clinical-white/70 rounded-br-lg" />
                    
                    {/* Medical overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Medical background organic shapes */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-coral/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-8 w-32 h-32 bg-orange/5 rounded-full blur-2xl" />
      </div>
    </section>
  )
}