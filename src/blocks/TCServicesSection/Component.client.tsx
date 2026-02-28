// src/blocks/TCServicesSection/Component.client.tsx
// Services section — Crystalline Refraction design (services3.html).
// Auto-fit grid of 6 service cards with image + hover reveal.
// 3D tilt/perspective mousemove effect intentionally omitted for performance.
//
// Justified inline-style exceptions:
//   • refraction-layer gradient — background shorthand with rgba can't be expressed in Tailwind
//   • crystal emitter glow — radial-gradient + absolute sizing
//   • card transition-delay per index — dynamic inline style

'use client'

import { cn } from '@/utilities/cn'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcServicesSection'
}

const SERVICES = [
  {
    badge: 'Custom Quote Available',
    title: 'Residential Cleaning',
    description:
      'Transform your home with premium residential cleaning services tailored to your schedule and preferences.',
    specs: ['Custom cleaning plans', 'Eco-friendly products', 'Trained professionals', 'Satisfaction guarantee'],
    image: '/images/services/residential.jpg',
    href: '/services/residential',
    delay: 0,
  },
  {
    badge: 'Custom Quote Available',
    title: 'Commercial Cleaning',
    description:
      'Professional solutions for businesses that demand excellence, reliability, and compliance.',
    specs: ['Flexible scheduling', 'Industry compliance', 'Commercial grade equipment', 'Liability coverage'],
    image: '/images/services/commercial.jpg',
    href: '/services/commercial',
    delay: 0.08,
  },
  {
    badge: 'Recommended First Visit',
    title: 'Deep Cleaning',
    description:
      'Thorough cleaning that reaches every corner and crevice for a truly fresh, sanitized start.',
    specs: ['Detailed checklist', 'Special equipment', 'Stain treatment', 'Sanitization included'],
    image: '/images/services/deep-cleaning.jpg',
    href: '/services/deep-cleaning',
    delay: 0.16,
  },
  {
    badge: 'Custom Quote Available',
    title: 'Move In / Out Cleaning',
    description:
      'Start fresh or leave spotless with our comprehensive transition cleaning service.',
    specs: ['Deep cleaning included', 'Inspection ready', 'Appliance cleaning', 'Window treatments'],
    image: '/images/services/move-in-out.jpg',
    href: '/services/move-in-out',
    delay: 0.24,
  },
  {
    badge: 'Same Day Available',
    title: 'After Party Cleaning',
    description:
      'Fast, thorough cleanup after events so you can enjoy the memories, not the mess.',
    specs: ['Quick turnaround', 'Stain removal', 'Trash disposal', 'Surface sanitization'],
    image: '/images/services/party-cleaning.jpg',
    href: '/services/after-party',
    delay: 0.32,
  },
  {
    badge: 'Turnaround Specialist',
    title: 'AirBnB Cleaning',
    description:
      'Fast, reliable turnovers between guests to keep your listing spotless and 5-star ready.',
    specs: ['Quick turnaround', 'Linen service', 'Guest-ready checklist', 'Host coordination'],
    image: '/images/services/airbnb-cleaning.jpg',
    href: '/services/airbnb',
    delay: 0.4,
  },
]

// Checkmark SVG for spec items
const Check = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="flex-shrink-0 text-teal"
    aria-hidden
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export function TCServicesSectionClient(_props: Props) {
  const sectionRef = useRef<HTMLElement>(null)

  // Scroll reveal via IntersectionObserver
  useEffect(() => {
    const reveals = sectionRef.current?.querySelectorAll<HTMLElement>('.tc-reveal')
    if (!reveals?.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('tc-reveal-active')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )

    reveals.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .tc-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tc-reveal-active {
          opacity: 1;
          transform: translateY(0);
        }
        /* Refraction layer gradient shifts to teal tint on card hover */
        .tc-prism-card .tc-refraction {
          background: linear-gradient(180deg, transparent 20%, rgba(13,27,46,0.95) 100%);
          transition: background 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .tc-prism-card:hover .tc-refraction {
          background: linear-gradient(180deg, rgba(23,176,171,0.08) 0%, rgba(13,27,46,0.95) 100%);
        }
        /* Specs expand on hover */
        .tc-expanded-specs {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.5s cubic-bezier(0.22, 1, 0.36, 1),
                      padding-top 0.4s ease,
                      margin-bottom 0.4s ease;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 0;
          margin-bottom: 0;
        }
        .tc-prism-card:hover .tc-expanded-specs {
          max-height: 160px;
          padding-top: 16px;
          margin-bottom: 20px;
        }
        /* Quote button hover */
        .tc-quote-btn:hover {
          background-color: white !important;
          color: #0d1b2e !important;
        }
        /* Mobile: always show content */
        @media (max-width: 768px) {
          .tc-prism-content { transform: translateY(0) !important; }
          .tc-prism-desc { opacity: 1 !important; }
          .tc-expanded-specs { max-height: 160px !important; padding-top: 16px !important; margin-bottom: 20px !important; }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="services"
        className="relative overflow-hidden px-[5%] py-[120px]"
        style={{
          background: 'radial-gradient(ellipse at top left, rgba(224,245,244,0.6) 0%, white 60%)',
        }}
      >
        {/* Crystal emitter decorative glow — top right */}
        <div
          aria-hidden
          className="absolute pointer-events-none rounded-full"
          style={{
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(23,176,171,0.05) 0%, transparent 70%)',
            top: '-200px',
            right: '-100px',
            filter: 'blur(40px)',
          }}
        />

        <div className="relative z-[2] max-w-[1400px] mx-auto">

          {/* ── Header ───────────────────────────────────────────── */}
          <header className="tc-reveal mb-[80px] max-w-[700px]">
            <span className="block font-mono text-teal text-[0.8rem] font-bold uppercase tracking-[0.4em] mb-4">
              Our Services
            </span>
            <h2
              className="font-black text-navy-deep leading-[1] mb-5"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', letterSpacing: '-0.04em' }}
            >
              Cleaning solutions built around your needs.
            </h2>
            <p className="text-[1.15rem] text-foreground/60 leading-[1.6]">
              From residential homes to commercial spaces, every service is delivered with
              precision, care, and guaranteed satisfaction.
            </p>
          </header>

          {/* ── Service cards grid ──────────────────────────────── */}
          <div
            className="grid gap-[30px]"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}
          >
            {SERVICES.map((service, i) => (
              <article
                key={service.title}
                className="tc-reveal tc-prism-card relative overflow-hidden cursor-default group"
                style={{
                  height: '520px',
                  background: 'white',
                  border: '1px solid rgba(23,176,171,0.1)',
                  transitionDelay: `${service.delay}s`,
                  animationDelay: `${service.delay}s`,
                }}
              >
                {/* Background image */}
                <div className="absolute inset-0 z-[1]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] cubic-bezier-[0.22,1,0.36,1] group-hover:scale-110"
                    style={{
                      filter: 'saturate(0.8) brightness(0.9)',
                      transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  />
                </div>

                {/* Refraction overlay — gradient shifts to teal tint on hover */}
                <div
                  className="tc-refraction absolute inset-0 z-[2] flex flex-col justify-end p-10"
                >
                  {/* Content block — always visible, desc + specs reveal on hover */}
                  <div
                    className="tc-prism-content relative z-[3] text-white"
                  >
                    {/* Badge */}
                    <span
                      className="inline-block font-mono text-[0.65rem] font-bold uppercase tracking-[1px] px-3 py-[6px] mb-4"
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'var(--color-teal-light)',
                      }}
                    >
                      {service.badge}
                    </span>

                    {/* Title */}
                    <h4 className="text-[1.8rem] font-extrabold mb-[15px] tracking-[-0.5px]">
                      {service.title}
                    </h4>

                    {/* Description — fades in on hover */}
                    <p
                      className="tc-prism-desc text-[0.95rem] leading-[1.6] mb-[25px] opacity-0 transition-opacity duration-[400ms]"
                      style={{ transitionDelay: '0.1s', color: 'rgba(255,255,255,0.85)' }}
                    >
                      {service.description}
                    </p>

                    {/* Specs — expands on hover */}
                    <div className="tc-expanded-specs">
                      <ul
                        className="list-none grid gap-3 mb-0"
                        style={{ gridTemplateColumns: '1fr 1fr' }}
                      >
                        {service.specs.map((spec) => (
                          <li
                            key={spec}
                            className="font-mono text-[0.7rem] flex items-center gap-2"
                            style={{ color: 'rgba(255,255,255,0.9)' }}
                          >
                            <Check />
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions row */}
                    <div className="flex items-center gap-4">
                      <Link
                        href={service.href}
                        className={cn(
                          'flex items-center gap-2 font-mono text-[0.75rem] font-bold uppercase tracking-[1px]',
                          'text-white no-underline transition-colors duration-200',
                          'hover:text-teal',
                        )}
                      >
                        Learn More
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </Link>

                      <Link
                        href="/booking"
                        className="tc-quote-btn bg-teal font-mono text-[0.7rem] font-bold uppercase tracking-[1px] text-white no-underline px-5 py-3 transition-all duration-200"
                      >
                        Get a Quote
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* ── Footer CTA ───────────────────────────────────────── */}
          <div
            className="tc-reveal mt-[80px] text-center px-[60px] py-[60px]"
            style={{
              background: 'white',
              border: '1px solid rgba(23,176,171,0.15)',
              boxShadow: '0 4px 30px rgba(13,27,46,0.08)',
            }}
          >
            <h3 className="text-[2rem] font-extrabold text-navy-deep mb-[30px] leading-tight">
              Ready to experience exceptional cleaning?
            </h3>
            <Link
              href="/booking"
              className={cn(
                'inline-block font-mono font-bold text-[0.85rem] uppercase tracking-[1px]',
                'bg-teal text-white no-underline px-16 py-6',
                'transition-all duration-500',
                'hover:-translate-y-[5px] hover:bg-navy-deep hover:text-white',
              )}
              style={{ boxShadow: '0 10px 30px rgba(23,176,171,0.3)' }}
            >
              Get Your Instant Estimate
            </Link>
          </div>

        </div>
      </section>

      {/* Description opacity driven by parent hover — can't use Tailwind group-hover on opacity here */}
      <style>{`
        .tc-prism-card:hover .tc-prism-desc {
          opacity: 1;
        }
      `}</style>
    </>
  )
}
