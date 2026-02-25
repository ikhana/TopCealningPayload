'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollToHash() {
  const pathname = usePathname()

  useEffect(() => {
    // Check if there's a hash in the URL
    const hash = window.location.hash

    if (hash) {
      // Remove the # to get the element ID
      const elementId = hash.substring(1)
      
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(elementId)
        
        if (element) {
          const headerOffset = 100 // Adjust based on your fixed header height
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          })
        }
      }, 100)
    }
  }, [pathname])

  return null
}