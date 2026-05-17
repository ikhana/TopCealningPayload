// POST /api/webhooks/ghl
// Receives webhook events from GoHighLevel. Currently handles appointment
// status changes so the Payload Booking record stays in sync when the
// appointment is cancelled/deleted directly in GHL UI.
//
// To configure:
//   1. GHL → Settings → Integrations → Webhooks → Add Webhook
//   2. URL: https://<your-domain>/api/webhooks/ghl
//   3. Events: AppointmentCreate, AppointmentUpdate, AppointmentDelete
//   4. Copy the signing secret to GHL_WEBHOOK_SIGNING_SECRET in .env
//
// Security: Signature verification is a TODO once GHL_WEBHOOK_SIGNING_SECRET
// is configured. For now we trust the payload and log everything for audit.

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Booking } from '@/payload-types'

export const dynamic = 'force-dynamic'

type GhlAppointmentEvent = {
  type?: string                 // 'AppointmentCreate' | 'AppointmentUpdate' | 'AppointmentDelete'
  locationId?: string
  // Payload shape varies — try multiple keys for resilience
  id?: string                   // appointment id (on Delete)
  appointmentId?: string        // appointment id (on Update)
  appointment?: {
    id?: string
    status?: string
    appointmentStatus?: string
  }
  // raw passthrough
  [key: string]: unknown
}

function extractAppointmentId(body: GhlAppointmentEvent): string | undefined {
  return body.appointment?.id ?? body.appointmentId ?? body.id
}

function extractStatus(body: GhlAppointmentEvent): string | undefined {
  return body.appointment?.status ?? body.appointment?.appointmentStatus
}

export async function POST(request: NextRequest) {
  let body: GhlAppointmentEvent
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  console.log('[webhook:ghl] Received', {
    type: body.type,
    appointmentId: extractAppointmentId(body),
    status: extractStatus(body),
  })

  // TODO: signature verification once GHL_WEBHOOK_SIGNING_SECRET is configured

  const type = body.type
  const ghlAppointmentId = extractAppointmentId(body)
  if (!ghlAppointmentId) {
    return NextResponse.json({ ok: true, ignored: 'no appointment id in payload' })
  }

  const isCancellation =
    type === 'AppointmentDelete' ||
    (type === 'AppointmentUpdate' && extractStatus(body)?.toLowerCase() === 'cancelled')

  if (!isCancellation) {
    // Not an event we handle yet — acknowledge and move on
    return NextResponse.json({ ok: true, ignored: `unhandled event type: ${type}` })
  }

  const payload = await getPayload({ config: configPromise })

  // Find the Payload booking that references this GHL appointment
  const found = await payload.find({
    collection: 'bookings',
    where: { ghlAppointmentId: { equals: ghlAppointmentId } },
    limit: 1,
    depth: 0,
  })

  if (found.docs.length === 0) {
    console.warn('[webhook:ghl] No Payload booking found for GHL appointment', { ghlAppointmentId })
    return NextResponse.json({ ok: true, ignored: 'booking not found' })
  }

  const booking = found.docs[0] as Booking

  // Already cancelled — no-op
  if (booking.status === 'cancelled') {
    return NextResponse.json({ ok: true, already: 'cancelled', bookingId: booking.id })
  }

  // Sync the cancellation to Payload
  await payload.update({
    collection: 'bookings',
    id: booking.id,
    data: {
      status: 'cancelled',
      failureReason: `Cancelled in GHL via webhook (event: ${type})`,
    },
  })

  console.log('[webhook:ghl] Synced cancellation to Payload', {
    ghlAppointmentId,
    bookingId: booking.id,
    confirmationCode: booking.confirmationCode,
  })

  return NextResponse.json({
    ok: true,
    synced: 'cancelled',
    bookingId: booking.id,
    confirmationCode: booking.confirmationCode,
  })
}
