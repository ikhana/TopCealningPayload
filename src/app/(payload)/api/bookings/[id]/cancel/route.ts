import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getMeUser } from '@/utilities/getMeUser'
import { cancelAppointment } from '@/lib/ghl/appointments'
import { moveStage } from '@/lib/ghl/opportunities'
import type { Booking } from '@/payload-types'

export const dynamic = 'force-dynamic'

function hoursUntilService(serviceDate: string, serviceTime: string): number {
  // serviceTime may be ISO or "09:00:00" — build a full datetime
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const { user } = await getMeUser({})
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const payload = await getPayload({ config: configPromise })

  // Load booking
  let booking: Booking
  try {
    booking = await payload.findByID({ collection: 'bookings', id: parseInt(id, 10) }) as Booking
  } catch {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  // Ownership check (admins can cancel anything)
  const isAdmin = user.roles?.includes('admin')
  const bookingUserId = typeof booking.user === 'object' ? booking.user?.id : booking.user
  if (!isAdmin && bookingUserId !== user.id) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  // Can only cancel pending or confirmed bookings
  if (booking.status !== 'pending' && booking.status !== 'confirmed') {
    return NextResponse.json(
      { error: `Cannot cancel a booking with status "${booking.status}"` },
      { status: 409 },
    )
  }

  const hours = hoursUntilService(booking.serviceDate, booking.serviceTime)
  const policy = getCancellationPolicy(hours)

  // Cancel GHL appointment (best-effort)
  if (booking.ghlAppointmentId) {
    await cancelAppointment(booking.ghlAppointmentId).catch((err) =>
      console.error('[cancel] GHL appointment cancel failed', err),
    )
  }

  // Move GHL opportunity to Cancelled stage (best-effort)
  if (booking.ghlOpportunityId) {
    const cancelledStage = process.env.GHL_PIPELINE_STAGE_CANCELLED
    if (cancelledStage) {
      await moveStage(booking.ghlOpportunityId, cancelledStage).catch((err) =>
        console.error('[cancel] GHL opportunity move failed', err),
      )
    }
  }

  // Mark cancelled in Payload
  await payload.update({
    collection: 'bookings',
    id: parseInt(id, 10),
    data: { status: 'cancelled' },
  })

  return NextResponse.json({
    ok: true,
    bookingId: id,
    policy: policy.label,
    // chargeRequired will be acted on in Stage 6 when payment credentials are available
    chargeRequired: policy.chargeRequired,
    feePercent: policy.feePercent,
  })
}
