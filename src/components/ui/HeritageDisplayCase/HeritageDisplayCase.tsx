// src/components/ui/HeritageDisplayCase/HeritageDisplayCase.tsx
import { Media } from '@/components/Media'
import { cn } from '@/utilities/cn'
import { Star } from 'lucide-react'
import React from 'react'

type DisplaySize = 'sm' | 'md' | 'lg'
type DisplayTheme = 'light' | 'dark' | 'bourbon'

interface HeritageDisplayCaseProps {
  image: any
  title: string
  description: string
  featured?: boolean
  size?: DisplaySize
  theme?: DisplayTheme
  enableHoverEffects?: boolean
  className?: string
}

export const HeritageDisplayCase: React.FC<HeritageDisplayCaseProps> = ({
  image,
  title,
  description,
  featured = false,
  size = 'md',
  theme = 'light',
  enableHoverEffects = true,
  className,
}) => {
  
  // Mobile-first theme styling
  const themeStyles = {
    light: {
      frame: 'bg-gradient-to-br from-sawdust-cream via-parchment to-sawdust-cream',
      border: 'border-weathered-oak/30 hover:border-amber-resin/50',
      shadow: 'shadow-lg shadow-weathered-oak/20 hover:shadow-2xl hover:shadow-weathered-oak/30',
      glass: 'bg-gradient-to-b from-transparent via-transparent to-workshop-black/5',
      title: 'text-workshop-black',
      description: 'text-workshop-steel',
      plate: 'bg-weathered-oak/10 border-weathered-oak/20',
    },
    dark: {
      frame: 'bg-gradient-to-br from-heritage-navy via-workshop-black to-heritage-navy',
      border: 'border-amber-resin/30 hover:border-amber-resin/60',
      shadow: 'shadow-lg shadow-workshop-black/40 hover:shadow-2xl hover:shadow-workshop-black/60',
      glass: 'bg-gradient-to-b from-transparent via-transparent to-amber-resin/5',
      title: 'text-sawdust-cream',
      description: 'text-sawdust-cream/80',
      plate: 'bg-amber-resin/10 border-amber-resin/20',
    },
    bourbon: {
      frame: 'bg-gradient-to-br from-parchment via-amber-resin/8 to-parchment',
      border: 'border-khaos-red/25 hover:border-khaos-red/50',
      shadow: 'shadow-lg shadow-khaos-red/15 hover:shadow-2xl hover:shadow-khaos-red/25',
      glass: 'bg-gradient-to-b from-transparent via-transparent to-khaos-red/5',
      title: 'text-khaos-red',
      description: 'text-workshop-steel',
      plate: 'bg-khaos-red/8 border-khaos-red/20',
    },
  }

  const currentTheme = themeStyles[theme]

  // Mobile-first size styling
  const sizeStyles = {
    sm: {
      container: 'p-2 rounded-lg',
      imageHeight: 'aspect-square',
      imageRadius: 'rounded-md',
      plate: 'mt-2 p-2 rounded-md',
      title: 'text-xs font-semibold mb-1 leading-tight',
      description: 'text-xs leading-snug line-clamp-2',
      featured: 'top-1.5 right-1.5 px-2 py-0.5 text-xs',
    },
    md: {
      container: 'p-3 sm:p-4 rounded-xl',
      imageHeight: 'aspect-square',
      imageRadius: 'rounded-lg',
      plate: 'mt-3 p-3 rounded-lg',
      title: 'text-sm sm:text-base font-semibold mb-2 leading-tight',
      description: 'text-xs sm:text-sm leading-relaxed line-clamp-3',
      featured: 'top-2 right-2 px-2.5 py-1 text-xs',
    },
    lg: {
      container: 'p-4 sm:p-5 md:p-6 rounded-2xl',
      imageHeight: 'aspect-square',
      imageRadius: 'rounded-xl',
      plate: 'mt-4 p-4 rounded-xl',
      title: 'text-base sm:text-lg md:text-xl font-bold mb-3 leading-tight',
      description: 'text-sm sm:text-base leading-relaxed line-clamp-4',
      featured: 'top-3 right-3 px-3 py-1.5 text-sm',
    },
  }

  const currentSize = sizeStyles[size]

  // Base container styles - mobile-first
  const containerStyles = cn(
    'group relative overflow-hidden border-2 transition-all duration-500 ease-out',
    'will-change-transform',
    currentTheme.frame,
    currentTheme.border,
    currentTheme.shadow,
    currentSize.container,
    enableHoverEffects && 'hover:-translate-y-2 hover:scale-[1.02]',
    className
  )

  // Image container with museum glass effect
  const imageContainerStyles = cn(
    'relative overflow-hidden bg-gradient-to-br from-weathered-oak/5 to-transparent',
    currentSize.imageHeight,
    currentSize.imageRadius
  )

  // Museum plate styling
  const plateStyles = cn(
    'border backdrop-blur-sm',
    currentTheme.plate,
    currentSize.plate
  )

  // Featured badge
  const featuredStyles = cn(
    'absolute z-10 bg-gradient-to-r from-amber-resin to-amber-resin/90',
    'text-workshop-black font-bold uppercase tracking-wide',
    'rounded-full border border-amber-resin/50 backdrop-blur-sm',
    'shadow-lg shadow-amber-resin/30 flex items-center gap-1',
    'transition-all duration-300 hover:scale-105',
    currentSize.featured
  )

  return (
    <article className={containerStyles}>
      
      {/* Image Display with Museum Glass Effect */}
      <div className={imageContainerStyles}>
        {image && (
          <>
            <Media
              resource={image}
              className="w-full h-full"
              imgClassName={cn(
                'w-full h-full object-cover transition-transform duration-700',
                enableHoverEffects && 'group-hover:scale-110'
              )}
              alt={title}
            />
            
            {/* Museum Glass Overlay */}
            <div className={cn(
              'absolute inset-0 opacity-0 transition-opacity duration-500',
              currentTheme.glass,
              enableHoverEffects && 'group-hover:opacity-100'
            )} />
            
            {/* Subtle glass reflection */}
            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/10 via-white/5 to-transparent opacity-40" />
          </>
        )}
        
        {/* Featured Badge */}
        {featured && (
          <div className={featuredStyles}>
            <Star className="w-3 h-3 fill-current" />
            <span>Featured</span>
          </div>
        )}
      </div>
      
      {/* Museum Information Plate */}
      <div className={plateStyles}>
        {/* Title */}
        <h3 className={cn(
          'font-playfair transition-colors duration-300',
          currentTheme.title,
          currentSize.title
        )}>
          {title}
        </h3>
        
        {/* Description */}
        <p className={cn(
          'font-sourcesans transition-colors duration-300',
          currentTheme.description,
          currentSize.description
        )}>
          {description}
        </p>
      </div>

      {/* Heritage Corner Accents */}
      <div className="absolute top-3 left-3 w-2 h-2 border-l-2 border-t-2 border-amber-resin/40 transition-all duration-300 group-hover:border-amber-resin/70" />
      <div className="absolute bottom-3 right-3 w-2 h-2 border-r-2 border-b-2 border-amber-resin/40 transition-all duration-300 group-hover:border-amber-resin/70" />
      
      {/* Premium Maker's Mark */}
      <div className="absolute top-4 right-4 flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-1.5 h-1.5 bg-amber-resin/60 rounded-full shadow-sm" />
        <div className="w-1 h-1 bg-amber-resin/40 rounded-full shadow-sm" />
      </div>
      
      {/* Wood Grain Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B6F3F' fill-opacity='0.4'%3E%3Cpath d='M0 0h120v1H0zm0 4h120v1H0zm0 8h120v1H0zm0 12h120v1H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />
    </article>
  )
}

// Export types for reuse
export type { DisplaySize, DisplayTheme, HeritageDisplayCaseProps }

