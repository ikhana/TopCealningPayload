// src/blocks/ProductVariantShowcase/VariantCard.tsx
'use client'

import type { Media as MediaType, Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/cn'
import { Star } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface Variant {
  id?: string
  img: number | MediaType
  title: string
  desc: string
  varId?: string | null
  featured?: boolean | null
}

interface VariantCardProps {
  variant: Variant
  product: Product
  productUrl: string
  productPrice?: number | null
  showPrice: boolean
  enableHoverEffects: boolean
}

export const VariantCard: React.FC<VariantCardProps> = ({
  variant,
  product,
  productUrl,
  productPrice,
  showPrice,
  enableHoverEffects,
}) => {
  // Build the product URL with variant selection
  const variantUrl = variant.varId 
    ? `${productUrl}?variant=${variant.varId}`
    : productUrl

  return (
    <Link href={variantUrl} className="block group h-full">
      <div
        className={cn(
          'relative rounded-xl overflow-hidden shadow-lg cursor-pointer h-full',
          enableHoverEffects && 'hover:shadow-2xl transition-all duration-300 hover:-translate-y-2'
        )}
      >
        {/* Variant Image */}
        <div className="relative aspect-square overflow-hidden">
          {variant.img && (
            <Media
              resource={typeof variant.img === 'number' ? String(variant.img) : variant.img}
              className="w-full h-full"
              imgClassName={cn(
                'w-full h-full object-cover',
                enableHoverEffects && 'transition-transform duration-500 group-hover:scale-110'
              )}
            />
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Featured Badge */}
          {variant.featured && (
            <div className="absolute top-4 left-4 bg-bourbon text-white px-3 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
              <Star className="w-4 h-4 fill-current" />
              Featured
            </div>
          )}
          
          {/* Price Badge */}
          {showPrice && productPrice && (
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
              <span className="font-bold text-bourbon text-lg">
                ${productPrice}
              </span>
            </div>
          )}
          
          {/* Content Overlay - appears on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            {/* Variant Title */}
            <h4 className="font-bold text-white text-lg mb-2 drop-shadow-lg">
              {variant.title}
            </h4>
            
            {/* Variant Description */}
            <p className="text-white/90 text-sm leading-relaxed drop-shadow-md line-clamp-2">
              {variant.desc}
            </p>
          </div>
          
          {/* Static Title at Bottom (always visible) */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm p-4 group-hover:opacity-0 transition-opacity duration-300">
            <h4 className="font-semibold text-white text-center text-sm">
              {variant.title}
            </h4>
          </div>
        </div>
      </div>
    </Link>
  )
}