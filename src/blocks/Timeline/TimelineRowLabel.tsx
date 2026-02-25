// src/blocks/Timeline/ui/TimelineRowLabel.tsx
'use client'

import React from 'react'

interface TimelineRowLabelProps {
  data: {
    year?: string
    title?: string
    featured?: boolean
  }
  index: number
}

export const TimelineRowLabel: React.FC<TimelineRowLabelProps> = ({ data, index }) => {
  const isHighlighted = data?.featured || false
  
  if (data?.year && data?.title) {
    return (
      <span className="flex items-center gap-2">
        <span className={isHighlighted ? 'font-semibold text-coral' : ''}>
          {data.year} - {data.title}
        </span>
        {isHighlighted && (
          <span className="px-2 py-0.5 text-xs bg-coral text-white rounded-sm">
            PRIORITY
          </span>
        )}
      </span>
    )
  }
  
  if (data?.year) {
    return (
      <span className={isHighlighted ? 'font-semibold text-coral' : ''}>
        {data.year}
      </span>
    )
  }
  
  if (data?.title) {
    return (
      <span className={isHighlighted ? 'font-semibold text-coral' : ''}>
        {data.title}
      </span>
    )
  }
  
  return <span>Medical Milestone {index + 1}</span>
}