// src/blocks/QualityGuarantee/layouts/GridLayout.tsx
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

interface GridLayoutProps {
  guarantees: ProcessedGuarantee[]
  guaranteeType: 'company' | 'product' | 'service'
}

export const GridLayout: React.FC<GridLayoutProps> = ({ guarantees, guaranteeType }) => {
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
    <div className={cn(
      'grid gap-6 lg:gap-8',
      guarantees.length <= 2 && 'grid-cols-1 md:grid-cols-2',
      guarantees.length === 3 && 'grid-cols-1 md:grid-cols-3',
      guarantees.length === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      guarantees.length >= 5 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    )}>
      {guarantees.map((guarantee, index) => {
        const IconComponent = getIcon(guarantee.icon)
        const isExpanded = expandedItem === guarantee.id

        return (
          <div
            key={guarantee.id}
            className={cn(
              'group relative transition-all duration-500 ease-out',
              'hover:scale-105 hover:z-10'
            )}
            style={{ 
              animationDelay: `${index * 150}ms`,
              animationFillMode: 'forwards'
            }}
          >
            {/* Medical Professional Square Card */}
            <div className={cn(
              'relative overflow-hidden transition-all duration-500',
              'bg-clinical-white dark:bg-navy/90',
              'border-2 border-blue-gray/20 dark:border-blue-gray/30',
              'shadow-lg shadow-navy/5 dark:shadow-dark-navy/40',
              'hover:shadow-xl hover:shadow-coral/10 dark:hover:shadow-coral/20',
              'hover:border-coral/40 dark:hover:border-coral/50',
              'hover:-translate-y-2 p-6 lg:p-8',
              // Square geometric design - no rounded corners
              // Enhanced styling for highlighted guarantees
              guarantee.highlight && [
                'ring-2 ring-coral/30 dark:ring-coral/40',
                'border-coral/60 dark:border-coral/70',
                'shadow-xl shadow-coral/15 dark:shadow-coral/25',
                'bg-gradient-to-br from-coral/8 via-clinical-white to-coral/5',
                'dark:from-coral/10 dark:via-navy/90 dark:to-coral/8'
              ]
            )}>

              {/* Medical Priority Badge */}
              {guarantee.highlight && (
                <div className={cn(
                  'absolute top-4 right-4 z-10',
                  'px-3 py-1 text-xs font-bold uppercase tracking-wider',
                  'bg-coral text-clinical-white border-2 border-coral',
                  'shadow-lg shadow-coral/30',
                  // Square geometric design
                  'relative'
                )}>
                  <div className="absolute -top-1 -left-1 w-2 h-2 border-l border-t border-clinical-white" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 border-r border-b border-clinical-white" />
                  Priority
                </div>
              )}

              {/* Medical Icon Section with Square Design */}
              <div className="mb-6">
                <div className={cn(
                  'w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center',
                  'transition-all duration-500 group-hover:scale-110 group-hover:rotate-3',
                  'border-2 relative',
                  // Medical styling based on guarantee type
                  guaranteeType === 'company' && [
                    'bg-gradient-to-br from-orange/10 to-orange/5',
                    'dark:from-orange/15 dark:to-orange/8',
                    'text-orange dark:text-orange border-orange/30',
                    'shadow-lg shadow-orange/20 dark:shadow-orange/25'
                  ],
                  guaranteeType === 'product' && [
                    'bg-gradient-to-br from-brand-blue/10 to-brand-blue/5',
                    'dark:from-brand-blue/15 dark:to-brand-blue/8',
                    'text-brand-blue dark:text-brand-blue border-brand-blue/30',
                    'shadow-lg shadow-brand-blue/20 dark:shadow-brand-blue/25'
                  ],
                  guaranteeType === 'service' && [
                    'bg-gradient-to-br from-coral/10 to-coral/5',
                    'dark:from-coral/15 dark:to-coral/8',
                    'text-coral dark:text-coral border-coral/30',
                    'shadow-lg shadow-coral/20 dark:shadow-coral/25'
                  ],
                  // Enhanced styling for highlighted guarantees
                  guarantee.highlight && 'ring-2 ring-coral/20 dark:ring-coral/30'
                )}>
                  
                  {/* Square corner accents */}
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
                  
                  <IconComponent className="w-8 h-8 lg:w-10 lg:h-10" />
                </div>
              </div>

              {/* Content Section */}
              <div className="space-y-4">
                {/* Medical Title */}
                <h3 className={cn(
                  'text-xl lg:text-2xl font-bold font-heading transition-colors duration-500',
                  'text-dark-navy dark:text-clinical-white',
                  'group-hover:text-coral dark:group-hover:text-coral',
                  'leading-tight tracking-wide'
                )}>
                  {guarantee.title}
                </h3>

                {/* Medical Description */}
                <p className={cn(
                  'text-base lg:text-lg font-body leading-relaxed',
                  'text-blue-gray dark:text-clinical-white/80',
                  'transition-colors duration-500',
                  'group-hover:text-dark-navy dark:group-hover:text-clinical-white'
                )}>
                  {guarantee.description}
                </p>

                {/* Expandable Details Section with Square Design */}
                {guarantee.hasDetails && guarantee.details && (
                  <div className="pt-4 border-t-2 border-coral/20 dark:border-coral/30">
                    <button
                      onClick={() => handleToggleDetails(guarantee.id)}
                      className={cn(
                        'inline-flex items-center gap-3 px-6 py-3 transition-all duration-300',
                        'text-sm font-body font-bold uppercase tracking-wide',
                        'bg-gradient-to-r from-coral/10 to-coral/5',
                        'dark:from-coral/15 dark:to-coral/8',
                        'text-coral dark:text-coral',
                        'border-2 border-coral/30 dark:border-coral/40',
                        'hover:bg-coral/15 dark:hover:bg-coral/20',
                        'hover:border-coral/60 dark:hover:border-coral/70',
                        'hover:scale-105 hover:shadow-lg',
                        'relative'
                      )}
                    >
                      {/* Square corner accents */}
                      <div className="absolute -top-1 -left-1 w-2 h-2 border-l border-t border-coral" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 border-r border-b border-coral" />
                      
                      <span>{isExpanded ? 'Show Less' : 'Learn More'}</span>
                      <div className={cn(
                        'w-4 h-4 transition-transform duration-300',
                        isExpanded && 'rotate-180'
                      )}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {/* Expanded Content with Square Design */}
                    {isExpanded && (
                      <div className={cn(
                        'mt-6 p-6 transition-all duration-500',
                        'bg-gradient-to-br from-coral/5 via-coral/3 to-transparent',
                        'dark:from-coral/8 dark:via-coral/5 dark:to-transparent',
                        'border-2 border-coral/20 dark:border-coral/30',
                        'shadow-inner relative'
                      )}>
                        {/* Square corner accents */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-coral/40" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-coral/40" />
                        
                        <div className={cn(
                          'prose prose-sm max-w-none',
                          'prose-headings:font-heading prose-headings:text-dark-navy',
                          'dark:prose-headings:text-clinical-white',
                          'prose-p:text-blue-gray dark:prose-p:text-clinical-white/80',
                          'prose-p:font-body prose-p:leading-relaxed',
                          'prose-strong:text-coral dark:prose-strong:text-coral'
                        )}>
                          <RichText data={guarantee.details} enableGutter={false} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Square Geometric Corner Accents */}
              <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-coral/30 dark:border-coral/40 transition-all duration-500 group-hover:border-coral dark:group-hover:border-coral opacity-50 group-hover:opacity-80" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-brand-blue/30 dark:border-brand-blue/40 transition-all duration-500 group-hover:border-brand-blue dark:group-hover:border-brand-blue opacity-50 group-hover:opacity-80" />
              
              {/* Medical Quality Indicators */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-coral dark:bg-coral opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
              <div className="absolute bottom-3 left-3 w-2 h-2 bg-brand-blue dark:bg-brand-blue opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
            </div>
          </div>
        )
      })}
    </div>
  )
}