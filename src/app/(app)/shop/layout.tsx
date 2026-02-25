import { CategoryTabs } from '@/components/CategoryTabs'
import { CompactShopFilters } from '@/components/CompactShopFilters'
import { ShopHero } from '@/components/ShopHero/ShopHero'
import React from 'react'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      
      {/* Full-Width Shop Hero */}
      <ShopHero />

      {/* Category Navigation */}
      <CategoryTabs />
      
      {/* Compact Filters (Sort dropdown, etc.) */}
      <CompactShopFilters />

      {/* Shop Content Container - More compact */}
      <div className="bg-antique-white dark:bg-deep-charcoal">
        <div className="container py-8 lg:py-12">
          
          {/* Product Grid Content - Removed extra gaps */}
          <div className="w-full">
            {children}
          </div>
          
        </div>
      </div>
      
    </React.Fragment>
  )
}