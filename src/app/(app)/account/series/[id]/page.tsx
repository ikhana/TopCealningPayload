import type { Metadata } from 'next'
import { getMeUser } from '@/utilities/getMeUser'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { AccountNav } from '@/components/AccountNav'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Booking, BookingSery as BookingSeries } from '@/payload-types'
import { CancelSeriesButton } from './CancelSeriesButton'

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

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatOccurrenceDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
      timeZone: 'America/New_York',
    })
  } catch { return iso }
}

export default async function SeriesDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { user, token } = await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent('You must be logged in.')}&redirect=${encodeURIComponent(`/account/series/${id}`)}`,
  })

  let series: BookingSeries | null = null
  let bookings: Booking[] = []

  try {
    // Fetch the series
    const seriesRes = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/booking-series/${id}?depth=0`,
      {
        cache: 'no-store',
        headers: {
          Authorization: `JWT ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )
    if (seriesRes.ok) {
      series = await seriesRes.json()
    } else if (seriesRes.status === 404) {
      notFound()
    }

    // Fetch all bookings in this series
    const bookingsRes = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookings?depth=0&sort=seriesOccurrence&limit=50&where[series][equals]=${id}`,
      {
        cache: 'no-store',
        headers: {
          Authorization: `JWT ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )
    if (bookingsRes.ok) {
      const json = await bookingsRes.json()
      bookings = json.docs ?? []
    }
  } catch {
    notFound()
  }

  if (!series) notFound()

  // Ownership check (server-rendered; Payload's read access already filters but double-check here)
  const seriesUserId = typeof series.user === 'object' ? series.user?.id : series.user
  const isAdmin = user?.roles?.includes('admin')
  if (!isAdmin && seriesUserId !== user?.id) notFound()

  const statusStyle = STATUS_COLORS[series.status] ?? STATUS_COLORS.active!
  const totalCleanings = bookings.length
  const completedCount = bookings.filter((b) => b.status === 'completed').length
  const upcomingCount = bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed').length
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length
  const nextBooking = bookings.find((b) => b.status === 'pending' || b.status === 'confirmed')

  const canCancelSeries = series.status === 'active' || series.status === 'paused'

  return (
    <div>
      <div className="container mt-8 md:mt-16 pb-16 flex flex-col md:flex-row gap-6 md:gap-8">
        <AccountNav className="w-full md:max-w-[17.5rem] md:grow flex flex-row md:flex-col items-start gap-2 md:gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0 border-b md:border-b-0 border-navy-deep/10" />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Back link */}
          <Link
            href="/account/bookings"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-teal)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '24px', letterSpacing: '0.05em' }}
          >
            ← All Bookings
          </Link>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', fontWeight: 900, letterSpacing: '-1px', color: 'var(--color-navy-deep)', margin: '0 0 6px' }}>
                {FREQUENCY_LABELS[series.frequency] ?? series.frequency} Cleaning Series
              </h1>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(74,90,106,0.6)', letterSpacing: '0.05em' }}>
                Series #{series.id}
              </div>
            </div>
            <span style={{
              display: 'inline-block', padding: '6px 14px',
              background: statusStyle.bg, color: statusStyle.text,
              fontSize: '0.72rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
              letterSpacing: '0.5px', textTransform: 'uppercase', borderRadius: '2px',
            }}>
              {statusStyle.label}
            </span>
          </div>

          {/* Stat tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {[
              ['Total', String(totalCleanings)],
              ['Upcoming', String(upcomingCount)],
              ['Completed', String(completedCount)],
              ['Cancelled', String(cancelledCount)],
            ].map(([label, value]) => (
              <div key={label} style={{ border: '1px solid rgba(13,27,46,0.08)', background: 'white', padding: '16px 20px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700, color: 'rgba(13,27,46,0.7)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
                  {label}
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-navy-deep)' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Series details */}
          <div style={{ border: '1px solid rgba(13,27,46,0.08)', background: 'white', padding: '20px 24px', marginBottom: '24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700, color: 'rgba(13,27,46,0.7)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px' }}>
              Schedule
            </div>
            {[
              ['Frequency', FREQUENCY_LABELS[series.frequency] ?? series.frequency],
              ['Anchor day', DAY_NAMES[series.anchorDayOfWeek] ?? '—'],
              ['Anchor time', series.anchorTime],
              ['Created', new Date(series.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })],
              nextBooking && nextBooking.serviceTime ? ['Next cleaning', formatOccurrenceDate(nextBooking.serviceTime)] : null,
              series.cancelledAt ? ['Cancelled at', new Date(series.cancelledAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })] : null,
            ].filter(Boolean).map((row) => {
              const [label, value] = row as [string, string]
              return (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'rgba(74,90,106,0.65)' }}>{label}</span>
                  <span style={{ fontWeight: 600, color: 'rgba(13,27,46,0.85)' }}>{value}</span>
                </div>
              )
            })}
          </div>

          {/* Occurrences list */}
          <div style={{ border: '1px solid rgba(13,27,46,0.08)', background: 'white', marginBottom: '24px' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(13,27,46,0.08)', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700, color: 'rgba(13,27,46,0.7)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              All occurrences
            </div>
            {bookings.length === 0 ? (
              <div style={{ padding: '24px', color: 'rgba(74,90,106,0.6)', fontSize: '0.88rem' }}>
                No bookings in this series.
              </div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {bookings.map((booking) => (
                  <li
                    key={booking.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '14px 24px',
                      borderBottom: '1px solid rgba(13,27,46,0.05)',
                      opacity: booking.status === 'cancelled' ? 0.5 : 1,
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700,
                      color: 'rgba(13,27,46,0.5)', letterSpacing: '0.05em', minWidth: '24px',
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
                      fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700,
                      letterSpacing: '0.5px', textTransform: 'uppercase',
                      color: OCC_STATUS_COLORS[booking.status] ?? '#6b7280', flexShrink: 0,
                    }}>
                      {booking.status}
                    </span>
                    <Link
                      href={`/account/bookings/${booking.id}`}
                      style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700,
                        color: 'var(--color-teal)', textDecoration: 'none', letterSpacing: '0.05em',
                        padding: '6px 10px', border: '1px solid rgba(23,176,171,0.3)', flexShrink: 0,
                      }}
                    >
                      View →
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Cancel-series action */}
          {canCancelSeries && upcomingCount > 0 && (
            <CancelSeriesButton seriesId={String(series.id)} upcomingCount={upcomingCount} />
          )}
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Booking Series',
  openGraph: mergeOpenGraph({ title: 'Booking Series', url: '/account/bookings' }),
}
