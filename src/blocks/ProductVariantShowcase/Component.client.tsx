// src/blocks/ProductVariantShowcase/Component.client.tsx
'use client'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { Star } from 'lucide-react'
import React, { useState } from 'react'

interface ProductImage {
  id?: string | null
  img: number | MediaType
  title: string
  desc: string
  featured?: boolean | null
}

interface ProductShowcaseClientProps {
  images: ProductImage[]
  productName: string
}

export const ProductShowcaseClient: React.FC<ProductShowcaseClientProps> = ({
  images,
  productName,
}) => {
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null)

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="relative">
      
      {/* Professional Product Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {images.map((imageItem, index) => (
          <div 
            key={imageItem.id || index}
            className="group relative cursor-pointer"
            onClick={() => setSelectedImage(imageItem)}
          >
            
            {/* Professional Image Card */}
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-xl bg-antique-white dark:bg-charcoal-black transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              
              {/* Product Detail Image */}
              {imageItem.img && (
                <Media
                  resource={typeof imageItem.img === 'number' ? String(imageItem.img) : imageItem.img}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={`${productName} - ${imageItem.title}`}
                />
              )}
              
              {/* Professional Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/80 via-deep-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Featured Badge */}
              {imageItem.featured && (
                <div className="absolute top-3 left-3 bg-copper-bourbon text-antique-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                  <Star className="w-3 h-3 fill-current" />
                  Featured
                </div>
              )}
              
              {/* Content Overlay - appears on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                
                {/* Image Title */}
                <h3 className="font-playfair text-antique-white font-semibold text-sm mb-2 drop-shadow-lg">
                  {imageItem.title}
                </h3>
                
                {/* Image Description */}
                <p className="font-sourcesans text-antique-white/90 text-xs leading-relaxed drop-shadow-md line-clamp-2">
                  {imageItem.desc}
                </p>
              </div>
              
              {/* Professional frame border */}
              <div className="absolute inset-0 border-2 border-copper-bourbon/20 rounded-lg group-hover:border-copper-bourbon/40 transition-colors duration-300" />
              
              {/* Heritage corner details */}
              <div className="absolute top-2 right-2 w-1.5 h-1.5 border-r-2 border-t-2 border-antique-white/50 group-hover:border-copper-bourbon/80 transition-colors duration-300" />
              <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-l-2 border-b-2 border-antique-white/50 group-hover:border-copper-bourbon/80 transition-colors duration-300" />
            </div>
            
            {/* Image Title Below (Always Visible) */}
            <div className="mt-3 text-center">
              <h4 className="font-sourcesans font-semibold text-deep-charcoal dark:text-antique-white text-sm">
                {imageItem.title}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* Optional: Modal for Image Detail View */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-deep-charcoal/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full bg-antique-white dark:bg-charcoal-black rounded-lg overflow-hidden shadow-2xl">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-deep-charcoal/80 hover:bg-deep-charcoal text-antique-white rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200"
            >
              ×
            </button>
            
            {/* Modal Image */}
            <div className="relative">
              {selectedImage.img && (
                <Media
                  resource={typeof selectedImage.img === 'number' ? String(selectedImage.img) : selectedImage.img}
                  className="w-full max-h-[80vh]"
                  imgClassName="w-full h-full object-contain"
                  alt={`${productName} - ${selectedImage.title}`}
                />
              )}
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              <h3 className="font-playfair text-deep-charcoal dark:text-antique-white font-semibold text-lg mb-2">
                {selectedImage.title}
              </h3>
              <p className="font-sourcesans text-deep-charcoal/80 dark:text-antique-white/80 text-sm leading-relaxed">
                {selectedImage.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}