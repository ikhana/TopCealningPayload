// src/components/Header/PromotionalBanner.tsx

'use client'

import {
  Facebook,
  Heart,
  Instagram,
  Mail,
  Phone,
  Search,
  ShoppingCart,
  Twitter,
  User
} from 'lucide-react'
import Link from 'next/link'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/CMSLink'

type SocialLinks = {
  facebook?: string
  instagram?: string
  twitter?: string
  pinterest?: string
}

type TopBarAction = {
  icon: 'user' | 'search' | 'heart' | 'cart' | 'phone' | 'email'
  link: string
  label: string
}

type PromotionalBannerProps = {
  enabled?: boolean
  content?: any
  cta?: {
    link?: any
  }
  socialLinks?: SocialLinks
  topBarActions?: TopBarAction[]
}

const iconMap = {
  user: User,
  search: Search,
  heart: Heart,
  cart: ShoppingCart,
  phone: Phone,
  email: Mail,
}

export function PromotionalBanner({
  enabled = false,
  content,
  cta,
  socialLinks,
  topBarActions = []
}: PromotionalBannerProps) {
  
  if (!enabled || !content) {
    return null
  }

  const hasButton = cta?.link && (cta.link.url || cta.link.reference)

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] w-full py-2 sm:py-3 border-b border-border bg-primary/95 dark:bg-primary/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {socialLinks?.facebook && (
              <Link 
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" strokeWidth={2.5} />
              </Link>
            )}
            
            {socialLinks?.instagram && (
              <Link 
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" strokeWidth={2.5} />
              </Link>
            )}
            
            {socialLinks?.twitter && (
              <Link 
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" strokeWidth={2.5} />
              </Link>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center gap-4 min-w-0">
            <div className="text-sm sm:text-base font-semibold font-body tracking-wide text-center uppercase text-primary-foreground">
              <RichText 
                data={content} 
                enableGutter={false} 
                enableProse={false}
                className="inline"
              />
            </div>
            
            {hasButton && (
              <>
                <span className="hidden sm:inline text-base font-semibold text-primary-foreground/70">—</span>
                
                <CMSLink 
                  link={cta.link}
                  className="text-sm sm:text-base font-bold font-body tracking-wide uppercase transition-all duration-300 underline hover:no-underline hover:scale-105 text-primary-foreground hover:text-primary-foreground/80 whitespace-nowrap"
                >
                  {cta.link.label || 'Learn More'}
                </CMSLink>
              </>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {topBarActions && topBarActions.length > 0 && topBarActions.map((action, index) => {
              if (!action || !action.icon || !action.link || !action.label) return null
              const IconComponent = iconMap[action.icon]
              if (!IconComponent) return null
              
              return (
                <Link 
                  key={index}
                  href={action.link}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                  aria-label={action.label}
                >
                  <IconComponent className="w-5 h-5" strokeWidth={2.5} />
                </Link>
              )
            })}
          </div>

          {hasButton && (
            <div className="flex sm:hidden">
              <CMSLink 
                link={cta.link}
                className="text-xs font-bold font-body tracking-wide uppercase transition-all duration-300 underline hover:no-underline text-primary-foreground hover:text-primary-foreground/80 whitespace-nowrap"
              >
                {cta.link.label || 'Learn More'}
              </CMSLink>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}