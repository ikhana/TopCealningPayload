// src/components/Header/PromotionalBanner.tsx
// Utility bar with two display modes:
//   • Mobile (< sm): infinite horizontal ticker — all contact info scrolls
//   • Desktop (sm+): static layout — left contact | centre badge | right socials

'use client'

import { useState } from 'react'

type SocialLinks = {
  facebook?:  string
  instagram?: string
  tiktok?:    string
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

// Diamond separator used between ticker items
const Sep = () => (
  <span aria-hidden className="mx-4 text-white/30">◆</span>
)

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

  const hasSocials = socialLinks?.facebook || socialLinks?.instagram || socialLinks?.tiktok || socialLinks?.twitter

  // Build the ticker items once — duplicated for seamless loop
  const tickerItems = (
    <>
      {phone1 && (
        <>
          <a
            href={`tel:${phone1.replace(/\D/g, '')}`}
            className="text-white/90 hover:text-white transition-colors duration-200 no-underline whitespace-nowrap"
          >
            {phone1}
          </a>
          <Sep />
        </>
      )}
      {phone2 && (
        <>
          <a
            href={`tel:${phone2.replace(/\D/g, '')}`}
            className="text-white/90 hover:text-white transition-colors duration-200 no-underline whitespace-nowrap"
          >
            {phone2}
          </a>
          <Sep />
        </>
      )}
      {email && (
        <>
          <a
            href={`mailto:${email}`}
            className="text-white/90 hover:text-white transition-colors duration-200 no-underline whitespace-nowrap"
          >
            {email}
          </a>
          <Sep />
        </>
      )}
      {showStatus && statusText && (
        <>
          <span className="text-white font-bold whitespace-nowrap">{statusText}</span>
          <Sep />
        </>
      )}
    </>
  )

  return (
    <div className="w-full h-[46px] overflow-hidden font-mono text-[12.5px] tracking-[0.04em] relative bg-teal border-b border-white/[0.15]">

      {/* ── MOBILE: infinite horizontal ticker (hidden sm+) ── */}
      <div className="flex sm:hidden items-center h-full w-full overflow-hidden">
        <style>{`
          @keyframes util-ticker {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .util-ticker-track {
            display: flex;
            align-items: center;
            white-space: nowrap;
            animation: util-ticker 22s linear infinite;
            will-change: transform;
          }
          .util-ticker-track:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="util-ticker-track">
          {/* First set */}
          {tickerItems}
          {/* Duplicate for seamless loop */}
          {tickerItems}
        </div>
      </div>

      {/* ── DESKTOP: static layout (hidden below sm) ─────── */}
      <div className="hidden sm:flex items-center justify-between h-full w-full">

        {/* Left: contact info */}
        <div className="flex items-center gap-5 px-[5%]">
          {email && (
            <a
              href={`mailto:${email}`}
              className="hidden sm:block text-white/90 hover:text-white transition-colors duration-200 no-underline"
            >
              {email}
            </a>
          )}
          {phone1 && (
            <a
              href={`tel:${phone1.replace(/\D/g, '')}`}
              className="text-white/90 hover:text-white transition-colors duration-200 no-underline"
            >
              {phone1}
            </a>
          )}
          {phone2 && (
            <a
              href={`tel:${phone2.replace(/\D/g, '')}`}
              className="hidden md:block text-white/90 hover:text-white transition-colors duration-200 no-underline"
            >
              {phone2}
            </a>
          )}
        </div>

        {/* Centre: pulsing status badge */}
        {showStatus && statusText && (
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-[10px] py-[4px] font-bold text-[11px] text-white whitespace-nowrap border border-white/40 bg-white/[0.15]">
            <span
              className="w-[6px] h-[6px] rounded-full flex-shrink-0 animate-pulse bg-white"
              style={{ boxShadow: '0 0 8px rgba(255,255,255,0.6)' }}
            />
            {statusText}
          </div>
        )}

        {/* Right: social icons + close */}
        <div className="flex items-center gap-3 px-[5%]">
          {hasSocials && (
            <div className="flex items-center gap-3 pr-3 mr-1 border-r border-white/10">
              {socialLinks?.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex items-center text-white/80 hover:text-white transition-colors duration-200"
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
                  className="flex items-center text-white/80 hover:text-white transition-colors duration-200"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              )}
              {socialLinks?.tiktok && (
                <a
                  href={socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="flex items-center text-white/80 hover:text-white transition-colors duration-200"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
                  </svg>
                </a>
              )}
              {socialLinks?.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="flex items-center text-white/80 hover:text-white transition-colors duration-200"
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
    </div>
  )
}
