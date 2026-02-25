// src/blocks/QualityGuarantee/ui/GuaranteeRowLabel.tsx
'use client'

import { RowLabelProps, useRowLabel } from '@payloadcms/ui'
import React from 'react'

export const GuaranteeRowLabel: React.FC<RowLabelProps> = () => {
  const { data, rowNumber } = useRowLabel<{
    guaranteeTitle?: string
    guaranteeIcon?: string
    highlightGuarantee?: boolean
  }>()

  // Get the guarantee data safely
  const guaranteeTitle = data?.guaranteeTitle || `Medical Standard ${rowNumber || 1}`
  const guaranteeIcon = data?.guaranteeIcon || 'shield'
  const isHighlighted = data?.highlightGuarantee || false

  // Medical icon mapping for display - using medical abbreviations
  const getIconDisplay = (iconType: string): string => {
    switch (iconType) {
      case 'shield': return 'CL' // CLIA
      case 'flag': return 'US' // USA Standards
      case 'leaf': return 'EC' // Eco Compliance
      case 'hammer': return 'QC' // Quality Control (changed from HC)
      case 'diamond': return 'PR' // Premium (changed from PQ)
      case 'trophy': return 'AW' // Award
      case 'fire': return 'AC' // Accuracy (changed from BH)
      case 'tree': return 'CA' // Care (changed from WM)
      case 'star': return 'EX' // Excellence
      case 'target': return 'PR' // Precision
      case 'heart': return 'CR' // Care
      case 'microscope': return 'LB' // Lab
      case 'stethoscope': return 'MD' // Medical
      case 'activity': return 'VT' // Vital
      default: return 'MS' // Medical Standard
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      padding: '4px 0',
    }}>
      {/* Medical Icon Badge */}
      <span style={{ 
        fontSize: '10px', 
        minWidth: '24px',
        height: '16px',
        backgroundColor: '#D84D2B', // coral color
        color: '#F8F9FB', // clinical-white
        borderRadius: '2px', // More square/medical look
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        letterSpacing: '0.5px',
        border: '1px solid #D84D2B',
      }}>
        {getIconDisplay(guaranteeIcon)}
      </span>
      
      {/* Medical Title */}
      <span style={{ 
        fontWeight: isHighlighted ? '600' : '500',
        color: isHighlighted ? '#D84D2B' : '#1E293B', // coral vs dark-navy
        fontSize: '14px',
      }}>
        {guaranteeTitle}
      </span>
      
      {/* Priority Highlight Indicator */}
      {isHighlighted && (
        <span style={{
          backgroundColor: '#D84D2B', // coral
          color: '#F8F9FB', // clinical-white
          fontSize: '10px',
          padding: '2px 6px',
          borderRadius: '2px', // More square for medical theme
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          border: '1px solid #D84D2B',
        }}>
          Priority
        </span>
      )}
    </div>
  )
}