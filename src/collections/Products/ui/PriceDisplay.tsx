'use client'
import { useField } from '@payloadcms/ui'
import React from 'react'

export const PriceDisplay: React.FC = () => {
  const { value } = useField<number>({ path: 'calculatedTotalPrice' })
  
  if (!value || typeof value !== 'number') return <div>$0.00</div>
  
  const dollars = (value / 100).toFixed(2)
  
  return (
    <div style={{ 
      fontSize: '16px', 
      fontWeight: 'bold',
      color: '#333'
    }}>
      ${dollars}
    </div>
  )
}