// src/blocks/QualityGuarantee/Component.tsx
'use client'

import { SectionHeading } from '@/components/ui/SectionHeading'
import { WorkshopButton } from '@/components/ui/WorkshopButton/WorkshopButton'
import type { QualityGuaranteeBlock as QualityGuaranteeBlockType } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { CheckCircle, Heart, Shield, Target } from 'lucide-react'
import React from 'react'
import { BadgeLayout } from './layouts/BadgeLayout'
import { GridLayout } from './layouts/GridLayout'
import { HorizontalLayout } from './layouts/HorizontalLayout'

interface ProcessedGuarantee {
  id: string
  title: string
  icon: string
  description: string
  hasDetails: boolean
  details?: any
  highlight: boolean
}

export const QualityGuaranteeBlock: React.FC<
  QualityGuaranteeBlockType & {
    id?: string
  }
> = (props) => {
  const {
    title,
    description,
    type = 'company',
    layout = 'grid',
    items,
    showBadge = true,
    enableCTA = false,
    ctaText,
    ctaLink,
    product,
  } = props

  // Process guarantee items with safe defaults for medical context
  const processedGuarantees: ProcessedGuarantee[] = React.useMemo(() => {
    if (!items?.length) return []
    
    return items.map((item, index) => ({
      id: `guarantee-${index}`,
      title: item.title || 'Quality Assurance',
      icon: item.icon || 'shield',
      description: item.description || 'Professional medical testing standards',
      hasDetails: item.hasDetails || false,
      details: item.details,
      highlight: item.highlight || false,
    }))
  }, [items])

  // Don't render if no guarantees
  if (processedGuarantees.length === 0) {
    return null
  }

  // Layout component selector
  const renderLayout = () => {
    const layoutProps = {
      guarantees: processedGuarantees,
      guaranteeType: type as 'company' | 'product' | 'service',
    }

    switch (layout) {
      case 'horizontal':
        return <HorizontalLayout {...layoutProps} />
      case 'badges':
        return <BadgeLayout {...layoutProps} />
      default:
        return <GridLayout {...layoutProps} />
    }
  }

  // Medical background styling based on guarantee type
  const getBackgroundStyle = (guaranteeType: string) => {
    switch (guaranteeType) {
      case 'product':
        return 'bg-gradient-to-br from-clinical-white to-brand-blue/5 dark:from-navy dark:to-blue-gray/5'
      case 'service':
        return 'bg-gradient-to-br from-clinical-white to-coral/5 dark:from-navy dark:to-coral/5'
      default:
        return 'bg-gradient-to-br from-clinical-white to-orange/5 dark:from-navy dark:to-orange/5'
    }
  }

  return (
    <section className={cn(
      'relative py-16 lg:py-24 transition-colors duration-300',
      getBackgroundStyle(type || 'company')
    )}>
      
      {/* Square Geometric Medical Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="medicalQualityGrid" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect width="80" height="80" fill="none" stroke="hsl(var(--color-coral))" strokeWidth="0.3" opacity="0.4"/>
              <rect x="20" y="20" width="40" height="40" fill="none" stroke="hsl(var(--color-brand-blue))" strokeWidth="0.2" opacity="0.3"/>
              <rect x="35" y="35" width="10" height="10" fill="hsl(var(--color-coral))" opacity="0.1"/>
              <path d="M40 30 L40 50 M30 40 L50 40" stroke="hsl(var(--color-orange))" strokeWidth="0.3" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#medicalQualityGrid)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Medical Section Header */}
        <div className="max-w-5xl mx-auto text-center mb-12 lg:mb-16">
          
          {/* Medical Type Badge with Square Design */}
          <div className={cn(
            'inline-flex items-center gap-4 px-6 py-4 mb-8',
            'text-sm font-body font-bold uppercase tracking-wide',
            'transition-all duration-300 hover:shadow-lg',
            'backdrop-blur-sm border-2',
            // Square geometric corners
            'relative',
            type === 'product' && [
              'bg-gradient-to-r from-brand-blue/10 to-brand-blue/5',
              'text-brand-blue border-brand-blue/30',
              'dark:bg-gradient-to-r dark:from-brand-blue/15 dark:to-brand-blue/8',
              'dark:text-brand-blue dark:border-brand-blue/40'
            ],
            type === 'service' && [
              'bg-gradient-to-r from-coral/10 to-coral/5',
              'text-coral border-coral/30',
              'dark:bg-gradient-to-r dark:from-coral/15 dark:to-coral/8',
              'dark:text-coral dark:border-coral/40'
            ],
            type === 'company' && [
              'bg-gradient-to-r from-orange/10 to-orange/5',
              'text-orange border-orange/30',
              'dark:bg-gradient-to-r dark:from-orange/15 dark:to-orange/8',
              'dark:text-orange dark:border-orange/40'
            ]
          )}>
            
            {/* Square geometric corner accents */}
            <div className={cn(
              'absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2',
              type === 'product' && 'border-brand-blue',
              type === 'service' && 'border-coral',
              type === 'company' && 'border-orange'
            )} />
            <div className={cn(
              'absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2',
              type === 'product' && 'border-brand-blue',
              type === 'service' && 'border-coral', 
              type === 'company' && 'border-orange'
            )} />
            
            <div className={cn(
              'w-6 h-6 flex items-center justify-center',
              type === 'product' && 'bg-brand-blue text-clinical-white',
              type === 'service' && 'bg-coral text-clinical-white',
              type === 'company' && 'bg-orange text-dark-navy'
            )}>
              {type === 'product' && <Shield className="w-4 h-4" />}
              {type === 'service' && <Heart className="w-4 h-4" />}
              {type === 'company' && <Target className="w-4 h-4" />}
            </div>
            
            <span>
              {type === 'product' && 'Testing Standards'}
              {type === 'service' && 'Care Guarantees'}
              {type === 'company' && 'Quality Promise'}
            </span>
          </div>

          {/* Main Section Heading */}
          <SectionHeading
            title={title || 'Our Medical Standards'}
            subtitle={description || 'Every test backed by CLIA certification, professional accuracy, and our commitment to your health'}
            level="h2"
            size="lg"
            align="center"
            theme="auto"
            className="max-w-4xl mx-auto"
          />
        </div>

        {/* Dynamic Layout Rendering */}
        {renderLayout()}

        {/* Optional Call to Action with Medical Focus */}
        {enableCTA && ctaText && ctaLink && (
          <div className="text-center mt-16 lg:mt-20">
            <WorkshopButton
              href={ctaLink}
              variant="primary"
              size="lg"
              className="px-8 py-4 font-body font-semibold group"
            >
              <span className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5" />
                {ctaText}
              </span>
            </WorkshopButton>
          </div>
        )}

        {/* Square Geometric Medical Dividers */}
        <div className={cn(
          'absolute inset-x-0 top-0 h-px transition-all duration-500',
          'bg-gradient-to-r from-transparent via-coral/20 via-coral/40 via-coral/20 to-transparent',
          'shadow-sm shadow-coral/10'
        )} />
        
        <div className={cn(
          'absolute inset-x-0 bottom-0 h-px transition-all duration-500',
          'bg-gradient-to-r from-transparent via-brand-blue/20 via-brand-blue/40 via-brand-blue/20 to-transparent',
          'shadow-sm shadow-brand-blue/10'
        )} />

        {/* Medical Lab Pattern Overlay */}
        {showBadge && (
          <div 
            className={cn(
              'absolute inset-0 opacity-[0.01] pointer-events-none mix-blend-overlay',
              'dark:opacity-[0.015]'
            )}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D84D2B' fill-opacity='0.4'%3E%3Cpath d='M20 20h4v4h-4v-4zm0-8h4v4h-4v-4zm-8 8h4v4h-4v-4zm0-8h4v4h-4v-4zm8 0h4v4h-4v-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}
          />
        )}
      </div>
    </section>
  )
}

export type { QualityGuaranteeBlockType }
