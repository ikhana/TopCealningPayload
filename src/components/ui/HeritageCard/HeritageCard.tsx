// src/components/ui/HeritageCard/HeritageCard.tsx - LCP OPTIMIZED
import { cn } from '@/utilities/cn'
import { Star } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type CardSize = 'sm' | 'md' | 'lg'
type CardTheme = 'light' | 'dark' | 'bourbon'

interface HeritageCardProps {
  title: string
  description?: string
  price?: {
    display: string
    isCustom: boolean
  }
  image?: {
    url: string
    alt: string
  }
  href: string
  featured?: boolean
  size?: CardSize
  theme?: CardTheme
  className?: string
}

export const HeritageCard: React.FC<HeritageCardProps> = ({
  title,
  description,
  price,
  image,
  href,
  featured = false,
  size = 'md',
  theme = 'bourbon',
  className,
}) => {
  
  const themeStyles = {
    light: {
      card: 'bg-antique-white border-smoky-gray/20',
      cardHover: 'hover:border-copper-bourbon/40',
      title: 'text-deep-charcoal group-hover:text-copper-bourbon',
      description: 'text-smoky-gray',
    },
    dark: {
      card: 'bg-charcoal-black border-copper-bourbon/25',
      cardHover: 'hover:border-copper-bourbon/50',
      title: 'text-antique-white group-hover:text-copper-bourbon',
      description: 'text-antique-white/80',
    },
    bourbon: {
      card: 'bg-antique-white border-copper-bourbon/20',
      cardHover: 'hover:border-copper-bourbon/50',
      title: 'text-deep-charcoal group-hover:text-copper-bourbon',
      description: 'text-smoky-gray',
    },
  }

  const currentTheme = themeStyles[theme]

  const sizeStyles = {
    sm: {
      card: 'rounded-lg h-72',
      padding: 'p-3',
      title: 'text-sm font-semibold mb-2',
      description: 'text-xs mb-2',
      price: 'px-2 py-1 text-xs',
      featured: 'px-2 py-1 text-xs top-2 left-2',
    },
    md: {
      card: 'rounded-xl h-80',
      padding: 'p-4',
      title: 'text-base font-semibold mb-3',
      description: 'text-sm mb-3',
      price: 'px-3 py-1.5 text-sm',
      featured: 'px-3 py-1.5 text-xs top-3 left-3',
    },
    lg: {
      card: 'rounded-2xl h-96',
      padding: 'p-5',
      title: 'text-lg font-semibold mb-4',
      description: 'text-base mb-4',
      price: 'px-4 py-2 text-base',
      featured: 'px-4 py-2 text-sm top-4 left-4',
    },
  }

  const currentSize = sizeStyles[size]

  const baseCardStyles = cn(
    'group flex flex-col overflow-hidden cursor-pointer border relative',
    'transition-all duration-300 ease-out',
    'hover:shadow-lg hover:-translate-y-1',
    currentTheme.card,
    currentTheme.cardHover,
    currentSize.card,
    className
  )

  const titleStyles = cn(
    currentSize.title,
    'line-clamp-2 leading-tight transition-colors duration-300',
    currentTheme.title
  )

  const descriptionStyles = cn(
    currentSize.description,
    'line-clamp-2 transition-colors duration-300',
    currentTheme.description
  )

  const imageContainerStyles = cn(
    'relative aspect-[4/3] overflow-hidden bg-antique-white/50',
    size === 'sm' ? 'rounded-t-lg' : size === 'md' ? 'rounded-t-xl' : 'rounded-t-2xl'
  )

  const contentStyles = cn(
    'flex flex-col flex-grow',
    currentSize.padding
  )

  const priceStyles = price?.isCustom 
    ? cn(
        'inline-block rounded font-semibold',
        'bg-copper-bourbon text-antique-white border border-copper-bourbon/80',
        currentSize.price
      )
    : cn(
        'inline-block rounded font-semibold',
        'bg-copper-bourbon/10 text-copper-bourbon border border-copper-bourbon/25',
        currentSize.price
      )

  const featuredStyles = cn(
    'absolute z-20 bg-copper-bourbon text-antique-white rounded-full font-semibold uppercase tracking-wider',
    'border border-copper-bourbon/80 flex items-center gap-1',
    currentSize.featured
  )

  return (
    <Link href={href} className="block h-full">
      <article className={baseCardStyles}>
        
        <div className={imageContainerStyles}>
          {image && (
            <img
              src={image.url}
              alt={image.alt || title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
              width={400}
              height={300}
            />
          )}
          
          {featured && (
            <div className={featuredStyles}>
              <Star className="w-3 h-3 fill-current" />
              Featured
            </div>
          )}
        </div>
        
        <div className={contentStyles}>
          <h3 className={titleStyles}>
            {title}
          </h3>
          
          {description && (
            <p className={descriptionStyles}>
              {description}
            </p>
          )}
          
          {price && (
            <div className="mt-auto">
              <span className={priceStyles}>
                {price.display}
              </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}

export type { CardSize, CardTheme, HeritageCardProps }
