import React from 'react'
import { TCJoinTeamClient } from './Component.client'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcJoinTeam'
}

export const TCJoinTeamBlock: React.FC<Props> = (props) => {
  return <TCJoinTeamClient {...props} />
}
