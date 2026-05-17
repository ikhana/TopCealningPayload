import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getMeUser } from '@/utilities/getMeUser'
import { cancelAppointment } from '@/lib/ghl/appointments'
import { moveStage } from '@/lib/ghl/opportunities'
import type { Booking } from '@/payload-types'

export const dynamic = 'force-dynamic'

function hoursUntilService(serviceDate: string, serviceTime: string): number {
  let isoDateTime: string
  if (serviceTime.includes('T')) {
    isoDateTime = serviceTime
  } else {
    isoDateTime = `${serviceDate}T${serviceTime}`
  }
  const serviceMs = new Date(isoDateTime).getTime()
  return (serviceMs - Date.now()) / (1000 * 60 * 60)
}

function getCancellationPolicy(hours: number): {
  feePercent: number
  label: string
  chargeRequired: boolean
} {
  if (hours >= 24)  return { feePercent: 0,   label: 'No fee',        chargeRequired: false }
  if (hours >= 1)   return { feePercent: 50,  label: '50% fee',       chargeRequired: true  }
  return                   { feePercent: 100, label: 'Full charge',    chargeRequired: true  }
}

/**
 * Cancel one booking — handles the GHL sync (delete appointment + move opportunity).
 * Returns the policy that applied. Does NOT throw on GHL failures (best-effort).
 */
async function cancelOneBooking(payload: Awaited<ReturnType<typeof getPayload>>, booking: Booking) {
  // Skip already-cancelled / completed bookings
  if (booking.status !== 'pending' && booking.status !== 'confirmed') {
    return { skipped: true, status: booking.status, policy: null }
  }

  const hours = hoursUntilService(booking.serviceDate, booking.serviceTime)
  const policy = getCancellationPolicy(hours)

  if (booking.ghlAppointmentId) {
    await cancelAppointment(booking.ghlAppointmentId).catch((err) =>
      console.error('[cancel] GHL appointment cancel failed', { bookingId: booking.id, error: err }),
    )
  }

  if (booking.ghlOpportunityId) {
    const cancelledStage = process.env.GHL_PIPELINE_STAGE_CANCELLED
    if (cancelledStage) {
      await moveStage(booking.ghlOpportunityId, cancelledStage).catch((err) =>
        console.error('[cancel] GHL opportunity move failed', { bookingId: booking.id, error: err }),
      )
    }
  }

  await payload.update({
    collection: 'bookings',
    id: booking.id,
    data: { status: 'cancelled' },
  })

  return { skipped: false, status: 'cancelled', policy }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const { searchParams } = request.nextUrl
  const scope = searchParams.get('scope') === 'series' ? 'series' : 'single'

  const { user } = await getMeUser({})
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const payload = await getPayload({ config: configPromise })

  let booking: Booking
  try {
    booking = await payload.findByID({ collection: 'bookings', id: parseInt(id, 10), depth: 0 }) as Booking
  } catch {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  const isAdmin = user.roles?.includes('admin')
  const bookingUserId = typeof booking.user === 'object' ? booking.user?.id : booking.user
  if (!isAdmin && bookingUserId !== user.id) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  // Single-occurrence cancel
  if (scope === 'single') {
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return NextResponse.json(
        { error: `Cannot cancel a booking with status "${booking.status}"` },
        { status: 409 },
      )
    }
    const result = await cancelOneBooking(payload, booking)
    return NextResponse.json({
      ok: true,
      scope: 'single',
      bookingId: id,
      policy: result.policy?.label ?? null,
      chargeRequired: result.policy?.chargeRequired ?? false,
      feePercent: result.policy?.feePercent ?? 0,
    })
  }

  // Series cancel — booking must belong to a series
  const seriesId = typeof booking.series === 'object' ? booking.series?.id : booking.series
  if (!seriesId) {
    return NextResponse.json(
      { error: 'This booking is not part of a recurring series' },
      { status: 400 },
    )
  }

  // Find all bookings in this series
  const seriesBookings = await payload.find({
    collection: 'bookings',
    where: { series: { equals: seriesId } },
    limit: 100,
    depth: 0,
  })

  // Cancel each cancellable one
  const results: Array<{ bookingId: number; status: string }> = []
  for (const bk of seriesBookings.docs as Booking[]) {
    const r = await cancelOneBooking(payload, bk)
    results.push({ bookingId: bk.id, status: r.status })
  }

  // Mark the series itself cancelled
  await payload.update({
    collection: 'booking-series',
    id: seriesId,
    data: {
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      cancellationReason: 'Customer cancelled the recurring series',
    },
  }).catch((err) => console.error('[cancel] BookingSeries update failed', err))

  return NextResponse.json({
    ok: true,
    scope: 'series',
    seriesId,
    cancelledCount: results.filter((r) => r.status === 'cancelled').length,
    skippedCount: results.filter((r) => r.status !== 'cancelled').length,
    results,
  })
}
