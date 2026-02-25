// src/components/Header/index.client.tsx - FINAL CLEAN VERSION

'use client'

import { useTheme } from '@/providers/Theme'
import { cn } from '@/utilities/cn'
import { ChevronDown, Moon, Sun, Menu, X } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { Header, Media } from 'src/payload-types'
import { BorderButton } from '@/components/ui/BorderButton/BorderButton'
import { PromotionalBanner } from './PromotionalBanner'
import { CMSLink } from '@/components/CMSLink'

type Props = {
  header: Header
}

const cx = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(' ')
const norm = (s: string) => (s ?? '').replace(/\/+$/, '')

function ActiveLink({
  link,
  children,
  className,
}: {
  link: any
  children: React.ReactNode
  className?: string
}) {
  const pathname = usePathname()
  
  // Get href for comparison
  const getHref = () => {
    if (!link) return '/'
    if (link.type === 'reference' && link.reference?.value) {
      const refValue = link.reference.value
      if (typeof refValue === 'string') return refValue
      if (typeof refValue === 'object' && 'slug' in refValue) return `/${refValue.slug}`
    }
    if (link.type === 'custom') return link.url || '/'
    if (link.type === 'anchor') {
      if (link.anchorPage?.value) {
        const pageValue = link.anchorPage.value
        let pageSlug = ''
        if (typeof pageValue === 'string') pageSlug = pageValue
        else if (typeof pageValue === 'object' && 'slug' in pageValue) pageSlug = pageValue.slug || ''
        return pageSlug ? `/${pageSlug}#${link.anchor}` : `#${link.anchor}`
      }
      return `#${link.anchor}`
    }
    return '/'
  }
  
  const href = getHref()
  const isActive = norm(pathname ?? '/') === norm(href.split('#')[0])
  
  return (
    <CMSLink
      link={link}
      className={cn(
        'text-xs md:text-md lg:text-lg font-semibold uppercase transition-colors',
        isActive
          ? 'text-primary'
          : 'text-muted-foreground hover:text-primary',
        className
      )}
    >
      {children}
    </CMSLink>
  )
}

export function HeaderClient({ header }: Props) {
  const menu = header.navItems || []
  const pathname = usePathname()
  const { setTheme } = useTheme()

  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  const CLOSE_DELAY = 300
  const closeTO = useRef<number | null>(null)

  const hasBanner = header.promotionalBanner?.enabled && header.promotionalBanner?.content

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
  }

  const cancelClose = () => {
    if (closeTO.current) {
      window.clearTimeout(closeTO.current)
      closeTO.current = null
    }
  }

  const scheduleClose = () => {
    cancelClose()
    closeTO.current = window.setTimeout(() => {
      setMegaOpen(false)
      closeTO.current = null
    }, CLOSE_DELAY)
  }

  const openMega = () => {
    cancelClose()
    setMegaOpen(true)
  }

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMegaOpen(false)
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [])

  useEffect(() => {
    if (mobileOpen) setMegaOpen(false)
  }, [mobileOpen])

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false)
    setMegaOpen(false)
  }, [pathname])

  const onTriggerLeave: React.MouseEventHandler = (e) => {
    const to = e.relatedTarget as Node | null
    if (to && panelRef.current?.contains(to)) {
      cancelClose()
      return
    }
    scheduleClose()
  }

  const onPanelLeave: React.MouseEventHandler = (e) => {
    const to = e.relatedTarget as Node | null
    if (to && triggerRef.current?.contains(to)) {
      cancelClose()
      return
    }
    scheduleClose()
  }

  const logoImage = header.logo && typeof header.logo === 'object' ? (header.logo as Media) : null

  return (
    <>
      {hasBanner && header.promotionalBanner && (
        <PromotionalBanner
          enabled={!!header.promotionalBanner.enabled}
          content={header.promotionalBanner.content}
          cta={header.promotionalBanner.cta}
          socialLinks={{
            facebook: header.socialLinks?.facebook || undefined,
            instagram: header.socialLinks?.instagram || undefined,
            twitter: header.socialLinks?.twitter || undefined,
            pinterest: header.socialLinks?.pinterest || undefined,
          }}
          topBarActions={(header.topBarActions || [])
            .filter((action): action is NonNullable<typeof action> => 
              action !== null && 
              action !== undefined &&
              !!action.icon && 
              !!action.link && 
              !!action.label
            )
            .map(action => ({
              icon: action.icon as 'user' | 'search' | 'heart' | 'cart' | 'phone' | 'email',
              link: action.link,
              label: action.label,
            }))}
        />
      )}

      <div className={cn(
        'relative',
        hasBanner ? 'mt-11' : ''
      )}>
        <header
          className={cx(
            'fixed container header-manage width-full left-1/2 -translate-x-1/2 z-50 w-full',
            'px-3 sm:px-4 py-3 bg-background dark:bg-card',
            megaOpen || mobileOpen ? 'rounded-b-none' : 'rounded-b-2xl',
            'shadow-sm',
            hasBanner ? 'top-11' : 'top-0'
          )}
        >
          <div className="flex items-center justify-between md:block md:items-start md:justify-start">
            <div className="flex items-center justify-between gap-2 md:gap-3 lg:gap-6">
              <CMSLink 
                link={{ 
                  type: 'reference', 
                  reference: { value: 'home' },
                  label: 'Home'
                }}
                className="inline-flex items-center"
              >
                {logoImage?.url ? (
                  <Image
                    src={logoImage.url}
                    alt={logoImage.alt || 'Mazco LLC'}
                    width={160}
                    height={44}
                    className="h-11 w-auto"
                    priority
                  />
                ) : (
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-primary tracking-tight">
                      MAZCO LLC
                    </span>
                  </div>
                )}
              </CMSLink>

              <nav className="hidden md:flex items-center gap-3 md:gap-3 lg:gap-4">
                {menu.map((item, index) => {
                  if (!item) return null

                  const itemAny = item as any
                  const itemId = item.id || `nav-${index}`

                  if (itemAny.type === 'dropdown' && itemAny.dropdown) {
                    const dropdown = itemAny.dropdown
                    return (
                      <button
                        key={itemId}
                        ref={triggerRef}
                        type="button"
                        onMouseEnter={openMega}
                        onMouseLeave={onTriggerLeave}
                        onFocus={openMega}
                        onBlur={(e) => {
                          const to = e.relatedTarget as Node | null
                          if (to && panelRef.current?.contains(to)) return
                          scheduleClose()
                        }}
                        aria-haspopup="true"
                        aria-expanded={megaOpen}
                        className="flex items-center gap-1 font-semibold text-xs md:text-md lg:text-lg uppercase text-muted-foreground hover:text-primary transition"
                      >
                        {dropdown.label}
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 transition-transform duration-300',
                            megaOpen && 'rotate-180'
                          )}
                        />
                      </button>
                    )
                  }

                  // Simple link - access itemAny.link directly
                  if (itemAny.type === 'simple' && itemAny.link) {
                    return (
                      <ActiveLink key={itemId} link={itemAny.link}>
                        {itemAny.link.label}
                      </ActiveLink>
                    )
                  }

                  return null
                })}
              </nav>

              <div className="hidden md:flex items-center gap-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Toggle theme"
                >
                  <Moon className="w-5 h-5 dark:hidden" />
                  <Sun className="w-5 h-5 hidden dark:inline-block" />
                </button>

                {header.ctaButton?.link && (
                  <CMSLink link={header.ctaButton.link}>
                    <BorderButton
                      text={header.ctaButton.link.label || 'Get Started'}
                      variant="filled"
                    />
                  </CMSLink>
                )}
              </div>
            </div>

            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label="Toggle theme"
              >
                <Moon className="w-5 h-5 dark:hidden" />
                <Sun className="w-5 h-5 hidden dark:inline-block" />
              </button>
              <button
                type="button"
                onClick={() => setMobileOpen((s) => !s)}
                className="text-muted-foreground hover:text-primary"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </button>
            </div>
          </div>

          <div
            ref={panelRef}
            onMouseEnter={openMega}
            onMouseLeave={onPanelLeave}
            className={cn(
              'absolute inset-x-0 top-full z-[60] transition-all duration-200',
              megaOpen
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-2 pointer-events-none'
            )}
          >
            <div className="rounded-t-none rounded-b-3xl border border-t-0 border-border bg-background dark:bg-card shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 md:p-8">
                <div className="md:col-span-5">
                  <div className="rounded-xl bg-primary text-primary-foreground p-6 md:p-7">
                    <h3 className="text-2xl font-semibold mb-2">
                      Strategic Financial Planning
                    </h3>
                    <p className="opacity-90 mb-6">
                      Comprehensive wealth management solutions tailored to your goals.
                    </p>
                    <div className="mt-6 space-y-3">
                      <CMSLink
                        link={{
                          type: 'reference',
                          reference: { value: { slug: 'services' } },
                          label: 'Explore Services'
                        }}
                        className="group inline-flex items-center gap-2 font-semibold"
                      >
                        Explore Services{' '}
                        <span className="transition group-hover:translate-x-0.5">→</span>
                      </CMSLink>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    {menu.find(m => m?.type === 'dropdown')?.dropdown?.items?.map((item: any, idx: number) => {
                      if (!item.link) return null
                      
                      return (
                        <CMSLink
                          key={idx}
                          link={item.link}
                          className="group flex items-start gap-3 rounded-lg p-2 -m-2 hover:bg-muted transition"
                        >
                          <div>
                            <h4 className="font-semibold text-primary">
                              {item.link.label}
                            </h4>
                            {item.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </CMSLink>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            id="mobile-menu"
            className={cn(
              'md:hidden absolute left-0 right-0 top-full z-[70] transition-all duration-300',
              mobileOpen
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-3 pointer-events-none'
            )}
          >
            <div className="rounded-b-2xl bg-background dark:bg-card shadow-lg overflow-hidden">
              <nav className="flex flex-col px-4 py-3">
                {menu.map((item, index) => {
                  if (!item) return null

                  const itemAny = item as any
                  
                  // Simple link
                  if (itemAny.type === 'simple' && itemAny.link) {
                    return (
                      <CMSLink
                        key={index}
                        link={itemAny.link}
                        className="block w-full py-3 font-semibold uppercase text-muted-foreground hover:text-primary transition-colors"
                      >
                        {itemAny.link.label}
                      </CMSLink>
                    )
                  }
                  
                  // Dropdown menu
                  if (itemAny.type === 'dropdown' && itemAny.dropdown) {
                    const dropdown = itemAny.dropdown
                    return (
                      <div key={index} className="py-2">
                        <div className="py-2 font-semibold uppercase text-sm text-muted-foreground">
                          {dropdown.label}
                        </div>
                        <div className="pl-4 space-y-1">
                          {dropdown.items?.map((dropdownItem: any, idx: number) => {
                            if (!dropdownItem.link) return null
                            return (
                              <CMSLink
                                key={idx}
                                link={dropdownItem.link}
                                className="block py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                              >
                                {dropdownItem.link.label}
                              </CMSLink>
                            )
                          })}
                        </div>
                      </div>
                    )
                  }
                  
                  return null
                })}
                
                <div className="mt-2 flex items-center justify-between gap-3">
                  {header.ctaButton?.link && (
                    <CMSLink 
                      link={header.ctaButton.link} 
                      className="w-full"
                    >
                      <BorderButton
                        text={header.ctaButton.link.label || 'Get Started'}
                        variant="filled"
                        fullWidth
                      />
                    </CMSLink>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </header>
      </div>
    </>
  )
}