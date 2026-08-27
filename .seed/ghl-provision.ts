// .seed/ghl-provision.ts
//
// Creates the three A2P consent-evidence fields in Top Cleaning's GoHighLevel
// location.
//
//   PAYLOAD_MIGRATING=true pnpm payload run .seed/ghl-provision.ts
//
// Idempotent: anything already present by fieldKey is left alone and reported
// as such, so re-running after a partial failure does not create duplicates.
//
// Set DRY=1 to print what it would do and change nothing.
//
//   DRY=1 PAYLOAD_MIGRATING=true pnpm payload run .seed/ghl-provision.ts
//
// An env var and not a --dry argument: `payload run` does not forward extra
// argv to the script, so an argument-based guard reads as false — and a
// dry-run flag that silently means "go ahead" is worse than no flag at all.

import { ghlFetch } from '../src/lib/ghl/client'
import { PIPELINE_TARGETS } from '../src/lib/ghl/pipelines'

const DRY = Boolean(process.env.DRY)

const locationId = process.env.GHL_LOCATION_ID
if (!locationId) {
  console.error('\n  GHL_LOCATION_ID is not set\n')
  process.exit(1)
}

/**
 * The consent evidence trio.
 *
 * The two opt-in flags already exist as TEXT fields holding "yes"/"no" and are
 * deliberately left alone — changing a live field's dataType risks the values
 * already on file, and the flags work.
 *
 * What was missing is the evidence. "yes" in a field is not proof of consent:
 * proof is WHEN it was given, from WHERE, and against WHICH wording. Those are
 * the three things you are asked to produce when a carrier escalates or a
 * complaint is traced back to a number.
 *
 * Timestamp is TEXT rather than DATE because GHL date fields are day
 * resolution, and day resolution is not evidence of anything.
 */
type FieldSpec = {
  name: string
  dataType: string
  placeholder?: string
  // FILE_UPLOAD only. Note these are the property names the CREATE endpoint
  // accepts, which are NOT the names the READ endpoint returns for the same
  // three settings — it reports them as picklistOptions / isMultiFileAllowed /
  // maxFileLimit. Sending the read names back gets a 422.
  acceptedFormat?: string[]
  isMultipleFile?: boolean
  maxNumberOfFiles?: number
}

const FIELDS: FieldSpec[] = [
  { name: 'Consent Version', dataType: 'TEXT', placeholder: 'tc-sms-v1' },
  { name: 'Consent Timestamp', dataType: 'TEXT', placeholder: 'ISO 8601, UTC' },
  { name: 'Consent IP Address', dataType: 'TEXT', placeholder: '' },

  // Where the Join Our Team resume lands. Single file: an applicant has one
  // resume, and allowing several invites the "I'll just attach everything"
  // upload that nobody reads.
  {
    name: 'Resume',
    dataType: 'FILE_UPLOAD',
    placeholder: '',
    acceptedFormat: ['.pdf', '.doc', '.docx'],
    isMultipleFile: false,
    maxNumberOfFiles: 1,
  },
]

// GHL derives fieldKey from the name, lowercased with non-alphanumerics
// collapsed to underscores. Matching on the derived key rather than the display
// name means a field renamed in the UI is still recognised.
function derivedKey(name: string): string {
  return 'contact.' + name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}

const res = await ghlFetch(`/locations/${locationId}/customFields`)
const existing: Array<{ id: string; name: string; fieldKey: string }> =
  (await res.json())?.customFields ?? []
const byKey = new Map(existing.map((f) => [f.fieldKey, f]))

console.log(`\n  location ${locationId} — ${existing.length} custom fields present`)
if (DRY) console.log('  DRY RUN — nothing will be created\n')
else console.log('')

for (const field of FIELDS) {
  const key = derivedKey(field.name)
  const found = byKey.get(key)

  if (found) {
    console.log(`  exists        ${field.name.padEnd(22)} ${found.id}  ${key}`)
    continue
  }

  if (DRY) {
    console.log(`  would create  ${field.name.padEnd(22)} ${'—'.padEnd(20)}  ${key}`)
    continue
  }

  const created = await ghlFetch(`/locations/${locationId}/customFields`, {
    method: 'POST',
    body: JSON.stringify({
      name: field.name,
      dataType: field.dataType,
      placeholder: field.placeholder ?? '',
      model: 'contact',
      // Only meaningful for FILE_UPLOAD; omitted entirely for the TEXT fields
      // rather than sent as nulls, which GHL rejects.
      ...(field.acceptedFormat ? { acceptedFormat: field.acceptedFormat } : {}),
      ...(field.isMultipleFile !== undefined ? { isMultipleFile: field.isMultipleFile } : {}),
      ...(field.maxNumberOfFiles !== undefined
        ? { maxNumberOfFiles: field.maxNumberOfFiles }
        : {}),
    }),
  })

  const body = await created.json()
  const made = body?.customField ?? body
  console.log(`  created       ${field.name.padEnd(22)} ${made?.id ?? '?'}  ${made?.fieldKey ?? key}`)
}

console.log('')

// ─────────────────────────────────────────────────────────────────────────────
// Pipelines
//
// The stage names here are the source of truth for the CRM board. What the
// CODE depends on is narrower: only the entry stage named in PIPELINE_TARGETS
// has to match, and the assertion below enforces that the two files agree
// rather than leaving it to whoever edits one of them next.
//
// "Subcontractors" is deliberately absent. It already exists in the location
// with an "Application/Form Submitted" stage and roughly twenty real records in
// it, so this script must never try to build a second one beside it.
// ─────────────────────────────────────────────────────────────────────────────

const PIPELINES = [
  {
    name: 'Website Enquiries',
    stages: ['New Enquiry', 'Replied', 'Quoted', 'Won', 'Closed'],
  },
]

for (const [key, target] of Object.entries(PIPELINE_TARGETS)) {
  const spec = PIPELINES.find((p) => p.name === target.pipeline)
  if (spec && !spec.stages.includes(target.stage)) {
    console.error(
      `
  PIPELINE_TARGETS.${key} wants stage "${target.stage}", which is not in this script's stage list for "${target.pipeline}".
`,
    )
    process.exit(1)
  }
}

const pres = await ghlFetch(`/opportunities/pipelines?locationId=${locationId}`)
const existingPipelines: Array<{ id: string; name: string }> =
  (await pres.json())?.pipelines ?? []

console.log(`  ${existingPipelines.length} pipelines present
`)

for (const spec of PIPELINES) {
  const found = existingPipelines.find(
    (p) => p.name.trim().toLowerCase() === spec.name.trim().toLowerCase(),
  )

  if (found) {
    console.log(`  exists        ${spec.name.padEnd(22)} ${found.id}`)
    continue
  }

  if (DRY) {
    console.log(`  would create  ${spec.name.padEnd(22)} ${spec.stages.join(' > ')}`)
    continue
  }

  try {
    const res = await ghlFetch('/opportunities/pipelines', {
      method: 'POST',
      body: JSON.stringify({
        locationId,
        name: spec.name,
        stages: spec.stages.map((name, position) => ({ name, position })),
      }),
    })
    const made = (await res.json())?.pipeline ?? {}
    console.log(`  created       ${spec.name.padEnd(22)} ${made?.id ?? '?'}`)
  } catch (err: any) {
    if (err?.status === 401) {
      // Not a bug in this script and not a missing endpoint — POST
      // /opportunities/pipelines is documented and returns 401 rather than 404,
      // which means it exists and our token simply cannot reach it.
      console.error(`
  CANNOT CREATE "${spec.name}" — the private integration token lacks the pipeline
  write scope. Opportunity creation works, so opportunities.write is granted;
  pipelines are gated separately.

  Fix it once, in GHL:
    Settings > Private Integrations > (open the integration this token belongs to)
    > Edit > tick the pipeline write scope > Update

  The token itself does not change, so nothing needs redeploying. Then re-run:
    PAYLOAD_MIGRATING=true pnpm payload run .seed/ghl-provision.ts
`)
    } else {
      console.error(`  FAILED        ${spec.name}  ${err?.message ?? err}`)
      if (err?.body) console.error(`                ${JSON.stringify(err.body)}`)
    }
  }
}

console.log('')
