'use client'
import { Product } from '@/payload-types'
import { cn } from '@/utilities/cn'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { AddOnsSelector } from './AddOnsSelector'
import { ComponentSelector } from './ComponentSelector'
import { PersonalizationForm } from './PersonalizationForm'
import { PriceSummary } from './PriceSummary'

interface ProductConfiguratorProps {
  product: Product
  onConfigurationChange?: (config: ProductConfiguration) => void
  className?: string
}

export interface ProductConfiguration {
  productId: string
  selectedAddOns: string[]
  selectedComponents: Record<string, string>
  personalization: {
    optionId: string
    value: string | any
    subValues?: Record<string, any>
  }[]
  calculatedPrice?: number
}

export const ProductConfigurator: React.FC<ProductConfiguratorProps> = ({
  product,
  onConfigurationChange,
  className
}) => {
  const initialAddOns = useMemo(() => {
    if (!product.requiredAddOns) return []
    
    return product.requiredAddOns
      .map(addon => {
        if (typeof addon === 'number') return null
        return addon?.id ? String(addon.id) : null
      })
      .filter((id): id is string => id !== null)
  }, [product.requiredAddOns])

  const initialComponents = useMemo(() => {
    const components: Record<string, string> = {}
    
    if (product.componentConfig?.components) {
      product.componentConfig.components.forEach(component => {
        if (typeof component === 'number' || !component) return
        
        if (component.defaultOption) {
          components[String(component.id)] = component.defaultOption
        } else if (component.componentOptions?.length) {
          components[String(component.id)] = component.componentOptions[0].optionSlug
        }
      })
    }
    
    return components
  }, [product.componentConfig?.components])

  const getBasePrice = () => {
    if (product.componentConfig?.basePrice) {
      return product.componentConfig.basePrice
    }
    
    if (!product.enableVariants && product.saleConfiguration?.saleActive && product.saleConfiguration?.salePrice) {
      return product.saleConfiguration.salePrice
    }
    
    return product.price || 0
  }

  const [configuration, setConfiguration] = useState<ProductConfiguration>({
    productId: String(product.id),
    selectedAddOns: initialAddOns,
    selectedComponents: initialComponents,
    personalization: [],
    calculatedPrice: getBasePrice()
  })

  const handleAddOnToggle = useCallback((addOnId: string, selected: boolean) => {
    setConfiguration(prev => ({
      ...prev,
      selectedAddOns: selected 
        ? [...prev.selectedAddOns, addOnId]
        : prev.selectedAddOns.filter(id => id !== addOnId)
    }))
  }, [])

  const handleComponentChange = useCallback((componentId: string, optionSlug: string) => {
    setConfiguration(prev => ({
      ...prev,
      selectedComponents: {
        ...prev.selectedComponents,
        [componentId]: optionSlug
      }
    }))
  }, [])

  const handlePersonalizationChange = useCallback((optionId: string, value: any, subValues?: Record<string, any>) => {
    setConfiguration(prev => {
      const existing = prev.personalization.filter(p => p.optionId !== optionId)
      
      if (value !== null && value !== undefined && value !== '') {
        return {
          ...prev,
          personalization: [...existing, { optionId, value, subValues }]
        }
      }
      
      return {
        ...prev,
        personalization: existing
      }
    })
  }, [])

  const getAddonPrice = (addon: any): number => {
    if (!addon || typeof addon === 'number') return 0
    if ('price' in addon && typeof addon.price === 'number') {
      return addon.price
    }
    return 0
  }

  const getComponentPrice = (component: any, optionSlug: string): number => {
    if (!component || typeof component === 'number') return 0
    
    const option = component.componentOptions?.find(
      (opt: any) => opt.optionSlug === optionSlug
    )
    
    if (option && typeof option.priceModifier === 'number') {
      return option.priceModifier
    }
    return 0
  }

  const calculatedPrice = useMemo(() => {
    let total = getBasePrice()

    if (product.availableAddOns && configuration.selectedAddOns.length > 0) {
      product.availableAddOns.forEach(addon => {
        if (typeof addon === 'number' || !addon || !addon.id) return
        
        if (configuration.selectedAddOns.includes(String(addon.id))) {
          total += getAddonPrice(addon)
        }
      })
    }

    if (product.componentConfig?.components && Object.keys(configuration.selectedComponents).length > 0) {
      product.componentConfig.components.forEach(component => {
        if (typeof component === 'number' || !component || !component.id) return
        
        const selectedOption = configuration.selectedComponents[String(component.id)]
        if (selectedOption) {
          total += getComponentPrice(component, selectedOption)
        }
      })
    }

    if (product.personalizationOptions && configuration.personalization.length > 0) {
      product.personalizationOptions.forEach(option => {
        if (typeof option === 'number' || !option || !option.id) return
        
        const personalizationValue = configuration.personalization.find(
          p => p.optionId === String(option.id)
        )
        
        if (personalizationValue) {
          if (option.personalizationType === 'style' && option.fieldType === 'select' && option.options) {
            const selectedStyle = option.options.find(opt => opt.value === personalizationValue.value)
            if (selectedStyle?.additionalPrice) {
              total += selectedStyle.additionalPrice
            }
          } else if (option.fieldType === 'select' && option.options) {
            const selectedOption = option.options.find(opt => opt.value === personalizationValue.value)
            if (selectedOption?.additionalPrice) {
              total += selectedOption.additionalPrice
            }
          } else if (option.additionalPrice && option.pricingType === 'flat') {
            total += option.additionalPrice
          }
        }
      })
    }

    return total
  }, [product, configuration.selectedAddOns, configuration.selectedComponents, configuration.personalization])

  useEffect(() => {
    setConfiguration(prev => {
      if (prev.calculatedPrice === calculatedPrice) return prev
      return {
        ...prev,
        calculatedPrice
      }
    })
  }, [calculatedPrice])

  useEffect(() => {
    if (onConfigurationChange) {
      onConfigurationChange(configuration)
    }
  }, [configuration, onConfigurationChange])

  const hasComponents = product.enableComponentCustomization && product.componentConfig?.components?.length
  const hasAddOns = product.availableAddOns && product.availableAddOns.length > 0
  const hasPersonalization = product.personalizationOptions && product.personalizationOptions.length > 0

  if (!hasComponents && !hasAddOns && !hasPersonalization) {
    return (
      <div className="text-center py-8">
        <p className="text-antique-brass dark:text-smoky-gray font-sourcesans">
          This product comes ready-to-use with no customization options available.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      
      {hasComponents && (
        <ComponentSelector
          components={product.componentConfig.components}
          selectedComponents={configuration.selectedComponents}
          onChange={handleComponentChange}
        />
      )}

      {hasAddOns && (
        <AddOnsSelector
          availableAddOns={product.availableAddOns}
          requiredAddOns={product.requiredAddOns}
          selectedAddOns={configuration.selectedAddOns}
          onToggle={handleAddOnToggle}
        />
      )}

      {hasPersonalization && (
        <PersonalizationForm
          options={product.personalizationOptions}
          values={configuration.personalization}
          onChange={handlePersonalizationChange}
        />
      )}

      <div className="pt-3 border-t border-copper-bourbon/20 dark:border-charcoal-gold/20">
        <PriceSummary
          basePrice={getBasePrice()}
          configuration={configuration}
          product={product}
        />
      </div>
    </div>
  )
}