// src/components/booking/sections/Step02Service.tsx
'use client'

import React from 'react'
import { Home, PackageOpen, Bed, Building2, Wrench, Hammer, Clock } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'
import type { ServiceCategory } from '@/types/booking'
import { RequestQuoteForm } from '@/components/RequestQuoteForm'
import { REQUEST_FORM_TITLE } from '@/data/requestForms'

// All services share the same 3-hour minimum per Geraldine's PDF slide 16.
// (Was per-service before: 3h/4h/5h/6h variants.) Booking-summary still
// computes a longer estimate when square footage warrants it on Step 3+.
// History, because this list has been changed three times.
//   2026-09-21  'custom' (Custom Cleaning) and 'hoarding' were removed. Geraldine: "Please
//               remove CUSTOM CLEANING. It should be under the residential section".
//   2026-10-18  'custom' is back, as CUSTOM HOURLY CLEANING, and this time on purpose: "It
//               should only be available as its own service category." It is not a toggle
//               under the Regular/Deep estimate, and not a Type of Cleaning option.
// 'hoarding' stays removed. ServiceCategory, the label maps and the Bookings collection
// still carry it, so bookings already taken under it keep rendering.
const SERVICES = [
  { id: 'residential' as ServiceCategory, label: 'Residential Cleaning', icon: Home },
  { id: 'movein-out' as ServiceCategory, label: 'Move In / Out', icon: PackageOpen },
  { id: 'airbnb' as ServiceCategory, label: 'AirBnB Special', icon: Bed },
  { id: 'custom' as ServiceCategory, label: 'Custom Hourly Cleaning', icon: Clock },
  { id: 'commercial' as ServiceCategory, label: 'Commercial Office', icon: Building2 },
  { id: 'renovation' as ServiceCategory, label: 'Post Renovation', icon: Wrench },
  { id: 'handyman' as ServiceCategory, label: 'Handyman Services', icon: Hammer },
]

export function Step02Service() {
  // Airbnb and Commercial are request-only (Geraldine, 2026-10-18): picking one swaps the
  // wizard for the short request form. See src/data/requestForms.ts.
  const { bookingData, updateServiceType } = useBooking()
  const { serviceType, customer } = bookingData
  const requestKind = serviceType === 'airbnb' || serviceType === 'commercial' ? serviceType : null

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

      {requestKind && (
        <div style={{ marginTop: '36px', paddingTop: '28px', borderTop: '1px solid rgba(13,27,46,0.1)' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.5px', color: 'var(--color-navy-deep)', margin: '0 0 8px' }}>
            {REQUEST_FORM_TITLE[requestKind]}
          </h3>
          <p style={{ margin: '0 0 24px', fontSize: '0.9rem', lineHeight: 1.6, color: 'rgba(74,90,106,0.85)' }}>
            This service is quoted individually, so there is no price or payment here. Tell us a little and we will send you a custom quote.
          </p>
          <RequestQuoteForm
            key={requestKind}
            kind={requestKind}
            defaults={{
              name: [customer.firstName, customer.lastName].filter(Boolean).join(' '),
              email: customer.email,
              phone: customer.phone,
            }}
          />
        </div>
      )}
    </div>
  )
}
