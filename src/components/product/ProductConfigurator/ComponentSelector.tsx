// src/components/product/ProductConfigurator/ComponentSelector.tsx
'use client'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProductComponent } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { formatNumberToCurrency } from '@/utilities/formatNumberToCurrency'
import React from 'react'

interface ComponentSelectorProps {
  components?: (number | ProductComponent | null)[] | null
  selectedComponents: Record<string, string>
  onChange: (componentId: string, optionSlug: string) => void
  className?: string
}

export const ComponentSelector: React.FC<ComponentSelectorProps> = ({
  components,
  selectedComponents,
  onChange,
  className
}) => {
  // Convert and organize components
  const validComponents = React.useMemo(() => {
    if (!components) return []
    
    return components
      .filter((comp): comp is ProductComponent => {
        return comp !== null && typeof comp !== 'number' && 'id' in comp
      })
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
  }, [components])

  if (validComponents.length === 0) {
    return (
      <p className="text-sm text-antique-brass dark:text-smoky-gray text-center py-4 font-sourcesans">
        No components available for customization
      </p>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {validComponents.map((component) => {
        const componentId = String(component.id)
        const selectedValue = selectedComponents[componentId] || ''
        
        // Filter active options
        const activeOptions = component.componentOptions?.filter(option => option.active !== false) || []
        
        if (activeOptions.length === 0) return null

        return (
          <div key={componentId} className="space-y-2">
            
            {/* Heritage Component Label */}
            <Label 
              htmlFor={`component-${componentId}`}
              className="text-base font-playfair font-medium text-deep-charcoal dark:text-antique-white"
            >
              {component.title}
              {component.required && (
                <span className="text-copper-bourbon dark:text-charcoal-gold ml-1">*</span>
              )}
            </Label>

            {/* Heritage Styled Select Dropdown */}
            <Select
              value={selectedValue}
              onValueChange={(value) => onChange(componentId, value)}
            >
              <SelectTrigger 
                id={`component-${componentId}`}
                className={cn(
                  // Heritage styling
                  'h-12 px-4 border-2 border-antique-brass/30 dark:border-charcoal-gold/30',
                  'bg-white dark:bg-charcoal-black/50',
                  'hover:border-copper-bourbon dark:hover:border-charcoal-gold',
                  'focus:border-copper-bourbon dark:focus:border-charcoal-gold focus:ring-copper-bourbon/20 dark:focus:ring-charcoal-gold/20',
                  'rounded-lg transition-all duration-300',
                  'font-sourcesans text-deep-charcoal dark:text-antique-white',
                  // Required validation styling
                  component.required && !selectedValue && 'border-red-300 dark:border-red-400'
                )}
              >
                <SelectValue 
                  placeholder={`Choose ${component.title.toLowerCase()}`}
                  className="font-sourcesans"
                />
              </SelectTrigger>
              
              <SelectContent className="bg-white dark:bg-charcoal-black border-antique-brass/30 dark:border-charcoal-gold/30 rounded-lg shadow-xl">
                {activeOptions.map((option) => {
                  const hasPrice = option.priceModifier && option.priceModifier !== 0
                  const priceText = hasPrice 
                    ? option.priceModifier > 0 
                      ? ` (+${formatNumberToCurrency(option.priceModifier)})`
                      : ` (${formatNumberToCurrency(option.priceModifier)})`
                    : ''

                  return (
                    <SelectItem
                      key={option.optionSlug}
                      value={option.optionSlug}
                      className={cn(
                        'font-sourcesans cursor-pointer',
                        'hover:bg-copper-bourbon/10 dark:hover:bg-charcoal-gold/10',
                        'focus:bg-copper-bourbon/15 dark:focus:bg-charcoal-gold/15',
                        'text-deep-charcoal dark:text-antique-white',
                        'px-4 py-3 transition-colors duration-200'
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{option.optionTitle}</span>
                        {hasPrice && (
                          <span className={cn(
                            'text-sm ml-2',
                            option.priceModifier > 0 
                              ? 'text-copper-bourbon dark:text-charcoal-gold' 
                              : 'text-green-600 dark:text-green-400'
                          )}>
                            {priceText}
                          </span>
                        )}
                      </div>
                      
                      {/* Option specifications if available */}
                      {option.specifications && option.specifications.length > 0 && (
                        <div className="mt-1 text-xs text-antique-brass dark:text-smoky-gray">
                          {option.specifications.slice(0, 2).map((spec, index) => (
                            <span key={spec.label || index}>
                              {spec.label}: {spec.value}
                              {index < Math.min(option.specifications.length - 1, 1) && ' • '}
                            </span>
                          ))}
                        </div>
                      )}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>

            {/* Component Help Text */}
            {component.required && !selectedValue && (
              <p className="text-xs text-red-600 dark:text-red-400 font-sourcesans">
                Please select an option for {component.title.toLowerCase()}
              </p>
            )}
            
            {/* Stock information for selected option */}
            {selectedValue && (
              (() => {
                const selectedOption = activeOptions.find(opt => opt.optionSlug === selectedValue)
                if (selectedOption?.stockQuantity && selectedOption.stockQuantity < 10 && selectedOption.stockQuantity > 0) {
                  return (
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-sourcesans">
                      Only {selectedOption.stockQuantity} left in stock
                    </p>
                  )
                }
                if (selectedOption?.stockQuantity === 0) {
                  return (
                    <p className="text-xs text-red-600 dark:text-red-400 font-sourcesans">
                      Currently out of stock
                    </p>
                  )
                }
                return null
              })()
            )}
          </div>
        )
      })}
    </div>
  )
}