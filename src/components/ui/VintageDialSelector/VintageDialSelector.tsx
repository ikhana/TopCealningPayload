// src/components/ui/VintageDialSelector/VintageDialSelector.tsx
'use client'
import { cn } from '@/utilities/cn'
import React, { useEffect, useState } from 'react'

// Types for the selector options
export interface SelectorOption {
  id: string
  label: string
  description: string
  icon: string
  link: string
  colorTheme: 'bourbon' | 'cigar'
}

export interface VintageDialSelectorProps {
  /** Main title text above the dial */
  title?: string
  /** Subtitle text below the dial */
  subtitle?: string
  /** Selector options (defaults to bourbon/cigar) */
  options?: SelectorOption[]
  /** Initial selection index */
  defaultSelection?: number
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Theme variant */
  theme?: 'light' | 'dark' | 'heritage'
  /** Additional CSS classes */
  className?: string
  /** Callback when selection changes */
  onSelectionChange?: (option: SelectorOption) => void
  /** Callback when explore button is clicked */
  onExplore?: (option: SelectorOption) => void
  /** Whether to show the explore button */
  showExploreButton?: boolean
}

export const VintageDialSelector: React.FC<VintageDialSelectorProps> = ({
  title = "BUILD YOUR CUSTOM",
  subtitle = "MASTERPIECE",
  options,
  defaultSelection = 0,
  size = 'md',
  theme = 'heritage',
  className,
  onSelectionChange,
  onExplore,
  showExploreButton = true
}) => {
  const [activeSelection, setActiveSelection] = useState(defaultSelection)
  const [isLoaded, setIsLoaded] = useState(false)

  // Default options if none provided
  const defaultOptions: SelectorOption[] = [
    {
      id: 'bourbon',
      label: 'BOURBON BOARDS',
      description: 'Premium handcrafted bourbon tasting boards and accessories',
      icon: '🥃',
      link: '/products/bourbon-boards',
      colorTheme: 'bourbon'
    },
    {
      id: 'cigar',
      label: 'CIGAR BOARDS',
      description: 'Luxury cigar accessories and humidor-grade boards',
      icon: '🔥',
      link: '/products/cigar-boards',
      colorTheme: 'cigar'
    }
  ]

  const selectorOptions = options || defaultOptions
  const currentOption = selectorOptions[activeSelection]

  // Size variants
  const sizeClasses = {
    sm: {
      dial: 'w-64 h-64',
      iconText: 'text-4xl',
      titleText: 'text-base',
      descText: 'text-xs',
      buttonText: 'text-xs px-4 py-1.5',
      dot: 'w-4 h-4',
      radius: 120
    },
    md: {
      dial: 'w-80 h-80',
      iconText: 'text-6xl',
      titleText: 'text-lg',
      descText: 'text-sm',
      buttonText: 'text-sm px-6 py-2',
      dot: 'w-6 h-6',
      radius: 145
    },
    lg: {
      dial: 'w-96 h-96',
      iconText: 'text-8xl',
      titleText: 'text-xl',
      descText: 'text-base',
      buttonText: 'text-base px-8 py-3',
      dot: 'w-8 h-8',
      radius: 170
    }
  }

  const currentSize = sizeClasses[size]

  // Color theme mapping (following your KHAOS patterns)
  const getColorTheme = (colorTheme: 'bourbon' | 'cigar') => {
    switch (colorTheme) {
      case 'bourbon':
        return {
          primary: 'khaos-red',
          accent: 'amber-resin',
          text: 'text-khaos-red',
          bg: 'bg-khaos-red',
          border: 'border-khaos-red',
          glow: 'shadow-khaos-red/30'
        }
      case 'cigar':
        return {
          primary: 'weathered-oak',
          accent: 'workshop-steel',
          text: 'text-weathered-oak',
          bg: 'bg-weathered-oak',
          border: 'border-weathered-oak',
          glow: 'shadow-weathered-oak/30'
        }
    }
  }

  const currentTheme = getColorTheme(currentOption.colorTheme)

  // Theme classes
  const themeClasses = {
    light: {
      header: 'text-charcoal',
      subtitle: 'text-charcoal/80',
      background: 'bg-gradient-to-br from-parchment/20 via-sawdust-cream/30 to-parchment/20'
    },
    dark: {
      header: 'text-sawdust-cream',
      subtitle: 'text-sawdust-cream/80',
      background: 'bg-gradient-to-br from-heritage-navy/20 via-workshop-black/30 to-heritage-navy/20'
    },
    heritage: {
      header: 'text-sawdust-cream',
      subtitle: 'text-sawdust-cream/80',
      background: 'bg-gradient-to-br from-heritage-navy/20 via-workshop-black/30 to-heritage-navy/20'
    }
  }

  const currentThemeClass = themeClasses[theme]

  // Animation loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Handle selection change
  const handleSelectionChange = (index: number) => {
    setActiveSelection(index)
    onSelectionChange?.(selectorOptions[index])
  }

  // Handle explore button click
  const handleExplore = () => {
    onExplore?.(currentOption)
  }

  return (
    <div className={cn('relative group', className)}>
      
      {/* Heritage Badge Header */}
      <div className={cn(
        'flex items-center justify-center mb-6 transition-all duration-700',
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}>
        <div className="flex items-center gap-4">
          {/* Left decorative line */}
          <div className="hidden sm:block flex-1 h-px bg-khaos-red/40 max-w-16"></div>
          
          {/* Heritage Star Icon */}
          <div className="w-1.5 h-1.5 bg-khaos-red rotate-45"></div>
          
          {/* Main Title */}
          <div className={cn(
            'font-sourcesans font-bold text-sm uppercase tracking-wider',
            currentThemeClass.header
          )}>
            {title}
          </div>
          
          {/* Right decorative line */}
          <div className="hidden sm:block flex-1 h-px bg-khaos-red/40 max-w-16"></div>
        </div>
      </div>

      {/* Vintage Dial Interface */}
      <div className={cn(
        'relative mx-auto transition-all duration-700 delay-200',
        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      )}>
        
        {/* Outer Heritage Ring */}
        <div className={cn('relative mx-auto', currentSize.dial)}>
          
          {/* Main Dial Circle */}
          <div className={cn(
            'absolute inset-0 rounded-full border-4 transition-all duration-500',
            currentThemeClass.background,
            'backdrop-blur-sm shadow-2xl',
            currentTheme.border,
            `${currentTheme.glow} shadow-2xl`
          )}>
            
            {/* Heritage Wood Grain Texture */}
            <div 
              className="absolute inset-2 rounded-full opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C28033' fill-opacity='0.6'%3E%3Cpath d='M0 0h120v2H0zm0 6h120v2H0zm0 6h120v1H0zm0 3h120v1H0zm0 3h120v2H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
              }}
            />
          </div>

          {/* Content Display Area */}
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-sawdust-cream/10 via-transparent to-workshop-black/10 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
            
            {/* Selected Option Icon */}
            <div className={cn(
              'mb-4 transition-all duration-500 transform',
              currentSize.iconText,
              isLoaded ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
            )}>
              {currentOption.icon}
            </div>
            
            {/* Selected Option Label */}
            <h3 className={cn(
              'font-playfair font-bold leading-tight mb-3 transition-all duration-500',
              currentSize.titleText,
              currentTheme.text,
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}>
              {currentOption.label}
            </h3>
            
            {/* Description */}
            <p className={cn(
              'font-sourcesans leading-relaxed mb-6 max-w-48',
              currentSize.descText,
              currentThemeClass.subtitle
            )}>
              {currentOption.description}
            </p>
            
            {/* Action Button */}
            {showExploreButton && (
              <button
                onClick={handleExplore}
                className={cn(
                  'rounded-full font-sourcesans font-bold uppercase tracking-wider',
                  'transition-all duration-300 transform hover:scale-105 active:scale-95',
                  'shadow-lg hover:shadow-xl',
                  currentSize.buttonText,
                  currentTheme.bg,
                  'text-sawdust-cream hover:text-white',
                  `hover:${currentTheme.glow}`
                )}
              >
                EXPLORE
              </button>
            )}
          </div>

          {/* Selector Dots - positioned around the dial */}
          <div className="absolute inset-0">
            {selectorOptions.map((option, index) => {
              const angle = (index * 180) - 90 // Position evenly around the dial
              const x = Math.cos((angle * Math.PI) / 180) * currentSize.radius
              const y = Math.sin((angle * Math.PI) / 180) * currentSize.radius
              const isActive = index === activeSelection
              const dotTheme = getColorTheme(option.colorTheme)

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectionChange(index)}
                  className={cn(
                    'absolute rounded-full transition-all duration-300 cursor-pointer border-2',
                    'hover:scale-125 focus:outline-none focus:ring-2 focus:ring-amber-resin/50',
                    currentSize.dot,
                    isActive 
                      ? cn(dotTheme.bg, dotTheme.border, `${dotTheme.glow} shadow-lg scale-110`)
                      : 'bg-sawdust-cream/20 border-sawdust-cream/40 hover:bg-sawdust-cream/30'
                  )}
                  style={{
                    left: `calc(50% + ${x}px - ${parseInt(currentSize.dot.split(' ')[1]) * 4}px)`,
                    top: `calc(50% + ${y}px - ${parseInt(currentSize.dot.split(' ')[1]) * 4}px)`,
                  }}
                  aria-label={`Select ${option.label}`}
                >
                  {/* Inner dot for active state */}
                  {isActive && (
                    <div className="absolute inset-1 rounded-full bg-sawdust-cream animate-pulse" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Heritage Maker's Marks */}
          <div className="absolute top-4 right-4 w-3 h-3 bg-amber-resin/60 rounded-full opacity-80" />
          <div className="absolute bottom-4 left-4 w-2 h-2 bg-khaos-red/50 rotate-45 opacity-60" />
        </div>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div className={cn(
          'text-center mt-6 transition-all duration-700 delay-400',
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}>
          <div className={cn(
            'font-sourcesans text-base uppercase tracking-wider',
            currentThemeClass.subtitle
          )}>
            {subtitle}
          </div>
        </div>
      )}

      {/* Background Heritage Texture */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none rounded-3xl"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C28033' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3Ccircle cx='0' cy='30' r='1'/%3E%3Ccircle cx='60' cy='30' r='1'/%3E%3Ccircle cx='30' cy='0' r='1'/%3E%3Ccircle cx='30' cy='60' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />
    </div>
  )
}