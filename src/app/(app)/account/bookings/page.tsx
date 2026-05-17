import type { Metadata } from 'next'
import { getMeUser } from '@/utilities/getMeUser'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { AccountNav } from '@/components/AccountNav'
import Link from 'next/link'
import type { Booking, BookingSery as BookingSeries } from '@/payload-types'
import { BookingCard } from './BookingCard'
import { SeriesCard } from './SeriesCard'

type SeriesGroup = { kind: 'series'; series: BookingSeries; bookings: Booking[]; sortKey: number }
type SingleGroup = { kind: 'single'; booking: Booking; sortKey: number }
type Group = SeriesGroup | SingleGroup

function groupBookings(bookings: Booking[]): Group[] {
  const seriesGroups = new Map<number, SeriesGroup>()
  const singles: SingleGroup[] = []

  for (const booking of bookings) {
    const series = typeof booking.series === 'object' ? booking.series : null
    const seriesId = series?.id ?? (typeof booking.series === 'number' ? booking.series : null)

    if (!seriesId || !series) {
      singles.push({
        kind: 'single',
        booking,
        sortKey: new Date(booking.createdAt).getTime(),
      })
      continue
    }

    let group = seriesGroups.get(seriesId)
    if (!group) {
      group = {
        kind: 'series',
        series,
        bookings: [],
        sortKey: new Date(series.createdAt).getTime(),
      }
      seriesGroups.set(seriesId, group)
    }
    group.bookings.push(booking)
  }

  // Combine + sort by most recent first
  return [...seriesGroups.values(), ...singles].sort((a, b) => b.sortKey - a.sortKey)
}

export default async function BookingsPage() {
  const { user, token } = await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent('You must be logged in to view your bookings.')}&redirect=${encodeURIComponent('/account/bookings')}`,
  })

  let bookings: Booking[] = []

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookings?depth=1&sort=-createdAt&limit=50&where[user][equals]=${user?.id}`,
      {
        cache: 'no-store',
        headers: {
          Authorization: `JWT ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )
    if (res.ok) {
      const json = await res.json()
      bookings = json.docs ?? []
    }
  } catch {
    // Render empty state rather than crashing
  }

  const groups = groupBookings(bookings)

  return (
    <div>
      <div className="container mt-8 md:mt-16 pb-16 flex flex-col md:flex-row gap-6 md:gap-8">
        <AccountNav className="w-full md:max-w-[17.5rem] md:grow flex flex-row md:flex-col items-start gap-2 md:gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0 border-b md:border-b-0 border-navy-deep/10" />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', fontWeight: 900, letterSpacing: '-1px', color: 'var(--color-navy-deep)', margin: 0 }}>
              My Bookings
            </h1>
            <Link
              href="/booking"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: 'white',
                background: 'var(--color-teal)',
                padding: '10px 20px',
                textDecoration: 'none',
              }}
            >
              + Book Cleaning
            </Link>
          </div>

          {groups.length === 0 ? (
            <div style={{ border: '1px solid rgba(13,27,46,0.08)', padding: '48px 32px', textAlign: 'center', background: 'white' }}>
              <p style={{ fontSize: '1rem', color: 'rgba(74,90,106,0.6)', marginBottom: '20px' }}>
                You have no bookings yet.
              </p>
              <Link
                href="/booking"
                style={{ color: 'var(--color-teal)', fontWeight: 700, fontSize: '0.9rem' }}
              >
                Book your first cleaning →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {groups.map((group) => {
                if (group.kind === 'series') {
                  return <SeriesCard key={`series-${group.series.id}`} series={group.series} bookings={group.bookings} />
                }
                return <BookingCard key={`booking-${group.booking.id}`} booking={group.booking} />
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'My Bookings',
  description: 'View and manage your cleaning bookings.',
  openGraph: mergeOpenGraph({
    title: 'My Bookings',
    url: '/account/bookings',
  }),
}
