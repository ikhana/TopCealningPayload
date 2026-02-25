"use client"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { PersonalizationOption } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { formatNumberToCurrency } from '@/utilities/formatNumberToCurrency'
import React, { useEffect, useMemo, useState } from 'react'

interface PersonalizationFormProps {
  options?: (number | PersonalizationOption | null)[] | null
  values: { optionId: string; value: any; subValues?: Record<string, any> }[]
  onChange: (optionId: string, value: any, subValues?: Record<string, any>) => void
  className?: string
}

export const PersonalizationForm: React.FC<PersonalizationFormProps> = ({
  options,
  values,
  onChange,
  className
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set())

  const personalizationOptions = useMemo(() => {
    if (!options) return []
    
    return options
      .filter((opt): opt is PersonalizationOption => {
        return opt !== null && typeof opt !== 'number' && 'id' in opt && opt.active !== false
      })
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
  }, [options])

  const groupedOptions = useMemo(() => {
    const rootOptions = personalizationOptions.filter(opt => !opt.parentOption)
    const conditionalOptions = personalizationOptions.filter(opt => opt.parentOption)
    
    return {
      root: rootOptions,
      conditional: conditionalOptions
    }
  }, [personalizationOptions])

  useEffect(() => {
    const newVisibleFields = new Set<string>()
    
    groupedOptions.root.forEach(opt => {
      newVisibleFields.add(String(opt.id))
    })
    
    groupedOptions.conditional.forEach(opt => {
      if (!opt.parentOption || !opt.parentValue) return
      
      const parentOptionId = typeof opt.parentOption === 'string' 
        ? opt.parentOption 
        : opt.parentOption.id
      
      const parentValue = getValue(String(parentOptionId))
      
      const acceptableValues = opt.parentValue.split(',').map(v => v.trim())
      
      if (acceptableValues.includes(parentValue)) {
        newVisibleFields.add(String(opt.id))
      }
    })
    setVisibleFields(newVisibleFields)
  }, [groupedOptions, values])

  const getValue = (optionId: string) => {
    const found = values.find(v => v.optionId === optionId)
    return found?.value || ''
  }

  const getSubValue = (optionId: string, fieldKey: string) => {
    const found = values.find(v => v.optionId === optionId)
    return found?.subValues?.[fieldKey] || ''
  }

  const validateField = (option: PersonalizationOption, value: string, fieldKey?: string) => {
    const errorKey = fieldKey ? `${option.id}-${fieldKey}` : String(option.id)
    const newErrors = { ...errors }
    let isValid = true

    if (fieldKey && option.styleFields) {
      const field = option.styleFields.find(f => f.fieldKey === fieldKey)
      if (field?.required && (!value || value.trim() === '')) {
        newErrors[errorKey] = `${field.fieldLabel} is required`
        isValid = false
      }
      if (field?.characterLimit && value.length > field.characterLimit) {
        newErrors[errorKey] = `Max ${field.characterLimit} chars`
        isValid = false
      }
    } else {
      if (option.required && (!value || value.trim() === '')) {
        newErrors[errorKey] = `${option.label} is required`
        isValid = false
      }

      if (option.characterLimit && value.length > option.characterLimit) {
        newErrors[errorKey] = `Max ${option.characterLimit} chars`
        isValid = false
      }

      if (option.validationRules?.pattern && value) {
        try {
          const regex = new RegExp(option.validationRules.pattern)
          if (!regex.test(value)) {
            newErrors[errorKey] = option.validationRules.patternMessage || 'Invalid format'
            isValid = false
          }
        } catch (e) {
          console.error('Invalid regex pattern:', option.validationRules.pattern)
        }
      }
    }

    if (isValid) {
      delete newErrors[errorKey]
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (option: PersonalizationOption, value: any, subValues?: Record<string, any>) => {
    const optionId = String(option.id)
    
    if (typeof value === 'string' && ['text', 'textarea'].includes(option.fieldType)) {
      validateField(option, value)
    }
    
    onChange(optionId, value, subValues)
  }

  const handleStyleFieldChange = (option: PersonalizationOption, fieldKey: string, value: string) => {
    const optionId = String(option.id)
    const currentValue = getValue(optionId)
    const currentSubValues = values.find(v => v.optionId === optionId)?.subValues || {}
    
    const newSubValues = {
      ...currentSubValues,
      [fieldKey]: value
    }
    
    validateField(option, value, fieldKey)
    onChange(optionId, currentValue, newSubValues)
  }

  const renderField = (option: PersonalizationOption) => {
    const optionId = String(option.id)
    
    if (!visibleFields.has(optionId)) {
      return null
    }

    if (option.personalizationType === 'style' && option.fieldType === 'select') {
      const value = getValue(optionId)
      
      return (
        <div key={option.id} className="space-y-3 p-4 bg-copper-bourbon/5 dark:bg-charcoal-gold/5 rounded-lg">
          <div className="space-y-2">
            <Label htmlFor={`personalization-${option.id}`} className="text-base font-bold text-deep-charcoal dark:text-antique-white">
              {option.label}
              {option.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(newValue) => handleChange(option, newValue)}
            >
              <SelectTrigger id={`personalization-${option.id}`} className="h-11 font-medium">
                <SelectValue placeholder={option.placeholder || 'Select a style'} />
              </SelectTrigger>
              <SelectContent>
                {option.options?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <span className="flex items-center justify-between w-full">
                      <span className="font-medium">{opt.label}</span>
                      {opt.additionalPrice && opt.additionalPrice > 0 && (
                        <span className="ml-2 text-copper-bourbon font-bold">
                          +{formatNumberToCurrency(opt.additionalPrice)}
                        </span>
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {value && option.styleFields && option.styleFields.length > 0 && (
            <div className="space-y-2 pl-3 border-l-4 border-copper-bourbon/30">
              {option.styleFields.map(field => {
                const fieldValue = getSubValue(optionId, field.fieldKey)
                const fieldError = errors[`${optionId}-${field.fieldKey}`]
                
                return (
                  <div key={field.fieldKey} className="space-y-1">
                    <Label htmlFor={`${optionId}-${field.fieldKey}`} className="text-sm font-semibold">
                      {field.fieldLabel}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    
                    {field.fieldType === 'text' && (
                      <>
                        <Input
                          id={`${optionId}-${field.fieldKey}`}
                          type="text"
                          value={fieldValue}
                          onChange={(e) => handleStyleFieldChange(option, field.fieldKey, e.target.value)}
                          placeholder={field.placeholder || undefined}
                          maxLength={field.characterLimit || undefined}
                          className={cn("h-10", fieldError && 'border-red-500')}
                        />
                        {field.characterLimit && (
                          <p className="text-xs text-muted-foreground">
                            {String(fieldValue).length}/{field.characterLimit}
                          </p>
                        )}
                      </>
                    )}
                    
                    {field.fieldType === 'date' && (
                      <Input
                        id={`${optionId}-${field.fieldKey}`}
                        type="date"
                        value={fieldValue}
                        onChange={(e) => handleStyleFieldChange(option, field.fieldKey, e.target.value)}
                        className={cn("h-10", fieldError && 'border-red-500')}
                      />
                    )}
                    
                    {fieldError && (
                      <p className="text-xs text-red-500">{fieldError}</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
          
          {option.helpText && (
            <p className="text-xs text-muted-foreground italic">{option.helpText}</p>
          )}
        </div>
      )
    }

    const value = getValue(optionId)
    const error = errors[optionId]
    const isConditional = option.personalizationType === 'conditional'

    switch (option.fieldType) {
      case 'select':
        return (
          <div key={option.id} className={cn(
            "space-y-2 p-4 rounded-lg",
            isConditional ? "bg-amber-50/50 dark:bg-amber-900/10 pl-6 border-l-4 border-amber-500/50" : "bg-copper-bourbon/5 dark:bg-charcoal-gold/5"
          )}>
            <Label htmlFor={`personalization-${option.id}`} className="text-base font-bold text-deep-charcoal dark:text-antique-white">
              {option.label}
              {option.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(newValue) => handleChange(option, newValue)}
            >
              <SelectTrigger id={`personalization-${option.id}`} className={cn("h-11 font-medium", error && 'border-red-500')}>
                <SelectValue placeholder={option.placeholder || 'Select an option'} />
              </SelectTrigger>
              <SelectContent>
                {option.options?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <span className="flex items-center justify-between w-full">
                      <span className="font-medium">{opt.label}</span>
                      {option.showPriceInLabel && opt.additionalPrice && opt.additionalPrice > 0 && (
                        <span className="ml-2 text-copper-bourbon font-bold">
                          +{formatNumberToCurrency(opt.additionalPrice)}
                        </span>
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {option.helpText && (
              <p className="text-xs text-muted-foreground italic">{option.helpText}</p>
            )}
          </div>
        )

      case 'text':
        return (
          <div key={option.id} className={cn(
            "space-y-2 p-4 rounded-lg",
            isConditional ? "bg-amber-50/50 dark:bg-amber-900/10 pl-6 border-l-4 border-amber-500/50" : "bg-copper-bourbon/5 dark:bg-charcoal-gold/5"
          )}>
            <Label htmlFor={`personalization-${option.id}`} className="text-base font-bold text-deep-charcoal dark:text-antique-white flex items-center justify-between">
              <span>
                {option.label}
                {option.required && <span className="text-red-500 ml-1">*</span>}
              </span>
              {option.additionalPrice && option.additionalPrice > 0 && (
                <span className="text-sm text-copper-bourbon font-bold">
                  +{formatNumberToCurrency(option.additionalPrice)}
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
              className={cn("h-11 font-medium", error && 'border-red-500')}
            />
            {(option.characterLimit || error || option.helpText) && (
              <div className="flex justify-between items-center">
                {option.characterLimit && (
                  <p className="text-xs text-muted-foreground">
                    {String(value).length}/{option.characterLimit}
                  </p>
                )}
                {option.helpText && !error && (
                  <p className="text-xs text-muted-foreground italic">{option.helpText}</p>
                )}
                {error && (
                  <p className="text-xs text-red-500">{error}</p>
                )}
              </div>
            )}
          </div>
        )

      case 'textarea':
        return (
          <div key={option.id} className={cn(
            "space-y-2 p-4 rounded-lg",
            isConditional ? "bg-amber-50/50 dark:bg-amber-900/10 pl-6 border-l-4 border-amber-500/50" : "bg-copper-bourbon/5 dark:bg-charcoal-gold/5"
          )}>
            <Label htmlFor={`personalization-${option.id}`} className="text-base font-bold text-deep-charcoal dark:text-antique-white flex items-center justify-between">
              <span>
                {option.label}
                {option.required && <span className="text-red-500 ml-1">*</span>}
              </span>
              {option.additionalPrice && option.additionalPrice > 0 && (
                <span className="text-sm text-copper-bourbon font-bold">
                  +{formatNumberToCurrency(option.additionalPrice)}
                </span>
              )}
            </Label>
            <Textarea
              id={`personalization-${option.id}`}
              value={value}
              onChange={(e) => handleChange(option, e.target.value)}
              placeholder={option.placeholder || undefined}
              maxLength={option.characterLimit || undefined}
              rows={2}
              className={cn("font-medium resize-none", error && 'border-red-500')}
            />
            {(option.characterLimit || error || option.helpText) && (
              <div className="flex justify-between items-center">
                {option.characterLimit && (
                  <p className="text-xs text-muted-foreground">
                    {String(value).length}/{option.characterLimit}
                  </p>
                )}
                {option.helpText && !error && (
                  <p className="text-xs text-muted-foreground italic">{option.helpText}</p>
                )}
                {error && (
                  <p className="text-xs text-red-500">{error}</p>
                )}
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  if (personalizationOptions.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-lg font-bold text-deep-charcoal dark:text-antique-white uppercase tracking-wider">
        Personalization
      </h3>
      {groupedOptions.root.map(option => renderField(option))}
      {groupedOptions.conditional.map(option => renderField(option))}
      
      {Object.keys(errors).length > 0 && (
        <div className="text-sm text-red-500 font-semibold p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          Please fix the errors above before adding to cart.
        </div>
      )}
    </div>
  )
}