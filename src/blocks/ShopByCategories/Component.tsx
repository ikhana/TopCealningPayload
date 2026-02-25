// src/blocks/ShopByCategories/Component.tsx - ENHANCED MODERN OVERLAPPING BROWSER STYLE
import type { Category, ShopByCategoriesBlock as ShopByCategoriesBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { WorkshopButton } from '@/components/ui/WorkshopButton/WorkshopButton'
import { cn } from '@/utilities/cn'
import {
  safeNumberWithDefault,
  safeString
} from '@/utilities/payloadTypeUtils'
import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

export const ShopByCategoriesBlock: React.FC<
  ShopByCategoriesBlockProps & {
    id?: string
  }
> = async (props) => {
  const {
    title,
    description,
    populateBy,
    limit,
    selectedCategories,
    showViewAllButton,
    viewAllButtonText,
    viewAllButtonLink,
  } = props

  const safeLimit = safeNumberWithDefault(limit, 6)
  const safeTitle = safeString(title) || 'Shop by Category'
  const safeDescription = safeString(description)
  const safeShowViewAllButton = showViewAllButton !== false
  const safeViewAllButtonText = safeString(viewAllButtonText) || 'Explore All Collections'
  const safeViewAllButtonLink = safeString(viewAllButtonLink) || '/shop'

  let categories: Category[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const fetchedCategories = await payload.find({
      collection: 'categories',
      depth: 1,
      limit: safeLimit,
      sort: 'displayOrder',
      where: {
        showInNavigation: {
          equals: true,
        },
      },
    })

    categories = fetchedCategories.docs
  } else if (populateBy === 'selection' && selectedCategories?.length) {
    categories = selectedCategories.filter(
      (category): category is Category => typeof category === 'object' && category !== null
    )
  }

  if (!categories?.length) {
    return null
  }

  return (
    <section className="relative py-16 lg:py-24 bg-antique-white dark:bg-charcoal-black">
      <div className="container mx-auto px-4">
        
        <div className="mb-12 sm:mb-16">
          <SectionHeading
            title={safeTitle}
            subtitle={safeDescription}
            level="h2"
            size="md"
            align="center"
            theme="bourbon"
            className="max-w-4xl mx-auto text-xl sm:text-2xl lg:text-3xl font-semibold tracking-wide font-playfair"
          />
        </div>

        <ModernBrowserCategoriesLayout 
          categories={categories}
          showViewAllButton={safeShowViewAllButton}
          viewAllButtonText={safeViewAllButtonText}
          viewAllButtonLink={safeViewAllButtonLink}
        />
      </div>
    </section>
  )
}

interface ModernBrowserCategoriesLayoutProps {
  categories: Category[]
  showViewAllButton: boolean
  viewAllButtonText: string
  viewAllButtonLink: string
}

const ModernBrowserCategoriesLayout: React.FC<ModernBrowserCategoriesLayoutProps> = ({
  categories,
  showViewAllButton,
  viewAllButtonText,
  viewAllButtonLink,
}) => {
  const visibleCategories = categories.slice(0, 3)

  return (
    <div className="relative max-w-7xl mx-auto">
      
      <div className="lg:hidden grid gap-6">
        {visibleCategories.map((category, index) => (
          <MobileCategoryCard key={category.id} category={category} index={index} />
        ))}
      </div>

      <div className="hidden lg:block relative h-[520px]">
        
        {visibleCategories.map((category, index) => (
          <BrowserPanel
            key={category.id}
            category={category}
            variant={index === 1 ? 'center' : index === 0 ? 'left' : 'right'}
            className={cn(
              'absolute transition-all duration-500 ease-out hover:z-50',
              index === 0 && 'top-0 left-0 z-10',
              index === 1 && 'top-12 left-80 z-20',
              index === 2 && 'top-24 left-160 z-30'
            )}
            index={index}
          />
        ))}
      </div>

      {showViewAllButton && (
        <div className="text-center mt-12">
          <WorkshopButton
            href={viewAllButtonLink}
            variant="primary"
            size="lg"
            className={cn(
              'font-semibold px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300',
              'bg-copper-bourbon hover:bg-copper-bourbon/90 text-antique-white',
              'border border-copper-bourbon/80 hover:border-copper-bourbon',
              'rounded-xl hover:scale-105 hover:-translate-y-1',
              'backdrop-blur-sm'
            )}
          >
            {viewAllButtonText}
          </WorkshopButton>
        </div>
      )}
    </div>
  )
}

interface BrowserPanelProps {
  category: Category
  variant: 'left' | 'center' | 'right'
  className?: string
  index: number
}

const BrowserPanel: React.FC<BrowserPanelProps> = ({ category, variant, className, index }) => {
  const categoryImage = category.image || null
  const categoryUrl = `/shop/${category.slug}`

  const variantStyles = {
    left: {
      frame: 'border-smoky-gray/30 shadow-xl shadow-smoky-gray/10',
      accent: 'bg-copper-bourbon',
      textTheme: 'text-white',
    },
    center: {
      frame: 'border-copper-bourbon/50 shadow-xl shadow-copper-bourbon/20',
      accent: 'bg-charcoal-gold',
      textTheme: 'text-white',
    },
    right: {
      frame: 'border-copper-bourbon/40 shadow-xl shadow-copper-bourbon/15', 
      accent: 'bg-antique-brass',
      textTheme: 'text-white',
    },
  }

  const styles = variantStyles[variant]

  return (
    <div className={cn(
      'group cursor-pointer relative transition-all duration-500',
      'hover:scale-105 hover:shadow-3xl hover:-translate-y-3',
      'w-[480px] h-[340px]',
      className
    )}>
      <Link href={categoryUrl} className="block h-full">
        <div className={cn(
          'relative h-full rounded-2xl overflow-hidden',
          'border-4 transition-all duration-500 ease-out',
          'backdrop-blur-sm',
          styles.frame
        )}>
          
          <div className="absolute inset-0 -m-2">
            {categoryImage && typeof categoryImage === 'object' && (
              <Media
                resource={categoryImage}
                className="w-full h-full"
                imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 rounded-xl"
              />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/20 to-black/60 rounded-xl"></div>
          </div>

     <div className="absolute top-4 left-4 flex gap-3 z-10">
            {/* Top-left corner bracket */}
            <div className="relative w-6 h-6">
              <div className="absolute top-0 left-0 w-3 h-0.5 bg-copper-bourbon rounded-full"></div>
              <div className="absolute top-0 left-0 w-0.5 h-3 bg-copper-bourbon rounded-full"></div>
              <div className="absolute top-1 left-1 w-1 h-1 bg-charcoal-gold rounded-full"></div>
            </div>
            
            {/* Heritage shield mark */}
            <div className="relative w-6 h-6 flex items-center justify-center">
              <div className="w-4 h-5 bg-copper-bourbon/80 rounded-sm relative">
                <div className="absolute inset-0.5 border border-antique-white/60 rounded-sm"></div>
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-antique-white rounded-full"></div>
              </div>
            </div>
            
            {/* Bourbon barrel ring */}
            <div className="relative w-6 h-6 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-antique-brass rounded-full relative">
                <div className="absolute inset-1 border border-copper-bourbon/60 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
            <div className="space-y-2">
              <h3 className={cn(
                'text-xl font-semibold tracking-wide font-playfair text-white',
                'transition-colors duration-300 line-clamp-2'
              )}>
                {category.title}
              </h3>
              
              {category.description && (
                <p className="text-sm line-clamp-3 leading-relaxed text-white/90">
                  {category.description}
                </p>
              )}

              <div className="pt-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-white bg-copper-bourbon/80 px-3 py-1 rounded-full backdrop-blur-sm">
                  Explore Collection
                </span>
              </div>
            </div>
          </div>

          {variant === 'center' && (
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-copper-bourbon text-antique-white px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border border-copper-bourbon/60">
                Featured
              </div>
            </div>
          )}

          <div className={cn(
            "absolute inset-0 rounded-2xl transition-all duration-300",
            "group-hover:shadow-inner group-hover:shadow-copper-bourbon/30"
          )}></div>
        </div>
      </Link>
    </div>
  )
}

interface MobileCategoryCardProps {
  category: Category
  index: number
}

const MobileCategoryCard: React.FC<MobileCategoryCardProps> = ({ category, index }) => {
  const categoryImage = category.image || null
  const categoryUrl = `/shop/${category.slug}`

  return (
    <div className="group cursor-pointer">
      <Link href={categoryUrl} className="block">
        <div className="rounded-2xl border-2 border-smoky-gray/20 bg-antique-white dark:bg-charcoal-black overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          
          <div className="aspect-[16/9] relative overflow-hidden">
            {categoryImage && typeof categoryImage === 'object' && (
              <Media
                resource={categoryImage}
                className="absolute inset-0 w-full h-full"
                imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-lg font-semibold tracking-wide font-playfair text-white mb-2">
                {category.title}
              </h3>
              
              {category.description && (
                <p className="text-sm text-white/80 line-clamp-2">
                  {category.description}
                </p>
              )}
            </div>

            {index === 1 && (
              <div className="absolute top-4 right-4">
                <div className="bg-copper-bourbon text-antique-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                  Featured
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}