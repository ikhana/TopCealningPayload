import { NextRequest, NextResponse } from 'next/server'
import { verifyGhlWebhook } from '@/lib/ghl/webhooks'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

// GHL appointment status → Payload booking status mapping
const APPOINTMENT_STATUS_MAP: Record<string, string> = {
  confirmed: 'confirmed',
  showed: 'completed',
  noshow: 'cancelled',
  cancelled: 'cancelled',
  invalid: 'cancelled',
}

export async function POST(request: NextRequest) {
  // MUST read raw body BEFORE JSON parse for HMAC verification
  const rawBody = await request.text()
  const signature = request.headers.get('x-ghl-signature') ?? request.headers.get('x-hub-signature-256')
  const timestamp = request.headers.get('x-ghl-timestamp')

  const isValid = await verifyGhlWebhook(rawBody, signature, timestamp)
  if (!isValid) {
    console.warn('[ghl:webhook] Invalid signature — rejected')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: {
    type?: string
    id?: string
    locationId?: string
    appointmentId?: string
    contactId?: string
    status?: string
    pipelineStageId?: string
    opportunityId?: string
  }

  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Return 200 immediately — process async to avoid GHL timeout
  void processWebhookEvent(event).catch((err) => {
    console.error('[ghl:webhook] Processing error', { eventType: event.type, error: err })
  })

  return NextResponse.json({ received: true }, { status: 200 })
}

async function processWebhookEvent(event: {
  type?: string
  id?: string
  appointmentId?: string
  status?: string
  opportunityId?: string
  pipelineStageId?: string
}) {
  const payload = await getPayload({ config: configPromise })

  if (event.type === 'AppointmentUpdate' || event.type === 'AppointmentStatusChanged') {
    const { appointmentId, status } = event
    if (!appointmentId || !status) return

    const mappedStatus = APPOINTMENT_STATUS_MAP[status]
    if (!mappedStatus) return

    // Find booking by GHL appointment ID
    const result = await payload.find({
      collection: 'bookings',
      where: { ghlAppointmentId: { equals: appointmentId } },
      limit: 1,
    })

    if (result.docs.length === 0) return

    const booking = result.docs[0]!

    // Don't downgrade a completed booking
    if (booking.status === 'completed' && mappedStatus !== 'refunded') return

    await payload.update({
      collection: 'bookings',
      id: booking.id,
      data: { status: mappedStatus as 'confirmed' | 'in-progress' | 'completed' | 'cancelled' },
    })

    console.log(`[ghl:webhook] Updated booking ${booking.id} status: ${booking.status} → ${mappedStatus}`)
    return
  }

  if (event.type === 'OpportunityStageChanged') {
    const { opportunityId, pipelineStageId } = event
    if (!opportunityId || !pipelineStageId) return

    // Maps live Top Cleaning Bookings pipeline stages to Booking.status values.
    // Pre-booking stages (New Inquiry / Consultation / Proposal sent) are not
    // mapped — they represent funnel motion, not a booking commitment.
    // Payment Collected collapses into 'completed' since the customer-facing
    // booking lifecycle ends when the job is done.
    const stageStatusMap: Record<string, string> = {
      [process.env.GHL_PIPELINE_STAGE_CLEANING_BOOKED ?? '']: 'confirmed',
      [process.env.GHL_PIPELINE_STAGE_CLEANING_COMPLETED ?? '']: 'completed',
      [process.env.GHL_PIPELINE_STAGE_PAYMENT_COLLECTED ?? '']: 'completed',
    }

    const mappedStatus = stageStatusMap[pipelineStageId]
    if (!mappedStatus) return

    const result = await payload.find({
      collection: 'bookings',
      where: { ghlOpportunityId: { equals: opportunityId } },
      limit: 1,
    })

    if (result.docs.length === 0) return

    await payload.update({
      collection: 'bookings',
      id: result.docs[0]!.id,
      data: { status: mappedStatus as 'confirmed' | 'in-progress' | 'completed' },
    })
    return
  }
}
