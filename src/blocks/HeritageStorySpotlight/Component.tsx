// src/blocks/HeritageStorySpotlight/Component.tsx
import type { HeritageStorySpotlightBlock as HeritageStorySpotlightBlockType } from '@/payload-types'
import { cn } from '@/utilities/cn'
import React from 'react'
import { HeritageStorySpotlightClient } from './Component.client'

export interface ProcessedStoryData {
  subjectName: string
  storyTitle: string
  subjectRole?: string
  storyContent: any // Rich text content
  featuredQuote?: string
  portraitImage: {
    url: string
    alt: string
    width?: number
    height?: number
  } | null
  signatureImage?: {
    url: string
    alt: string
    width?: number
    height?: number
  } | null
  imagePosition: 'left' | 'right'
  backgroundColor: 'antique' | 'white' | 'charcoal'
}

export const HeritageStorySpotlightBlock: React.FC<
  HeritageStorySpotlightBlockType & {
    id?: string
  }
> = (props) => {
  const {
    subjectName,
    storyTitle,
    subjectRole,
    portraitImage,
    portraitAlt,
    signatureImage,
    signatureAlt,
    storyContent,
    imagePosition = 'left',
    backgroundColor = 'antique',
    featuredQuote,
  } = props

  // Process data with safe defaults
  const processedData: ProcessedStoryData = React.useMemo(() => {
    // Safe portrait image processing - following existing block patterns
    let portraitData: ProcessedStoryData['portraitImage'] | null = null
    
    if (portraitImage && typeof portraitImage === 'object' && portraitImage.url) {
      portraitData = {
        url: portraitImage.url,
        alt: portraitAlt || subjectName || 'Medical professional portrait',
        width: portraitImage.width || undefined,
        height: portraitImage.height || undefined,
      }
    }

    // Safe signature image processing
    let signatureData: ProcessedStoryData['signatureImage'] | null = null
    
    if (signatureImage && typeof signatureImage === 'object' && signatureImage.url) {
      signatureData = {
        url: signatureImage.url,
        alt: signatureAlt || `${subjectName} signature` || 'Medical professional signature',
        width: signatureImage.width || undefined,
        height: signatureImage.height || undefined,
      }
    }

    return {
      subjectName: subjectName || 'Medical Professional',
      storyTitle: storyTitle || 'The Story Behind Our Care',
      subjectRole: subjectRole || undefined,
      storyContent,
      featuredQuote: featuredQuote || undefined,
      portraitImage: portraitData,
      signatureImage: signatureData,
      imagePosition: imagePosition || 'left',
      backgroundColor: backgroundColor || 'antique',
    }
  }, [
    subjectName,
    storyTitle,
    subjectRole,
    portraitImage,
    portraitAlt,
    signatureImage,
    signatureAlt,
    storyContent,
    imagePosition,
    backgroundColor,
    featuredQuote,
  ])

  // Don't render if no story content or subject name
  if (!storyContent || !subjectName) {
    return null
  }

  // Medical background classes following New Birth Labs theme
  const backgroundClasses = {
    antique: 'bg-clinical-white dark:bg-navy/95',
    white: 'bg-clinical-white dark:bg-navy',
    charcoal: 'bg-navy text-clinical-white dark:bg-navy',
  }

  return (
    <section className={cn(
      'relative py-16 lg:py-24',
      backgroundClasses[processedData.backgroundColor],
      'transition-colors duration-300'
    )}>
      <div className="container mx-auto px-6">
        
        {/* Medical Story Content - Client Component for Animations */}
        <HeritageStorySpotlightClient data={processedData} />

        {/* Medical Decorative Elements - Minimal Professional */}
        <div className={cn(
          'absolute inset-x-0 top-0 h-px transition-all duration-300',
          'bg-gradient-to-r from-transparent via-coral/30 to-transparent'
        )} />
        
        <div className={cn(
          'absolute inset-x-0 bottom-0 h-px transition-all duration-300',
          'bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent'
        )} />
      </div>
    </section>
  )
}

// Export types for reuse
export type { HeritageStorySpotlightBlockType }
