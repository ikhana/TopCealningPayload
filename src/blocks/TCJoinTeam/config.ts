import type { Block } from 'payload'

export const TCJoinTeam: Block = {
  slug: 'tcJoinTeam',
  interfaceName: 'TCJoinTeamBlock',
  dbName: 'tc_join_team',
  labels: { singular: 'TC Join Team', plural: 'TC Join Team' },
  fields: [], // content hardcoded for now
}
