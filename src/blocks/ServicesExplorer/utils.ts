// src/blocks/ServicesExplorer/utils.ts
import type { ServicesExplorerBlock } from '@/payload-types'

type TestService = ServicesExplorerBlock['tests'][0]

const CALENDAR_BASE_URL = 'https://link.brandbloom.org/widget/booking/UJqUlxKgZKXkSQIQyHD1'

export const buildCalendarUrl = (test: TestService): string => {
  const url = new URL(CALENDAR_BASE_URL)
  
  if (test.title) {
    url.searchParams.set('single_line_29eq', test.title)
  }
  
  return url.toString()
}

export const generateTestId = (index: number): string => {
  return `NBL_${String(index + 1).padStart(3, '0')}`
}

export const processTestsWithIds = (tests: TestService[]): TestService[] => {
  return tests.map((test, index) => ({
    ...test,
    testId: test.testId || generateTestId(index)
  }))
}

export const getCategoryDisplayName = (category: string): string => {
  if (!category) return 'Unknown Category'
  
  return category
    .trim()
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export const filterTestsByCategory = (tests: TestService[], category: string): TestService[] => {
  if (category === 'All Services' || category === 'all') {
    return tests
  }
  return tests.filter(test => test.category === category)
}

export const searchTests = (tests: TestService[], query: string): TestService[] => {
  if (!query.trim()) return tests
  
  const searchTerm = query.toLowerCase()
  return tests.filter(test => {
    const title = test.title || ''
    const description = test.description || ''
    const category = test.category || ''
    
    return (
      title.toLowerCase().includes(searchTerm) ||
      description.toLowerCase().includes(searchTerm) ||
      category.toLowerCase().includes(searchTerm) ||
      test.features?.some(feature => 
        feature.text && feature.text.toLowerCase().includes(searchTerm)
      )
    )
  })
}

export const sortTests = (tests: TestService[], sortBy: string): TestService[] => {
  const sorted = [...tests]
  
  switch (sortBy) {
    case 'featured':
      return sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        const aTitle = a.title || ''
        const bTitle = b.title || ''
        return aTitle.localeCompare(bTitle)
      })
    case 'alpha':
      return sorted.sort((a, b) => {
        const aTitle = a.title || ''
        const bTitle = b.title || ''
        return aTitle.localeCompare(bTitle)
      })
    case 'category':
      return sorted.sort((a, b) => {
        const aCategory = a.category || ''
        const bCategory = b.category || ''
        const categoryCompare = aCategory.localeCompare(bCategory)
        if (categoryCompare !== 0) return categoryCompare
        
        const aTitle = a.title || ''
        const bTitle = b.title || ''
        return aTitle.localeCompare(bTitle)
      })
    default:
      return sorted
  }
}