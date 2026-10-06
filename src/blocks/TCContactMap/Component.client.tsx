// src/blocks/TCContactMap/Component.client.tsx
// Full-width map section with floating dark overlay card.
// Design reference: design/contactpage.html ".map-section" + ".map-overlay-card"
//
// Layout:
//   • Full-width section, 600px height, 4px teal border-top
//   • Google Maps iframe fills the entire section (heavy grayscale filter)
//   • Floating dark navy card (absolute, left 5%, vertically centered):
//       address block → hours
//   • Box-shadow offset: 30px 30px 0 rgba(teal, 0.2) — signature TC style
//
// CMS fields: embedUrl (optional — falls back to default)

'use client'

import React from 'react'

type Props = {
  id?: string
  blockName?: string | null
  blockType?: 'tcContactMap'
  embedUrl?: string | null
  mapsUrl?: string | null
}

// Centred on Broward County, the service area. No API key needed for this embed form.
const DEFAULT_EMBED_URL = 'https://www.google.com/maps?q=Broward+County,+FL&z=10&output=embed'

export function TCContactMapClient({ embedUrl }: Props) {
  const mapSrc = embedUrl || DEFAULT_EMBED_URL

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
          filter: grayscale(1) contrast(1.1) brightness(0.8);
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

        /* Address block */
        .tc-map-address {
          font-size: 1.4rem;
          font-weight: 800;
          line-height: 1.3;
          color: #ffffff;
          margin-bottom: 20px;
        }

        /* Hours */
        .tc-map-hours {
          font-family: var(--font-mono, 'JetBrains Mono', monospace);
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
          display: flex;
          flex-direction: column;
          gap: 6px;
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
            title="Top Cleaning Team service area map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        {/* Floating overlay card */}
        <div className="tc-map-overlay-card">

          <div className="tc-map-address">
            BROWARD COUNTY, FLORIDA<br />
            Serving Fort Lauderdale &amp; surrounding areas
          </div>

          <div className="tc-map-hours">
            <span>Open: Mon to Sun</span>
            {/* 08:00 to 22:00, matching the schema, the emails and the SMS window.
                This said 18:00 after the rest of the site moved to 10 PM. */}
            <span>Hours: 08:00 to 22:00</span>
          </div>

        </div>
      </section>
    </>
  )
}
