// GET /api/booking-drafts/[token]
// Fetch a single draft by its resume token. Returns the wizardState and
// stepReached for client hydration. The token is the auth — anyone with it
// can read; we don't list drafts by any other key here.

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params

  if (!token || token.length < 8 || token.length > 128) {
    return NextResponse.json({ error: 'invalid token' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'booking-drafts',
    where: { token: { equals: token } },
    limit: 1,
    depth: 0,
  })

  if (result.docs.length === 0) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  const draft = result.docs[0]

  // Refuse to hydrate a converted draft — the booking is done
  if (draft.convertedToBookingId) {
    return NextResponse.json({ error: 'already converted', code: 'CONVERTED' }, { status: 410 })
  }

  // Refuse expired drafts
  if (draft.expiresAt && new Date(draft.expiresAt).getTime() < Date.now()) {
    return NextResponse.json({ error: 'expired', code: 'EXPIRED' }, { status: 410 })
  }

  return NextResponse.json(
    {
      ok: true,
      draft: {
        token: draft.token,
        stepReached: draft.stepReached,
        wizardState: draft.wizardState,
        email: draft.email,
      },
    },
    { status: 200 },
  )
}
