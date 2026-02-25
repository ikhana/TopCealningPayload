// src/app/(app)/wholesale/page.tsx
import { WholesaleInquiry } from '@/components/Wholesale'
import { TypewriterHero } from '@/heros/TypewriterHero'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wholesale Partnership | Charcoal & Bourbon Heritage',
  description: 'Join our network of premium retailers. Become an authorized dealer for Buford luxury cigar accessories and bourbon tasting boards.',
}

export default function WholesalePage() {
  // TypewriterHero configuration for wholesale
 const heroProps = {
    type: 'typewriter' as const,
    typewriterHeadline: 'Ready to ',
    typewriterPhrases: [
      { phrase: 'become a dealer.' },
      { phrase: 'join our network.' },
      { phrase: 'partner with us.' },
      { phrase: 'carry our products.' },
      { phrase: 'expand your offerings.' },
      { phrase: 'grow your business.' },
      { phrase: 'serve connoisseurs.' },
      { phrase: 'offer premium goods.' },
      { phrase: 'elevate your store.' },
      { phrase: 'craft partnerships.' },
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
      
      {/* Wholesale Inquiry Section */}
      <WholesaleInquiry />
    </div>
  )
}