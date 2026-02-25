// src/components/Header/MobileMenu.tsx

'use client'

import type { Header } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { ChevronDown, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

interface Props {
  menu: Header['navItems']
}

export function MobileMenu({ menu }: Props) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const isActiveLink = (linkUrl: string | null | undefined, currentPathname: string) => {
    if (!linkUrl || !currentPathname) return false
    if (linkUrl === '/' && currentPathname === '/') return true
    if (linkUrl !== '/') {
      return currentPathname === linkUrl || currentPathname.startsWith(linkUrl + '/')
    }
    return false
  }

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
    setExpandedItems(new Set())
  }, [])

  const toggleExpanded = useCallback((itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  useEffect(() => {
    closeMenu()
  }, [pathname, closeMenu])

  const getLinkUrl = (link: any): string | undefined => {
    if (!link) return undefined
    if (typeof link.url === 'string') return link.url
    if (link.reference?.value) {
      if (typeof link.reference.value === 'string') return link.reference.value
      if (typeof link.reference.value === 'object' && link.reference.value.slug) {
        return `/${link.reference.value.slug}`
      }
    }
    return undefined
  }

  return (
    <>
      <button 
        className="flex items-center justify-center w-10 h-10 text-foreground hover:text-primary transition-colors"
        onClick={toggleMenu}
        aria-expanded={isMenuOpen}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <Menu className="w-7 h-7" />
        )}
      </button>
      
      <div className={cn(
        "fixed inset-0 z-[90] transition-all duration-300 lg:hidden",
        "bg-background dark:bg-card",
        isMenuOpen 
          ? "opacity-100 visible" 
          : "opacity-0 invisible pointer-events-none"
      )}>
        <div className="relative min-h-screen flex flex-col">
          <div className="h-20 flex-shrink-0" />
          
          <div className="px-6 py-6 border-b border-border">
            <div className="text-center">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary font-heading font-semibold text-base uppercase">
                Mazco LLC
              </span>
            </div>
          </div>

          <nav className="flex-1 px-6 py-6 overflow-y-auto">
            {menu && menu.length > 0 ? (
              <ul className="space-y-2">
                {menu.map((item, index) => {
                  if (!item) return null
                  
                  const itemAny = item as any
                  const itemId = item.id || `nav-${index}`
                  const isExpanded = expandedItems.has(itemId)
                  
                  if (itemAny.type === 'dropdown' && itemAny.dropdown) {
                    const dropdown = itemAny.dropdown
                    
                    return (
                      <li key={itemId}>
                        <button
                          onClick={() => toggleExpanded(itemId)}
                          className={cn(
                            'flex items-center justify-between w-full p-4',
                            'relative bg-background dark:bg-card',
                            'font-heading font-semibold text-base md:text-lg uppercase transition-colors',
                            'text-foreground hover:text-primary'
                          )}
                        >
                          <div className="absolute left-0 -top-[1px] h-px w-full bg-gradient-to-l from-zinc-200 via-zinc-400 to-zinc-600 dark:from-zinc-900 dark:via-zinc-700 dark:to-zinc-500" />
                          <div className="absolute -bottom-[1px] left-0 h-px w-full bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-600 dark:from-zinc-900 dark:via-zinc-700 dark:to-zinc-500" />
                          <div className="absolute inset-y-0 -top-[5px] -bottom-[5px] left-0 w-px bg-gradient-to-t from-zinc-200 via-zinc-400 to-zinc-600 dark:from-zinc-900 dark:via-zinc-700 dark:to-zinc-500" />
                          <div className="absolute inset-y-0 -top-[5px] -bottom-[5px] right-0 w-px bg-gradient-to-t from-zinc-200 via-zinc-400 to-zinc-600 dark:from-zinc-900 dark:via-zinc-700 dark:to-zinc-500" />
                          
                          <span className="relative z-10">{dropdown.label}</span>
                          <ChevronDown 
                            className={cn(
                              'relative z-10 w-5 h-5 transition-transform',
                              isExpanded && 'rotate-180'
                            )} 
                          />
                        </button>

                        {dropdown.items && dropdown.items.length > 0 && (
                          <div className={cn(
                            'overflow-hidden transition-all duration-300 ml-4',
                            isExpanded ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
                          )}>
                            <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                              {dropdown.items.map((nestedItem: any, nestedIndex: number) => {
                                if (!nestedItem.link) return null
                                
                                const nestedUrl = getLinkUrl(nestedItem.link)
                                const isNestedActive = isActiveLink(nestedUrl, pathname)
                                
                                return (
                                  <Link
                                    key={`${itemId}-nested-${nestedIndex}`}
                                    href={nestedUrl || '/'}
                                    onClick={closeMenu}
                                    className={cn(
                                      'block p-3 rounded-lg transition-colors',
                                      isNestedActive 
                                        ? 'bg-primary/10 text-primary' 
                                        : 'hover:bg-muted text-foreground'
                                    )}
                                  >
                                    <div className="font-heading font-semibold text-sm md:text-base uppercase">
                                      {nestedItem.link.label}
                                    </div>
                                    {nestedItem.description && (
                                      <p className="text-xs text-muted-foreground mt-1 font-body">
                                        {nestedItem.description}
                                      </p>
                                    )}
                                  </Link>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </li>
                    )
                  }
                  
                  const linkData = itemAny.link?.link || itemAny.link
                  if (linkData) {
                    const linkUrl = getLinkUrl(linkData)
                    const isActive = isActiveLink(linkUrl, pathname)
                    
                    return (
                      <li key={itemId}>
                        <Link
                          href={linkUrl || '/'}
                          onClick={closeMenu}
                          className={cn(
                            'relative block w-full p-4',
                            'font-heading font-semibold text-base md:text-lg uppercase transition-colors',
                            isActive
                              ? 'text-primary bg-primary/10'
                              : 'text-foreground hover:text-primary'
                          )}
                        >
                          <div className="absolute left-0 -top-[1px] h-px w-full bg-gradient-to-l from-zinc-200 via-zinc-400 to-zinc-600 dark:from-zinc-900 dark:via-zinc-700 dark:to-zinc-500" />
                          <div className="absolute -bottom-[1px] left-0 h-px w-full bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-600 dark:from-zinc-900 dark:via-zinc-700 dark:to-zinc-500" />
                          <div className="absolute inset-y-0 -top-[5px] -bottom-[5px] left-0 w-px bg-gradient-to-t from-zinc-200 via-zinc-400 to-zinc-600 dark:from-zinc-900 dark:via-zinc-700 dark:to-zinc-500" />
                          <div className="absolute inset-y-0 -top-[5px] -bottom-[5px] right-0 w-px bg-gradient-to-t from-zinc-200 via-zinc-400 to-zinc-600 dark:from-zinc-900 dark:via-zinc-700 dark:to-zinc-500" />
                          
                          <span className="relative z-10">{linkData.label}</span>
                        </Link>
                      </li>
                    )
                  }
                  
                  return null
                })}
              </ul>
            ) : (
              <div className="text-center py-8">
                <span className="text-muted-foreground text-base font-body uppercase">No navigation items</span>
              </div>
            )}
          </nav>

          <div className="px-6 py-6 border-t border-border">
            <div className="relative">
              <div className="absolute left-0 -top-[1px] h-px w-full bg-gradient-to-l from-zinc-200 via-zinc-400 to-zinc-600 dark:from-zinc-900 dark:via-zinc-700 dark:to-zinc-500" />
              <div className="absolute -bottom-[1px] left-0 h-px w-full bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-600 dark:from-zinc-900 dark:via-zinc-700 dark:to-zinc-500" />
              <div className="absolute inset-y-0 -top-[5px] -bottom-[5px] left-0 w-px bg-gradient-to-t from-zinc-200 via-zinc-400 to-zinc-600 dark:from-zinc-900 dark:via-zinc-700 dark:to-zinc-500" />
              <div className="absolute inset-y-0 -top-[5px] -bottom-[5px] right-0 w-px bg-gradient-to-t from-zinc-200 via-zinc-400 to-zinc-600 dark:from-zinc-900 dark:via-zinc-700 dark:to-zinc-500" />
              
              <Link
                href="/contact"
                onClick={closeMenu}
                className="relative z-10 flex items-center justify-center w-full px-6 py-4 bg-primary text-white hover:bg-transparent hover:text-primary font-heading font-semibold text-base md:text-lg uppercase transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-[85] bg-black/20"
          onClick={closeMenu}
        />
      )}
    </>
  )
}