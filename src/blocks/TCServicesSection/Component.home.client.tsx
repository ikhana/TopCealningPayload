// src/blocks/TCServicesSection/Component.home.client.tsx
// Home page variant — Crystalline hover-reveal cards.
// Design reference: design/services3.html

'use client'

import { cn } from '@/utilities/cn'
import { TCButton } from '@/components/ui/TCButton'
import { TCHeadingStack } from '@/components/ui/TCHeading'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

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
    badge: 'Specialized',
    title: 'Post Construction Cleaning',
    description:
      'Detailed cleanup after renovations or new builds — dust, debris, and residue gone for good.',
    specs: ['Dust + debris removal', 'Window + frame detail', 'Fixture polishing', 'Paint splatter cleanup'],
    image: '/images/services/post-construction-cleaning.jpg',
    href: '/services/post-construction',
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

const Check = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    className="flex-shrink-0 text-teal" aria-hidden>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export function TCServicesSectionHome() {
  const sectionRef = useRef<HTMLElement>(null)

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
        @keyframes tc-svc-streak {
          0%   { transform: rotate(-35deg) translateY(-200px) translateX(-100%); }
          100% { transform: rotate(-35deg) translateY(-200px) translateX(200%); }
        }
        .tc-reveal { opacity:0; transform:translateY(30px); transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1); }
        .tc-reveal-active { opacity:1; transform:translateY(0); }
        .tc-prism-card .tc-refraction { background:linear-gradient(180deg,transparent 20%,rgba(13,27,46,.95) 100%); transition:background .6s cubic-bezier(.22,1,.36,1); }
        .tc-prism-card:hover .tc-refraction { background:linear-gradient(180deg,rgba(23,176,171,.08) 0%,rgba(13,27,46,.95) 100%); }
        .tc-expanded-specs { max-height:0; overflow:hidden; transition:max-height .5s cubic-bezier(.22,1,.36,1),padding-top .4s ease,margin-bottom .4s ease; border-top:1px solid rgba(255,255,255,.1); padding-top:0; margin-bottom:0; }
        .tc-prism-card:hover .tc-expanded-specs { max-height:160px; padding-top:16px; margin-bottom:20px; }
        .tc-quote-btn:hover { background-color:white !important; color:#0d1b2e !important; }
        .tc-prism-card .tc-svc-badge { opacity:0; transition:opacity .4s ease; }
        .tc-prism-card:hover .tc-svc-badge { opacity:1; }
        .tc-prism-card:hover .tc-prism-desc { opacity:1; }
        @media (max-width:768px) {
          .tc-svc-section { padding-top:60px !important; padding-bottom:60px !important; }
          .tc-svc-header  { margin-bottom:40px !important; }
          .tc-svc-card    { height:420px !important; }
          .tc-svc-footer  { margin-top:40px !important; padding:40px 30px !important; }
        }
      `}</style>

      {/* background1 rhythm: white bg + teal line grid + sweeping light streak */}
      <section
        ref={sectionRef}
        id="services"
        className="tc-svc-section relative overflow-hidden px-[5%] py-[120px]"
        style={{ background: '#ffffff' }}
      >
        {/* Teal line grid overlay */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(23,176,171,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(23,176,171,0.05) 1px, transparent 1px)',
            backgroundSize: '100px 100px',
          }}
        />
        {/* Sweeping light streak animation */}
        <div
          aria-hidden
          className="absolute pointer-events-none z-0 tc-svc-streak"
          style={{
            width: '150%',
            height: '80px',
            background: 'linear-gradient(90deg, transparent, rgba(23,176,171,0.08), transparent)',
            transform: 'rotate(-35deg) translateY(-200px)',
            top: '0',
            left: '-25%',
            animation: 'tc-svc-streak 10s infinite linear',
          }}
        />

        <div className="relative z-[2] max-w-[1400px] mx-auto">

          {/* Header */}
          <header className="tc-reveal tc-svc-header mb-[80px] max-w-[700px]">
            {/* Heading — ghost kicker + tight-stack (TCHeadingStack) */}
            <TCHeadingStack
              ghostKicker="Our Services"
              mainLine="Cleaning Solutions"
              secondaryLine="Built Around Your Needs."
              theme="light"
              size="lg"
              className="mb-5"
            />
            <p className="text-[1.15rem] text-[#2a4365]/60 leading-[1.6]">
              From residential homes to commercial spaces, every service is delivered with
              precision, care, and guaranteed satisfaction.
            </p>
          </header>

          {/* Cards grid */}
          <div className="grid gap-[30px]"
            style={{ gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))' }}>
            {SERVICES.map((service) => (
              <article key={service.title}
                className="tc-reveal tc-prism-card tc-svc-card relative overflow-hidden cursor-default group"
                style={{ height:'520px', background:'white', border:'1px solid rgba(23,176,171,.1)', transitionDelay:`${service.delay}s` }}>

                <div className="absolute inset-0 z-[1]">
                  <img src={service.image} alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110"
                    style={{ filter:'saturate(.8) brightness(.9)', transition:'transform 1.2s cubic-bezier(.22,1,.36,1)' }} />
                </div>

                <div className="tc-refraction absolute inset-0 z-[2] flex flex-col justify-end p-10">
                  <div className="tc-prism-content relative z-[3] text-white">
                    <span className="tc-svc-badge inline-block font-mono text-[0.65rem] font-bold uppercase tracking-[1px] px-3 py-[6px] mb-4"
                      style={{ background:'rgba(255,255,255,.15)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,.2)', color:'var(--color-teal-light)' }}>
                      {service.badge}
                    </span>
                    <h4 className="text-[1.8rem] font-extrabold mb-[15px] tracking-[-0.5px]">{service.title}</h4>
                    <p className="tc-prism-desc text-[0.95rem] leading-[1.6] mb-[25px] opacity-0 transition-opacity duration-[400ms]"
                      style={{ transitionDelay:'.1s', color:'rgba(255,255,255,.85)' }}>
                      {service.description}
                    </p>
                    <div className="tc-expanded-specs">
                      <ul className="list-none grid gap-3 mb-0" style={{ gridTemplateColumns:'1fr 1fr' }}>
                        {service.specs.map((spec) => (
                          <li key={spec} className="font-mono text-[0.7rem] flex items-center gap-2"
                            style={{ color:'rgba(255,255,255,.9)' }}>
                            <Check />{spec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center gap-7">
                      <TCButton variant="inline" size="sm" href={service.href}>See What&apos;s Included</TCButton>
                      <TCButton variant="primary" size="sm" href="/booking">Get a Quote</TCButton>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="tc-reveal tc-svc-footer mt-[80px] text-center px-[60px] py-[60px]"
            style={{ background:'white', border:'1px solid rgba(23,176,171,.15)', boxShadow:'0 4px 30px rgba(13,27,46,.08)' }}>
            <h3 className="text-[2rem] font-extrabold text-navy-deep mb-[30px] leading-tight">
              Ready to experience exceptional cleaning?
            </h3>
            <TCButton variant="primary" href="/booking">Get Your Instant Estimate</TCButton>
          </div>

        </div>
      </section>
    </>
  )
}
