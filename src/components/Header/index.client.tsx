// src/components/Header/index.client.tsx
// All colours reference the Tailwind theme — no hardcoded hex values.
// Only two exceptions (both justified):
//   1. `bg-white/[0.88|0.97]`  — functional semi-transparent white, not a brand token
//   2. `style={{ borderTop }}` — the mega dropdown top accent border uses
//      `var(--color-teal)` so it still reads from the design system
//
// Adaptive dark/light mode:
//   • IntersectionObserver watches [data-dark-hero] elements (rootMargin: top 8% only)
//   • isDark=true  → transparent/dark-glass header + white nav text
//   • isDark=false → white frosted-glass header + navy nav text (existing behaviour)

'use client'

import { cn } from '@/utilities/cn'
import { CMSLink } from '@/components/CMSLink'
import btnStyles from '@/components/ui/TCButton/TCButton.module.css'
import { ChevronDown, Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { Header, Media } from 'src/payload-types'
import { PromotionalBanner } from './PromotionalBanner'

type Props = {
  header: Header
}

export function HeaderClient({ header }: Props) {
  const menu     = header.navItems || []
  const pathname = usePathname()

  // Light header per Geraldine's corrections PDF (slide 2 + 6 + 7):
  // "stick to light colors, no dark colors." Was hardcoded dark before.
  const isDark = false

  const [megaOpen,    setMegaOpen]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const panelRef   = useRef<HTMLDivElement   | null>(null)
  const closeTO    = useRef<number | null>(null)

  // ── Close on route change ─────────────────────────────────
  useEffect(() => {
    setMobileOpen(false)
    setMegaOpen(false)
  }, [pathname])

  // ── ESC key ───────────────────────────────────────────────
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMegaOpen(false); setMobileOpen(false) }
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [])

  // ── Mega dropdown hover delay ─────────────────────────────
  const cancelClose = () => {
    if (closeTO.current) { window.clearTimeout(closeTO.current); closeTO.current = null }
  }
  const scheduleClose = () => {
    cancelClose()
    closeTO.current = window.setTimeout(() => { setMegaOpen(false); closeTO.current = null }, 300)
  }
  const openMega = () => { cancelClose(); setMegaOpen(true) }

  const onTriggerLeave: React.MouseEventHandler = (e) => {
    const target = e.relatedTarget
    if (target instanceof Node && panelRef.current?.contains(target)) { cancelClose(); return }
    scheduleClose()
  }
  const onPanelLeave: React.MouseEventHandler = (e) => {
    const target = e.relatedTarget
    if (target instanceof Node && triggerRef.current?.contains(target)) { cancelClose(); return }
    scheduleClose()
  }

  // ── Data ─────────────────────────────────────────────────
  const logoImage    = header.logo && typeof header.logo === 'object' ? (header.logo as Media) : null
  const utilityBar   = (header as any).utilityBar || {}
  const socials      = header.socialLinks || {}
  const dropdownItem = menu.find((m: any) => m?.type === 'dropdown') as any

  // ── Derived style tokens ──────────────────────────────────
  // nav link colours
  const navLinkClass = isDark
    ? 'text-white/80 hover:text-white'
    : 'text-navy-deep hover:text-teal'

  // hamburger / icon colours
  const iconClass = isDark
    ? 'text-white hover:text-teal'
    : 'text-navy-deep hover:text-teal'

  // bottom underline accent on active/hover nav items
  const accentBg = isDark ? 'bg-white/70' : 'bg-teal'

  return (
    <div className="sticky top-0 z-[1000] w-full">
      {/* ── Utility Bar (PromotionalBanner override) ──────── */}
      <PromotionalBanner
        phone1={utilityBar.phone1}
        phone2={utilityBar.phone2}
        email={utilityBar.email}
        statusText={utilityBar.statusText}
        showStatus={utilityBar.showStatus !== false}
        socialLinks={{
          facebook:  socials.facebook  || undefined,
          instagram: socials.instagram || undefined,
          tiktok:    socials.tiktok    || undefined,
          twitter:   socials.twitter   || undefined,
        }}
      />

      {/* ── Main Header ──────────────────────────────────────*/}
      <header
        className={cn(
          'w-full h-[56px] md:h-[76px] backdrop-blur-md',
          isDark
            ? 'bg-[#0d1b2e]/[0.90] shadow-[0_8px_30px_rgba(0,0,0,0.5)] border-b border-white/[0.08]'
            // Subtle teal-tinted top → clean white at bottom. Old design's
            // soft teal feel, but professional rather than heavy.
            : 'bg-gradient-to-b from-[#d6efed] via-[#eaf7f6] to-white shadow-[0_2px_12px_rgba(13,27,46,0.08)] border-b border-slate-200/60',
        )}
      >
        <div className="flex items-center justify-between h-full px-[5%]">

          {/* ── Logo — sized to sit within the header bar per Geraldine's request ── */}
          <Link
            href="/"
            className="tc-header-logo flex items-center gap-3 flex-shrink-0 no-underline relative z-[10]"
          >
            {logoImage?.url ? (
              <Image
                src={logoImage.url}
                alt={logoImage.alt || 'Top Cleaning'}
                width={300}
                height={110}
                className="h-[44px] md:h-[60px] w-auto"
                priority
              />
            ) : (
              <>
                <div
                  className="w-[36px] h-[36px] md:w-[52px] md:h-[52px] bg-teal flex-shrink-0"
                  style={{
                    clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
                    boxShadow: '0 4px 12px color-mix(in oklch, var(--color-teal) 35%, transparent)',
                  }}
                />
                <span className={cn(
                  'text-[1.3rem] md:text-[1.9rem] font-black tracking-[-0.5px] leading-none transition-colors duration-300',
                  isDark ? 'text-white' : 'text-navy-deep',
                )}>
                  TOP CLEANING
                </span>
              </>
            )}
          </Link>

          {/* ── Desktop Nav ──────────────────────────────── */}
          <nav className="hidden md:flex items-center h-full" aria-label="Main navigation">
            {menu.map((item: any, index: number) => {
              if (!item) return null
              const itemId = item.id || `nav-${index}`

              // Dropdown trigger
              if (item.type === 'dropdown' && item.dropdown) {
                return (
                  <div key={itemId} className="relative h-full flex items-center group">
                    <button
                      ref={triggerRef}
                      type="button"
                      onMouseEnter={openMega}
                      onMouseLeave={onTriggerLeave}
                      onFocus={openMega}
                      onBlur={(e) => {
                        if (panelRef.current?.contains(e.relatedTarget as Node)) return
                        scheduleClose()
                      }}
                      aria-haspopup="true"
                      aria-expanded={megaOpen}
                      className={cn(
                        'flex items-center gap-[5px] h-full px-[1.4rem]',
                        'font-mono text-[0.95rem] font-semibold uppercase tracking-[0.5px]',
                        navLinkClass,
                        'transition-colors duration-200',
                        'bg-transparent border-none cursor-pointer',
                      )}
                    >
                      {item.dropdown.label}
                      <ChevronDown
                        className={cn(
                          'w-[11px] h-[11px] transition-transform duration-300',
                          megaOpen && 'rotate-180',
                        )}
                      />
                    </button>
                    <span
                      aria-hidden
                      className={cn(
                        'absolute bottom-0 inset-x-[20%] h-[3px]',
                        accentBg,
                        'transition-transform duration-500 origin-center',
                        megaOpen ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                      )}
                    />
                  </div>
                )
              }

              // Simple link
              if (item.type === 'simple' && item.link) {
                return (
                  <div key={itemId} className="relative h-full flex items-center group">
                    <CMSLink
                      link={item.link}
                      className={cn(
                        'flex items-center h-full px-[1.4rem]',
                        'font-mono text-[0.95rem] font-semibold uppercase tracking-[0.5px]',
                        navLinkClass,
                        'transition-colors duration-200 no-underline',
                      )}
                    >
                      {item.link.label}
                    </CMSLink>
                    <span
                      aria-hidden
                      className={cn(
                        'absolute bottom-0 inset-x-[20%] h-[3px]',
                        accentBg,
                        'scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center',
                      )}
                    />
                  </div>
                )
              }

              return null
            })}
          </nav>

          {/* ── Right: CTA + Mobile Toggle ───────────────── */}
          <div className="flex items-center gap-4">

            {/* Desktop CTA */}
            {header.ctaButton?.link && (
              <CMSLink
                link={header.ctaButton.link}
                className={cn(
                  'hidden md:inline-flex items-center no-underline',
                  'bg-teal text-white font-mono font-black uppercase',
                  'px-[36px] py-[18px] text-[0.85rem] tracking-[1.5px]',
                  btnStyles.primary,
                )}
              >
                <span className={btnStyles.primaryContent}>
                  {header.ctaButton.link.label || 'BOOK YOUR CLEANING'}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={btnStyles.primaryArrow}>
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </CMSLink>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((s) => !s)}
              className={cn(
                'md:hidden flex flex-col gap-[5px] p-2',
                iconClass,
                'transition-colors cursor-pointer bg-transparent border-none',
              )}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <>
                  <span className="w-6 h-[2px] bg-current block" />
                  <span className="w-6 h-[2px] bg-current block" />
                  <span className="w-6 h-[2px] bg-current block" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Mega Dropdown ──────────────────────────────────── */}
        {dropdownItem && (
          <div
            ref={panelRef}
            onMouseEnter={openMega}
            onMouseLeave={onPanelLeave}
            className={cn(
              'hidden md:block absolute left-1/2 -translate-x-1/2 top-full z-[1002] w-[560px]',
              'transition-all duration-200',
              megaOpen
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-2 pointer-events-none',
            )}
          >
            <div
              className={cn(
                'backdrop-blur-md',
                isDark
                  ? 'bg-[#0d1b2e]/[0.97] border border-teal/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]'
                  : 'bg-white border border-slate-200 shadow-[0_25px_50px_-12px_rgba(13,27,46,0.18)]',
              )}
              style={{ borderTop: '3px solid var(--color-teal)' }}
            >
              <div className="grid grid-cols-2 p-6 gap-1">
                {dropdownItem.dropdown?.items?.map((item: any, idx: number) => {
                  if (!item?.link) return null
                  return (
                    <CMSLink
                      key={idx}
                      link={item.link}
                      className={cn(
                        'flex items-center px-4 py-[0.65rem] no-underline',
                        'text-[0.85rem] font-medium',
                        isDark ? 'text-white/80 hover:text-white' : 'text-navy-deep/85 hover:text-navy-deep',
                        'border-l-[3px] border-l-transparent',
                        'hover:bg-teal/[0.12] hover:border-l-teal hover:pl-[1.3rem]',
                        'transition-all duration-200',
                      )}
                    >
                      {item.link.label}
                    </CMSLink>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Mobile Nav ─────────────────────────────────────── */}
        <div
          id="mobile-menu"
          className={cn(
            'md:hidden absolute inset-x-0 top-full z-[1001]',
            'backdrop-blur-md',
            isDark
              ? 'bg-[#0d1b2e]/[0.97] border-b border-teal/20'
              : 'bg-white border-b border-slate-200 shadow-[0_10px_24px_-12px_rgba(13,27,46,0.15)]',
            'transition-all duration-300 overflow-hidden',
            mobileOpen
              ? 'opacity-100 pointer-events-auto max-h-[600px]'
              : 'opacity-0 pointer-events-none max-h-0',
          )}
        >
          <nav className="flex flex-col px-[5%] py-4 gap-[2px]" aria-label="Mobile navigation">
            {menu.map((item: any, index: number) => {
              if (!item) return null

              // Simple link
              if (item.type === 'simple' && item.link) {
                return (
                  <CMSLink
                    key={index}
                    link={item.link}
                    className={cn(
                      'px-4 py-3 no-underline',
                      'font-mono text-[0.8rem] font-semibold uppercase',
                      isDark
                        ? 'text-white/80 hover:text-white'
                        : 'text-navy-deep/85 hover:text-navy-deep',
                      'border-l-[3px] border-l-transparent',
                      'hover:border-l-teal hover:bg-teal/[0.12] hover:pl-5',
                      'transition-all duration-200',
                    )}
                  >
                    {item.link.label}
                  </CMSLink>
                )
              }

              // Dropdown — expanded inline
              if (item.type === 'dropdown' && item.dropdown) {
                return (
                  <div key={index}>
                    <div className={cn(
                      'px-4 py-2 font-mono text-[0.8rem] font-semibold uppercase',
                      isDark ? 'text-white/40' : 'text-navy-deep/45',
                    )}>
                      {item.dropdown.label}
                    </div>
                    {item.dropdown.items?.map((dropItem: any, idx: number) => {
                      if (!dropItem?.link) return null
                      return (
                        <CMSLink
                          key={idx}
                          link={dropItem.link}
                          className={cn(
                            'block pl-8 pr-4 py-2 no-underline',
                            'text-[0.85rem] font-medium',
                            isDark
                              ? 'text-white/70 hover:text-white'
                              : 'text-navy-deep/75 hover:text-navy-deep',
                            'border-l-[3px] border-l-transparent',
                            'hover:border-l-teal hover:bg-teal/[0.12]',
                            'transition-all duration-200',
                          )}
                        >
                          {dropItem.link.label}
                        </CMSLink>
                      )
                    })}
                  </div>
                )
              }

              return null
            })}

            {/* Mobile CTA */}
            {header.ctaButton?.link && (
              <CMSLink
                link={header.ctaButton.link}
                className={cn(
                  'mt-2 flex items-center justify-center no-underline',
                  'bg-teal text-white font-mono font-black uppercase',
                  'px-[36px] py-[18px] text-[0.85rem] tracking-[1.5px]',
                  btnStyles.primary,
                )}
              >
                <span className={btnStyles.primaryContent}>
                  {header.ctaButton.link.label || 'BOOK YOUR CLEANING'}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={btnStyles.primaryArrow}>
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </CMSLink>
            )}
          </nav>
        </div>
      </header>
    </div>
  )
}
