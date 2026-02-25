'use client'
import { useField, useFormFields } from '@payloadcms/ui'
import React, { useState } from 'react'

interface ValidatedPriceInputProps {
  path: string
  label?: string
  required?: boolean
  admin?: {
    description?: string
  }
}

export const ValidatedPriceInput: React.FC<ValidatedPriceInputProps> = (props) => {
  const { path } = props
  const field = useField({ path })
  const { value, setValue } = field
  
  // Get all form fields
  const formFields = useFormFields(([fields]) => fields)
  
  const [localError, setLocalError] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')
  
  // Initialize input value
  React.useEffect(() => {
    if (value && !inputValue) {
      setInputValue((Number(value) / 100).toFixed(2))
    }
  }, [value, inputValue])
  
  // Determine if this is a variant or main product
  const isVariant = path.includes('variants')
  
  // Get the regular price
  let regularPrice = 0
  if (isVariant) {
    // For variants, we need to get the price from the same variant
    const pathParts = path.split('.')
    if (pathParts.length >= 3) {
      const variantIndex = pathParts[1]
      const pricePath = `variants.${variantIndex}.price`
      regularPrice = formFields?.[pricePath]?.value as number || 0
    }
  } else {
    // For main product
    regularPrice = formFields?.price?.value as number || 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    
    // Allow typing decimal values
    setInputValue(newValue)
    
    // Only validate and set value if it's a valid number
    if (newValue === '') {
      setValue(0)
      setLocalError('')
      return
    }
    
    // Check if it's a valid number format (allows decimals while typing)
    const isValidFormat = /^\d*\.?\d*$/.test(newValue)
    if (!isValidFormat) {
      return
    }
    
    // Parse and validate when it's a complete number
    const dollars = parseFloat(newValue)
    if (!isNaN(dollars)) {
      const cents = Math.round(dollars * 100)
      setValue(cents)
      
      // Validate immediately
      if (regularPrice > 0 && cents >= regularPrice) {
        const message = `Sale price must be less than regular price ($${(regularPrice / 100).toFixed(2)})`
        setLocalError(message)
      } else {
        setLocalError('')
      }
    }
  }

  // Format on blur
  const handleBlur = () => {
    const dollars = parseFloat(inputValue)
    if (!isNaN(dollars)) {
      setInputValue(dollars.toFixed(2))
    } else {
      setInputValue('')
    }
  }

  // Also check for server-side validation errors
  const serverError = 'errorMessage' in field ? field.errorMessage : ''
  const showError = 'showError' in field ? field.showError : false
  const displayError = localError || (showError && serverError)

  return (
    <div className="field-type number">
      <div className="field-input-wrapper">
        <div className="price-input-wrapper" style={{ position: 'relative' }}>
          <span style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: '#666',
            pointerEvents: 'none',
            zIndex: 1
          }}>
            $
          </span>
          <input
            type="text" // Changed from number to text to allow decimal typing
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="0.00"
            style={{ 
              paddingLeft: '28px',
              width: '100%',
              border: displayError ? '1px solid #ff3b30' : '1px solid #e3e3e3',
              borderRadius: '4px',
              padding: '8px 12px 8px 28px',
              fontSize: '14px',
              backgroundColor: '#fff',
              transition: 'border-color 0.2s'
            }}
          />
        </div>
        {displayError && (
          <div className="field-error" style={{ 
            color: '#ff3b30', 
            fontSize: '12px', 
            marginTop: '4px',
            fontWeight: '500'
          }}>
            {displayError}
          </div>
        )}
      </div>
    </div>
  )
}