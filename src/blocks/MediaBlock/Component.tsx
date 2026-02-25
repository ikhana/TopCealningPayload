// src/blocks/MediaBlock/Component.tsx - HERITAGE ENHANCED & LCP OPTIMIZED
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { MediaBlock as MediaBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import type { StaticImageData } from 'next/image'
import React from 'react'

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
  } = props

  let caption
  if (media && typeof media === 'object') caption = media.caption

  return (
    <section className={cn(
      'relative py-12 lg:py-16',
      // Theme-aware background - consistent with other blocks
      'bg-antique-white dark:bg-charcoal-black',
      'transition-colors duration-300'
    )}>
      <div className={cn(
        'mx-auto px-4',
        {
          container: enableGutter,
        },
        className,
      )}>
        
        {/* Heritage Media Container */}
        <div className={cn(
          'relative max-w-5xl mx-auto group',
          // Heritage frame styling
          'p-6 lg:p-8 rounded-2xl overflow-hidden',
          'bg-gradient-to-br from-white via-antique-white/30 to-white',
          'dark:from-charcoal-black/80 dark:via-charcoal-black dark:to-charcoal-black/80',
          // Premium border treatment
          'border border-antique-brass/20 dark:border-charcoal-gold/25',
          // Sophisticated shadow - single shadow for LCP
          'shadow-xl shadow-copper-bourbon/8 dark:shadow-charcoal-gold/8',
          // Elegant hover enhancement
          'hover:shadow-2xl hover:shadow-copper-bourbon/12 dark:hover:shadow-charcoal-gold/12',
          'transition-all duration-500 ease-out'
        )}>
          
          {/* Heritage Corner Accents - Consistent with other blocks */}
          <div className={cn(
            'absolute top-4 left-4 w-4 h-4 transition-all duration-300',
            'border-l-2 border-t-2 border-copper-bourbon/40 dark:border-charcoal-gold/50',
            'group-hover:border-copper-bourbon dark:group-hover:border-charcoal-gold'
          )} />
          <div className={cn(
            'absolute top-4 right-4 w-4 h-4 transition-all duration-300',
            'border-r-2 border-t-2 border-copper-bourbon/40 dark:border-charcoal-gold/50',
            'group-hover:border-copper-bourbon dark:group-hover:border-charcoal-gold'
          )} />
          <div className={cn(
            'absolute bottom-4 left-4 w-4 h-4 transition-all duration-300',
            'border-l-2 border-b-2 border-copper-bourbon/40 dark:border-charcoal-gold/50',
            'group-hover:border-copper-bourbon dark:group-hover:border-charcoal-gold'
          )} />
          <div className={cn(
            'absolute bottom-4 right-4 w-4 h-4 transition-all duration-300',
            'border-r-2 border-b-2 border-copper-bourbon/40 dark:border-charcoal-gold/50',
            'group-hover:border-copper-bourbon dark:group-hover:border-charcoal-gold'
          )} />

          {/* Premium Photo Frame */}
          <div className={cn(
            'relative overflow-hidden rounded-xl',
            // Inner heritage border for photo frame effect
            'border-2 border-copper-bourbon/30 dark:border-charcoal-gold/40',
            'transition-all duration-300',
            'group-hover:border-copper-bourbon/50 dark:group-hover:border-charcoal-gold/60'
          )}>
            
            {/* Image with heritage treatment */}
            <Media
              imgClassName={cn(
                'w-full h-auto transition-all duration-500 ease-out',
                // Subtle enhancement on hover - no layout shift for LCP
                'group-hover:scale-[1.02]',
                // Remove default styling to use our heritage frame
                '!border-0 !rounded-none',
                imgClassName
              )}
              resource={media}
              src={staticImage}
            />

            {/* Premium Image Overlay */}
            <div className={cn(
              'absolute inset-0 pointer-events-none',
              'bg-gradient-to-br from-white/10 via-transparent to-copper-bourbon/5',
              'dark:from-charcoal-gold/5 dark:via-transparent dark:to-transparent',
              'opacity-0 group-hover:opacity-100 transition-opacity duration-500'
            )} />
          </div>

          {/* Heritage Photo Signature - For premium feel */}
          <div className={cn(
            'absolute bottom-6 right-6 flex gap-1 opacity-20 transition-all duration-300',
            'group-hover:opacity-50'
          )}>
            <div className="w-2 h-2 bg-copper-bourbon/60 dark:bg-charcoal-gold/60 rounded-full shadow-sm" />
            <div className="w-1.5 h-1.5 bg-copper-bourbon/40 dark:bg-charcoal-gold/40 rounded-full shadow-sm" />
          </div>

          {/* Subtle Wood Grain Frame Texture - Ultra-minimal for LCP */}
          <div 
            className={cn(
              'absolute inset-0 opacity-[0.008] pointer-events-none',
              'dark:opacity-[0.012]'
            )}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B6F3F' fill-opacity='0.3'%3E%3Cpath d='M0 0h80v1H0zm0 12h80v1H0zm0 24h80v1H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}
          />
        </div>

        {/* Enhanced Heritage Caption */}
        {caption && (
          <div className={cn(
            'mt-8 max-w-4xl mx-auto',
            {
              container: !disableInnerContainer,
            }
          )}>
            
            {/* Caption Container with Heritage Styling */}
            <div className={cn(
              'relative p-6 rounded-lg',
              'bg-gradient-to-r from-white via-antique-white/50 to-white',
              'dark:from-charcoal-black/60 dark:via-charcoal-black/80 dark:to-charcoal-black/60',
              'border border-antique-brass/15 dark:border-charcoal-gold/20',
              'shadow-sm shadow-copper-bourbon/5 dark:shadow-charcoal-gold/5'
            )}>
              
              {/* Caption Text with Heritage Typography */}
              <div className={cn(
                // Heritage caption prose styling
                'prose prose-sm max-w-none text-center',
                'prose-p:font-sourcesans prose-p:text-antique-brass prose-p:dark:text-smoky-gray',
                'prose-p:italic prose-p:leading-relaxed prose-p:mb-0',
                'prose-p:transition-colors prose-p:duration-300',
                // Enhanced styling for rich content in captions
                'prose-strong:text-copper-bourbon prose-strong:dark:text-charcoal-gold',
                'prose-em:text-antique-brass prose-em:dark:text-smoky-gray',
                captionClassName
              )}>
                <RichText data={caption} enableGutter={false} />
              </div>

              {/* Caption Heritage Accent */}
              <div className={cn(
                'absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-px',
                'bg-gradient-to-r from-transparent via-copper-bourbon/40 to-transparent',
                'dark:via-charcoal-gold/50'
              )} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}