import type { AvailableTestsBlock as AvailableTestsBlockType } from '@/payload-types'
import React from 'react'
import { AvailableTestsClient } from './Component.client'

export const AvailableTestsBlock: React.FC<AvailableTestsBlockType> = (props) => {
  return <AvailableTestsClient {...props} />
}