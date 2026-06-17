// src/components/booking/BookingSummary.tsx
// Right-column panel — selection recap (no pricing). Prices/estimate removed
// per the request-only model: final pricing is provided after review.
'use client'

import React from 'react'
import { ShieldCheck } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'

const SERVICE_LABELS: Record<string, string> = {
  residential:  'Residential Cleaning',
  'movein-out': 'Move In / Out',
  airbnb:       'AirBnB Special',
  custom:       'Custom Cleaning',
  commercial:   'Commercial Office',
  renovation:   'Post Renovation',
  hoarding:     'Hoarding Cleanup',
  handyman:     'Handyman Services',
}

export function BookingSummary({ onBook }: { onBook?: () => void }) {
  const { bookingData } = useBooking()
  const { serviceType, selectedExtras, property } = bookingData

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Header */}
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase',
        letterSpacing: '2px', color: 'rgba(74,90,106,0.6)', marginBottom: '28px',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        Request Summary
        <div style={{ flex: 1, height: '1px', background: 'rgba(13,27,46,0.08)' }} />
      </div>

      {/* Service label + specs */}
      {serviceType && (
        <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(13,27,46,0.06)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(74,90,106,0.5)', marginBottom: '4px' }}>
            Service
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-navy-deep)' }}>
            {SERVICE_LABELS[serviceType] || serviceType}
          </div>
          {property.squareFootage > 0 && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(74,90,106,0.55)', marginTop: '3px' }}>
              {property.squareFootage.toLocaleString()} sq ft
              {property.bedrooms ? ` · ${property.bedrooms === 'studio' ? 'Studio' : `${property.bedrooms} bed`}` : ''}
              {` · ${property.bathrooms} bath`}
            </div>
          )}
        </div>
      )}

      {/* Add-ons recap (count only — no pricing) */}
      {selectedExtras.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
          <span style={{ color: 'rgba(74,90,106,0.7)' }}>Add-ons</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-navy-deep)' }}>
            {selectedExtras.length} selected
          </span>
        </div>
      )}

      {/* Request note (replaces the price total + payment note) */}
      <p style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.7rem', color: 'rgba(74,90,106,0.6)', marginTop: 'auto', paddingTop: '22px', lineHeight: 1.55 }}>
        <ShieldCheck size={12} style={{ flexShrink: 0, marginTop: '1px', color: 'var(--color-teal)' }} />
        This is a request only. We&apos;ll review your details and confirm final pricing before anything is scheduled.
      </p>

      {/* Submit button */}
      <button
        type="button"
        onClick={onBook}
        style={{
          width: '100%',
          padding: '18px',
          background: 'var(--color-teal)',
          color: 'white',
          border: 'none',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: '0.85rem',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          cursor: 'pointer',
          marginTop: '18px',
          clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)',
          transition: 'all 0.35s cubic-bezier(0.25,1,0.5,1)',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--color-navy-deep)'
          ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--color-teal)'
          ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
        }}
      >
        Submit Request
      </button>
    </div>
  )
}
