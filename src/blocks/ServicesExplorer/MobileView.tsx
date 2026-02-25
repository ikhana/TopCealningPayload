// src/blocks/ServicesExplorer/MobileView.tsx
'use client'

import RichText from '@/components/RichText'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { WorkshopButton } from '@/components/ui/WorkshopButton/WorkshopButton'
import type { ServicesExplorerBlock } from '@/payload-types'
import { ArrowLeft, Clock, MapPin, Search, X } from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Slider from 'react-slick'
import { buildCalendarUrl, getCategoryDisplayName, processTestsWithIds, searchTests, sortTests, filterTestsByCategory } from './utils'

interface MobileViewProps {
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

function CalendarModal({ isOpen, onClose, test }: { isOpen: boolean; onClose: () => void; test: TestService | null }) {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="relative w-full max-w-lg h-[90vh] bg-white dark:bg-navy rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-blue-gray/10 dark:border-blue-gray/20 bg-white dark:bg-navy">
          <div className="flex-1 min-w-0 mr-2">
            <h3 className="text-base font-bold text-dark-navy dark:text-clinical-white truncate">
              Book: {test.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-clinical-white/70 truncate">
              {getCategoryDisplayName(test.category)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-coral/10 rounded-full transition-colors flex-shrink-0"
            aria-label="Close booking form"
          >
            <X className="w-5 h-5 text-coral" />
          </button>
        </div>
        
        <div className="w-full h-[calc(100%-65px)] touch-auto">
          <iframe
            src={calendarUrl}
            className="w-full h-full border-0"
            title={`Book ${test.title}`}
            allow="payment"
            style={{
              pointerEvents: 'auto',
              touchAction: 'auto'
            }}
          />
        </div>
      </div>
    </div>
  )
}


export const MobileView: React.FC<MobileViewProps> = ({ blockData }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentTitle, setCurrentTitle] = useState('')
  const [expandedDetails, setExpandedDetails] = useState(false)
  const [isTitleMenuOpen, setIsTitleMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Services')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedTest, setSelectedTest] = useState<TestService | null>(null)

  const sliderRef = useRef<Slider>(null)
  const wheelWrapRef = useRef<HTMLDivElement | null>(null)
  const wheelCooldownRef = useRef(false)
  const wheelLockUntilRef = useRef(0)

  if (!blockData) {
    return (
      <div className="block md:hidden w-full bg-clinical-white dark:bg-navy min-h-screen p-8">
        <div className="flex items-center justify-center h-full">
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

  const filteredItems = useMemo(() => {
    let filtered = filterTestsByCategory(testsWithIds, selectedCategory)
    filtered = searchTests(filtered, query)
    return sortTests(filtered, blockData.sortBy || 'featured')
  }, [testsWithIds, selectedCategory, query, blockData.sortBy])

  useEffect(() => {
    if (filteredItems.length === 0) {
      setCurrentIndex(0)
      setCurrentTitle('No matches')
      sliderRef.current?.slickPause?.()
      return
    }
    if (currentIndex >= filteredItems.length) {
      setCurrentIndex(0)
      setCurrentTitle(filteredItems[0].title)
      sliderRef.current?.slickGoTo(0, true)
    } else {
      setCurrentTitle(filteredItems[currentIndex]?.title || '')
    }
  }, [filteredItems, currentIndex])

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    vertical: true,
    slidesToScroll: 1,
    autoplay: false,
    pauseOnHover: true,
    swipe: !expandedDetails,
    draggable: !expandedDetails,
    arrows: false,
    afterChange: (index: number) => {
      setCurrentIndex(index)
      setCurrentTitle(filteredItems[index]?.title ?? '')
      setExpandedDetails(false)
    },
  }

  const handleJumpTo = (i: number) => {
    setIsTitleMenuOpen(false)
    setExpandedDetails(false)
    wheelLockUntilRef.current = performance.now() + 900
    sliderRef.current?.slickGoTo(i)
    setCurrentIndex(i)
    setCurrentTitle(filteredItems[i]?.title ?? '')
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentIndex(0)
    setExpandedDetails(false)
    setIsTitleMenuOpen(false)
  }

  const handleBookTest = (test: TestService) => {
    setSelectedTest(test)
    setIsCalendarOpen(true)
  }

  useEffect(() => {
    const el = wheelWrapRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      if (filteredItems.length === 0 || expandedDetails || isTitleMenuOpen) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      if (performance.now() < wheelLockUntilRef.current) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      if (wheelCooldownRef.current) {
        e.preventDefault()
        e.stopPropagation()
        return
      }

      wheelCooldownRef.current = true
      setTimeout(() => (wheelCooldownRef.current = false), 350)

      e.preventDefault()
      e.stopPropagation()

      if (e.deltaY > 0) sliderRef.current?.slickNext()
      else sliderRef.current?.slickPrev()
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [filteredItems.length, expandedDetails, isTitleMenuOpen])

  return (
    <>
      <div className="block md:hidden w-full bg-clinical-white dark:bg-navy min-h-screen">
        <style jsx>{`
          .themed-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .themed-scrollbar::-webkit-scrollbar-track {
            background: rgba(156, 163, 175, 0.1);
          }
          .themed-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(216, 77, 43, 0.5);
            border-radius: 2px;
          }
          .themed-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(216, 77, 43, 0.7);
          }
          .themed-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(216, 77, 43, 0.5) rgba(156, 163, 175, 0.1);
          }
          .dark .themed-scrollbar::-webkit-scrollbar-track {
            background: rgba(71, 85, 105, 0.2);
          }
          .dark .themed-scrollbar {
            scrollbar-color: rgba(216, 77, 43, 0.5) rgba(71, 85, 105, 0.2);
          }
        `}</style>

        <div className="p-4 pb-6">
          <div className="mb-6">
            <SectionHeading
              title={blockData.title || "Professional Laboratory Services"}
              size="md"
              align="center"
              theme="auto"
              className="mb-2"
            />
            <p className="text-slate-600 dark:text-clinical-white/70 text-sm text-center leading-relaxed px-4">
              {blockData.subtitle || "Comprehensive diagnostic testing with advanced technology and expert analysis"}
            </p>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-coral dark:text-clinical-white text-center mb-4">
              <DecryptEffect text={currentTitle} />
            </h2>
            
            {blockData.enableSearch && (
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tests..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-navy/50 text-slate-900 dark:text-clinical-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsTitleMenuOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-navy/50 px-3 py-3 text-sm font-medium text-slate-900 dark:text-clinical-white shadow-sm hover:bg-slate-50 dark:hover:bg-navy/70"
                >
                  <span className="truncate">{currentTitle}</span>
                  <svg
                    className={`h-4 w-4 transition-transform flex-shrink-0 ml-1 ${isTitleMenuOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {isTitleMenuOpen && (
                  <div className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-navy shadow-lg themed-scrollbar">
                    <ul className="py-1 text-sm">
                      {filteredItems.map((item, i) => (
                        <li key={item.testId}>
                          <button
                            type="button"
                            onClick={() => handleJumpTo(i)}
                            className={`block w-full px-3 py-3 text-left hover:bg-slate-50 dark:hover:bg-navy/70 text-slate-900 dark:text-clinical-white ${
                              i === currentIndex ? 'bg-coral/10 font-semibold text-coral' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                                {item.testId}
                              </span>
                              <span className="truncate">{item.title}</span>
                            </div>
                          </button>
                        </li>
                      ))}
                      {filteredItems.length === 0 && (
                        <li className="px-3 py-3 text-slate-500 dark:text-slate-400">No matches</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {blockData.enableFilters && (
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-navy/50 px-3 py-3 text-sm font-medium text-slate-900 dark:text-clinical-white shadow-sm hover:bg-slate-50 dark:hover:bg-navy/70 focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === 'All Services' ? category : getCategoryDisplayName(category)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="relative overscroll-contain" ref={wheelWrapRef}>
            <Slider {...sliderSettings} ref={sliderRef}>
              {filteredItems.length === 0 ? (
                <div className="flex h-[500px] items-center justify-center text-slate-600 dark:text-slate-300">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-coral/10 dark:bg-coral/20 mx-auto flex items-center justify-center rounded mb-4">
                      <Search className="w-8 h-8 text-coral" />
                    </div>
                    <p className="text-lg font-medium mb-2">No matches found</p>
                    <p className="text-sm text-slate-400">Try adjusting your search terms or category filter</p>
                  </div>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div key={item.testId} className="px-2">
                    <div className="w-full h-[600px]">
                      <div className="h-full">
                        {expandedDetails ? (
                          <div className="w-full h-full bg-white dark:bg-navy/90 rounded shadow-sm border border-blue-gray/10 dark:border-blue-gray/20 flex flex-col overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-blue-gray/10 dark:border-blue-gray/20 flex-shrink-0">
                              <button
                                onClick={() => setExpandedDetails(false)}
                                className="flex items-center gap-2 text-coral hover:text-coral/80 transition-colors"
                              >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="text-sm font-medium">Back</span>
                              </button>
                              <h3 className="text-lg font-bold text-dark-navy dark:text-clinical-white">
                                {item.title}
                              </h3>
                            </div>

                            <div 
                              className="flex-1 p-6 space-y-6 themed-scrollbar"
                              style={{ 
                                overflowY: 'auto',
                                height: 'calc(100% - 140px)',
                                touchAction: 'pan-y'
                              }}
                              onTouchStart={(e) => e.stopPropagation()}
                              onTouchMove={(e) => e.stopPropagation()}
                              onWheel={(e) => e.stopPropagation()}
                            >
                              {item.details ? (
                                <div className="prose prose-sm max-w-none prose-headings:text-dark-navy dark:prose-headings:text-clinical-white prose-p:text-slate-700 dark:prose-p:text-clinical-white/80">
                                  <RichText data={item.details} enableGutter={false} />
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="text-sm font-bold text-dark-navy dark:text-clinical-white mb-3 uppercase tracking-wider">
                                      Overview
                                    </h4>
                                    <p className="text-sm text-slate-700 dark:text-clinical-white/80 leading-relaxed">
                                      {item.description}
                                    </p>
                                  </div>

                                  {item.features && item.features.length > 0 && (
                                    <div>
                                      <h4 className="text-sm font-bold text-dark-navy dark:text-clinical-white mb-3 uppercase tracking-wider">
                                        Key Features
                                      </h4>
                                      <ul className="space-y-2">
                                        {item.features.map((feature, i) => (
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
                                onClick={() => handleBookTest(item)}
                                className="w-full bg-coral hover:bg-coral/90"
                              >
                                Book This Test Now
                              </WorkshopButton>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full bg-white dark:bg-navy/90 overflow-hidden rounded shadow-sm border border-blue-gray/10 dark:border-blue-gray/20">
                            <div className="relative h-[320px] overflow-hidden">
                              {typeof item.image === 'object' && item.image?.url ? (
                                <img
                                  src={item.image.url}
                                  alt={`${item.title} medical testing`}
                                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-coral/10 to-brand-blue/10 flex items-center justify-center">
                                    <DecryptEffect text={item.testId ?? ""} startDecrypting={true} />
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
                                        {getCategoryDisplayName(item.category)}
                                      </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-dark-navy dark:text-clinical-white mb-2">
                                      {item.title}
                                    </h3>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="p-6 space-y-6">
                              <p className="text-sm text-slate-700 dark:text-clinical-white/80 leading-relaxed">
                                {item.description}
                              </p>

                              <div className="grid grid-cols-2 gap-6 text-xs">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-coral" />
                                  <span className="text-slate-600 dark:text-clinical-white/70">
                                    {item.turnaround}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-brand-blue" />
                                  <span className="text-slate-600 dark:text-clinical-white/70">
                                    {item.mobile ? 'Mobile Available' : 'Lab Collection'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex gap-3 pt-4">
                                <WorkshopButton
                                  as="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setExpandedDetails(true)}
                                  className="flex-1 border-coral text-coral hover:bg-coral/5"
                                >
                                  Learn More
                                </WorkshopButton>
                                <WorkshopButton
                                  as="button"
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleBookTest(item)}
                                  className="flex-1 bg-coral hover:bg-coral/90"
                                >
                                  Book Test
                                </WorkshopButton>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </Slider>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Swipe up/down or use mouse wheel to navigate • Tap "Book Test" to schedule
            </p>
          </div>
        </div>
      </div>

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => {
          setIsCalendarOpen(false)
          setSelectedTest(null)
        }}
        test={selectedTest}
      />
    </>
  )
}