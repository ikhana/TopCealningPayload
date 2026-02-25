'use client'

import { cn } from '@/utilities/cn'
import React, { useEffect, useState } from 'react'

interface ReadingProgressProps {
  className?: string
  position?: 'top' | 'bottom'
  height?: 'thin' | 'medium' | 'thick'
  showPercentage?: boolean
  target?: string
}

export const ReadingProgress: React.FC<ReadingProgressProps> = ({
  className,
  position = 'top',
  height = 'thin',
  showPercentage = false,
  target = 'article',
}) => {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const calculateProgress = () => {
      const element = document.querySelector(target) as HTMLElement
      if (!element) return

      const elementTop = element.offsetTop
      const elementHeight = element.offsetHeight
      const windowHeight = window.innerHeight
      const scrollTop = window.scrollY

      const startReading = elementTop - windowHeight / 3
      const finishReading = elementTop + elementHeight - windowHeight / 3

      const totalReadingDistance = finishReading - startReading
      const currentProgress = scrollTop - startReading

      if (currentProgress <= 0) {
        setProgress(0)
        setIsVisible(false)
      } else if (currentProgress >= totalReadingDistance) {
        setProgress(100)
        setIsVisible(true)
      } else {
        const progressPercentage = (currentProgress / totalReadingDistance) * 100
        setProgress(Math.max(0, Math.min(100, progressPercentage)))
        setIsVisible(true)
      }
    }

    calculateProgress()

    let timeoutId: NodeJS.Timeout
    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(calculateProgress, 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', calculateProgress, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', calculateProgress)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [target])

  const getHeightClasses = () => {
    switch (height) {
      case 'thin':
        return 'h-1'
      case 'medium':
        return 'h-2'
      case 'thick':
        return 'h-3'
      default:
        return 'h-1'
    }
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'fixed top-0 left-0 right-0 z-50'
      case 'bottom':
        return 'fixed bottom-0 left-0 right-0 z-50'
      default:
        return 'fixed top-0 left-0 right-0 z-50'
    }
  }

  return (
    <div
      className={cn(
        getPositionClasses(),
        'transition-all duration-300',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full',
        className
      )}
    >
      <div className={cn(
        'w-full transition-colors duration-300',
        getHeightClasses(),
        'bg-muted/20 backdrop-blur-sm'
      )}>
        <div
          className={cn(
            'h-full transition-all duration-300 ease-out',
            'bg-primary',
            'shadow-sm shadow-primary/30'
          )}
          style={{
            width: `${progress}%`,
            transition: 'width 0.3s ease-out',
          }}
        >
          <div className={cn(
            'h-full w-full',
            'bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent',
            'animate-pulse'
          )} />
        </div>

        {showPercentage && isVisible && (
          <div className={cn(
            'absolute right-4 top-1/2 transform -translate-y-1/2',
            'px-2 py-1 text-xs font-semibold',
            'bg-primary text-primary-foreground',
            'shadow-lg backdrop-blur-sm'
          )}>
            {Math.round(progress)}%
          </div>
        )}
      </div>

      {isVisible && (
        <>
          <div className={cn(
            'absolute left-0 top-0 w-8 transition-all duration-500',
            getHeightClasses(),
            'bg-gradient-to-r from-primary/60 to-transparent'
          )} />
          
          <div className={cn(
            'absolute right-0 top-0 w-8 transition-all duration-500',
            getHeightClasses(),
            'bg-gradient-to-l from-primary/60 to-transparent'
          )} />
        </>
      )}
    </div>
  )
}

interface ReadingTimeProps {
  content: string
  className?: string
  wordsPerMinute?: number
}

export const ReadingTime: React.FC<ReadingTimeProps> = ({
  content,
  className,
  wordsPerMinute = 200,
}) => {
  const wordCount = content.trim().split(/\s+/).length
  const readingTime = Math.ceil(wordCount / wordsPerMinute)

  return (
    <span className={cn('text-sm text-muted-foreground', className)}>
      {readingTime} min read
    </span>
  )
}