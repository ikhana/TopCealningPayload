// src/search/fieldOverrides.ts
import { Field } from 'payload'

export const searchFields: Field[] = [
  {
    name: 'slug',
    type: 'text',
    index: true,
    admin: {
      readOnly: true,
    },
  },
  {
    name: 'meta',
    label: 'Meta',
    type: 'group',
    index: true,
    admin: {
      readOnly: true,
    },
    fields: [
      {
        type: 'text',
        name: 'title',
        label: 'Title',
      },
      {
        type: 'text',
        name: 'description',
        label: 'Description',
      },
      {
        name: 'image',
        label: 'Image',
        type: 'upload',
        relationTo: 'media',
      },
    ],
  },
  {
    label: 'Categories',
    name: 'categories',
    type: 'array',
    admin: {
      readOnly: true,
    },
    fields: [
      {
        name: 'relationTo',
        type: 'text',
      },
      {
        name: 'id',
        type: 'text',
      },
      {
        name: 'title',
        type: 'text',
      },
    ],
  },
  {
    name: 'hasAddOns',
    type: 'checkbox',
    index: true,
    admin: {
      readOnly: true,
      description: 'Whether this product has add-ons available',
    },
  },
  {
    name: 'addOnCategories',
    type: 'array',
    index: true,
    admin: {
      readOnly: true,
      description: 'Categories of add-ons available',
    },
    fields: [
      {
        name: 'category',
        type: 'text',
      },
    ],
  },
  {
    name: 'hasPersonalization',
    type: 'checkbox',
    index: true,
    admin: {
      readOnly: true,
      description: 'Whether this product has personalization options',
    },
  },
  {
    name: 'personalizationTypes',
    type: 'array',
    index: true,
    admin: {
      readOnly: true,
      description: 'Types of personalization available',
    },
    fields: [
      {
        name: 'type',
        type: 'text',
      },
      {
        name: 'label',
        type: 'text',
      },
    ],
  },
  {
    name: 'hasComponentCustomization',
    type: 'checkbox',
    index: true,
    admin: {
      readOnly: true,
      description: 'Whether this product has customizable components',
    },
  },
  {
    name: 'componentTypes',
    type: 'array',
    index: true,
    admin: {
      readOnly: true,
      description: 'Types of components that can be customized',
    },
    fields: [
      {
        name: 'type',
        type: 'text',
      },
      {
        name: 'count',
        type: 'number',
      },
    ],
  },
  {
    name: 'priceRange',
    type: 'group',
    index: true,
    admin: {
      readOnly: true,
      description: 'Price range including all possible configurations',
    },
    fields: [
      {
        name: 'min',
        type: 'number',
        admin: {
          description: 'Minimum possible price with base configuration',
        },
      },
      {
        name: 'max',
        type: 'number',
        admin: {
          description: 'Maximum possible price with all add-ons and options',
        },
      },
    ],
  },
  {
    name: 'searchTags',
    type: 'array',
    index: true,
    admin: {
      readOnly: true,
      description: 'Additional search tags for better discoverability',
    },
    fields: [
      {
        name: 'tag',
        type: 'text',
      },
    ],
  },
]

// Update the beforeSyncWithSearch hook to populate these new fields
export const enhancedBeforeSyncWithSearch = async ({ originalDoc, searchDoc, payload }) => {
  const {
    doc: { relationTo: collection },
  } = searchDoc

  const { 
    slug, 
    id, 
    categories, 
    title, 
    meta, 
    availableAddOns,
    personalizationOptions,
    enableComponentCustomization,
    componentConfig,
    price,
    enableVariants,
    variants
  } = originalDoc

  const modifiedDoc = {
    ...searchDoc,
    slug,
    meta: {
      ...meta,
      title: meta?.title || title,
      image: meta?.image?.id || meta?.image,
      description: meta?.description,
    },
    categories: [],
    hasAddOns: false,
    addOnCategories: [],
    hasPersonalization: false,
    personalizationTypes: [],
    hasComponentCustomization: enableComponentCustomization || false,
    componentTypes: [],
    priceRange: {
      min: price || 0,
      max: price || 0,
    },
    searchTags: [],
  }

  // Process categories
  if (categories && Array.isArray(categories) && categories.length > 0) {
    try {
      const mappedCategories = categories.map((category) => {
        const { id, title } = category

        return {
          relationTo: 'categories',
          id,
          title,
        }
      })

      modifiedDoc.categories = mappedCategories
    } catch (err) {
      console.error(
        `Failed. Category not found when syncing collection '${collection}' with id: '${id}' to search.`,
      )
    }
  }

  // Process add-ons
  if (availableAddOns && Array.isArray(availableAddOns) && availableAddOns.length > 0) {
    modifiedDoc.hasAddOns = true
    
    // Get unique add-on categories
    const addOnIds = availableAddOns.map(addon => 
      typeof addon === 'string' ? addon : addon.id
    ).filter(Boolean)
    
    if (addOnIds.length > 0) {
      try {
        const addOns = await payload.find({
          collection: 'addons',
          where: {
            id: {
              in: addOnIds,
            },
          },
          depth: 0,
        })
        
        const uniqueCategories = [...new Set(addOns.docs.map(a => a.category))]
        modifiedDoc.addOnCategories = uniqueCategories.map(cat => ({ category: cat }))
        
        // Add add-on titles as search tags
        modifiedDoc.searchTags.push(...addOns.docs.map(a => ({ tag: a.title })))
      } catch (err) {
        console.error('Error fetching add-ons for search sync:', err)
      }
    }
  }

  // Process personalization options
  if (personalizationOptions && Array.isArray(personalizationOptions) && personalizationOptions.length > 0) {
    modifiedDoc.hasPersonalization = true
    
    const personalizationIds = personalizationOptions.map(opt => 
      typeof opt === 'string' ? opt : opt.id
    ).filter(Boolean)
    
    if (personalizationIds.length > 0) {
      try {
        const personalizations = await payload.find({
          collection: 'personalization-options',
          where: {
            id: {
              in: personalizationIds,
            },
          },
          depth: 0,
        })
        
        modifiedDoc.personalizationTypes = personalizations.docs.map(p => ({
          type: p.fieldType,
          label: p.label,
        }))
        
        // Add personalization labels as search tags
        modifiedDoc.searchTags.push(...personalizations.docs.map(p => ({ tag: p.label })))
      } catch (err) {
        console.error('Error fetching personalization options for search sync:', err)
      }
    }
  }

  // Process component customization
  if (enableComponentCustomization && componentConfig?.components?.length > 0) {
    const componentIds = componentConfig.components.map(comp => 
      typeof comp === 'string' ? comp : comp.id
    ).filter(Boolean)
    
    if (componentIds.length > 0) {
      try {
        const components = await payload.find({
          collection: 'product-components',
          where: {
            id: {
              in: componentIds,
            },
          },
          depth: 0,
        })
        
        // Count components by type
        const typeCount = components.docs.reduce((acc, comp) => {
          acc[comp.componentType] = (acc[comp.componentType] || 0) + 1
          return acc
        }, {})
        
        modifiedDoc.componentTypes = Object.entries(typeCount).map(([type, count]) => ({
          type,
          count,
        }))
        
        // Add component titles as search tags
        modifiedDoc.searchTags.push(...components.docs.map(c => ({ tag: c.title })))
      } catch (err) {
        console.error('Error fetching components for search sync:', err)
      }
    }
  }

  // Calculate price range
  if (enableVariants && variants?.length > 0) {
    // For variant products, get min/max from variants
    const prices = variants.map(v => v.price).filter(p => p > 0)
    if (prices.length > 0) {
      modifiedDoc.priceRange.min = Math.min(...prices)
      modifiedDoc.priceRange.max = Math.max(...prices)
    }
  } else if (price) {
    // For simple products, calculate potential max with add-ons
    modifiedDoc.priceRange.min = price
    modifiedDoc.priceRange.max = price
    
    // Add potential add-on prices to max
    if (modifiedDoc.hasAddOns && availableAddOns?.length > 0) {
      try {
        const addOnIds = availableAddOns.map(addon => 
          typeof addon === 'string' ? addon : addon.id
        ).filter(Boolean)
        
        const addOns = await payload.find({
          collection: 'addons',
          where: {
            id: {
              in: addOnIds,
            },
          },
          depth: 0,
        })
        
        const totalAddOnPrice = addOns.docs.reduce((sum, addon) => sum + (addon.price || 0), 0)
        modifiedDoc.priceRange.max += totalAddOnPrice
      } catch (err) {
        console.error('Error calculating price range with add-ons:', err)
      }
    }
    
    // Add potential personalization prices to max
    if (modifiedDoc.hasPersonalization && personalizationOptions?.length > 0) {
      try {
        const personalizationIds = personalizationOptions.map(opt => 
          typeof opt === 'string' ? opt : opt.id
        ).filter(Boolean)
        
        const personalizations = await payload.find({
          collection: 'personalization-options',
          where: {
            id: {
              in: personalizationIds,
            },
          },
          depth: 0,
        })
        
        const totalPersonalizationPrice = personalizations.docs.reduce((sum, pers) => 
          sum + (pers.additionalPrice || 0), 0
        )
        modifiedDoc.priceRange.max += totalPersonalizationPrice
      } catch (err) {
        console.error('Error calculating price range with personalization:', err)
      }
    }
  }

  // Remove duplicate search tags
  modifiedDoc.searchTags = Array.from(
    new Set(modifiedDoc.searchTags.map(t => t.tag))
  ).map(tag => ({ tag }))

  return modifiedDoc
}