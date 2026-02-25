// src/app/(app)/find-stores/page.tsx
import { StoreLocator } from '@/components/StoreLocator'
import { TypewriterHero } from '@/heros/TypewriterHero'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Find Buford in Stores | Charcoal & Bourbon Heritage',
  description: 'Locate authorized dealers and premium retailers carrying Buford luxury cigar accessories and bourbon tasting boards near you.',
}

export default function FindStoresPage() {
  // TypewriterHero configuration for store locator
  const heroProps = {
    type: 'typewriter' as const,
    typewriterHeadline: 'Ready to ',
    typewriterPhrases: [
      { phrase: 'find your local dealer.' },
      { phrase: 'locate premium retailers.' },
      { phrase: 'discover nearby stores.' },
      { phrase: 'connect with stockists.' },
      { phrase: 'visit authorized dealers.' },
      { phrase: 'explore retail partners.' },
      { phrase: 'shop at select boutiques.' },
      { phrase: 'find specialty stores.' },
      { phrase: 'locate cigar lounges.' },
      { phrase: 'discover premium outlets.' },
    ],
    // Mock media object structure that matches Payload's Media type
    typewriterBackground: {
      id: 1,
      url: '/shop-hero-bg.jpg',
      alt: 'Luxury cigar accessories retail store interior',
      filename: 'shop-hero-bg.jpg',
      mimeType: 'image/jpeg',
      filesize: 0,
      width: 1920,
      height: 1080,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    typewriterOverlayStrength: 'medium' as const,
    typewriterTypingSpeed: 140,
    typewriterPauseTime: 2800,
  }

  return (
    <div className="min-h-screen">
      {/* TypewriterHero Section */}
      <TypewriterHero {...heroProps} />
      
      {/* Store Locator Section */}
      <StoreLocator />
    </div>
  )
}