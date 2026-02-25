import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { PersonalizationOption } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { formatNumberToCurrency } from '@/utilities/formatNumberToCurrency'
import React, { useCallback, useMemo, useState } from 'react'

interface PersonalizationSelectorProps {
  options?: (number | PersonalizationOption | null)[] | null
  values: { optionId: string; value: any }[]
  onChange: (optionId: string, value: any) => void
  className?: string
}

export const PersonalizationSelector: React.FC<PersonalizationSelectorProps> = ({
  options,
  values,
  onChange,
  className
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedValues, setSelectedValues] = useState<Record<string, any>>({})

  const { rootOptions, childOptionsMap, allOptions } = useMemo(() => {
    if (!options) return { rootOptions: [], childOptionsMap: {}, allOptions: [] }
    
    const validOptions = options
      .filter((opt): opt is PersonalizationOption => {
        return opt !== null && typeof opt !== 'number' && 'id' in opt && opt.active !== false
      })
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    
    const roots = validOptions.filter(opt => !opt.parentOption)
    const childMap: Record<string, PersonalizationOption[]> = {}
    
    validOptions.forEach(opt => {
      if (opt.parentOption) {
        const parentId = typeof opt.parentOption === 'string' 
          ? opt.parentOption 
          : opt.parentOption.id
        
        if (!childMap[parentId]) {
          childMap[parentId] = []
        }
        childMap[parentId].push(opt)
      }
    })
    
    return {
      rootOptions: roots,
      childOptionsMap: childMap,
      allOptions: validOptions
    }
  }, [options])

  const getValue = useCallback((optionId: string) => {
    const found = values.find(v => v.optionId === optionId)
    return found?.value !== undefined ? found.value : (selectedValues[optionId] || '')
  }, [values, selectedValues])

  const shouldShowField = useCallback((option: PersonalizationOption) => {
    if (!option.parentOption) return true
    
    const parentId = typeof option.parentOption === 'string' 
      ? option.parentOption 
      : option.parentOption.id
    
    const parentValue = getValue(parentId)
    
    if (!parentValue || !option.showWhenParentValue) return false
    
    const acceptableValues = option.showWhenParentValue.split(',').map(v => v.trim())
    return acceptableValues.includes(parentValue)
  }, [getValue])

  const validateField = useCallback((option: PersonalizationOption, value: string) => {
    const newErrors = { ...errors }
    const optionId = String(option.id)
    let isValid = true

    if (option.required && (!value || value.trim() === '')) {
      newErrors[optionId] = `${option.label} is required`
      isValid = false
    } else if (option.characterLimit && value.length > option.characterLimit) {
      newErrors[optionId] = `Maximum ${option.characterLimit} characters allowed`
      isValid = false
    } else if (option.validationPattern && value) {
      try {
        const regex = new RegExp(option.validationPattern)
        if (!regex.test(value)) {
          newErrors[optionId] = option.validationMessage || 'Invalid format'
          isValid = false
        }
      } catch (e) {
        console.error('Invalid regex pattern:', option.validationPattern)
      }
    }

    if (isValid) {
      delete newErrors[optionId]
    }

    setErrors(newErrors)
    return isValid
  }, [errors])

  const handleChange = useCallback((option: PersonalizationOption, value: any) => {
    const optionId = String(option.id)
    
    setSelectedValues(prev => ({ ...prev, [optionId]: value }))
    
    if (typeof value === 'string' && ['text', 'textarea'].includes(option.fieldType)) {
      validateField(option, value)
    }
    
    onChange(optionId, value)
    
    if (option.fieldType === 'select' && childOptionsMap[optionId]) {
      childOptionsMap[optionId].forEach(childOption => {
        if (!shouldShowField(childOption)) {
          onChange(String(childOption.id), '')
          setSelectedValues(prev => ({ ...prev, [String(childOption.id)]: '' }))
        }
      })
    }
  }, [onChange, childOptionsMap, shouldShowField, validateField])

  const calculateOptionPrice = useCallback((option: PersonalizationOption, value: any) => {
    if (!value) return 0
    
    if (option.fieldType === 'select' && option.options) {
      const selected = option.options.find(opt => opt.value === value)
      return selected?.additionalPrice || 0
    }
    
    if (option.pricingType === 'flat') {
      return option.additionalPrice || 0
    }
    
    return 0
  }, [])

  const renderField = useCallback((option: PersonalizationOption, depth: number = 0) => {
    if (!shouldShowField(option)) return null
    
    const optionId = String(option.id)
    const value = getValue(optionId)
    const error = errors[optionId]
    const price = calculateOptionPrice(option, value)
    
    const fieldContent = () => {
      switch (option.fieldType) {
        case 'select':
          const showPriceInDropdown = option.personalizationType === 'simple'
          
          return (
            <div key={option.id} className="space-y-2">
              <Label htmlFor={`personalization-${option.id}`}>
                {option.label}
                {option.required && <span className="text-destructive ml-1">*</span>}
                {!showPriceInDropdown && price > 0 && (
                  <span className="text-sm text-muted-foreground ml-2">
                    (+{formatNumberToCurrency(price)})
                  </span>
                )}
              </Label>
              <Select
                value={value || undefined}
                onValueChange={(newValue) => handleChange(option, newValue)}
              >
                <SelectTrigger 
                  id={`personalization-${option.id}`}
                  className={cn(error && 'border-destructive')}
                >
                  <SelectValue placeholder={option.placeholder || 'Select an option'} />
                </SelectTrigger>
                <SelectContent>
                  {!option.required && (
                    <SelectItem value="__none__">
                      <span className="text-muted-foreground">None</span>
                    </SelectItem>
                  )}
                  {option.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className="flex items-center justify-between w-full">
                        <span>{opt.label}</span>
                        {showPriceInDropdown && opt.additionalPrice && opt.additionalPrice > 0 && (
                          <span className="ml-2 text-muted-foreground text-xs">
                            {opt.additionalPrice > 0 ? `[+${formatNumberToCurrency(opt.additionalPrice)}]` : ''}
                          </span>
                        )}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {option.helpText && !error && (
                <p className="text-sm text-muted-foreground">{option.helpText}</p>
              )}
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          )

        case 'text':
          return (
            <div key={option.id} className="space-y-2">
              <Label htmlFor={`personalization-${option.id}`}>
                {option.label}
                {option.required && <span className="text-destructive ml-1">*</span>}
                {price > 0 && (
                  <span className="text-sm text-muted-foreground ml-2">
                    (+{formatNumberToCurrency(price)})
                  </span>
                )}
              </Label>
              <Input
                id={`personalization-${option.id}`}
                type="text"
                value={value}
                onChange={(e) => handleChange(option, e.target.value)}
                placeholder={option.placeholder || undefined}
                maxLength={option.characterLimit || undefined}
                className={cn(error && 'border-destructive')}
              />
              {option.characterLimit && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{String(value).length} / {option.characterLimit} characters</span>
                </div>
              )}
              {option.helpText && !error && (
                <p className="text-sm text-muted-foreground">{option.helpText}</p>
              )}
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          )

        case 'textarea':
          return (
            <div key={option.id} className="space-y-2">
              <Label htmlFor={`personalization-${option.id}`}>
                {option.label}
                {option.required && <span className="text-destructive ml-1">*</span>}
                {price > 0 && (
                  <span className="text-sm text-muted-foreground ml-2">
                    (+{formatNumberToCurrency(price)})
                  </span>
                )}
              </Label>
              <Textarea
                id={`personalization-${option.id}`}
                value={value}
                onChange={(e) => handleChange(option, e.target.value)}
                placeholder={option.placeholder || undefined}
                maxLength={option.characterLimit || undefined}
                rows={3}
                className={cn(error && 'border-destructive')}
              />
              {option.characterLimit && (
                <p className="text-xs text-muted-foreground text-right">
                  {String(value).length} / {option.characterLimit} characters
                </p>
              )}
              {option.helpText && !error && (
                <p className="text-sm text-muted-foreground">{option.helpText}</p>
              )}
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          )

        case 'date':
          return (
            <div key={option.id} className="space-y-2">
              <Label htmlFor={`personalization-${option.id}`}>
                {option.label}
                {option.required && <span className="text-destructive ml-1">*</span>}
                {price > 0 && (
                  <span className="text-sm text-muted-foreground ml-2">
                    (+{formatNumberToCurrency(price)})
                  </span>
                )}
              </Label>
              <Input
                id={`personalization-${option.id}`}
                type="date"
                value={value}
                onChange={(e) => handleChange(option, e.target.value)}
                className={cn(error && 'border-destructive')}
              />
              {option.helpText && (
                <p className="text-sm text-muted-foreground">{option.helpText}</p>
              )}
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          )

        case 'color':
          return (
            <div key={option.id} className="space-y-2">
              <Label htmlFor={`personalization-${option.id}`}>
                {option.label}
                {option.required && <span className="text-destructive ml-1">*</span>}
                {price > 0 && (
                  <span className="text-sm text-muted-foreground ml-2">
                    (+{formatNumberToCurrency(price)})
                  </span>
                )}
              </Label>
              <div className="flex gap-2">
                <Input
                  id={`personalization-${option.id}`}
                  type="color"
                  value={value || '#000000'}
                  onChange={(e) => handleChange(option, e.target.value)}
                  className="w-20 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(option, e.target.value)}
                  placeholder="#000000"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  className={cn("flex-1", error && 'border-destructive')}
                />
              </div>
              {option.helpText && (
                <p className="text-sm text-muted-foreground">{option.helpText}</p>
              )}
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          )

        default:
          return null
      }
    }
    
    return (
      <div key={option.id} className={cn(depth > 0 && "ml-4 pl-4 border-l-2 border-muted")}>
        {fieldContent()}
        
        {childOptionsMap[optionId] && (
          <div className="mt-4 space-y-4">
            {childOptionsMap[optionId].map(childOption => 
              renderField(childOption, depth + 1)
            )}
          </div>
        )}
      </div>
    )
  }, [shouldShowField, getValue, errors, calculateOptionPrice, handleChange, childOptionsMap])

  const { simpleOptions, complexOptions, standaloneOptions } = useMemo(() => {
    return rootOptions.reduce((acc, opt) => {
      if (opt.personalizationType === 'simple') {
        acc.simpleOptions.push(opt)
      } else if (opt.personalizationType === 'complex') {
        acc.complexOptions.push(opt)
      } else {
        acc.standaloneOptions.push(opt)
      }
      return acc
    }, { simpleOptions: [] as PersonalizationOption[], complexOptions: [] as PersonalizationOption[], standaloneOptions: [] as PersonalizationOption[] })
  }, [rootOptions])

  if (rootOptions.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-6', className)}>
      {simpleOptions.length > 0 && (
        <div className="space-y-4">
          {simpleOptions.map(option => renderField(option))}
        </div>
      )}

      {complexOptions.length > 0 && (
        <div className="space-y-4">
          {complexOptions.map(option => renderField(option))}
        </div>
      )}

      {standaloneOptions.length > 0 && (
        <div className="space-y-4">
          {standaloneOptions.map(option => renderField(option))}
        </div>
      )}

      {Object.keys(errors).length > 0 && (
        <div className="text-sm text-destructive mt-4 p-3 bg-destructive/10 rounded-lg">
          Please fix the errors above before adding to cart.
        </div>
      )}
    </div>
  )
}