'use client'

import React from 'react'
import type { AboutOwnerBlock } from '@/payload-types'
import { BlockWrapper } from '@/components/BlockWrapper'
import { CMSLink } from '@/components/CMSLink'
import { BorderButton } from '@/components/ui/BorderButton'
import type { Media } from '@/payload-types'
import { cn } from '@/utilities/cn'
import Image from 'next/image'

const QuoteMarksSVG = () => (
  <svg
    width="230"
    height="174"
    viewBox="0 0 230 174"
    fill="none"
    className="bg-background dark:bg-card p-[13px]"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M122.812 154.05C124.79 152.348 127.163 151.499 129.929 151.499L177.664 151.499C181.223 151.499 184.091 150.398 186.262 148.199C188.439 145.997 189.524 143.099 189.524 139.5L189.524 124.5C189.524 120.9 188.439 117.997 186.262 115.8C184.088 113.596 181.223 112.5 177.664 112.5L129.926 112.5C127.16 112.5 124.788 111.647 122.809 109.949C120.835 108.247 119.845 106.095 119.845 103.499L119.845 9.00147C119.845 6.40288 120.835 4.25362 122.809 2.5512C124.788 0.853751 127.16 5.20835e-05 129.926 5.23253e-05L188.043 5.7406e-05C200.497 5.84948e-05 210.531 3.85423 218.139 11.5501C225.751 19.256 229.555 29.4032 229.555 42.0042L229.555 132.001C229.555 144.602 225.751 154.749 218.139 162.45C210.531 170.146 200.497 174 188.043 174L129.926 174C127.16 174 124.788 173.146 122.809 171.449C120.835 169.746 119.845 167.597 119.845 164.999L119.845 160.198C119.845 157.799 120.835 155.745 122.809 154.048L122.812 154.05Z"
      fill="currentColor"
    />
    <path
      d="M2.96683 154.05C4.94544 152.348 7.3178 151.499 10.0839 151.499L57.8207 151.499C61.3793 151.499 64.2469 150.398 66.4187 148.199C68.5954 145.997 69.68 143.099 69.68 139.5L69.68 124.5C69.68 120.9 68.5954 117.997 66.4187 115.8C64.2444 113.596 61.3793 112.5 57.8207 112.5L10.0839 112.5C7.3178 112.5 4.94544 111.647 2.96683 109.949C0.99317 108.247 0.00261519 106.095 0.00261542 103.499L0.00262368 9.00147C0.0026239 6.40288 0.993179 4.25362 2.96684 2.5512C4.94545 0.853751 7.31781 5.20837e-05 10.0839 5.23255e-05L68.1992 5.74061e-05C80.6528 5.84949e-05 90.687 3.85423 98.2944 11.5501C105.907 19.251 109.71 29.4007 109.71 41.9992L109.71 132.001C109.71 144.599 105.907 154.749 98.2944 162.45C90.6846 170.146 80.6503 174 68.1967 174L10.0814 174C7.31532 174 4.94296 173.146 2.96435 171.449C0.990685 169.746 0.000130259 167.597 0.000130487 164.999L0.000130906 160.198C0.000131116 157.799 0.990686 155.745 2.96435 154.048L2.96683 154.05Z"
      fill="currentColor"
    />
  </svg>
)

const GradientBorders = () => (
  <>
    <div className="absolute left-0 -top-[1px] h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute -bottom-[1px] left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 -top-[5px] -bottom-[5px] left-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 -top-[5px] -bottom-[5px] right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
  </>
)

export function AboutOwnerClient(props: AboutOwnerBlock) {
  const {
    sectionId,
    backgroundStyle = 'default',
    title,
    quote,
    authorName,
    authorTitle,
    authorImage,
    cta,
  } = props

  const imageUrl = 
    typeof authorImage === 'object' && authorImage !== null
      ? (authorImage as Media).url
      : null

  const backgroundClasses = {
    default: 'bg-background dark:bg-card',
    muted: 'bg-muted dark:bg-card',
    accent: 'bg-primary/5 dark:bg-card',
    gradient: 'bg-gradient-to-br from-background via-muted/30 to-background dark:from-card dark:via-card/80 dark:to-card',
  }

  return (
    <BlockWrapper sectionId={sectionId}>
      <div className={cn('py-12 md:py-16 lg:py-20', backgroundClasses[backgroundStyle as keyof typeof backgroundClasses])}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground text-left mb-8 md:mb-12 lg:mb-16 font-bold font-heading">
            {title}
          </h2>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            
            <div className="flex-1 w-full">
              <div className="relative">
                
                <div className="block lg:hidden mb-4">
                  <div className="text-primary w-[160px]">
                    <QuoteMarksSVG />
                  </div>
                </div>

                <div className="relative bg-muted dark:bg-card/50 backdrop-blur-sm">
                  <GradientBorders />
                  <div className="relative z-10 p-6 md:p-8 lg:p-12">
                    <blockquote className="text-sm md:text-base lg:text-lg text-foreground dark:text-white leading-relaxed font-body">
                      {quote}
                    </blockquote>
                  </div>
                </div>

                <div className="flex">
                  <div className="hidden lg:block">
                    <div className="text-primary">
                      <QuoteMarksSVG />
                    </div>
                  </div>

                  <div className="relative flex-1 bg-muted dark:bg-card/50 backdrop-blur-sm">
                    <GradientBorders />
                    <div className="relative z-10 p-6 flex flex-col">
                      <span className="text-lg md:text-xl font-semibold text-primary font-heading">
                        {authorName}
                      </span>
                      <span className="text-sm md:text-base font-medium text-muted-foreground dark:text-white/80 font-body">
                        {authorTitle}
                      </span>
                      
                      {cta?.link && (
                        <div className="mt-6 md:mt-8 flex justify-end">
                          <CMSLink link={cta.link}>
                            <BorderButton
                              text={cta.link.label || 'Learn More'}
                              variant="filled"
                            />
                          </CMSLink>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {imageUrl && (
              <div className="w-full lg:w-64 xl:w-80 h-80 md:h-96 lg:h-96 flex-shrink-0 relative">
                <GradientBorders />
                <Image
                  src={imageUrl}
                  alt={authorName || 'Author'}
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </BlockWrapper>
  )
}