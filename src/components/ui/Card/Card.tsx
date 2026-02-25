// components/ui/Card/Card.tsx - FIXED

import React from 'react'
import { cn } from '@/utilities/cn'

type CardProps = {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'gradient'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ 
  children, 
  className, 
  variant = 'gradient',
  padding = 'md' 
}: CardProps) {
  
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4 sm:p-6',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-10',
  }

  if (variant === 'gradient') {
    return (
      <div className={cn('relative w-full', className)}>
        {/* HairlineChrome borders - exact match to original */}
        <div className="absolute left-0 -top-[1px] h-px w-full bg-gradient-to-l from-zinc-200 via-zinc-400 to-zinc-600 dark:from-zinc-900 dark:via-zinc-700 dark:to-zinc-500" />
        <div className="absolute -bottom-[1px] left-0 h-px w-full bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-600 dark:from-zinc-900 dark:via-zinc-700 dark:to-zinc-500" />
        <div className="absolute inset-y-0 -top-[5px] -bottom-[5px] -left-[1px] w-px bg-gradient-to-t from-zinc-200 via-zinc-400 to-zinc-600 dark:from-zinc-900 dark:via-zinc-700 dark:to-zinc-500" />
        <div className="absolute inset-y-0 -top-[5px] -bottom-[5px] -right-[1px] w-px bg-gradient-to-t from-zinc-200 via-zinc-400 to-zinc-600 dark:from-zinc-900 dark:via-zinc-700 dark:to-zinc-500" />
        
        <div className={cn('relative z-10', paddingClasses[padding])}>
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      'relative w-full border border-border bg-card',
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  )
}

type FeatureCardProps = {
  icon?: React.ReactNode
  title: string
  description?: string
  className?: string
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <Card variant="gradient" padding="sm" className={className}>
      <div className="flex flex-col items-start space-y-2">
        {icon && (
          <div className="text-primary mb-2">
            {icon}
          </div>
        )}
        <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
          {title}
        </h3>
        {description && (
          <p className="text-xs md:text-sm text-white/90 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </Card>
  )
}