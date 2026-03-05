// src/blocks/TextContent/Component.tsx
// TC-branded rich text content block.
// Clean editorial layout — white bg, Soleil headings, teal accents.
//
// Typography system:
//   • Headings  → Soleil (var(--font-heading)), navy-deep (#0d1b2e)
//   • H2        → teal (#17b0ab), with teal left border
//   • Body      → Poppins (var(--font-body)), muted dark
//   • Links     → teal, underline on hover
//   • Blockquote → teal left border, teal-light bg
//   • Lists     → teal bullet/number markers
//   • Code      → JetBrains Mono, sand bg
//   • HR        → teal thin rule

import RichText from '@/components/RichText'
import type { TextContentBlock as TextContentBlockProps } from '@/payload-types'
import React from 'react'

export const TextContentBlock: React.FC<TextContentBlockProps> = ({ content }) => {
  if (!content) return null

  return (
    <>
      <style>{`
        /* ── Section shell ── */
        .tc-text-section {
          background: #ffffff;
          padding: 80px 5%;
        }

        /* ── Content column ── */
        .tc-text-inner {
          max-width: 860px;
          margin: 0 auto;
          position: relative;
          padding-left: 28px;
          border-left: 3px solid #17b0ab;
        }

        /* ── Headings ── */
        .tc-text-inner .prose h1,
        .tc-text-inner .prose h2,
        .tc-text-inner .prose h3,
        .tc-text-inner .prose h4 {
          font-family: var(--font-heading, 'Soleil', system-ui, sans-serif);
          color: #0d1b2e;
          line-height: 1.15;
          letter-spacing: -0.3px;
          margin-top: 2em;
          margin-bottom: 0.6em;
        }

        .tc-text-inner .prose h1 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
        }

        .tc-text-inner .prose h2 {
          font-size: clamp(1.5rem, 3vw, 2.25rem);
          font-weight: 800;
          color: #17b0ab;
        }

        .tc-text-inner .prose h3 {
          font-size: clamp(1.2rem, 2.5vw, 1.6rem);
          font-weight: 700;
        }

        .tc-text-inner .prose h4 {
          font-size: 1.1rem;
          font-weight: 700;
          font-family: var(--font-mono, 'JetBrains Mono', monospace);
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #17b0ab;
          font-size: 0.85rem;
        }

        /* ── Body text ── */
        .tc-text-inner .prose p {
          font-family: var(--font-body, 'Poppins', sans-serif);
          font-size: 1.05rem;
          line-height: 1.85;
          color: rgba(13, 27, 46, 0.72);
          margin-bottom: 1.4em;
        }

        /* ── Links ── */
        .tc-text-inner .prose a {
          color: #17b0ab;
          text-decoration: none;
          border-bottom: 1px solid rgba(23, 176, 171, 0.35);
          transition: border-color 0.25s ease, color 0.25s ease;
        }

        .tc-text-inner .prose a:hover {
          color: #0f8a86;
          border-bottom-color: #0f8a86;
        }

        /* ── Strong / Em ── */
        .tc-text-inner .prose strong {
          font-weight: 700;
          color: #0d1b2e;
        }

        .tc-text-inner .prose em {
          color: rgba(13, 27, 46, 0.65);
        }

        /* ── Lists ── */
        .tc-text-inner .prose ul,
        .tc-text-inner .prose ol {
          padding-left: 1.5em;
          margin-bottom: 1.4em;
        }

        .tc-text-inner .prose li {
          font-family: var(--font-body, 'Poppins', sans-serif);
          font-size: 1.05rem;
          line-height: 1.75;
          color: rgba(13, 27, 46, 0.72);
          margin-bottom: 0.4em;
        }

        .tc-text-inner .prose ul li::marker {
          color: #17b0ab;
        }

        .tc-text-inner .prose ol li::marker {
          color: #17b0ab;
          font-family: var(--font-mono, monospace);
          font-weight: 700;
        }

        /* ── Blockquote ── */
        .tc-text-inner .prose blockquote {
          border-left: 4px solid #17b0ab;
          background: #e0f5f4;
          margin: 2em 0;
          padding: 20px 28px;
          border-radius: 0 4px 4px 0;
        }

        .tc-text-inner .prose blockquote p {
          font-size: 1.1rem;
          font-style: italic;
          color: #0d1b2e;
          margin-bottom: 0;
        }

        /* ── Code ── */
        .tc-text-inner .prose code {
          font-family: var(--font-mono, 'JetBrains Mono', monospace);
          font-size: 0.875rem;
          background: #f5efe0;
          color: #0d1b2e;
          padding: 3px 8px;
          border-radius: 2px;
        }

        .tc-text-inner .prose pre {
          background: #0d1b2e;
          padding: 24px;
          border-radius: 0;
          border-left: 3px solid #17b0ab;
          overflow-x: auto;
        }

        .tc-text-inner .prose pre code {
          background: transparent;
          color: #e0f5f4;
          padding: 0;
          font-size: 0.9rem;
        }

        /* ── HR ── */
        .tc-text-inner .prose hr {
          border: none;
          border-top: 1px solid rgba(23, 176, 171, 0.3);
          margin: 2.5em 0;
        }

        /* ── Table ── */
        .tc-text-inner .prose table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.4em;
          font-size: 0.95rem;
        }

        .tc-text-inner .prose th {
          background: #0d1b2e;
          color: #ffffff;
          font-family: var(--font-mono, monospace);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          padding: 12px 16px;
          text-align: left;
        }

        .tc-text-inner .prose td {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(23, 176, 171, 0.15);
          color: rgba(13, 27, 46, 0.75);
          vertical-align: top;
        }

        .tc-text-inner .prose tr:last-child td {
          border-bottom: none;
        }

        /* ── First element — no top margin ── */
        .tc-text-inner .prose > *:first-child {
          margin-top: 0;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .tc-text-section {
            padding: 60px 5%;
          }

          .tc-text-inner {
            padding-left: 20px;
          }

          .tc-text-inner .prose p,
          .tc-text-inner .prose li {
            font-size: 1rem;
          }
        }
      `}</style>

      <section className="tc-text-section">
        <div className="tc-text-inner">
          <div className="prose max-w-none">
            <RichText data={content} enableGutter={false} enableProse={false} />
          </div>
        </div>
      </section>
    </>
  )
}
