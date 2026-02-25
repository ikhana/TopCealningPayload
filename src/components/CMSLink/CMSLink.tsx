// src/components/CMSLink/CMSLink.tsx

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import type { Page } from '@/payload-types'

type LinkType = {
  type?: 'reference' | 'custom' | 'anchor' | null
  label?: string | null
  reference?: {
    relationTo?: string
    value: string | number | Page | { slug: string }
  } | null
  url?: string | null
  anchor?: string | null
  anchorPage?: {
    relationTo?: string
    value: string | number | Page | { slug: string }
  } | null
  newTab?: boolean | null
  appearance?: 'default' | 'outline' | null
}

type CMSLinkProps = {
  link?: LinkType | null
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

export function CMSLink({ link, className, children, onClick }: CMSLinkProps) {
  const pathname = usePathname()
  
  if (!link) return null

  const getHref = () => {
    switch (link.type) {
      case 'reference': {
        const refValue = link.reference?.value
        
        if (typeof refValue === 'string') {
          return refValue
        }
        
        if (typeof refValue === 'number') {
          return `/${refValue}`
        }
        
        if (refValue && typeof refValue === 'object' && 'slug' in refValue) {
          return `/${refValue.slug}`
        }
        
        return '#'
      }

      case 'custom':
        return link.url || '#'

      case 'anchor': {
        const anchorId = link.anchor || ''
        
        // Cross-page anchor: /page#section
        if (link.anchorPage?.value) {
          const pageValue = link.anchorPage.value
          let pageSlug: string = ''
          
          if (typeof pageValue === 'string') {
            pageSlug = pageValue
          } else if (typeof pageValue === 'object' && 'slug' in pageValue) {
            pageSlug = pageValue.slug || ''
          }
          
          return pageSlug ? `/${pageSlug}#${anchorId}` : `#${anchorId}`
        }
        
        // Same-page anchor: #section
        return `#${anchorId}`
      }

      default:
        return '#'
    }
  }

  const href = getHref()

  const scrollToElement = (elementId: string) => {
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
  }

  // Check if anchor link points to current page
  const isCurrentPage = (linkHref: string) => {
    const linkPath = linkHref.split('#')[0] // Get path without hash
    const currentPath = pathname || '/'
    
    // Normalize paths (remove trailing slashes)
    const normalizedLinkPath = linkPath.replace(/\/$/, '') || '/'
    const normalizedCurrentPath = currentPath.replace(/\/$/, '') || '/'
    
    return normalizedLinkPath === normalizedCurrentPath
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick()

    // Handle anchor scrolling
    if (link.type === 'anchor' && link.anchor) {
      // Check if it's same page (no anchorPage OR anchorPage is current page)
      const isSamePage = !link.anchorPage?.value || isCurrentPage(href)
      
      if (isSamePage) {
        // Same-page anchor scrolling
        e.preventDefault()
        scrollToElement(link.anchor)
        
        // Update URL hash without triggering navigation
        window.history.pushState(null, '', `#${link.anchor}`)
        return
      }
      
      // Cross-page anchor navigation
      // Let Next.js handle the navigation naturally, 
      // HashScrollHandler will handle the scrolling
    }
  }

  // External URLs
  if (link.type === 'custom') {
    const isExternal = link.url?.startsWith('http')
    
    if (isExternal) {
      return (
        <a
          href={href}
          target={link.newTab ? '_blank' : '_self'}
          rel={link.newTab ? 'noopener noreferrer' : undefined}
          className={className}
          onClick={onClick}
        >
          {children || link.label}
        </a>
      )
    }
  }

  // Internal links
  return (
    <Link 
      href={href} 
      onClick={handleClick} 
      className={className}
      scroll={false}
    >
      {children || link.label}
    </Link>
  )
}