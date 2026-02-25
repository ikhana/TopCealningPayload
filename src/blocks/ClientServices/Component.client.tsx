// blocks/ClientServices/Component.client.tsx

'use client'

import React from 'react'
import type { ClientServicesBlock } from '@/payload-types'
import { BlockWrapper } from '@/components/BlockWrapper'
import { Card } from '@/components/ui/Card/Card'
import { Icon } from '@/components/ui/Icon'
import { CMSLink } from '@/components/CMSLink'
import { BorderButton } from '@/components/ui/BorderButton'
import type { Media } from '@/payload-types'
import { cn } from '@/utilities/cn'

export function ClientServicesClient(props: ClientServicesBlock) {
  const {
    sectionId,
    bgImage,
    titleIcon,
    title,
    subtitle,
    services,
    cta,
  } = props

  const bgImageUrl = 
    typeof bgImage === 'object' && bgImage !== null
      ? (bgImage as Media).url
      : '/images/backgrounds/service-transparent.png'

  const topCards = services?.slice(0, 2) || []
  const middleCards = services?.slice(2, 6) || []
  const bottomCards = services?.slice(6, 8) || []

  return (
    <BlockWrapper sectionId={sectionId}>
      <div
        className="relative bg-background dark:bg-card bg-right bg-contain bg-no-repeat py-12 md:py-16 lg:py-20"
        style={{
          backgroundImage: `url(${bgImageUrl})`,
          backgroundSize: 'contain',
          backgroundPosition: 'right center',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col items-center justify-center mb-8 md:mb-12 gap-3 md:gap-4 text-center">
            <div className="flex items-center gap-3 md:gap-4">
              {titleIcon && (
                <Icon 
                  name={titleIcon} 
                  size={36} 
                  className="w-9 h-9 md:w-12 md:h-12 text-primary" 
                />
              )}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground font-extrabold font-heading">
                {title}
              </h2>
            </div>
            {subtitle && (
              <p className="text-sm md:text-base text-muted-foreground font-body">
                {subtitle}
              </p>
            )}
          </div>

          {services && services.length > 0 && (
            <div className="space-y-0">
              
              {/* Top row: 2 cards in columns 1-2 */}
              <div className="grid grid-cols-1 md:grid-cols-4">
                {topCards.map((service, idx) => (
                  <div key={idx} className="-ml-[1px] -mt-[1px]">
                    <Card variant="gradient" padding="md" className="h-full min-h-[180px] bg-card/50 dark:bg-card/80 backdrop-blur-sm">
                      <div className="flex flex-col h-full relative">
                        {service.icon && (
                          <div className="absolute top-0 left-0 w-10 h-10 flex items-center justify-center bg-background dark:bg-card">
                            <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                            <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                            <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                            <Icon 
                              name={service.icon} 
                              size={20} 
                              className="text-primary relative z-10" 
                            />
                          </div>
                        )}
                        <h3 className="text-sm md:text-base font-semibold text-primary font-heading leading-tight mt-12 mb-3">
                          {service.title}
                        </h3>
                        <p className="text-xs md:text-sm text-foreground dark:text-white font-body leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>

              {/* Middle row: 4 cards spanning 1 column each */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                {middleCards.map((service, idx) => (
                  <div key={idx} className="-ml-[1px] -mt-[1px]">
                    <Card variant="gradient" padding="md" className="h-full min-h-[180px] bg-card/50 dark:bg-card/80 backdrop-blur-sm">
                      <div className="flex flex-col h-full relative">
                        {service.icon && (
                          <div className="absolute top-0 left-0 w-10 h-10 flex items-center justify-center bg-background dark:bg-card">
                            <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                            <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                            <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                            <Icon 
                              name={service.icon} 
                              size={20} 
                              className="text-primary relative z-10" 
                            />
                          </div>
                        )}
                        <h3 className="text-sm md:text-base font-semibold text-primary font-heading leading-tight mt-12 mb-3">
                          {service.title}
                        </h3>
                        <p className="text-xs md:text-sm text-foreground dark:text-white font-body leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>

              {/* Bottom row: 2 cards in right columns (3-4) */}
              {bottomCards.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4">
                  {bottomCards.map((service, idx) => (
                    <div key={idx} className={cn(
                      "-ml-[1px] -mt-[1px]",
                      idx === 0 ? "md:col-start-3" : ""
                    )}>
                      <Card variant="gradient" padding="md" className="h-full min-h-[180px] bg-card/50 dark:bg-card/80 backdrop-blur-sm">
                        <div className="flex flex-col h-full relative">
                          {service.icon && (
                            <div className="absolute top-0 left-0 w-10 h-10 flex items-center justify-center bg-background dark:bg-card">
                              <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                              <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                              <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                              <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                              <Icon 
                                name={service.icon} 
                                size={20} 
                                className="text-primary relative z-10" 
                              />
                            </div>
                          )}
                          <h3 className="text-sm md:text-base font-semibold text-primary font-heading leading-tight mt-12 mb-3">
                            {service.title}
                          </h3>
                          <p className="text-xs md:text-sm text-foreground dark:text-white font-body leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {cta?.link && (
            <div className="flex justify-center mt-8 md:mt-10">
              <CMSLink link={cta.link}>
                <BorderButton
                  text={cta.link.label || 'Explore Services'}
                  variant="filled"
                  className="min-w-[200px]"
                />
              </CMSLink>
            </div>
          )}
        </div>
      </div>
    </BlockWrapper>
  )
}