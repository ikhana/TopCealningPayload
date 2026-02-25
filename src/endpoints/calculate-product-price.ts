// src/endpoints/calculate-product-price.ts
import type { PayloadHandler } from 'payload'
import { addDataAndFileToRequest } from 'payload'

interface PriceCalculationRequest {
  productId: string
  quantity?: number
  selectedComponents?: Array<{
    componentId: string
    optionSlug: string
  }>
  selectedAddOns?: Array<{
    addOnId: string
    quantity: number
  }>
  selectedPersonalizations?: Array<{
    personalizationId: string
    value: any
  }>
  variantId?: string
}

interface PriceCalculationResponse {
  basePrice: number
  componentModifiers: number
  addOnsTotal: number
  personalizationTotal: number
  quantity: number
  unitPrice: number
  totalPrice: number
  breakdown: {
    components: Array<{
      title: string
      option: string
      modifier: number
    }>
    addOns: Array<{
      title: string
      quantity: number
      unitPrice: number
      total: number
    }>
    personalizations: Array<{
      label: string
      additionalPrice: number
    }>
  }
}

/**
 * Calculate the total price of a product with all selected options
 * POST /api/calculate-product-price
 */
export const calculateProductPrice: PayloadHandler = async (req) => {
  const { payload } = req

  await addDataAndFileToRequest(req)

  const {
    productId,
    quantity = 1,
    selectedComponents = [],
    selectedAddOns = [],
    selectedPersonalizations = [],
    variantId,
  } = req.data as PriceCalculationRequest

  if (!productId) {
    return Response.json({ error: 'Product ID is required' }, { status: 400 })
  }

  try {
    // Fetch the product
    const product = await payload.findByID({
      collection: 'products',
      id: productId,
      depth: 0,
    })

    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 })
    }

    let basePrice = 0
    let componentModifiers = 0
    let addOnsTotal = 0
    let personalizationTotal = 0

    const breakdown: PriceCalculationResponse['breakdown'] = {
      components: [],
      addOns: [],
      personalizations: [],
    }

    // Determine base price
    if (product.enableVariants && variantId) {
      const variant = product.variants?.find((v) => v.id === variantId)
      if (!variant) {
        return Response.json({ error: 'Variant not found' }, { status: 404 })
      }
      basePrice = variant.price
    } else if (product.enableComponentCustomization && product.componentConfig?.basePrice) {
      basePrice = product.componentConfig.basePrice
    } else {
      basePrice = product.price || 0
    }

    // Calculate component modifiers
    if (product.enableComponentCustomization && selectedComponents.length > 0) {
      const componentIds = selectedComponents.map((c) => c.componentId)
      
      const components = await payload.find({
        collection: 'product-components',
        where: {
          id: {
            in: componentIds,
          },
        },
        depth: 0,
      })

      const pricingStrategy = product.componentConfig?.pricingStrategy || 'additive'

      for (const selectedComponent of selectedComponents) {
        const component = components.docs.find((c) => c.id === selectedComponent.componentId)
        
        if (component && component.componentOptions) {
          const option = component.componentOptions.find(
            (opt) => opt.optionSlug === selectedComponent.optionSlug
          )
          
          if (option && option.priceModifier) {
            let modifier = 0
            
            switch (pricingStrategy) {
              case 'additive':
                modifier = option.priceModifier
                componentModifiers += modifier
                break
              
              case 'override':
                // For override, we use the option price as the total
                basePrice = option.priceModifier
                modifier = option.priceModifier - (product.componentConfig?.basePrice || 0)
                break
              
              case 'percentage':
                // Add percentage of base price
                const percentageAmount = (basePrice * option.priceModifier) / 100
                modifier = percentageAmount
                componentModifiers += modifier
                break
            }

            breakdown.components.push({
              title: component.title,
              option: option.optionTitle,
              modifier: modifier,
            })
          }
        }
      }
    }

    // Calculate add-ons total
    if (selectedAddOns.length > 0) {
      const addOnIds = selectedAddOns.map((a) => a.addOnId)
      
      const addOns = await payload.find({
        collection: 'addons',
        where: {
          id: {
            in: addOnIds,
          },
        },
        depth: 0,
      })

      for (const selectedAddOn of selectedAddOns) {
        const addOn = addOns.docs.find((a) => a.id === selectedAddOn.addOnId)
        
        if (addOn) {
          const addOnQuantity = selectedAddOn.quantity || 1
          const addOnTotalPrice = addOn.price * addOnQuantity
          addOnsTotal += addOnTotalPrice

          breakdown.addOns.push({
            title: addOn.title,
            quantity: addOnQuantity,
            unitPrice: addOn.price,
            total: addOnTotalPrice,
          })
        }
      }
    }

    // Calculate personalization total
    if (selectedPersonalizations.length > 0) {
      const personalizationIds = selectedPersonalizations.map((p) => p.personalizationId)
      
      const personalizations = await payload.find({
        collection: 'personalization-options',
        where: {
          id: {
            in: personalizationIds,
          },
        },
        depth: 0,
      })

      for (const selectedPersonalization of selectedPersonalizations) {
        const personalization = personalizations.docs.find(
          (p) => p.id === selectedPersonalization.personalizationId
        )
        
        if (personalization) {
          let additionalPrice = 0
          
          if (personalization.pricingType === 'flat') {
            additionalPrice = personalization.additionalPrice || 0
          } else if (personalization.pricingType === 'per_character') {
            const value = selectedPersonalization.value
            const characterCount = typeof value === 'string' ? value.length : 0
            additionalPrice = (personalization.additionalPrice || 0) * characterCount
          }
          
          personalizationTotal += additionalPrice

          breakdown.personalizations.push({
            label: personalization.label,
            additionalPrice: additionalPrice,
          })
        }
      }
    }

    // Calculate totals
    const unitPrice = basePrice + componentModifiers + personalizationTotal
    const totalPrice = (unitPrice * quantity) + addOnsTotal

    const response: PriceCalculationResponse = {
      basePrice,
      componentModifiers,
      addOnsTotal,
      personalizationTotal,
      quantity,
      unitPrice,
      totalPrice,
      breakdown,
    }

    return Response.json(response, { status: 200 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    payload.logger.error(`Error calculating product price: ${message}`)

    return Response.json({ error: message }, { status: 500 })
  }
}