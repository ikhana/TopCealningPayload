// src/collections/Products/hooks/validateComponents.ts
import type { Product } from '@/payload-types'
import type { CollectionBeforeChangeHook } from 'payload'

interface SelectedComponentOption {
  componentId: string
  componentSlug: string
  optionSlug: string
  optionTitle: string
}

export const validateComponentConfiguration: CollectionBeforeChangeHook<Product> = async ({ 
  data, 
  req,
  operation 
}) => {
  // Only validate on create or update
  if (operation !== 'create' && operation !== 'update') {
    return data
  }

  // Only validate if component customization is enabled
  if (!data?.enableComponentCustomization) {
    return data
  }

  const { payload } = req

  // Get all validation rules
  const validationRules = data?.componentRules || []

  // Get selected components configuration
  const componentConfig = data?.componentConfig
  const selectedComponentIds = componentConfig?.components || []

  // If no components selected and we have rules, check if any are required
  if (selectedComponentIds.length === 0) {
    const hasRequiredRules = validationRules.some(rule => 
      rule.ruleType === 'require_all' || rule.ruleType === 'require_one'
    )
    
    if (hasRequiredRules) {
      throw new Error('Please select required components for this product')
    }
    
    return data
  }

  // Load all selected components with their details
  const selectedComponents = await payload.find({
    collection: 'product-components',
    where: {
      id: {
        in: selectedComponentIds,
      },
    },
    depth: 0,
  })

  // Build a map of selected options from the product data
  // This would come from the frontend when a user selects specific options
  const selectedOptions: SelectedComponentOption[] = []
  
  // In production, this would be populated from form data
  // For example: data.selectedComponentOptions would contain:
  // [{ componentId: 'abc', optionSlug: 'leather-handle' }, ...]
  
  // Check if all required components have selections
  for (const component of selectedComponents.docs) {
    if (component.required) {
      const hasSelection = selectedOptions.some(
        opt => opt.componentId === component.id
      )
      
      if (!hasSelection) {
        throw new Error(`Please select an option for ${component.title}`)
      }
    }
  }

  // Validate each rule
  for (const rule of validationRules) {
    const ruleComponentIds = rule.components || []
    
    switch (rule.ruleType) {
      case 'require_all': {
        // Check if all required components are selected
        const missingComponents = ruleComponentIds.filter(
          requiredId => !selectedComponentIds.includes(requiredId)
        )
        
        if (missingComponents.length > 0) {
          // Get component names for better error message
          const missingComponentDocs = await payload.find({
            collection: 'product-components',
            where: {
              id: {
                in: missingComponents,
              },
            },
            depth: 0,
          })
          
          const componentNames = missingComponentDocs.docs.map(doc => doc.title).join(', ')
          
          throw new Error(
            rule.errorMessage || `Missing required components: ${componentNames}`
          )
        }
        break
      }

      case 'require_one': {
        // Check if at least one of the components is selected
        const hasOne = ruleComponentIds.some(
          componentId => selectedComponentIds.includes(componentId)
        )
        
        if (!hasOne) {
          const componentDocs = await payload.find({
            collection: 'product-components',
            where: {
              id: {
                in: ruleComponentIds,
              },
            },
            depth: 0,
          })
          
          const componentNames = componentDocs.docs.map(doc => doc.title).join(', ')
          
          throw new Error(
            rule.errorMessage || `Please select at least one of: ${componentNames}`
          )
        }
        break
      }

      case 'exclusive': {
        // Check if multiple exclusive components are selected
        const selectedExclusive = ruleComponentIds.filter(
          componentId => selectedComponentIds.includes(componentId)
        )
        
        if (selectedExclusive.length > 1) {
          const componentDocs = await payload.find({
            collection: 'product-components',
            where: {
              id: {
                in: selectedExclusive,
              },
            },
            depth: 0,
          })
          
          const componentNames = componentDocs.docs.map(doc => doc.title).join(', ')
          
          throw new Error(
            rule.errorMessage || `Cannot select multiple from: ${componentNames}`
          )
        }
        break
      }

      case 'conditional': {
        // Parse condition (format: component-slug:option-slug)
        if (rule.condition) {
          const [componentSlug, optionSlug] = rule.condition.split(':')
          
          // Check if the condition is met
          const conditionMet = selectedOptions.some(
            opt => opt.componentSlug === componentSlug && opt.optionSlug === optionSlug
          )
          
          if (conditionMet) {
            // If condition is met, check if required components are selected
            const hasRequiredComponents = ruleComponentIds.every(
              componentId => selectedComponentIds.includes(componentId)
            )
            
            if (!hasRequiredComponents) {
              const componentDocs = await payload.find({
                collection: 'product-components',
                where: {
                  id: {
                    in: ruleComponentIds,
                  },
                },
                depth: 0,
              })
              
              const componentNames = componentDocs.docs.map(doc => doc.title).join(', ')
              
              throw new Error(
                rule.errorMessage || 
                `When ${componentSlug} is ${optionSlug}, you must select: ${componentNames}`
              )
            }
          }
        }
        break
      }
    }
  }

  // Validate component option compatibility
  for (const component of selectedComponents.docs) {
    const selectedOption = selectedOptions.find(opt => opt.componentId === component.id)
    
    if (selectedOption && component.componentOptions) {
      const optionConfig = component.componentOptions.find(
        opt => opt.optionSlug === selectedOption.optionSlug
      )
      
      if (optionConfig) {
        // Check incompatible options
        if (optionConfig.incompatibleWith) {
          const incompatibleSlugs = optionConfig.incompatibleWith.split(',').map(s => s.trim())
          
          for (const incompatibleSlug of incompatibleSlugs) {
            const hasIncompatible = selectedOptions.some(
              opt => opt.optionSlug === incompatibleSlug
            )
            
            if (hasIncompatible) {
              throw new Error(
                `${optionConfig.optionTitle} is not compatible with selected options`
              )
            }
          }
        }
        
        // Check required options
        if (optionConfig.requiredWith) {
          const requiredSlugs = optionConfig.requiredWith.split(',').map(s => s.trim())
          
          for (const requiredSlug of requiredSlugs) {
            const hasRequired = selectedOptions.some(
              opt => opt.optionSlug === requiredSlug
            )
            
            if (!hasRequired) {
              throw new Error(
                `${optionConfig.optionTitle} requires additional options to be selected`
              )
            }
          }
        }
      }
    }
  }

  return data
}