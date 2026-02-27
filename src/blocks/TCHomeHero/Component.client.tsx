// src/blocks/TCHomeHero/Component.client.tsx
// Top Cleaning home hero — faithfully mirrors design/hero5.html.
// All colours use Tailwind theme tokens.
// Justified inline-style exceptions:
//   • box-shadow on review-strip & panels — complex rgba/color-mix values
//   • animation on bg image & badge    — keyframe names defined in <style>
//   • perspective on panels grid        — no Tailwind utility available

'use client'

import { cn } from '@/utilities/cn'
import Link from 'next/link'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcHomeHero'
}

export function TCHomeHeroClient(_props: Props) {
  return (
    <>
      {/* ── Block-scoped keyframes ─────────────────────────────────── */}
      <style suppressHydrationWarning>{`
        @keyframes tc-hero-zoom {
          from { transform: scale(1.0); }
          to   { transform: scale(1.1); }
        }
        @keyframes tc-badge-float {
          0%, 100% { transform: rotate(12deg) translateY(0px); }
          50%      { transform: rotate(8deg)  translateY(-12px); }
        }
        @keyframes tc-hero-reveal-left {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tc-hero-reveal-right {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <section className="relative z-10 min-h-screen w-full flex flex-col -mt-20 lg:-mt-24">

        {/* ── Background image + left-to-right teal-light gradient overlay ── */}
        <div className="absolute inset-0 z-[1] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000"
            alt="Pristine cleaned interior"
            className="w-full h-full object-cover object-center"
            style={{
              filter: 'brightness(0.9) contrast(1.1)',
              transform: 'scale(1.05)',
              animation: 'tc-hero-zoom 20s infinite alternate linear',
            }}
          />
          {/* Gradient: solid teal-light on left → transparent on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-light/[0.96] via-teal-light/60 to-transparent" />
        </div>

        {/* ── Main 2-column grid ──────────────────────────────────────── */}
        <div className="relative z-[5] flex-1 grid grid-cols-1 lg:grid-cols-2 gap-16 px-[5%] items-center">

          {/* ── Left column: headline, description, review strip ─────── */}
          <div
            className="py-16"
            style={{ animation: 'tc-hero-reveal-left 1.2s forwards 0.2s ease-out', opacity: 0 }}
          >
            {/* Headline */}
            <h1
              className={cn(
                'font-black leading-[0.82] mb-8 tracking-[-2px] text-navy-deep',
                'text-[clamp(2.2rem,4.5vw,3.8rem)]',
              )}
            >
              Cleaning Service
              <span className="block text-teal italic font-light tracking-[-1px] leading-[1]">
                Now servicing YOUR area!
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-[460px] text-[1.1rem] leading-[1.7] mb-12 text-foreground/80">
              Top Cleaning is your trusted cleaning service provider. We have a team of experienced
              and qualified cleaners who are dedicated to providing the best possible service to our
              customers.
            </p>

            {/* Review strip — signature navy badge with offset teal shadow */}
            <div
              className="inline-flex items-center gap-8 bg-navy-deep text-white px-10 py-5 font-mono text-[0.75rem]"
              style={{ boxShadow: '20px 20px 0px var(--color-teal)' }}
            >
              <div>
                <span className="text-[1rem]" style={{ color: '#f7b500' }}>★★★★★</span>
              </div>
              <div className="border-l border-white/20 pl-8">
                See our 275+ 4.7-Star Reviews on{' '}
                <span className="text-teal ml-1 inline-flex items-center gap-1">
                  {/* Official Google logo colours — brand requirement, not a design token */}
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

          {/* ── Right column: Residential + Commercial panels ────────── */}
          <div
            className="grid grid-cols-1 gap-5"
            style={{
              perspective: '1000px',
              animation: 'tc-hero-reveal-right 1.2s forwards 0.5s ease-out',
              opacity: 0,
            }}
          >

            {/* Panel 1 — Residential */}
            <div
              className={cn(
                'group relative overflow-hidden backdrop-blur-[15px]',
                'bg-teal/[0.07] border border-teal/[0.22]',
                'p-14',
                'transition-all duration-500',
                'hover:-translate-y-2 hover:bg-white/85',
              )}
              style={{ boxShadow: '0 20px 50px rgba(0,40,40,0.12)' }}
            >
              {/* Shimmer sweep on hover */}
              <div className="pointer-events-none absolute top-0 left-[-100%] w-1/2 h-full -skew-x-[25deg] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-[left] duration-700 group-hover:left-[150%]" />

              {/* Offer badge — coral circle, floating */}
              <div
                aria-hidden
                className="absolute top-[-20px] right-[-20px] w-[120px] h-[120px] bg-coral rounded-full flex flex-col items-center justify-center text-white font-mono font-black leading-none border-2 border-white/40 z-[15]"
                style={{
                  transform: 'rotate(12deg)',
                  boxShadow: '0 15px 35px color-mix(in oklch, var(--color-coral) 40%, transparent)',
                  animation: 'tc-badge-float 5s infinite ease-in-out',
                }}
              >
                <small className="text-[0.55rem] uppercase">Save</small>
                <span className="text-[1.8rem]">15%</span>
                <small className="text-[0.55rem] uppercase">First Book</small>
              </div>

              <span className="font-mono text-[0.7rem] uppercase tracking-[3px] text-teal-dark block mb-3">
                Residential
              </span>
              <h3 className="text-[2.2rem] font-extrabold tracking-[-1px] text-foreground mb-8 leading-tight">
                Homes that breathe.
              </h3>
              <Link
                href="/booking"
                className="inline-flex items-center px-10 py-5 bg-teal text-primary-foreground font-bold text-[0.85rem] tracking-[1px] no-underline transition-all duration-500 hover:bg-navy-deep"
                style={{ border: '1px solid transparent' }}
              >
                BOOK IN 60 SECONDS
              </Link>
            </div>

            {/* Panel 2 — Commercial */}
            <div
              className={cn(
                'group relative overflow-hidden backdrop-blur-[15px]',
                'bg-teal/[0.07] border border-teal/[0.22]',
                'p-14',
                'transition-all duration-500',
                'hover:-translate-y-2 hover:bg-white/85',
              )}
              style={{ boxShadow: '0 20px 50px rgba(0,40,40,0.12)' }}
            >
              {/* Shimmer sweep on hover */}
              <div className="pointer-events-none absolute top-0 left-[-100px] w-1/2 h-full -skew-x-[25deg] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-[left] duration-700 group-hover:left-[150%]" />

              <span className="font-mono text-[0.7rem] uppercase tracking-[3px] text-teal-dark block mb-3">
                Commercial
              </span>
              <h3 className="text-[2.2rem] font-extrabold tracking-[-1px] text-foreground mb-8 leading-tight">
                Elevate your workspace.
              </h3>
              <Link
                href="/booking"
                className="inline-flex items-center px-10 py-5 bg-coral text-white font-bold text-[0.85rem] tracking-[1px] no-underline transition-all duration-500 hover:bg-navy-deep"
                style={{ border: '1px solid transparent' }}
              >
                GET A CUSTOM QUOTE
              </Link>
            </div>

          </div>
        </div>

        {/* ── Footer-overlap CTA — lives inside hero, extends into footer ── */}
        {/* The parent section must have z-[10] relative to the footer.       */}
        {/* The footer (bg-navy-obsidian) should have padding-top: 110px      */}
        {/* when this block is used directly above it.                        */}
        <div className="relative z-[10] px-[5%] pt-12 mb-[-75px]">
          <div
            className={cn(
              'flex flex-col md:flex-row items-center justify-between gap-6',
              'bg-white/[0.04] border border-teal/25',
              'px-10 py-9 backdrop-blur-[14px]',
            )}
          >
            <h3 className="text-[1.8rem] font-extrabold text-white m-0">
              Ready for a spotless space?
            </h3>
            <Link
              href="/booking"
              className="flex-shrink-0 inline-flex items-center px-10 py-5 bg-teal text-primary-foreground font-bold font-mono text-[0.8rem] tracking-[1px] no-underline transition-all duration-500 hover:-translate-y-[5px] hover:bg-white hover:text-navy-deep"
              style={{ boxShadow: '0 10px 30px color-mix(in oklch, var(--color-teal) 30%, transparent)' }}
            >
              BOOK ONLINE NOW
            </Link>
          </div>
        </div>

      </section>
    </>
  )
}
