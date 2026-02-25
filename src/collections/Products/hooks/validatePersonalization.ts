// src/collections/Products/hooks/validatePersonalization.ts
import type { Product } from '@/payload-types'
import type { CollectionBeforeChangeHook } from 'payload'

interface PersonalizationValue {
  fieldKey: string
  value: string | any
}

export const validatePersonalization: CollectionBeforeChangeHook<Product> = async ({ 
  data, 
  req,
  operation,
  context 
}) => {
  // Skip validation in certain contexts
  if (context?.skipValidation || req.context?.skipValidation) {
    return data
  }

  // Only validate on create or update when personalization is present
  if (operation !== 'create' && operation !== 'update') {
    return data
  }

  // IMPORTANT: Only validate if personalization data is being submitted
  // This prevents validation when editing other fields in the admin
  const hasPersonalizationData = data?.personalizationValues || data?.selectedPersonalizations

  // Check if product has personalization options
  if (!data?.personalizationOptions || data.personalizationOptions.length === 0) {
    return data
  }

  // If no personalization data is submitted, don't validate
  // This allows saving products in admin without personalization
  if (!hasPersonalizationData) {
    return data
  }

  const { payload } = req

  // Get personalization values from data (would come from frontend)
  const personalizationValues = data.personalizationValues as PersonalizationValue[] || []

  // Load all personalization options for this product
  const personalizationIds = data.personalizationOptions
    .filter(id => id !== null && id !== undefined)
    .map(opt => typeof opt === 'string' || typeof opt === 'number' ? opt : opt.id)
    .filter(Boolean)

  if (personalizationIds.length === 0) {
    return data
  }

  const personalizations = await payload.find({
    collection: 'personalization-options',
    where: {
      id: {
        in: personalizationIds,
      },
    },
    depth: 0,
  })

  // Only validate if we're in a frontend context (has personalization data)
  if (personalizationValues.length > 0) {
    // Validate each personalization option
    for (const personalization of personalizations.docs) {
      const submittedValue = personalizationValues.find(
        pv => pv.fieldKey === personalization.fieldKey
      )

      // Check if required field is missing
      if (personalization.required && !submittedValue?.value) {
        throw new Error(`${personalization.label} is required`)
      }

      if (submittedValue?.value) {
        const value = submittedValue.value

        // Validate based on field type
        switch (personalization.fieldType) {
          case 'text':
          case 'textarea': {
            if (typeof value !== 'string') {
              throw new Error(`${personalization.label} must be text`)
            }

            // Check character limit
            if (personalization.characterLimit && value.length > personalization.characterLimit) {
              throw new Error(
                `${personalization.label} must be ${personalization.characterLimit} characters or less`
              )
            }

            // Check min/max length from validation rules
            if (personalization.validationRules) {
              const minLength = personalization.validationRules.minLength
              const maxLength = personalization.validationRules.maxLength

              if (minLength && value.length < minLength) {
                throw new Error(
                  `${personalization.label} must be at least ${minLength} characters`
                )
              }

              if (maxLength && value.length > maxLength) {
                throw new Error(
                  `${personalization.label} must be ${maxLength} characters or less`
                )
              }

              // Check regex pattern
              if (personalization.validationRules.pattern) {
                try {
                  const regex = new RegExp(personalization.validationRules.pattern)
                  if (!regex.test(value)) {
                    throw new Error(
                      personalization.validationRules.patternMessage || 
                      `${personalization.label} format is invalid`
                    )
                  }
                } catch (e) {
                  // Invalid regex pattern - log error but don't fail
                  console.error('Invalid regex pattern:', personalization.validationRules.pattern)
                }
              }
            }
            break
          }

          case 'select': {
            // Validate that selected value is one of the options
            if (!personalization.options) {
              break
            }

            const validOption = personalization.options.find(
              opt => opt.value === value
            )

            if (!validOption) {
              throw new Error(`Invalid option selected for ${personalization.label}`)
            }
            break
          }

          case 'date': {
            // Validate date format
            if (!(value instanceof Date) && !Date.parse(value)) {
              throw new Error(`${personalization.label} must be a valid date`)
            }
            break
          }

          case 'color': {
            // Validate color format (hex)
            const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
            if (!hexColorRegex.test(value)) {
              throw new Error(`${personalization.label} must be a valid color`)
            }
            break
          }
        }
      }
    }
  }

  // Check if custom personalization is allowed and validate
  if (data.allowCustomPersonalization && personalizationValues.length > 0) {
    const customFields = personalizationValues.filter(
      pv => !personalizations.docs.find(p => p.fieldKey === pv.fieldKey)
    )

    if (customFields.length > (data.maxPersonalizationFields || 5)) {
      throw new Error(
        `Maximum ${data.maxPersonalizationFields || 5} custom personalization fields allowed`
      )
    }
  }

  return data
}