// src/components/booking/BookingSummary.tsx
// Right-column live price panel — wired to BookingContext
'use client'

import React from 'react'
import { Clock, ShieldCheck } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'

const SERVICE_LABELS: Record<string, string> = {
  residential:  'Residential Cleaning',
  'movein-out': 'Move In / Out',
  airbnb:       'AirBnB Special',
  custom:       'Custom Cleaning',
  commercial:   'Commercial Office',
  renovation:   'Post Renovation',
  hoarding:     'Hoarding Cleanup',
}

const fmt = (n: number) => `$${n.toFixed(2)}`

export function BookingSummary({ onBook }: { onBook?: () => void }) {
  const { bookingData } = useBooking()
  const { serviceType, pricing, selectedExtras, property } = bookingData
  const { basePrice, extrasTotal, discount, total, estimatedTime } = pricing

  const hasPrice = property.squareFootage > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Header */}
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase',
        letterSpacing: '2px', color: 'rgba(74,90,106,0.6)', marginBottom: '28px',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        Booking Summary
        <div style={{ flex: 1, height: '1px', background: 'rgba(13,27,46,0.08)' }} />
      </div>

      {/* Service label */}
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

      {/* Price lines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
          <span style={{ color: 'rgba(74,90,106,0.7)' }}>Base Service</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            {hasPrice ? fmt(basePrice) : '—'}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
          <span style={{ color: 'rgba(74,90,106,0.7)' }}>
            Add-ons {selectedExtras.length > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-teal)' }}>×{selectedExtras.length}</span>}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            {extrasTotal > 0 ? `+${fmt(extrasTotal)}` : '$0.00'}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
          <span style={{ color: 'rgba(74,90,106,0.7)' }}>Discount</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#fc8181' }}>
            {discount > 0 ? `-${fmt(discount)}` : '-$0.00'}
          </span>
        </div>
      </div>

      {/* Estimated time */}
      {estimatedTime > 0 && (
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 12px', background: 'rgba(23,176,171,0.06)', border: '1px solid rgba(23,176,171,0.15)' }}>
          <Clock size={13} style={{ color: 'var(--color-teal)', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'rgba(74,90,106,0.75)' }}>
            Est. {estimatedTime}h cleaning time
          </span>
        </div>
      )}

      {/* Total */}
      <div style={{
        marginTop: 'auto',
        paddingTop: '22px',
        borderTop: '2px solid var(--color-navy-deep)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        fontWeight: 800,
        fontSize: '1.25rem',
      }}>
        <span>Estimate</span>
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-teal)', fontSize: '1.4rem' }}>
          {hasPrice ? fmt(total) : '$0.00'}
        </span>
      </div>

      {/* SSL note */}
      <p style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.68rem', color: 'rgba(74,90,106,0.5)', marginTop: '14px', lineHeight: 1.55 }}>
        <ShieldCheck size={12} style={{ flexShrink: 0, marginTop: '1px', color: 'var(--color-teal)' }} />
        By clicking &ldquo;Book Now&rdquo; you agree to our terms of service. Secure 256-bit SSL encrypted payment.
      </p>

      {/* Book button */}
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
        Book Your Service
      </button>
    </div>
  )
}
