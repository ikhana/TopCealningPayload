// src/components/booking/BookingSummary.tsx
// Right-column panel — reassurance design (illustration + tagline + trust
// badges) per Geraldine's reference, plus a compact selection recap and the
// request-only disclaimer. No pricing (request-only model).
'use client'

import React from 'react'
import { Gem, Sparkles, BadgeCheck, ClipboardCheck } from 'lucide-react'
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

const TRUST = [
  { icon: Gem,        title: 'Premium Quality',        desc: 'Top-tier service & attention to detail' },
  { icon: Sparkles,   title: 'Quality Products',       desc: 'Chosen to deliver outstanding results' },
  { icon: BadgeCheck, title: 'Satisfaction Guaranteed', desc: "We're not happy until you are" },
]

export function BookingSummary() {
  const { bookingData } = useBooking()
  const { serviceType, selectedExtras, property } = bookingData

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Header */}
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase',
        letterSpacing: '2px', color: 'rgba(74,90,106,0.6)', marginBottom: '24px',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        Request Summary
        <div style={{ flex: 1, height: '1px', background: 'rgba(13,27,46,0.08)' }} />
      </div>

      {/* Illustration */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'rgba(23,176,171,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ClipboardCheck size={30} style={{ color: 'var(--color-teal)' }} />
        </div>
      </div>

      {/* Tagline */}
      <p style={{
        textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '1.3rem',
        fontWeight: 800, color: 'var(--color-navy-deep)', lineHeight: 1.3,
        margin: '0 0 22px', letterSpacing: '-0.5px',
      }}>
        You&apos;re one step closer to a{' '}
        <em style={{ fontWeight: 400, fontStyle: 'italic', color: 'var(--color-teal)' }}>beautifully</em>{' '}
        clean space.
      </p>

      {/* Compact selection recap */}
      {serviceType && (
        <div style={{ marginBottom: '20px', padding: '14px 16px', background: 'rgba(13,27,46,0.02)', border: '1px solid rgba(13,27,46,0.06)' }}>
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
          {selectedExtras.length > 0 && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-teal)', marginTop: '3px' }}>
              {selectedExtras.length} add-on{selectedExtras.length > 1 ? 's' : ''} selected
            </div>
          )}
        </div>
      )}

      {/* Request-only disclaimer */}
      <div style={{
        padding: '16px', marginBottom: '26px',
        background: 'rgba(23,176,171,0.06)', border: '1px solid rgba(23,176,171,0.15)',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-navy-deep)', margin: 0, lineHeight: 1.55, fontWeight: 500 }}>
          This is a request form only. We&apos;ll review your details and confirm final pricing before your appointment.
        </p>
      </div>

      {/* Trust badges — pinned to the bottom (the wizard's own nav handles submit) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: 'auto' }}>
        {TRUST.map(({ icon: Icon, title, desc }) => (
          <div key={title} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Icon size={22} style={{ color: 'var(--color-teal)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-navy-deep)' }}>
                {title}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(74,90,106,0.75)', lineHeight: 1.4, marginTop: '2px' }}>
                {desc}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
