// src/blocks/CallToAction/Component.tsx - CLEAN GEOMETRIC MEDICAL
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import type { CallToActionBlock as CTABlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import React from 'react'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <section className={cn(
      'relative py-16 lg:py-20',
      // Clean medical background
      'bg-clinical-white dark:bg-navy',
      'transition-colors duration-300'
    )}>
      <div className="container mx-auto px-4">
        
        {/* Clean Geometric CTA Container */}
        <div className={cn(
          'relative max-w-5xl mx-auto p-8 lg:p-12 overflow-hidden',
          // Subtle medical background - no heavy gradients
          'bg-clinical-white dark:bg-navy',
          // Clean geometric border
          'border border-coral/20 dark:border-brand-blue/20',
          // Subtle shadow - much lighter
          'shadow-lg shadow-gray-100 dark:shadow-navy/50',
          'transition-all duration-300'
        )}>
          
          {/* Geometric Corner Accents - Square, clean */}
          <div className="absolute top-4 left-4 w-3 h-3 border-l-2 border-t-2 border-coral/40 dark:border-brand-blue/40" />
          <div className="absolute top-4 right-4 w-3 h-3 border-r-2 border-t-2 border-coral/40 dark:border-brand-blue/40" />
          <div className="absolute bottom-4 left-4 w-3 h-3 border-l-2 border-b-2 border-coral/40 dark:border-brand-blue/40" />
          <div className="absolute bottom-4 right-4 w-3 h-3 border-r-2 border-b-2 border-coral/40 dark:border-brand-blue/40" />

          {/* Content Layout */}
          <div className={cn(
            'flex flex-col gap-8 items-center text-center',
            'lg:flex-row lg:justify-between lg:items-center lg:text-left'
          )}>
            
            {/* Rich Text Content */}
            <div className="flex-1 max-w-3xl">
              {richText && (
                <div className={cn(
                  // Clean medical prose styling
                  'prose prose-lg max-w-none',
                  'prose-headings:font-heading prose-headings:text-dark-navy',
                  'prose-headings:dark:text-clinical-white',
                  'prose-p:text-navy prose-p:dark:text-blue-gray',
                  'prose-p:font-body prose-p:leading-relaxed',
                  // Typography scaling
                  'prose-h2:text-2xl lg:prose-h2:text-3xl prose-h2:font-bold',
                  'prose-h3:text-xl lg:prose-h3:text-2xl prose-h3:font-semibold',
                  // Clean color accents
                  'prose-strong:text-coral dark:prose-strong:text-brand-blue prose-strong:font-semibold',
                  'prose-em:text-navy dark:prose-em:text-blue-gray'
                )}>
                  <RichText data={richText} enableGutter={false} />
                </div>
              )}
            </div>

            {/* Clean Action Buttons */}
            {links && links.length > 0 && (
              <div className="flex flex-col gap-4 lg:flex-shrink-0">
                {links.map(({ link }, i) => {
                  if (!link) return null
                  
                  const isPrimary = i === 0
                  
                  return (
                    <CMSLink 
                      key={i}
                      type={link.type}
                      url={link.url}
                      reference={link.reference}
                      label={link.label}
                      newTab={link.newTab}
                      appearance={link.appearance}
                      className={cn(
                        'inline-flex items-center justify-center px-8 py-4',
                        'font-body font-semibold tracking-wide transition-all duration-300',
                        'border-2 transform hover:scale-105',
                        
                        // Primary button - geometric, clean
                        isPrimary ? [
                          'bg-coral hover:bg-coral/90',
                          'border-coral hover:border-coral/90',
                          'text-clinical-white',
                          'shadow-md hover:shadow-lg'
                        ] : [
                          // Secondary button - clean outline
                          'bg-transparent hover:bg-brand-blue',
                          'border-brand-blue hover:border-brand-blue',
                          'text-brand-blue hover:text-clinical-white',
                          'shadow-sm hover:shadow-md'
                        ]
                      )}
                    />
                  )
                })}
              </div>
            )}
          </div>

          {/* Simple geometric accent - no heavy effects */}
          <div className="absolute top-6 right-6 flex gap-2 opacity-20">
            <div className="w-2 h-2 bg-coral" />
            <div className="w-1.5 h-1.5 bg-brand-blue" />
          </div>
        </div>
      </div>
    </section>
  )
}