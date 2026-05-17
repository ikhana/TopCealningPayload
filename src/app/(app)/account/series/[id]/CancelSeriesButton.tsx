'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Loader2 } from 'lucide-react'

export function CancelSeriesButton({
  seriesId,
  upcomingCount,
}: {
  seriesId: string
  upcomingCount: number
}) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCancel = async () => {
    setLoading(true)
    setError(null)
    try {
      // We use the booking cancel endpoint with scope=series.
      // It needs ANY booking ID from the series to identify the series.
      // Fetch one booking from the series first.
      const fetchRes = await fetch(`/api/bookings?where[series][equals]=${seriesId}&limit=1&depth=0`)
      if (!fetchRes.ok) {
        setError('Could not load series.')
        return
      }
      const { docs } = await fetchRes.json()
      const firstBookingId = docs?.[0]?.id
      if (!firstBookingId) {
        setError('No bookings found in this series.')
        return
      }

      const res = await fetch(`/api/bookings/${firstBookingId}/cancel?scope=series`, { method: 'PATCH' })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Cancellation failed. Please try again.')
        return
      }
      router.push('/account/bookings?cancelled=series')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!confirming) {
    return (
      <div style={{ textAlign: 'right' }}>
        <button
          onClick={() => setConfirming(true)}
          style={{
            background: 'none',
            border: '1px solid rgba(239,68,68,0.35)',
            color: '#dc2626',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            padding: '9px 18px',
            cursor: 'pointer',
          }}
        >
          Cancel Entire Series
        </button>
      </div>
    )
  }

  return (
    <div style={{ border: '1px solid #fca5a5', background: '#fef2f2', padding: '20px 24px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
        <AlertTriangle size={18} style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-navy-deep)', marginBottom: '4px' }}>
            Cancel the whole series?
          </div>
          <div style={{ fontSize: '0.82rem', color: 'rgba(74,90,106,0.75)', lineHeight: 1.6 }}>
            All <strong>{upcomingCount}</strong> upcoming cleaning{upcomingCount === 1 ? '' : 's'} in this series will be cancelled.
            Past/completed cleanings stay in your history.
          </div>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#dc2626' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setConfirming(false)}
          disabled={loading}
          style={{
            background: 'none',
            border: '1px solid rgba(13,27,46,0.12)',
            color: 'rgba(74,90,106,0.7)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            padding: '9px 18px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          Keep Series
        </button>
        <button
          onClick={handleCancel}
          disabled={loading}
          style={{
            background: loading ? 'rgba(220,38,38,0.5)' : '#dc2626',
            border: 'none',
            color: 'white',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            padding: '9px 18px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {loading && <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />}
          {loading ? 'Cancelling...' : 'Yes, Cancel Series'}
        </button>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
