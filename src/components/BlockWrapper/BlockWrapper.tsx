import React from 'react'
import { cn } from '@/utilities/cn'

type BlockWrapperProps = {
  sectionId?: string | null
  children: React.ReactNode
  className?: string
}

export function BlockWrapper({ sectionId, children, className }: BlockWrapperProps) {
  return (
    <section
      id={sectionId || undefined}
      className={cn('relative', className)}
      data-block-section={sectionId || undefined}
    >
      {children}
    </section>
  )
}