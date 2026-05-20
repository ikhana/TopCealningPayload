// POST /api/booking-drafts/save
// Upsert a booking draft by token. Lives at /save (not /) so it doesn't
// shadow Payload's auto-generated REST endpoints at /api/booking-drafts
// (which the admin UI needs for list/edit/delete to work).
//
// The route bypasses Payload's collection access rules by going through
// the local API — that's intentional. Possessing the token is the auth.

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

const DRAFT_TTL_DAYS = 90

type Body = {
  token?: string
  email?: string
  ghlContactId?: string
  stepReached?: number
  wizardState?: unknown
}

export async function POST(request: NextRequest) {
  let body: Body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { token, email, ghlContactId, stepReached, wizardState } = body

  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'token required' }, { status: 400 })
  }

  if (token.length < 8 || token.length > 128) {
    return NextResponse.json({ error: 'token invalid length' }, { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })
  const expiresAt = new Date(Date.now() + DRAFT_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const existing = await payload.find({
    collection: 'booking-drafts',
    where: { token: { equals: token } },
    limit: 1,
    depth: 0,
  })

  const data: Record<string, unknown> = {
    token,
    expiresAt,
  }
  if (email !== undefined) data.email = email || null
  if (ghlContactId !== undefined) data.ghlContactId = ghlContactId || null
  if (typeof stepReached === 'number') data.stepReached = stepReached
  if (wizardState !== undefined) data.wizardState = wizardState

  if (existing.docs.length > 0) {
    const draft = existing.docs[0]

    if (draft.convertedToBookingId) {
      return NextResponse.json({ ok: true, draft, frozen: true }, { status: 200 })
    }

    const updated = await payload.update({
      collection: 'booking-drafts',
      id: draft.id,
      data,
    })
    return NextResponse.json({ ok: true, draft: updated }, { status: 200 })
  }

  const created = await payload.create({
    collection: 'booking-drafts',
    data,
  })
  return NextResponse.json({ ok: true, draft: created }, { status: 201 })
}
