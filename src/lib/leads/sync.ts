// src/lib/leads/sync.ts
//
// Sends one stored enquiry to GoHighLevel and records what happened on the row.
//
// This is the GoHighLevel logic that used to live inside the two route handlers
// (/api/ghl/lead-capture and /api/ghl/form-submit), moved here so it can run from three
// places that must behave identically: a fresh submission, an admin releasing a
// quarantined lead, and an admin retrying a failed one.
//
// WHY IT READS THE STORED ROW AND NOT THE REQUEST
// A lead released a week later has no request to read from. Everything the sync needs,
// including the consent timestamp, IP and wording version, is therefore on the row,
// captured at submission. A released lead keeps its ORIGINAL consent evidence rather than
// being stamped with the moment somebody pressed Save, which would be fabricated.
//
// It never throws. A failure is written to the row (status `failed`, with the reason in
// the sync log) so the lead can be retried; the caller is told the submission was received
// regardless, because it WAS: it is safely stored.

import type { Payload } from 'payload'

import { CONSENT_VERSION } from '@/lib/consent'
import { upsertContact } from '@/lib/ghl/contacts'
import { getGhlFields } from '@/lib/ghl/custom-fields'
import { uploadFilesToContactField } from '@/lib/ghl/files'
import { createOpportunity } from '@/lib/ghl/opportunities'
import { resolvePipelines, type PipelineTarget } from '@/lib/ghl/pipelines'

type Tri = 'yes' | 'no' | 'not-offered' | null | undefined

type EnquiryRow = {
  id: number | string
  source: 'booking-start' | 'contact' | 'careers'
  firstName?: string | null
  lastName?: string | null
  email: string
  phone?: string | null
  draftToken?: string | null
  details?: Record<string, unknown> | null
  consent?: {
    service?: Tri
    marketing?: Tri
    version?: string | null
    capturedAt?: string | null
    ip?: string | null
  } | null
  ghl?: { contactId?: string | null; opportunityId?: string | null } | null
  syncLog?: Array<{ at?: string | null; result?: string | null; step?: string | null; detail?: string | null }> | null
}

type LogEntry = { at: string; result: 'ok' | 'error' | 'skipped'; step: string; detail?: string }

export type SyncResult = { resumeUploaded: boolean }

/**
 * Which detail fields each form sends, and how to label them in the CRM note. The answers
 * go into the existing NOTES field as one readable block rather than a dozen new custom
 * fields: nobody filters a pipeline on "allergic to any products".
 */
const DETAILS: Record<'contact' | 'careers', Array<[string, string]>> = {
  contact: [
    ['service', 'Service type'],
    ['message', 'Message'],
  ],
  careers: [
    ['english_level', 'English level'],
    ['apply_area', 'Area applying for'],
    ['auth_work', 'Authorized to work in US'],
    ['transport', 'Own reliable transportation'],
    ['contact_method', 'Best way to contact'],
    ['bio', 'About them'],
    ['experience', 'Experience'],
    ['allergies', 'Allergies'],
  ],
}

const TAGS: Record<'booking-start' | 'contact' | 'careers', string[]> = {
  // 'website-lead' is what triggers the abandoned-booking sequence, so it belongs to the
  // booking form ONLY. Someone asking a question through the contact form has not
  // abandoned a booking, and dropping them into that sequence would message them about a
  // booking they never started.
  'booking-start': ['website-lead'],
  contact: ['contact-form'],
  careers: ['job-application'],
}

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_SERVER_URL ??
    'https://topcleaningteam.com'
  ).replace(/\/$/, '')
}

const MAX_RESUME_BYTES = 10 * 1024 * 1024

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

export async function syncEnquiry(
  payload: Payload,
  id: number | string,
  opts: { resume?: File } = {},
): Promise<SyncResult> {
  const log: LogEntry[] = []
  const now = () => new Date().toISOString()
  let resumeUploaded = false
  let contactId: string | undefined
  let opportunityId: string | undefined

  const doc = (await payload.findByID({
    collection: 'enquiries',
    id,
    depth: 0,
    overrideAccess: true,
  })) as unknown as EnquiryRow

  contactId = doc.ghl?.contactId ?? undefined
  opportunityId = doc.ghl?.opportunityId ?? undefined

  // Writes the outcome back. `skipSync` tells the collection's own hooks this is the sync
  // talking, so recording the result does not start another sync.
  const finish = async (status: 'synced' | 'failed' | 'skipped') => {
    try {
      await payload.update({
        collection: 'enquiries',
        id,
        overrideAccess: true,
        depth: 0,
        context: { skipSync: true },
        data: {
          syncStatus: status,
          ghl: { contactId: contactId ?? null, opportunityId: opportunityId ?? null },
          syncLog: [...(doc.syncLog ?? []), ...log] as never,
        },
      })
    } catch (err) {
      // The CRM may well have the lead by now; only the bookkeeping failed. Say so loudly.
      payload.logger.error(
        `[leads] enquiry ${id} outcome "${status}" could not be written back: ${
          err instanceof Error ? err.message : String(err)
        }`,
      )
    }
  }

  try {
    const locationId = process.env.GHL_LOCATION_ID
    if (!locationId) {
      log.push({ at: now(), result: 'skipped', step: 'config', detail: 'GHL_LOCATION_ID is not set' })
      await finish('skipped')
      return { resumeUploaded }
    }

    const FIELDS = await getGhlFields()
    const consent = doc.consent ?? {}
    const consentAt = consent.capturedAt ?? now()

    const customFields: Array<{ id: string; field_value: string }> = []
    const addField = (fieldId: string | undefined, value: string | undefined | null) => {
      if (fieldId && value) customFields.push({ id: fieldId, field_value: value })
    }

    // Consent, as the booking wizard has always recorded it: explicit yes/no rather than
    // omitted when false, so a decline is a recorded decision. "Not offered" writes
    // nothing at all, because asserting a "no" nobody was asked for is a different claim.
    if (consent.service !== 'not-offered') addField(FIELDS.smsServiceConsent, consent.service === 'yes' ? 'yes' : 'no')
    if (consent.marketing !== 'not-offered') addField(FIELDS.smsMarketingConsent, consent.marketing === 'yes' ? 'yes' : 'no')
    addField(FIELDS.consentVersion, consent.version ?? CONSENT_VERSION)
    addField(FIELDS.consentTimestamp, consentAt)
    addField(FIELDS.consentIp, consent.ip)

    if (doc.source === 'booking-start') {
      // Resume link for abandoned-booking recovery. The draft row is saved before this
      // runs, so the token resolves.
      if (doc.draftToken && FIELDS.cartResumeUrl) {
        addField(FIELDS.cartResumeUrl, `${siteUrl()}/booking?resume=${encodeURIComponent(doc.draftToken)}`)
      }

      const contact = await upsertContact({
        firstName: doc.firstName ?? '',
        email: doc.email,
        phone: doc.phone ?? '',
        locationId,
        tags: TAGS['booking-start'],
        ...(customFields.length > 0 && { customFields }),
      } as Parameters<typeof upsertContact>[0])
      contactId = (contact as { id?: string })?.id ?? contactId
      log.push({ at: now(), result: 'ok', step: 'contact', detail: contactId ? `contact ${contactId}` : undefined })
      await finish('synced')
      return { resumeUploaded }
    }

    // contact form and job application
    const audience = doc.source
    const details = (doc.details ?? {}) as Record<string, unknown>
    const detailLines = DETAILS[audience]
      .map(([key, label]) => [label, str(details[key])] as const)
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`)
      .join('\n')
    const heading = audience === 'careers' ? 'Job application' : 'Contact form enquiry'
    addField(FIELDS.notes, [`${heading} - ${consentAt}`, detailLines].filter(Boolean).join('\n\n'))

    const contact = await upsertContact({
      firstName: doc.firstName ?? '',
      lastName: doc.lastName ?? '',
      email: doc.email,
      // GHL accepts a contact keyed on email alone. The contact form makes the phone
      // optional, so the key is sent only when there is a number.
      ...(doc.phone ? { phone: doc.phone } : {}),
      locationId,
      tags: TAGS[audience],
      customFields,
    } as Parameters<typeof upsertContact>[0])
    contactId = (contact as { id?: string })?.id ?? contactId
    log.push({ at: now(), result: 'ok', step: 'contact', detail: contactId ? `contact ${contactId}` : undefined })

    // Opportunity. Non-fatal by design: the contact and its consent record are what must
    // land, and a missing pipeline is a CRM configuration gap. Resolved by NAME, so a
    // pipeline created in the GHL UI later starts working without a deploy. Skipped when
    // the row already has one, so a retry cannot create a duplicate.
    if (contactId && !opportunityId) {
      try {
        const target = await resolvePipelines()
        const found = target.get(audience as PipelineTarget)
        if (!found) {
          log.push({ at: now(), result: 'skipped', step: 'opportunity', detail: `no pipeline/stage for "${audience}"` })
        } else {
          const who = [doc.firstName, doc.lastName].filter(Boolean).join(' ') || doc.email
          const opp = await createOpportunity({
            locationId,
            contactId,
            pipelineId: found.pipelineId,
            pipelineStageId: found.stageId,
            name: audience === 'careers' ? `${who} (application)` : `${who} (contact form)`,
            status: 'open',
          })
          opportunityId = (opp as { id?: string })?.id ?? opportunityId
          log.push({ at: now(), result: 'ok', step: 'opportunity', detail: opportunityId })
        }
      } catch (err) {
        log.push({ at: now(), result: 'error', step: 'opportunity', detail: err instanceof Error ? err.message : String(err) })
      }
    }

    // Resume, careers only, and only when this call still has the file in hand (a live
    // submission). Non-fatal: the application and consent are what must land.
    if (audience === 'careers' && contactId && opts.resume && opts.resume.size > 0) {
      try {
        if (opts.resume.size > MAX_RESUME_BYTES) {
          log.push({ at: now(), result: 'skipped', step: 'resume', detail: `too large (${opts.resume.size} bytes)` })
        } else if (!FIELDS.resume) {
          log.push({ at: now(), result: 'skipped', step: 'resume', detail: 'resume field not present in GHL' })
        } else {
          await uploadFilesToContactField(contactId, FIELDS.resume, [{ blob: opts.resume, filename: opts.resume.name }])
          resumeUploaded = true
          log.push({ at: now(), result: 'ok', step: 'resume', detail: opts.resume.name })
        }
      } catch (err) {
        log.push({ at: now(), result: 'error', step: 'resume', detail: err instanceof Error ? err.message : String(err) })
      }
    }

    await finish('synced')
    return { resumeUploaded }
  } catch (err) {
    log.push({ at: now(), result: 'error', step: 'sync', detail: err instanceof Error ? err.message : String(err) })
    payload.logger.error(
      `[leads] enquiry ${id} (${doc.source}) failed to sync: ${err instanceof Error ? err.message : String(err)}`,
    )
    await finish('failed')
    return { resumeUploaded }
  }
}
