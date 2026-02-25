// src/heros/HeritageCraftsmanship/ImageCarousel.tsx
'use client'
import { cn } from '@/utilities/cn'
import React, { useCallback, useState } from 'react'

type ImageCarouselProps = {
  images: {
    image: {
      url: string
      alt: string
    }
  }[]
  onImageSelectAction: (index: number) => void
  activeIndex?: number
  className?: string
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images: displayImages,
  onImageSelectAction,
  activeIndex = 0,
  className
}) => {
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Optimized image change handler
  const handleImageChange = useCallback((newIndex: number) => {
    if (isTransitioning || newIndex === activeIndex) return
    
    setIsTransitioning(true)
    onImageSelectAction(newIndex)
    
    // Reset transition state
    setTimeout(() => setIsTransitioning(false), 700)
  }, [isTransitioning, activeIndex, onImageSelectAction])

  // Enhanced touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX)
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX || isTransitioning) return
    
    const touchEndX = e.changedTouches[0].clientX
    const distance = touchStartX - touchEndX
    
    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        // Swipe left - next image
        const next = activeIndex < displayImages.length - 1 ? activeIndex + 1 : 0
        handleImageChange(next)
      } else {
        // Swipe right - previous image
        const prev = activeIndex > 0 ? activeIndex - 1 : displayImages.length - 1
        handleImageChange(prev)
      }
    }
    setTouchStartX(null)
  }

  const handlePrevious = () => {
    const prev = activeIndex > 0 ? activeIndex - 1 : displayImages.length - 1
    handleImageChange(prev)
  }

  const handleNext = () => {
    const next = activeIndex < displayImages.length - 1 ? activeIndex + 1 : 0
    handleImageChange(next)
  }

  return (
    <div className={cn("relative w-full h-full bg-smoky-gray overflow-hidden", className)}>
      
      {/* Professional Sliding Container */}
      <div 
        className="w-full h-full overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: 'pan-y pinch-zoom' }}
      >
        <div 
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ 
            width: `${displayImages.length * 100}%`,
            transform: `translateX(-${activeIndex * (100 / displayImages.length)}%)`,
            // Hardware acceleration for smooth performance
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
        >
          {displayImages.map((item, index) => (
            <div 
              key={index}
              className="h-full flex-shrink-0 relative"
              style={{ width: `${100 / displayImages.length}%` }}
            >
              {item.image.url.includes('placeholder') ? (
                // Enhanced placeholder with smooth colors
                <div className={cn(
                  "w-full h-full flex items-center justify-center transition-colors duration-500",
                  index === 0 ? "bg-copper-bourbon" : 
                  index === 1 ? "bg-antique-brass" : 
                  index === 2 ? "bg-charcoal-gold" : "bg-smoky-gray"
                )}>
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2 animate-pulse">
                      {['🔨', '⚒️', '🪚', '✨'][index] || '🛠️'}
                    </div>
                    <div className="text-xl font-bold">
                      {['Design', 'Craft', 'Refine', 'Perfect'][index] || 'Workshop'}
                    </div>
                  </div>
                </div>
              ) : (
                // Professional image with overlay
                <div className="relative w-full h-full">
                  <img
                    src={item.image.url}
                    alt={item.image.alt}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out"
                    style={{ 
                      display: 'block',
                      // Hardware acceleration
                      transform: 'translate3d(0,0,0)',
                      backfaceVisibility: 'hidden'
                    }}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                  {/* Subtle overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-white/5 pointer-events-none" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* DOTS SECTION REMOVED - WAS HERE */}

      {/* Professional Process Label */}
      <div className="absolute top-4 left-4">
        <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg border border-white/10 transition-all duration-300 hover:bg-black/80">
          <span className="text-sm font-medium transition-all duration-300">
            {['Design', 'Craft', 'Refine', 'Perfect'][activeIndex] || 'Workshop'}
          </span>
        </div>
      </div>

      {/* Enhanced Mobile Touch Areas */}
      <div className="absolute inset-0 flex md:hidden pointer-events-none">
        <button
          className="flex-1 pointer-events-auto active:bg-white/5 transition-colors duration-150"
          onClick={handlePrevious}
          disabled={isTransitioning}
          aria-label="Previous"
        />
        <button
          className="flex-1 pointer-events-auto active:bg-white/5 transition-colors duration-150"
          onClick={handleNext}
          disabled={isTransitioning}
          aria-label="Next"
        />
      </div>

      {/* Professional Desktop Arrows */}
      <button
        onClick={handlePrevious}
        disabled={isTransitioning}
        className={cn(
          "hidden md:block absolute left-4 top-1/2 transform -translate-y-1/2",
          "bg-black/50 hover:bg-black/70 text-white p-3 rounded-full",
          "transition-all duration-300 hover:scale-110 hover:shadow-lg border border-white/10",
          "focus:outline-none focus:ring-2 focus:ring-white/30",
          isTransitioning && "pointer-events-none opacity-50"
        )}
        aria-label="Previous"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={handleNext}
        disabled={isTransitioning}
        className={cn(
          "hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2",
          "bg-black/50 hover:bg-black/70 text-white p-3 rounded-full",
          "transition-all duration-300 hover:scale-110 hover:shadow-lg border border-white/10",
          "focus:outline-none focus:ring-2 focus:ring-white/30",
          isTransitioning && "pointer-events-none opacity-50"
        )}
        aria-label="Next"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}