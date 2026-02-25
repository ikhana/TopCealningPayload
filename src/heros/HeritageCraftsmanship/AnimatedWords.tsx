// src/heros/HeritageCraftsmanship/AnimatedWords.tsx
'use client'
import { cn } from '@/utilities/cn'
import React, { useCallback, useEffect, useState } from 'react'
import styles from './AnimatedWords.module.scss'

type AnimatedWordsProps = {
  staticWord?: string | null | undefined
  words: {
    text: string
    colorStyle: string
  }[]
  activeIndex: number
  className?: string
}

export const AnimatedWords: React.FC<AnimatedWordsProps> = ({ 
  staticWord,
  words, 
  activeIndex, 
  className 
}) => {
  const [letterStates, setLetterStates] = useState<Record<number, boolean[]>>({})
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Initialize letter animation states ONLY ONCE
  useEffect(() => {
    const newStates: Record<number, boolean[]> = {}
    words.forEach((word, wordIndex) => {
      newStates[wordIndex] = new Array(word.text.length).fill(false)
    })
    setLetterStates(newStates)
  }, [words.length]) // Only depend on words.length, not words array

  // Animate letters when activeIndex changes - PREVENT INFINITE LOOPS
  useEffect(() => {
    if (activeIndex >= 0 && words[activeIndex] && words[activeIndex].text) {
      const word = words[activeIndex]
      
      // Reset all letters for the active word
      setLetterStates(prev => ({
        ...prev,
        [activeIndex]: new Array(word.text.length).fill(false)
      }))

      // For reduced motion, show all letters at once
      if (isReducedMotion) {
        const timeout = setTimeout(() => {
          setLetterStates(prev => ({
            ...prev,
            [activeIndex]: new Array(word.text.length).fill(true)
          }))
        }, 100)
        
        return () => clearTimeout(timeout)
      }

      // Animate letters one by one
      const timeouts: NodeJS.Timeout[] = []
      
      word.text.split('').forEach((_, letterIndex) => {
        const delay = letterIndex * 80 + Math.random() * 40
        
        const timeout = setTimeout(() => {
          setLetterStates(prev => {
            const newState = { ...prev }
            if (newState[activeIndex]) {
              newState[activeIndex] = newState[activeIndex].map((state, i) => 
                i === letterIndex ? true : state
              )
            }
            return newState
          })
        }, delay)
        
        timeouts.push(timeout)
      })

      return () => {
        timeouts.forEach(clearTimeout)
      }
    }
  }, [activeIndex, isReducedMotion]) // Remove words dependency to prevent loops

  // Get word styling configuration
  const getWordStyleConfig = useCallback((colorStyle: string) => {
    const configs = {
      word1: {
        colorClass: styles.colorKhaosRed,
        effect: 'liquid' as const,
        sizeClass: styles.sizeXLarge,
        fontClass: styles.fontSemibold
      },
      word2: {
        colorClass: styles.colorAmberResin,
        effect: 'typewriter' as const,
        sizeClass: styles.sizeLarge,
        fontClass: styles.fontMedium
      },
      word3: {
        colorClass: styles.colorWeatheredOak,
        effect: 'shatter' as const,
        sizeClass: styles.sizeXLarge,
        fontClass: styles.fontSemibold
      }
    }
    
    return configs[colorStyle as keyof typeof configs] || configs.word1
  }, [])

  // Get letter CSS class based on effect and state
  const getLetterClass = useCallback((effect: string, isWordActive: boolean, isLetterActive: boolean) => {
    const baseClasses = [styles.letter]
    
    if (isReducedMotion) {
      baseClasses.push(styles.simpleLetter)
    } else {
      switch (effect) {
        case 'liquid':
          baseClasses.push(styles.liquidLetter)
          break
        case 'typewriter':
          baseClasses.push(styles.typewriterLetter)
          break
        case 'shatter':
          baseClasses.push(styles.shatterLetter)
          break
        default:
          baseClasses.push(styles.simpleLetter)
      }
    }

    // State classes
    if (!isWordActive) {
      baseClasses.push(styles.hidden)
    } else if (isLetterActive) {
      baseClasses.push(styles.active)
    } else {
      baseClasses.push(styles.inactive)
    }

    return cn(...baseClasses)
  }, [isReducedMotion])

  return (
    <div className={cn(className)}>
      
      {/* Static Word */}
      {staticWord && (
        <div className="mb-2 sm:mb-3 md:mb-4">
          <h1 className={styles.staticWord}>
            {staticWord}
          </h1>
        </div>
      )}

      {/* Animated words container - FIXED HEIGHT AND POSITIONING */}
      <div className={cn(
        styles.animatedWordsContainer, 
        "h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 relative min-w-0"
      )}>
        {words.map((word, wordIndex) => {
          const config = getWordStyleConfig(word.colorStyle)
          const isActive = wordIndex === activeIndex
          
          return (
            <div
              key={wordIndex}
              className={cn(
                styles.wordContainer,
                config.colorClass,
                config.fontClass,
                config.sizeClass,
                "justify-center lg:justify-start"
              )}
              style={{
                // CRITICAL: Use inline styles for guaranteed visibility control
                opacity: isActive ? 1 : 0,
                visibility: isActive ? 'visible' : 'hidden',
                transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                zIndex: isActive ? 2 : 1
              }}
            >
              <div className="relative flex flex-wrap justify-center lg:justify-start">
                {word.text.split('').map((letter, letterIndex) => {
                  const letterActive = letterStates[wordIndex]?.[letterIndex] || false
                  
                  return (
                    <span
                      key={letterIndex}
                      className={getLetterClass(config.effect, isActive, letterActive)}
                      style={{
                        transitionDelay: isReducedMotion ? '0ms' : `${letterIndex * 30}ms`
                      }}
                    >
                      {letter === ' ' ? '\u00A0' : letter}
                    </span>
                  )
                })}
                
                {/* Word-level effects for mobile */}
                {isActive && !isReducedMotion && (
                  <>
                    {config.effect === 'liquid' && (
                      <div className={styles.liquidUnderline} />
                    )}
                    
                    {config.effect === 'typewriter' && (
                      <span className={cn(styles.typewriterCursor, config.colorClass)}>|</span>
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}