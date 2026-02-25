import { cn } from '@/utilities/cn'
import Link from 'next/link'
import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

interface ButtonBaseProps {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  disabled?: boolean
  fullWidth?: boolean
}

interface ButtonAsButtonProps extends ButtonBaseProps {
  as?: 'button'
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}

interface ButtonAsLinkProps extends ButtonBaseProps {
  as: 'link'
  href: string
  external?: boolean
}

type WorkshopButtonProps = ButtonAsButtonProps | ButtonAsLinkProps

export const WorkshopButton: React.FC<WorkshopButtonProps> = (props) => {
  const {
    children,
    variant = 'primary',
    size = 'md',
    className,
    disabled = false,
    fullWidth = false,
    ...rest
  } = props

  const baseStyles = cn(
    'relative inline-flex items-center justify-center font-semibold font-body uppercase tracking-wide',
    'transition-all duration-300 ease-out overflow-hidden group cursor-pointer',
    'focus:outline-none focus:ring-0 disabled:cursor-not-allowed',
    'text-center leading-tight border-2',
    
    'w-full max-w-[200px] xs:max-w-[220px] sm:w-auto sm:max-w-none',
    fullWidth && '!w-full',
    
    {
      'px-4 py-2 text-xs min-h-[36px] sm:px-5 sm:py-2.5 sm:text-sm': size === 'sm',
      'px-6 py-3 text-sm min-h-[44px] sm:px-7 sm:py-3.5 sm:text-base': size === 'md', 
      'px-8 py-4 text-base min-h-[52px] sm:px-9 sm:py-4.5 sm:text-lg': size === 'lg',
      'px-10 py-5 text-lg min-h-[60px] sm:px-11 sm:py-5.5 sm:text-xl': size === 'xl',
    }
  )

  const variantStyles = {
    primary: cn(
      'bg-coral hover:bg-coral/90 text-clinical-white border-coral',
      'shadow-lg shadow-coral/25 hover:shadow-xl hover:shadow-coral/35',
      'hover:-translate-y-0.5 active:translate-y-0',
      'focus-visible:ring-4 focus-visible:ring-coral/40 focus-visible:ring-offset-2',
      'focus-visible:ring-offset-clinical-white dark:focus-visible:ring-offset-navy'
    ),
    
    secondary: cn(
      'bg-clinical-white dark:bg-navy hover:bg-brand-blue dark:hover:bg-brand-blue',
      'text-brand-blue dark:text-brand-blue hover:text-clinical-white dark:hover:text-clinical-white',
      'border-brand-blue hover:border-brand-blue',
      'shadow-lg shadow-brand-blue/20 hover:shadow-xl hover:shadow-brand-blue/30',
      'hover:-translate-y-0.5 active:translate-y-0',
      'focus-visible:ring-4 focus-visible:ring-brand-blue/40 focus-visible:ring-offset-2',
      'focus-visible:ring-offset-clinical-white dark:focus-visible:ring-offset-navy'
    ),
    
    outline: cn(
      'bg-transparent hover:bg-blue-gray/10 dark:hover:bg-blue-gray/5',
      'text-blue-gray hover:text-dark-navy dark:text-blue-gray dark:hover:text-clinical-white',
      'border-blue-gray hover:border-dark-navy dark:border-blue-gray dark:hover:border-clinical-white',
      'shadow-md shadow-blue-gray/15 hover:shadow-lg hover:shadow-blue-gray/25',
      'hover:-translate-y-0.5',
      'focus-visible:ring-4 focus-visible:ring-blue-gray/40 focus-visible:ring-offset-2',
      'focus-visible:ring-offset-clinical-white dark:focus-visible:ring-offset-navy'
    ),
    
    ghost: cn(
      'bg-transparent hover:bg-orange/10 dark:hover:bg-orange/5',
      'text-orange hover:text-orange/80 dark:text-orange dark:hover:text-orange/90',
      'border-transparent',
      'transition-colors duration-300',
      'focus-visible:ring-4 focus-visible:ring-orange/40 focus-visible:ring-offset-2',
      'focus-visible:ring-offset-clinical-white dark:focus-visible:ring-offset-navy'
    ),
  }

  const buttonClasses = cn(
    baseStyles,
    variantStyles[variant],
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none hover:transform-none hover:shadow-none',
    className
  )

  const renderContent = () => {
    return (
      <span className="relative z-10 transition-all duration-300 flex items-center justify-center gap-2">
        {children}
      </span>
    )
  }

  if (props.as === 'link') {
    const { href, external, ...linkProps } = rest as ButtonAsLinkProps
    
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses}
          aria-disabled={disabled}
        >
          {renderContent()}
        </a>
      )
    }

    return (
      <Link href={href} className={buttonClasses} aria-disabled={disabled}>
        {renderContent()}
      </Link>
    )
  }

  const { type = 'button', onClick, ...buttonProps } = rest as ButtonAsButtonProps

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      {...buttonProps}
    >
      {renderContent()}
    </button>
  )
}

export type { ButtonSize, ButtonVariant, WorkshopButtonProps }
