// src/blocks/TCServiceCommitment/Component.client.tsx
// Service Commitment block — mirrors the three sections appended after TCAboutSection
// in design/hero5.html:
//   1. Customized Maintenance Programs (diagonal Z-flow + infinite ticker)
//   2. Guarantee Plate (dark navy, 2-col, rotating seal, photo)
//   3. Discount / CTA Bar (teal, diagonal clip-path)
//
// Justified inline-style exceptions:
//   • CSS keyframes (ticker + seal rotation) — must live in <style> tag
//   • mask-image — needs -webkit- prefix, not expressible in Tailwind
//   • clip-path polygon — arbitrary value would be very long; cleaner as inline style
//   • box-shadow with CSS custom properties — multi-value, needs var()
//   • background-image with url() — Next.js Image not appropriate for decorative bg

'use client'

import { cn } from '@/utilities/cn'
import Link from 'next/link'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcServiceCommitment'
}

const TICKER_ITEMS = [
  'Service frequency (daily, weekly, monthly, etc.)',
  'Type of cleaning required (deep cleaning, disinfection, etc.)',
  'Focus areas (offices, homes, hospitals, etc.)',
  'Client preferences and budget',
]

export function TCServiceCommitmentClient(_props: Props) {
  return (
    <>
      {/* Block-scoped keyframes */}
      <style>{`
        @keyframes tc-ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .tc-ticker-track {
          animation: tc-ticker 18s linear infinite;
        }
        .tc-ticker-wrap:hover .tc-ticker-track {
          animation-play-state: paused;
        }
        @keyframes tc-rotate-seal {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .tc-rotate-seal {
          animation: tc-rotate-seal 20s linear infinite;
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1 — CUSTOMIZED MAINTENANCE PROGRAMS
          Diagonal Z-flow: header top-left → ticker full-width → closing bottom-right
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#f8fafc' }} className="py-[100px] px-[5%]">
        <div className="max-w-[1400px] mx-auto flex flex-col">

          {/* Row 1 — Header anchored top-left (~55% wide on desktop) */}
          <div className="w-full lg:max-w-[55%] pb-[60px]">
            <h3
              className="font-black text-navy-deep leading-[1.1] tracking-[-1px] mb-[18px]"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}
            >
              Customized Maintenance Programs
            </h3>
            <p className="text-[1.05rem] leading-[1.75] text-foreground/60">
              Customized Maintenance Programs are cleaning and maintenance plans designed to meet
              the specific needs of each client. Instead of offering a standard service, these
              programs are created based on factors such as:
            </p>
          </div>

          {/* Row 2 — Infinite horizontal ticker */}
          <div
            className="tc-ticker-wrap overflow-hidden w-full relative"
            style={{
              WebkitMaskImage:
                'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
              maskImage:
                'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)',
            }}
          >
            <div className="tc-ticker-track flex gap-4" style={{ width: 'max-content' }}>
              {/* Items duplicated (×2) so translateX(-50%) creates a seamless loop */}
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-center gap-3 flex-shrink-0',
                    'font-mono text-[0.85rem] font-semibold text-navy-deep',
                    'bg-white border border-teal/20 px-5 py-[14px]',
                    'whitespace-nowrap cursor-default',
                    'transition-[box-shadow,transform] duration-300',
                    'hover:-translate-x-[2px] hover:-translate-y-[2px]',
                    'hover:[box-shadow:8px_8px_0px_var(--color-teal)]',
                  )}
                  style={{ boxShadow: '4px 4px 0 var(--color-teal-light)' }}
                >
                  <svg
                    className="flex-shrink-0 text-teal"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Row 3 — Closing statement anchored bottom-right */}
          <div className="mt-[50px] ml-auto lg:max-w-[46%] md:max-w-[70%] max-w-full border-l-[3px] border-teal pl-6">
            <p className="text-[1.05rem] leading-[1.8] text-foreground/65 italic">
              These programs ensure that each client receives more efficient and effective cleaning
              solutions, guaranteeing an optimal service tailored to their needs.
            </p>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2 — GUARANTEE PLATE
          Dark navy, 2-column: text + photo. Rotating circular seal.
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden text-white"
        style={{ margin: '0 5%', background: 'var(--color-navy-deep)' }}
      >
        <div
          className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] relative"
          style={{ minHeight: '500px' }}
        >
          {/* Left — text content */}
          <div className="relative z-[2] py-[100px] lg:pr-10 px-[6%]">

            {/* Rotating seal (decorative, positioned relative to content column) */}
            <div
              className="tc-rotate-seal absolute flex items-center justify-center text-center font-mono text-[0.7rem] font-bold uppercase rounded-full border-2 border-teal"
              style={{
                width: '140px',
                height: '140px',
                top: '-40px',
                right: '80px',
                background: 'var(--color-navy-deep)',
                boxShadow: '0 0 30px rgba(23,176,171,0.4)',
                lineHeight: '1.4',
                padding: '20px',
              }}
            >
              Top Quality<br />Guaranteed<br />★ ★ ★
            </div>

            {/* Kicker */}
            <span className="block font-mono text-teal font-bold uppercase tracking-[0.3em] text-[0.8rem] mb-4">
              The Promise
            </span>

            {/* Heading */}
            <h3 className="font-black leading-[1.1] tracking-[-1px] mb-5 text-[3rem]">
              Satisfaction<br />Guaranteed.
            </h3>

            {/* Body */}
            <p className="text-[1.1rem] leading-[1.7] mb-10 max-w-[500px] opacity-80">
              We are committed to delivering high-quality cleaning and disinfection services. If
              results don&apos;t meet our standard of excellence, we make it right — no questions
              asked.
            </p>

            {/* Stats row */}
            <div className="flex gap-10">
              <div>
                <h5 className="font-mono text-teal text-[0.85rem] mb-[5px]">Reliability</h5>
                <p className="text-[0.85rem] opacity-60">Always on time, every time.</p>
              </div>
              <div>
                <h5 className="font-mono text-teal text-[0.85rem] mb-[5px]">Professionalism</h5>
                <p className="text-[0.85rem] opacity-60">Trained, vetted technicians.</p>
              </div>
            </div>
          </div>

          {/* Right — background photo with navy→transparent gradient overlay */}
          <div
            className="relative lg:h-auto h-[300px]"
            style={{
              backgroundImage: "url('/images/cleaning/about-cleaning.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, var(--color-navy-deep) 0%, transparent 100%)',
              }}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3 — DISCOUNT / CTA BAR
          Teal, diagonal clip-path. Heading + body left, button right.
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="bg-teal text-white"
        style={{
          margin: '0 5%',
          clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)',
        }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-[30px] lg:gap-0 px-[5%] py-[60px] text-center lg:text-left">

          {/* Info */}
          <div>
            <h4 className="font-mono text-[1.5rem] font-extrabold leading-[1.2] mb-3">
              Discounts for Long-Term Contracts
            </h4>
            <p className="text-[1rem] leading-[1.7] max-w-[620px] opacity-90">
              We value long-term partnerships, which is why we offer exclusive discounts for clients
              who commit to recurring cleaning services. Our long-term contracts provide
              cost-effective solutions while ensuring consistent, high-quality maintenance tailored
              to your needs.
            </p>
          </div>

          {/* CTA button */}
          <div className="flex-shrink-0 lg:ml-10">
            <Link
              href="/services"
              className={cn(
                'inline-block font-mono font-bold text-[0.85rem] tracking-[1px]',
                'bg-navy-deep no-underline text-white px-9 py-[18px]',
                'transition-all duration-500',
                'hover:-translate-y-[5px] hover:bg-white hover:text-navy-deep',
              )}
            >
              Explore our services
            </Link>
          </div>

        </div>
      </section>
    </>
  )
}
