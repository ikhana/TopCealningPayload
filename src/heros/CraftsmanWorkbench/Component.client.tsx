// src/heros/CraftsmanWorkbench/Component.client.tsx
'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { cn } from '@/utilities/cn'
import { ArrowRight, FileText, Hammer, Palette, Play, Zap } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type CraftsmanWorkbenchHeroProps = {
  workbenchHeadline?: string | null
  workbenchSubheadline?: string | null
  workbenchAreas: {
    areaName: string
    title: string
    description: string
    areaType: 'tools' | 'materials' | 'blueprints' | 'finishes'
    position: { x: number; y: number }
    id: string
  }[]
  workbenchBadgeText?: string
  workbenchPrimaryButton: {
    label: string
    link: string
  }
  workbenchSecondaryButton: {
    label: string
    link: string
  }
  workbenchBackgroundImage?: {
    url: string
    alt: string
  }
  sectionBackgroundImage?: {
    url: string
    alt: string
  }
  enableWoodEffects?: boolean
}

export const CraftsmanWorkbenchHeroClient: React.FC<CraftsmanWorkbenchHeroProps> = (props) => {
  const {
    workbenchHeadline = "Crafting",
    workbenchSubheadline = "Excellence by Hand",
    workbenchAreas = [],
    workbenchBadgeText = "Master Crafted",
    workbenchPrimaryButton = { label: "Visit Workshop", link: "#" },
    workbenchSecondaryButton = { label: "Our Process", link: "#" },
    workbenchBackgroundImage,
    sectionBackgroundImage,
    enableWoodEffects = false // Default to false for lighter effects
  } = props

  const { setHeaderTheme } = useHeaderTheme()
  const [activeArea, setActiveArea] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hoveredArea, setHoveredArea] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Changed to light theme
  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-rotate through areas
  useEffect(() => {
    if (workbenchAreas.length > 0) {
      const timer = setInterval(() => {
        setActiveArea((current) => (current + 1) % workbenchAreas.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [workbenchAreas])

  const handleAreaClick = (index: number) => {
    setActiveArea(index)
  }

  const currentArea = workbenchAreas[activeArea] || workbenchAreas[0]

  // Debug logging
  React.useEffect(() => {
    console.log('🔍 Workbench Hero Props:', {
      sectionBackgroundImage,
      workbenchBackgroundImage,
      enableWoodEffects,
      hasAreas: workbenchAreas.length
    })
  }, [sectionBackgroundImage, workbenchBackgroundImage, enableWoodEffects, workbenchAreas.length])

  // Get icon for area type
  const getAreaIcon = (type: string) => {
    switch (type) {
      case 'tools': return Hammer
      case 'materials': return Zap
      case 'blueprints': return FileText
      case 'finishes': return Palette
      default: return Hammer
    }
  }

  return (
    <section 
      className="relative -mt-[10.4rem] min-h-[80vh] flex flex-col overflow-hidden bg-antique-white" 
      data-theme="light"
    >
        
        {/* Simple background overlay - only if no section background image */}
        {!sectionBackgroundImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-antique-white to-copper-bourbon/5 pointer-events-none" />
        )}
        
        {/* Minimal ambient particles - much lighter */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-copper-bourbon/20 rounded-full animate-float"
              style={{
                left: `${10 + (i * 15)}%`,
                top: `${15 + (i * 12)}%`,
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Grid Layout */}
        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-0 min-h-[80vh]">
          
          {/* Workbench View - Fixed section background image visibility */}
          <div className="relative order-1 lg:col-span-8 min-h-[50vh] lg:min-h-[80vh] overflow-hidden">
            
            {/* Section Wood Background - Now properly visible */}
            {sectionBackgroundImage ? (
              <div className="absolute inset-0">
                <img
                  src={sectionBackgroundImage.url}
                  alt={sectionBackgroundImage.alt}
                  className="w-full h-full object-cover"
                />
                
                {/* Minimal enhancement effects only if enabled */}
                {enableWoodEffects && (
                  <div className="absolute inset-0 bg-gradient-to-br from-copper-bourbon/5 via-transparent to-antique-brass/5" />
                )}
                
                {/* Light vignette for content readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-deep-charcoal/5" />
              </div>
            ) : (
              /* Light fallback background */
              <div className="absolute inset-0 bg-gradient-to-br from-antique-white to-copper-bourbon/10" />
            )}
            
            {/* Content wrapper for proper spacing */}
            <div className="relative z-10 h-full flex items-center justify-center px-4 py-6 lg:px-8 lg:py-8">
            
            {/* Simplified Workbench Background */}
            <div className="relative w-full max-w-4xl aspect-[4/3] lg:aspect-[3/2] rounded-xl shadow-lg overflow-hidden border border-copper-bourbon/20 bg-antique-white/80 backdrop-blur-sm">
              
              {/* Workbench Background Image */}
              {workbenchBackgroundImage ? (
                <div className="relative w-full h-full">
                  <img
                    src={workbenchBackgroundImage.url}
                    alt={workbenchBackgroundImage.alt}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Minimal enhancement effects only if enabled */}
                  {enableWoodEffects && (
                    <div className="absolute inset-0 bg-gradient-to-br from-copper-bourbon/8 via-transparent to-antique-brass/8" />
                  )}
                  
                  {/* Simple workbench border */}
                  <div className="absolute inset-0 border-2 border-copper-bourbon/15 rounded-xl" />
                </div>
              ) : (
                // Clean fallback workbench background
                <div className="w-full h-full bg-gradient-to-br from-antique-white via-copper-bourbon/10 to-antique-white relative">
                  {/* Simple wood grain pattern */}
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B87333' fill-opacity='0.3'%3E%3Cpath d='M0 10h60v2H0zm0 20h60v1H0zm0 10h60v2H0zm0 20h60v1H0z'/%3E%3C/g%3E%3C/svg%3E")`,
                      backgroundSize: '60px 60px'
                    }}
                  />
                  
                  {/* Simple border */}
                  <div className="absolute inset-0 border-2 border-copper-bourbon/20 rounded-xl" />
                </div>
              )}
              
              {/* Simplified Workshop Elements */}
              <div className="absolute inset-0">
                {/* Minimal tool representations */}
                <div className="absolute top-[20%] left-[15%] w-12 h-3 bg-deep-charcoal/30 rounded-sm transform -rotate-12 shadow-sm" />
                <div className="absolute top-[30%] right-[20%] w-10 h-2 bg-deep-charcoal/30 rounded-full transform rotate-45 shadow-sm" />
                <div className="absolute bottom-[25%] left-[20%] w-16 h-2 bg-deep-charcoal/30 rounded-sm transform rotate-6 shadow-sm" />
                
                {/* Simple blueprint corner */}
                <div className="absolute bottom-[15%] right-[15%] w-24 h-16 bg-antique-white rounded-lg transform rotate-3 shadow-md border border-copper-bourbon/20">
                  <div className="absolute inset-2 border border-copper-bourbon/15 rounded" />
                  <div className="absolute top-3 left-3 right-3 h-px bg-copper-bourbon/20" />
                  <div className="absolute top-5 left-3 right-5 h-px bg-copper-bourbon/15" />
                  <div className="absolute top-7 left-3 right-4 h-px bg-copper-bourbon/15" />
                </div>
                
                {/* Simple measurement tools */}
                <div className="absolute top-[35%] left-[8%] w-2 h-12 bg-copper-bourbon/40 rounded-full transform rotate-25 shadow-sm" />
                <div className="absolute bottom-[35%] right-[12%] w-12 h-1 bg-copper-bourbon/40 rounded-full transform -rotate-15 shadow-sm" />
              </div>
              
              {/* Interactive Workbench Areas - Simplified */}
              {workbenchAreas.map((area, index) => {
                const isActive = index === activeArea
                const isHovered = index === hoveredArea
                const Icon = getAreaIcon(area.areaType)
                
                return (
                  <div
                    key={area.id}
                    className={cn(
                      "absolute w-14 h-14 lg:w-16 lg:h-16 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group",
                      isActive && "z-20",
                      isHovered && "z-10"
                    )}
                    style={{
                      left: `${area.position.x}%`,
                      top: `${area.position.y}%`,
                    }}
                    onClick={() => handleAreaClick(index)}
                    onMouseEnter={() => setHoveredArea(index)}
                    onMouseLeave={() => setHoveredArea(null)}
                  >
                    {/* Simplified Area Hotspot */}
                    <div className={cn(
                      "w-full h-full rounded-full border-2 flex items-center justify-center transition-all duration-300 backdrop-blur-sm relative overflow-hidden",
                      isActive 
                        ? "bg-copper-bourbon text-antique-white border-copper-bourbon scale-110 shadow-lg" 
                        : isHovered
                        ? "bg-copper-bourbon/80 text-antique-white border-copper-bourbon scale-105 shadow-md"
                        : "bg-antique-white/80 text-deep-charcoal border-copper-bourbon/30 hover:bg-antique-white/90 scale-100 shadow-sm"
                    )}>
                      <Icon 
                        size={isMobile ? 18 : 22} 
                        className="transition-all duration-200" 
                        strokeWidth={2}
                      />
                      
                      {/* Light hover effect */}
                      {(isActive || isHovered) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
                      )}
                    </div>
                    
                    {/* Simplified Area Label */}
                    <div className={cn(
                      "absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-sourcesans font-medium px-2 py-1 rounded-md whitespace-nowrap transition-all duration-200 shadow-sm",
                      isActive 
                        ? "bg-deep-charcoal text-copper-bourbon opacity-100 scale-105" 
                        : "bg-deep-charcoal/70 text-antique-white opacity-80 scale-100"
                    )}>
                      {area.areaName}
                    </div>
                    
                    {/* Simple active indicator */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-copper-bourbon/20 animate-pulse" />
                    )}
                  </div>
                )
              })}
            </div>
            
            </div> {/* Close content wrapper */}
          </div>

          {/* Content Section - Light theme styling */}
          <div className="relative order-2 lg:col-span-4 min-h-[30vh] lg:min-h-[80vh] bg-white overflow-hidden">
            
            {/* Simple side accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-copper-bourbon to-antique-brass opacity-40" />
            
            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
              <div className="max-w-md w-full text-center lg:text-left space-y-4">
                
                {/* Simplified Badge */}
                <div className={cn(
                  "inline-flex items-center gap-2 bg-copper-bourbon/10 border border-copper-bourbon/20 rounded-full px-4 py-2 transition-all duration-500",
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}>
                  <div className="w-2 h-2 bg-copper-bourbon rounded-full animate-pulse" />
                  <span className="text-deep-charcoal font-medium tracking-wider uppercase text-sm font-sourcesans">
                    {workbenchBadgeText}
                  </span>
                </div>

                {/* Clean Headlines */}
                <div className={cn(
                  "transition-all duration-500 delay-100",
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold text-deep-charcoal mb-3 leading-tight">
                    {workbenchHeadline}
                  </h1>
                  <p className="text-lg text-copper-bourbon font-sourcesans font-semibold">
                    {workbenchSubheadline}
                  </p>
                </div>

                {/* Simplified Dynamic Area Content */}
                <div className={cn(
                  "transition-all duration-300 bg-antique-white/50 rounded-lg p-4 border border-copper-bourbon/15 shadow-sm",
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}>
                  <h2 className="text-xl lg:text-2xl font-playfair font-bold text-copper-bourbon mb-3 transition-all duration-300" key={currentArea?.id + '-title'}>
                    {currentArea?.title}
                  </h2>
                  <p className="text-base text-deep-charcoal/80 leading-relaxed font-sourcesans transition-all duration-300" key={currentArea?.id + '-desc'}>
                    {currentArea?.description}
                  </p>
                </div>

                {/* Clean Action Buttons */}
                <div className={cn(
                  "flex flex-col sm:flex-row gap-3 justify-center lg:justify-start transition-all duration-500 delay-200",
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}>
                  <Link
                    href={workbenchPrimaryButton?.link || '#'}
                    className="group bg-copper-bourbon hover:bg-antique-brass text-antique-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 font-sourcesans min-h-[48px] shadow-md hover:shadow-lg relative overflow-hidden"
                  >
                    {/* Simple hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10">{workbenchPrimaryButton?.label}</span>
                    <ArrowRight size={16} className="relative z-10 transition-transform group-hover:translate-x-1" />
                  </Link>
                  
                  <Link
                    href={workbenchSecondaryButton?.link || '#'}
                    className="group border-2 border-copper-bourbon/40 text-deep-charcoal hover:bg-copper-bourbon/10 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 font-sourcesans min-h-[48px]"
                  >
                    <Play size={14} />
                    <span>{workbenchSecondaryButton?.label}</span>
                  </Link>
                </div>

                {/* Simple Area Navigation Indicators */}
                <div className="flex justify-center lg:justify-start gap-2 pt-4">
                  {workbenchAreas.map((area, index) => (
                    <button
                      key={area.id}
                      onClick={() => handleAreaClick(index)}
                      className={cn(
                        "w-3 h-3 rounded-full transition-all duration-300 cursor-pointer",
                        index === activeArea 
                          ? 'bg-copper-bourbon scale-125 shadow-sm' 
                          : 'bg-deep-charcoal/30 hover:bg-deep-charcoal/50 scale-100 hover:scale-110'
                      )}
                      aria-label={`View ${area.areaName}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Workshop Progress Bar */}
        <div className="bg-antique-white/80 border-t border-copper-bourbon/20 px-4 py-3 sm:px-6 sm:py-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between text-deep-charcoal">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-copper-bourbon rounded-full animate-pulse" />
                <span className="text-sm font-sourcesans font-medium">Workshop Tour</span>
              </div>
              
              <div className="flex-1 mx-6 relative">
                <div className="h-2 bg-deep-charcoal/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-copper-bourbon transition-all duration-1000 ease-out rounded-full"
                    style={{ 
                      width: `${((activeArea + 1) / workbenchAreas.length) * 100}%`
                    }}
                  />
                </div>
                
                <div className="absolute -top-1 left-0 right-0 flex justify-between">
                  {workbenchAreas.map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "w-3 h-3 rounded-full border transition-all duration-300",
                        index <= activeArea 
                          ? "bg-copper-bourbon border-copper-bourbon" 
                          : "bg-antique-white border-deep-charcoal/30"
                      )}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-sourcesans font-medium">
                  {activeArea + 1} / {workbenchAreas.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}