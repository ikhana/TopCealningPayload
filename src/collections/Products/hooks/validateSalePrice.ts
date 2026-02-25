// src/collections/Products/hooks/validateSalePrice.ts
import type { FieldHook } from 'payload'

interface ProductSaleData {
  enableVariants?: boolean
  price?: number
  salePrice?: number
  saleActive?: boolean
  saleStartDate?: string
  saleEndDate?: string
}

interface VariantSaleData {
  price?: number
  salePrice?: number
}

export const validateSalePrice: FieldHook = async ({ 
  value, 
  siblingData,
  data,
  operation
}) => {
  // Only validate on create or update
  if (operation !== 'create' && operation !== 'update') {
    return value
  }

  // Skip if no sale price
  if (!value) return value

  const productData = data as ProductSaleData
  const siblingProductData = siblingData as ProductSaleData

  // For non-variant products
  if (!productData?.enableVariants && !siblingProductData?.enableVariants) {
    // Check both data and siblingData for the price
    const regularPrice = productData?.price || siblingProductData?.price || 0
    
    if (regularPrice === 0) {
      // If price is still 0, skip validation (price not set yet)
      return value
    }
    
    if (value >= regularPrice) {
      throw new Error(`Sale price (${(value / 100).toFixed(2)}) must be less than regular price (${(regularPrice / 100).toFixed(2)})`)
    }
  }

  return value
}

// For variant sale price validation
export const validateVariantSalePrice: FieldHook = async ({ 
  value, 
  siblingData
}) => {
  if (!value) return value

  const data = siblingData as VariantSaleData
  
  // Get the variant's regular price
  const regularPrice = data?.price || 0
  
  if (value >= regularPrice) {
    const regularPriceDisplay = (regularPrice / 100).toFixed(2)
    const salePriceDisplay = (value / 100).toFixed(2)
    throw new Error(`Variant sale price ($${salePriceDisplay}) must be less than regular price ($${regularPriceDisplay})`)
  }

  return value
}

// Hook to auto-manage sale active status
export const manageSaleActive: FieldHook = async ({ 
  siblingData,
  value 
}) => {
  const data = siblingData as ProductSaleData
  
  // If no sale price, ensure sale is not active
  if (!data?.salePrice) {
    return false
  }

  // Check date validity if provided
  const now = new Date()
  
  if (data?.saleStartDate) {
    const startDate = new Date(data.saleStartDate)
    if (now < startDate) {
      return false // Sale hasn't started yet
    }
  }

  if (data?.saleEndDate) {
    const endDate = new Date(data.saleEndDate)
    if (now > endDate) {
      return false // Sale has ended
    }
  }

  // If explicitly set, respect the value
  if (typeof value === 'boolean') {
    return value
  }

  // Default to true if sale price exists and within date range
  return true
}

// Validate sale end date is after start date
export const validateSaleEndDate: FieldHook = async ({
  value,
  siblingData
}) => {
  if (!value) return value

  const data = siblingData as ProductSaleData
  
  if (data?.saleStartDate) {
    const startDate = new Date(data.saleStartDate)
    const endDate = new Date(value as string)
    
    if (endDate <= startDate) {
      throw new Error('Sale end date must be after start date')
    }
  }

  return value
}