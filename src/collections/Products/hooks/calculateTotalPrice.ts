import type { Product } from '@/payload-types'
import type { FieldHook } from 'payload'

interface ExtendedProductData extends Partial<Product> {
  saleConfiguration?: {
    saleActive?: boolean
    salePrice?: number
    saleStartDate?: string
    saleEndDate?: string
  }
  selectedComponentOptions?: Array<{
    componentId: string
    optionSlug: string
  }>
  selectedAddOns?: string[]
  selectedPersonalizations?: string[]
  personalizationValues?: Record<string, any>
}

export const calculateTotalPrice: FieldHook<Product> = async ({ 
  data, 
  req,
  siblingData 
}) => {
  let totalPrice = 0

  const productData = data as ExtendedProductData
  const siblingProductData = siblingData as ExtendedProductData

  const saleActive = productData?.saleConfiguration?.saleActive || siblingProductData?.saleConfiguration?.saleActive
  const salePrice = productData?.saleConfiguration?.salePrice || siblingProductData?.saleConfiguration?.salePrice

  const useSalePrice = saleActive && salePrice

  if (productData?.enableComponentCustomization && productData?.componentConfig?.basePrice) {
    totalPrice = productData.componentConfig.basePrice
  } else if (useSalePrice) {
    totalPrice = salePrice || 0
  } else if (productData?.price || siblingProductData?.price) {
    totalPrice = productData?.price || siblingProductData?.price || 0
  }

  if (productData?.enableVariants && productData?.variants) {
    const activePrices = productData.variants
      .filter(v => v.active)
      .map(v => {
        if (v.saleActive && v.salePrice) {
          return v.salePrice
        }
        return v.price || 0
      })
      .filter(p => p > 0)
    
    if (activePrices.length > 0) {
      totalPrice = Math.min(...activePrices)
    }
  }

  const { payload } = req

  if (productData?.enableComponentCustomization && productData?.selectedComponentOptions) {
    const selectedOptions = productData.selectedComponentOptions

    const componentIds = [...new Set(selectedOptions.map(opt => opt.componentId))]
    
    if (componentIds.length > 0) {
      const components = await payload.find({
        collection: 'product-components',
        where: {
          id: {
            in: componentIds,
          },
        },
        depth: 0,
      })

      const pricingStrategy = productData.componentConfig?.pricingStrategy || 'additive'

      for (const selectedOption of selectedOptions) {
        const component = components.docs.find(c => String(c.id) === selectedOption.componentId)
        
        if (component && component.componentOptions) {
          const option = component.componentOptions.find(
            opt => opt.optionSlug === selectedOption.optionSlug
          )
          
          if (option && option.priceModifier) {
            switch (pricingStrategy) {
              case 'additive':
                totalPrice += option.priceModifier
                break
              
              case 'override':
                totalPrice = option.priceModifier
                break
              
              case 'percentage':
                const basePrice = productData.componentConfig?.basePrice || 0
                totalPrice += (basePrice * option.priceModifier / 100)
                break
            }
          }
        }
      }
    }
  }

  if (productData?.availableAddOns && Array.isArray(productData.availableAddOns)) {
    const selectedAddOnIds = productData.selectedAddOns || []
    
    if (selectedAddOnIds.length > 0) {
      const addOns = await payload.find({
        collection: 'addons',
        where: {
          id: {
            in: selectedAddOnIds,
          },
        },
        depth: 0,
      })
      
      for (const addOn of addOns.docs) {
        if (addOn.price) {
          totalPrice += addOn.price
        }
      }
    }
  }

  if (productData?.personalizationOptions && Array.isArray(productData.personalizationOptions)) {
    const selectedPersonalizationIds = productData.selectedPersonalizations || []
    
    if (selectedPersonalizationIds.length > 0) {
      const personalizations = await payload.find({
        collection: 'personalization-options',
        where: {
          id: {
            in: selectedPersonalizationIds,
          },
        },
        depth: 0,
      })
      
      for (const personalization of personalizations.docs) {
        if (personalization.additionalPrice && personalization.pricingType === 'flat') {
          totalPrice += personalization.additionalPrice
        } else if (personalization.additionalPrice) {
          totalPrice += personalization.additionalPrice
        }
      }
    }
  }

  return totalPrice
}

export const beforeProductSave: FieldHook<Product> = async (args) => {
  const { data } = args
  const calculatedPrice = await calculateTotalPrice(args)
  
  if (data) {
    data.calculatedTotalPrice = calculatedPrice
  }
  
  return data
}