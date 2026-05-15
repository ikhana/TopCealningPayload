import type { Metadata } from 'next'
import { getMeUser } from '@/utilities/getMeUser'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { AccountNav } from '@/components/AccountNav'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Booking } from '@/payload-types'
import { CancelButton } from './CancelButton'

const STATUS_STEPS = ['pending', 'confirmed', 'in-progress', 'completed']

const STATUS_LABELS: Record<string, string> = {
  pending:       'Pending',
  confirmed:     'Confirmed',
  'in-progress': 'In Progress',
  completed:     'Completed',
  cancelled:     'Cancelled',
  refunded:      'Refunded',
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending:       { bg: '#fef9c3', text: '#854d0e' },
  confirmed:     { bg: '#ccfbf1', text: '#065f46' },
  'in-progress': { bg: '#dbeafe', text: '#1e40af' },
  completed:     { bg: '#dcfce7', text: '#166534' },
  cancelled:     { bg: '#f3f4f6', text: '#6b7280' },
  refunded:      { bg: '#fee2e2', text: '#991b1b' },
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

const FREQUENCY_LABELS: Record<string, string> = {
  'one-time': 'One-time',
  weekly:     'Weekly',
  biweekly:   'Biweekly',
  '3weekly':  'Every 3 weeks',
  monthly:    'Monthly',
  '8weekly':  'Every 8 weeks',
}

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { user, token } = await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent('You must be logged in.')}&redirect=${encodeURIComponent(`/account/bookings/${id}`)}`,
  })

  let booking: Booking | null = null

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookings/${id}?depth=0`,
      {
        cache: 'no-store',
        headers: {
          Authorization: `JWT ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )
    if (res.ok) {
      booking = await res.json()
    } else if (res.status === 404) {
      notFound()
    }
  } catch {
    notFound()
  }

  if (!booking) notFound()

  const address = booking.address
  const property = booking.property
  const pricing = booking.pricing

  const dateStr = booking.serviceDate
    ? new Date(`${booking.serviceDate}T12:00:00`).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      })
    : '—'

  // serviceTime is stored as ISO (e.g. "2026-05-21T12:00:00-04:00") — format to "12:00 PM"
  const timeStr = booking.serviceTime
    ? (booking.serviceTime.includes('T')
        ? new Date(booking.serviceTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        : booking.serviceTime)
    : '—'

  const statusStyle = STATUS_COLORS[booking.status] ?? STATUS_COLORS.pending!
  const statusIdx = STATUS_STEPS.indexOf(booking.status)
  const isCancelledOrRefunded = booking.status === 'cancelled' || booking.status === 'refunded'

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', fontWeight: 900, letterSpacing: '-1px', color: 'var(--color-navy-deep)', margin: '0 0 6px' }}>
                {SERVICE_LABELS[booking.serviceType] ?? booking.serviceType}
              </h1>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-teal)', letterSpacing: '0.1em', fontWeight: 700 }}>
                {booking.confirmationCode}
              </div>
            </div>
            <span style={{
              display: 'inline-block', padding: '6px 14px',
              background: statusStyle.bg, color: statusStyle.text,
              fontSize: '0.72rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
              letterSpacing: '0.5px', textTransform: 'uppercase', borderRadius: '2px',
            }}>
              {STATUS_LABELS[booking.status] ?? booking.status}
            </span>
          </div>

          {/* Status timeline (only for non-cancelled) */}
          {!isCancelledOrRefunded && (
            <div style={{ border: '1px solid rgba(13,27,46,0.08)', padding: '24px', background: 'white', marginBottom: '24px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(13,27,46,0.7)', fontWeight: 700, marginBottom: '16px' }}>
                Status Timeline
              </div>
              <div style={{ display: 'flex', gap: '0', alignItems: 'center' }}>
                {STATUS_STEPS.map((step, i) => {
                  const isDone = statusIdx >= i
                  const isActive = statusIdx === i
                  return (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STATUS_STEPS.length - 1 ? 1 : 'none' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                          width: '12px', height: '12px', borderRadius: '50%',
                          background: isDone ? 'var(--color-teal)' : 'rgba(13,27,46,0.1)',
                          border: isActive ? '2px solid var(--color-teal)' : 'none',
                          boxShadow: isActive ? '0 0 0 3px rgba(23,176,171,0.2)' : 'none',
                        }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: isDone ? 'var(--color-teal)' : 'rgba(74,90,106,0.4)', textAlign: 'center', fontWeight: isDone ? 700 : 400 }}>
                          {STATUS_LABELS[step]}
                        </span>
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div style={{ flex: 1, height: '1px', background: statusIdx > i ? 'var(--color-teal)' : 'rgba(13,27,46,0.1)', margin: '0 4px', marginBottom: '16px' }} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Detail grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>

            {/* Appointment */}
            <div style={{ border: '1px solid rgba(13,27,46,0.08)', padding: '20px 24px', background: 'white' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(13,27,46,0.7)', fontWeight: 700, marginBottom: '14px' }}>Appointment</div>
              {[
                ['Date', dateStr],
                ['Time', timeStr],
                ['Service', SERVICE_LABELS[booking.serviceType] ?? booking.serviceType],
                ['Frequency', FREQUENCY_LABELS[booking.frequency] ?? booking.frequency],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'rgba(74,90,106,0.6)' }}>{label}</span>
                  <span style={{ fontWeight: 600, color: 'rgba(13,27,46,0.85)', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Address */}
            {address && (
              <div style={{ border: '1px solid rgba(13,27,46,0.08)', padding: '20px 24px', background: 'white' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(13,27,46,0.7)', fontWeight: 700, marginBottom: '14px' }}>Location</div>
                <p style={{ fontSize: '0.88rem', color: 'rgba(13,27,46,0.8)', lineHeight: 1.6, margin: 0 }}>
                  {address.street}{address.apt ? `, Apt ${address.apt}` : ''}<br />
                  {address.city}, {address.state} {address.zipCode}
                </p>
                {booking.accessMethod && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(13,27,46,0.06)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(13,27,46,0.7)', fontWeight: 700, marginBottom: '4px' }}>Access</div>
                    <span style={{ fontSize: '0.82rem', color: 'rgba(13,27,46,0.75)' }}>{booking.accessMethod}</span>
                  </div>
                )}
              </div>
            )}

            {/* Property */}
            {property && (
              <div style={{ border: '1px solid rgba(13,27,46,0.08)', padding: '20px 24px', background: 'white' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(13,27,46,0.7)', fontWeight: 700, marginBottom: '14px' }}>Property</div>
                {[
                  property.squareFootage && ['Sq. Footage', `${property.squareFootage} sq ft`],
                  property.bedrooms && ['Bedrooms', property.bedrooms],
                  property.bathrooms != null && ['Bathrooms', String(property.bathrooms)],
                  booking.hasChildren !== undefined && ['Children present', booking.hasChildren ? 'Yes' : 'No'],
                  booking.hasPets !== undefined && ['Pets present', booking.hasPets ? 'Yes' : 'No'],
                ].filter(Boolean).map((row) => {
                  const [label, value] = row as [string, string]
                  return (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                      <span style={{ color: 'rgba(74,90,106,0.6)' }}>{label}</span>
                      <span style={{ fontWeight: 600, color: 'rgba(13,27,46,0.85)' }}>{value}</span>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Pricing */}
            {pricing && (
              <div style={{ border: '1px solid rgba(13,27,46,0.08)', padding: '20px 24px', background: 'white' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(13,27,46,0.7)', fontWeight: 700, marginBottom: '14px' }}>Pricing</div>
                {[
                  ['Base Service', `$${(pricing.basePrice ?? 0).toFixed(2)}`],
                  pricing.extrasTotal ? ['Add-ons', `+$${pricing.extrasTotal.toFixed(2)}`] : null,
                  pricing.discount ? ['Discount', `-$${pricing.discount.toFixed(2)}`] : null,
                ].filter(Boolean).map((row) => {
                  const [label, value] = row as [string, string]
                  return (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                      <span style={{ color: 'rgba(74,90,106,0.6)' }}>{label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'rgba(13,27,46,0.75)' }}>{value}</span>
                    </div>
                  )
                })}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid rgba(13,27,46,0.08)', marginTop: '4px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1rem', color: 'var(--color-teal)' }}>
                    ${(pricing.total ?? 0).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Extras */}
          {booking.selectedExtras && booking.selectedExtras.length > 0 && (
            <div style={{ border: '1px solid rgba(13,27,46,0.08)', padding: '20px 24px', background: 'white', marginBottom: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(13,27,46,0.7)', fontWeight: 700, marginBottom: '14px' }}>Selected Extras</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {booking.selectedExtras.map((extra) => (
                  <span key={extra.extraId} style={{
                    padding: '5px 12px',
                    background: 'rgba(23,176,171,0.08)',
                    border: '1px solid rgba(23,176,171,0.2)',
                    fontSize: '0.78rem',
                    color: 'var(--color-navy-deep)',
                  }}>
                    {extra.label} {extra.price > 0 ? `(+$${extra.price.toFixed(2)})` : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Help CTA */}
          <div style={{ border: '1px solid rgba(13,27,46,0.08)', padding: '20px 24px', background: '#f5efe0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-navy-deep)', marginBottom: '3px' }}>Need help with this booking?</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(74,90,106,0.7)' }}>Our team is happy to assist with changes or questions.</div>
            </div>
            <a
              href="tel:+1-555-000-0000"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: 'white',
                background: 'var(--color-navy-deep)',
                padding: '10px 20px',
                textDecoration: 'none',
              }}
            >
              Contact Us
            </a>
          </div>

          {/* Cancel */}
          {(booking.status === 'pending' || booking.status === 'confirmed') && (
            <CancelButton
              bookingId={String(booking.id)}
              serviceDate={booking.serviceDate}
              serviceTime={booking.serviceTime}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Booking Details',
  openGraph: mergeOpenGraph({ title: 'Booking Details', url: '/account/bookings' }),
}
