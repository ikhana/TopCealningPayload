// src/blocks/TCTestimonials/Component.client.tsx
// "Voices of The Pristine": Google reviews slider (Geraldine, 2026-10-19).
//
// Sliding row of review cards: monogram avatar with a Google badge, gold stars, text clamped
// to a few lines with "Read more", arrows and dots. 3 cards per view on desktop, 2 on tablet,
// 1 on mobile (native scroll-snap, so touch swipe just works). No autoplay.
//
// Compliance (see src/data/testimonials.ts, Twilio 30962): real reviews only, quoted verbatim,
// monogram not a photograph, no invented roles, no Review/AggregateRating markup. "Read more"
// only reveals the rest of the same text. There is no star total or review count here because
// we do not hold a verified figure; the link goes to the live Google listing instead.

'use client'

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { TCHeadingStack } from '@/components/ui/TCHeading'
import { TESTIMONIALS, GOOGLE_REVIEWS_URL, initialOf, type Testimonial } from '@/data/testimonials'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcTestimonials'
}

const GOOGLE_STAR = '#fbbc04'

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
    </svg>
  )
}

function GoogleG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

function ReviewCard({ t }: { t: Testimonial }) {
  const [open, setOpen] = useState(false)
  const [overflows, setOverflows] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  // Show "Read more" only when the clamped text is actually cut off. Re-measured on resize
  // because the card width (and so the line count) changes with the viewport.
  useLayoutEffect(() => {
    const el = textRef.current
    if (!el) return
    const measure = () => {
      if (!open) setOverflows(el.scrollHeight > el.clientHeight + 1)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [open])

  return (
    <article className="tc-rv-card">
      <div className="tc-rv-head">
        <div className="tc-rv-avatar" aria-hidden>
          {initialOf(t.name)}
          <span className="tc-rv-badge">
            <GoogleG size={14} />
          </span>
        </div>
        <div style={{ minWidth: 0 }}>
          <p className="tc-rv-name">{t.name}</p>
          <p className="tc-rv-src">
            Google Review{t.translated ? ' · Translated' : ''}
          </p>
        </div>
      </div>

      <div className="tc-rv-stars" role="img" aria-label={`${t.rating} out of 5 stars`}>
        {Array.from({ length: t.rating }, (_, i) => (
          <StarIcon key={i} />
        ))}
      </div>

      <p ref={textRef} className={open ? 'tc-rv-text' : 'tc-rv-text tc-rv-clamp'}>
        {t.quote}
      </p>

      {(overflows || open) && (
        <button type="button" className="tc-rv-more" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {open ? 'Show less' : 'Read more'}
        </button>
      )}
    </article>
  )
}

export function TCTestimonialsClient(_props: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(0)

  const update = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const count = max <= 2 ? 1 : Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth - 0.05))
    setPages(count)
    setPage(max <= 2 || count === 1 ? 0 : Math.round((el.scrollLeft / max) * (count - 1)))
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [update])

  const goTo = (target: number) => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const clamped = Math.min(Math.max(target, 0), pages - 1)
    el.scrollTo({ left: pages <= 1 ? 0 : (clamped / (pages - 1)) * max, behavior: 'smooth' })
  }

  return (
    <>
      <style>{`
        .tc-rv-track {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          padding: 8px 2px 28px;
        }
        .tc-rv-track::-webkit-scrollbar { display: none; }

        .tc-rv-card {
          flex: 0 0 calc((100% - 48px) / 3);
          scroll-snap-align: start;
          background: #ffffff;
          border: 1px solid rgba(23,176,171,0.18);
          border-radius: 4px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 22px -14px rgba(13,27,46,0.18);
          transition: box-shadow 0.5s cubic-bezier(0.22,1,0.36,1), border-color 0.5s, transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .tc-rv-card:hover {
          border-color: #17b0ab;
          box-shadow: 0 18px 40px -18px rgba(13,27,46,0.22);
          transform: translateY(-4px);
        }
        .tc-rv-head { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
        .tc-rv-avatar {
          position: relative;
          width: 46px; height: 46px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          background: #e0f5f4;
          border: 1px solid rgba(23,176,171,0.3);
          color: #0d1b2e; font-weight: 800; font-size: 1.1rem; line-height: 1;
        }
        .tc-rv-badge {
          position: absolute; right: -4px; bottom: -4px;
          width: 20px; height: 20px; border-radius: 50%;
          background: #fff; box-shadow: 0 0 0 1px rgba(13,27,46,0.12);
          display: flex; align-items: center; justify-content: center;
        }
        .tc-rv-name { margin: 0; font-size: 0.95rem; font-weight: 700; color: #0d1b2e; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .tc-rv-src { margin: 2px 0 0; font-family: var(--font-mono); font-size: 0.65rem; color: #17b0ab; text-transform: uppercase; letter-spacing: 0.5px; }
        .tc-rv-stars { display: flex; gap: 2px; color: ${GOOGLE_STAR}; margin-bottom: 14px; }
        .tc-rv-text { margin: 0; font-size: 0.95rem; line-height: 1.65; color: rgba(13,27,46,0.78); }
        .tc-rv-clamp { display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden; }
        .tc-rv-more {
          align-self: flex-start; margin-top: 10px; padding: 0;
          background: none; border: none; cursor: pointer;
          font-size: 0.85rem; font-weight: 600; color: #0d1b2e;
          text-decoration: underline; text-underline-offset: 3px;
        }
        .tc-rv-more:hover { color: #17b0ab; }

        .tc-rv-arrow {
          width: 44px; height: 44px; border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          background: #fff; color: #0d1b2e; cursor: pointer;
          border: 1px solid rgba(13,27,46,0.18);
          transition: background 0.3s, color 0.3s, border-color 0.3s, opacity 0.3s;
        }
        .tc-rv-arrow:hover:not(:disabled) { background: #17b0ab; border-color: #17b0ab; color: #fff; }
        .tc-rv-arrow:disabled { opacity: 0.35; cursor: default; }

        .tc-rv-dot {
          width: 8px; height: 8px; padding: 0; border: none; border-radius: 999px; cursor: pointer;
          background: rgba(13,27,46,0.22); transition: width 0.3s, background 0.3s;
        }
        .tc-rv-dot[aria-current='true'] { width: 24px; background: #17b0ab; }

        @media (max-width: 1024px) {
          .tc-rv-card { flex-basis: calc((100% - 24px) / 2); }
        }
        @media (max-width: 680px) {
          .tc-rv-section { padding: 64px 5% !important; }
          .tc-rv-top { flex-direction: column; align-items: flex-start !important; }
          .tc-rv-card { flex-basis: 86%; padding: 24px; }
          .tc-rv-track { gap: 16px; }
          .tc-rv-arrows { display: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tc-rv-card, .tc-rv-dot, .tc-rv-arrow { transition: none; }
          .tc-rv-card:hover { transform: none; }
        }
      `}</style>

      <section
        className="tc-rv-section"
        style={{ background: '#f5efe0', padding: '120px 5%', position: 'relative', overflow: 'hidden' }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            background: '#17b0ab',
            filter: 'blur(150px)',
            opacity: 0.06,
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div
            className="tc-rv-top"
            style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '32px', marginBottom: '28px' }}
          >
            <div>
              <TCHeadingStack
                ghostKicker="Voices"
                mainLine="Voices of"
                secondaryLine="The Pristine."
                theme="light"
                size="lg"
                className="mb-[24px]"
              />
              <p style={{ color: 'rgba(13,27,46,0.62)', lineHeight: 1.8, maxWidth: '520px', margin: 0 }}>
                Our reputation is built on the visible results we leave behind. Hear from the clients
                who transformed their spaces with Top Cleaning.
              </p>
            </div>

            <div className="tc-rv-arrows" style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
              <button type="button" className="tc-rv-arrow" aria-label="Previous reviews" disabled={page <= 0} onClick={() => goTo(page - 1)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button type="button" className="tc-rv-arrow" aria-label="Next reviews" disabled={page >= pages - 1} onClick={() => goTo(page + 1)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>
          </div>

          <div
            ref={trackRef}
            className="tc-rv-track"
            onScroll={update}
            role="region"
            aria-roledescription="carousel"
            aria-label="Google reviews"
            tabIndex={0}
          >
            {TESTIMONIALS.map((t) => (
              <ReviewCard key={t.name} t={t} />
            ))}
          </div>

          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              {Array.from({ length: pages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className="tc-rv-dot"
                  aria-label={`Go to reviews page ${i + 1}`}
                  aria-current={i === page}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          )}

          {/* The link is what makes these verifiable rather than merely claimed. */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontWeight: 700,
                color: '#0d1b2e',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(23,176,171,0.5)',
                paddingBottom: '3px',
              }}
            >
              <GoogleG size={16} />
              Read all reviews on Google →
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
