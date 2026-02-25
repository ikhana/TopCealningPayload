// src/components/DNAInteractiveLabHeroClient.tsx
'use client'

import {
  DNAAssets,
  LabElements,
  MEDICAL_LAB_DUMMY_DATA,
  TestIcons,
} from '@/components/ui/MedicalLabAssets/MedicalLabAssets'
import { WorkshopButton } from '@/components/ui/WorkshopButton/WorkshopButton'
import { cn } from '@/utilities/cn'
import { ChevronRight, MapPin } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

type DNAInteractiveLabHeroProps = {
  heroTitle?: string
  heroSubtitle?: string
  backgroundImage?: {
    url: string
    alt: string
  } | null
  overlayStrength?: 'none' | 'light' | 'medium' | 'strong'
  enableDNAAnimation?: boolean
  enableParticleAnimation?: boolean
  testCategories?: Array<{
    id: string
    name: string
    description: string
    icon: 'genetic' | 'cancer' | 'employment'
    color: 'blue' | 'teal' | 'green' | 'coral'
    ctaLink?: string
  }>
  showLabStats?: boolean
  customStats?: Array<{
    label: string
    value: string
    icon?: string
  }>
  ctaText?: string
  ctaLink?: string
  secondaryCTAText?: string
  secondaryCTALink?: string
  animationSpeed?: number
  segmentTransitionSpeed?: number
  particleCount?: number
}

export const DNAInteractiveLabHeroClient: React.FC<DNAInteractiveLabHeroProps> = (props) => {
  const {
    heroTitle = 'Advanced Medical Testing',
    heroSubtitle = 'Precision diagnostics with cutting-edge technology and compassionate care',
    backgroundImage = null,
    overlayStrength = 'medium',
    enableDNAAnimation = true,
    enableParticleAnimation = true,
    testCategories = MEDICAL_LAB_DUMMY_DATA.testCategories,
    showLabStats = true,
    customStats,
    ctaText = 'View All Tests',
    ctaLink = '/available-tests',
    secondaryCTAText = 'Find Locations',
    secondaryCTALink = '/find-us',
    animationSpeed = 20,
    segmentTransitionSpeed = 4,
    particleCount = 12,
  } = props

  const [activeSegment, setActiveSegment] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [, setScrollY] = useState(0)

  const heroRef = useRef<HTMLElement>(null)
  const testCategoryCardRef = useRef<HTMLDivElement>(null)
  const rightColumnRef = useRef<HTMLDivElement>(null)

  const [vanPosition, setVanPosition] = useState({ x: 0, y: 0 })

  const safeTestCategories =
    testCategories?.length > 0 ? testCategories : MEDICAL_LAB_DUMMY_DATA.testCategories
  const currentTestCategory = safeTestCategories[activeSegment] || safeTestCategories[0]
  const displayStats =
    customStats && customStats.length > 0 ? customStats : MEDICAL_LAB_DUMMY_DATA.labStats

  const calculateVanPosition = useCallback(() => {
    if (!testCategoryCardRef.current || !rightColumnRef.current || !heroRef.current || !isMounted) return

    const heroRect = heroRef.current.getBoundingClientRect()
    const cardRect = testCategoryCardRef.current.getBoundingClientRect()
    const rightColumnRect = rightColumnRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight

    const heroTop = heroRect.top
    const heroHeight = heroRect.height
    const scrollProgress = Math.max(
      0,
      Math.min(1, (viewportHeight - heroTop) / (viewportHeight + heroHeight * 0.5)),
    )

    const baseX = cardRect.left - rightColumnRect.left
    const baseY = cardRect.top - rightColumnRect.top + cardRect.height / 2

    let horizontalMovement = 0
    let verticalOffset = 0

    if (isMobile) {
      const startPosition = -40
      const maxMovement = 120
      horizontalMovement = startPosition + scrollProgress * maxMovement
      verticalOffset = -100
    } else {
      const startPosition = -130
      const maxMovement = 200
      horizontalMovement = startPosition + scrollProgress * maxMovement
      verticalOffset = -210
    }

    setVanPosition({
      x: baseX + horizontalMovement,
      y: baseY + verticalOffset,
    })
  }, [isMounted, isMobile])

  useEffect(() => {
    setIsMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    const timer = setTimeout(() => {
      setIsLoaded(true)
      calculateVanPosition()
    }, 200)
    return () => clearTimeout(timer)
  }, [isMounted, calculateVanPosition])

  useEffect(() => {
    if (!(enableDNAAnimation && safeTestCategories.length > 0 && isMounted)) return
    const interval = setInterval(() => {
      setActiveSegment((current) => (current + 1) % safeTestCategories.length)
    }, segmentTransitionSpeed * 1000)
    return () => clearInterval(interval)
  }, [enableDNAAnimation, safeTestCategories.length, segmentTransitionSpeed, isMounted])

  useEffect(() => {
    if (!isMounted) return

    const handleScroll = () => {
      setScrollY(window.scrollY)
      calculateVanPosition()
    }

    let ticking = false
    const optimizedScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', optimizedScrollHandler, { passive: true })
    window.addEventListener('resize', calculateVanPosition)
    return () => {
      window.removeEventListener('scroll', optimizedScrollHandler)
      window.removeEventListener('resize', calculateVanPosition)
    }
  }, [isMounted, calculateVanPosition])

  // Hydration-safe: do NOT read theme in JS; use Tailwind dark: variants instead.
  const getOverlayClasses = () => {
    const map: Record<NonNullable<DNAInteractiveLabHeroProps['overlayStrength']>, string> = {
      none: '',
      light:
        'bg-gradient-to-br from-clinical-white/85 via-clinical-white/70 to-clinical-white/60 ' +
        'dark:from-navy/85 dark:via-navy/70 dark:to-navy/60',
      medium:
        'bg-gradient-to-br from-clinical-white/92 via-clinical-white/85 to-clinical-white/75 ' +
        'dark:from-navy/92 dark:via-navy/85 dark:to-navy/75',
      strong:
        'bg-gradient-to-br from-clinical-white/96 via-clinical-white/92 to-clinical-white/85 ' +
        'dark:from-navy/96 dark:via-navy/92 dark:to-navy/85',
    }
    return map[overlayStrength]
  }

  const handleSegmentClick = (index: number) => setActiveSegment(index)

  const getTestIcon = (iconType: string) => {
    switch (iconType) {
      case 'genetic':
        return TestIcons.Genetic
      case 'cancer':
        return TestIcons.Cancer
      case 'employment':
        return TestIcons.Employment
      default:
        return TestIcons.Genetic
    }
  }

  const getDNASegmentPosition = (index: number, total: number, radius: number) => {
    const angle = (360 / total) * index
    const x = Math.cos((angle * Math.PI) / 180) * radius
    const y = Math.sin((angle * Math.PI) / 180) * radius
    return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 }
  }

  // Skeleton for initial mount (also hydration-safe)
  if (!isMounted) {
    return (
      <section
        className={cn(
          'relative -mt-[64px] min-h-screen flex flex-col overflow-hidden transition-colors duration-300',
          'bg-clinical-white dark:bg-navy',
        )}
      >
        <div className="relative z-30 flex-1 min-h-screen">
          <div className="container mx-auto px-6 h-full flex items-center">
            <div className="w-full grid grid-cols-12 gap-6 items-center min-h-screen py-12">
              <div className="col-span-12 lg:col-span-6 order-2 lg:order-1">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-3 h-3 bg-coral" />
                    <span className="text-coral font-semibold tracking-wider uppercase text-sm font-body">
                      Medical Excellence
                    </span>
                    <div className="flex-1 h-px bg-coral/30"></div>
                  </div>
                  <h1 className="font-black font-heading leading-[0.9] tracking-tight brand-heading">
                    <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl">
                      <span className="text-dark-navy dark:text-clinical-white">WE'RE</span>{' '}
                      <span className="text-coral">NEW</span>
                    </span>
                    <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl text-coral">
                      BIRTH LABS.
                    </span>
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={heroRef}
      className={cn(
        'relative -mt-[64px] min-h-screen flex flex-col overflow-hidden transition-colors duration-300',
        'bg-clinical-white dark:bg-navy',
      )}
    >
      {/* Background */}
      {backgroundImage ? (
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImage.url}
            alt={backgroundImage.alt}
            className={cn(
              'w-full h-full object-cover filter contrast-110 brightness-90',
              'dark:brightness-60 dark:contrast-125',
            )}
          />
          <div className={cn('absolute inset-0', getOverlayClasses())} />
        </div>
      ) : (
        <LabElements.LabGridPattern
          className={cn('pointer-events-none opacity-[0.03]', 'text-dark-navy dark:text-clinical-white')}
        />
      )}

      {/* DNA orbit */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
          <div className="relative w-[200px] h-[200px] lg:w-[250px] lg:h-[250px] flex items-center justify-center">
            <div
              className={cn('relative w-full h-full transition-all duration-700', enableDNAAnimation && 'animate-spin-slow')}
              style={{
                animationDuration: enableDNAAnimation ? `${animationSpeed}s` : 'none',
                animationIterationCount: 'infinite',
                animationTimingFunction: 'linear',
              }}
            >
              {safeTestCategories.map((category, index) => {
                const radius = isMobile ? 80 : 100
                const { x, y } = getDNASegmentPosition(index, safeTestCategories.length, radius)
                const isActive = index === activeSegment
                return (
                  <button
                    key={category.id}
                    className={cn(
                      'absolute w-8 h-8 lg:w-10 lg:h-10 transition-all duration-500 hover:scale-110 group cursor-pointer pointer-events-auto',
                      'bg-gradient-to-br shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-coral/40 rounded-lg',
                      isActive ? 'from-coral to-brand-blue scale-125 shadow-coral/30' : 'from-blue-gray/60 to-dark-navy/60 hover:from-coral hover:to-orange',
                      'border border-coral/30',
                    )}
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    }}
                    onClick={() => handleSegmentClick(index)}
                    aria-label={`Select ${category.name} testing category`}
                  >
                    <div className="w-full h-full flex items-center justify-center relative">
                      <DNAAssets.HelixSegment
                        className={cn(
                          'w-4 h-4 lg:w-5 lg:h-5 transition-colors duration-300',
                          isActive ? 'text-clinical-white' : 'text-clinical-white/60 group-hover:text-clinical-white',
                        )}
                        active={isActive}
                      />
                    </div>

                    <div
                      className={cn(
                        'absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-medium whitespace-nowrap transition-opacity duration-300 pointer-events-none z-10 rounded',
                        'bg-dark-navy/90 text-clinical-white shadow-lg border border-coral/30 backdrop-blur-sm',
                        'opacity-0 group-hover:opacity-100',
                      )}
                    >
                      {category.name}
                    </div>
                  </button>
                )
              })}

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-coral/40 via-orange/40 to-brand-blue/30 rounded-lg shadow-lg flex items-center justify-center border-2 border-clinical-white/20">
                  <DNAAssets.MolecularHex className="w-6 h-6 lg:w-7 lg:h-7 text-clinical-white/70" variant="gradient" size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Foreground */}
      <div className="relative z-30 flex-1 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 h-full flex items-center">
          <div className="w-full grid grid-cols-12 gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-14 2xl:gap-16 items-center min-h-screen py-8 sm:py-12 md:py-16 lg:py-20 xl:py-20">
            {/* Left column */}
            <div className="col-span-12 lg:col-span-6 order-2 lg:order-1">
              <div
                className={cn(
                  'space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 transition-all duration-1000',
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
                )}
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-coral rounded-sm animate-gentle-pulse" />
                  <span className="text-coral font-semibold tracking-wider uppercase text-xs sm:text-sm font-body">
                    Medical Excellence
                  </span>
                  <div className="flex-1 h-px bg-coral/30"></div>
                </div>

                <h1 className="font-black font-heading leading-[0.9] tracking-tight brand-heading medical-hero-text">
                  <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                    <span className="text-dark-navy dark:text-clinical-white">WE'RE</span>{' '}
                    <span className="text-coral">NEW</span>
                  </span>
                  <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-coral">BIRTH LABS.</span>
                </h1>

                <div className="max-w-xl space-y-3 sm:space-y-4">
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-body font-light leading-relaxed text-navy dark:text-clinical-white/90">
                    Arizona&apos;s premier mobile medical lab service.
                  </p>

                  <p className="text-sm sm:text-base lg:text-lg font-body leading-relaxed text-navy/80 dark:text-clinical-white/80">
                    {heroSubtitle}
                  </p>
                </div>

                <div className="pt-2 sm:pt-4">
                  <WorkshopButton
                    as="link"
                    href={secondaryCTALink}
                    variant="primary"
                    size={isMobile ? 'md' : 'lg'}
                    className="group btn-primary w-full sm:w-auto"
                  >
                    <span className="flex items-center justify-center gap-2 sm:gap-3">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">FIND LAB NEAR YOU</span>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </WorkshopButton>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div ref={rightColumnRef} className="col-span-12 lg:col-span-6 order-1 lg:order-2 relative">
              {/* Van (animated) */}
              <div
                className={cn(
                  'absolute z-20 pointer-events-none transition-all duration-300 ease-out',
                  isLoaded ? 'opacity-100' : 'opacity-0',
                )}
                style={{
                  transform: `translateX(${vanPosition.x}px) translateY(${vanPosition.y}px)`,
                  left: 0,
                  top: 0,
                }}
              >
                <img
                  src="/images/avf/Delivery-Van_No-Background_Mockup.avif"
                  alt="New Birth Labs Mobile Van"
                  className="block drop-shadow-lg"
                  style={{ width: isMobile ? '140px' : '350px', height: 'auto' }}
                  loading="eager"
                />
              </div>

              {/* Invisible placeholder to reserve space for van */}
              <div
                className={cn(
                  'mb-6 sm:mb-8 transition-all duration-1000 ease-out',
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
                )}
              >
                <div className="w-full mx-auto lg:ml-auto lg:mr-0 invisible max-w-[140px] sm:max-w-[200px] lg:max-w-sm">
                  <img src="/images/avf/Delivery-Van_No-Background_Mockup.avif" alt="" className="w-full h-auto object-contain" />
                </div>
              </div>

              {/* Category card */}
              {currentTestCategory && (
                <div
                  ref={testCategoryCardRef}
                  className={cn(
                    'p-3 sm:p-4 lg:p-6 transition-all duration-500 rounded-lg sm:rounded-xl shadow-md backdrop-blur-sm mb-4 sm:mb-6',
                    'bg-clinical-white/95 dark:bg-navy/95',
                    'border border-coral/20 hover:border-coral/40',
                    'hover:shadow-lg transform hover:-translate-y-1',
                  )}
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    {React.createElement(getTestIcon(currentTestCategory.icon), {
                      className: 'w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-coral',
                    })}
                    <h3 className="text-base sm:text-lg font-semibold font-heading text-dark-navy dark:text-clinical-white">
                      {currentTestCategory.name}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm font-body leading-relaxed text-navy dark:text-clinical-white/80">
                    {currentTestCategory.description}
                  </p>
                </div>
              )}

              {/* Stats */}
              {showLabStats && displayStats && (
                <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                  {displayStats.slice(0, 3).map((stat, index) => (
                    <div
                      key={stat.label}
                      className={cn(
                        'text-center p-2 sm:p-3 lg:p-4 transition-all duration-500 rounded-md sm:rounded-lg',
                        'bg-coral/5 hover:bg-coral/10',
                        'border border-coral/20 hover:border-coral/30',
                        'hover:transform hover:-translate-y-1',
                      )}
                      style={{
                        animationDelay: `${index * 150}ms`,
                        transform: isLoaded ? 'translateY(0)' : 'translateY(10px)',
                        opacity: isLoaded ? 1 : 0,
                        transition: 'all 0.6s ease-out',
                      }}
                    >
                      <div className="text-sm sm:text-base lg:text-lg font-bold font-heading text-coral mb-1">{stat.value}</div>
                      <div className="text-xs sm:text-xs lg:text-sm font-body leading-tight text-navy dark:text-clinical-white/80">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow ${animationSpeed}s linear infinite;
        }
        .medical-hero-text {
          filter: drop-shadow(0 4px 12px hsl(var(--color-coral) / 0.15));
          text-shadow: 0 2px 4px hsl(var(--color-dark-navy) / 0.1);
        }
        @media (max-width: 640px) {
          .medical-hero-text span {
            font-size: clamp(1.4rem, 7vw, 2.5rem) !important;
          }
        }
        @media (min-width: 641px) and (max-width: 1023px) {
          .medical-hero-text span {
            font-size: clamp(2rem, 6vw, 3.5rem) !important;
          }
        }
        @media (min-width: 1024px) and (max-width: 1280px) {
          .medical-hero-text span {
            font-size: clamp(3rem, 5vw, 4rem) !important;
          }
        }
        @media (min-width: 1536px) {
          .medical-hero-text span {
            font-size: clamp(4rem, 6vw, 5rem) !important;
          }
        }
      `}</style>
    </section>
  )
}
