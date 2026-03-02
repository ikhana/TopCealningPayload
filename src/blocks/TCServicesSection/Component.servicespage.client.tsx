// src/blocks/TCServicesSection/Component.servicespage.client.tsx
// Services page variant — filterable card grid with search bar.
// Design reference: design/servicespage.html
//
// Layout:
//   • Control bar (sticky): filter tabs LEFT + search RIGHT
//     margin-top: -56px so it overlaps the bottom of the hero blade above
//   • Card grid: image / category / title / subtitle / desc / meta / dual buttons
//   • Live filter + search — no page reload

'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const SERVICES = [
  {
    badge: 'Popular',
    category: 'Residential',
    title: 'Regular Cleaning',
    subtitle: 'Maintain a consistently clean space',
    description:
      'Our standard cleaning service keeps your space immaculate with regular maintenance and attention to detail. Perfect for busy households.',
    specs: ['Custom cleaning plans', 'Eco-friendly products', 'Trained professionals', 'Satisfaction guarantee'],
    image: '/images/services/residential.jpg',
    href: '/services/residential',
    meta: { label1: 'Starting From', value1: 'Custom / visit', label2: 'Schedule', value2: 'Flexible' },
  },
  {
    badge: '',
    category: 'Specialized',
    title: 'Deep Cleaning',
    subtitle: 'Thorough cleaning for a fresh start',
    description:
      'Comprehensive deep cleaning that covers every corner and detail. We tackle the grime that regular cleanings miss.',
    specs: ['Detailed checklist', 'Special equipment', 'Stain treatment', 'Sanitization included'],
    image: '/images/services/deep-cleaning.jpg',
    href: '/services/deep-cleaning',
    meta: { label1: 'Starting From', value1: 'Custom / session', label2: 'Schedule', value2: 'On-Demand' },
  },
  {
    badge: '',
    category: 'Specialized',
    title: 'After Party Cleaning',
    subtitle: 'Post-event cleanup specialists',
    description:
      'Swift and thorough cleanup after events so you can enjoy the memories, not the mess.',
    specs: ['Quick turnaround', 'Stain removal', 'Trash disposal', 'Surface sanitization'],
    image: '/images/services/party-cleaning.jpg',
    href: '/services/after-party',
    meta: { label1: 'Starting From', value1: 'Custom / event', label2: 'Availability', value2: 'Weekend Priority' },
  },
  {
    badge: '',
    category: 'Residential',
    title: 'Move In / Out Cleaning',
    subtitle: 'Fresh start for your new space',
    description:
      'Detailed cleaning to prepare your space for move-in or ensure your deposit return when moving out.',
    specs: ['Deep cleaning included', 'Inspection ready', 'Appliance cleaning', 'Window treatments'],
    image: '/images/services/move-in-out.jpg',
    href: '/services/move-in-out',
    meta: { label1: 'Starting From', value1: 'Custom / service', label2: 'Intensity', value2: 'Maximum' },
  },
  {
    badge: 'Popular',
    category: 'Commercial',
    title: 'AirBnB Cleaning',
    subtitle: 'Professional turnover service',
    description:
      'High-speed, high-standard turnovers between guests to keep your listing spotless and 5-star ready.',
    specs: ['Quick turnaround', 'Linen service', 'Guest-ready checklist', 'Host coordination'],
    image: '/images/services/airbnb-cleaning.jpg',
    href: '/services/airbnb',
    meta: { label1: 'Starting From', value1: 'Custom / turnover', label2: 'Uptime', value2: '7 Days / Week' },
  },
  {
    badge: '',
    category: 'Residential',
    title: 'Laundry & Ironing',
    subtitle: 'Professional garment care',
    description:
      'Comprehensive laundry services including washing, drying, folding, and professional ironing for all fabric types.',
    specs: ['All fabric types', 'Folding included', 'Professional ironing', '24-48h turnaround'],
    image: '/images/services/laundry.jpg',
    href: '/services/laundry',
    meta: { label1: 'Starting From', value1: 'Custom / load', label2: 'Turnaround', value2: '24-48 Hours' },
  },
  {
    badge: '',
    category: 'Commercial',
    title: 'Commercial Cleaning',
    subtitle: 'Excellence for your business',
    description:
      'Professional solutions for businesses that demand reliability and compliance, scheduled around your operations.',
    specs: ['Flexible scheduling', 'Industry compliance', 'Commercial grade equipment', 'Liability coverage'],
    image: '/images/services/commercial.jpg',
    href: '/services/commercial',
    meta: { label1: 'Starting From', value1: 'Custom / visit', label2: 'Schedule', value2: 'Flexible' },
  },
  {
    badge: '',
    category: 'Specialized',
    title: 'Organize Closets & Cabinets',
    subtitle: 'Professional organization solutions',
    description:
      'Transform cluttered spaces into organized, functional storage areas with systems that keep you tidy long-term.',
    specs: ['Custom systems', 'Label & sort', 'Space optimization', 'Follow-up tips'],
    image: '/images/services/organization.jpg',
    href: '/services/organizing',
    meta: { label1: 'Starting From', value1: 'Custom / hour', label2: 'Type', value2: 'Systematic' },
  },
]

const FILTERS = ['All', 'Residential', 'Commercial', 'Specialized'] as const
type Filter = (typeof FILTERS)[number]

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

export function TCServicesSectionServicesPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All')
  const [search, setSearch]             = useState('')
  const gridRef = useRef<HTMLDivElement>(null)

  const filtered = SERVICES.filter((s) => {
    const matchesFilter  = activeFilter === 'All' || s.category === activeFilter
    const q              = search.toLowerCase()
    const matchesSearch  =
      q === '' ||
      s.title.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    return matchesFilter && matchesSearch
  })

  // Scroll-reveal on cards
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll<HTMLElement>('.sp-card')
    if (!cards?.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('sp-reveal-in'), idx * 70)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08 },
    )
    cards.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [filtered.length])

  return (
    <>
      <style>{`
        /* ── Reveal ── */
        .sp-card { opacity:0; transform:translateY(20px); transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1); }
        .sp-card.sp-reveal-in { opacity:1; transform:translateY(0); }

        /* ── Control bar ── */
        .sp-controls {
          display:flex; align-items:center; justify-content:space-between; gap:20px;
          padding:18px 4%; background:white;
          border-bottom:1px solid rgba(13,27,46,.08);
          position:sticky; top:0; z-index:50;
          margin-top:-56px;
        }

        /* ── Filter tabs ── */
        .sp-filters { display:flex; gap:6px; background:#f5f2eb; padding:5px; border-radius:5px; }
        .sp-filter-btn {
          padding:9px 18px; border:none; background:transparent;
          font-family:var(--font-mono,monospace); font-size:0.7rem; font-weight:700;
          text-transform:uppercase; letter-spacing:1px; color:#5a6a84;
          cursor:pointer; border-radius:3px; transition:all .3s ease; white-space:nowrap;
        }
        .sp-filter-btn.sp-active { background:white; color:#17b0ab; box-shadow:0 2px 8px rgba(0,0,0,.06); }

        /* ── Search ── */
        .sp-search-wrap { position:relative; flex:1; max-width:340px; }
        .sp-search-wrap svg { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:#5a6a84; pointer-events:none; }
        .sp-search-input {
          width:100%; padding:10px 14px 10px 38px;
          border:1px solid rgba(13,27,46,.08); background:#f5f2eb;
          font-family:var(--font-mono,monospace); font-size:0.78rem;
          outline:none; border-radius:4px; transition:all .3s ease; color:#1a2840;
        }
        .sp-search-input::placeholder { color:#5a6a84; }
        .sp-search-input:focus { background:white; border-color:#17b0ab; box-shadow:0 0 0 3px rgba(23,176,171,.1); }

        /* ── Grid ── */
        .sp-grid {
          display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
          gap:1.5px; background:rgba(13,27,46,.08); border:1px solid rgba(13,27,46,.08);
        }

        /* ── Card ── */
        .sp-card {
          background:white; display:flex; flex-direction:column;
          min-height:560px; position:relative;
          transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1),box-shadow .4s ease;
        }
        .sp-card.sp-reveal-in:hover { z-index:2; transform:translateY(-5px); box-shadow:0 30px 60px rgba(13,27,46,.1); }
        .sp-card-img { width:100%; height:200px; overflow:hidden; position:relative; background:#eee; flex-shrink:0; }
        .sp-card-img img { width:100%; height:100%; object-fit:cover; transition:transform .8s ease; }
        .sp-card.sp-reveal-in:hover .sp-card-img img { transform:scale(1.07); }
        .sp-card-badge {
          position:absolute; top:14px; right:14px;
          background:#0d1b2e; color:white; padding:4px 10px;
          font-family:var(--font-mono,monospace); font-size:0.58rem; font-weight:700;
          text-transform:uppercase; letter-spacing:1px; z-index:3;
        }
        .sp-card-body { padding:28px 30px; display:flex; flex-direction:column; flex:1; }
        .sp-card-category {
          font-family:var(--font-mono,monospace); font-size:0.62rem; color:#17b0ab;
          font-weight:700; text-transform:uppercase; letter-spacing:2px;
          margin-bottom:8px; display:block;
        }
        .sp-card-title { font-size:1.4rem; font-weight:800; color:#0d1b2e; letter-spacing:-0.5px; margin-bottom:6px; line-height:1.2; }
        .sp-card-subtitle { font-size:0.82rem; font-weight:600; color:#5a6a84; margin-bottom:14px; display:block; }
        .sp-card-desc { font-size:0.88rem; line-height:1.65; color:#5a6a84; flex:1; margin-bottom:24px; }
        .sp-card-meta {
          border-top:1px solid rgba(13,27,46,.08); padding-top:20px; margin-bottom:22px;
          display:flex; justify-content:space-between; align-items:center;
        }
        .sp-meta-label { font-family:var(--font-mono,monospace); font-size:0.58rem; text-transform:uppercase; color:#5a6a84; margin-bottom:3px; display:block; }
        .sp-meta-value { font-weight:700; font-size:0.85rem; color:#0d1b2e; }
        .sp-card-actions { display:grid; grid-template-columns:1fr 1.2fr; gap:12px; }
        .sp-btn-secondary {
          font-family:var(--font-mono,monospace); font-size:0.68rem; font-weight:700;
          text-transform:uppercase; color:#0d1b2e; padding:13px;
          border:1px solid rgba(13,27,46,.12); text-align:center; text-decoration:none;
          transition:all .4s ease; letter-spacing:0.5px; display:block;
        }
        .sp-btn-secondary:hover { border-color:#0d1b2e; background:#0d1b2e; color:white; }
        .sp-btn-primary {
          font-family:var(--font-mono,monospace); font-size:0.68rem; font-weight:700;
          text-transform:uppercase; background:#17b0ab; color:white; padding:13px;
          text-align:center; text-decoration:none; transition:all .4s ease;
          letter-spacing:0.5px; display:block;
        }
        .sp-btn-primary:hover { background:#0d1b2e; transform:translateY(-2px); box-shadow:0 10px 20px rgba(13,27,46,.2); }

        /* ── Empty state ── */
        .sp-empty { grid-column:1/-1; text-align:center; padding:80px 20px; font-family:var(--font-mono,monospace); color:#5a6a84; font-size:0.85rem; }

        /* ── Responsive ── */
        @media (max-width:1024px) {
          .sp-controls { flex-direction:column; align-items:flex-start; margin-top:-40px; }
          .sp-search-wrap { max-width:100%; width:100%; }
        }
        @media (max-width:600px) {
          .sp-grid { grid-template-columns:1fr; }
          .sp-filters { overflow-x:auto; width:100%; }
          .sp-controls { margin-top:0; position:static; }
        }
      `}</style>

      {/* ── Control bar: filter tabs LEFT + search RIGHT ── */}
      <div className="sp-controls">
        <div className="sp-filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`sp-filter-btn${activeFilter === f ? ' sp-active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f === 'All' ? 'All Services' : f}
            </button>
          ))}
        </div>

        <div className="sp-search-wrap">
          <SearchIcon />
          <input
            type="text"
            className="sp-search-input"
            placeholder="Search services (e.g. Deep Cleaning)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Card grid ── */}
      <div className="px-[4%] py-[60px]" style={{ background: '#fcfcf9' }}>
        <div ref={gridRef} className="sp-grid max-w-[1440px] mx-auto">
          {filtered.length === 0 ? (
            <div className="sp-empty">
              No services found — try a different search or filter.
            </div>
          ) : (
            filtered.map((service) => (
              <article key={service.title} className="sp-card">

                {/* Image */}
                <div className="sp-card-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={service.image} alt={service.title} />
                  {service.badge && (
                    <span className="sp-card-badge">{service.badge}</span>
                  )}
                </div>

                {/* Body */}
                <div className="sp-card-body">
                  <h4 className="sp-card-title">{service.title}</h4>
                  <span className="sp-card-subtitle">{service.subtitle}</span>
                  <p className="sp-card-desc">{service.description}</p>

                  {/* Meta row */}
                  <div className="sp-card-meta">
                    <div>
                      <span className="sp-meta-label">{service.meta.label1}</span>
                      <span className="sp-meta-value">{service.meta.value1}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="sp-meta-label">{service.meta.label2}</span>
                      <span className="sp-meta-value">{service.meta.value2}</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="sp-card-actions">
                    <Link href={service.href} className="sp-btn-secondary">Learn More</Link>
                    <Link href="/booking"    className="sp-btn-primary">Book Now</Link>
                  </div>
                </div>

              </article>
            ))
          )}
        </div>
      </div>
    </>
  )
}
