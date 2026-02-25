// blocks/ContactHero/Component.client.tsx

'use client'

import React from 'react'
import type { ContactHeroBlock, Media } from '@/payload-types'
import { BlockWrapper } from '@/components/BlockWrapper'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/CMSLink'
import { BorderButton } from '@/components/ui/BorderButton'
import { cn } from '@/utilities/cn'
import Image from 'next/image'

// Gradient borders for image
const GradientBorders = () => (
  <>
    <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
  </>
)

export function ContactHeroClient(props: ContactHeroBlock) {
  const {
    sectionId,
    backgroundStyle = 'default',
    content,
    image,
    cta,
  } = props

  const backgroundClasses = {
    default: 'bg-white dark:bg-[#1a2333f0]',
    muted: 'bg-muted dark:bg-card',
    card: 'bg-card dark:bg-card',
  }

  // Get image URL
  const getImageUrl = (): string | null => {
    if (typeof image === 'object' && image !== null && (image as Media).url) {
      return (image as Media).url!
    }
    return null
  }

  // Get alt text
  const getImageAlt = (): string => {
    if (typeof image === 'object' && image !== null && (image as Media).alt) {
      return (image as Media).alt
    }
    return 'Contact us'
  }

  const imageUrl = getImageUrl()

  return (
    <BlockWrapper sectionId={sectionId}>
      <section className={cn(backgroundClasses[backgroundStyle as keyof typeof backgroundClasses])}>
        <div className="container mx-auto py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            {/* Content */}
            <div className={cn(
              "w-full",
              imageUrl ? "lg:w-1/2" : "lg:w-full text-center"
            )}>
              <div className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:font-heading prose-headings:tracking-wide prose-headings:mb-4 prose-headings:mt-0
                prose-h1:text-3xl prose-h1:sm:text-4xl prose-h1:lg:text-5xl prose-h1:font-bold prose-h1:text-foreground
                prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:font-semibold prose-h2:text-foreground
                prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:font-semibold prose-h3:text-primary
                prose-p:text-base prose-p:sm:text-lg prose-p:sm:text-xl prose-p:text-foreground prose-p:leading-relaxed prose-p:my-4
                prose-strong:text-primary prose-strong:font-semibold
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              ">
                <RichText 
                  data={content} 
                  enableGutter={false}
                  enableProse={true}
                />
              </div>

              {/* CTA */}
              {cta?.link && (
                <div className={cn(
                  "mt-8",
                  imageUrl ? "" : "flex justify-center"
                )}>
                  <CMSLink link={cta.link}>
                    <BorderButton
                      text={cta.link.label || 'Get Started'}
                      variant="filled"
                      className="min-w-[200px]"
                    />
                  </CMSLink>
                </div>
              )}
            </div>

            {/* Image */}
            {imageUrl && (
              <div className="w-full lg:w-1/2">
                <div className="relative aspect-[4/3] w-full">
                  <GradientBorders />
                  <Image
                    src={imageUrl}
                    alt={getImageAlt()}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </BlockWrapper>
  )
}