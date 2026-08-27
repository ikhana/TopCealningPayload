// POST /api/ghl/form-submit
//
// The destination for the two non-wizard forms that collect a phone number:
// the contact form and the Join Our Team application. Both previously ended at
// `setState`, so everything typed into them — including the A2P consent boxes —
// was discarded on submit. A consent record that never reaches the CRM cannot
// be produced on audit, which is the whole reason for collecting it.
//
// Accepts multipart/form-data for both audiences. The contact form has no file,
// but using one content type for both keeps a single code path.

import { NextRequest, NextResponse } from 'next/server'
import { upsertContact } from '@/lib/ghl/contacts'
import { uploadFilesToContactField } from '@/lib/ghl/files'
import { getGhlFields } from '@/lib/ghl/custom-fields'
import { CONSENT_VERSION, clientIp } from '@/lib/consent'
import { createOpportunity } from '@/lib/ghl/opportunities'
import { resolvePipelines, type PipelineTarget } from '@/lib/ghl/pipelines'
import { checkBotId } from 'botid/server'

export const dynamic = 'force-dynamic'

const MAX_RESUME_BYTES = 10 * 1024 * 1024

/**
 * Which detail fields each form sends, and how to label them in the note.
 *
 * The answers go into the existing NOTES field as one readable block rather
 * than into a dozen new custom fields. Nobody filters a pipeline on "allergic
 * to any products", and a field per answer is a dozen more things to keep in
 * sync for no gain. The values that matter structurally — consent, name,
 * email, phone — are real fields.
 */
const DETAILS: Record<string, Array<[string, string]>> = {
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

const TAGS: Record<string, string[]> = {
  // Deliberately NOT 'website-lead'. That tag triggers the abandoned-booking
  // sequence, and someone asking a question through the contact form has not
  // abandoned a booking — dropping them into it would send messages about a
  // booking they never started.
  contact: ['contact-form'],
  careers: ['job-application'],
}

/** US-only normalisation. Neither form offers a country selector. */
function toE164(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed.startsWith('+')) return '+' + trimmed.slice(1).replace(/\D/g, '')
  const digits = trimmed.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return `+1${digits}`
}

function str(form: FormData, key: string): string {
  const v = form.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()

    const audience = str(form, 'audience')
    if (audience !== 'contact' && audience !== 'careers') {
      return NextResponse.json({ error: 'unknown audience' }, { status: 400 })
    }

    // Bot-detection challenge, solved in the browser and verified here. Both
    // forms are anonymous and unauthenticated with a phone field and a CRM
    // behind them, which is the exact shape spam looks for — and every junk
    // contact it creates carries a fabricated SMS consent record with it.
    //
    // Always returns isBot: false locally, so this is inert in development and
    // only does real work on a deployment.
    try {
      const { isBot } = await checkBotId()
      if (isBot) {
        // Answered as if it succeeded. Telling a bot precisely which check it
        // failed is free tuning feedback for whoever is running it.
        return NextResponse.json({ ok: true, resumeUploaded: false })
      }
    } catch (err) {
      // Never let the detector's own failure block a submission. If Vercel's
      // endpoint is unreachable or the challenge did not load, the right
      // outcome is an unscreened enquiry, not a lost one.
      console.warn('[form-submit] bot check unavailable, allowing:', err)
    }

    const locationId = process.env.GHL_LOCATION_ID
    if (!locationId) {
      return NextResponse.json({ error: 'GHL not configured' }, { status: 500 })
    }

    // The contact form has one "Full Name"; the application has two fields.
    const whole = str(form, 'name')
    const firstName = str(form, 'first_name') || whole.split(/\s+/)[0] || ''
    const lastName = str(form, 'last_name') || whole.split(/\s+/).slice(1).join(' ')

    const email = str(form, 'email')
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

    const phone = toE164(str(form, 'phone'))

    const GHL_FIELDS = await getGhlFields()

    // ── Consent, exactly as the booking wizard records it ────────────────────
    // Written as explicit yes/no rather than omitted when false, so a decline is
    // a recorded decision rather than an absent value — evidence that the choice
    // was offered. Timestamp and IP are taken server-side; a client-supplied
    // time or address is not evidence of anything.
    const serviceConsent = str(form, 'sms_service_consent') === 'yes'
    const marketingConsent = str(form, 'sms_marketing_consent') === 'yes'
    const consentAt = new Date().toISOString()
    const consentIp = clientIp(request)

    const details = (DETAILS[audience] ?? [])
      .map(([key, label]) => [label, str(form, key)] as const)
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`)
      .join('\n')

    const heading = audience === 'careers' ? 'Job application' : 'Contact form enquiry'
    const note = [`${heading} — ${consentAt}`, details].filter(Boolean).join('\n\n')

    const customFields = [
      GHL_FIELDS.smsServiceConsent && {
        id: GHL_FIELDS.smsServiceConsent,
        field_value: serviceConsent ? 'yes' : 'no',
      },
      // The careers form offers no marketing box, so there is no marketing
      // decision to record. Writing "no" would assert a choice nobody was
      // offered, which is a different claim from declining one.
      audience !== 'careers' &&
        GHL_FIELDS.smsMarketingConsent && {
          id: GHL_FIELDS.smsMarketingConsent,
          field_value: marketingConsent ? 'yes' : 'no',
        },
      GHL_FIELDS.consentVersion && {
        id: GHL_FIELDS.consentVersion,
        field_value: CONSENT_VERSION,
      },
      GHL_FIELDS.consentTimestamp && {
        id: GHL_FIELDS.consentTimestamp,
        field_value: consentAt,
      },
      GHL_FIELDS.consentIp && consentIp && { id: GHL_FIELDS.consentIp, field_value: consentIp },
      GHL_FIELDS.notes && note && { id: GHL_FIELDS.notes, field_value: note },
    ].filter(Boolean) as Array<{ id: string; field_value: string }>

    const contact = await upsertContact({
      firstName,
      lastName,
      email,
      // GHL accepts a contact keyed on email alone. The contact form makes the
      // phone optional, so send the key only when there is a number.
      ...(phone ? { phone } : {}),
      locationId,
      tags: TAGS[audience],
      customFields,
    } as Parameters<typeof upsertContact>[0])

    const contactId = (contact as { id?: string })?.id

    // ── Opportunity ──────────────────────────────────────────────────────────
    // Non-fatal by design. The contact and its consent record are what must
    // land; a missing pipeline is a CRM configuration gap, and losing the whole
    // enquiry over one would be the wrong trade. Resolved by NAME, so a pipeline
    // created in the GHL UI later starts working without a deploy.
    if (contactId) {
      try {
        const target = await resolvePipelines()
        const found = target.get(audience as PipelineTarget)
        if (!found) {
          console.warn('[form-submit] no pipeline/stage for audience, opportunity skipped', {
            audience,
          })
        } else {
          const who = [firstName, lastName].filter(Boolean).join(' ') || email
          await createOpportunity({
            locationId,
            contactId,
            pipelineId: found.pipelineId,
            pipelineStageId: found.stageId,
            name: audience === 'careers' ? `${who} (application)` : `${who} (contact form)`,
            status: 'open',
          })
        }
      } catch (err) {
        console.error('[form-submit] opportunity creation failed', { contactId, audience }, err)
      }
    }

    // ── Resume, careers only ─────────────────────────────────────────────────
    // Deliberately after the upsert and deliberately non-fatal. The application
    // answers and the consent record are what must land; an attachment that
    // fails to upload should not discard them and make the applicant retype
    // everything.
    let resumeUploaded = false
    const resume = form.get('resume')
    if (audience === 'careers' && contactId && resume instanceof File && resume.size > 0) {
      if (resume.size > MAX_RESUME_BYTES) {
        console.warn('[form-submit] resume too large, skipped', { contactId, bytes: resume.size })
      } else if (!GHL_FIELDS.resume) {
        console.warn('[form-submit] resume field not present in GHL, skipped', { contactId })
      } else {
        try {
          await uploadFilesToContactField(contactId, GHL_FIELDS.resume, [
            { blob: resume, filename: resume.name },
          ])
          resumeUploaded = true
        } catch (err) {
          console.error('[form-submit] resume upload failed', { contactId }, err)
        }
      }
    }

    return NextResponse.json({ ok: true, resumeUploaded })
  } catch (err) {
    console.error('[form-submit]', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
