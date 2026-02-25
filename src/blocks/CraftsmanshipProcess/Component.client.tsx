// src/blocks/CraftsmanshipProcess/Component.client.tsx
'use client'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/cn'
import { Activity, CheckCircle, Clock } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import type { ProcessedCraftsmanshipData } from './Component'

interface CraftsmanshipProcessClientProps {
  data: ProcessedCraftsmanshipData
}

export const CraftsmanshipProcessClient: React.FC<CraftsmanshipProcessClientProps> = ({
  data,
}) => {
  const [activeStep, setActiveStep] = useState<string>(data.processSteps[0]?.id || '')
  const [isVisible, setIsVisible] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Intersection observer for animations
  useEffect(() => {
    if (!sectionRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(sectionRef.current)

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)
    }
  }, [])

  // Auto-advance through steps
  useEffect(() => {
    if (!isVisible || isPaused || data.processSteps.length <= 1) return

    const interval = setInterval(() => {
      setActiveStep(current => {
        const currentIndex = data.processSteps.findIndex(step => step.id === current)
        const nextIndex = (currentIndex + 1) % data.processSteps.length
        return data.processSteps[nextIndex].id
      })
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [isVisible, isPaused, data.processSteps])

  const { processSteps, showStepNumbers } = data
  const currentStep = processSteps.find(step => step.id === activeStep) || processSteps[0]

  if (processSteps.length === 0) return null

  return (
    <div ref={sectionRef} className="relative max-w-7xl mx-auto">
      
      {/* Medical Process Navigation - Clean Professional */}
      <div className={cn(
        'mb-12 lg:mb-16 transition-all duration-1000 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}>
        
        {/* Mobile: Horizontal Scroll */}
        <div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-3 min-w-max">
            {processSteps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => {
                  setActiveStep(step.id)
                  setIsPaused(true)
                  // Resume auto-advance after 8 seconds
                  setTimeout(() => setIsPaused(false), 8000)
                }}
                className={cn(
                  'group relative px-4 py-3 transition-all duration-500 flex-shrink-0',
                  'border-2 font-body font-bold text-sm',
                  'hover:scale-105',
                  // Active state - Medical theme
                  activeStep === step.id ? [
                    'bg-coral text-clinical-white border-coral',
                    'shadow-md shadow-coral/20'
                  ] : [
                    'bg-clinical-white dark:bg-navy/80',
                    'border-blue-gray/30 dark:border-blue-gray/40',
                    'text-coral dark:text-coral',
                    'hover:bg-coral/5 dark:hover:bg-coral/10',
                    'hover:border-coral/50 dark:hover:border-coral/60'
                  ]
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={cn(
                  'flex items-center',
                  showStepNumbers ? 'gap-2' : 'gap-1'
                )}>
                  {/* Step Number */}
                  {showStepNumbers && (
                    <div className={cn(
                      'w-6 h-6 flex items-center justify-center text-xs font-bold',
                      activeStep === step.id ? [
                        'bg-clinical-white/20 text-clinical-white'
                      ] : [
                        'bg-coral/10 text-coral'
                      ]
                    )}>
                      {step.stepNumber}
                    </div>
                  )}
                  
                  {/* Step Title - Shorter on mobile */}
                  <span className="tracking-wide whitespace-nowrap">
                    {step.stepTitle}
                  </span>
                  
                  {/* Priority Badge */}
                  {step.highlightStep && (
                    <CheckCircle className={cn(
                      'w-3 h-3',
                      activeStep === step.id ? 
                        'text-clinical-white' : 
                        'text-coral'
                    )} />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: Centered Flex */}
        <div className="hidden lg:flex flex-wrap justify-center gap-3">
          {processSteps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => {
                setActiveStep(step.id)
                setIsPaused(true)
                // Resume auto-advance after 8 seconds
                setTimeout(() => setIsPaused(false), 8000)
              }}
              className={cn(
                'group relative px-6 py-4 lg:px-8 lg:py-5 transition-all duration-500',
                'border-2 font-body font-bold text-sm lg:text-base',
                'hover:scale-105 hover:-translate-y-1',
                // Active state - Medical theme
                activeStep === step.id ? [
                  'bg-coral text-clinical-white border-coral',
                  'shadow-lg shadow-coral/20'
                ] : [
                  'bg-clinical-white dark:bg-navy/80',
                  'border-blue-gray/30 dark:border-blue-gray/40',
                  'text-coral dark:text-coral',
                  'hover:bg-coral/5 dark:hover:bg-coral/10',
                  'hover:border-coral/50 dark:hover:border-coral/60'
                ]
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={cn(
                'flex items-center',
                showStepNumbers ? 'gap-3' : 'gap-2'
              )}>
                {/* Step Number */}
                {showStepNumbers && (
                  <div className={cn(
                    'w-8 h-8 flex items-center justify-center text-sm font-bold',
                    activeStep === step.id ? [
                      'bg-clinical-white/20 text-clinical-white'
                    ] : [
                      'bg-coral/10 text-coral'
                    ]
                  )}>
                    {step.stepNumber}
                  </div>
                )}
                
                {/* Step Title */}
                <span className="tracking-wide">
                  {step.stepTitle}
                </span>
                
                {/* Priority Badge */}
                {step.highlightStep && (
                  <CheckCircle className={cn(
                    'w-4 h-4',
                    activeStep === step.id ? 
                      'text-clinical-white' : 
                      'text-coral'
                  )} />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Medical Content Display - Clean Professional */}
      <div className={cn(
        'relative overflow-hidden transition-all duration-700',
        'bg-clinical-white dark:bg-navy/90',
        'border-2 border-blue-gray/20 dark:border-blue-gray/30',
        'shadow-lg shadow-navy/5 dark:shadow-dark-navy/20',
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      )}>
        
        {/* Clean corner accents - minimal */}
        <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-coral/40 opacity-60" />
        <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-brand-blue/40 opacity-60" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-brand-blue/40 opacity-60" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-coral/40 opacity-60" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          
          {/* Medical Process Image Section */}
          <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
            {currentStep.stepImage && (
              <Media
                resource={currentStep.stepImage}
                className="w-full h-full"
                imgClassName={cn(
                  'w-full h-full object-cover object-center transition-all duration-700 ease-out'
                )}
              />
            )}
            
            {/* Professional Medical Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-dark-navy/15 via-transparent to-transparent lg:via-dark-navy/10 lg:to-dark-navy/40" />
            
            {/* Medical Step Number Badge */}
            {showStepNumbers && (
              <div className={cn(
                'absolute top-6 left-6 w-14 h-14 flex items-center justify-center',
                'font-bold text-2xl font-body transition-all duration-500',
                'bg-coral text-clinical-white',
                'shadow-lg shadow-coral/30',
                'border-2 border-clinical-white'
              )}>
                {currentStep.stepNumber}
              </div>
            )}

            {/* Priority indicator for special steps */}
            {currentStep.highlightStep && (
              <div className="absolute top-6 right-6 p-3 bg-brand-blue text-clinical-white shadow-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
            )}
          </div>

          {/* Medical Content Section */}
          <div className="p-6 lg:p-12 xl:p-16 flex flex-col justify-center">
            
            {/* Medical Process Title */}
            <h3 className={cn(
              'text-2xl lg:text-3xl xl:text-4xl font-bold font-heading mb-4 lg:mb-6',
              'text-dark-navy dark:text-clinical-white',
              'leading-tight tracking-wide'
            )}>
              {currentStep.stepTitle}
            </h3>

            {/* Medical Accent Line */}
            <div className="w-16 lg:w-20 h-1 bg-gradient-to-r from-coral to-coral/50 mb-4 lg:mb-6" />

            {/* Medical Description */}
            <p className={cn(
              'text-base lg:text-lg xl:text-xl font-body leading-relaxed mb-6 lg:mb-8',
              'text-blue-gray dark:text-clinical-white/80',
              'max-w-2xl'
            )}>
              {currentStep.stepDescription}
            </p>

            {/* Professional Medical Details */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              {currentStep.duration && (
                <div className={cn(
                  'flex items-center gap-2 lg:gap-3 px-4 lg:px-5 py-2 lg:py-3 transition-all duration-300',
                  'bg-coral/10 dark:bg-coral/15',
                  'text-coral dark:text-coral',
                  'border-2 border-coral/20 dark:border-coral/30'
                )}>
                  <Clock className="w-4 lg:w-5 h-4 lg:h-5" />
                  <span className="font-body font-semibold text-sm lg:text-base">{currentStep.duration}</span>
                </div>
              )}
              
              {currentStep.tools && (
                <div className={cn(
                  'flex items-center gap-2 lg:gap-3 px-4 lg:px-5 py-2 lg:py-3 transition-all duration-300',
                  'bg-brand-blue/10 dark:bg-brand-blue/15',
                  'text-brand-blue dark:text-brand-blue',
                  'border-2 border-brand-blue/20 dark:border-brand-blue/30'
                )}>
                  <Activity className="w-4 lg:w-5 h-4 lg:h-5" />
                  <span className="font-body font-semibold text-sm lg:text-base">{currentStep.tools}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}