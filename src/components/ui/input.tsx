import * as React from 'react'

import { cn } from '@/utilities/cn'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles
        'flex h-10 w-full min-w-0 rounded-md bg-transparent px-3 py-2 text-base transition-[border-color,box-shadow] outline-none',
        // Border - THIN (0.5px equivalent)
        'border border-input/40',
        // Placeholder
        'placeholder:text-muted-foreground',
        // Focus state - SUBTLE
        'focus:border-primary/60 focus:ring-1 focus:ring-primary/20',
        // Selection
        'selection:bg-primary selection:text-primary-foreground',
        // File input
        'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
        // Disabled state
        'disabled:cursor-not-allowed disabled:opacity-50',
        // Invalid state
        'aria-invalid:border-destructive aria-invalid:focus:ring-destructive/20',
        // Responsive text size
        'md:text-sm',
        className,
      )}
      {...props}
    />
  )
}

export { Input }