// src/collections/PersonalizationOptions/components/PersonalizationPreview.tsx
'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useField } from '@payloadcms/ui'
import React from 'react'

export const PersonalizationPreview: React.FC = () => {
  const { value: personalizationType } = useField<string>({ path: 'personalizationType' })
  const { value: fieldType } = useField<string>({ path: 'fieldType' })
  const { value: label } = useField<string>({ path: 'label' })
  const { value: placeholder } = useField<string>({ path: 'placeholder' })
  const { value: options } = useField<any[]>({ path: 'options' })
  const { value: helpText } = useField<string>({ path: 'helpText' })
  const { value: required } = useField<boolean>({ path: 'required' })
  const { value: styleFields } = useField<any[]>({ path: 'styleFields' })

  // Ensure arrays are actually arrays
  const optionsArray = Array.isArray(options) ? options : []
  const styleFieldsArray = Array.isArray(styleFields) ? styleFields : []

  if (!label) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">
          Fill in the label field to see a preview of how this will look to customers.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-semibold text-gray-700">Customer View Preview:</h3>
      
      <div className="bg-white p-4 rounded border border-gray-200">
        {/* Simple Field Preview */}
        {personalizationType === 'simple' && (
          <div className="space-y-2">
            <Label>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            
            {fieldType === 'text' && (
              <Input
                type="text"
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                disabled
                className="max-w-md"
              />
            )}
            
            {fieldType === 'textarea' && (
              <Textarea
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                disabled
                className="max-w-md"
                rows={3}
              />
            )}
            
            {fieldType === 'select' && (
              <Select disabled>
                <SelectTrigger className="max-w-md">
                  <SelectValue placeholder={placeholder || 'Select an option'} />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(options) && options.map((opt, i) => (
                    <SelectItem key={i} value={opt?.value || `option-${i}`}>
                      {opt?.label || 'Option ' + (i + 1)}
                      {opt?.additionalPrice > 0 && ` [+${(opt.additionalPrice / 100).toFixed(2)}]`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {fieldType === 'date' && (
              <Input
                type="date"
                disabled
                className="max-w-md"
              />
            )}
            
            {fieldType === 'color' && (
              <Input
                type="color"
                disabled
                className="w-20"
              />
            )}
            
            {helpText && (
              <p className="text-sm text-gray-600">{helpText}</p>
            )}
          </div>
        )}

        {/* Style Field Preview */}
        {personalizationType === 'style' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              
              <Select disabled>
                <SelectTrigger className="max-w-md">
                  <SelectValue placeholder="Select a style" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(options) && options.map((opt, i) => (
                    <SelectItem key={i} value={opt?.value || `style-${i}`}>
                      {opt?.label || 'Style ' + (i + 1)}
                      {opt?.additionalPrice > 0 && ` [+${(opt.additionalPrice / 100).toFixed(2)}]`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {styleFieldsArray.length > 0 && (
              <div className="ml-4 pl-4 border-l-2 border-gray-300 space-y-3">
                <p className="text-xs text-gray-500">When a style is selected, these fields appear:</p>
                {styleFieldsArray.map((field, i) => (
                  <div key={i} className="space-y-1">
                    <Label className="text-sm">
                      {field?.fieldLabel || 'Field ' + (i + 1)}
                      {field?.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {field?.fieldType === 'text' && (
                      <Input
                        type="text"
                        placeholder={field?.placeholder || `Enter ${field?.fieldLabel?.toLowerCase() || 'value'}`}
                        disabled
                        className="max-w-sm text-sm"
                      />
                    )}
                    {field?.fieldType === 'date' && (
                      <Input
                        type="date"
                        disabled
                        className="max-w-sm text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {helpText && (
              <p className="text-sm text-gray-600">{helpText}</p>
            )}
          </div>
        )}

        {/* Conditional Field Preview */}
        {personalizationType === 'conditional' && (
          <div className="space-y-2">
            <div className="mb-2 p-2 bg-blue-50 rounded text-sm">
              <span className="font-medium">Conditional Field:</span> Only shows when parent condition is met
            </div>
            <Label>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            
            {fieldType === 'text' && (
              <Input
                type="text"
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                disabled
                className="max-w-md"
              />
            )}
            
            {fieldType === 'textarea' && (
              <Textarea
                placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                disabled
                className="max-w-md"
                rows={3}
              />
            )}
            
            {fieldType === 'date' && (
              <Input
                type="date"
                disabled
                className="max-w-md"
              />
            )}
            
            {helpText && (
              <p className="text-sm text-gray-600">{helpText}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Instructions component to help admins
export const PersonalizationInstructions: React.FC = () => {
  const { value: personalizationType } = useField<string>({ path: 'personalizationType' })

  const instructions = {
    simple: {
      title: 'Simple Field',
      description: 'A basic input field that customers fill out directly.',
      examples: [
        'Text input for names or messages',
        'Dropdown for selecting options with different prices',
        'Date picker for special dates',
      ],
      tips: [
        'Use clear, descriptive labels',
        'Add placeholder text to guide users',
        'Set character limits for text fields if needed',
      ],
    },
    style: {
      title: 'Style Selector',
      description: 'Let customers choose a style, then fill in details for that style.',
      examples: [
        'Name styles: "First Name Only", "First & Last Name", "Full Name with Title"',
        'Date formats: "MM/DD/YYYY", "Month Day, Year", "Day-Month-Year"',
      ],
      tips: [
        'Each style can have different fields',
        'Use this when the format changes based on selection',
        'Great for complex personalizations with multiple inputs',
      ],
    },
    conditional: {
      title: 'Conditional Field',
      description: 'Fields that only appear based on other selections.',
      examples: [
        'Show "Wedding Date" field only if "Add Date" is selected',
        'Show "Title" field only if "Include Title" is checked',
      ],
      tips: [
        'Reduces clutter by hiding irrelevant fields',
        'Parent field must be created first',
        'Use comma-separated values for multiple conditions',
      ],
    },
  }

  const info = instructions[personalizationType as keyof typeof instructions]

  if (!info) return null

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg space-y-3">
      <h4 className="font-semibold text-blue-900">{info.title}</h4>
      <p className="text-sm text-blue-800">{info.description}</p>
      
      <div>
        <p className="text-sm font-medium text-blue-900 mb-1">Examples:</p>
        <ul className="text-sm text-blue-700 space-y-1">
          {info.examples.map((example, i) => (
            <li key={i} className="flex items-start">
              <span className="mr-2">•</span>
              <span>{example}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <p className="text-sm font-medium text-blue-900 mb-1">Tips:</p>
        <ul className="text-sm text-blue-700 space-y-1">
          {info.tips.map((tip, i) => (
            <li key={i} className="flex items-start">
              <span className="mr-2">→</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}