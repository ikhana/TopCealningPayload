// blocks/ContentShowcase/Component.client.tsx

'use client'

import React from 'react'
import type { ContentShowcaseBlock } from '@/payload-types'
import { BlockWrapper } from '@/components/BlockWrapper'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/CMSLink'
import { BorderButton } from '@/components/ui/BorderButton'
import type { Media } from '@/payload-types'
import { cn } from '@/utilities/cn'
import Image from 'next/image'

// Gradient borders for images
const GradientBorders = () => (
  <>
    <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
  </>
)

export function ContentShowcaseClient(props: ContentShowcaseBlock) {
  const {
    sectionId,
    backgroundStyle = 'default',
    leftContent,
    leftImages,
    rightContent,
    rightImages,
    cta,
  } = props

  const backgroundClasses = {
    default: 'bg-white dark:bg-[#1a2333f0]',
    muted: 'bg-muted dark:bg-card',
    card: 'bg-card dark:bg-card',
  }

  // Get image URLs
  const getImageUrl = (img: any): string | null => {
    if (typeof img === 'object' && img !== null && (img as Media).url) {
      return (img as Media).url!
    }
    return null
  }

  // Get alt text from media object
  const getImageAlt = (img: any): string => {
    if (typeof img === 'object' && img !== null && (img as Media).alt) {
      return (img as Media).alt
    }
    return 'Image'
  }

  return (
    <BlockWrapper sectionId={sectionId}>
      <section className={cn(backgroundClasses[backgroundStyle as keyof typeof backgroundClasses])}>
        <div className="w-full container mx-auto py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-start gap-12 lg:flex-row lg:gap-6">
            
            {/* Left Column */}
            <div className="flex w-full flex-col items-start justify-start gap-12 lg:gap-16 lg:w-1/2">
              {/* Left Content */}
              <div className="w-full">
                <div className="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:font-heading prose-headings:tracking-wide prose-headings:mb-4 prose-headings:mt-0
                  prose-h1:text-3xl prose-h1:sm:text-4xl prose-h1:lg:text-5xl prose-h1:font-extrabold prose-h1:text-foreground
                  prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:lg:text-4xl prose-h2:font-bold prose-h2:text-foreground
                  prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:font-semibold prose-h3:text-primary
                  prose-p:text-base prose-p:sm:text-lg prose-p:text-foreground prose-p:leading-relaxed prose-p:my-4
                  prose-strong:text-foreground prose-strong:font-bold
                  prose-em:text-foreground prose-em:italic
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                ">
                  <RichText 
                    data={leftContent} 
                    enableGutter={false}
                    enableProse={true}
                  />
                </div>
              </div>

              {/* Left Images */}
              {leftImages && leftImages.length > 0 && (
                <div className="flex flex-col items-center justify-center gap-6 md:flex-row w-full">
                  {leftImages.length === 1 && (
                    <>
                      {getImageUrl(leftImages[0].image) && (
                        <div className="relative w-full aspect-[0.7]">
                          <GradientBorders />
                          <Image
                            src={getImageUrl(leftImages[0].image)!}
                            alt={getImageAlt(leftImages[0].image)}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </>
                  )}
                  
                  {leftImages.length === 2 && (
                    <>
                      {getImageUrl(leftImages[0].image) && (
                        <div className="relative w-full md:w-1/2 aspect-[0.7]">
                          <GradientBorders />
                          <Image
                            src={getImageUrl(leftImages[0].image)!}
                            alt={getImageAlt(leftImages[0].image)}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      {getImageUrl(leftImages[1].image) && (
                        <div className="relative w-full md:w-1/2 aspect-[0.7]">
                          <GradientBorders />
                          <Image
                            src={getImageUrl(leftImages[1].image)!}
                            alt={getImageAlt(leftImages[1].image)}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </>
                  )}
                  
                  {leftImages.length === 3 && (
                    <>
                      {getImageUrl(leftImages[0].image) && (
                        <div className="relative w-full md:w-1/2 aspect-[0.7]">
                          <GradientBorders />
                          <Image
                            src={getImageUrl(leftImages[0].image)!}
                            alt={getImageAlt(leftImages[0].image)}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex w-full flex-col items-center justify-center gap-6 md:w-1/2">
                        {getImageUrl(leftImages[1].image) && (
                          <div className="relative w-full aspect-[1.1]">
                            <GradientBorders />
                            <Image
                              src={getImageUrl(leftImages[1].image)!}
                              alt={getImageAlt(leftImages[1].image)}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        {getImageUrl(leftImages[2].image) && (
                          <div className="relative w-full aspect-[0.7]">
                            <GradientBorders />
                            <Image
                              src={getImageUrl(leftImages[2].image)!}
                              alt={getImageAlt(leftImages[2].image)}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="flex w-full flex-col items-center justify-center gap-12 lg:gap-16 pt-0 lg:pt-12 lg:w-1/2">
              {/* Right Images */}
              {rightImages && rightImages.length > 0 && (
                <div className="flex flex-col items-center justify-center gap-6 md:flex-row w-full">
                  {rightImages.length === 1 && (
                    <>
                      {getImageUrl(rightImages[0].image) && (
                        <div className="relative w-full aspect-[0.9]">
                          <GradientBorders />
                          <Image
                            src={getImageUrl(rightImages[0].image)!}
                            alt={getImageAlt(rightImages[0].image)}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </>
                  )}
                  
                  {rightImages.length === 2 && (
                    <>
                      {getImageUrl(rightImages[0].image) && (
                        <div className="relative w-full md:w-1/2 aspect-[0.9]">
                          <GradientBorders />
                          <Image
                            src={getImageUrl(rightImages[0].image)!}
                            alt={getImageAlt(rightImages[0].image)}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      {getImageUrl(rightImages[1].image) && (
                        <div className="relative w-full md:w-1/2 aspect-[0.9]">
                          <GradientBorders />
                          <Image
                            src={getImageUrl(rightImages[1].image)!}
                            alt={getImageAlt(rightImages[1].image)}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </>
                  )}
                  
                  {rightImages.length === 3 && (
                    <>
                      {getImageUrl(rightImages[0].image) && (
                        <div className="relative w-full md:w-1/2 aspect-[0.9]">
                          <GradientBorders />
                          <Image
                            src={getImageUrl(rightImages[0].image)!}
                            alt={getImageAlt(rightImages[0].image)}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex w-full flex-col items-center justify-center gap-6 md:w-1/2">
                        {getImageUrl(rightImages[1].image) && (
                          <div className="relative w-full aspect-[0.8]">
                            <GradientBorders />
                            <Image
                              src={getImageUrl(rightImages[1].image)!}
                              alt={getImageAlt(rightImages[1].image)}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        {getImageUrl(rightImages[2].image) && (
                          <div className="relative w-full aspect-[0.9]">
                            <GradientBorders />
                            <Image
                              src={getImageUrl(rightImages[2].image)!}
                              alt={getImageAlt(rightImages[2].image)}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Right Content */}
              {rightContent && (
                <div className="w-full lg:pl-8">
                  <div className="prose prose-lg dark:prose-invert max-w-none
                    prose-headings:font-heading prose-headings:tracking-wide prose-headings:mb-4 prose-headings:mt-0
                    prose-h1:text-2xl prose-h1:sm:text-3xl prose-h1:font-semibold prose-h1:text-foreground
                    prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:font-semibold prose-h2:text-foreground
                    prose-h3:text-lg prose-h3:sm:text-xl prose-h3:font-semibold prose-h3:text-primary
                    prose-p:text-base prose-p:sm:text-lg prose-p:text-foreground prose-p:leading-relaxed prose-p:my-4
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  ">
                    <RichText 
                      data={rightContent} 
                      enableGutter={false}
                      enableProse={true}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Optional CTA */}
          {cta?.link && (
            <div className="flex justify-center mt-12 md:mt-16">
              <CMSLink link={cta.link}>
                <BorderButton
                  text={cta.link.label || 'Learn More'}
                  variant="filled"
                  className="min-w-[200px]"
                />
              </CMSLink>
            </div>
          )}
        </div>
      </section>
    </BlockWrapper>
  )
}