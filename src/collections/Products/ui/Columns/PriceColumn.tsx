'use client'
import React from 'react'

interface PriceColumnProps {
  cellData?: number
  rowData: {
    enableVariants?: boolean
    price?: number
    salePrice?: number
    saleActive?: boolean
    saleConfiguration?: {
      saleActive?: boolean
      salePrice?: number
    }
    variants?: Array<{
      active?: boolean
      price?: number
      salePrice?: number
      saleActive?: boolean
    }>
  }
}

export const PriceColumn: React.FC<PriceColumnProps> = ({ cellData, rowData }) => {
  let displayPrice = 0
  let originalPrice = 0
  let isOnSale = false

  if (rowData.enableVariants && rowData.variants && rowData.variants.length > 0) {
    const activePrices = rowData.variants
      .filter(v => v.active)
      .map(v => ({
        regular: v.price || 0,
        sale: v.saleActive && v.salePrice ? v.salePrice : null
      }))
      .filter(p => p.regular > 0)

    if (activePrices.length > 0) {
      const regularPrices = activePrices.map(p => p.regular)
      const minRegular = Math.min(...regularPrices)
      const maxRegular = Math.max(...regularPrices)
      
      const salePrices = activePrices
        .filter(p => p.sale !== null)
        .map(p => p.sale as number)
      
      if (salePrices.length > 0) {
        const minSale = Math.min(...salePrices)
        displayPrice = minSale
        originalPrice = minRegular
        isOnSale = true
      } else {
        displayPrice = minRegular
      }

      if (minRegular !== maxRegular && !isOnSale) {
        return (
          <div>
            ${(minRegular / 100).toFixed(2)} - ${(maxRegular / 100).toFixed(2)}
          </div>
        )
      }
    }
  } else {
    const saleActive = rowData.saleConfiguration?.saleActive || rowData.saleActive
    const salePrice = rowData.saleConfiguration?.salePrice || rowData.salePrice
    
    if (saleActive && salePrice) {
      displayPrice = salePrice
      originalPrice = rowData.price || 0
      isOnSale = true
    } else {
      displayPrice = rowData.price || 0
    }
  }

  if (isOnSale && originalPrice > displayPrice) {
    const savingsPercent = originalPrice > 0 
      ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
      : 0

    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ 
          textDecoration: 'line-through', 
          color: '#999',
          fontSize: '14px'
        }}>
          ${(originalPrice / 100).toFixed(2)}
        </span>
        <span style={{ 
          color: '#c41e3a',
          fontWeight: 'bold' 
        }}>
          ${(displayPrice / 100).toFixed(2)}
        </span>
        {savingsPercent > 0 && (
          <span style={{ 
            color: '#c41e3a',
            fontSize: '12px'
          }}>
            (-{savingsPercent}%)
          </span>
        )}
      </div>
    )
  }

  return <div>${(displayPrice / 100).toFixed(2)}</div>
}