// src/components/Header/PromotionalBanner.tsx
// Overridden as the Utility Bar — all colours come from the Tailwind theme.
// The original promotionalBanner Payload field is preserved in Header.ts
// for future use; this component now reads from header.utilityBar instead.

'use client'

import { useState } from 'react'

type SocialLinks = {
  facebook?:  string
  instagram?: string
  twitter?:   string
  pinterest?: string
}

type UtilityBarProps = {
  phone1?:     string
  phone2?:     string
  email?:      string
  statusText?: string
  showStatus?: boolean
  socialLinks?: SocialLinks
}

export function PromotionalBanner({
  phone1,
  phone2,
  email,
  statusText = 'NOW SERVICING YOUR AREA',
  showStatus = true,
  socialLinks,
}: UtilityBarProps) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  const hasSocials = socialLinks?.facebook || socialLinks?.instagram || socialLinks?.twitter

  return (
    <div className="w-full h-10 flex items-center justify-between overflow-hidden font-mono text-[11px] tracking-[0.05em] relative z-[1001] bg-navy-deep border-b border-white/[0.08]">

      {/* ── Left: contact info ─────────────────────────────── */}
      <div className="flex items-center gap-5 px-[5%]">
        {email && (
          <a
            href={`mailto:${email}`}
            className="hidden sm:block text-white/65 hover:text-teal transition-colors duration-200 no-underline"
          >
            {email}
          </a>
        )}
        {phone1 && (
          <a
            href={`tel:${phone1.replace(/\D/g, '')}`}
            className="text-white/65 hover:text-teal transition-colors duration-200 no-underline"
          >
            {phone1}
          </a>
        )}
        {phone2 && (
          <a
            href={`tel:${phone2.replace(/\D/g, '')}`}
            className="hidden md:block text-white/65 hover:text-teal transition-colors duration-200 no-underline"
          >
            {phone2}
          </a>
        )}
      </div>

      {/* ── Centre: pulsing status badge ───────────────────── */}
      {showStatus && statusText && (
        <div
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-[10px] py-[3px] font-bold text-[10px] text-teal whitespace-nowrap border border-teal bg-teal/[0.12]"
        >
          <span
            className="w-[6px] h-[6px] rounded-full flex-shrink-0 animate-pulse bg-teal"
            style={{ boxShadow: '0 0 8px var(--color-teal)' }}
          />
          {statusText}
        </div>
      )}

      {/* ── Right: social icons + close ────────────────────── */}
      <div className="flex items-center gap-3 px-[5%]">
        {hasSocials && (
          <div className="flex items-center gap-3 pr-3 mr-1 border-r border-white/10">
            {socialLinks?.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex items-center text-white/50 hover:text-teal transition-colors duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            )}
            {socialLinks?.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex items-center text-white/50 hover:text-teal transition-colors duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            )}
            {socialLinks?.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="flex items-center text-white/50 hover:text-teal transition-colors duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
            )}
          </div>
        )}

        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss utility bar"
          className="flex items-center p-1 text-white/[0.45] hover:text-coral transition-colors duration-200 bg-transparent border-none cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )
}
