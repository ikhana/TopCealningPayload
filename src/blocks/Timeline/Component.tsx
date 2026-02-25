// src/blocks/Timeline/Component.tsx - Medical Timeline Component
import { SectionHeading } from '@/components/ui/SectionHeading'
import { WorkshopButton } from '@/components/ui/WorkshopButton/WorkshopButton'
import type { TimelineBlock as TimelineBlockType } from '@/payload-types'
import { cn } from '@/utilities/cn'
import React from 'react'
import { TimelineClient } from './Component.client'

export interface ProcessedTimelineItem {
  id: string
  year: string
  title: string
  description: any // Rich text content
  image?: number | import('@/payload-types').Media | null
  alt?: string
  featured: boolean
}

export const TimelineBlock: React.FC<
  TimelineBlockType & {
    id?: string
  }
> = (props) => {
  const {
    sectionTitle,
    sectionDescription,
    timelineItems,
    layoutDirection = 'alternating',
    enableCTA = false,
    ctaText,
    ctaLink,
  } = props

  // Process timeline items with safe defaults for medical context
  const processedItems: ProcessedTimelineItem[] = React.useMemo(() => {
    if (!timelineItems?.length) return []
    
    return timelineItems.map((item, index) => {
      return {
        id: `timeline-item-${index}`,
        year: item.year || `Milestone ${index + 1}`,
        title: item.title || 'Medical Milestone',
        description: item.description,
        image: item.milestoneImage || null,
        alt: item.imageAlt || item.title || 'Medical timeline milestone',
        featured: item.featured || false,
      }
    })
  }, [timelineItems])

  if (processedItems.length === 0) {
    return null
  }

  const safeTitle = sectionTitle || 'Our Medical Journey'
  const safeDescription = sectionDescription || undefined
  const safeLayoutDirection = layoutDirection || 'alternating'

  return (
    <section className={cn(
      'relative py-16 lg:py-24',
      'bg-clinical-white dark:bg-navy',
      'transition-colors duration-300'
    )}>
      <div className="container mx-auto px-6">
        
        <div className="mb-16">
          <SectionHeading
            title={safeTitle}
            subtitle={safeDescription}
            level="h2"
            size="lg"
            align="center"
            theme="auto"
            className="max-w-4xl mx-auto"
          />
        </div>

        <TimelineClient
          items={processedItems}
          layoutDirection={safeLayoutDirection}
        />

        {enableCTA && ctaText && ctaLink && (
          <div className="text-center mt-16">
            <WorkshopButton
              href={ctaLink}
              variant="primary"
              size="lg"
              className="px-8 py-4"
            >
              {ctaText}
            </WorkshopButton>
          </div>
        )}
      </div>
    </section>
  )
}

export type { TimelineBlockType }
