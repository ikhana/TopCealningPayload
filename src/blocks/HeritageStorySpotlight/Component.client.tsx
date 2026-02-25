// src/blocks/HeritageStorySpotlight/Component.client.tsx
'use client'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/cn'
import React, { useEffect, useRef, useState } from 'react'
import type { ProcessedStoryData } from './Component'

interface HeritageStorySpotlightClientProps {
  data: ProcessedStoryData
}

export const HeritageStorySpotlightClient: React.FC<HeritageStorySpotlightClientProps> = ({
  data,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Performance-optimized intersection observer
  useEffect(() => {
    if (!sectionRef.current) return

    const currentRef = sectionRef.current // Capture ref value

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px',
      }
    )

    observer.observe(currentRef)

    return () => {
      observer.unobserve(currentRef) // Use captured ref value
    }
  }, [])

  const {
    subjectName,
    storyTitle,
    subjectRole,
    storyContent,
    featuredQuote,
    portraitImage,
    signatureImage,
    imagePosition,
    backgroundColor: _backgroundColor, // Prefix unused variable
  } = data

  // Determine if content should be on left or right
  const isImageLeft = imagePosition === 'left'
  const _contentSide = isImageLeft ? 'right' : 'left' // Prefix unused variable

  return (
    <div 
      ref={sectionRef}
      className={cn(
        'relative max-w-7xl mx-auto transition-all duration-700 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
    >
      
      {/* Main Medical Story Layout */}
      <div className={cn(
        'grid gap-8 lg:gap-16 items-center',
        portraitImage ? [
          'grid-cols-1 lg:grid-cols-2',
          !isImageLeft && 'lg:grid-flow-col-dense' // Reverse column order when image on right
        ] : 'grid-cols-1' // Full width when no image
      )}>
        
        {/* Portrait Section - Only render if image exists */}
        {portraitImage && (
          <div className={cn(
            'relative',
            !isImageLeft && 'lg:col-start-2' // Position on right when imagePosition is 'right'
          )}>
            
            {/* Medical Professional Frame Container */}
            <div className={cn(
              'relative group overflow-hidden',
              'transition-all duration-500 hover:scale-[1.02]'
            )}>
              
              {/* Main Portrait Image */}
              <div className={cn(
                'relative aspect-[4/5] overflow-hidden',
                'border-4 border-blue-gray/20 dark:border-blue-gray/30',
                'shadow-lg transition-all duration-300 group-hover:shadow-xl'
              )}>
                <Media
                  resource={portraitImage}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                
                {/* Professional Medical Overlay */}
                <div className={cn(
                  'absolute inset-0 transition-opacity duration-300',
                  'bg-gradient-to-br from-coral/3 via-transparent to-navy/5',
                  'group-hover:opacity-75'
                )} />
              </div>

              {/* Square Corner Accents - Medical Style */}
              <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-coral/60 transition-all duration-300 group-hover:border-coral" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-brand-blue/60 transition-all duration-300 group-hover:border-brand-blue" />
              
              {/* Medical Badge */}
              <div className={cn(
                'absolute -bottom-3 -right-3 w-16 h-16',
                'bg-coral border-4 border-clinical-white dark:border-navy',
                'flex items-center justify-center shadow-lg',
                'transition-all duration-300 group-hover:scale-110'
              )}>
                <div className="w-2 h-2 bg-clinical-white rounded-sm" />
              </div>
            </div>
          </div>
        )}

        {/* Story Content Section */}
        <div className={cn(
          'relative space-y-6',
          portraitImage && !isImageLeft && 'lg:col-start-1' // Position on left when imagePosition is 'right' and image exists
        )}>
          
          {/* Story Title */}
          <div className="space-y-4">
            <h2 className={cn(
              'text-3xl lg:text-4xl xl:text-5xl font-bold font-heading leading-tight',
              'text-dark-navy dark:text-clinical-white',
              'transition-colors duration-300'
            )}>
              {storyTitle}
            </h2>
            
            {/* Medical Divider Line */}
            <div className={cn(
              'w-16 h-1 transition-all duration-300',
              'bg-coral',
              'shadow-sm'
            )} />
          </div>

          {/* Subject Name & Role */}
          {subjectName && (
            <div className="space-y-1">
              <h3 className={cn(
                'text-xl lg:text-2xl font-semibold font-heading',
                'text-coral',
                'transition-colors duration-300'
              )}>
                {subjectName}
              </h3>
              {subjectRole && (
                <p className={cn(
                  'text-lg font-body italic',
                  'text-blue-gray dark:text-clinical-white/80',
                  'transition-colors duration-300'
                )}>
                  {subjectRole}
                </p>
              )}
            </div>
          )}

          {/* Featured Quote - If Provided */}
          {featuredQuote && (
            <blockquote className={cn(
              'relative pl-6 py-4 my-6 border-l-4 border-coral',
              'bg-coral/5 dark:bg-coral/10',
              'transition-all duration-300'
            )}>
             <p className={cn(
                'text-lg lg:text-xl font-body italic leading-relaxed',
                'text-dark-navy dark:text-clinical-white'
              )}>
                &ldquo;{featuredQuote}&rdquo;
              </p>
              
              {/* Quote Mark Decoration */}
              <div className={cn(
                'absolute -top-2 left-2 text-4xl font-heading',
                'text-coral opacity-60'
              )}>
                &ldquo;
              </div>
            </blockquote>
          )}

          {/* Main Story Content */}
          <div className={cn(
            'prose prose-lg max-w-none',
            'font-body leading-relaxed',
            // Medical theme prose styling
            'prose-headings:font-heading prose-headings:text-dark-navy',
            'dark:prose-headings:text-clinical-white',
            'prose-p:text-blue-gray dark:prose-p:text-clinical-white/80',
            'prose-p:text-lg prose-p:leading-relaxed',
            'prose-strong:text-coral dark:prose-strong:text-coral',
            'transition-colors duration-300'
          )}>
            <RichText data={storyContent} enableGutter={false} />
          </div>

          {/* Signature Image - Only render if exists */}
          {signatureImage && (
            <div className="flex justify-end mt-8">
              <div className={cn(
                'relative transition-all duration-300 hover:scale-105',
                'filter drop-shadow-sm'
              )}>
                <Media
                  resource={signatureImage}
                  className="h-12 lg:h-16 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Medical Decorative Elements - Minimal */}
      <div className={cn(
        'absolute top-8 left-8 w-2 h-2 opacity-20 transition-opacity duration-300',
        'bg-coral',
        isVisible && 'opacity-40'
      )} />
      
      <div className={cn(
        'absolute bottom-8 right-8 w-1.5 h-1.5 opacity-20 transition-opacity duration-300',
        'bg-brand-blue',
        isVisible && 'opacity-40'
      )} />
    </div>
  )
}