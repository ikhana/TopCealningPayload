'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import type { Booking, BookingSery as BookingSeries } from '@/payload-types'
import { ChevronDown, ChevronUp, Repeat } from 'lucide-react'

const FREQUENCY_LABELS: Record<string, string> = {
  weekly: 'Weekly',
  biweekly: 'Biweekly',
  '3weekly': 'Every 3 Weeks',
  monthly: 'Monthly',
  '8weekly': 'Every 8 Weeks',
}

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  active:    { bg: '#ccfbf1', text: '#065f46', label: 'Active' },
  paused:    { bg: '#fef9c3', text: '#854d0e', label: 'Paused' },
  cancelled: { bg: '#f3f4f6', text: '#6b7280', label: 'Cancelled' },
}

const OCC_STATUS_COLORS: Record<string, string> = {
  pending: '#854d0e',
  confirmed: '#065f46',
  'in-progress': '#1e40af',
  completed: '#166534',
  cancelled: '#6b7280',
  refunded: '#991b1b',
}

function formatOccurrenceDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
      timeZone: 'America/New_York',
    })
  } catch { return iso }
}

export function SeriesCard({
  series,
  bookings,
}: {
  series: BookingSeries
  bookings: Booking[]
}) {
  const [expanded, setExpanded] = useState(true)
  const statusStyle = STATUS_COLORS[series.status] ?? STATUS_COLORS.active!

  // Sort occurrences by seriesOccurrence ascending
  const sorted = [...bookings].sort((a, b) => (a.seriesOccurrence ?? 0) - (b.seriesOccurrence ?? 0))
  const next = sorted.find((b) => b.status === 'pending' || b.status === 'confirmed')

  return (
    <div style={{ border: '1px solid rgba(13,27,46,0.08)', background: 'white' }}>
      {/* Header */}
      <div
        onClick={() => setExpanded((e) => !e)}
        style={{
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          cursor: 'pointer',
          background: '#fafbfc',
          borderBottom: expanded ? '1px solid rgba(13,27,46,0.08)' : 'none',
        }}
      >
        <Repeat size={18} style={{ color: 'var(--color-teal)', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-navy-deep)' }}>
              {FREQUENCY_LABELS[series.frequency] ?? series.frequency} Cleaning Series
            </span>
            <span style={{
              padding: '2px 8px',
              background: statusStyle.bg,
              color: statusStyle.text,
              fontSize: '0.6rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              borderRadius: '2px',
            }}>
              {statusStyle.label}
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(74,90,106,0.7)', fontWeight: 600 }}>
            {bookings.length} cleaning{bookings.length === 1 ? '' : 's'}
            {next && next.serviceTime && (
              <> · Next: {formatOccurrenceDate(next.serviceTime)}</>
            )}
          </div>
        </div>
        <Link
          href={`/account/series/${series.id}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            fontWeight: 700,
            color: 'var(--color-teal)',
            textDecoration: 'none',
            letterSpacing: '0.05em',
            padding: '6px 10px',
            border: '1px solid rgba(23,176,171,0.3)',
            flexShrink: 0,
          }}
        >
          Manage →
        </Link>
        {expanded ? (
          <ChevronUp size={18} style={{ color: 'rgba(74,90,106,0.5)', flexShrink: 0 }} />
        ) : (
          <ChevronDown size={18} style={{ color: 'rgba(74,90,106,0.5)', flexShrink: 0 }} />
        )}
      </div>

      {/* Expanded list of occurrences */}
      {expanded && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {sorted.map((booking) => {
            const isCancelled = booking.status === 'cancelled'
            return (
              <li
                key={booking.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 24px',
                  borderBottom: '1px solid rgba(13,27,46,0.05)',
                  opacity: isCancelled ? 0.55 : 1,
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: 'rgba(13,27,46,0.5)',
                  letterSpacing: '0.05em',
                  minWidth: '24px',
                }}>
                  #{booking.seriesOccurrence ?? '—'}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-navy-deep)', marginBottom: '2px' }}>
                    {booking.serviceTime ? formatOccurrenceDate(booking.serviceTime) : '—'}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--color-teal)', letterSpacing: '0.08em' }}>
                    {booking.confirmationCode}
                  </div>
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  color: OCC_STATUS_COLORS[booking.status] ?? '#6b7280',
                  flexShrink: 0,
                }}>
                  {booking.status}
                </span>
                <Link
                  href={`/account/bookings/${booking.id}`}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: 'var(--color-teal)',
                    textDecoration: 'none',
                    letterSpacing: '0.05em',
                    padding: '6px 10px',
                    border: '1px solid rgba(23,176,171,0.3)',
                    flexShrink: 0,
                  }}
                >
                  View →
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
