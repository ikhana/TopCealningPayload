// src/lib/ghl/files.ts
// Upload files into a GHL FILE_UPLOAD contact custom field.
//
// GHL requires a two-step flow (verified empirically 2026-06-17 — the public
// docs are incomplete):
//
//   1. POST /locations/{locationId}/customFields/upload   (multipart)
//        form fields:
//          - id        = contactId
//          - maxFiles  = string (must be >= file count; field is capped at 6)
//          - {fieldId}_{uuid} = the file Blob (one part per file)
//        → 201, returns { meta: [{ url, originalname, mimetype, ... }] }
//
//   2. PUT /contacts/{contactId}
//        { customFields: [{ id: fieldId, value: [{ url, name, mimetype }] }] }
//        → 200, value now resolves via {{contact.<fieldKey>}}
//
// Step 1 only parks the file in GHL storage; step 2 is what actually binds it
// to the contact record so it shows in the UI and merge fields.

const BASE_URL = process.env.GHL_API_BASE ?? 'https://services.leadconnectorhq.com'
const API_VERSION = process.env.GHL_API_VERSION ?? '2021-07-28'

export type UploadFile = {
  blob: Blob
  filename: string
}

type UploadedFileMeta = {
  url: string
  name: string
  mimetype: string
}

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${process.env.GHL_PRIVATE_TOKEN}`,
    Version: API_VERSION,
    Accept: 'application/json',
  }
}

/**
 * Uploads one or more files to a contact's FILE_UPLOAD custom field and binds
 * them to the contact record. Returns the stored file metadata.
 *
 * @param contactId  GHL contact id (must already exist)
 * @param fieldId    custom field id (e.g. GHL_FIELD_SERVICE_MEDIA)
 * @param files      files to upload
 * @param maxFiles   field's configured max (defaults to '6')
 */
export async function uploadFilesToContactField(
  contactId: string,
  fieldId: string,
  files: UploadFile[],
  maxFiles = '6',
): Promise<UploadedFileMeta[]> {
  if (files.length === 0) return []

  const locationId = process.env.GHL_LOCATION_ID!

  // ── Step 1: multipart upload to GHL storage ──────────────────
  const fd = new FormData()
  fd.append('id', contactId)
  fd.append('maxFiles', maxFiles)
  for (const f of files) {
    const fileId = crypto.randomUUID()
    fd.append(`${fieldId}_${fileId}`, f.blob, f.filename)
  }

  const upRes = await fetch(`${BASE_URL}/locations/${locationId}/customFields/upload`, {
    method: 'POST',
    headers: authHeaders(), // no Content-Type — runtime sets the multipart boundary
    body: fd,
  })

  if (!upRes.ok) {
    const body = await upRes.text().catch(() => '')
    throw new Error(`GHL file upload failed: ${upRes.status} ${body.slice(0, 300)}`)
  }

  const upJson = (await upRes.json()) as {
    meta?: Array<{ url: string; originalname: string; mimetype: string }>
  }
  const value: UploadedFileMeta[] = (upJson.meta ?? []).map((m) => ({
    url: m.url,
    name: m.originalname,
    mimetype: m.mimetype,
  }))

  if (value.length === 0) return []

  // ── Step 2: bind the uploaded files to the contact field ─────
  const putRes = await fetch(`${BASE_URL}/contacts/${contactId}`, {
    method: 'PUT',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ customFields: [{ id: fieldId, value }] }),
  })

  if (!putRes.ok) {
    const body = await putRes.text().catch(() => '')
    throw new Error(`GHL contact field bind failed: ${putRes.status} ${body.slice(0, 300)}`)
  }

  return value
}
