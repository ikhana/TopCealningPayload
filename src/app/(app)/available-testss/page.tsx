'use client'

import { Navbar } from '@/components/interactiveNavbar/index'
import { cn } from '@/utilities/cn'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const text1 = 'TESTING'
const text2 = 'SERVICES'

const word1 = [...text1].map((char, index) => (
  <motion.span
    key={`t1-${index}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.1, delay: index * 0.1 }}
  >
    {char}
  </motion.span>
))

const word2 = [...text2].map((char, index) => (
  <motion.span
    key={`t2-${index}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.1, delay: (index + text1.length) * 0.1 }}
  >
    {char}
  </motion.span>
))

export default function AvailableTestsPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark')
      setTheme(isDark ? 'dark' : 'light')
    }
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // Load GoHighLevel embed script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://link.brandbloom.org/js/form_embed.js'
    script.type = 'text/javascript'
    document.head.appendChild(script)

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://link.brandbloom.org/js/form_embed.js"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  // Smooth scroll to calendar section
  const scrollToCalendar = () => {
    const calendarSection = document.getElementById('calendar-section')
    if (calendarSection) {
      calendarSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen -mt-[56px]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="medicalGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="hsl(var(--color-coral))"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
                <circle cx="30" cy="30" r="1" fill="hsl(var(--color-coral))" opacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#medicalGrid)" />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 pt-14">
          <div
            className="relative min-h-screen flex items-center justify-center text-center"
            style={{
              backgroundImage: `url('/images/backgrounds/available-test.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/30" />
            
            <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
              {/* Main Heading */}
              <h1 className="mb-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                <span 
                  className="block text-white mb-4"
                  style={{
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    textShadow: '2px 2px 10px rgba(0, 0, 0, 0.7)',
                  }}
                >
                  COMPREHENSIVE LABORATORY
                </span>
                <span 
                  className="block text-coral"
                  style={{
                    letterSpacing: '5px',
                    textTransform: 'uppercase',
                    textShadow: '2px 2px 10px rgba(0, 0, 0, 0.7)',
                  }}
                >
                  {word1}
                  <motion.span
                    className="inline-block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1, delay: (text1.length + text2.length) * 0.1 }}
                  >
                    &nbsp;
                  </motion.span>
                  {word2}
                </span>
              </h1>

              {/* Subtitle */}
              <motion.p
                className="mx-auto max-w-4xl text-xl sm:text-2xl md:text-3xl text-white leading-relaxed mb-12"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: (text1.length + text2.length) * 0.1 + 0.5,
                  type: 'spring',
                  stiffness: 80,
                }}
                style={{
                  textShadow: '1px 1px 5px rgba(0, 0, 0, 0.5)',
                }}
              >
                We bring expert medical testing to your doorstep. From routine screenings to
                specialized tests, our mobile lab delivers fast, accurate results with
                state-of-the-art technology and certified professionals.
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: (text1.length + text2.length) * 0.1 + 1,
                }}
              >
                <button
                  onClick={scrollToCalendar}
                  className="inline-flex items-center justify-center gap-3 bg-coral hover:bg-coral/90 text-white text-lg font-bold px-10 py-4 rounded-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-coral/25"
                  style={{
                    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <Calendar className="w-6 h-6" />
                  BOOK YOUR TEST NOW
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Navbar />

      {/* Calendar Booking Section */}
      <section 
        id="calendar-section"
        className="relative py-20 bg-gradient-to-br from-gray-50 to-white dark:from-[#1a252f] dark:to-[#25303f] transition-colors duration-300"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="bookingGrid" width="80" height="80" patternUnits="userSpaceOnUse">
                <rect
                  width="80"
                  height="80"
                  fill="none"
                  stroke="hsl(var(--color-coral))"
                  strokeWidth="0.3"
                  opacity="0.4"
                />
                <circle cx="40" cy="40" r="2" fill="hsl(var(--color-coral))" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bookingGrid)" />
          </svg>
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Schedule Your <span className="text-coral">Lab Test</span>
            </h2>
            <p className={cn(
              'text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed',
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
            )}>
              Choose your preferred date and time for mobile laboratory services. 
              Our certified professionals will come to your location with all necessary equipment.
            </p>
          </div>

          {/* Calendar Container */}
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Calendar Header */}
              <div className="bg-gradient-to-r from-coral to-coral/80 text-white p-6">
                <h3 className="text-2xl font-bold text-center">Select Your Appointment</h3>
                <p className="text-center text-coral-100 mt-2">Mobile lab services • Same-day results available</p>
              </div>
              
              {/* Calendar Iframe */}
              <div style={{ minHeight: '650px' }}>
                <iframe 
                  src="https://link.brandbloom.org/widget/booking/F06h1x3q4vC0Zz9z9FPC" 
                  style={{ 
                    width: '100%',
                    height: '650px',
                    border: 'none',
                    overflow: 'hidden',
                  }} 
                  scrolling="no" 
                  id="F06h1x3q4vC0Zz9z9FPC_1757834116491"
                  title="Schedule Your Lab Test"
                />
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-coral/10 dark:bg-coral/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-coral" />
              </div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Same-Day Availability</h4>
              <p className="text-gray-600 dark:text-gray-300">Flexible scheduling with same-day and next-day appointments available</p>
            </div>
            
            <div className="text-center">
              <div className="bg-coral/10 dark:bg-coral/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 text-coral font-bold text-xl">🏠</div>
              </div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Mobile Service</h4>
              <p className="text-gray-600 dark:text-gray-300">We come to your home, office, or preferred location</p>
            </div>
            
            <div className="text-center">
              <div className="bg-coral/10 dark:bg-coral/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 text-coral font-bold text-xl">⚡</div>
              </div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Fast Results</h4>
              <p className="text-gray-600 dark:text-gray-300">CLIA-certified lab results delivered within 24-48 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="relative py-20 bg-white dark:bg-[#25303f] transition-colors duration-300">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Need Help or Have Questions?
            </h2>
            <p className={cn(
              'text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed',
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
            )}>
              Our team is here to assist you with any questions about our testing services, 
              scheduling, or results. Get in touch with us directly.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 bg-coral hover:bg-coral/90 text-white text-lg font-bold px-8 py-4 rounded-lg shadow-xl transition-all duration-300 hover:scale-105"
              >
                CONTACT US
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="tel:+1234567890"
                className="inline-flex items-center justify-center gap-3 border-2 border-coral text-coral hover:bg-coral hover:text-white text-lg font-bold px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105"
              >
                CALL NOW
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}