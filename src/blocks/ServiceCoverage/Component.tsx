// src/blocks/ServiceCoverage/Component.tsx
import { SectionHeading } from '@/components/ui/SectionHeading'
import { WorkshopButton } from '@/components/ui/WorkshopButton/WorkshopButton'
import type { ServiceCoverageBlock as ServiceCoverageBlockType } from '@/payload-types'
import { cn } from '@/utilities/cn'
import React from 'react'

export const ServiceCoverageBlock: React.FC<ServiceCoverageBlockType> = ({
  sectionTitle,
  sectionSubtitle,
  mapImage,
  coverageStats,
  cities,
  ctaButton,
  id,
}) => {
  const backgroundImageUrl = React.useMemo(() => {
    if (!mapImage) {
      return '/images/maps/arizona-coverage-map.jpg'
    }
    
    if (typeof mapImage === 'object' && mapImage?.url) {
      return mapImage.url
    }
    return '/images/maps/arizona-coverage-map.jpg'
  }, [mapImage])

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'available':
        return {
          container: 'bg-coral/10 border-coral/20 border-2',
          number: 'bg-coral text-white',
          text: 'text-coral',
          tooltip: 'bg-coral text-white'
        }
      case 'coming-soon':
        return {
          container: 'bg-transparent border-orange border-2 border-dashed',
          number: 'bg-transparent border-2 border-orange text-orange',
          text: 'text-orange',
          tooltip: 'bg-transparent border border-orange text-orange'
        }
      case 'on-request':
        return {
          container: 'bg-slate-100 border-slate-300 border-2',
          number: 'bg-slate-400 text-white',
          text: 'text-slate-600',
          tooltip: 'bg-slate-400 text-white'
        }
      default:
        return {
          container: 'bg-coral/10 border-coral/20 border-2',
          number: 'bg-coral text-white',
          text: 'text-coral',
          tooltip: 'bg-coral text-white'
        }
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available'
      case 'coming-soon':
        return 'Coming Soon'
      case 'on-request':
        return 'On Request'
      default:
        return 'Available'
    }
  }

  return (
    <section
      id={id || undefined}
      className="py-12 sm:py-16 lg:py-20 bg-clinical-white dark:bg-navy"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 sm:mb-12 lg:mb-16">
          <SectionHeading
            title={sectionTitle}
            subtitle={sectionSubtitle}
            size="lg"
            align="center"
            theme="auto"
            className="max-w-4xl mx-auto"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
          
          <div className="order-2 lg:order-1">
            <div className="relative">
              {backgroundImageUrl && (
                <div className="relative bg-clinical-white dark:bg-navy rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={backgroundImageUrl}
                    alt="Arizona Coverage Map"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 via-transparent to-coral/10" />
                </div>
              )}
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6 sm:space-y-8">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center p-4 sm:p-6 bg-clinical-white dark:bg-navy border-2 border-coral/20 rounded-lg">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-coral mb-2">
                  {coverageStats?.citiesServed || '15+'}
                </div>
                <div className="text-xs sm:text-sm font-body text-blue-gray dark:text-clinical-white/80">
                  Cities Served
                </div>
              </div>

              <div className="text-center p-4 sm:p-6 bg-clinical-white dark:bg-navy border-2 border-brand-blue/20 rounded-lg">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-brand-blue mb-2">
                  {coverageStats?.serviceRadius || '50'}
                </div>
                <div className="text-xs sm:text-sm font-body text-blue-gray dark:text-clinical-white/80">
                  Mile Radius
                </div>
              </div>

              <div className="text-center p-4 sm:p-6 bg-clinical-white dark:bg-navy border-2 border-orange/20 rounded-lg">
                <div className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-orange mb-2">
                  Same Day
                </div>
                <div className="text-xs sm:text-sm font-body text-blue-gray dark:text-clinical-white/80">
                  Availability
                </div>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-dark-navy dark:text-clinical-white">
                Featured Service Areas
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {cities && cities.map((city, index) => {
                  const styles = getStatusStyles(city.status || 'available')
                  return (
                    <div
                      key={city.id || index}
                      className={cn(
                        'relative p-3 sm:p-4 rounded-lg',
                        styles.container
                      )}
                    >
                      <div className={cn(
                        'absolute -top-2 -right-2 px-2 py-1 rounded text-xs font-medium shadow-sm',
                        styles.tooltip
                      )}>
                        {getStatusText(city.status || 'available')}
                      </div>
                      
                      <span className={cn(
                        'font-body font-medium text-sm sm:text-base block',
                        styles.text
                      )}>
                        {city.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="pt-4">
              <WorkshopButton
                as="link"
                href={ctaButton?.link || '/find-us'}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold uppercase tracking-wider"
              >
                {ctaButton?.text || 'FIND LAB NEAR YOU'}
              </WorkshopButton>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}