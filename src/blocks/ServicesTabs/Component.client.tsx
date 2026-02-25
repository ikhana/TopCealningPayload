// blocks/ServicesTabs/Component.client.tsx

'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { ServicesTabsBlock } from '@/payload-types'
import { BlockWrapper } from '@/components/BlockWrapper'
import { Card } from '@/components/ui/Card/Card'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/utilities/cn'

// Gradient borders component (reusable)
const GradientBorders = () => (
  <>
    <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
  </>
)

// Gradient separator between tabs
const GradientSeparator = () => (
  <div 
    className="h-12 w-px mx-2 sm:mx-3" 
    style={{
      background: 'linear-gradient(to bottom, var(--color-border-gradient-light), var(--color-border-gradient-mid), var(--color-border-gradient-dark))'
    }}
  />
)

// Horizontal divider lines between sections
const DividerLines = () => (
  <div className="w-full py-4 md:py-6">
    <svg
      viewBox="0 0 1440 55"
      className="w-full h-auto text-border-gradient-mid opacity-40 dark:opacity-30"
      preserveAspectRatio="none"
      aria-hidden="true"
      role="presentation"
    >
      {[2, 12, 22, 32, 42, 52].map((y) => (
        <line 
          key={y} 
          x1="0" 
          y1={y} 
          x2="1440" 
          y2={y} 
          stroke="currentColor" 
          strokeWidth="4" 
        />
      ))}
    </svg>
  </div>
)

export function ServicesTabsClient(props: ServicesTabsBlock) {
  const {
    sectionId,
    tabs,
  } = props
  
  const headerOffset = props.headerOffset ?? 80

  const [activeId, setActiveId] = useState(tabs?.[0]?.title || '')
  const tabsRef = useRef<HTMLDivElement | null>(null)
  const [tabsHeight, setTabsHeight] = useState(0)
  const isProgrammaticScroll = useRef(false)

  // Create section refs
  const sectionRefs = useMemo(() => {
    if (!tabs) return {}
    return tabs.reduce<Record<string, HTMLElement | null>>((acc, tab) => {
      acc[tab.title] = null
      return acc
    }, {})
  }, [tabs])

  // Update tabs height
  useEffect(() => {
    const update = () => setTabsHeight(tabsRef.current?.offsetHeight ?? 0)
    update()
    
    let ro: ResizeObserver | null = null
    if (typeof window !== 'undefined' && 'ResizeObserver' in window && tabsRef.current) {
      ro = new ResizeObserver(update)
      ro.observe(tabsRef.current)
    }
    
    window.addEventListener('resize', update)
    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  // Get section elements
  useEffect(() => {
    if (!tabs) return
    tabs.forEach((tab) => {
      const id = tab.title.toLowerCase().replace(/\s+/g, '-')
      sectionRefs[tab.title] = document.getElementById(id)
    })
  }, [tabs, sectionRefs])

  // ScrollSpy effect
  useEffect(() => {
    if (!tabs) return
    
    const spyOffset = headerOffset + tabsHeight
    let ticking = false

    const getSentinelPositions = () =>
      Array.from(document.querySelectorAll<HTMLSpanElement>('[data-next]'))
        .map((el) => ({ 
          title: el.dataset.next!, 
          top: el.getBoundingClientRect().top + window.scrollY 
        }))
        .sort((a, b) => a.top - b.top)

    const onScroll = () => {
      if (isProgrammaticScroll.current || ticking) return
      ticking = true
      
      requestAnimationFrame(() => {
        ticking = false
        const positions = getSentinelPositions()
        const y = window.scrollY + spyOffset
        let current = tabs[0]?.title ?? ''
        
        for (let i = 0; i < positions.length; i++) {
          if (positions[i].top <= y) current = positions[i].title
          else break
        }
        
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
          current = tabs[tabs.length - 1]?.title ?? current
        }
        
        if (current && current !== activeId) setActiveId(current)
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [tabs, headerOffset, tabsHeight, activeId])

  // Scroll to section
  const scrollToSection = (title: string) => {
    const el = sectionRefs[title]
    if (!el) return
    
    setActiveId(title)
    const offset = headerOffset + tabsHeight
    const targetY = Math.max(el.offsetTop - offset + 4, 0)
    
    isProgrammaticScroll.current = true
    window.scrollTo({ top: targetY, behavior: 'smooth' })
    
    const travel = Math.abs(window.scrollY - targetY)
    const duration = Math.min(1200, Math.max(400, travel * 0.6))
    
    window.setTimeout(() => {
      isProgrammaticScroll.current = false
      window.dispatchEvent(new Event('scroll'))
    }, duration + 20)
  }

  if (!tabs || tabs.length === 0) return null

  return (
    <BlockWrapper sectionId={sectionId}>
      <section className="w-full">
        {/* Sticky Tab Navigation */}
        <div
          ref={tabsRef}
          className="sticky z-40 bg-white/90 dark:bg-card/90 backdrop-blur border-b border-t border-border"
          style={{ top: headerOffset }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ul
              className="flex gap-0 overflow-x-auto no-scrollbar py-3 sm:py-4 scroll-px-3 sm:scroll-px-4"
              aria-label="Services tabs"
            >
              {tabs.map((tab, idx) => {
                const isActive = tab.title === activeId
                const number = String(idx + 1).padStart(2, '0')
                
                return (
                  <React.Fragment key={tab.title}>
                    <li className="shrink-0 relative">
                      {/* Tab Button with Gradient Borders */}
                      <button
                        type="button"
                        onClick={() => scrollToSection(tab.title)}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'relative group text-left px-4 py-3 transition-all duration-300',
                          isActive 
                            ? 'bg-primary/5 dark:bg-primary/10' 
                            : 'bg-transparent hover:bg-muted/50'
                        )}
                      >
                        {/* Gradient Borders on Tab Button */}
                        <GradientBorders />
                        
                        {/* Tab Number */}
                        <div className="text-[10px] sm:text-xs text-primary mb-0.5 sm:mb-1 relative z-10">
                          {number}
                        </div>
                        
                        {/* Tab Title */}
                        <div
                          className={cn(
                            'font-semibold text-sm sm:text-base whitespace-nowrap relative z-10 transition-colors',
                            isActive 
                              ? 'text-primary' 
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                        >
                          {tab.title}
                        </div>
                      </button>
                    </li>
                    
                    {/* Gradient Separator (except after last tab) */}
                    {idx < tabs.length - 1 && (
                      <li className="flex items-center">
                        <GradientSeparator />
                      </li>
                    )}
                  </React.Fragment>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Tab Content Sections */}
        <div className="bg-background dark:bg-card">
          {tabs.map((tab, tabIdx) => {
            const sectionId = tab.title.toLowerCase().replace(/\s+/g, '-')
            
            return (
              <React.Fragment key={tab.title}>
                <section
                  id={sectionId}
                  className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10"
                >
                {/* ScrollSpy Sentinel */}
                <span data-next={tab.title} className="absolute -mt-4" aria-hidden="true" />
                
                {/* Section Header */}
                <header className="mb-6 sm:mb-8 lg:mb-10">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground font-heading tracking-wide">
                    {tab.sectionHeading}
                  </h2>
                  {tab.sectionDescription && (
                    <p className="mt-3 sm:mt-4 max-w-3xl text-base sm:text-lg text-muted-foreground font-body leading-relaxed">
                      {tab.sectionDescription}
                    </p>
                  )}
                </header>

                {/* Service Cards Grid */}
                {tab.services && tab.services.length > 0 && (
                  <div className="grid gap-5 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {tab.services.map((service, idx) => (
                      <div key={idx} className="-ml-[1px] -mt-[1px]">
                        <Card 
                          variant="gradient" 
                          padding="md" 
                          className="h-full bg-card/50 dark:bg-card/80 backdrop-blur-sm"
                        >
                          <div className="flex flex-col h-full relative">
                            {/* Icon Box with Gradient Borders */}
                            {service.icon && (
                              <div className="absolute top-0 left-0 w-10 h-10 flex items-center justify-center bg-background dark:bg-card">
                                <GradientBorders />
                                <Icon 
                                  name={service.icon} 
                                  size={20} 
                                  className="text-primary relative z-10" 
                                />
                              </div>
                            )}
                            
                            {/* Service Title */}
                            <h3 className="text-sm md:text-base font-semibold text-primary font-heading leading-tight mt-12 mb-3">
                              {service.title}
                            </h3>
                            
                            {/* Service Description */}
                            <p className="text-xs md:text-sm text-foreground dark:text-white font-body leading-relaxed">
                              {service.description}
                            </p>
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </section>
              
              {/* Horizontal Divider Lines (except after last section) */}
              {tabIdx < tabs.length - 1 && (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <DividerLines />
                </div>
              )}
            </React.Fragment>
            )
          })}
        </div>
      </section>
    </BlockWrapper>
  )
}