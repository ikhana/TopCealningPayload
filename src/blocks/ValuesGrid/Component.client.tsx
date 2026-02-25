// blocks/ValuesGrid/Component.client.tsx

'use client'

import React from 'react'
import type { ValuesGridBlock } from '@/payload-types'
import { BlockWrapper } from '@/components/BlockWrapper'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/CMSLink'
import { BorderButton } from '@/components/ui/BorderButton'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/utilities/cn'

// Gradient borders for cards
const GradientBorders = () => (
  <>
    <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
  </>
)

export function ValuesGridClient(props: ValuesGridBlock) {
  const {
    sectionId,
    backgroundStyle = 'default',
    eyebrow,
    content,
    values,
    cta,
  } = props

  const backgroundClasses = {
    default: 'bg-white dark:bg-[#192131]',
    muted: 'bg-muted dark:bg-card',
    card: 'bg-card dark:bg-card',
  }

  return (
    <BlockWrapper sectionId={sectionId}>
      <section className={cn(backgroundClasses[backgroundStyle as keyof typeof backgroundClasses])}>
        <div className="container mx-auto py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          
          {/* Eyebrow */}
          {eyebrow && (
            <p className="mb-3 text-xs sm:text-sm tracking-[0.2em] uppercase text-muted-foreground font-body">
              {eyebrow}
            </p>
          )}

          {/* Title & Description */}
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <div className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-heading prose-headings:tracking-wide prose-headings:mb-4 prose-headings:mt-0
              prose-h1:text-2xl prose-h1:sm:text-3xl prose-h1:md:text-4xl prose-h1:font-semibold prose-h1:text-foreground
              prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:md:text-3xl prose-h2:font-semibold prose-h2:text-foreground
              prose-h3:text-lg prose-h3:sm:text-xl prose-h3:font-semibold prose-h3:text-primary
              prose-p:text-base prose-p:sm:text-lg prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:my-3 prose-p:max-w-4xl
              prose-strong:text-foreground prose-strong:font-semibold
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            ">
              <RichText 
                data={content} 
                enableGutter={false}
                enableProse={true}
              />
            </div>
          </div>

          {/* Value Cards */}
          {values && values.length > 0 && (
            <div className="grid gap-5 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, idx) => (
                <article
                  key={idx}
                  className="relative bg-muted/40 dark:bg-[#0f131b] px-5 sm:px-6 py-6 sm:py-8 cursor-pointer transition-all duration-300 hover:bg-muted/60 dark:hover:bg-[#0f131b]/80"
                  style={{ 
                    animation: 'fadeUp 0.6s ease both', 
                    animationDelay: `${idx * 120}ms` 
                  }}
                >
                  {/* Gradient Borders */}
                  <GradientBorders />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon & Title */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                      {value.icon && (
                        <Icon 
                          name={value.icon} 
                          size={28} 
                          className="text-primary shrink-0" 
                        />
                      )}
                      <h3 className="text-lg sm:text-xl font-semibold text-primary font-heading">
                        {value.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-sm sm:text-base leading-7 sm:leading-8 text-muted-foreground dark:text-white/80 font-body">
                      {value.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}

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