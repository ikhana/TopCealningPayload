// src/components/StoreLocator/StoreLocator.tsx
'use client'

import { SectionHeading } from '@/components/ui/SectionHeading'
import { WorkshopButton } from '@/components/ui/WorkshopButton/WorkshopButton'
import { cn } from '@/utilities/cn'
import { Clock, ExternalLink, MapPin, Phone, Search } from 'lucide-react'
import React, { useState } from 'react'

// Demo store data - in real app this would come from CMS or API
const DEMO_STORES = [
  {
    id: 1,
    name: 'Heritage Cigar Lounge',
    type: 'Premium Cigar Lounge',
    address: '123 Bourbon Street, Louisville, KY 40202',
    phone: '(502) 555-0123',
    hours: 'Mon-Thu: 11am-10pm\nFri-Sat: 11am-12am\nSun: 12pm-8pm',
    website: 'https://heritagecigarlounge.com',
    specialties: ['Cigar Accessories', 'Bourbon Boards', 'Humidors'],
    featured: true,
  },
  {
    id: 2,
    name: 'The Gentleman\'s Den',
    type: 'Luxury Accessories Boutique',
    address: '456 Main Street, Lexington, KY 40507',
    phone: '(859) 555-0456',
    hours: 'Mon-Sat: 10am-8pm\nSun: 12pm-6pm',
    website: 'https://gentlemansden.com',
    specialties: ['Cigar Cutters', 'Whiskey Accessories', 'Gift Sets'],
    featured: false,
  },
  {
    id: 3,
    name: 'Barrel & Blade Co.',
    type: 'Artisan Craft Store',
    address: '789 Heritage Avenue, Bardstown, KY 40004',
    phone: '(502) 555-0789',
    hours: 'Tue-Sat: 9am-7pm\nSun: 11am-5pm\nMon: Closed',
    website: 'https://barrelandblade.com',
    specialties: ['Custom Boards', 'Engraving Services', 'Bourbon Gifts'],
    featured: true,
  },
  {
    id: 4,
    name: 'Premium Spirits & More',
    type: 'Specialty Retailer',
    address: '321 Distillery Row, Frankfort, KY 40601',
    phone: '(502) 555-0321',
    hours: 'Mon-Sat: 10am-9pm\nSun: 12pm-6pm',
    website: 'https://premiumspirits.com',
    specialties: ['Tasting Boards', 'Cigar Tools', 'Premium Gifts'],
    featured: false,
  },
]

interface StoreLocatorProps {
  className?: string
}

export const StoreLocator: React.FC<StoreLocatorProps> = ({ className }) => {
  const [searchLocation, setSearchLocation] = useState('')
  const [filteredStores, setFilteredStores] = useState(DEMO_STORES)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In real app, this would call an API to search stores by location
    if (searchLocation.trim()) {
      // Simple demo filtering by city name
      const filtered = DEMO_STORES.filter(store => 
        store.address.toLowerCase().includes(searchLocation.toLowerCase())
      )
      setFilteredStores(filtered.length > 0 ? filtered : DEMO_STORES)
    } else {
      setFilteredStores(DEMO_STORES)
    }
  }

  // Get store type styling
  const getStoreTypeClasses = (type: string) => {
    switch (type) {
      case 'Premium Cigar Lounge':
        return 'bg-copper-bourbon text-antique-white'
      case 'Luxury Accessories Boutique':
        return 'bg-charcoal-gold text-charcoal-black'
      case 'Artisan Craft Store':
        return 'bg-antique-brass text-charcoal-black'
      default:
        return 'bg-smoky-gray text-antique-white'
    }
  }

  return (
    <section className={cn(
      'py-16 lg:py-24 transition-colors duration-300',
      'bg-antique-white dark:bg-charcoal-black',
      className
    )}>
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <SectionHeading
            title="Authorized Dealers"
            subtitle="Find premium retailers carrying Buford luxury accessories near you"
            level="h2"
            size="lg"
            align="center"
            theme="auto"
            className="max-w-4xl mx-auto"
          />
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <form onSubmit={handleSearch} className="relative">
            <div className={cn(
              'relative transition-all duration-300',
              'bg-white/60 dark:bg-deep-charcoal/60 backdrop-blur-sm',
              'border border-antique-brass/20 dark:border-charcoal-gold/20',
              'rounded-lg overflow-hidden shadow-lg'
            )}>
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Search className={cn(
                  'w-5 h-5 transition-colors duration-300',
                  'text-antique-brass dark:text-smoky-gray'
                )} />
              </div>
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Enter city, state, or ZIP code..."
                className={cn(
                  'w-full pl-12 pr-32 py-4 text-base transition-colors duration-300',
                  'bg-transparent placeholder:text-smoky-gray/60',
                  'text-deep-charcoal dark:text-antique-white',
                  'focus:outline-none'
                )}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <WorkshopButton
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="px-6"
                >
                  Search
                </WorkshopButton>
              </div>
            </div>
          </form>
        </div>

        {/* Results Count */}
        <div className="text-center mb-8">
          <p className={cn(
            'text-sm transition-colors duration-300',
            'text-antique-brass dark:text-smoky-gray'
          )}>
            {filteredStores.length} {filteredStores.length === 1 ? 'dealer' : 'dealers'} found
            {searchLocation && ` near "${searchLocation}"`}
          </p>
        </div>

        {/* Store Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {filteredStores.map((store) => (
            <div
              key={store.id}
              className={cn(
                'relative p-6 rounded-lg transition-all duration-300 hover:shadow-xl',
                // Theme-aware card background
                'bg-white/60 border border-antique-brass/20',
                'dark:bg-deep-charcoal/60 dark:border-charcoal-gold/20',
                // Hover effects
                'hover:scale-[1.02] hover:shadow-copper-bourbon/20',
                // Featured store styling
                store.featured && 'ring-2 ring-copper-bourbon/30 dark:ring-charcoal-gold/30'
              )}
            >
              
              {/* Featured Badge */}
              {store.featured && (
                <div className="absolute top-4 right-4">
                  <span className={cn(
                    'px-2 py-1 text-xs font-semibold rounded-full transition-colors duration-300',
                    'bg-copper-bourbon text-antique-white',
                    'dark:bg-charcoal-gold dark:text-charcoal-black'
                  )}>
                    FEATURED
                  </span>
                </div>
              )}

              {/* Store Header */}
              <div className="mb-4">
                <h3 className={cn(
                  'font-playfair text-xl font-semibold mb-2 transition-colors duration-300',
                  'text-deep-charcoal dark:text-antique-white'
                )}>
                  {store.name}
                </h3>
                <span className={cn(
                  'inline-block px-3 py-1 text-xs font-semibold rounded-full',
                  getStoreTypeClasses(store.type)
                )}>
                  {store.type}
                </span>
              </div>

              {/* Store Details */}
              <div className="space-y-3 mb-6">
                
                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className={cn(
                    'w-4 h-4 mt-0.5 flex-shrink-0 transition-colors duration-300',
                    'text-copper-bourbon dark:text-charcoal-gold'
                  )} />
                  <p className={cn(
                    'text-sm transition-colors duration-300',
                    'text-antique-brass dark:text-smoky-gray'
                  )}>
                    {store.address}
                  </p>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <Phone className={cn(
                    'w-4 h-4 flex-shrink-0 transition-colors duration-300',
                    'text-copper-bourbon dark:text-charcoal-gold'
                  )} />
                  <a 
                    href={`tel:${store.phone}`}
                    className={cn(
                      'text-sm transition-colors duration-200 hover:underline',
                      'text-antique-brass hover:text-copper-bourbon',
                      'dark:text-smoky-gray dark:hover:text-charcoal-gold'
                    )}
                  >
                    {store.phone}
                  </a>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <Clock className={cn(
                    'w-4 h-4 mt-0.5 flex-shrink-0 transition-colors duration-300',
                    'text-copper-bourbon dark:text-charcoal-gold'
                  )} />
                  <div className={cn(
                    'text-sm whitespace-pre-line transition-colors duration-300',
                    'text-antique-brass dark:text-smoky-gray'
                  )}>
                    {store.hours}
                  </div>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-6">
                <p className={cn(
                  'text-xs font-semibold mb-2 transition-colors duration-300',
                  'text-deep-charcoal dark:text-antique-white'
                )}>
                  SPECIALTIES
                </p>
                <div className="flex flex-wrap gap-1">
                  {store.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className={cn(
                        'px-2 py-1 text-xs rounded transition-colors duration-300',
                        'bg-antique-brass/10 text-antique-brass',
                        'dark:bg-smoky-gray/10 dark:text-smoky-gray'
                      )}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <WorkshopButton
                  as="link"
                  href={`tel:${store.phone}`}
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                >
                  Call Store
                </WorkshopButton>
                
                {/* External link as regular anchor with WorkshopButton styling */}
                <a
                  href={store.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-sourcesans font-semibold rounded-lg',
                    'transition-all duration-300 hover:scale-105 active:scale-95',
                    'border border-antique-brass text-antique-brass hover:bg-antique-brass hover:text-antique-white',
                    'dark:border-charcoal-gold dark:text-charcoal-gold dark:hover:bg-charcoal-gold dark:hover:text-charcoal-black',
                    'focus:outline-none focus:ring-2 focus:ring-copper-bourbon/40'
                  )}
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit
                </a>
              </div>

            </div>
          ))}
        </div>

        {/* Map Integration Placeholder */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className={cn(
            'h-96 rounded-lg transition-colors duration-300 flex items-center justify-center',
            'bg-white/40 border-2 border-dashed border-antique-brass/30',
            'dark:bg-deep-charcoal/40 dark:border-charcoal-gold/30'
          )}>
            <div className="text-center">
              <MapPin className={cn(
                'w-12 h-12 mx-auto mb-4 transition-colors duration-300',
                'text-antique-brass dark:text-smoky-gray'
              )} />
              <p className={cn(
                'font-playfair text-lg font-semibold mb-2 transition-colors duration-300',
                'text-deep-charcoal dark:text-antique-white'
              )}>
                Interactive Map
              </p>
              <p className={cn(
                'text-sm transition-colors duration-300',
                'text-antique-brass dark:text-smoky-gray'
              )}>
                Google Maps integration coming soon
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <div className={cn(
            'max-w-2xl mx-auto p-8 rounded-lg transition-colors duration-300',
            'bg-white/60 border border-antique-brass/20',
            'dark:bg-deep-charcoal/60 dark:border-charcoal-gold/20'
          )}>
            <h3 className={cn(
              'font-playfair text-xl font-semibold mb-4 transition-colors duration-300',
              'text-deep-charcoal dark:text-antique-white'
            )}>
              Don&apos;t see a dealer near you?
            </h3>
            <p className={cn(
              'text-sm mb-6 transition-colors duration-300',
              'text-antique-brass dark:text-smoky-gray'
            )}>
              Contact us about becoming an authorized dealer or finding specialty retailers in your area.
            </p>
            <WorkshopButton
              as="link"
              href="/contact"
              variant="primary"
              size="lg"
            >
              Become a Dealer
            </WorkshopButton>
          </div>
        </div>

      </div>
    </section>
  )
}