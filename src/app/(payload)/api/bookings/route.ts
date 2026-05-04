import { NextRequest, NextResponse } from 'next/server'
import { getMeUser } from '@/utilities/getMeUser'
import { submitBooking, BookingValidationError } from '@/lib/booking/submit-flow'
import { AuthNetDeclinedError, AuthNetAvsError, AuthNetCvvError } from '@/lib/authnet/errors'
import { GhlApiError } from '@/lib/ghl/errors'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  // Auth is optional — guests can book without an account
  const { user } = await getMeUser({}).catch(() => ({ user: null, token: null }))

  let body: {
    idempotencyKey?: string
    formData?: unknown
    paymentNonce?: { dataDescriptor?: string; dataValue?: string }
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body', code: 'INVALID_BODY' }, { status: 400 })
  }

  const { idempotencyKey, formData, paymentNonce } = body

  if (!idempotencyKey || typeof idempotencyKey !== 'string') {
    return NextResponse.json({ error: 'idempotencyKey required', code: 'MISSING_KEY' }, { status: 400 })
  }

  if (!formData || typeof formData !== 'object') {
    return NextResponse.json({ error: 'formData required', code: 'MISSING_FORM_DATA' }, { status: 400 })
  }

  if (!paymentNonce?.dataDescriptor || !paymentNonce?.dataValue) {
    return NextResponse.json({ error: 'Payment nonce required', code: 'MISSING_NONCE' }, { status: 400 })
  }

  try {
    const result = await submitBooking({
      formData: formData as Parameters<typeof submitBooking>[0]['formData'],
      paymentNonce: {
        dataDescriptor: paymentNonce.dataDescriptor,
        dataValue: paymentNonce.dataValue,
      },
      idempotencyKey,
      userId: user ? String(user.id) : undefined,
    })

    return NextResponse.json(result, { status: 200 })

  } catch (err) {
    if (err instanceof BookingValidationError) {
      return NextResponse.json(
        { error: err.message, code: 'VALIDATION_ERROR', step: err.step, field: err.field },
        { status: 422 },
      )
    }

    if (err instanceof AuthNetAvsError) {
      return NextResponse.json(
        { error: 'Billing address does not match. Please check your address and try again.', code: 'AVS_MISMATCH' },
        { status: 402 },
      )
    }

    if (err instanceof AuthNetCvvError) {
      return NextResponse.json(
        { error: 'CVV does not match. Please check your card security code.', code: 'CVV_MISMATCH' },
        { status: 402 },
      )
    }

    if (err instanceof AuthNetDeclinedError) {
      return NextResponse.json(
        { error: 'Your card was declined. Please try a different card or contact your bank.', code: 'CARD_DECLINED' },
        { status: 402 },
      )
    }

    if (err instanceof GhlApiError) {
      console.error('[bookings] GHL error during submit', { status: err.status, body: err.body })
      return NextResponse.json(
        { error: 'Scheduling system unavailable. Your card was not charged. Please try again.', code: 'GHL_ERROR' },
        { status: 503 },
      )
    }

    console.error('[bookings] Unexpected error during submit', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again or contact support.', code: 'INTERNAL_ERROR' },
      { status: 500 },
    )
  }
}
