// src/blocks/TCWhyTop/Component.client.tsx
// "Why Top Cleaning" — scaffold grid section (whytop.html).
// Sticky sidebar + 2×3 hover-expand advantage nodes + navy stats row.
//
// Justified inline-style exceptions:
//   • .wt-node:hover .wt-node-content — parent→child hover, can't use Tailwind group
//   • .wt-node:hover h4 — margin-bottom driven by parent hover
//   • position: sticky — Tailwind supports it but top value is dynamic
//   • gap: 1px + background as grid separator trick — cleaner as CSS

'use client'

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
        /* Node hover: bg + h4 margin + content reveal */
        .wt-node:hover {
          background: #e0f5f4 !important;
        }
        .wt-node:hover .wt-node-title {
          margin-bottom: 20px !important;
        }
        .wt-node:hover .wt-node-content {
          max-height: 200px !important;
          opacity: 1 !important;
        }
      `}</style>

      <section className="bg-white" style={{ padding: '100px 5%' }}>
        <div
          className="max-w-[1400px] mx-auto grid gap-[60px]"
          style={{
            gridTemplateColumns: 'clamp(260px, 350px, 30%) 1fr',
            borderTop: '1px solid rgba(13,27,46,0.1)',
            paddingTop: '60px',
          }}
        >

          {/* ── Sticky sidebar ──────────────────────────────── */}
          <aside style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
            <h2
              className="font-mono font-bold text-navy-deep leading-[1] mb-[30px]"
              style={{ fontSize: '3rem', letterSpacing: '-2px' }}
            >
              Our<br />
              <span className="text-teal">Advantages</span>
            </h2>
            <p
              className="text-[0.9rem] leading-[1.7] text-foreground/60 mb-[40px]"
              style={{
                borderRight: '1px solid oklch(var(--color-teal))',
                paddingRight: '30px',
              }}
            >
              Top Cleaning combines expertise, reliability, and attention to detail to exceed
              your expectations in every workspace.
            </p>
            <Link
              href="/booking"
              className="inline-block font-mono font-bold text-[0.85rem] uppercase tracking-[1px] bg-teal text-white no-underline px-8 py-[18px] transition-all duration-300 hover:bg-navy-deep"
            >
              Book Your Cleaning
            </Link>
          </aside>

          {/* ── 2-col node grid ─────────────────────────────── */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: '1fr 1fr',
              gap: '1px',
              background: 'rgba(13,27,46,0.1)',
              border: '1px solid rgba(13,27,46,0.1)',
            }}
          >
            {NODES.map((node) => (
              <div
                key={node.category}
                className="wt-node bg-white relative"
                style={{ padding: '50px', transition: 'background 0.3s ease' }}
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
                  className="wt-node-title text-[1.4rem] font-extrabold text-navy-deep"
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
                  <p className="text-[0.9rem] leading-[1.6] text-foreground/80 mt-0">
                    {node.body}
                  </p>
                </div>
              </div>
            ))}

            {/* ── Stats row (spans 2 cols) ─────────────────── */}
            <div
              className="flex justify-around items-center text-white"
              style={{
                gridColumn: 'span 2',
                background: '#0d1b2e',
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
                  <span className="text-[0.9rem] text-white/70">{stat.label}</span>
                </div>
              ))}
            </div>

          </div>{/* /grid */}
        </div>
      </section>
    </>
  )
}
