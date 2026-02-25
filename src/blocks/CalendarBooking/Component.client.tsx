// src/blocks/CalendarBooking/Component.client.tsx
'use client'

import { SectionHeading } from '@/components/ui/SectionHeading'
import type { CalendarBookingBlock as CalendarBookingBlockType } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { Calendar, Clock, MapPin, Zap } from 'lucide-react'
import React, { useEffect } from 'react'

export const CalendarBookingClient: React.FC<CalendarBookingBlockType & { id?: string }> = ({
  sectionTitle = "Schedule Your Lab Test",
  sectionSubtitle = "Choose your preferred date and time for mobile laboratory services. Our certified professionals will come to your location with all necessary equipment.",
  calendarIframeUrl,
  calendarTitle = "Select Your Appointment",
  calendarDescription = "Mobile lab services • Same-day results available",
  trustIndicators,
  backgroundColor = 'gradient',
  enableBackgroundPattern = true,
  id,
}) => {
  useEffect(() => {
    if (!calendarIframeUrl) return

    const script = document.createElement('script')
    script.src = 'https://link.brandbloom.org/js/form_embed.js'
    script.type = 'text/javascript'
    script.async = true
    document.head.appendChild(script)

    return () => {
      const existingScript = document.querySelector('script[src="https://link.brandbloom.org/js/form_embed.js"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [calendarIframeUrl])

  const backgroundClasses = {
    white: 'bg-white dark:bg-navy',
    clinical: 'bg-clinical-white dark:bg-navy/90',
    gradient: 'bg-gradient-to-br from-gray-50 to-white dark:from-[#1a252f] dark:to-[#25303f]',
    coral: 'bg-gradient-to-br from-coral/5 to-coral/10 dark:from-coral/10 dark:to-coral/15',
  }

  const getIconComponent = (iconType: string) => {
    const iconMap = {
      calendar: Calendar,
      clock: Clock,
      mappin: MapPin,
      zap: Zap,
    }
    return iconMap[iconType as keyof typeof iconMap] || Calendar
  }

  if (!calendarIframeUrl) {
    return (
      <section 
        id={id}
        className={cn('py-20 transition-colors duration-300', backgroundClasses[backgroundColor])}
      >
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="bg-orange/10 border border-orange/20 rounded-lg p-8">
            <Calendar className="w-16 h-16 text-orange mx-auto mb-4" />
            <h3 className="text-xl font-bold text-dark-navy dark:text-clinical-white mb-2">
              Calendar Configuration Needed
            </h3>
            <p className="text-slate-600 dark:text-clinical-white/70">
              Please configure the calendar iframe URL in the block settings to display the booking calendar.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section 
      id={id}
      className={cn('relative py-20 transition-colors duration-300', backgroundClasses[backgroundColor])}
    >
      {enableBackgroundPattern && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="bookingGrid" width="80" height="80" patternUnits="userSpaceOnUse">
                <rect
                  width="80"
                  height="80"
                  fill="none"
                  stroke="hsl(var(--color-coral))"
                  strokeWidth="0.3"
                  opacity="0.4"
                />
                <circle cx="40" cy="40" r="2" fill="hsl(var(--color-coral))" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bookingGrid)" />
          </svg>
        </div>
      )}

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <SectionHeading
            title={sectionTitle}
            subtitle={sectionSubtitle}
            size="xl"
            align="center"
            theme="auto"
            className="max-w-5xl mx-auto"
          />
        </div>

        <div className="max-w-5xl mx-auto">
          {(calendarTitle || calendarDescription) && (
            <div className="bg-gradient-to-r from-coral to-coral/80 text-white p-6 rounded-t-lg">
              {calendarTitle && (
                <h3 className="text-2xl font-bold text-center mb-2">{calendarTitle}</h3>
              )}
              {calendarDescription && (
                <p className="text-center text-coral-100">{calendarDescription}</p>
              )}
            </div>
          )}
          
          <div style={{ minHeight: '650px' }}>
            <iframe 
              src={calendarIframeUrl}
              style={{ 
                width: '100%',
                height: '650px',
                border: 'none',
                overflow: 'hidden',
                display: 'block',
              }} 
              scrolling="no" 
              title="Schedule Your Lab Test"
              loading="lazy"
            />
          </div>
        </div>

        {trustIndicators && trustIndicators.length > 0 && (
          <div className={cn(
            'grid gap-8 mt-16 max-w-5xl mx-auto',
            trustIndicators.length === 1 && 'grid-cols-1 max-w-md',
            trustIndicators.length === 2 && 'grid-cols-1 md:grid-cols-2 max-w-3xl', 
            trustIndicators.length === 3 && 'grid-cols-1 md:grid-cols-3',
            trustIndicators.length >= 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
          )}>
            {trustIndicators.map((indicator, index) => {
              const IconComponent = getIconComponent(indicator.icon || 'calendar')
              
              return (
                <div key={indicator.id || index} className="text-center">
                  <div className="bg-coral/10 dark:bg-coral/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-coral" />
                  </div>
                  <h4 className="font-bold text-lg text-dark-navy dark:text-clinical-white mb-2">
                    {indicator.title}
                  </h4>
                  <p className="text-blue-gray dark:text-clinical-white/80 leading-relaxed">
                    {indicator.description}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}