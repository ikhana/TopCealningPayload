'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Loader2 } from 'lucide-react'

function hoursUntil(serviceDate: string, serviceTime: string): number {
  const isoDateTime = serviceTime.includes('T') ? serviceTime : `${serviceDate}T${serviceTime}`
  return (new Date(isoDateTime).getTime() - Date.now()) / (1000 * 60 * 60)
}

function policyLabel(hours: number): string {
  if (hours >= 24) return 'No cancellation fee applies.'
  if (hours >= 1)  return 'A 50% cancellation fee applies — this booking is within 24 hours.'
  return 'A full-service charge applies — this booking is same-day.'
}

export function CancelButton({
  bookingId,
  serviceDate,
  serviceTime,
}: {
  bookingId: string
  serviceDate: string
  serviceTime: string
}) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hours = hoursUntil(serviceDate, serviceTime)
  const policy = policyLabel(hours)
  const hasFee = hours < 24

  const handleCancel = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'PATCH' })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Cancellation failed. Please try again.')
        return
      }
      router.push('/account/bookings?cancelled=1')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!confirming) {
    return (
      <div style={{ marginTop: '16px', textAlign: 'right' }}>
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
          Cancel Booking
        </button>
      </div>
    )
  }

  return (
    <div style={{
      marginTop: '16px',
      border: `1px solid ${hasFee ? '#fca5a5' : 'rgba(13,27,46,0.1)'}`,
      background: hasFee ? '#fef2f2' : 'white',
      padding: '20px 24px',
    }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
        <AlertTriangle size={18} style={{ color: hasFee ? '#dc2626' : 'rgba(74,90,106,0.5)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-navy-deep)', marginBottom: '4px' }}>
            Confirm Cancellation
          </div>
          <div style={{ fontSize: '0.82rem', color: 'rgba(74,90,106,0.75)', lineHeight: 1.6 }}>
            {policy}
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
          Keep Booking
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
          {loading ? 'Cancelling...' : 'Yes, Cancel'}
        </button>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
