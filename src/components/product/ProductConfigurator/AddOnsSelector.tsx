import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Addon } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { formatNumberToCurrency } from '@/utilities/formatNumberToCurrency'
import React from 'react'

interface AddOnsSelectorProps {
  availableAddOns?: (number | Addon | null)[] | null
  requiredAddOns?: (number | Addon | null)[] | null
  selectedAddOns: string[]
  onToggle: (addOnId: string, selected: boolean) => void
  className?: string
}

export const AddOnsSelector: React.FC<AddOnsSelectorProps> = ({
  availableAddOns,
  requiredAddOns,
  selectedAddOns,
  onToggle,
  className
}) => {
  // Get IDs of required add-ons
  const requiredIds = React.useMemo(() => {
    if (!requiredAddOns) return []
    
    return requiredAddOns
      .map(addon => {
        if (typeof addon === 'number' || !addon) return null
        return addon.id ? String(addon.id) : null
      })
      .filter((id): id is string => id !== null)
  }, [requiredAddOns])

  // Convert availableAddOns to proper Addon objects
  const addons = React.useMemo(() => {
    if (!availableAddOns) return []
    
    return availableAddOns
      .filter((addon): addon is Addon => {
        return addon !== null && typeof addon !== 'number' && 'id' in addon
      })
  }, [availableAddOns])

  // Group add-ons by category
  const groupedAddOns = addons.reduce((acc, addon) => {
    const category = addon.category || 'other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(addon)
    return acc
  }, {} as Record<string, Addon[]>)

  const categoryLabels: Record<string, string> = {
    handle: 'Handles',
    accessory: 'Accessories',
    component: 'Components',
    service: 'Services',
    other: 'Other Options'
  }

  if (addons.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No add-ons available for this product
      </p>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {Object.entries(groupedAddOns).map(([category, categoryAddOns]) => (
        <div key={category} className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {categoryLabels[category] || category}
          </h4>
          
          <div className="space-y-3">
            {categoryAddOns.map(addon => {
              const addonId = String(addon.id)
              const isRequired = requiredIds.includes(addonId)
              const isSelected = selectedAddOns.includes(addonId)
              const isOutOfStock = addon.stock === 0
              
              return (
                <div
                  key={addon.id}
                  className={cn(
                    'flex items-start space-x-3 p-4 rounded-lg border',
                    isSelected && 'bg-accent/5 border-accent',
                    isOutOfStock && 'opacity-60',
                    !isSelected && !isOutOfStock && 'hover:bg-muted/50'
                  )}
                >
                  <Checkbox
                    id={`addon-${addon.id}`}
                    checked={isSelected}
                    disabled={isRequired || isOutOfStock}
                    onCheckedChange={(checked) => {
                      if (!isRequired) {
                        onToggle(addonId, checked as boolean)
                      }
                    }}
                    className="mt-0.5"
                  />
                  
                  <div className="flex-1 space-y-1">
                    <Label
                      htmlFor={`addon-${addon.id}`}
                      className={cn(
                        'text-base font-medium cursor-pointer',
                        isOutOfStock && 'cursor-not-allowed'
                      )}
                    >
                      {addon.title}
                      {isRequired && (
                        <span className="ml-2 text-xs text-muted-foreground">(Required)</span>
                      )}
                      {isOutOfStock && (
                        <span className="ml-2 text-xs text-destructive">(Out of Stock)</span>
                      )}
                    </Label>
                    
                    {addon.description && (
                      <p className="text-sm text-muted-foreground">
                        {addon.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {addon.price && addon.price > 0 ? (
                          <>+ {formatNumberToCurrency(addon.price)}</>
                        ) : (
                          <span className="text-muted-foreground">Free</span>
                        )}
                      </span>
                      
                      {addon.specifications && addon.specifications.length > 0 && (
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          {addon.specifications.slice(0, 3).map((spec, index) => (
                            <span key={index}>
                              {spec.label}: {spec.value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}