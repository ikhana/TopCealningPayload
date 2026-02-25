// src/blocks/QualityGuarantee/layouts/HorizontalLayout.tsx
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

interface HorizontalLayoutProps {
  guarantees: ProcessedGuarantee[]
  guaranteeType: 'company' | 'product' | 'service'
}

export const HorizontalLayout: React.FC<HorizontalLayoutProps> = ({ guarantees, guaranteeType }) => {
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
    <div className="space-y-6 lg:space-y-8">
      {guarantees.map((guarantee, index) => {
        const IconComponent = getIcon(guarantee.icon)
        const isExpanded = expandedItem === guarantee.id
        const isEven = index % 2 === 0

        return (
          <div
            key={guarantee.id}
            className={cn(
              'group transition-all duration-700 ease-out',
              'opacity-0 translate-y-8 animate-in fade-in slide-in-from-bottom-8',
              'hover:scale-[1.02] hover:z-10'
            )}
            style={{ 
              animationDelay: `${index * 200}ms`,
              animationFillMode: 'forwards'
            }}
          >
            {/* Medical Professional Horizontal Card */}
            <div className={cn(
              'relative overflow-hidden transition-all duration-500',
              'bg-clinical-white dark:bg-navy/90',
              'border-2 border-blue-gray/25 dark:border-blue-gray/35',
              'shadow-lg shadow-navy/5 dark:shadow-dark-navy/40',
              'hover:shadow-xl hover:shadow-coral/10 dark:hover:shadow-coral/20',
              'hover:border-coral/40 dark:hover:border-coral/50',
              'hover:-translate-y-1',
              // Square design - no rounded corners
              // Enhanced styling for highlighted guarantees
              guarantee.highlight && [
                'ring-2 ring-coral/30 dark:ring-coral/40',
                'border-coral/60 dark:border-coral/70',
                'shadow-xl shadow-coral/15 dark:shadow-coral/25',
                'bg-gradient-to-br from-coral/8 via-clinical-white to-coral/5',
                'dark:from-coral/12 dark:via-navy/90 dark:to-coral/8'
              ]
            )}>

              {/* Medical Priority Badge */}
              {guarantee.highlight && (
                <div className={cn(
                  'absolute top-4 right-4 z-10',
                  'px-4 py-2 text-xs font-bold uppercase tracking-wider',
                  'bg-coral text-clinical-white border-2 border-coral',
                  'shadow-lg shadow-coral/30',
                  'relative'
                )}>
                  {/* Square corner accents */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-l border-t border-clinical-white" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r border-b border-clinical-white" />
                  Priority
                </div>
              )}

              {/* Horizontal Layout Content */}
              <div className={cn(
                'grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-6 lg:p-8',
                // Alternate layout direction for visual interest
                isEven ? 'lg:grid-flow-col' : 'lg:grid-flow-col-dense'
              )}>
                
                {/* Medical Icon Section */}
                <div className={cn(
                  'lg:col-span-2 flex lg:flex-col items-center justify-center',
                  !isEven && 'lg:order-last'
                )}>
                  <div className={cn(
                    'w-20 h-20 lg:w-24 lg:h-24 flex items-center justify-center',
                    'transition-all duration-500 group-hover:scale-110',
                    isEven ? 'group-hover:rotate-3' : 'group-hover:-rotate-3',
                    'border-2 relative',
                    // Dynamic medical icon styling based on guarantee type
                    guaranteeType === 'company' && [
                      'bg-gradient-to-br from-orange/12 to-orange/6',
                      'dark:from-orange/18 dark:to-orange/10',
                      'text-orange dark:text-orange border-orange/30',
                      'shadow-lg shadow-orange/20 dark:shadow-orange/25'
                    ],
                    guaranteeType === 'product' && [
                      'bg-gradient-to-br from-brand-blue/12 to-brand-blue/6',
                      'dark:from-brand-blue/18 dark:to-brand-blue/10',
                      'text-brand-blue dark:text-brand-blue border-brand-blue/30',
                      'shadow-lg shadow-brand-blue/20 dark:shadow-brand-blue/25'
                    ],
                    guaranteeType === 'service' && [
                      'bg-gradient-to-br from-coral/12 to-coral/6',
                      'dark:from-coral/18 dark:to-coral/10',
                      'text-coral dark:text-coral border-coral/30',
                      'shadow-lg shadow-coral/20 dark:shadow-coral/25'
                    ],
                    // Enhanced styling for highlighted guarantees
                    guarantee.highlight && 'ring-2 ring-coral/20 dark:ring-coral/30'
                  )}>
                    
                    {/* Square corner accents */}
                    <div className={cn(
                      'absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2',
                      guaranteeType === 'company' && 'border-orange',
                      guaranteeType === 'product' && 'border-brand-blue',
                      guaranteeType === 'service' && 'border-coral'
                    )} />
                    <div className={cn(
                      'absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2',
                      guaranteeType === 'company' && 'border-orange',
                      guaranteeType === 'product' && 'border-brand-blue',
                      guaranteeType === 'service' && 'border-coral'
                    )} />
                    
                    <IconComponent className="w-10 h-10 lg:w-12 lg:h-12" />
                  </div>
                </div>

                {/* Content Section */}
                <div className={cn(
                  'lg:col-span-10 space-y-4 lg:space-y-6',
                  !isEven && 'lg:order-first'
                )}>
                  <div className="space-y-4">
                    {/* Medical Title */}
                    <h3 className={cn(
                      'text-2xl lg:text-3xl font-bold font-heading transition-colors duration-500',
                      'text-dark-navy dark:text-clinical-white',
                      'group-hover:text-coral dark:group-hover:text-coral',
                      'leading-tight tracking-wide'
                    )}>
                      {guarantee.title}
                    </h3>

                    {/* Medical Description */}
                    <p className={cn(
                      'text-lg lg:text-xl font-body leading-relaxed',
                      'text-blue-gray dark:text-clinical-white/80',
                      'transition-colors duration-500 max-w-4xl',
                      'group-hover:text-dark-navy dark:group-hover:text-clinical-white'
                    )}>
                      {guarantee.description}
                    </p>
                  </div>

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
                          'border-2 border-coral/20 dark:border-coral/30',
                          'hover:bg-coral/15 dark:hover:bg-coral/20',
                          'hover:border-coral/40 dark:hover:border-coral/50',
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
                          'mt-6 p-6 lg:p-8 transition-all duration-500',
                          'bg-gradient-to-br from-coral/5 via-coral/3 to-transparent',
                          'dark:from-coral/8 dark:via-coral/5 dark:to-transparent',
                          'border-2 border-coral/20 dark:border-coral/30',
                          'shadow-inner max-w-4xl relative'
                        )}>
                          {/* Square corner accents */}
                          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-coral/40" />
                          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-coral/40" />
                          
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
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Square Geometric Corner Accents */}
              <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-coral/30 dark:border-coral/40 transition-all duration-500 group-hover:border-coral dark:group-hover:border-coral opacity-50 group-hover:opacity-80" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-brand-blue/30 dark:border-brand-blue/40 transition-all duration-500 group-hover:border-brand-blue dark:group-hover:border-brand-blue opacity-50 group-hover:opacity-80" />
              
              {/* Medical Quality Marks */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-coral dark:bg-coral opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
              <div className="absolute bottom-3 left-3 w-2 h-2 bg-brand-blue dark:bg-brand-blue opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
            </div>
          </div>
        )
      })}
    </div>
  )
}