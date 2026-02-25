// src/components/Header/HeaderWrapper.tsx

'use client'

import { useEffect, useState } from 'react'
import type { Header } from 'src/payload-types'
import { HeaderClient } from './index.client'

type Props = {
  header: Header
}

export function HeaderWrapper({ header }: Props) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <header className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full container header-manage px-3 sm:px-4 py-3">
        <div className="relative bg-background dark:bg-card rounded-b-2xl shadow-sm">
          <div className="flex items-center justify-between h-14">
            <div className="w-40 h-11 bg-muted animate-pulse rounded" />
            <div className="hidden md:flex items-center gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-20 h-6 bg-muted animate-pulse rounded" />
              ))}
            </div>
            <div className="w-32 h-10 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </header>
    )
  }

  return <HeaderClient header={header} />
}