import type { Metadata } from 'next'
import { getMeUser } from '@/utilities/getMeUser'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { AccountNav } from '@/components/AccountNav'
import Link from 'next/link'
import type { Booking } from '@/payload-types'
import { BookingCard } from './BookingCard'

export default async function BookingsPage() {
  const { user, token } = await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent('You must be logged in to view your bookings.')}&redirect=${encodeURIComponent('/account/bookings')}`,
  })

  let bookings: Booking[] = []

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookings?depth=0&sort=-createdAt&limit=20&where[user][equals]=${user?.id}`,
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

  return (
    <div>
      <div className="container mt-16 pb-16 flex gap-8">
        <AccountNav className="max-w-[17.5rem] grow flex flex-col items-start gap-4" />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-1px', color: 'var(--color-navy-deep)', margin: 0 }}>
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

          {bookings.length === 0 ? (
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
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
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
