// src/data/deposit.ts
//
// The booking deposit (Geraldine, 2026-10-18, slide "DEPOSIT 29.99 USD").
//
// STATUS: DISPLAY ONLY. Nothing here charges a card. The message is shown at checkout so the
// wording and the rule for WHO sees it are settled; collecting the money is a separate piece
// of work (Authorize.Net is in the repo, but nothing connects it to a deposit yet).
//
// Her rules, in full, so the next person sees what is NOT built yet:
//   - $29.99 (it was $30; Fabien suggested the lower figure as more attractive)
//   - applies only to Regular Cleaning, Deep Cleaning and Custom Hourly Cleaning, and to
//     Move-In / Move-Out, which she added on 2026-10-18 ("if Deep is taking it, then yes")
//   - paid by card directly at checkout                              <- NOT BUILT
//   - fully refundable if cancelled at least 24 hours before        <- NOT BUILT
//   - deducted from the final service total, not an extra charge    <- NOT BUILT
//   - online booking and deposit only for the approved cities       <- NOT BUILT (city guard)
//
// Airbnb and Commercial are request-only with no price and no deposit. A custom quote
// (Severe Condition, Estate size) has no price to take a deposit against.

import type { BookingFormData } from '@/types/booking'
import { areaPricing, isAreaPriced, isHourlyService } from '@/data/pricing'

export const DEPOSIT_AMOUNT = 29.99

/** Her wording, verbatim ("Please display this message clearly at checkout"). */
export const DEPOSIT_MESSAGE =
  'A refundable $29.99 deposit is required to secure your booking. ' +
  'This amount will be deducted from your final service total. ' +
  'The deposit is fully refundable for cancellations made at least 24 hours before your scheduled appointment.'

/**
 * Does this booking take the deposit?
 *
 * Yes for every service that has an automatic price: Regular, Deep and Move-In/Move-Out (all
 * the area-priced service, differing only in Type of Cleaning) and Custom Hourly. No when the
 * customer has been routed to a custom quote, because there is no price to deduct it from.
 * Everything else (Airbnb, Commercial, Post-Construction, Handyman) is request-only.
 */
export function requiresDeposit(data: BookingFormData): boolean {
  if (isHourlyService(data.serviceType)) return true
  if (isAreaPriced(data.serviceType)) return !areaPricing(data.serviceExtras ?? {}).quoteOnly
  return false
}
