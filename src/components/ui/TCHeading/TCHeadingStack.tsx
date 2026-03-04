'use client'

import { cn } from '@/utilities/cn'
import React from 'react'

// ─── Types ────────────────────────────────────────────────────────

/** Section background context: drives all text colors automatically */
export type TCHeadingTheme = 'light' | 'dark'

/** Semantic heading element to render */
export type TCHeadingLevel = 'h2' | 'h3'

/**
 * Font-size preset — controls clamp() values for both the ghost
 * kicker and the main heading.
 *
 * sm → sidebar / compact scale  (about-section style)
 * md → standard section heading (default)
 * lg → large sections           (services, process, testimonials)
 * xl → oversized / impact       (hero-adjacent)
 */
export type TCHeadingSize = 'sm' | 'md' | 'lg' | 'xl'

export interface TCHeadingStackProps {
  /**
   * Large atmospheric ghost watermark rendered above the heading.
   * Decorative only (aria-hidden). Keep short: 1–3 words.
   * e.g. "Maintenance", "Why Top", "Voices", "Careers"
   */
  ghostKicker?: string

  /** Primary heavy uppercase line — the main heading text */
  mainLine: string

  /**
   * Secondary italic light-weight line rendered below mainLine.
   * Color is resolved automatically from `theme`:
   *   light bg → #000 at 0.85 opacity
   *   dark bg  → rgba(255,255,255,0.55)
   */
  secondaryLine?: string

  /** Semantic heading level — defaults to h2 */
  level?: TCHeadingLevel

  /**
   * Section background context — automatically resolves all text colors.
   * 'light' → navy-deep main + black/0.85 secondary
   * 'dark'  → white main   + white/0.55 secondary
   * Default: 'light'
   */
  theme?: TCHeadingTheme

  /**
   * Size preset — controls clamp() font-sizes for ghost kicker + heading.
   * sm = small/sidebar | md = standard | lg = large | xl = oversized
   * Default: 'md'
   */
  size?: TCHeadingSize

  className?: string
}

// ─── Size token maps ──────────────────────────────────────────────

/** Ghost kicker font-size by size preset */
const GHOST_SIZES: Record<TCHeadingSize, string> = {
  sm: 'clamp(2rem,   4vw, 4rem)',
  md: 'clamp(2.8rem, 6vw, 5.5rem)',
  lg: 'clamp(3.5rem, 8vw, 7rem)',
  xl: 'clamp(4.5rem, 10vw, 9rem)',
}

/** Main heading font-size by size preset */
const HEADING_SIZES: Record<TCHeadingSize, string> = {
  sm: 'clamp(1.5rem, 3vw, 2.2rem)',
  md: 'clamp(2rem,   4vw, 3rem)',
  lg: 'clamp(2.5rem, 5vw, 3.8rem)',
  xl: 'clamp(3rem,   6vw, 5rem)',
}

// ─── Theme color tokens ───────────────────────────────────────────

const MAIN_COLOR: Record<TCHeadingTheme, string> = {
  light: '#0d1b2e', // deep-navy
  dark: '#ffffff',
}

const SECONDARY_COLOR: Record<TCHeadingTheme, string> = {
  light: '#000000',
  dark: 'rgba(255,255,255,0.55)',
}

const SECONDARY_OPACITY: Record<TCHeadingTheme, number> = {
  light: 0.85,
  dark: 1,
}

// ─── Component ────────────────────────────────────────────────────

/**
 * TCHeadingStack
 *
 * The TopCleaning section heading system: ghost kicker + tight-stack treatment.
 *
 * Usage (light section):
 *   <TCHeadingStack
 *     ghostKicker="Our Services"
 *     mainLine="Cleaning Solutions"
 *     secondaryLine="Built Around Your Needs."
 *     theme="light"
 *     size="lg"
 *   />
 *
 * Usage (dark section):
 *   <TCHeadingStack
 *     ghostKicker="Voices"
 *     mainLine="Voices of"
 *     secondaryLine="The Pristine."
 *     theme="dark"
 *     size="lg"
 *   />
 */
export const TCHeadingStack: React.FC<TCHeadingStackProps> = ({
  ghostKicker,
  mainLine,
  secondaryLine,
  level = 'h2',
  theme = 'light',
  size = 'md',
  className,
}) => {
  const headingStyle: React.CSSProperties = {
    fontSize: HEADING_SIZES[size],
    fontWeight: 900,
    lineHeight: 0.9,
    letterSpacing: '-0.04em',
    textTransform: 'uppercase',
    color: MAIN_COLOR[theme],
    margin: 0,
  }

  const headingContent = (
    <>
      {mainLine}
      {secondaryLine && (
        <span
          style={{
            display: 'block',
            fontWeight: 300,
            fontStyle: 'italic',
            textTransform: 'none',
            letterSpacing: '-0.01em',
            color: SECONDARY_COLOR[theme],
            opacity: SECONDARY_OPACITY[theme],
          }}
        >
          {secondaryLine}
        </span>
      )}
    </>
  )

  return (
    <div className={cn('tc-heading-stack', className)}>
      {/* Ghost kicker — atmospheric watermark, decorative, aria-hidden */}
      {ghostKicker && (
        <span
          className="block font-mono font-black uppercase select-none pointer-events-none"
          style={{
            fontSize: GHOST_SIZES[size],
            color: 'rgba(23,176,171,0.1)',
            letterSpacing: '-1px',
            lineHeight: 0.85,
            marginBottom: '-1.2rem',
            whiteSpace: 'nowrap',
          }}
          aria-hidden="true"
        >
          {ghostKicker}
        </span>
      )}

      {/* Tight-stack heading */}
      {level === 'h2' ? (
        <h2 className="font-heading" style={headingStyle}>
          {headingContent}
        </h2>
      ) : (
        <h3 className="font-heading" style={headingStyle}>
          {headingContent}
        </h3>
      )}
    </div>
  )
}
