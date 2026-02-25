import { BorderButton } from '@/components/ui/BorderButton/BorderButton'
import { cn } from '@/utilities/cn'
import React from 'react'

interface BlogHeroProps {
  title?: string
  subtitle?: string
  showCTA?: boolean
  ctaText?: string
  ctaLink?: string
  className?: string
}

export const BlogHero: React.FC<BlogHeroProps> = ({
  title = 'Blog',
  subtitle = 'Insights, updates, and stories from our team',
  showCTA = false,
  ctaText = 'Featured Articles',
  ctaLink = '#featured',
  className,
}) => {
  return (
    <section className={cn(
      'relative py-16 lg:py-24 bg-gradient-to-br from-muted/20 to-background dark:from-card/50 dark:to-card transition-colors duration-300',
      className
    )}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
            {title}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>

          {showCTA && (
            <div className="mt-8">
              <BorderButton
                as="link"
                href={ctaLink}
                text={ctaText}
                variant="filled"
              />
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  )
}