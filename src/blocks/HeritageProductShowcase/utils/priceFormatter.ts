// src/blocks/HeritageProductShowcase/utils/priceFormatter.ts

type ProductType = {
  price?: number
  enableVariants?: boolean
  variants?: { price?: number }[]
}

type PriceConfig = {
  priceType?: 'auto' | 'from' | 'starting' | 'unit' | 'custom' | 'hidden'
  customPrice?: string
  unitText?: string
  overridePrice?: number
}

export interface FormattedPrice {
  display: string
  shouldShow: boolean
  isCustom: boolean
}

/**
 * Format product price based on simplified configuration
 */
export function formatProductPrice(
  product: ProductType,
  config?: PriceConfig
): FormattedPrice {
  const priceConfig = config || { priceType: 'auto' }
  
  // Handle hidden prices
  if (priceConfig.priceType === 'hidden') {
    return {
      display: '',
      shouldShow: false,
      isCustom: false
    }
  }

  // Handle custom text
  if (priceConfig.priceType === 'custom' && priceConfig.customPrice) {
    return {
      display: priceConfig.customPrice,
      shouldShow: true,
      isCustom: true
    }
  }

  // Get the base price (either override or product price)
  const basePrice = priceConfig.overridePrice || getProductPrice(product)
  
  if (!basePrice || basePrice <= 0) {
    return {
      display: '',
      shouldShow: false,
      isCustom: false
    }
  }

  const formattedPrice = formatCurrency(basePrice)

  // Format based on type
  switch (priceConfig.priceType) {
    case 'from':
      return {
        display: `from ${formattedPrice}`,
        shouldShow: true,
        isCustom: false
      }

    case 'starting':
      return {
        display: `starting at ${formattedPrice}`,
        shouldShow: true,
        isCustom: false
      }

    case 'unit':
      const unitText = priceConfig.unitText || 'each'
      return {
        display: `${formattedPrice} ${unitText}`,
        shouldShow: true,
        isCustom: false
      }

    case 'auto':
    default:
      // Auto logic: show "from" for products with variants, regular price otherwise
      if (product.enableVariants && product.variants && product.variants.length > 1) {
        return {
          display: `from ${formattedPrice}`,
          shouldShow: true,
          isCustom: false
        }
      } else {
        return {
          display: formattedPrice,
          shouldShow: true,
          isCustom: false
        }
      }
  }
}

/**
 * Get the primary price from a product
 */
function getProductPrice(product: ProductType): number | null {
  // If variants are enabled and exist, use the first variant's price
  if (product.enableVariants && product.variants && product.variants.length > 0) {
    const variantPrice = product.variants[0]?.price
    if (variantPrice && variantPrice > 0) {
      return variantPrice
    }
  }
  
  // Otherwise use the base product price
  return product.price || null
}

/**
 * Format a number as currency
 */
function formatCurrency(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price / 100) // Assuming price is in cents
}

/**
 * Get minimum price from variants (useful for "from" pricing)
 */
export function getMinimumVariantPrice(product: ProductType): number | null {
  if (!product.enableVariants || !product.variants || product.variants.length === 0) {
    return product.price || null
  }

  const variantPrices = product.variants
    .map(variant => variant.price)
    .filter((price): price is number => typeof price === 'number' && price > 0)

  if (variantPrices.length === 0) {
    return product.price || null
  }

  return Math.min(...variantPrices)
}