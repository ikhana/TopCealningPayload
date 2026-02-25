// blocks/TestimonialsCarousel/Component.tsx

import type { TestimonialsCarouselBlock as TestimonialsCarouselBlockType } from '@/payload-types'
import React from 'react'
import { TestimonialsCarouselClient } from './Component.client'

export const TestimonialsCarouselBlock: React.FC<TestimonialsCarouselBlockType> = (props) => {
  return <TestimonialsCarouselClient {...props} />
}