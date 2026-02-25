// src/components/CategoryTabs/index.tsx - CHARCOAL & BOURBON LUXURY THEME
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Suspense } from 'react'
import { Item } from './Item'

async function List() {
  const payload = await getPayload({ config: configPromise })
  const categoriesData = await payload.find({
    collection: 'categories',
    sort: 'displayOrder',
    select: {
      title: true,
      slug: true,
    },
    where: {
      showInNavigation: {
        equals: true,
      },
    },
  })

  const categories = categoriesData.docs?.map((category) => {
    return {
      href: `/shop/${category.slug}`,
      title: category.title,
    }
  })

  return (
    <div className="relative bg-antique-white dark:bg-deep-charcoal py-6 lg:py-8">
      <div className="container">
        
        {/* Professional Category Navigation */}
        <nav className="relative" role="navigation" aria-label="Product categories">
          
          {/* Horizontal scroll container for mobile */}
          <div className="relative overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <ul className="flex gap-2 sm:gap-3 lg:gap-4 min-w-max sm:min-w-0 sm:justify-center pb-2 sm:pb-0">
              
              {/* All Categories Tab */}
              <li>
                <Item title="All" href="/shop" />
              </li>
              
              {/* Dynamic Categories */}
              <Suspense fallback={
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <li key={i}>
                      <div className="px-4 py-2 bg-smoky-gray/10 dark:bg-charcoal-black/20 rounded-lg animate-pulse h-9 w-24" />
                    </li>
                  ))}
                </>
              }>
                {categories?.map((category) => (
                  <li key={category.href}>
                    <Item {...category} />
                  </li>
                ))}
              </Suspense>
            </ul>
          </div>
          
          {/* Heritage accent line */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-copper-bourbon to-transparent" />
        </nav>
        
        {/* Heritage corner accents */}
        <div className="absolute top-4 left-4 w-2 h-2 border-l border-t border-copper-bourbon/30 opacity-60" />
        <div className="absolute top-4 right-4 w-2 h-2 border-r border-t border-copper-bourbon/30 opacity-60" />
      </div>
    </div>
  )
}

// Loading skeleton for category tabs
function CategoryTabsSkeleton() {
  return (
    <div className="relative bg-antique-white dark:bg-deep-charcoal py-6 lg:py-8">
      <div className="container">
        <nav className="relative">
          <div className="relative overflow-x-auto">
            <ul className="flex gap-2 sm:gap-3 lg:gap-4 min-w-max sm:min-w-0 sm:justify-center pb-2 sm:pb-0">
              {[1, 2, 3, 4, 5].map((i) => (
                <li key={i}>
                  <div className="px-4 py-2 bg-smoky-gray/10 dark:bg-charcoal-black/20 rounded-lg animate-pulse h-9 w-20" />
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  )
}

export function CategoryTabs() {
  return (
    <Suspense fallback={<CategoryTabsSkeleton />}>
      <List />
    </Suspense>
  )
}