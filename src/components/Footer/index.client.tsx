// src/components/Footer/index.client.tsx - DISTINCTIVE DESIGN

'use client'

import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'
import Image from 'next/image'
import type { Footer, Media } from 'src/payload-types'
import { CMSLink } from '@/components/CMSLink'
import { FooterNewsletter } from './FooterNewsletter'

type Props = {
  footer: Footer
}

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
}

export function FooterClient({ footer }: Props) {
  const currentYear = new Date().getFullYear()
  const copyrightText = footer.copyright?.replace('{year}', currentYear.toString()) || `© ${currentYear} Mazco LLC. All rights reserved.`
  
  const logoImage = footer.logo && typeof footer.logo === 'object' ? (footer.logo as Media) : null
  const hasSocialLinks = Object.values(footer.socialLinks || {}).some(link => link)
  const hasNewsletter = footer.newsletter?.enabled ?? false

  return (
    <footer className="relative z-0 pt-20 pb-8 bg-background dark:bg-card">
      <div className="container">
        {/* Main Footer Grid with Distinctive Borders */}
        <div className="relative bg-background dark:bg-card p-8 md:p-12 mb-8">
          {/* Gradient Borders - Your Signature Style */}
          <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
          <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Company Info Section */}
            <div className="lg:col-span-4 space-y-6">
              {/* Logo with Border Accent */}
              <div className="relative inline-block">
                <div className="absolute -left-3 top-0 w-1 h-full bg-gradient-to-b from-primary via-primary/50 to-transparent" />
                <CMSLink 
                  link={{ 
                    type: 'reference', 
                    reference: { value: 'home' },
                    label: 'Home'
                  }}
                  className="inline-block"
                >
                  {logoImage?.url ? (
                    <Image
                      src={logoImage.url}
                      alt={logoImage.alt || 'Mazco LLC'}
                      width={160}
                      height={48}
                      className="h-12 w-auto"
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 border-2 border-primary bg-primary/5 flex items-center justify-center">
                        <div className="w-4 h-4 bg-primary" />
                      </div>
                      <span className="text-2xl font-bold text-primary tracking-tight font-heading uppercase">
                        Mazco LLC
                      </span>
                    </div>
                  )}
                </CMSLink>
              </div>

              {/* Tagline with Distinctive Styling */}
              {footer.tagline && (
                <div className="relative pl-3">
                  <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
                  <p className="text-sm text-muted-foreground leading-relaxed font-body">
                    {footer.tagline}
                  </p>
                </div>
              )}

              {/* Social Links - Geometric Style */}
              {hasSocialLinks && (
                <div className="flex items-center gap-3">
                  {Object.entries(footer.socialLinks || {}).map(([platform, url]) => {
                    if (!url) return null
                    const Icon = socialIcons[platform as keyof typeof socialIcons]
                    if (!Icon) return null
                    
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative w-10 h-10 flex items-center justify-center bg-background dark:bg-card group"
                        aria-label={platform}
                      >
                        {/* Gradient Borders on Social Icons */}
                        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                        
                        <Icon className="relative w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </a>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Navigation Sections - Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {footer.sections?.map((section, index) => (
                <div key={section.id || index} className="space-y-4">
                  {/* Section Title with Accent */}
                  <div className="relative inline-block">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 border border-primary bg-primary/10" />
                      <h3 className="font-bold text-primary font-heading uppercase text-xs tracking-widest">
                        {section.title}
                      </h3>
                    </div>
                    <div className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
                  </div>
                  
                  {/* Links */}
                  <ul className="space-y-3">
                    {section.links?.map((item, linkIndex) => (
                      <li key={item.id || linkIndex} className="group">
                        <CMSLink
                          link={item.link}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors font-body inline-flex items-center gap-2"
                        >
                          <span className="w-3 h-px bg-muted-foreground/30 group-hover:bg-primary group-hover:w-4 transition-all" />
                          {item.link?.label}
                        </CMSLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Newsletter - Distinctive Card */}
            {hasNewsletter && footer.newsletter && (
              <div className="lg:col-span-3">
                <div className="relative bg-background dark:bg-card p-6">
                  {/* Card Gradient Borders */}
                  <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                  <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                  <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                  <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                  
                  <div className="relative space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border-2 border-primary bg-primary/5 flex items-center justify-center">
                        <div className="w-3 h-3 bg-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-primary font-heading uppercase text-xs tracking-widest">
                          {footer.newsletter.title || 'Newsletter'}
                        </h3>
                        <div className="w-full h-px bg-gradient-to-r from-primary/40 to-transparent mt-1" />
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground font-body leading-relaxed">
                      {footer.newsletter.description || 'Subscribe to our newsletter'}
                    </p>
                    
                    <FooterNewsletter />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar - Legal & Copyright */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Copyright */}
          <p className="text-xs text-muted-foreground font-body uppercase tracking-wider order-2 md:order-1">
            {copyrightText}
          </p>

          {/* Legal Links */}
          {footer.legalLinks && footer.legalLinks.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 order-1 md:order-2">
              {footer.legalLinks.map((item, index) => (
                <CMSLink
                  key={item.id || index}
                  link={item.link}
                  className="relative text-xs text-muted-foreground hover:text-primary transition-colors font-body uppercase tracking-wider group"
                >
                  <span className="relative">
                    {item.link?.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
                  </span>
                </CMSLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}