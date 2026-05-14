'use client'

import React from 'react'
import Link from 'next/link'
import type { Booking } from '@/payload-types'

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  pending:    { bg: '#fef9c3', text: '#854d0e', label: 'Pending' },
  confirmed:  { bg: '#ccfbf1', text: '#065f46', label: 'Confirmed' },
  'in-progress': { bg: '#dbeafe', text: '#1e40af', label: 'In Progress' },
  completed:  { bg: '#dcfce7', text: '#166534', label: 'Completed' },
  cancelled:  { bg: '#f3f4f6', text: '#6b7280', label: 'Cancelled' },
  refunded:   { bg: '#fee2e2', text: '#991b1b', label: 'Refunded' },
}

const SERVICE_LABELS: Record<string, string> = {
  residential:  'Residential Cleaning',
  'movein-out': 'Move In / Out Cleaning',
  airbnb:       'Airbnb Cleaning',
  commercial:   'Commercial Cleaning',
  renovation:   'Post-Renovation Cleaning',
  hoarding:     'Hoarding Cleanup',
  custom:       'Custom Cleaning',
}

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_COLORS[status] ?? STATUS_COLORS.pending!
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      background: style.bg,
      color: style.text,
      fontSize: '0.7rem',
      fontWeight: 700,
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      borderRadius: '2px',
    }}>
      {style.label}
    </span>
  )
}

export function BookingCard({ booking }: { booking: Booking }) {
  const address = booking.address
  const addressStr = address
    ? [address.city, address.state].filter(Boolean).join(', ')
    : '—'

  const dateStr = booking.serviceDate
    ? new Date(`${booking.serviceDate}T12:00:00`).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
      })
    : '—'

  const timeStr = booking.serviceTime
    ? (booking.serviceTime.includes('T')
        ? new Date(booking.serviceTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        : booking.serviceTime)
    : '—'

  return (
    <Link
      href={`/account/bookings/${booking.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div style={{
        border: '1px solid rgba(13,27,46,0.08)',
        padding: '20px 24px',
        background: 'white',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        cursor: 'pointer',
      }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(13,27,46,0.08)'
          ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(23,176,171,0.3)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
          ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(13,27,46,0.08)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-navy-deep)', marginBottom: '3px' }}>
              {SERVICE_LABELS[booking.serviceType] ?? booking.serviceType}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-teal)', letterSpacing: '0.08em' }}>
              {booking.confirmationCode}
            </div>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '12px' }}>
          {[
            ['Date', dateStr],
            ['Time', timeStr],
            ['Location', addressStr],
            ['Total', booking.pricing?.total != null ? `$${booking.pricing.total.toFixed(2)}` : '—'],
          ].map(([label, value]) => (
            <div key={label}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(13,27,46,0.7)', fontWeight: 700, marginBottom: '2px' }}>
                {label}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(13,27,46,0.8)' }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Link>
  )
}
