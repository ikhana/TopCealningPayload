// src/blocks/Timeline/Component.client.tsx - Medical Timeline (Clean Professional)
'use client'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/cn'
import React, { useEffect, useRef, useState } from 'react'
import type { ProcessedTimelineItem } from './Component'

interface TimelineClientProps {
  items: ProcessedTimelineItem[]
  layoutDirection: 'alternating' | 'left' | 'right'
}

export const TimelineClient: React.FC<TimelineClientProps> = ({
  items,
  layoutDirection,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeCard, setActiveCard] = useState<string | null>(items[0]?.id || null)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const itemId = entry.target.getAttribute('data-timeline-id')
            if (itemId) {
              setActiveCard(itemId)
            }
          }
        })
      },
      {
        root: container,
        threshold: [0.5],
        rootMargin: '-20% 0px -20% 0px',
      }
    )

    const timelineItems = container.querySelectorAll('[data-timeline-id]')
    timelineItems.forEach(item => observer.observe(item))

    return () => {
      timelineItems.forEach(item => observer.unobserve(item))
    }
  }, [items])

  if (items.length === 0) return null

  return (
    <div className="relative max-w-5xl mx-auto">
      
      {/* Clean Medical Container */}
      <div className={cn(
        'relative overflow-hidden h-[70vh]',
        // Clean medical background
        'bg-clinical-white dark:bg-navy/90',
        // Simple clean border
        'border-2 border-blue-gray/20 dark:border-blue-gray/30',
        'shadow-lg shadow-navy/5 dark:shadow-dark-navy/20'
      )}>
        
        {/* Simple Corner Accents - Medical Square Style */}
        <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-coral/40" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-brand-blue/40" />

        {/* Scrollable Content */}
        <div 
          ref={scrollContainerRef}
          className="h-full overflow-y-auto p-6 scroll-smooth"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'hsl(var(--color-coral) / 0.3) transparent'
          }}
        >
          
          {/* Clean Timeline Line */}
          <div className={cn(
            'absolute left-8 top-6 bottom-6 w-0.5',
            'bg-gradient-to-b from-transparent via-coral/60 to-transparent'
          )} />

          {/* Timeline Items */}
          <div className="space-y-8 pl-12">
            {items.map((item, index) => {
              const isActive = activeCard === item.id

              return (
                <div
                  key={item.id}
                  data-timeline-id={item.id}
                  className="relative group"
                >
                  
                  {/* Clean Timeline Dot */}
                  <div className={cn(
                    'absolute w-4 h-4 border-2 transition-all duration-300',
                    'left-[-3rem] top-4',
                    item.featured ? [
                      'border-coral bg-coral',
                    ] : [
                      'border-brand-blue bg-clinical-white dark:bg-navy',
                    ],
                    isActive && 'scale-110',
                    'hover:scale-105'
                  )} />

                  {/* Clean Medical Card */}
                  <div className={cn(
                    'relative overflow-hidden transition-all duration-300',
                    // Clean medical backgrounds
                    'bg-clinical-white dark:bg-navy/80',
                    // Simple border
                    'border-2 border-blue-gray/25 dark:border-blue-gray/35',
                    'shadow-lg',
                    // Clean hover effects
                    'hover:shadow-xl hover:border-coral/40 hover:-translate-y-1',
                    // Simple active state
                    isActive && [
                      'ring-2 ring-coral/30',
                      'border-coral/40',
                      'shadow-xl'
                    ]
                  )}>
                    
                    {/* Clean Priority Badge */}
                    {item.featured && (
                      <div className={cn(
                        'absolute top-3 right-3 z-10',
                        'px-3 py-1 text-xs font-bold',
                        'bg-coral text-clinical-white',
                        'shadow-md'
                      )}>
                        Priority
                      </div>
                    )}

                    {/* Image Section */}
                    {item.image && (
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Media
                          resource={typeof item.image === 'number' ? String(item.image) : item.image}
                          alt={item.alt}
                          className="w-full h-full"
                          imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        
                        {/* Clean image overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="p-5">
                      
                      {/* Clean Year Badge */}
                      <div className={cn(
                        'inline-block mb-3 px-3 py-1.5 text-sm font-bold',
                        'bg-coral/15 text-coral',
                        'border-2 border-coral/25'
                      )}>
                        {item.year}
                      </div>

                      {/* Medical Typography */}
                      <h3 className={cn(
                        'font-heading font-bold mb-3 transition-colors duration-300',
                        'text-dark-navy dark:text-clinical-white',
                        'group-hover:text-coral',
                        item.featured ? 'text-xl' : 'text-lg'
                      )}>
                        {item.title}
                      </h3>

                      {/* Medical Description */}
                      <div className={cn(
                        'transition-all duration-500 overflow-hidden',
                        'font-body text-blue-gray dark:text-clinical-white/85',
                        'prose prose-sm max-w-none',
                        'prose-p:text-blue-gray dark:prose-p:text-clinical-white/85',
                        // Clean expand/contract
                        isActive 
                          ? 'max-h-32 opacity-100' 
                          : 'max-h-16 opacity-70'
                      )}>
                        <RichText data={item.description} />
                      </div>
                    </div>

                    {/* Square corner accents - minimal */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-coral/30 opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-brand-blue/30 opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Clean Progress Indicators */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                'w-1.5 h-1.5 transition-all duration-300',
                activeCard === item.id 
                  ? 'bg-coral scale-125' 
                  : 'bg-coral/30'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}