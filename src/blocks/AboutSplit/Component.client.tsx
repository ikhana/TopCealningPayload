// blocks/AboutSplit/Component.client.tsx

'use client'

import React from 'react'
import type { AboutSplitBlock } from '@/payload-types'
import { BlockWrapper } from '@/components/BlockWrapper'
import RichText from '@/components/RichText'
import type { Media } from '@/payload-types'
import { cn } from '@/utilities/cn'
import Image from 'next/image'

export function AboutSplitClient(props: AboutSplitBlock) {
  const {
    sectionId,
    content,
    image,
    backgroundStyle = 'default',
    showDottedPattern = true,
    cardStyle,
  } = props

  const imageUrl: string = 
    (typeof image === 'object' && image !== null && (image as Media).url)
      ? (image as Media).url!
      : '/about-building.jpg'

  const backgroundClasses = {
    default: 'bg-white dark:bg-[#192132]',
    muted: 'bg-muted dark:bg-card',
    accent: 'bg-primary/5 dark:bg-card',
  }

  const cardBackgroundClasses = {
    white: 'bg-white/80 dark:bg-card/80 backdrop-blur-sm',
    card: 'bg-card/90 dark:bg-card/90 backdrop-blur-sm',
    muted: 'bg-muted/90 dark:bg-card/90 backdrop-blur-sm',
    transparent: 'bg-transparent',
  }

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  }

  return (
    <BlockWrapper sectionId={sectionId}>
      <section className={cn(
        '-mt-20 lg:-mt-24 relative isolate',
        backgroundClasses[backgroundStyle as keyof typeof backgroundClasses]
      )}>
        
        {/* Right half image (full height on desktop, stacked on mobile) */}
        <div className="md:absolute md:inset-y-0 md:right-0 md:w-1/2">
          <div className="relative aspect-[16/9] w-full md:h-full md:aspect-auto">
            <Image 
              src={imageUrl} 
              alt="Section image" 
              fill 
              priority 
              className="object-cover" 
            />
          </div>
        </div>

        {/* Left content area */}
        <div className="relative mx-auto flex items-center container px-6 pt-[146px] sm:pt-24 lg:pt-16 pb-16 sm:pb-16 lg:pb-20 lg:px-8">
          <div className="md:pr-12 lg:pr-24 xl:pr-32">
            
            {/* Dotted motif on the far left */}
            {showDottedPattern && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-[78px] left-0 hidden h-full w-48 select-none opacity-20 md:block"
              >
                <svg
                  className="h-64 w-64 text-foreground"
                  viewBox="0 0 320 320"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern id="dotPattern" width="28" height="28" patternUnits="userSpaceOnUse">
                      <circle cx="6" cy="6" r="4" className="fill-current" />
                    </pattern>
                    <clipPath id="triClip">
                      <polygon points="0,0 320,0 0,320" />
                    </clipPath>
                  </defs>
                  <rect width="320" height="320" fill="url(#dotPattern)" clipPath="url(#triClip)" />
                </svg>
              </div>
            )}

            {/* Content Card */}
            <div className={cn(
              'relative z-10 max-w-2xl md:max-w-3xl lg:max-w-4xl p-4 sm:p-5 md:p-6 ring-1 ring-black/5 dark:ring-white/5 md:-mr-20 lg:-mr-28',
              cardBackgroundClasses[cardStyle?.backgroundColor as keyof typeof cardBackgroundClasses || 'white'],
              shadowClasses[cardStyle?.shadow as keyof typeof shadowClasses || 'sm']
            )}>
              {/* Rich Text Content - Styled by theme */}
              <div className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:font-heading prose-headings:tracking-wide prose-headings:mb-3 prose-headings:mt-0
                prose-h1:text-3xl prose-h1:sm:text-4xl prose-h1:font-semibold prose-h1:text-foreground
                prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:font-semibold prose-h2:text-foreground
                prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:font-semibold prose-h3:text-foreground
                prose-p:text-lg prose-p:text-foreground prose-p:leading-relaxed prose-p:my-2
                prose-strong:text-foreground prose-strong:font-semibold
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-ul:text-foreground prose-ol:text-foreground prose-ul:my-2 prose-ol:my-2
                prose-li:text-foreground
              ">
                <RichText 
                  data={content} 
                  enableGutter={false}
                  enableProse={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </BlockWrapper>
  )
}