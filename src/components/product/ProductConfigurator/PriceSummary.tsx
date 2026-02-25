import { Addon, PersonalizationOption, Product } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { formatNumberToCurrency } from '@/utilities/formatNumberToCurrency'
import React from 'react'
import { ProductConfiguration } from './index'

interface PriceSummaryProps {
  basePrice: number
  configuration: ProductConfiguration
  product: Product
  className?: string
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  basePrice,
  configuration,
  product,
  className
}) => {
  const isOnSale = !product.enableVariants && product.saleConfiguration?.saleActive && product.saleConfiguration?.salePrice
  const originalPrice = isOnSale ? product.price : undefined

  const addOnsPrice = React.useMemo(() => {
    if (!product.availableAddOns || configuration.selectedAddOns.length === 0) {
      return 0
    }

    return product.availableAddOns.reduce((total, addon) => {
      if (typeof addon === 'number' || !addon) return total
      
      if (configuration.selectedAddOns.includes(String(addon.id))) {
        return total + (addon.price || 0)
      }
      
      return total
    }, 0)
  }, [product.availableAddOns, configuration.selectedAddOns])

  const personalizationPrice = React.useMemo(() => {
    if (!product.personalizationOptions || configuration.personalization.length === 0) {
      return 0
    }

    return product.personalizationOptions.reduce((total, option) => {
      if (typeof option === 'number' || !option) return total
      
      const personalizationValue = configuration.personalization.find(
        p => p.optionId === String(option.id)
      )
      
      if (!personalizationValue) return total

      if (option.personalizationType === 'style' && option.fieldType === 'select' && option.options) {
        const selectedOption = option.options.find(opt => opt.value === personalizationValue.value)
        if (selectedOption?.additionalPrice) {
          return total + selectedOption.additionalPrice
        }
      }

      if (option.fieldType === 'select' && option.options) {
        const selectedOption = option.options.find(opt => opt.value === personalizationValue.value)
        if (selectedOption?.additionalPrice) {
          return total + selectedOption.additionalPrice
        }
      }

      if (option.pricingType === 'flat' && option.additionalPrice) {
        return total + option.additionalPrice
      }

      return total
    }, 0)
  }, [product.personalizationOptions, configuration.personalization])

  const totalPrice = basePrice + addOnsPrice + personalizationPrice
  const hasConfiguration = configuration.selectedAddOns.length > 0 || configuration.personalization.length > 0

  const getAddonData = (addons: typeof product.availableAddOns, addonId: string): Addon | null => {
    if (!addons) return null
    
    for (const addon of addons) {
      if (typeof addon !== 'number' && addon && String(addon.id) === addonId) {
        return addon
      }
    }
    return null
  }

  const getPersonalizationData = (options: typeof product.personalizationOptions, optionId: string): PersonalizationOption | null => {
    if (!options) return null
    
    for (const option of options) {
      if (typeof option !== 'number' && option && String(option.id) === optionId) {
        return option
      }
    }
    return null
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="bg-deep-charcoal dark:bg-charcoal-black/80 text-white p-4 rounded-lg">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-80">Base Price</span>
            <div className="text-right">
              {isOnSale && originalPrice && (
                <span className="text-sm line-through opacity-60 mr-2">
                  {formatNumberToCurrency(originalPrice)}
                </span>
              )}
              <span className={cn(isOnSale && "text-green-400")}>
                {formatNumberToCurrency(basePrice)}
              </span>
            </div>
          </div>

          {addOnsPrice > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="opacity-80">Add-ons</span>
              <span>+{formatNumberToCurrency(addOnsPrice)}</span>
            </div>
          )}

          {personalizationPrice > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="opacity-80">Personalization</span>
              <span>+{formatNumberToCurrency(personalizationPrice)}</span>
            </div>
          )}

          {hasConfiguration && (
            <div className="border-t border-white/20 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-xl text-copper-bourbon">{formatNumberToCurrency(totalPrice)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {hasConfiguration && (
        <details className="group">
          <summary className="cursor-pointer text-xs text-muted-foreground hover:text-deep-charcoal dark:hover:text-antique-white list-none flex items-center gap-1">
            <svg className="w-3 h-3 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            View configuration details
          </summary>
          
          <div className="mt-2 text-xs space-y-1 pl-4">
            {configuration.selectedAddOns.map(addonId => {
              const addon = getAddonData(product.availableAddOns, addonId)
              if (!addon) return null
              
              return (
                <div key={addon.id} className="flex justify-between text-muted-foreground">
                  <span>{addon.title}</span>
                  <span>{addon.price && addon.price > 0 ? `+${formatNumberToCurrency(addon.price)}` : 'Included'}</span>
                </div>
              )
            })}
            
            {configuration.personalization.map((personalizationValue) => {
              const option = getPersonalizationData(product.personalizationOptions, personalizationValue.optionId)
              if (!option) return null

              let displayValue = ''
              if (option.personalizationType === 'style' && option.styleFields && personalizationValue.subValues) {
                const values = option.styleFields
                  .filter(field => personalizationValue.subValues?.[field.fieldKey])
                  .map(field => personalizationValue.subValues![field.fieldKey])
                displayValue = values.join(', ')
              } else if (typeof personalizationValue.value === 'string') {
                displayValue = personalizationValue.value.substring(0, 30) + (personalizationValue.value.length > 30 ? '...' : '')
              }

              return (
                <div key={option.id} className="text-muted-foreground">
                  <div className="font-medium">{option.label}</div>
                  {displayValue && <div className="pl-2 opacity-75">{displayValue}</div>}
                </div>
              )
            })}
          </div>
        </details>
      )}
    </div>
  )
}