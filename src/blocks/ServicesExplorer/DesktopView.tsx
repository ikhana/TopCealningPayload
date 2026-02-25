// src/blocks/ServicesExplorer/DesktopView.tsx
'use client'

import RichText from '@/components/RichText'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { WorkshopButton } from '@/components/ui/WorkshopButton/WorkshopButton'
import type { ServicesExplorerBlock } from '@/payload-types'
import { Clock, MapPin, Search, X } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { buildCalendarUrl, getCategoryDisplayName, processTestsWithIds, searchTests, sortTests, filterTestsByCategory } from './utils'

interface DesktopViewProps {
  blockData: ServicesExplorerBlock
}

type TestService = ServicesExplorerBlock['tests'][0]

function DecryptEffect({ text, startDecrypting = false }: { text: string; startDecrypting?: boolean }) {
  const [decodedText, setDecodedText] = useState(startDecrypting ? '' : text)

  useEffect(() => {
    let iteration = 0
    let shouldAnimate = true
    const frameRate = 24
    const speed = startDecrypting ? 0.3 : 0.5

    const interval = setInterval(() => {
      if (!shouldAnimate) return

      setDecodedText(() => {
        const result = text
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return text[index]
            }
            return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[
              Math.floor(Math.random() * 62)
            ]
          })
          .join('')

        iteration += speed
        if (iteration >= text.length) {
          clearInterval(interval)
        }
        return result
      })
    }, 1000 / frameRate)

    return () => {
      shouldAnimate = false
      clearInterval(interval)
    }
  }, [text, startDecrypting])

  return <span className="font-medium">{decodedText}</span>
}

function BookingModal({ isOpen, onClose, test }: { isOpen: boolean; onClose: () => void; test: TestService | null }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !test) return null

  const calendarUrl = buildCalendarUrl(test)

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl h-[90vh] bg-white dark:bg-navy rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 bg-white dark:bg-navy border-b border-slate-200 dark:border-slate-700">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-dark-navy dark:text-clinical-white mb-1">
              {test.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-clinical-white/70">
              {getCategoryDisplayName(test.category)} • Book Your Appointment
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-4 p-2 hover:bg-coral/10 rounded-full transition-colors group"
            aria-label="Close booking form"
          >
            <X className="w-6 h-6 text-slate-600 dark:text-clinical-white group-hover:text-coral transition-colors" />
          </button>
        </div>
        
        <div className="w-full h-full pt-[76px]">
          <iframe
            src={calendarUrl}
            className="w-full h-full border-0"
            title={`Book ${test.title}`}
            allow="payment"
            style={{ colorScheme: 'normal' }}
          />
        </div>
      </div>
    </div>
  )
}

export const DesktopView: React.FC<DesktopViewProps> = ({ blockData }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [lockedItem, setLockedItem] = useState<string | null>(null)
  const [expandedDetails, setExpandedDetails] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All Services')
  const [searchQuery, setSearchQuery] = useState('')
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedTest, setSelectedTest] = useState<TestService | null>(null)

  if (!blockData) {
    return (
      <div className="hidden md:block w-full bg-clinical-white dark:bg-navy p-8">
        <div className="text-center">
          <p className="text-slate-600 dark:text-clinical-white">Loading services...</p>
        </div>
      </div>
    )
  }

  const testsWithIds = processTestsWithIds(blockData.tests || [])
  
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(testsWithIds.map(test => test.category)))
    return ['All Services', ...uniqueCategories]
  }, [testsWithIds])

  const filteredServices = useMemo(() => {
    let filtered = filterTestsByCategory(testsWithIds, selectedCategory)
    filtered = searchTests(filtered, searchQuery)
    return sortTests(filtered, blockData.sortBy || 'featured')
  }, [testsWithIds, selectedCategory, searchQuery, blockData.sortBy])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isBookingModalOpen) {
          setIsBookingModalOpen(false)
          setSelectedTest(null)
        } else if (expandedDetails) {
          setExpandedDetails(null)
        } else if (lockedItem) {
          setLockedItem(null)
        }
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [lockedItem, expandedDetails, isBookingModalOpen])

  const handleItemClick = (testId: string) => {
    if (lockedItem === testId) {
      setLockedItem(null)
      setExpandedDetails(null)
    } else {
      setLockedItem(testId)
      setExpandedDetails(null)
    }
  }

  const handleLearnMore = (testId: string) => {
    setExpandedDetails(expandedDetails === testId ? null : testId)
  }

  const handleBookTest = (test: TestService) => {
    setSelectedTest(test)
    setIsBookingModalOpen(true)
  }

  const displayedService = lockedItem
    ? filteredServices.find((item) => item.testId === lockedItem) || null
    : hoveredItem
      ? filteredServices.find((item) => item.testId === hoveredItem) || null
      : null

  return (
    <>
      <div className="hidden md:block w-full bg-clinical-white dark:bg-navy overflow-hidden">
        <style jsx>{`
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(216, 77, 43, 0.5) rgba(156, 163, 175, 0.1);
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(156, 163, 175, 0.1);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(216, 77, 43, 0.5);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(216, 77, 43, 0.7);
          }
        `}</style>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] xl:grid-cols-[500px_1fr] 2xl:grid-cols-[580px_1fr] h-[800px]">
          
          <div className="bg-white dark:bg-navy/95 lg:border-r border-slate-200/30 dark:border-slate-700/20 p-6 lg:p-8">
            <div className="mb-8">
              <SectionHeading
                title={blockData.title || "Professional Laboratory Services"}
                size="lg"
                align="left"
                theme="auto"
                className="mb-3"
              />
              <p className="text-slate-600 dark:text-clinical-white/70 text-sm leading-relaxed">
                {blockData.subtitle || "Comprehensive diagnostic testing with advanced technology and expert analysis"}
              </p>
            </div>

            <div 
              className="w-full bg-white dark:bg-navy/90 border border-blue-gray/10 dark:border-blue-gray/20 rounded overflow-hidden"
              style={{ height: '600px' }}
            >
              {!displayedService && (
                <div className="w-full h-full flex items-center justify-center text-center p-8">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-coral/10 dark:bg-coral/20 mx-auto flex items-center justify-center">
                      <Clock className="w-8 h-8 text-coral" />
                    </div>
                    <p className="text-slate-600 dark:text-clinical-white/80 leading-relaxed text-sm">
                      Hover over any medical service to see detailed information
                    </p>
                  </div>
                </div>
              )}

              {displayedService && (
                <div className="h-full w-full overflow-hidden">
                  {expandedDetails === displayedService.testId ? (
                    <div className="h-full flex flex-col bg-white dark:bg-navy/90">
                      <div className="flex items-center justify-between p-4 border-b border-blue-gray/10 dark:border-blue-gray/20 flex-shrink-0">
                        <h3 className="text-lg font-bold text-dark-navy dark:text-clinical-white">
                          {displayedService.title}
                        </h3>
                        <button
                          onClick={() => setExpandedDetails(null)}
                          className="p-1 hover:bg-coral/10 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-coral" />
                        </button>
                      </div>

                      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                        {displayedService.details ? (
                          <div className="prose prose-sm max-w-none prose-headings:text-dark-navy dark:prose-headings:text-clinical-white prose-p:text-slate-700 dark:prose-p:text-clinical-white/80">
                            <RichText data={displayedService.details} enableGutter={false} />
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <p className="text-sm text-slate-700 dark:text-clinical-white/80 leading-relaxed">
                              {displayedService.description}
                            </p>
                            {displayedService.features && displayedService.features.length > 0 && (
                              <div>
                                <h4 className="text-sm font-bold text-dark-navy dark:text-clinical-white mb-3 uppercase tracking-wider">
                                  Key Features
                                </h4>
                                <ul className="space-y-2">
                                  {displayedService.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-clinical-white/80">
                                      <div className="w-1.5 h-1.5 bg-coral rounded-full mt-2 flex-shrink-0" />
                                      <span>{feature.text}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="p-6 border-t border-blue-gray/10 dark:border-blue-gray/20 flex-shrink-0">
                        <WorkshopButton
                          as="button"
                          variant="primary"
                          size="md"
                          onClick={() => handleBookTest(displayedService)}
                          className="w-full bg-coral hover:bg-coral/90"
                        >
                          Book This Test Now
                        </WorkshopButton>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full bg-white dark:bg-navy/90 overflow-hidden">
                      <div className="relative h-80 overflow-hidden">
                        {typeof displayedService.image === 'object' && displayedService.image?.url ? (
                          <img
                            src={displayedService.image.url}
                            alt={`${displayedService.title} medical testing`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-coral/10 to-brand-blue/10 flex items-center justify-center">
                            <DecryptEffect text={displayedService.testId ?? ""} startDecrypting={true} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/80 via-dark-navy/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="relative inline-block">
                            <div className="absolute inset-0 bg-gradient-to-r from-clinical-white/60 via-clinical-white/40 to-transparent dark:from-dark-navy/60 dark:via-dark-navy/40 dark:to-transparent rounded-md"></div>
                            <div className="relative px-2 py-1">
                              <div className="flex items-center gap-2 text-xs mb-2">
                                <div className="w-2 h-2 bg-coral rounded-full" />
                                <span className="font-medium text-dark-navy dark:text-clinical-white">
                                  {getCategoryDisplayName(displayedService.category)}
                                </span>
                              </div>
                              <h3 className="text-lg font-bold text-dark-navy dark:text-clinical-white">
                                {displayedService.title}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <p className="text-sm text-slate-700 dark:text-clinical-white/80 leading-relaxed">
                          {displayedService.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-coral" />
                            <span className="text-slate-600 dark:text-clinical-white/70">
                              {displayedService.turnaround}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-brand-blue" />
                            <span className="text-slate-600 dark:text-clinical-white/70">
                              {displayedService.mobile ? 'Mobile Available' : 'Lab Collection'}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <WorkshopButton
                            as="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleLearnMore(displayedService.testId!)}
                            className="flex-1 border-coral text-coral hover:bg-coral/5"
                          >
                            Learn More
                          </WorkshopButton>
                          <WorkshopButton
                            as="button"
                            variant="primary"
                            size="sm"
                            onClick={() => handleBookTest(displayedService)}
                            className="flex-1 bg-coral hover:bg-coral/90"
                          >
                            Book Test
                          </WorkshopButton>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-clinical-white dark:bg-navy/90 flex flex-col h-[800px]">
            
            {(blockData.enableSearch || blockData.enableFilters) && (
              <div className="p-6 border-b border-blue-gray/10 dark:border-blue-gray/20 bg-white dark:bg-navy/95 flex-shrink-0">
                <div className="space-y-4">
                  
                  {blockData.enableSearch && (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search medical tests..."
                        className="w-full pl-10 pr-4 py-3 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-navy/50 text-slate-900 dark:text-clinical-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent text-sm"
                      />
                    </div>
                  )}

                  {blockData.enableFilters && (
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-3 py-2 text-xs font-medium border transition-all duration-300 ${
                            selectedCategory === category
                              ? 'bg-coral text-clinical-white border-coral'
                              : 'bg-white dark:bg-navy/50 text-slate-700 dark:text-clinical-white border-slate-200 dark:border-slate-600 hover:border-coral/40 hover:bg-coral/5'
                          }`}
                        >
                          {category === 'All Services' ? category : getCategoryDisplayName(category)}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      {filteredServices.length} {filteredServices.length === 1 ? 'test' : 'tests'} 
                      {selectedCategory !== 'All Services' && ` in ${getCategoryDisplayName(selectedCategory)}`}
                      {searchQuery && ` matching "${searchQuery}"`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {filteredServices.length === 0 ? (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-coral/10 dark:bg-coral/20 mx-auto flex items-center justify-center">
                      <Search className="w-8 h-8 text-coral" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-dark-navy dark:text-clinical-white mb-2">
                        No tests found
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-clinical-white/70">
                        Try adjusting your search or category filter
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2">
                  {filteredServices.map((item) => (
                    <div
                      key={item.testId}
                      className="group bg-white dark:bg-navy/95 border border-blue-gray/10 dark:border-blue-gray/20 p-4 lg:p-6 cursor-pointer transition-all duration-300 hover:bg-coral/5 dark:hover:bg-coral/10 text-center flex flex-col justify-center items-center relative min-h-[120px]"
                      onMouseEnter={() => {
                        if (!lockedItem) {
                          setHoveredItem(item.testId!)
                        }
                      }}
                      onMouseLeave={() => {
                        if (!lockedItem) {
                          setHoveredItem(null)
                        }
                      }}
                      onClick={() => handleItemClick(item.testId!)}
                    >
                      {item.featured && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-coral text-clinical-white text-xs font-bold uppercase tracking-wide">
                          Featured
                        </div>
                      )}
                      
                      <div className="text-xs font-mono text-slate-500 dark:text-clinical-white/60 mb-3">
                        {(hoveredItem === item.testId && !lockedItem) || lockedItem === item.testId ? (
                          <DecryptEffect text={item.testId!} startDecrypting={true} />
                        ) : (
                          item.testId
                        )}
                      </div>
                      
                      <h3 className="text-sm lg:text-base font-semibold text-dark-navy dark:text-clinical-white group-hover:text-coral transition-colors duration-300 mb-2 leading-tight">
                        {item.title}
                      </h3>
                      
                      <p className="text-xs text-coral font-medium">
                        {getCategoryDisplayName(item.category)}
                      </p>

                      {lockedItem === item.testId && (
                        <div className="absolute top-2 left-2 w-2 h-2 bg-coral rounded-full animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false)
          setSelectedTest(null)
        }}
        test={selectedTest}
      />
    </>
  )
}