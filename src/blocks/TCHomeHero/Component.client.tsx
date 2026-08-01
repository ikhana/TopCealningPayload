// src/blocks/TCHomeHero/Component.client.tsx
// Top Cleaning home hero — DARK variant, mirrors design/drakhero.html.
// Switches from the light hero5 teal-overlay to deep-navy obsidian
// to anchor the background1 "Ceramic Monolith" page-rhythm.
//
// Justified inline-style exceptions:
//   • gradient overlay  — multi-stop rgba not expressible as Tailwind arbitrary
//   • radial glow       — specific rgba percentages
//   • review strip      — navy-glass backdrop + left teal border + offset shadow
//   • panel box-shadow  — deep rgba multi-value

'use client'

import { cn } from '@/utilities/cn'
import { TCButton } from '@/components/ui/TCButton'
import { TCHeadingStack } from '@/components/ui/TCHeading'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcHomeHero'
}

/* ── Hero service cards ──────────────────────────────────────────── */
const HERO_CARDS = [
  {
    id: 'residential',
    eyebrow: 'Residential',
    heading: 'Residential homes, done properly.',
    // Card bg is solid teal — use `light` (white bg + teal text) so the
    // button visually separates from the card.
    cta: { label: 'BOOK IN 60 SECONDS', href: '/booking', variant: 'light' as const },
    badge: { save: 'Save', pct: '15%', sub: 'First Book' },
  },
  {
    id: 'commercial',
    eyebrow: 'Commercial',
    heading: 'Commercial spaces, kept in order.',
    cta: { label: 'GET A CUSTOM QUOTE', href: '/booking', variant: 'dark' as const },
    badge: null,
  },
]

export function TCHomeHeroClient(_props: Props) {
  return (
    <>
      {/* ── Block-scoped keyframes ─────────────────────────────────── */}
      <style suppressHydrationWarning>{`
        @keyframes tc-hero-zoom {
          from { transform: scale(1.05); }
          to   { transform: scale(1.1); }
        }
        @keyframes tc-badge-float {
          0%, 100% { transform: rotate(12deg) translateY(0px); }
          50%      { transform: rotate(8deg)  translateY(-12px); }
        }
        @keyframes tc-hero-reveal-left {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes tc-hero-reveal-right {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @media (max-width: 768px) {
          .tc-review-strip { gap: 16px !important; padding: 16px 24px !important; }
          .tc-review-divider { padding-left: 16px !important; }
        }
      `}</style>

      <section className="relative min-h-screen w-full flex flex-col -mt-20 lg:-mt-24 bg-gradient-to-b from-[#eaf7f6] via-white to-white">

        {/* ── Background image + LIGHT left-to-right overlay (Geraldine: light colors, not dark) ── */}
        <div className="absolute inset-0 z-[1] overflow-hidden">
          <picture className="w-full h-full">
            <img
              src="/images/hero/herotopcleaning.jpg"
              alt="Top Cleaning team member ready to clean your home"
              className="w-full h-full object-cover object-center"
              style={{
                transform: 'scale(1.05)',
                animation: 'tc-hero-zoom 20s infinite alternate linear',
              }}
            />
          </picture>
          {/* Light gradient: white-frosted left → near-transparent right so text reads clean over the photo */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.7) 45%, rgba(255,255,255,0.15) 100%)',
            }}
          />
          {/* Radial teal glow accent — softer on light bg */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 72% 28%, rgba(23,176,171,0.12) 0%, transparent 50%)',
            }}
          />
        </div>

        {/* ── Main 2-column grid ──────────────────────────────────────── */}
        <div className="relative z-[5] flex-1 grid grid-cols-1 lg:grid-cols-2 gap-16 px-[5%] items-center">

          {/* ── Left column: headline, description, review strip ─────── */}
          <div
            className="py-10 lg:py-16"
            style={{
              animation: 'tc-hero-reveal-left 1.2s forwards 0.2s cubic-bezier(0.16,1,0.3,1)',
              opacity: 0,
            }}
          >
            {/* Headline — light theme over light photo */}
            <TCHeadingStack
              mainLine="Cleaning Service"
              secondaryLine="Where Order and Energy Flow Together."
              level="h1"
              theme="light"
              size="lg"
              accentColor="#17b0ab"
              className="mb-5 lg:mb-8"
            />

            {/* Description (Geraldine's corrections PDF slide 7) */}
            <p
              className="max-w-[520px] text-[1.1rem] leading-[1.7] mb-8 lg:mb-12"
              style={{ color: 'rgba(13,27,46,0.78)' }}
            >
              At Top Cleaning, we create clean and comfortable spaces so you can focus on what
              matters most. Our team delivers reliable, detailed, and high-quality cleaning services
              you can trust.
            </p>

            {/* Review strip — white glass with left teal border */}
            <div
              className="tc-review-strip inline-flex items-center gap-8 font-mono text-[0.75rem] px-10 py-5"
              style={{
                background: 'rgba(255,255,255,0.88)',
                backdropFilter: 'blur(12px)',
                borderLeft: '4px solid #17b0ab',
                boxShadow: '20px 20px 0px rgba(23,176,171,0.18)',
                color: '#0d1b2e',
              }}
            >
              <div>
                <span className="text-[1rem]" style={{ color: '#f7b500' }}>★★★★★</span>
              </div>
              <div className="tc-review-divider border-l border-navy-deep/15 pl-8">
                See our 275+ 4.7-Star Reviews on{' '}
                <span className="text-teal ml-1 inline-flex items-center gap-1">
                  {/* Official Google logo colours — brand requirement */}
                  <svg width="13" height="13" viewBox="0 0 48 48" aria-hidden>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  Google
                </span>
              </div>
            </div>
          </div>

          {/* ── Right column: Service panels (mapped from HERO_CARDS) ── */}
          <div
            className="grid grid-cols-1 gap-5"
            style={{
              perspective: '1000px',
              animation: 'tc-hero-reveal-right 1.2s forwards 0.5s cubic-bezier(0.16,1,0.3,1)',
              opacity: 0,
            }}
          >
            {HERO_CARDS.map((card) => {
              // Old design's two-card pattern: teal-solid card uses the `light`
              // (white) button; white card uses the `dark` (teal-outline) button.
              const isTealCard = card.cta.variant === 'light'
              return (
                <div
                  key={card.id}
                  className={cn(
                    'group relative overflow-hidden',
                    'p-8 lg:p-14',
                    'transition-all duration-500',
                    'hover:-translate-y-2',
                    isTealCard
                      ? 'bg-teal border border-teal/30'
                      : 'bg-white border border-slate-200',
                  )}
                  style={{
                    boxShadow: isTealCard
                      ? '0 18px 40px -14px rgba(23,176,171,0.45)'
                      : '0 14px 36px -16px rgba(13,27,46,0.18)',
                  }}
                >
                  {/* Offer badge — coral circle, floating (optional per card) */}
                  {card.badge && (
                    <div
                      aria-hidden
                      className="absolute bottom-[-20px] right-[-20px] w-[120px] h-[120px] bg-coral rounded-full flex flex-col items-center justify-center text-white font-mono font-black leading-none border-2 border-white/35 z-[15]"
                      style={{
                        transform: 'rotate(12deg)',
                        boxShadow: '0 15px 35px rgba(252,129,129,0.45)',
                        animation: 'tc-badge-float 5s infinite ease-in-out',
                      }}
                    >
                      <small className="text-[0.55rem] uppercase">{card.badge.save}</small>
                      <span className="text-[1.8rem]">{card.badge.pct}</span>
                      <small className="text-[0.55rem] uppercase">{card.badge.sub}</small>
                    </div>
                  )}

                  <h3
                    className={cn(
                      'text-[1.3rem] lg:text-[1.7rem] font-extrabold tracking-[-1px] mb-5 lg:mb-8 leading-tight',
                      isTealCard ? 'text-white' : 'text-navy-deep',
                    )}
                  >
                    {card.heading}
                  </h3>
                  <TCButton variant={card.cta.variant} href={card.cta.href}>
                    {card.cta.label}
                  </TCButton>
                </div>
              )
            })}
          </div>

        </div>

      </section>
    </>
  )
}
