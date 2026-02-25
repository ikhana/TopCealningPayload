// src/blocks/QualityGuarantee/layouts/BadgeLayout.tsx
'use client'

import RichText from '@/components/RichText'
import { cn } from '@/utilities/cn'
import { Activity, Award, CheckCircle, Diamond, Heart, Microscope, Shield, Star, Stethoscope, Target } from 'lucide-react'
import React, { useState } from 'react'

interface ProcessedGuarantee {
  id: string
  title: string
  icon: string
  description: string
  hasDetails: boolean
  details?: any
  highlight: boolean
}

interface BadgeLayoutProps {
  guarantees: ProcessedGuarantee[]
  guaranteeType: 'company' | 'product' | 'service'
}

export const BadgeLayout: React.FC<BadgeLayoutProps> = ({ guarantees, guaranteeType }) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  // Medical icon mapping with healthcare-focused icons
  const getIcon = (iconType: string) => {
    const iconMap = {
      shield: Shield,
      trophy: Award,
      star: Star,
      hammer: Microscope,
      diamond: Diamond,
      leaf: Heart,
      target: Target,
      fire: Activity,
      tree: Stethoscope,
      flag: CheckCircle,
    }
    return iconMap[iconType as keyof typeof iconMap] || Shield
  }

  const handleToggleDetails = (guaranteeId: string) => {
    setExpandedItem(expandedItem === guaranteeId ? null : guaranteeId)
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      
      {/* Compact Medical Badge Grid */}
      <div className={cn(
        'flex flex-wrap justify-center gap-4 lg:gap-6',
        'max-w-5xl mx-auto'
      )}>
        {guarantees.map((guarantee, index) => {
          const IconComponent = getIcon(guarantee.icon)

          return (
            <div
              key={guarantee.id}
              className={cn(
                'group transition-all duration-500 ease-out cursor-pointer',
                'opacity-0 translate-y-4 animate-in fade-in slide-in-from-bottom-4',
                'hover:scale-110 hover:z-20'
              )}
              style={{ 
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'forwards'
              }}
              onClick={() => handleToggleDetails(guarantee.id)}
            >
              {/* Square Medical Badge */}
              <div className={cn(
                'relative flex flex-col items-center text-center p-6 lg:p-8',
                'min-w-[160px] lg:min-w-[200px] max-w-[220px]',
                'transition-all duration-500',
                'bg-clinical-white dark:bg-navy/90',
                'border-2 border-blue-gray/25 dark:border-blue-gray/35',
                'shadow-lg shadow-navy/5 dark:shadow-dark-navy/40',
                'hover:shadow-xl hover:shadow-coral/10 dark:hover:shadow-coral/20',
                'hover:border-coral/50 dark:hover:border-coral/60',
                'hover:-translate-y-2',
                // Square design - no rounded corners
                // Enhanced styling for highlighted guarantees
                guarantee.highlight && [
                  'ring-2 ring-coral/40 dark:ring-coral/50',
                  'border-coral/70 dark:border-coral/80',
                  'shadow-xl shadow-coral/20 dark:shadow-coral/30',
                  'bg-gradient-to-br from-coral/10 via-clinical-white to-coral/8',
                  'dark:from-coral/15 dark:via-navy/90 dark:to-coral/10'
                ]
              )}>

                {/* Medical Priority Badge */}
                {guarantee.highlight && (
                  <div className={cn(
                    'absolute -top-2 -right-2 z-10',
                    'px-2 py-1 text-xs font-bold uppercase tracking-wider',
                    'bg-coral text-clinical-white border-2 border-coral',
                    'shadow-lg shadow-coral/40',
                    'relative'
                  )}>
                    {/* Square corner accents */}
                    <div className="absolute -top-1 -left-1 w-2 h-2 border-l border-t border-clinical-white" />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 border-r border-b border-clinical-white" />
                    Priority
                  </div>
                )}

                {/* Square Medical Icon */}
                <div className={cn(
                  'w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center mb-4',
                  'transition-all duration-500 group-hover:scale-125 group-hover:rotate-6',
                  'border-2 relative',
                  // Dynamic icon styling based on guarantee type
                  guaranteeType === 'company' && [
                    'bg-gradient-to-br from-orange/15 to-orange/8',
                    'dark:from-orange/20 dark:to-orange/12',
                    'text-orange dark:text-orange border-orange/30',
                    'shadow-lg shadow-orange/30 dark:shadow-orange/35'
                  ],
                  guaranteeType === 'product' && [
                    'bg-gradient-to-br from-brand-blue/15 to-brand-blue/8',
                    'dark:from-brand-blue/20 dark:to-brand-blue/12',
                    'text-brand-blue dark:text-brand-blue border-brand-blue/30',
                    'shadow-lg shadow-brand-blue/30 dark:shadow-brand-blue/35'
                  ],
                  guaranteeType === 'service' && [
                    'bg-gradient-to-br from-coral/15 to-coral/8',
                    'dark:from-coral/20 dark:to-coral/12',
                    'text-coral dark:text-coral border-coral/30',
                    'shadow-lg shadow-coral/30 dark:shadow-coral/35'
                  ],
                  // Enhanced styling for highlighted guarantees
                  guarantee.highlight && 'ring-2 ring-coral/30 dark:ring-coral/40'
                )}>
                  
                  {/* Square corner accents for icon */}
                  <div className={cn(
                    'absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2',
                    guaranteeType === 'company' && 'border-orange',
                    guaranteeType === 'product' && 'border-brand-blue',
                    guaranteeType === 'service' && 'border-coral'
                  )} />
                  <div className={cn(
                    'absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2',
                    guaranteeType === 'company' && 'border-orange',
                    guaranteeType === 'product' && 'border-brand-blue',
                    guaranteeType === 'service' && 'border-coral'
                  )} />
                  
                  <IconComponent className="w-6 h-6 lg:w-8 lg:h-8" />
                </div>

                {/* Medical Title */}
                <h3 className={cn(
                  'text-base lg:text-lg font-bold font-heading mb-3',
                  'text-dark-navy dark:text-clinical-white',
                  'group-hover:text-coral dark:group-hover:text-coral',
                  'leading-tight tracking-wide transition-colors duration-500',
                  'line-clamp-2'
                )}>
                  {guarantee.title}
                </h3>

                {/* Medical Description */}
                <p className={cn(
                  'text-sm lg:text-base font-body leading-relaxed',
                  'text-blue-gray dark:text-clinical-white/80',
                  'group-hover:text-dark-navy dark:group-hover:text-clinical-white',
                  'transition-colors duration-500 line-clamp-3'
                )}>
                  {guarantee.description}
                </p>

                {/* Expandable Indicator */}
                {guarantee.hasDetails && guarantee.details && (
                  <div className={cn(
                    'mt-4 flex items-center gap-2 text-xs font-body font-bold uppercase tracking-wide',
                    'text-coral dark:text-coral',
                    'group-hover:gap-3 transition-all duration-300'
                  )}>
                    <span>Details</span>
                    <div className="w-3 h-3">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Square Corner Accents - Medical Style */}
                <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-coral/30 dark:border-coral/40 transition-all duration-500 group-hover:border-coral dark:group-hover:border-coral opacity-40 group-hover:opacity-70" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-brand-blue/30 dark:border-brand-blue/40 transition-all duration-500 group-hover:border-brand-blue dark:group-hover:border-brand-blue opacity-40 group-hover:opacity-70" />
                
                {/* Medical Quality Indicators */}
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-coral opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
                <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-brand-blue opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Expanded Details Section - Centralized with Square Design */}
      {expandedItem && (
        <div className="max-w-4xl mx-auto">
          {guarantees.map((guarantee) => {
            if (guarantee.id !== expandedItem || !guarantee.hasDetails || !guarantee.details) return null

            return (
              <div
                key={`details-${guarantee.id}`}
                className={cn(
                  'p-8 lg:p-10 transition-all duration-500',
                  'bg-gradient-to-br from-coral/8 via-coral/5 to-transparent',
                  'dark:from-coral/12 dark:via-coral/8 dark:to-transparent',
                  'border-2 border-coral/30 dark:border-coral/40',
                  'shadow-xl shadow-coral/10 dark:shadow-coral/20',
                  'animate-in fade-in slide-in-from-top-4 duration-500',
                  'relative'
                )}
              >
                {/* Square corner accents */}
                <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-coral" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-coral" />
                
                {/* Details Header */}
                <div className="flex items-center justify-between mb-6">
                  <h4 className={cn(
                    'text-xl lg:text-2xl font-bold font-heading',
                    'text-dark-navy dark:text-clinical-white'
                  )}>
                    {guarantee.title} - Medical Details
                  </h4>
                  
                  <button
                    onClick={() => setExpandedItem(null)}
                    className={cn(
                      'p-2 transition-all duration-300 relative',
                      'text-blue-gray dark:text-clinical-white/80',
                      'hover:text-coral dark:hover:text-coral',
                      'hover:bg-coral/10 dark:hover:bg-coral/15',
                      'border-2 border-transparent hover:border-coral/30'
                    )}
                  >
                    {/* Square corner accents for close button */}
                    <div className="absolute -top-1 -left-1 w-2 h-2 border-l border-t border-coral/40 opacity-0 hover:opacity-100 transition-opacity" />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 border-r border-b border-coral/40 opacity-0 hover:opacity-100 transition-opacity" />
                    
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Rich Text Details */}
                <div className={cn(
                  'prose prose-base max-w-none',
                  'prose-headings:font-heading prose-headings:text-dark-navy',
                  'dark:prose-headings:text-clinical-white',
                  'prose-p:text-blue-gray dark:prose-p:text-clinical-white/80',
                  'prose-p:font-body prose-p:leading-relaxed',
                  'prose-strong:text-coral dark:prose-strong:text-coral'
                )}>
                  <RichText data={guarantee.details} enableGutter={false} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}