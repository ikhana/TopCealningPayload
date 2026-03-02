// blocks/AboutSplit/Component.client.tsx
// Repurposed as the page-hero "blade" component — used on Services, About, etc.
// Design reference: design/serviceshero.html
//
// Layout:
//   • Full-width navy blade (55vh / min 400px)
//   • Background image clipped to left diagonal via clip-path on the <img>
//   • Fade gradient over image (transparent → navy, left→right)
//   • Content panel pinned right: skewed -5deg, children counter-skewed +5deg
//   • Slide-in animation from right on mount
//
// Fields used (no config changes):
//   sectionId, content (RichText), image, backgroundStyle, showDottedPattern, cardStyle

'use client'

import React from 'react'
import type { AboutSplitBlock } from '@/payload-types'
import { BlockWrapper } from '@/components/BlockWrapper'
import RichText from '@/components/RichText'
import type { Media } from '@/payload-types'

export function AboutSplitClient(props: AboutSplitBlock) {
  const { sectionId, content, image } = props

  const imageUrl: string =
    typeof image === 'object' && image !== null && (image as Media).url
      ? (image as Media).url!
      : '/images/cleaning/about-cleaning.jpg'

  return (
    <BlockWrapper sectionId={sectionId} className="-mt-20 lg:-mt-24 p-0 overflow-visible">
      <style>{`
        /* ── Slide-in keyframe ── */
        @keyframes sh-slide-in {
          from { transform: translateX(80px) skewX(-5deg); opacity: 0; }
          to   { transform: translateX(0)     skewX(-5deg); opacity: 1; }
        }

        /* ── Blade ── */
        .sh-blade {
          position: relative;
          width: 100%;
          height: 55vh;
          min-height: 400px;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: #0d1b2e;
        }

        /* ── Background image — left diagonal clip ── */
        .sh-bg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 1;
          filter: saturate(1.2) contrast(1.1);
          clip-path: polygon(0 0, 45% 0, 35% 100%, 0% 100%);
        }

        /* ── Gradient: image fades into navy ── */
        .sh-img-fade {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: linear-gradient(90deg, transparent 20%, #0d1b2e 40%);
        }

        /* ── Subtle teal tint overlay ── */
        .sh-overlay {
          position: absolute;
          inset: 0;
          z-index: 3;
          background: linear-gradient(135deg, rgba(23,176,171,0.1) 0%, transparent 50%);
        }

        /* ── Content wrapper — pins text to the right ── */
        .sh-content-wrap {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 5%;
          display: flex;
          justify-content: flex-end;
        }

        /* ── Text block — skewed panel ── */
        .sh-text-block {
          width: 55%;
          padding: 40px;
          border-left: 3px solid #17b0ab;
          background: rgba(13, 27, 46, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transform: skewX(-5deg);
          animation: sh-slide-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Counter-unskew all direct children */
        .sh-text-block > * {
          transform: skewX(5deg);
        }

        /* ── RichText content styles ── */

        /* Kicker: first <p> that only contains a <strong> or <em> → teal mono */
        .sh-text-block .prose p:first-child strong,
        .sh-text-block .prose p:first-child em {
          font-family: var(--font-mono, monospace);
          color: #17b0ab;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5em;
          font-style: normal;
        }

        /* Headings */
        .sh-text-block .prose h1,
        .sh-text-block .prose h2 {
          color: #ffffff;
          font-size: clamp(1.8rem, 4vw, 3rem);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -1px;
          margin-top: 12px;
          margin-bottom: 15px;
        }

        /* Body */
        .sh-text-block .prose p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          line-height: 1.6;
          max-width: 500px;
          margin-bottom: 25px;
        }

        /* CTA link → teal button */
        .sh-text-block .prose a {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #17b0ab;
          color: #ffffff !important;
          padding: 14px 28px;
          text-decoration: none !important;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: background 0.3s ease, color 0.3s ease, transform 0.3s ease;
        }
        .sh-text-block .prose a:hover {
          background: #ffffff;
          color: #0d1b2e !important;
          transform: translateY(-3px);
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .sh-bg-img       { clip-path: none; opacity: 0.4; }
          .sh-text-block   { width: 100%; transform: none; animation: none; }
          .sh-text-block > * { transform: none; }
          .sh-content-wrap { justify-content: center; }
        }

        @media (max-width: 768px) {
          .sh-blade       { height: auto; min-height: 320px; padding: 60px 0; }
          .sh-text-block  { padding: 30px; }
          .sh-text-block .prose h1,
          .sh-text-block .prose h2 { font-size: 2rem; }
        }
      `}</style>

      <div className="sh-blade">

        {/* Background image — left diagonal clip */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="" aria-hidden className="sh-bg-img" />

        {/* Gradient: image fades into navy */}
        <div className="sh-img-fade" />

        {/* Subtle teal tint */}
        <div className="sh-overlay" />

        {/* Content — pinned right */}
        <div className="sh-content-wrap">
          <div className="sh-text-block">
            <div className="prose max-w-none">
              <RichText data={content} enableGutter={false} enableProse={false} />
            </div>
          </div>
        </div>

      </div>
    </BlockWrapper>
  )
}
