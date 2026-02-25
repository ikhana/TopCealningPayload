// src/blocks/TextContent/Component.tsx

import RichText from '@/components/RichText'
import type { TextContentBlock as TextContentBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import React from 'react'

export const TextContentBlock: React.FC<TextContentBlockProps> = ({ content }) => {
  if (!content) return null

  return (
    <section className="relative py-12 lg:py-16 bg-background dark:bg-card">
      <div className="container mx-auto px-4">
        
        <div className="relative max-w-4xl mx-auto p-8 lg:p-12 bg-background dark:bg-card">
          
          <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
          <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />

          <div className="absolute top-6 left-6 w-3 h-3 border-2 border-primary bg-primary/5" />
          <div className="absolute bottom-6 right-6 w-3 h-3 border-2 border-primary bg-primary/5" />

          <div className="relative">
            <div className="absolute -left-3 top-0 w-1 h-16 bg-gradient-to-b from-primary via-primary/50 to-transparent" />
            
            <div className={cn(
              'prose prose-lg max-w-none',
              
              'prose-headings:font-heading prose-headings:text-foreground prose-headings:font-semibold prose-headings:tracking-wide',
              'prose-h2:text-2xl lg:prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-6 prose-h2:text-primary',
              'prose-h3:text-xl lg:prose-h3:text-2xl prose-h3:font-semibold prose-h3:mb-4 prose-h3:text-primary',
              'prose-h4:text-lg lg:prose-h4:text-xl prose-h4:font-medium prose-h4:mb-3',
              
              'prose-p:font-body prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4',
              'prose-p:text-base lg:prose-p:text-lg',
              
              'prose-strong:text-foreground prose-strong:font-semibold',
              'prose-em:text-muted-foreground prose-em:italic',
              
              'prose-a:text-primary prose-a:no-underline prose-a:transition-colors prose-a:duration-200',
              'hover:prose-a:text-primary/80',
              'prose-a:border-b prose-a:border-primary/30',
              'hover:prose-a:border-primary',
              
              'prose-ul:space-y-2 prose-ol:space-y-2',
              'prose-li:text-muted-foreground prose-li:font-body',
              'prose-li:marker:text-primary',
              
              'prose-blockquote:border-l-4 prose-blockquote:border-primary/40',
              'prose-blockquote:pl-6 prose-blockquote:italic',
              'prose-blockquote:text-muted-foreground',
              'prose-blockquote:bg-primary/5',
              'prose-blockquote:py-4 prose-blockquote:rounded-r-lg',
              
              'prose-code:bg-muted prose-code:text-foreground',
              'prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm',
              
              'prose-table:border-collapse',
              'prose-th:bg-muted prose-th:text-foreground prose-th:font-semibold prose-th:px-4 prose-th:py-3 prose-th:font-body',
              'prose-td:text-muted-foreground prose-td:px-4 prose-td:py-3 prose-td:font-body',
              
              'prose-hr:border-border'
            )}>
              <RichText data={content} enableGutter={false} enableProse={false} />
            </div>
          </div>

          <div className="absolute top-8 right-8 flex items-center gap-2 opacity-30">
            <div className="w-2 h-2 border border-primary bg-primary/10" />
            <div className="w-1.5 h-1.5 border border-primary bg-primary/10" />
          </div>
        </div>
      </div>
    </section>
  )
}