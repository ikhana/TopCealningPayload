import * as React from 'react'

import { cn } from '@/utilities/cn'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base styles
        'flex min-h-20 w-full rounded-md bg-transparent px-3 py-2 text-base transition-[border-color,box-shadow] outline-none',
        // Border - THIN (0.5px equivalent)
        'border border-input/40',
        // Placeholder
        'placeholder:text-muted-foreground',
        // Focus state - SUBTLE
        'focus:border-primary/60 focus:ring-1 focus:ring-primary/20',
        // Disabled state
        'disabled:cursor-not-allowed disabled:opacity-50',
        // Invalid state
        'aria-invalid:border-destructive aria-invalid:focus:ring-destructive/20',
        // Responsive text size
        'md:text-sm',
        // Auto-sizing
        'field-sizing-content',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }