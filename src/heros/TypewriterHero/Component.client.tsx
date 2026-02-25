// src/heros/TypewriterHero/Component.client.tsx
'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { useTheme } from '@/providers/Theme'
import { cn } from '@/utilities/cn'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'

type TypewriterHeroProps = {
  headline: string
  phrases: string[]
  backgroundImage: {
    url: string
    alt: string
  }
  overlayStrength: 'light' | 'medium' | 'strong'
  typingSpeed: number
  pauseTime: number
}

const TypewriterEffect: React.FC<{
  phrases: string[]
  typingSpeed: number
  pauseTime: number
}> = ({ phrases, typingSpeed, pauseTime }) => {
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  const [currentTypingSpeed, setCurrentTypingSpeed] = useState(typingSpeed)
  const [isMounted, setIsMounted] = useState(false)
  
  const memoizedPhrases = useMemo(() => {
    return Array.isArray(phrases) && phrases.length > 0 ? phrases : ['get in touch.']
  }, [phrases])

  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  useEffect(() => {
    if (!isMounted || memoizedPhrases.length === 0) return

    const handleTyping = () => {
      const i = loopNum % memoizedPhrases.length
      const fullText = memoizedPhrases[i] || ''

      if (isDeleting) {
        setText(fullText.substring(0, Math.max(0, text.length - 1)))
        setCurrentTypingSpeed(50)
      } else {
        setText(fullText.substring(0, text.length + 1))
        setCurrentTypingSpeed(typingSpeed)
      }

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), pauseTime)
      } else if (isDeleting && text === '') {
        setIsDeleting(false)
        setLoopNum(loopNum + 1)
        setCurrentTypingSpeed(typingSpeed)
      }
    }

    const timer = setTimeout(handleTyping, currentTypingSpeed)
    return () => clearTimeout(timer)
  }, [text, isDeleting, loopNum, currentTypingSpeed, typingSpeed, pauseTime, memoizedPhrases, isMounted])

  if (!isMounted) {
    return (
      <span className="relative">
        <span className="text-coral dark:text-brand-blue">
          get in touch.
        </span>
        <span 
          className={cn(
            "inline-block w-0.5 h-[1em] bg-coral dark:bg-brand-blue ml-1",
            "relative top-[0.1em]"
          )}
        />
      </span>
    )
  }

  return (
    <span className="relative">
      <span className="text-coral dark:text-brand-blue">
        {text}
      </span>
      <span 
        className={cn(
          "inline-block w-0.5 h-[1em] bg-coral dark:bg-brand-blue ml-1 animate-pulse",
          "relative top-[0.1em]"
        )}
      />
    </span>
  )
}

export const TypewriterHeroClient: React.FC<TypewriterHeroProps> = ({
  headline = 'Go ahead, ',
  phrases = ['get in touch.'],
  backgroundImage,
  overlayStrength = 'medium',
  typingSpeed = 150,
  pauseTime = 3000,
}) => {
  const { theme } = useTheme()
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
    
    return () => {
      setHeaderTheme(undefined)
    }
  }, [setHeaderTheme])

  const overlayClasses = {
    light: 'bg-gradient-to-b from-dark-navy/40 via-dark-navy/60 to-dark-navy/40',
    medium: 'bg-gradient-to-b from-dark-navy/50 via-dark-navy/70 to-dark-navy/50',
    strong: 'bg-gradient-to-b from-dark-navy/60 via-dark-navy/80 to-dark-navy/60',
  }

  return (
    <section className="relative -mt-[10.4rem] min-h-[40vh] lg:min-h-[45vh] overflow-hidden">
      
      <div className="absolute inset-0">
        <Image 
          src={backgroundImage.url}
          alt={backgroundImage.alt}
          fill
          className="object-cover object-center"
          style={{
            filter: theme === 'dark' 
              ? 'brightness(40%) contrast(1.1)' 
              : 'brightness(45%) contrast(1.2)',
          }}
          priority
        />
      </div>
      
      <div className={cn('absolute inset-0', overlayClasses[overlayStrength])} />
      
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D84D2B' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3Ccircle cx='0' cy='30' r='1'/%3E%3Ccircle cx='60' cy='30' r='1'/%3E%3Ccircle cx='30' cy='0' r='1'/%3E%3Ccircle cx='30' cy='60' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />
      
      <div className="relative z-10 flex items-end justify-center h-full pt-40 pb-8 lg:pt-44 lg:pb-12">
        <div className="text-center max-w-4xl mx-auto px-4">
          <h1 className={cn(
            "text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold",
            "text-clinical-white dark:text-clinical-white",
            "font-heading tracking-wide",
            "drop-shadow-2xl"
          )}>
            {headline}
            <TypewriterEffect 
              phrases={phrases}
              typingSpeed={typingSpeed}
              pauseTime={pauseTime}
            />
          </h1>
        </div>
      </div>
      
      <div 
        className={cn(
          "absolute top-0 left-0 w-full h-[10vh] z-20 transition-colors duration-300",
          theme === 'dark' ? 'bg-navy' : 'bg-clinical-white'
        )}
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 0)',
        }}
      />
    </section>
  )
}