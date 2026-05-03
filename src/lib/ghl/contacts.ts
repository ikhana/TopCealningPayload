import { ghlFetch } from './client'
import type { GhlContact, GhlUpsertContactPayload } from './types'

export async function upsertContact(
  data: GhlUpsertContactPayload,
): Promise<GhlContact> {
  const res = await ghlFetch('/contacts/upsert', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  const json = await res.json()
  return json.contact ?? json
}

export async function getContactByEmail(
  email: string,
  locationId: string,
): Promise<GhlContact | null> {
  const params = new URLSearchParams({
    locationId,
    query: email,
    limit: '1',
  })
  const res = await ghlFetch(`/contacts/search?${params}`)
  const json = await res.json()
  return json.contacts?.[0] ?? null
}
