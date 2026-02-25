// src/components/ui/SectionHeading/SectionHeading.tsx
import { cn } from '@/utilities/cn'
import React from 'react'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4'
type HeadingSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
type HeadingAlign = 'left' | 'center' | 'right'
type HeadingTheme = 'auto' | 'coral' | 'clinical'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  level?: HeadingLevel
  size?: HeadingSize
  align?: HeadingAlign
  theme?: HeadingTheme
  className?: string
  children?: React.ReactNode
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  level = 'h2',
  size = 'lg',
  align = 'center',
  theme = 'auto',
  className,
  children,
}) => {
  const baseStyles = cn(
    'relative w-full transition-all duration-300',
    {
      'text-left': align === 'left',
      'text-center': align === 'center', 
      'text-right': align === 'right',
    }
  )

  const titleStyles = cn(
    'font-heading font-bold leading-tight tracking-tight transition-all duration-300',
    'relative z-10',
    
    {
      'text-xl sm:text-2xl md:text-3xl': size === 'sm',
      'text-2xl sm:text-3xl md:text-4xl lg:text-5xl': size === 'md',
      'text-3xl sm:text-4xl md:text-5xl lg:text-6xl': size === 'lg',
      'text-4xl sm:text-5xl md:text-6xl lg:text-7xl': size === 'xl',
      'text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl': size === '2xl',
    }
  )

  const subtitleStyles = cn(
    'font-body font-normal leading-relaxed mt-3 sm:mt-4 transition-all duration-300',
    'relative z-10',
    
    {
      'text-sm sm:text-base': size === 'sm',
      'text-base sm:text-lg md:text-xl': size === 'md',
      'text-lg sm:text-xl md:text-2xl': size === 'lg',
      'text-xl sm:text-2xl md:text-3xl': size === 'xl',
      'text-2xl sm:text-3xl md:text-4xl': size === '2xl',
    }
  )

  const themeStyles = {
    auto: cn(
      'text-dark-navy dark:text-clinical-white',
      'drop-shadow-sm dark:drop-shadow-md'
    ),
    coral: cn(
      'text-coral dark:text-coral',
      'drop-shadow-md'
    ),
    clinical: cn(
      'text-brand-blue dark:text-brand-blue',
      'drop-shadow-lg'
    ),
  }

  const subtitleThemeStyles = {
    auto: 'text-blue-gray dark:text-clinical-white/80',
    coral: 'text-coral/80 dark:text-coral/80',
    clinical: 'text-brand-blue/80 dark:text-brand-blue/80',
  }

  const headingProps = {
    className: cn(titleStyles, themeStyles[theme]),
    children: title
  }

  return (
    <div className={cn(baseStyles, className)}>
      {level === 'h1' && <h1 {...headingProps} />}
      {level === 'h2' && <h2 {...headingProps} />}
      {level === 'h3' && <h3 {...headingProps} />}
      {level === 'h4' && <h4 {...headingProps} />}

      {subtitle && (
        <p className={cn(subtitleStyles, subtitleThemeStyles[theme])}>
          {subtitle}
        </p>
      )}

      {children && (
        <div className="mt-6 sm:mt-8 relative z-10">
          {children}
        </div>
      )}
    </div>
  )
}

export type { HeadingAlign, HeadingLevel, HeadingSize, HeadingTheme, SectionHeadingProps }