// blocks/ScheduleCallCTA/Component.tsx

import type { ScheduleCallCTABlock as ScheduleCallCTABlockType } from '@/payload-types'
import React from 'react'
import { ScheduleCallCTAClient } from './Component.client'

export const ScheduleCallCTABlock: React.FC<ScheduleCallCTABlockType> = (props) => {
  return <ScheduleCallCTAClient {...props} />
}