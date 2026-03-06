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
import { TCButton } from '@/components/ui/TCButton'
import { TCHeadingStack } from '@/components/ui/TCHeading'
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

        /* ── Service Commitment responsive ── */
        @media (max-width: 1024px) {
          .tc-commit-g2 { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .tc-commit-s1      { padding-top: 60px !important; }
          .tc-commit-wrapper { padding: 30px !important; }
          .tc-commit-s2      { overflow: hidden !important; }
          .tc-commit-g2      { min-height: auto !important; }
          .tc-commit-text2   { padding: 50px 5% !important; padding-right: 5% !important; }

          .tc-commit-s3      { clip-path: none !important; }
          .tc-commit-cta     { padding: 40px 5% !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1 — CUSTOMIZED MAINTENANCE PROGRAMS
          Diagonal Z-flow: header top-left → ticker full-width → closing bottom-right
      ══════════════════════════════════════════════════════════════ */}
      {/* background1 rhythm: ceramic continuation flowing from TCAboutSection */}
      <section className="tc-commit-s1 bg-[#f4f7f6] pt-[100px] pb-0 px-[5%]" style={{ position: 'relative', zIndex: 2 }}>
        <div
          className="tc-commit-wrapper max-w-[1400px] mx-auto flex flex-col bg-white"
          style={{
            border: '1px solid rgba(13,27,46,0.08)',
            padding: '60px',
          }}
        >

          {/* Row 1 — Header anchored top-left (~55% wide on desktop) */}
          <div className="w-full lg:max-w-[55%] pb-[60px]">
            {/* Heading — ghost kicker + tight-stack (TCHeadingStack) */}
            <TCHeadingStack
              ghostKicker="Maintenance"
              mainLine="Customized"
              secondaryLine="Programs"
              level="h3"
              theme="light"
              size="md"
              className="mb-[18px]"
            />
            <p className="text-[1.05rem] leading-[1.75] text-[#2a4365]/60">
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
          <div className="mt-[50px] ml-auto lg:max-w-[46%] md:max-w-[70%] max-w-full">
            <p className="text-[1.05rem] leading-[1.8] text-[#2a4365]/65 italic">
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
        className="tc-commit-s2 relative text-white mx-[5%]"
        style={{
          background: 'var(--color-navy-deep)',
          marginTop: '-1px',
          overflow: 'visible',
          position: 'relative',
        }}
      >

        <div
          className="tc-commit-g2 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] relative"
          style={{ minHeight: '500px' }}
        >
          {/* Left — text content */}
          <div className="tc-commit-text2 relative z-[2] py-[100px] lg:pr-10 px-[6%]">

            {/* Heading — ghost kicker + tight-stack (TCHeadingStack) */}
            <TCHeadingStack
              ghostKicker="The Promise"
              mainLine="Satisfaction"
              secondaryLine="Guaranteed."
              level="h3"
              theme="dark"
              size="lg"
              className="mb-5"
            />

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
        className="tc-commit-s3 bg-teal text-white mx-[5%]"
        style={{
          marginTop: '-1px',
          clipPath: 'polygon(0 0, 100% 0, 97% 100%, 3% 100%)',
        }}
      >
        <div className="tc-commit-cta flex flex-col lg:flex-row items-center justify-between gap-[30px] lg:gap-0 px-[5%] py-[60px] text-center lg:text-left">

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
            <TCButton variant="primary" href="/services">Explore our services</TCButton>
          </div>

        </div>
      </section>
    </>
  )
}
