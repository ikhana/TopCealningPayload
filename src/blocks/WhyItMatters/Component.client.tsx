'use client'

import React from 'react'
import type { WhyItMattersBlock } from '@/payload-types'
import { BlockWrapper } from '@/components/BlockWrapper'
import RichText from '@/components/RichText'
import type { Media } from '@/payload-types'
import { cn } from '@/utilities/cn'
import Image from 'next/image'

const GradientBorders = () => (
  <>
    <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
  </>
)

export function WhyItMattersClient(props: WhyItMattersBlock) {
  const {
    sectionId,
    backgroundStyle = 'muted',
    title,
    stats,
    textureImage,
    overlayImage,
    disclaimer,
  } = props

  const textureUrl = 
    typeof textureImage === 'object' && textureImage !== null
      ? (textureImage as Media).url
      : '/images/backgrounds/texture-background.jpg'

  const overlayUrl = 
    typeof overlayImage === 'object' && overlayImage !== null
      ? (overlayImage as Media).url
      : null

  const backgroundClasses = {
    default: 'bg-background dark:bg-card',
    muted: 'bg-muted dark:bg-card',
    accent: 'bg-primary/5 dark:bg-card',
    gradient: 'bg-gradient-to-br from-background via-muted/30 to-background dark:from-card dark:via-card/80 dark:to-card',
  }

  return (
    <BlockWrapper sectionId={sectionId}>
      <section className={cn('relative py-12 md:py-16 lg:py-0 lg:min-h-[720px] overflow-hidden', backgroundClasses[backgroundStyle as keyof typeof backgroundClasses])}>
        <div className="flex flex-col lg:flex-row h-full">
          
          <div className="relative z-10 w-full lg:w-1/2 flex flex-col justify-center py-8 lg:py-20 px-4 sm:px-6 lg:px-8 lg:pr-16 xl:px-12 xl:pr-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-foreground font-bold font-heading mb-8 lg:mb-12 leading-tight max-w-full lg:max-w-sm xl:max-w-md lg:ml-8 xl:ml-12">
              {title}
            </h2>
            
            {stats && stats.length > 0 && (
              <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 lg:gap-x-12 gap-y-6 lg:gap-y-8 max-w-full lg:max-w-md xl:max-w-lg lg:ml-8 xl:ml-12">
                {stats.map((stat, idx) => (
                  <div key={idx}>
                    {stat.statValue && (
                      <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-primary font-bold font-heading mb-2">
                        <RichText 
                          data={stat.statValue} 
                          enableGutter={false} 
                          enableProse={false} 
                        />
                      </div>
                    )}
                    <p className="text-xs sm:text-sm md:text-base text-foreground dark:text-white/90 leading-relaxed font-body">
                      {stat.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {disclaimer && (
              <p className="mt-6 lg:mt-8 text-xs md:text-sm text-muted-foreground font-body max-w-full lg:max-w-md xl:max-w-lg lg:ml-8 xl:ml-12">
                {disclaimer}
              </p>
            )}
          </div>

          {overlayUrl && (
            <div className="w-full lg:w-1/2 relative">
              <div 
                className="relative w-full h-[400px] md:h-[500px] lg:absolute lg:top-0 lg:right-0 lg:bottom-0 lg:w-[50vw] lg:min-h-[720px]"
                style={{
                  backgroundImage: `url(${textureUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <div className="absolute inset-0 lg:top-0 lg:left-0 lg:w-[400px] xl:w-[480px] lg:h-[500px] xl:h-[580px] w-full h-full">
                  <div className="relative w-full h-full">
                    <GradientBorders />
                    <Image
                      src={overlayUrl}
                      alt="Why it matters"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </BlockWrapper>
  )
}