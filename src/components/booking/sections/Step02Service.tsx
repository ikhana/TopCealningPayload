// src/components/booking/sections/Step02Service.tsx
'use client'

import React from 'react'
import { Home, PackageOpen, Bed, Sparkles, Building2, Wrench, Package } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'
import type { ServiceCategory } from '@/types/booking'
import { calculateEstimatedTime } from '@/utilities/booking-helpers'

const SERVICES = [
  { id: 'residential' as ServiceCategory, label: 'Residential Cleaning', icon: Home, recommended: '3h' },
  { id: 'movein-out' as ServiceCategory, label: 'Move In / Out', icon: PackageOpen, recommended: '4h' },
  { id: 'airbnb' as ServiceCategory, label: 'AirBnB Special', icon: Bed, recommended: '3h' },
  { id: 'custom' as ServiceCategory, label: 'Custom Cleaning', icon: Sparkles, recommended: '3h' },
  { id: 'commercial' as ServiceCategory, label: 'Commercial Office', icon: Building2, recommended: '4h' },
  { id: 'renovation' as ServiceCategory, label: 'Post Renovation', icon: Wrench, recommended: '5h' },
  { id: 'hoarding' as ServiceCategory, label: 'Hoarding Cleanup', icon: Package, recommended: '6h' },
]

export function Step02Service() {
  const { bookingData, updateServiceType } = useBooking()
  const { serviceType, property } = bookingData

  const getEstimatedTime = (svc: (typeof SERVICES)[0]) => {
    if (property.squareFootage > 0) {
      const calc = calculateEstimatedTime(property.squareFootage, [])
      const min = parseInt(svc.recommended.replace('h', ''))
      return `${Math.max(calc, min)}h`
    }
    return svc.recommended
  }

  return (
    <div>
      <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', fontWeight: 900, letterSpacing: '-1.5px', color: 'var(--color-navy-deep)', marginBottom: '40px' }}>
        Select Service.
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {SERVICES.map((svc) => {
          const isSelected = serviceType === svc.id
          const Icon = svc.icon
          return (
            <div
              key={svc.id}
              onClick={() => updateServiceType(svc.id)}
              style={{
                border: `1px solid ${isSelected ? 'var(--color-navy-deep)' : 'rgba(13,27,46,0.1)'}`,
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.35s cubic-bezier(0.25,1,0.5,1)',
                background: isSelected ? 'var(--color-navy-deep)' : 'white',
                color: isSelected ? 'white' : 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-teal)'
                  ;(e.currentTarget as HTMLDivElement).style.background = '#e0f5f4'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(13,27,46,0.1)'
                  ;(e.currentTarget as HTMLDivElement).style.background = 'white'
                }
              }}
            >
              <Icon
                size={20}
                style={{ flexShrink: 0, color: isSelected ? 'var(--color-teal)' : 'rgba(74,90,106,0.6)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '3px' }}>
                  {svc.label}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', opacity: 0.65 }}>
                  Recommended: {getEstimatedTime(svc)}
                </div>
              </div>
              {isSelected && (
                <div style={{
                  width: '18px', height: '18px', border: '2px solid var(--color-teal)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: '0.65rem', color: 'var(--color-teal)',
                }}>
                  ✓
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
