import { ghlFetch } from './client'
import type { GhlCreateOpportunityPayload, GhlOpportunity } from './types'

export async function createOpportunity(
  data: GhlCreateOpportunityPayload,
): Promise<GhlOpportunity> {
  const res = await ghlFetch('/opportunities/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  const json = await res.json()
  return json.opportunity ?? json
}

export async function moveStage(
  opportunityId: string,
  pipelineStageId: string,
): Promise<void> {
  await ghlFetch(`/opportunities/${opportunityId}`, {
    method: 'PUT',
    body: JSON.stringify({ pipelineStageId }),
  })
}

export async function markOpportunityWon(opportunityId: string): Promise<void> {
  await ghlFetch(`/opportunities/${opportunityId}`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'won' }),
  })
}
