// src/lib/ghl/files.ts
// Populate a GHL FILE_UPLOAD contact custom field so it renders in the
// contact UI (downloadable file rows).
//
// Verified working flow (2026-06-17). The public /customFields/upload
// endpoint does NOT work for UI rendering — it stores files in a private
// bucket with no documentId, and the contact widget never shows them.
// The widget renders entries from this exact shape, which we build from
// the Media Library upload instead:
//
//   1. POST /medias/upload-file   (multipart: file, locationId)
//        → { fileId, url }   where url is a PUBLIC CDN link
//          (https://assets.cdn.filesafe.space/<loc>/media/<uuid>.<ext>)
//
//   2. PUT /contacts/{contactId}
//        {
//          customFields: [{
//            id: <fieldId>,
//            value: {
//              "<uuid>": {
//                meta: { fieldname, originalname, encoding, mimetype, size, uuid },
//                url:  <public CDN url from step 1>,
//                documentId: <fileId from step 1>,
//              },
//              ...one entry per file
//            }
//          }]
//        }
//
// NOTE: the field value is an OBJECT keyed by uuid (not an array). A PUT
// replaces the whole value, so callers that need to append must merge with
// the existing value first. For the booking flow we set all photos at once,
// so replace is correct.

import { randomUUID } from 'node:crypto'

const BASE_URL = process.env.GHL_API_BASE ?? 'https://services.leadconnectorhq.com'
const API_VERSION = process.env.GHL_API_VERSION ?? '2021-07-28'

export type UploadFile = {
  blob: Blob
  filename: string
}

export type UploadedFileMeta = {
  url: string
  name: string
  fileId: string
}

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${process.env.GHL_PRIVATE_TOKEN}`,
    Version: API_VERSION,
    Accept: 'application/json',
  }
}

// Uploads a single file to the GHL Media Library, returning its public URL + id.
async function uploadToMediaLibrary(file: UploadFile, locationId: string): Promise<{ url: string; fileId: string }> {
  const fd = new FormData()
  fd.append('file', file.blob, file.filename)
  fd.append('locationId', locationId)

  const res = await fetch(`${BASE_URL}/medias/upload-file`, {
    method: 'POST',
    headers: authHeaders(), // no Content-Type — runtime sets the multipart boundary
    body: fd,
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`GHL media upload failed: ${res.status} ${body.slice(0, 300)}`)
  }

  const json = (await res.json()) as { fileId?: string; url?: string }
  if (!json.url || !json.fileId) {
    throw new Error(`GHL media upload returned no url/fileId: ${JSON.stringify(json).slice(0, 200)}`)
  }
  return { url: json.url, fileId: json.fileId }
}

/**
 * Uploads files and binds them to a contact's FILE_UPLOAD custom field so
 * they appear (downloadable) in the contact UI. Replaces any existing value.
 *
 * @param contactId  GHL contact id (must already exist)
 * @param fieldId    FILE_UPLOAD custom field id (e.g. GHL_FIELD_SERVICE_MEDIA)
 * @param files      files to upload
 */
export async function uploadFilesToContactField(
  contactId: string,
  fieldId: string,
  files: UploadFile[],
): Promise<UploadedFileMeta[]> {
  if (files.length === 0) return []

  const locationId = process.env.GHL_LOCATION_ID!

  // ── Step 1: upload each file to the Media Library (public URLs) ──
  const value: Record<string, unknown> = {}
  const uploaded: UploadedFileMeta[] = []

  for (const file of files) {
    const { url, fileId } = await uploadToMediaLibrary(file, locationId)
    const uuid = randomUUID()
    value[uuid] = {
      meta: {
        fieldname: fieldId,
        originalname: file.filename,
        encoding: '7bit',
        mimetype: file.blob.type || 'application/octet-stream',
        size: file.blob.size,
        uuid,
      },
      url,
      documentId: fileId,
    }
    uploaded.push({ url, name: file.filename, fileId })
  }

  // ── Step 2: bind the uploaded files to the contact field ─────────
  const putRes = await fetch(`${BASE_URL}/contacts/${contactId}`, {
    method: 'PUT',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ customFields: [{ id: fieldId, value }] }),
  })

  if (!putRes.ok) {
    const body = await putRes.text().catch(() => '')
    throw new Error(`GHL contact field bind failed: ${putRes.status} ${body.slice(0, 300)}`)
  }

  return uploaded
}
