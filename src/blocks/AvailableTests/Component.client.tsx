'use client'

import type { AvailableTestsBlock as AvailableTestsBlockType } from '@/payload-types'
import { Clock, MapPin } from 'lucide-react'
import React, { useCallback, useEffect, useRef } from 'react'

export const AvailableTestsClient: React.FC<AvailableTestsBlockType> = ({
  sectionTitle,
  featuredTest,
  secondaryTests,
  id,
}) => {
  const listRef = useRef<HTMLUListElement>(null)
  const allTests = [featuredTest, ...(secondaryTests || [])]
  const activeIndexRef = useRef(0)

  const setActiveItem = useCallback((index: number) => {
    const list = listRef.current
    if (!list) return

    const items = list.children
    const isDesktop = window.innerWidth > 768

    // Update active states
    for (let i = 0; i < items.length; i++) {
      (items[i] as HTMLElement).dataset.active = (i === index).toString()
    }

    // Update grid layout
    const template = Array.from({ length: items.length }, (_, i) => 
      i === index ? '10fr' : '1fr'
    ).join(' ')

    if (isDesktop) {
      list.style.gridTemplateColumns = template
      list.style.gridTemplateRows = ''
    } else {
      list.style.gridTemplateRows = template
      list.style.gridTemplateColumns = ''
    }

    activeIndexRef.current = index
  }, [])

  const handleInteraction = useCallback((e: Event) => {
    const target = e.target as HTMLElement
    const item = target.closest('li')
    if (!item || !listRef.current) return

    const index = Array.from(listRef.current.children).indexOf(item)
    if (index !== -1) setActiveItem(index)
  }, [setActiveItem])

  const handleResize = useCallback(() => {
    setActiveItem(activeIndexRef.current)
    
    // Update width variable for desktop
    if (window.innerWidth > 768 && listRef.current) {
      const maxWidth = Math.max(
        ...Array.from(listRef.current.children, el => el.clientWidth)
      )
      listRef.current.style.setProperty('--item-width', `${maxWidth}px`)
    }
  }, [setActiveItem])

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    // Single event delegation
    list.addEventListener('click', handleInteraction)
    list.addEventListener('pointermove', handleInteraction)
    
    // Throttled resize
    let resizeTimer: NodeJS.Timeout
    const throttledResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(handleResize, 100)
    }
    window.addEventListener('resize', throttledResize)

    // Initialize
    setActiveItem(0)
    handleResize()

    return () => {
      list.removeEventListener('click', handleInteraction)
      list.removeEventListener('pointermove', handleInteraction)
      window.removeEventListener('resize', throttledResize)
      clearTimeout(resizeTimer)
    }
  }, [handleInteraction, handleResize, setActiveItem])

  return (
    <>
      <style jsx global>{`
        .tests-section {
          padding: 3rem 0;
          position: relative;
          overflow: hidden;
        }

        .tests-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            hsl(var(--color-clinical-white)) 0%,
            hsl(var(--color-coral) / 0.05) 15%,
            hsl(var(--color-navy) / 0.08) 50%,
            hsl(var(--color-coral) / 0.05) 85%,
            hsl(var(--color-clinical-white)) 100%
          );
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          z-index: -1;
        }

        .dark .tests-section::before {
          background: linear-gradient(
            to bottom,
            hsl(var(--color-navy)) 0%,
            hsl(var(--color-coral) / 0.1) 15%,
            hsl(var(--color-dark-navy) / 0.95) 50%,
            hsl(var(--color-coral) / 0.1) 85%,
            hsl(var(--color-navy)) 100%
          );
        }

        .tests-grid {
          --item-width: 100px;
          display: grid;
          gap: 1rem;
          height: clamp(400px, 70vh, 700px);
          max-width: 1280px;
          margin: 0 auto;
          list-style: none;
          padding: 0;
          transition: grid-template-columns 0.6s ease, grid-template-rows 0.6s ease;
        }

        .test-item {
          background: linear-gradient(135deg, hsl(var(--color-coral)), hsl(var(--color-brand-blue)));
          border-radius: 12px;
          border: 1px solid hsl(var(--color-coral) / 0.2);
          box-shadow: 0 4px 16px hsl(var(--color-coral) / 0.15);
          overflow: hidden;
          cursor: pointer;
          transition: box-shadow 0.3s ease;
          position: relative;
          min-width: 2rem;
          min-height: 2rem;
        }

        .test-item:hover {
          box-shadow: 0 8px 28px hsl(var(--color-coral) / 0.25);
        }

        .test-content {
          position: absolute;
          inset: 0;
          padding: 0 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          z-index: 2;
        }

        .test-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 1;
        }

        /* DESKTOP TITLE */
        .test-title-desktop {
          position: absolute;
          top: 1.25rem;
          left: 1rem;
          rotate: 90deg;
          transform-origin: 0 50%;
          font-size: 1.1rem;
          font-weight: 700;
          text-transform: uppercase;
          font-family: var(--font-heading);
          color: white;
          opacity: 0.9;
          transition: opacity 0.6s ease;
          white-space: nowrap;
          z-index: 10;
          overflow: hidden;
          letter-spacing: 0.03em;
        }

        .test-title-desktop-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            hsl(var(--color-dark-navy) / 0.9) 0%,
            hsl(var(--color-dark-navy) / 0.7) 40%,
            hsl(var(--color-dark-navy) / 0.3) 70%,
            transparent 85%
          );
          backdrop-filter: blur(4px);
          border-radius: 4px;
        }

        .test-title-desktop-text {
          position: relative;
          z-index: 2;
          padding: 0.25rem 0.5rem;
        }

        /* MOBILE TITLE */
        .test-title-mobile {
          position: absolute;
          top: 50%;
          left: 1rem;
          transform: translateY(-50%);
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          font-family: var(--font-heading);
          color: white;
          opacity: 0.8;
          transition: all 0.6s ease;
          z-index: 10;
          overflow: hidden;
          letter-spacing: 0.02em;
          line-height: 1.1;
          width: 70%;
          max-width: 250px;
          height: 2.5rem;
          display: none;
        }

        .test-title-mobile-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            hsl(var(--color-dark-navy) / 0.9) 0%,
            hsl(var(--color-dark-navy) / 0.6) 60%,
            transparent 90%
          );
          backdrop-filter: blur(4px);
          border-radius: 6px;
        }

        .test-title-mobile-text {
          position: relative;
          z-index: 2;
          padding: 0.5rem 0.75rem;
          display: flex;
          align-items: center;
          height: 100%;
        }

        .test-description {
          opacity: 0;
          transition: opacity 0.6s ease 0.15s;
          color: white;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 4rem; /* INCREASED MARGIN TO PREVENT OVERLAP */
          font-size: 0.95rem;
          line-height: 1.5;
          font-family: var(--font-body);
          max-width: 90%;
          text-wrap: balance;
          font-weight: 500;
          position: relative;
          overflow: hidden;
        }

        .test-description-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            hsl(var(--color-dark-navy) / 0.9) 0%,
            hsl(var(--color-dark-navy) / 0.7) 40%,
            hsl(var(--color-dark-navy) / 0.3) 70%,
            transparent 85%
          );
          backdrop-filter: blur(4px);
          border-radius: 8px;
        }

        .test-description-text {
          position: relative;
          z-index: 2;
        }

        .test-features {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          opacity: 0;
          transition: opacity 0.6s ease 0.15s;
          z-index: 10;
        }

        .test-feature {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem;
          border-radius: 6px;
          position: relative;
          overflow: hidden;
        }

        .test-feature-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            hsl(var(--color-dark-navy) / 0.9) 0%,
            hsl(var(--color-dark-navy) / 0.7) 40%,
            hsl(var(--color-dark-navy) / 0.3) 70%,
            transparent 85%
          );
          backdrop-filter: blur(4px);
          border-radius: 6px;
        }

        .test-feature-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .test-feature span {
          font-size: 0.7rem;
          color: hsl(var(--color-clinical-white) / 0.9);
          font-weight: 500;
          text-align: center;
        }

        /* BUTTON - DESKTOP LEFT ALIGNED, NO OVERLAP */
        .test-button {
          position: absolute;
          bottom: 1.5rem;
          left: 1rem;
          transform: translateY(20px);
          width: auto;
          min-width: 180px;
          max-width: 250px; /* PREVENT EXCESSIVE WIDTH */
          height: 40px;
          background: hsl(var(--color-clinical-white) / 0.9);
          color: hsl(var(--color-coral));
          font-weight: 700;
          font-family: var(--font-heading);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          display: none;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          z-index: 10;
          padding: 0 1.5rem;
          transition: all 0.6s ease 0.3s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .test-button:hover {
          background: white;
          transform: translateY(-1px);
        }

        /* Active states */
        .test-item[data-active='true'] .test-title-desktop,
        .test-item[data-active='true'] .test-title-mobile,
        .test-item[data-active='true'] .test-description,
        .test-item[data-active='true'] .test-features {
          opacity: 1;
        }

        .test-item[data-active='true'] .test-button {
          display: flex;
          transform: translateY(0);
        }

        /* Mobile */
        @media (max-width: 768px) {
          .tests-grid {
            height: clamp(400px, 120vh, 900px);
            gap: 0.75rem;
          }

          .test-content {
            padding: 1rem 1.5rem 2rem;
          }

          .test-title-desktop { 
            display: none !important; 
          }
          
          .test-title-mobile { 
            display: block !important; 
          }

          .test-description {
            position: absolute;
            bottom: 6rem; /* MORE SPACE FROM BUTTON */
            left: 1rem;
            right: 1rem;
            margin-bottom: 0;
            font-size: 0.85rem;
            padding: 0.75rem;
            max-width: none;
          }

          .test-features {
            top: 1rem;
            right: 1rem;
            flex-direction: row;
            gap: 0.5rem;
          }

          .test-feature {
            padding: 0.25rem 0.5rem;
          }

          .test-feature span {
            font-size: 0.6rem;
            white-space: nowrap;
          }

          /* BUTTON WITH SIDE MARGINS ON MOBILE */
          .test-button {
            bottom: 2rem;
            left: 2rem; /* SIDE MARGINS */
            right: 2rem; /* SIDE MARGINS */
            width: auto;
            min-width: auto;
            max-width: none;
            transform: translateY(20px);
            height: 44px; /* SLIGHTLY TALLER */
            font-size: 0.85rem;
            padding: 0 1rem;
          }

          .test-item[data-active='true'] .test-button {
            transform: translateY(0);
          }

          .test-item[data-active='true'] .test-title-mobile {
            top: 1rem;
            transform: none;
            font-size: 1rem;
            height: 3rem;
            width: 70%;
            max-width: 250px;
          }
        }
      `}</style>

      <section id={id} className="tests-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-heading font-bold text-dark-navy dark:text-clinical-white mb-4">
              {sectionTitle}
            </h2>
            <p className="text-lg text-blue-gray dark:text-clinical-white/80 max-w-3xl mx-auto">
              Professional laboratory services with certified expertise and cutting-edge technology
            </p>
          </div>

          <ul 
            ref={listRef}
            className="tests-grid"
            style={{
              gridTemplateColumns: `repeat(${allTests.length}, 1fr)`
            }}
          >
            {allTests.map((test, index) => (
              <li key={index} className="test-item">
                {test.backgroundImage && typeof test.backgroundImage === 'object' && test.backgroundImage?.url ? (
                  <img
                    src={test.backgroundImage.url}
                    alt={test.testName}
                    className="test-image"
                  />
                ) : (
                  <div className="test-image bg-gradient-to-br from-coral/60 to-brand-blue/60" />
                )}

                <div className="test-content">
                  {/* DESKTOP TITLE */}
                  <div className="test-title-desktop">
                    <div className="test-title-desktop-bg"></div>
                    <div className="test-title-desktop-text">{test.testName}</div>
                  </div>

                  {/* MOBILE TITLE */}
                  <div className="test-title-mobile">
                    <div className="test-title-mobile-bg"></div>
                    <div className="test-title-mobile-text">{test.testName}</div>
                  </div>
                  
                  <div className="test-description">
                    <div className="test-description-bg"></div>
                    <div className="test-description-text">{test.description}</div>
                  </div>

                  <div className="test-features">
                    <div className="test-feature">
                      <div className="test-feature-bg"></div>
                      <div className="test-feature-content">
                        <Clock className="w-4 h-4" />
                        <span>Fast</span>
                      </div>
                    </div>
                    <div className="test-feature">
                      <div className="test-feature-bg"></div>
                      <div className="test-feature-content">
                        <MapPin className="w-4 h-4" />
                        <span>Mobile</span>
                      </div>
                    </div>
                  </div>

                  <a href={test.ctaButton.link} className="test-button">
                    {test.ctaButton.text}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}