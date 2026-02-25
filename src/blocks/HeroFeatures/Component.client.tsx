// blocks/HeroFeatures/Component.client.tsx - FIXED

'use client'

import React from 'react'
import type { HeroFeaturesBlock } from '@/payload-types'
import { BlockWrapper } from '@/components/BlockWrapper'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/CMSLink'
import { BorderButton } from '@/components/ui/BorderButton'
import { FeatureCard } from '@/components/ui/Card/Card'
import { Icon } from '@/components/ui/Icon'
import type { Media } from '@/payload-types'
import { cn } from '@/utilities/cn'

export function HeroFeaturesClient(props: HeroFeaturesBlock) {
  const {
    sectionId,
    backgroundImage,
    overlayOpacity = '80',
    heading1,
    heading2,
    description,
    cta1,
    cta2,
    features,
  } = props

  const bgImageUrl = 
    typeof backgroundImage === 'object' && backgroundImage !== null
      ? (backgroundImage as Media).url
      : null

  return (
    <BlockWrapper sectionId={sectionId}>
      <div
        className="-mt-20 lg:-mt-24 relative min-h-[850px] pt-[146px] md:pt-8 lg:pt-8 w-full bg-cover bg-center bg-no-repeat text-white flex flex-col items-center justify-center p-8"
        style={{
          backgroundImage: bgImageUrl ? `url('${bgImageUrl}')` : "url('/hero-bg.jpg')",
        }}
      >
        <div
          className={cn(
            'absolute inset-0 pointer-events-none',
            `bg-black/${overlayOpacity} dark:bg-[#0f131b]/${overlayOpacity}`
          )}
        />

        <div className="w-full relative max-w-6xl space-y-12 z-10">
          
          <div className="flex flex-col items-center text-center space-y-8 mt-[88px]">
            <div className="space-y-6 flex items-center justify-center flex-col">
              
              <div className="space-y-2">
                {heading1 && (
                  <h1 className="text-3xl md:text-6xl font-extrabold tracking-wider max-w-3xl text-white">
                    <RichText 
                      data={heading1} 
                      enableGutter={false} 
                      enableProse={false} 
                    />
                  </h1>
                )}
                
                {heading2 && (
                  <h1 className="text-3xl md:text-6xl font-extrabold tracking-wider max-w-3xl text-primary">
                    <RichText 
                      data={heading2} 
                      enableGutter={false} 
                      enableProse={false} 
                    />
                  </h1>
                )}
              </div>

              {description && (
                <div className="text-lg text-white/90 max-w-2xl">
                  <RichText 
                    data={description} 
                    enableGutter={false} 
                    enableProse={false} 
                  />
                </div>
              )}

              {(cta1?.link || cta2?.link) && (
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {cta1?.link && (
                    <CMSLink link={cta1.link}>
                      <BorderButton
                        text={cta1.link.label || 'Get Started'}
                        variant="filled"
                      />
                    </CMSLink>
                  )}
                  
                  {cta2?.link && (
                    <CMSLink link={cta2.link}>
                      <BorderButton
                        text={cta2.link.label || 'Learn More'}
                        variant="outlined"
                      />
                    </CMSLink>
                  )}
                </div>
              )}
            </div>
          </div>

          {features && features.length > 0 && (
            <div className="flex justify-center">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-5xl mx-auto">
                {features.map((feature, idx) => (
                  <div key={idx} className="-ml-[1px] -mt-[1px]">
                    <FeatureCard
                      icon={
                        feature.icon ? (
                          <Icon name={feature.icon} size={24} className="text-primary" />
                        ) : null
                      }
                      title={feature.title || ''}
                      description={feature.description || ''}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </BlockWrapper>
  )
}