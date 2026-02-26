// src/components/Header/index.client.tsx
// All colours reference the Tailwind theme — no hardcoded hex values.
// Only two exceptions (both justified):
//   1. `bg-white/[0.88|0.97]`  — functional semi-transparent white, not a brand token
//   2. `style={{ borderTop }}` — the mega dropdown top accent border uses
//      `var(--color-teal)` so it still reads from the design system

'use client'

import { cn } from '@/utilities/cn'
import { CMSLink } from '@/components/CMSLink'
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

  const [scrolled,    setScrolled]    = useState(false)
  const [megaOpen,    setMegaOpen]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const panelRef   = useRef<HTMLDivElement   | null>(null)
  const closeTO    = useRef<number | null>(null)

  // ── Scroll shrink: 80px → 68px ───────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
    if (panelRef.current?.contains(e.relatedTarget as Node)) { cancelClose(); return }
    scheduleClose()
  }
  const onPanelLeave: React.MouseEventHandler = (e) => {
    if (triggerRef.current?.contains(e.relatedTarget as Node)) { cancelClose(); return }
    scheduleClose()
  }

  // ── Data ─────────────────────────────────────────────────
  const logoImage    = header.logo && typeof header.logo === 'object' ? (header.logo as Media) : null
  const utilityBar   = (header as any).utilityBar || {}
  const socials      = header.socialLinks || {}
  const dropdownItem = menu.find((m: any) => m?.type === 'dropdown') as any

  return (
    <>
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
          twitter:   socials.twitter   || undefined,
        }}
      />

      {/* ── Sticky Main Header ───────────────────────────────*/}
      <header
        className={cn(
          'sticky top-0 z-[1000] w-full',
          'border-b border-teal/20',
          'transition-all duration-300',
          scrolled
            ? 'h-[68px] bg-white/[0.97] shadow-[0_8px_30px_rgba(0,0,0,0.09)]'
            : 'h-20    bg-white/[0.88] backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.04)]',
        )}
      >
        <div className="flex items-center justify-between h-full px-[5%]">

          {/* ── Logo ─────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 no-underline">
            {logoImage?.url ? (
              <Image
                src={logoImage.url}
                alt={logoImage.alt || 'Top Cleaning'}
                width={160}
                height={44}
                className="h-11 w-auto"
                priority
              />
            ) : (
              <>
                <div
                  className="w-[30px] h-[30px] bg-teal flex-shrink-0"
                  style={{
                    clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
                    boxShadow: '0 4px 12px color-mix(in oklch, var(--color-teal) 35%, transparent)',
                  }}
                />
                <span className="text-[1.3rem] font-black text-navy-deep tracking-[-0.5px] leading-none">
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
                        'font-mono text-[0.8rem] font-semibold uppercase tracking-[0.5px]',
                        'text-navy-deep hover:text-teal transition-colors duration-200',
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
                        'absolute bottom-0 inset-x-[20%] h-[3px] bg-teal',
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
                        'font-mono text-[0.8rem] font-semibold uppercase tracking-[0.5px]',
                        'text-navy-deep hover:text-teal transition-colors duration-200 no-underline',
                      )}
                    >
                      {item.link.label}
                    </CMSLink>
                    <span
                      aria-hidden
                      className="absolute bottom-0 inset-x-[20%] h-[3px] bg-teal scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"
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
                  'px-[1.6rem] py-[0.85rem]',
                  'bg-teal text-primary-foreground',
                  'font-mono font-bold text-[0.75rem] uppercase tracking-[1px]',
                  'transition-all duration-300',
                  'hover:bg-navy-deep hover:-translate-y-[2px]',
                )}
                style={{
                  ['--tw-shadow' as any]: '0 8px 20px color-mix(in oklch, var(--color-teal) 30%, transparent)',
                }}
              >
                {header.ctaButton.link.label || 'BOOK YOUR CLEANING'}
              </CMSLink>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((s) => !s)}
              className="md:hidden flex flex-col gap-[5px] p-2 text-navy-deep hover:text-teal transition-colors cursor-pointer bg-transparent border-none"
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
              'absolute left-1/2 -translate-x-1/2 top-full z-[1002] w-[560px]',
              'transition-all duration-200',
              megaOpen
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-2 pointer-events-none',
            )}
          >
            <div
              className="bg-background border border-teal/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.14)]"
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
                        'text-[0.85rem] font-medium text-foreground',
                        'border-l-[3px] border-l-transparent',
                        'hover:bg-teal-light hover:text-teal-dark hover:border-l-teal hover:pl-[1.3rem]',
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
            'bg-background border-b border-teal/20',
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
                      'text-foreground border-l-[3px] border-l-transparent',
                      'hover:text-teal hover:border-l-teal hover:bg-teal-light hover:pl-5',
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
                    <div className="px-4 py-2 font-mono text-[0.8rem] font-semibold uppercase text-muted-foreground">
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
                            'text-[0.85rem] font-medium text-foreground',
                            'border-l-[3px] border-l-transparent',
                            'hover:text-teal hover:border-l-teal hover:bg-teal-light',
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
                  'mt-2 px-4 py-[0.9rem] text-center no-underline',
                  'font-mono font-bold text-[0.8rem] uppercase tracking-[1px]',
                  'bg-teal text-primary-foreground',
                  'hover:bg-navy-deep transition-colors duration-200',
                )}
              >
                {header.ctaButton.link.label || 'BOOK YOUR CLEANING'}
              </CMSLink>
            )}
          </nav>
        </div>
      </header>
    </>
  )
}
