// src/blocks/CraftsmanshipProcess/ui/ProcessStepRowLabel.tsx
'use client'

import React from 'react'

interface ProcessStepRowLabelProps {
  data: {
    stepNumber?: number
    stepTitle?: string
    highlightStep?: boolean
  }
  index: number
}

export const ProcessStepRowLabel: React.FC<ProcessStepRowLabelProps> = ({ data, index }) => {
  const stepNumber = data?.stepNumber || index + 1
  const stepTitle = data?.stepTitle || `Step ${stepNumber}`
  const isHighlight = data?.highlightStep || false
  
  return (
    <span className="flex items-center gap-2">
      <span className="font-mono text-sm text-gray-500">
        #{stepNumber}
      </span>
      <span className={isHighlight ? 'font-semibold text-coral' : ''}>
        {stepTitle}
      </span>
      {isHighlight && (
        <span className="px-2 py-0.5 text-xs bg-coral text-white rounded-sm">
          PRIORITY
        </span>
      )}
    </span>
  )
}