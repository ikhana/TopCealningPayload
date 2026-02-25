import React from 'react';
import { cn } from '@/utilities/cn';

type BorderButtonProps = {
  text: string;
  variant?: 'filled' | 'outlined' | 'outlined-colored';
  onClick?: () => void;
  fullWidth?: boolean;
  className?: string;
  as?: 'button' | 'link';
  href?: string;
  disabled?: boolean;
};

export const BorderButton: React.FC<BorderButtonProps> = ({
  text,
  variant = 'filled',
  onClick,
  fullWidth = false,
  className = '',
  as = 'button',
  href,
  disabled = false,
}) => {
  const wrapperClasses = cn(
    'relative inline-block',
    fullWidth && 'w-full',
    className
  );

  const contentClasses = cn(
    'relative px-6 py-3 font-semibold uppercase tracking-wide text-sm',
    'block w-full text-center transition-all duration-300',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    variant === 'filled' 
      ? 'bg-primary text-primary-foreground hover:bg-transparent hover:text-primary'
      : variant === 'outlined'
      ? 'bg-transparent text-white border-2 border-primary hover:bg-primary hover:text-primary-foreground'
      : 'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-primary-foreground',
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
  );

  const BorderLines = () => (
    <>
      <div className="absolute left-0 -top-[1px] h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
      <div className="absolute -bottom-[1px] left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
      <div className="absolute inset-y-0 -top-[5px] -bottom-[5px] -left-[1px] w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
      <div className="absolute inset-y-0 -top-[5px] -bottom-[5px] -right-[1px] w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
    </>
  );

  if (as === 'link' && href) {
    return (
      <div className={wrapperClasses}>
        <BorderLines />
        <a href={href} className={contentClasses} onClick={onClick}>
          {text}
        </a>
      </div>
    );
  }

  return (
    <div className={wrapperClasses}>
      <BorderLines />
      <button type="button" onClick={onClick} disabled={disabled} className={contentClasses}>
        {text}
      </button>
    </div>
  );
};

export default BorderButton;