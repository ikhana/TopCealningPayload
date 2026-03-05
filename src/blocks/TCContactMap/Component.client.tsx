// src/blocks/TCContactMap/Component.client.tsx
// Full-width map section with floating dark overlay card.
// Design reference: design/contactpage.html ".map-section" + ".map-overlay-card"
//
// Layout:
//   • Full-width section, 600px height, sand bg (#f5efe0), 4px teal border-top
//   • Google Maps iframe fills the entire section
//   • Floating dark navy card (absolute, left 5%, vertically centered):
//       kicker label → address block → hours → "OPEN NAV-SYS" link
//   • Box-shadow offset: 30px 30px 0 rgba(teal, 0.2) — signature TC style
//
// CMS fields: embedUrl, mapsUrl (both optional — fall back to defaults)

'use client'

import React from 'react'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcContactMap'
  embedUrl?: string | null
  mapsUrl?: string | null
}

const DEFAULT_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114503.95830814538!2d-80.28456787236319!3d25.77472839050453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b0a20ec8c111%3A0xff96f271ddad4f65!2sMiami%2C%20FL!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus'

const DEFAULT_MAPS_URL =
  'https://www.google.com/maps/place/Fort+Myers,+FL'

export function TCContactMapClient({ embedUrl, mapsUrl }: Props) {
  const mapSrc = embedUrl || DEFAULT_EMBED_URL
  const mapsLink = mapsUrl || DEFAULT_MAPS_URL

  return (
    <>
      <style>{`
        /* ── Map section shell ── */
        .tc-map-section {
          position: relative;
          width: 100%;
          height: 600px;
          background: #f5efe0;
          border-top: 4px solid #17b0ab;
          overflow: hidden;
        }

        /* ── Iframe — full bleed ── */
        .tc-map-iframe-wrap {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .tc-map-iframe-wrap iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
          filter: grayscale(0.2) contrast(1.05) brightness(0.95);
        }

        /* ── Floating overlay card ── */
        .tc-map-overlay-card {
          position: absolute;
          top: 50%;
          left: 5%;
          transform: translateY(-50%);
          background: #0d1b2e;
          color: #f8fafc;
          padding: 50px;
          width: 420px;
          z-index: 5;
          box-shadow: 30px 30px 0 rgba(23, 176, 171, 0.2);
        }

        /* Kicker */
        .tc-map-kicker {
          display: block;
          font-family: var(--font-mono, 'JetBrains Mono', monospace);
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: #17b0ab;
          margin-bottom: 20px;
        }

        /* Address block */
        .tc-map-address {
          font-size: 1.4rem;
          font-weight: 800;
          line-height: 1.3;
          color: #ffffff;
          margin-bottom: 30px;
        }

        /* Hours */
        .tc-map-hours {
          font-family: var(--font-mono, 'JetBrains Mono', monospace);
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 30px;
        }

        /* Nav link */
        .tc-map-nav-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #ffffff;
          font-family: var(--font-mono, 'JetBrains Mono', monospace);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 1px solid #17b0ab;
          padding-bottom: 5px;
          transition: color 0.3s ease;
        }

        .tc-map-nav-link:hover {
          color: #17b0ab;
        }

        .tc-map-nav-link svg {
          transition: transform 0.3s ease;
        }

        .tc-map-nav-link:hover svg {
          transform: translateX(5px);
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .tc-map-section {
            height: auto;
            display: flex;
            flex-direction: column-reverse;
          }

          .tc-map-overlay-card {
            position: static;
            transform: none;
            width: 100%;
            box-shadow: none;
          }

          .tc-map-iframe-wrap {
            position: relative;
            height: 300px;
          }
        }
      `}</style>

      <section className="tc-map-section">

        {/* Google Maps iframe — fills full section */}
        <div className="tc-map-iframe-wrap">
          <iframe
            src={mapSrc}
            title="Top Cleaning — Service Area Map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        {/* Floating overlay card */}
        <div className="tc-map-overlay-card">

          <span className="tc-map-kicker">Physical Node</span>

          <div className="tc-map-address">
            FLORIDA REGIONAL HQ<br />
            Fort Myers &amp; Miami Area Operations
          </div>

          <div className="tc-map-hours">
            <span>Operations: Mon — Sun</span>
            <span>Active Window: 08:00 — 18:00</span>
          </div>

          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="tc-map-nav-link"
          >
            OPEN NAV-SYS
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>

        </div>
      </section>
    </>
  )
}
