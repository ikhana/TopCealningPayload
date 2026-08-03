// src/components/ExitIntentPopup/index.tsx
// Exit-intent coupon offer, built to the patterns the industry actually uses
// (see research notes below) rather than a naive mouseout listener.
//
// DESKTOP — cursor leaves through the TOP edge of the viewport, and only if it
//   was travelling upward fast enough. Direction alone false-fires when people
//   reach for a bookmark or another monitor; velocity + top-edge is the
//   standard combination. Uses `mouseleave` on the document (fires far less
//   often than `mouseout`, which also fires between descendant elements).
//
// MOBILE — there is no cursor, so exit intent is inferred from:
//   1. Back gesture/button  — primary mobile exit signal, trapped with a
//      throwaway history state (fires once, then hands the back button back).
//   2. Fast upward scroll   — a hard flick toward the browser chrome. Gated on
//      velocity (not direction alone) plus a minimum time on page, otherwise it
//      fires during ordinary reading.
//   Mobile shows a bottom slide-in sheet rather than a centre-screen modal —
//   the softer pattern recommended for small screens.
//
// FREQUENCY — once per session, suppressed for DISMISS_DAYS after a dismissal,
// and never while the visitor is actually converting.
//
// NOTE: the code is informational — Geraldine applies the discount when she
// quotes. There is no coupon engine in the booking flow (payment is disabled).

'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, Sparkles } from 'lucide-react'

// ── Offer (edit these to change the promo) ────────────────────
const OFFER_HEADLINE = 'Wait — before you go!'
const OFFER_AMOUNT = '10% OFF'
const OFFER_SUBJECT = 'your first cleaning'
const OFFER_CODE = 'WELCOME10'
const OFFER_BLURB =
  "Book your first clean with Top Cleaning and we'll take 10% off. Mention the code when we confirm your quote."

// ── Behaviour ─────────────────────────────────────────────────
const SESSION_SHOWN_KEY = 'tc_exit_offer_shown'
const DISMISSED_AT_KEY = 'tc_exit_offer_dismissed_at'
const DRAFT_TOKEN_KEY = 'tc_draft_token' // set by useDraftSync once a booking starts
const DISMISS_DAYS = 14

const ARM_DELAY_MS = 5_000          // min time on page before any trigger arms
const DESKTOP_UP_VELOCITY = 0.18    // px/ms upward — filters slow, casual exits
// The window X, tab close and address bar all sit top-RIGHT (top-left on macOS
// traffic lights). Exiting through that zone is much stronger intent than
// exiting mid-top, so we accept a gentler movement there.
const CLOSE_ZONE_RATIO = 0.62       // right-most 38% of the viewport width
const CLOSE_ZONE_VELOCITY = 0.08    // px/ms — lower bar inside the close zone
const MOBILE_MIN_TIME_MS = 12_000   // min time on page before the scroll trigger
const MOBILE_UP_VELOCITY = 0.9      // px/ms — a deliberate flick, not a scroll

// Back-gesture trapping is standard in this category but it does swallow the
// visitor's first Back press. Disabled — we don't interfere with Back.
const ENABLE_BACK_TRAP = false

const HIDDEN_PATH_PREFIXES = ['/booking', '/checkout', '/account', '/admin', '/orders', '/cart']

export function ExitIntentPopup() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const armed = useRef(false)
  const mountedAt = useRef(Date.now())

  const onHiddenPath = HIDDEN_PATH_PREFIXES.some((p) => pathname?.startsWith(p))

  const canShow = useCallback(() => {
    if (typeof window === 'undefined') return false
    if (onHiddenPath) return false
    // Already started a booking → they're converting, don't interrupt.
    if (sessionStorage.getItem(DRAFT_TOKEN_KEY)) return false
    if (sessionStorage.getItem(SESSION_SHOWN_KEY)) return false
    const dismissedAt = localStorage.getItem(DISMISSED_AT_KEY)
    if (dismissedAt) {
      const days = (Date.now() - Number(dismissedAt)) / 86_400_000
      if (Number.isFinite(days) && days < DISMISS_DAYS) return false
    }
    return true
  }, [onHiddenPath])

  const show = useCallback(() => {
    if (!canShow()) return false
    sessionStorage.setItem(SESSION_SHOWN_KEY, '1')
    setOpen(true)
    return true
  }, [canShow])

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISSED_AT_KEY, String(Date.now()))
    setOpen(false)
  }, [])

  // Detect touch/no-hover once on mount (drives both trigger set and layout).
  useEffect(() => {
    setIsMobile(window.matchMedia('(hover: none), (pointer: coarse)').matches)
  }, [])

  // Arm all triggers after a minimum time on page.
  useEffect(() => {
    const t = window.setTimeout(() => { armed.current = true }, ARM_DELAY_MS)
    return () => window.clearTimeout(t)
  }, [])

  // ── DESKTOP: top-edge exit with upward velocity ─────────────
  useEffect(() => {
    if (onHiddenPath || isMobile) return

    let lastY = 0
    let lastT = performance.now()
    let upVelocity = 0

    const onMove = (e: MouseEvent) => {
      const now = performance.now()
      const dt = now - lastT
      if (dt > 0) {
        // positive = travelling upward (toward the browser chrome)
        upVelocity = (lastY - e.clientY) / dt
      }
      lastY = e.clientY
      lastT = now
    }

    const onLeave = (e: MouseEvent) => {
      if (!armed.current) return
      if (e.clientY > 0) return // left via a side/bottom edge — not leaving the page

      // Heading for the window X / tab close / address bar? Treat as stronger
      // intent and accept a gentler movement.
      const inCloseZone = e.clientX >= window.innerWidth * CLOSE_ZONE_RATIO
      const threshold = inCloseZone ? CLOSE_ZONE_VELOCITY : DESKTOP_UP_VELOCITY
      if (upVelocity < threshold) return // drifted out slowly — not leaving

      show()
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [onHiddenPath, isMobile, show])

  // ── MOBILE 1: back gesture / button ─────────────────────────
  useEffect(() => {
    if (onHiddenPath || !isMobile || !ENABLE_BACK_TRAP) return

    // Throwaway state so the first Back press lands here instead of leaving.
    history.pushState({ tcExitTrap: true }, '')

    const onPop = () => {
      // Only intercept once, and only if we're actually allowed to show.
      if (armed.current && show()) {
        history.pushState({ tcExitTrap: true }, '') // keep them on the page
      }
      // Either way we stop trapping from here on — the next Back press works.
      window.removeEventListener('popstate', onPop)
    }

    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [onHiddenPath, isMobile, show])

  // ── MOBILE 2: fast upward scroll (velocity-gated) ───────────
  useEffect(() => {
    if (onHiddenPath || !isMobile) return

    let lastY = window.scrollY
    let lastT = performance.now()

    const onScroll = () => {
      const now = performance.now()
      const y = window.scrollY
      const dt = now - lastT
      if (dt > 0) {
        const upVelocity = (lastY - y) / dt // positive = scrolling up
        const engaged = Date.now() - mountedAt.current > MOBILE_MIN_TIME_MS
        if (armed.current && engaged && upVelocity > MOBILE_UP_VELOCITY && y < window.innerHeight) {
          show()
        }
      }
      lastY = y
      lastT = now
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onHiddenPath, isMobile, show])

  // ── Esc to close + lock body scroll while open ──────────────
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss() }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, dismiss])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tc-exit-title"
      onClick={dismiss}
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(13,27,46,0.55)',
        display: 'flex',
        // Mobile = bottom sheet (softer pattern), desktop = centred modal.
        alignItems: isMobile ? 'flex-end' : 'center',
        justifyContent: 'center',
        padding: isMobile ? '0' : '20px',
        animation: 'tc-exit-fade 0.25s ease forwards',
      }}
    >
      <style>{`
        @keyframes tc-exit-fade  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes tc-exit-pop   { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes tc-exit-slide { from { transform: translateY(100%) }            to { transform: translateY(0) } }
        .tc-exit-cta {
          display: block; width: 100%; text-align: center;
          background: #17b0ab; color: #ffffff; text-decoration: none;
          font-family: var(--font-mono); font-weight: 700; font-size: 0.85rem;
          letter-spacing: 2px; text-transform: uppercase; padding: 17px 20px;
          transition: background-color .3s ease;
        }
        .tc-exit-cta:hover { background: #0d1b2e; }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: isMobile ? '100%' : '440px',
          background: '#ffffff',
          border: '1px solid rgba(13,27,46,0.08)',
          boxShadow: '0 30px 70px -20px rgba(13,27,46,0.35)',
          padding: isMobile ? '32px 24px 28px' : '40px 32px 32px',
          textAlign: 'center',
          animation: isMobile
            ? 'tc-exit-slide 0.32s cubic-bezier(0.16,1,0.3,1) forwards'
            : 'tc-exit-pop 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close offer"
          style={{
            position: 'absolute', top: '12px', right: '12px',
            width: '36px', height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'rgba(74,90,106,0.6)',
          }}
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div style={{
          width: '58px', height: '58px', borderRadius: '50%',
          background: 'rgba(23,176,171,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 18px',
        }}>
          <Sparkles size={26} style={{ color: '#17b0ab' }} />
        </div>

        <h2 id="tc-exit-title" style={{
          fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800,
          color: '#0d1b2e', letterSpacing: '-0.5px', margin: '0 0 10px',
        }}>
          {OFFER_HEADLINE}
        </h2>

        <p style={{ fontSize: '1.05rem', color: '#0d1b2e', margin: '0 0 6px', fontWeight: 600 }}>
          Take <span style={{ color: '#17b0ab', fontWeight: 800 }}>{OFFER_AMOUNT}</span> {OFFER_SUBJECT}
        </p>

        <p style={{ fontSize: '0.88rem', color: 'rgba(74,90,106,0.8)', lineHeight: 1.6, margin: '0 0 20px' }}>
          {OFFER_BLURB}
        </p>

        {/* Code */}
        <div style={{
          border: '1px dashed rgba(23,176,171,0.5)',
          background: 'rgba(23,176,171,0.06)',
          padding: '12px', marginBottom: '22px',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(74,90,106,0.6)', marginBottom: '4px' }}>
            Your code
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 800, color: '#0d1b2e', letterSpacing: '3px' }}>
            {OFFER_CODE}
          </div>
        </div>

        <Link href={`/booking?promo=${OFFER_CODE}`} className="tc-exit-cta" onClick={() => setOpen(false)}>
          Book Your Cleaning
        </Link>

        <button
          type="button"
          onClick={dismiss}
          style={{
            marginTop: '14px', background: 'transparent', border: 'none',
            fontSize: '0.8rem', color: 'rgba(74,90,106,0.6)', cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          No thanks, maybe later
        </button>
      </div>
    </div>
  )
}
