// src/components/ui/TestCard/index.tsx
import type { Media as MediaType } from '@/payload-types'
import { cn } from '@/utilities/cn'
import React from 'react'
import { WorkshopButton } from '../WorkshopButton/WorkshopButton'

interface TestCardProps {
  testName: string
  subtitle: string
  description: string
  backgroundImage: number | MediaType | null
  ctaButton: {
    text: string
    link: string
  }
  size?: 'featured' | 'secondary'
  className?: string
}

export const TestCard: React.FC<TestCardProps> = ({
  testName,
  subtitle,
  description,
  backgroundImage,
  ctaButton,
  size = 'secondary',
  className
}) => {
  // Handle background image
  const backgroundImageUrl = React.useMemo(() => {
    if (!backgroundImage) return null
    
    if (typeof backgroundImage === 'object' && backgroundImage?.url) {
      return backgroundImage.url
    }
    return null
  }, [backgroundImage])

  const isFeatured = size === 'featured'

  return (
    <div className={cn(
      'relative overflow-hidden bg-clinical-white dark:bg-navy transition-all duration-300',
      'group hover:shadow-lg',
      isFeatured ? 'min-h-[400px] lg:min-h-[500px]' : 'min-h-[350px] lg:min-h-[400px]',
      className
    )}>
      {/* Background Image */}
      {backgroundImageUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        />
      )}

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-navy/75 via-dark-navy/65 to-dark-navy/75" />

      {/* Content */}
      <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col justify-between">
        <div className="space-y-4">
          {/* Test Name */}
          <h3 className={cn(
            'font-heading font-bold text-clinical-white leading-tight',
            isFeatured ? 'text-2xl lg:text-3xl' : 'text-xl lg:text-2xl'
          )}>
            {testName}
          </h3>

          {/* Subtitle */}
          <p className={cn(
            'text-coral font-semibold uppercase tracking-wider',
            isFeatured ? 'text-sm lg:text-base' : 'text-xs lg:text-sm'
          )}>
            {subtitle}
          </p>

          {/* Divider Line */}
          <div className="w-16 h-0.5 bg-coral" />

          {/* Description */}
          <p className={cn(
            'text-clinical-white/90 leading-relaxed font-body',
            isFeatured ? 'text-base lg:text-lg' : 'text-sm lg:text-base',
            'line-clamp-4'
          )}>
            {description}
          </p>
        </div>

        {/* CTA Button */}
        <div className="mt-6">
          <WorkshopButton
            as="link"
            href={ctaButton.link}
            variant="primary"
            size={isFeatured ? "lg" : "md"}
            className={cn(
              'w-full sm:w-auto font-semibold uppercase tracking-wider',
              'hover:scale-105 transform transition-all duration-300'
            )}
          >
            {ctaButton.text}
          </WorkshopButton>
        </div>
      </div>
    </div>
  )
}