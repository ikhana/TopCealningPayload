// src/blocks/TCWhyTop/Component.client.tsx
// "Why Top Cleaning" — scaffold grid section.
// background1 rhythm: full obsidian #050a12 dark section.
// Ghost outline on "Advantages" heading span, all node/text colours flipped to light.
//
// Justified inline-style exceptions:
//   • .wt-node:hover — parent→child hover, can't use Tailwind group
//   • position: sticky — Tailwind supports it but top value is dynamic
//   • gap: 1px + background as grid separator trick

'use client'

import { TCHeadingStack } from '@/components/ui/TCHeading'
import Link from 'next/link'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcWhyTopSection'
}

const NODES = [
  {
    category: 'Reliability',
    title: 'Satisfied Customers',
    body: 'Join our growing family of satisfied customers who trust us with their homes and offices. We pride ourselves on maintaining a 98% customer satisfaction rate.',
  },
  {
    category: 'Expertise',
    title: 'Qualified Professionals',
    body: 'Our cleaning professionals undergo rigorous training and background checks. We ensure the highest standards of service quality and professionalism.',
  },
  {
    category: 'Security',
    title: 'Fully Insured',
    body: "Rest easy knowing you're fully covered. We carry comprehensive insurance coverage for property damage and liability protection.",
  },
  {
    category: 'Sustainability',
    title: 'Eco-Friendly',
    body: "We're committed to protecting the environment by using green cleaning products that are tough on dirt but gentle on the planet.",
  },
  {
    category: 'Agility',
    title: 'Flexible Scheduling',
    body: 'Book our services at your convenience. We offer flexible scheduling options including evenings and weekends to accommodate your busy lifestyle.',
  },
  {
    category: 'Guarantee',
    title: 'Satisfaction Guaranteed',
    body: "If you're not completely satisfied with our service, we'll return and re-clean the areas you're unhappy with at no additional cost.",
  },
]

const STATS = [
  { value: '4.5K+', label: 'Clients' },
  { value: '98%',   label: 'Retention' },
  { value: '5+',    label: 'Years' },
  { value: '4.9',   label: 'Rating' },
]

export function TCWhyTopSectionClient(_props: Props) {
  return (
    <>
      <style>{`
        /* Node hover on dark bg — teal tint instead of teal-light */
        .wt-node:hover {
          background: rgba(23,176,171,0.12) !important;
        }
        .wt-node:hover .wt-node-title {
          margin-bottom: 20px !important;
        }
        .wt-node:hover .wt-node-content {
          max-height: 200px !important;
          opacity: 1 !important;
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .wt-outer {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .wt-sidebar {
            position: static !important;
            height: auto !important;
          }
          .wt-sidebar-text {
            border-right: none !important;
            padding-right: 0 !important;
          }
        }
        @media (max-width: 768px) {
          .wt-section   { padding: 60px 5% !important; }
          .wt-heading   { font-size: 2.2rem !important; letter-spacing: -1.5px !important; margin-bottom: 20px !important; }
          .wt-node-grid { grid-template-columns: 1fr !important; }
          .wt-stats     { grid-column: span 1 !important; }
          .wt-node      { padding: 25px !important; }
          /* Always reveal node content on touch */
          .wt-node-title   { margin-bottom: 15px !important; }
          .wt-node-content { max-height: 300px !important; opacity: 1 !important; }
        }
      `}</style>

      {/* background1 rhythm: obsidian dark section */}
      <section className="wt-section" style={{ background: '#050a12', padding: '100px 5%' }}>
        <div
          className="wt-outer max-w-[1400px] mx-auto grid gap-[60px]"
          style={{
            gridTemplateColumns: 'clamp(260px, 350px, 30%) 1fr',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '60px',
          }}
        >

          {/* ── Sticky sidebar ──────────────────────────────── */}
          <aside className="wt-sidebar" style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
            {/* Heading — ghost kicker + tight-stack (TCHeadingStack) */}
            <TCHeadingStack
              ghostKicker="Why Top"
              mainLine="Our"
              secondaryLine="Advantages"
              theme="dark"
              size="md"
              className="mb-[30px]"
            />
            <p
              className="wt-sidebar-text text-[0.9rem] leading-[1.7] mb-[40px]"
              style={{
                color: 'rgba(255,255,255,0.55)',
                borderRight: '1px solid rgba(23,176,171,0.4)',
                paddingRight: '30px',
              }}
            >
              Top Cleaning combines expertise, reliability, and attention to detail to exceed
              your expectations in every workspace.
            </p>
            <Link
              href="/booking"
              className="inline-block font-mono font-bold text-[0.85rem] uppercase tracking-[1px] bg-teal text-white no-underline px-8 py-[18px] transition-all duration-300 hover:bg-white hover:text-navy-deep"
            >
              Book Your Cleaning
            </Link>
          </aside>

          {/* ── 2-col node grid ─────────────────────────────── */}
          <div
            className="wt-node-grid grid"
            style={{
              gridTemplateColumns: '1fr 1fr',
              gap: '1px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {NODES.map((node) => (
              <div
                key={node.category}
                className="wt-node relative"
                style={{ background: '#0d1b2e', padding: '50px', transition: 'background 0.3s ease' }}
              >
                {/* Category label */}
                <h5
                  className="font-mono text-teal font-bold uppercase text-[0.7rem] mb-[10px]"
                  style={{ letterSpacing: '2px' }}
                >
                  {node.category}
                </h5>

                {/* Title */}
                <h4
                  className="wt-node-title text-[1.4rem] font-extrabold text-white"
                  style={{ marginBottom: '0', transition: 'margin-bottom 0.3s ease' }}
                >
                  {node.title}
                </h4>

                {/* Expandable description */}
                <div
                  className="wt-node-content overflow-hidden"
                  style={{
                    maxHeight: '0',
                    opacity: '0',
                    transition: 'max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease',
                  }}
                >
                  <p className="text-[0.9rem] leading-[1.6] mt-0" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {node.body}
                  </p>
                </div>
              </div>
            ))}

            {/* ── Stats row (spans 2 cols) ─────────────────── */}
            <div
              className="wt-stats flex justify-around items-center"
              style={{
                gridColumn: 'span 2',
                background: '#000a12',
                padding: '40px',
              }}
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <span
                    className="block font-mono font-bold text-teal"
                    style={{ fontSize: '1.8rem' }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-[0.9rem]" style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</span>
                </div>
              ))}
            </div>

          </div>{/* /grid */}
        </div>
      </section>
    </>
  )
}
