// src/lib/ghl/fields.ts
import { ghlFetch } from './client'

/**
 * Resolves GoHighLevel custom field ids at runtime instead of carrying them in
 * the environment.
 *
 * GHL writes custom fields by id, and those ids are opaque twenty-character
 * strings that only exist once the field has been created. The original
 * approach here was to create each field by hand, dig its id out of the API or
 * the URL bar, and paste it into .env — twenty variables of it. That has three
 * costs: someone has to do it, an id pasted into the wrong variable fails
 * silently, and a field renamed or recreated in GHL breaks the sync with no
 * error anyone sees.
 *
 * Worse, every write site guards with `FIELDS.x && {...}`. An env var missing
 * in production is therefore indistinguishable from a field we chose not to
 * send: no error, no log, the contact upserts fine, and the value is simply
 * gone. That is exactly how SMS consent could stop being recorded without
 * anyone noticing — and an unrecorded consent cannot be produced on audit.
 *
 * The API already returns a stable `fieldKey` per field, derived from its name.
 * So the mapping below is by key, ids are looked up once per process, and
 * adding a field later needs no deploy and no environment change.
 *
 * A key that does not resolve is skipped rather than fatal. GHL rejects the
 * entire contact payload on one unknown field id, so a field that has not been
 * created yet must drop out of the request rather than take the others with it
 * — including the consent values, which are the ones that matter.
 *
 * Mirrors BrandBloomPayload/src/lib/ghl/fields.ts.
 */

/**
 * Our logical names, mapped to the keys live in the Top Cleaning location.
 * Every key below was verified against GET /locations/{id}/customFields.
 */
export const FIELD_KEYS = {
  // Booking snapshot — denormalized "latest booking" for email merge variables
  // triggered by contact-tag events, where appointment placeholders are absent.
  confirmationCode: 'contact.tc_confirmation_code',
  service: 'contact.service',
  serviceDate: 'contact.service_date',
  serviceTime: 'contact.service_time',
  serviceTotal: 'contact.service_total',
  cartResumeUrl: 'contact.cart_resume_url',
  serviceMedia: 'contact.top_cleaning_service_media',

  // Per-service extras, pushed from Step 3 based on serviceType
  cleaningType: 'contact.cleaning_type',
  typeOfSpace: 'contact.type_of_space',
  propertiesManaged: 'contact.properties_managed',
  propertyType: 'contact.property_type',
  completionStatus: 'contact.completion_status',
  notes: 'contact.notes',

  // Handyman-specific extras (Step 3, handyman only)
  handymanServiceType: 'contact.handyman_service_type',
  handymanOtherDetail: 'contact.handyman_other_detail',
  jobConditions: 'contact.job_conditions',
  // Double underscore is not a typo. GHL derived this key from the field name
  // "Tools & Materials", and the ampersand became a second underscore.
  toolsMaterials: 'contact.tools__materials',
  partsNeeded: 'contact.parts_needed',

  // A2P 10DLC — captured on Step 1, beside the phone field. GHL workflows gate
  // on these: marketing sequences check smsMarketingConsent, service sequences
  // check smsServiceConsent. See docs/a2p-compliance-handoff.md section 6.1.
  smsServiceConsent: 'contact.sms_service_consent',
  smsMarketingConsent: 'contact.sms_marketing_consent',

  // Consent evidence. The flags above say WHAT was agreed; these three say
  // when, from where, and against which wording — which is what an audit
  // actually asks for. Created by .seed/ghl-provision-consent.ts.
  consentVersion: 'contact.consent_version',
  consentTimestamp: 'contact.consent_timestamp',
  consentIp: 'contact.consent_ip_address',
} as const

export type FieldKey = keyof typeof FIELD_KEYS

type Resolved = { ids: Map<FieldKey, string>; missing: FieldKey[] }

// One lookup per process. On a long-lived server that is once; on Vercel it is
// once per cold start, which is the right frequency for something that changes
// when a human edits the CRM.
let cache: Promise<Resolved> | null = null

export function resolveFieldIds(): Promise<Resolved> {
  if (!cache) cache = load()
  return cache
}

/** Forces the next call to re-fetch. For scripts that have just created fields. */
export function clearFieldCache(): void {
  cache = null
}

async function load(): Promise<Resolved> {
  const locationId = process.env.GHL_LOCATION_ID
  if (!locationId) throw new Error('GHL_LOCATION_ID is not set')

  const res = await ghlFetch(`/locations/${locationId}/customFields`)
  const list: Array<{ id: string; fieldKey: string }> = (await res.json())?.customFields ?? []

  const byKey = new Map(list.map((f) => [f.fieldKey, f.id]))
  const ids = new Map<FieldKey, string>()
  const missing: FieldKey[] = []

  for (const [name, key] of Object.entries(FIELD_KEYS) as Array<[FieldKey, string]>) {
    const id = byKey.get(key)
    if (id) ids.set(name, id)
    else missing.push(name)
  }

  return { ids, missing }
}
