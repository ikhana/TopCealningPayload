import { CategoryTabs } from '@/components/CategoryTabs'
import { CompactShopFilters } from '@/components/CompactShopFilters'
import { ShopHero } from '@/components/ShopHero/ShopHero'
import React, { Suspense } from 'react'

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <ShopHero />
      <CategoryTabs />
      
      {/* Wrap the CompactShopFilters in Suspense since it uses useSearchParams */}
      <Suspense fallback={<div className="h-16 bg-antique-white dark:bg-deep-charcoal" />}>
        <CompactShopFilters />
      </Suspense>

      <div className="bg-antique-white dark:bg-deep-charcoal">
        <div className="container py-8 lg:py-12">
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}