// src/lib/ghl/pipelines.ts
import { ghlFetch } from './client'

/**
 * Resolves opportunity pipelines and stages by NAME at runtime.
 *
 * Same reasoning as ./fields.ts: GHL addresses pipelines and stages by opaque
 * id, and pasting those into the environment means someone has to fetch them,
 * a wrong paste fails silently, and a pipeline rebuilt in the UI breaks the
 * sync with no error. Names are what a human actually sees in the CRM, so
 * names are what this matches on.
 *
 * It also means a pipeline that does not exist yet starts working WITHOUT a
 * deploy the moment it appears — the next cold start picks it up. Whether it was
 * created by .seed/ghl-provision.ts or by hand in the UI does not matter here.
 */
export const PIPELINE_TARGETS = {
  // Enquiries from the contact form. Deliberately NOT "Top Cleaning Bookings":
  // someone asking a question has not booked anything, and dropping them into
  // the bookings pipeline makes every booking metric wrong.
  //
  // Created by .seed/ghl-provision.ts, which owns the full stage list. Only
  // this entry stage name has to agree between the two files, and that script
  // asserts the agreement rather than trusting it.
  contact: { pipeline: 'Website Enquiries', stage: 'New Enquiry' },

  // Job applications. This pipeline ALREADY EXISTS and is not a new one — the
  // location has "Subcontractors" with a stage literally called
  // "Application/Form Submitted", which is exactly this form's outcome.
  // Creating a second applications pipeline beside it would split the same
  // people across two boards.
  careers: { pipeline: 'Subcontractors', stage: 'Application/Form Submitted' },
} as const

export type PipelineTarget = keyof typeof PIPELINE_TARGETS

export type ResolvedPipeline = { pipelineId: string; stageId: string }

type GhlStage = { id: string; name: string }
type GhlPipeline = { id: string; name: string; stages?: GhlStage[] }

// One lookup per process, like the field resolver. Pipelines change when a
// human edits the CRM, which is the right frequency for a cold start.
let cache: Promise<Map<PipelineTarget, ResolvedPipeline>> | null = null

export function resolvePipelines(): Promise<Map<PipelineTarget, ResolvedPipeline>> {
  if (!cache) cache = load()
  return cache
}

/** Forces the next call to re-fetch. For scripts that have just created one. */
export function clearPipelineCache(): void {
  cache = null
}

const norm = (s: string) => s.trim().toLowerCase()

async function load(): Promise<Map<PipelineTarget, ResolvedPipeline>> {
  const locationId = process.env.GHL_LOCATION_ID
  if (!locationId) throw new Error('GHL_LOCATION_ID is not set')

  const res = await ghlFetch(`/opportunities/pipelines?locationId=${locationId}`)
  const pipelines: GhlPipeline[] = (await res.json())?.pipelines ?? []

  const out = new Map<PipelineTarget, ResolvedPipeline>()

  for (const [key, target] of Object.entries(PIPELINE_TARGETS) as Array<
    [PipelineTarget, { pipeline: string; stage: string }]
  >) {
    const pipeline = pipelines.find((p) => norm(p.name) === norm(target.pipeline))
    if (!pipeline) continue

    const stage = (pipeline.stages ?? []).find((s) => norm(s.name) === norm(target.stage))
    // A pipeline whose stage was renamed is worse than a missing pipeline: the
    // opportunity would land in whatever stage happened to be first. Skip it
    // and let the caller log, rather than guess.
    if (!stage) continue

    out.set(key, { pipelineId: pipeline.id, stageId: stage.id })
  }

  return out
}
