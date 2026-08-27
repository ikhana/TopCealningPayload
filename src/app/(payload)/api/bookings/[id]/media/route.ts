// POST /api/bookings/[id]/media
// Uploads service photos for a booking to the GHL contact's
// "Top Cleaning Service Media" file-upload custom field.
//
// Called by the booking wizard right after a successful submit (the GHL
// contact must exist first — it's created during submit-flow). Auth for
// guests is the confirmationCode returned from submit, matched against the
// stored booking — so a guessed bookingId alone can't attach files.
//
// Best-effort: photo failures never block the booking. The wizard ignores
// non-200s here; the booking is already complete.

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { uploadFilesToContactField, type UploadFile } from '@/lib/ghl/files'
import { getGhlFields } from '@/lib/ghl/custom-fields'
import type { Booking } from '@/payload-types'

export const dynamic = 'force-dynamic'

const MAX_FILES = 6
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 })
  }

  const confirmationCode = String(form.get('confirmationCode') ?? '')
  const files = form.getAll('files').filter((v): v is File => v instanceof File)

  if (!confirmationCode) {
    return NextResponse.json({ error: 'confirmationCode required' }, { status: 400 })
  }
  if (files.length === 0) {
    return NextResponse.json({ ok: true, uploaded: 0 })
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: `Up to ${MAX_FILES} files` }, { status: 422 })
  }
  for (const f of files) {
    if (!f.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Images only' }, { status: 422 })
    }
    if (f.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Each file must be under 10 MB' }, { status: 422 })
    }
  }

  const payload = await getPayload({ config: configPromise })

  let booking: Booking
  try {
    booking = (await payload.findByID({
      collection: 'bookings',
      id: parseInt(id, 10),
      depth: 0,
    })) as Booking
  } catch {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  // Guest-safe authorization: the confirmationCode is the shared secret.
  if (booking.confirmationCode !== confirmationCode) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  const contactId = booking.ghlContactId
  // Resolved from GHL by fieldKey rather than env. See src/lib/ghl/fields.ts.
  const fieldId = (await getGhlFields()).serviceMedia
  if (!contactId || !fieldId) {
    // No GHL contact (GHL may have failed during submit) or field not configured.
    // Don't error the client — booking stands; just report nothing uploaded.
    console.warn('[bookings:media] Skipped — missing contactId or field', {
      bookingId: id,
      hasContact: !!contactId,
      hasField: !!fieldId,
    })
    return NextResponse.json({ ok: true, uploaded: 0 })
  }

  const uploadFiles: UploadFile[] = files.map((f) => ({ blob: f, filename: f.name }))

  try {
    const uploaded = await uploadFilesToContactField(contactId, fieldId, uploadFiles)
    return NextResponse.json({ ok: true, uploaded: uploaded.length })
  } catch (err) {
    console.error('[bookings:media] GHL upload failed', {
      bookingId: id,
      error: err instanceof Error ? err.message : String(err),
    })
    // Soft-fail: booking is complete, photos just didn't attach.
    return NextResponse.json({ ok: false, uploaded: 0, error: 'Upload failed' }, { status: 502 })
  }
}
