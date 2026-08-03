// src/components/ExitIntentPopup/index.tsx
// Exit-intent coupon offer. Fires when a visitor looks like they're leaving
// WITHOUT having started a booking, and offers a first-clean discount.
//
// Triggers
//   • Desktop — cursor leaves the viewport through the top (classic exit intent)
//   • Mobile  — no real exit intent exists, so we use an "engaged but not
//               converting" proxy: MOBILE_DELAY_MS on page + scrolled past 40%
//
// Suppressed when
//   • The visitor already started a booking (tc_draft_token in sessionStorage)
//   • They're on /booking, /checkout, /account, /admin
//   • It already showed this session
//   • They dismissed it within the last DISMISS_DAYS days
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
  'Book your first clean with Top Cleaning and we\'ll take 10% off. Mention the code when we confirm your quote.'

// ── Behaviour ─────────────────────────────────────────────────
const SESSION_SHOWN_KEY = 'tc_exit_offer_shown'
const DISMISSED_AT_KEY = 'tc_exit_offer_dismissed_at'
const DRAFT_TOKEN_KEY = 'tc_draft_token' // set by useDraftSync once a booking starts
const DISMISS_DAYS = 14
const MOBILE_DELAY_MS = 40_000
const MOBILE_SCROLL_THRESHOLD = 0.4

const HIDDEN_PATH_PREFIXES = ['/booking', '/checkout', '/account', '/admin', '/orders', '/cart']

export function ExitIntentPopup() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const armed = useRef(false)

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
    if (!canShow()) return
    sessionStorage.setItem(SESSION_SHOWN_KEY, '1')
    setOpen(true)
  }, [canShow])

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISSED_AT_KEY, String(Date.now()))
    setOpen(false)
  }, [])

  // ── Desktop exit intent ─────────────────────────────────────
  useEffect(() => {
    if (onHiddenPath) return
    const onMouseOut = (e: MouseEvent) => {
      if (!armed.current) return
      if (e.clientY > 0) return          // only when leaving via the top edge
      if (e.relatedTarget) return         // moving to another element, not out
      show()
    }
    // Arm after a short delay so it can't fire the instant the page loads.
    const armTimer = window.setTimeout(() => { armed.current = true }, 5_000)
    document.addEventListener('mouseout', onMouseOut)
    return () => {
      window.clearTimeout(armTimer)
      document.removeEventListener('mouseout', onMouseOut)
    }
  }, [onHiddenPath, show])

  // ── Mobile fallback: engaged but not converting ─────────────
  useEffect(() => {
    if (onHiddenPath) return
    if (typeof window === 'undefined') return
    const isTouch = window.matchMedia('(hover: none)').matches
    if (!isTouch) return

    const timer = window.setTimeout(() => {
      const doc = document.documentElement
      const scrolled = (window.scrollY + window.innerHeight) / (doc.scrollHeight || 1)
      if (scrolled >= MOBILE_SCROLL_THRESHOLD) show()
    }, MOBILE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [onHiddenPath, show])

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
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'tc-exit-fade 0.25s ease forwards',
      }}
    >
      <style>{`
        @keyframes tc-exit-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes tc-exit-pop  { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
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
          width: '100%', maxWidth: '440px',
          background: '#ffffff',
          border: '1px solid rgba(13,27,46,0.08)',
          boxShadow: '0 30px 70px -20px rgba(13,27,46,0.35)',
          padding: '40px 32px 32px',
          textAlign: 'center',
          animation: 'tc-exit-pop 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close offer"
          style={{
            position: 'absolute', top: '12px', right: '12px',
            width: '32px', height: '32px',
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
