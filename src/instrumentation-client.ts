// src/instrumentation-client.ts
import { initBotId } from 'botid/client/core'

/**
 * Runs the bot-detection challenge in the browser and attaches its solution to
 * requests aimed at the paths listed below.
 *
 * Both listed routes create a GoHighLevel contact from anonymous, unauthenticated
 * input. That is the shape spam finds: no login, no payment, a phone field, and
 * a CRM on the other side. Left open they fill the pipeline with junk that
 * someone then has to sort by hand — and worse for us specifically, every junk
 * contact carries a fabricated SMS consent record, which is exactly the kind of
 * thing that turns a carrier complaint into a real problem.
 *
 * The distinction that makes a challenge work where a honeypot does not: a
 * honeypot asks a bot NOT to do something, which it can learn. A challenge asks
 * it to DO something, which requires actually being a browser.
 *
 * A path listed here MUST also call checkBotId() server side, and vice versa.
 * They are two halves of one mechanism: this file decides which requests carry
 * the proof, and checkBotId() reads it. Protect a route here without checking
 * it and nothing happens; check a route that is not listed here and every
 * request fails, real ones included.
 *
 * /api/bookings/submit is deliberately absent. The reasoning was that it requires a
 * payment nonce from Authorize.Net, a far harder gate than any challenge, and that a
 * false positive there costs an actual booking rather than an enquiry.
 *
 * ⚠️ THAT NO LONGER HOLDS while payments are switched off. The form then sends the
 * literal string "PAYMENT_DISABLED" as the nonce, the route only checks that a nonce is
 * present, and src/lib/booking/submit-flow.ts treats that string (and "TEST_MODE") as
 * test mode. So the final booking submit currently has no bot protection at all, and the
 * payment-bypass strings are accepted from any caller. Flagged 2026-10-09, not yet fixed.
 *
 * Every other lead route is stored in the `enquiries` collection before it is sent
 * anywhere, and a flagged submission is quarantined there instead of dropped. See
 * src/lib/leads/ and docs/ENQUIRIES.md.
 */
initBotId({
  protect: [
    { path: '/api/ghl/form-submit', method: 'POST' },
    { path: '/api/ghl/lead-capture', method: 'POST' },
  ],
})
