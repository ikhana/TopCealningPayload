// src/components/HashScrollHandler/HashScrollHandler.tsx

'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function HashScrollHandler() {
  const pathname = usePathname()

  useEffect(() => {
    // Check if there's a hash in the URL
    const hash = window.location.hash

    if (hash) {
      // Remove the # symbol
      const elementId = hash.substring(1)
      
      // Small delay to ensure the page has rendered
      setTimeout(() => {
        const targetElement = document.getElementById(elementId)
        
        if (targetElement) {
          const headerOffset = 100
          const elementPosition = targetElement.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          })
        }
      }, 100)
    }
  }, [pathname]) // Re-run when pathname changes

  return null
}