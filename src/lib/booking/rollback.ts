import { refundTransaction } from '@/lib/authnet/charge'
import { cancelAppointment } from '@/lib/ghl/appointments'

export async function rollbackCharge(params: {
  transactionId: string
  amount: number
  lastFour?: string
  bookingContext?: Record<string, unknown>
}): Promise<void> {
  const { transactionId, amount, lastFour = '0000', bookingContext } = params

  try {
    await refundTransaction({ transactionId, amount, lastFour })
    console.log(`[booking:rollback] Refunded transaction ${transactionId} $${amount}`)
  } catch (err) {
    // Do NOT rethrow — booking is already failed, we log and move on
    // This will surface in Vercel logs / monitoring
    console.error('[booking:rollback] CRITICAL: Refund failed', {
      transactionId,
      amount,
      error: err instanceof Error ? err.message : String(err),
      bookingContext,
    })
  }
}

export async function rollbackAppointment(params: {
  appointmentId: string
  bookingContext?: Record<string, unknown>
}): Promise<void> {
  const { appointmentId, bookingContext } = params

  try {
    await cancelAppointment(appointmentId)
    console.log(`[booking:rollback] Cancelled GHL appointment ${appointmentId}`)
  } catch (err) {
    console.error('[booking:rollback] Failed to cancel GHL appointment', {
      appointmentId,
      error: err instanceof Error ? err.message : String(err),
      bookingContext,
    })
  }
}
