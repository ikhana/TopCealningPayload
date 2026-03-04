'use client'

import { cn } from '@/utilities/cn'
import Link from 'next/link'
import React from 'react'
import styles from './TCButton.module.css'

// ─── Types ────────────────────────────────────────────────────────

/**
 * Button style variants:
 *
 * primary  → Tectonic Shift — teal solid, angled clip-path, obsidian fill + coral shadow on hover
 * ghost    → Refractive     — navy outline on light bgs, teal fill slides in + offset shadow
 * dark     → Dark Neon      — for dark/obsidian sections, teal inset flood-fill on hover
 * filter   → Depth Diffusion — utility tag, subtle tint, letter-spacing expands on hover
 * submit   → Hydraulic Press — split white-text + teal-icon panel, presses down on hover
 * inline   → Surface Tension — text + morphing circle arrow, for learn-more / inline CTAs
 */
export type TCButtonVariant = 'primary' | 'ghost' | 'dark' | 'filter' | 'submit' | 'inline'

export type TCButtonSize = 'sm' | 'md' | 'lg'

export interface TCButtonProps {
  /** Visual style variant — see TCButtonVariant for details */
  variant?: TCButtonVariant
  /** Size preset — sm (card/compact), md (default), lg (hero/section CTA) */
  size?: TCButtonSize
  /** If provided, renders as a Next.js Link instead of a button */
  href?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  children: React.ReactNode
  /** Button type — only applies when rendered as <button> */
  type?: 'button' | 'submit' | 'reset'
  className?: string
  disabled?: boolean
}

// ─── SVG Icons ────────────────────────────────────────────────────

const ArrowRight = ({ className }: { className?: string }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const CheckCircle = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

// ─── Size configs ─────────────────────────────────────────────────

const PRIMARY_SIZE = {
  sm: { padding: '10px 20px',  fontSize: '0.75rem', letterSpacing: '1px'   },
  md: { padding: '18px 36px',  fontSize: '0.85rem', letterSpacing: '1.5px' },
  lg: { padding: '22px 44px',  fontSize: '0.95rem', letterSpacing: '2px'   },
} as const

const GHOST_SIZE = {
  sm: { padding: '10px 22px',  fontSize: '0.8rem'  },
  md: { padding: '16px 38px',  fontSize: '0.9rem'  },
  lg: { padding: '20px 48px',  fontSize: '1rem'    },
} as const

const DARK_SIZE = {
  sm: { padding: '10px 22px',  fontSize: '0.8rem',  letterSpacing: '1px'   },
  md: { padding: '18px 36px',  fontSize: '0.85rem', letterSpacing: '1.5px' },
  lg: { padding: '20px 48px',  fontSize: '0.95rem', letterSpacing: '2px'   },
} as const

const INLINE_SIZE = {
  sm: { fontSize: '0.7rem', letterSpacing: '0.5px', gapClass: styles.inlineSm, circleClass: styles.inlineCircleSm },
  md: { fontSize: '0.8rem', letterSpacing: '1px',   gapClass: '',              circleClass: ''                   },
  lg: { fontSize: '0.9rem', letterSpacing: '1.5px', gapClass: styles.inlineLg, circleClass: styles.inlineCircleLg },
} as const

// ─── Component ────────────────────────────────────────────────────

/**
 * TCButton
 *
 * The TopCleaning button system. Renders as a Next.js Link when
 * `href` is provided, otherwise as a native <button>.
 *
 * Usage:
 *   <TCButton variant="primary" href="/booking">Book Now</TCButton>
 *   <TCButton variant="ghost" href="/services">View Services</TCButton>
 *   <TCButton variant="dark" href="/booking">Book Your Cleaning</TCButton>
 *   <TCButton variant="inline" href="/process">Learn Our Process</TCButton>
 *   <TCButton variant="filter" onClick={() => setFilter('all')}>All Services</TCButton>
 *   <TCButton variant="submit" type="submit">Submit Application</TCButton>
 */
export const TCButton: React.FC<TCButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  children,
  type = 'button',
  className,
  disabled,
}) => {

  // ── Inline: Surface Tension ──────────────────────────────────
  if (variant === 'inline') {
    const sz = INLINE_SIZE[size]
    const cls = cn(styles.inline, sz.gapClass, 'font-mono font-bold text-teal uppercase', className)
    const content = (
      <>
        <span className={cn(styles.inlineCircle, sz.circleClass)}>
          <ArrowRight className={styles.inlineArrow} />
        </span>
        <span style={{ fontSize: sz.fontSize, letterSpacing: sz.letterSpacing }}>{children}</span>
      </>
    )
    if (href) {
      return (
        <Link href={href} className={cls} onClick={onClick as any}>
          {content}
        </Link>
      )
    }
    return (
      <button type={type} className={cls} onClick={onClick as any} disabled={disabled}>
        {content}
      </button>
    )
  }

  // ── Submit: Hydraulic Press ──────────────────────────────────
  if (variant === 'submit') {
    return (
      <button
        type={type}
        className={cn(styles.submit, className)}
        onClick={onClick as any}
        disabled={disabled}
      >
        <div
          className={cn(styles.submitText, 'font-mono font-black uppercase text-navy-deep')}
          style={{ fontSize: '0.85rem', letterSpacing: '2px' }}
        >
          {children}
        </div>
        <div className={cn(styles.submitIcon, 'bg-teal')}>
          <CheckCircle />
        </div>
      </button>
    )
  }

  // ── Primary: Tectonic Shift ──────────────────────────────────
  if (variant === 'primary') {
    const sz = PRIMARY_SIZE[size]
    const cls = cn(
      styles.primary,
      'inline-flex items-center bg-teal text-white font-mono font-black uppercase',
      className,
    )
    const innerStyle: React.CSSProperties = {
      padding: sz.padding,
      fontSize: sz.fontSize,
      letterSpacing: sz.letterSpacing,
      textDecoration: 'none',
    }
    const content = (
      <span className={styles.primaryContent}>
        {children}
        <ArrowRight className={styles.primaryArrow} />
      </span>
    )
    if (href) {
      return (
        <Link href={href} className={cls} style={innerStyle} onClick={onClick as any}>
          {content}
        </Link>
      )
    }
    return (
      <button type={type} className={cls} style={innerStyle} onClick={onClick as any} disabled={disabled}>
        {content}
      </button>
    )
  }

  // ── Ghost: Refractive ────────────────────────────────────────
  if (variant === 'ghost') {
    const sz = GHOST_SIZE[size]
    const cls = cn(styles.ghost, 'inline-block font-heading font-bold', className)
    const innerStyle: React.CSSProperties = {
      padding: sz.padding,
      fontSize: sz.fontSize,
      color: '#0d1b2e',
      border: '2px solid #0d1b2e',
      textDecoration: 'none',
    }
    if (href) {
      return (
        <Link href={href} className={cls} style={innerStyle} onClick={onClick as any}>
          {children}
        </Link>
      )
    }
    return (
      <button type={type} className={cls} style={innerStyle} onClick={onClick as any} disabled={disabled}>
        {children}
      </button>
    )
  }

  // ── Dark Neon: Vitreous Depth ────────────────────────────────
  if (variant === 'dark') {
    const sz = DARK_SIZE[size]
    const cls = cn(styles.dark, 'inline-block font-mono font-bold uppercase', className)
    const innerStyle: React.CSSProperties = {
      padding: sz.padding,
      fontSize: sz.fontSize,
      letterSpacing: sz.letterSpacing,
      background: 'transparent',
      color: '#3dcfca',
      border: '1px solid #17b0ab',
      textDecoration: 'none',
    }
    if (href) {
      return (
        <Link href={href} className={cls} style={innerStyle} onClick={onClick as any}>
          {children}
        </Link>
      )
    }
    return (
      <button type={type} className={cls} style={innerStyle} onClick={onClick as any} disabled={disabled}>
        {children}
      </button>
    )
  }

  // ── Filter: Depth Diffusion ──────────────────────────────────
  if (variant === 'filter') {
    const cls = cn(styles.filter, 'inline-block font-mono font-bold uppercase', className)
    const innerStyle: React.CSSProperties = {
      padding: '12px 24px',
      fontSize: '0.75rem',
      letterSpacing: '1px',
      background: 'rgba(23, 176, 171, 0.05)',
      color: '#0f8a86',
      border: '1px solid rgba(23, 176, 171, 0.2)',
      textDecoration: 'none',
    }
    if (href) {
      return (
        <Link href={href} className={cls} style={innerStyle} onClick={onClick as any}>
          {children}
        </Link>
      )
    }
    return (
      <button type={type} className={cls} style={innerStyle} onClick={onClick as any} disabled={disabled}>
        {children}
      </button>
    )
  }

  return null
}
