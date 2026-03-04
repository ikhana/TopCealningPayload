'use client'

// app/(app)/not-found.tsx
// Design reference: design/404.html
// Pigment-sedimentation 404 — sand bg, ghost 404 with SVG displacement,
// sediment wave, floating dust particles, mouse-parallax on big numbers.
// "Link Integrity Error" kicker removed per design direction.

import { TCButton } from '@/components/ui/TCButton'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const big404Ref    = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router       = useRouter()

  // ── Dust particles ──────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const particles: HTMLDivElement[] = []

    for (let i = 0; i < 40; i++) {
      const el   = document.createElement('div')
      const size = Math.random() * 4 + 1
      el.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        background: #17b0ab;
        border-radius: 50%;
        pointer-events: none;
        opacity: ${Math.random() * 0.35};
      `
      el.animate(
        [
          { transform: 'translateY(0) translateX(0)',                                                                           opacity: 0 },
          { opacity: 0.4,                                                                                                        offset: 0.2 },
          { transform: `translateY(-${100 + Math.random() * 200}px) translateX(${Math.random() * 50 - 25}px)`, opacity: 0 },
        ],
        {
          duration:   (10 + Math.random() * 20) * 1000,
          iterations: Infinity,
          delay:      Math.random() * 5000,
          easing:     'ease-in-out',
        },
      )
      container.appendChild(el)
      particles.push(el)
    }

    return () => particles.forEach((p) => p.remove())
  }, [])

  // ── Mouse parallax on big 404 ───────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = big404Ref.current
      if (!el) return
      const x = (e.clientX - window.innerWidth  / 2) * 0.05
      const y = (e.clientY - window.innerHeight / 2) * 0.05
      el.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.1}deg)`
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      {/* ── SVG filter defs (hidden) ───────────────────────────────────── */}
      <svg style={{ display: 'none' }} aria-hidden>
        <defs>
          <filter id="nf-pigment">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="25" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="nf-grain">
            <feTurbulence type="turbulence" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncR type="linear" slope="0.3" />
              <feFuncG type="linear" slope="0.3" />
              <feFuncB type="linear" slope="0.3" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <style>{`
        /* ── Page shell ── */
        .nf-shell {
          font-family: var(--font-sans, Inter, sans-serif);
          background: #f5efe0;
          color: #0d1b2e;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        /* ── Grain overlay ── */
        .nf-grain {
          position: fixed; inset: 0;
          pointer-events: none; z-index: 9999;
          opacity: 0.4; mix-blend-mode: multiply;
        }

        /* ── Main viewport ── */
        .nf-viewport {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 5% 60px;
          position: relative;
          overflow: hidden;
        }

        /* ── Sediment wave ── */
        .nf-sediment {
          position: absolute; bottom: 0; width: 100%; height: 100%;
          background: #17b0ab;
          clip-path: polygon(0 65%,15% 55%,35% 70%,55% 50%,75% 75%,90% 60%,100% 80%,100% 100%,0% 100%);
          opacity: 0;
          animation: nf-settle 4s cubic-bezier(0.16,1,0.3,1) 0.2s forwards;
          pointer-events: none;
        }

        /* ── 2-col grid ── */
        .nf-grid {
          position: relative; z-index: 10;
          max-width: 1200px; width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 40px;
        }

        /* ── Ghost 404 ── */
        .nf-visual {
          position: relative; height: 500px;
          display: flex; align-items: center; justify-content: center;
        }
        .nf-big {
          font-size: 28vw; font-weight: 900; line-height: 1;
          color: transparent;
          background: linear-gradient(180deg, #0d1b2e 0%, #0f8a86 100%);
          -webkit-background-clip: text; background-clip: text;
          filter: url(#nf-pigment);
          opacity: 0.15;
          position: absolute;
          user-select: none;
          animation: nf-drift 20s infinite alternate ease-in-out;
          transition: transform 0.1s ease-out;
        }

        /* ── Content ── */
        .nf-content { position: relative; z-index: 20; }

        .nf-h1 {
          font-family: var(--font-heading, 'Soleil', var(--font-sans, 'Inter', sans-serif));
          font-size: clamp(3rem, 6vw, 5rem);
          font-weight: 900;
          line-height: 0.9;
          color: #0d1b2e;
          margin-bottom: 30px;
          letter-spacing: -0.04em;
          opacity: 0;
          transform: translateY(30px);
          animation: nf-reveal 0.8s 0.4s forwards;
        }
        .nf-h1 span {
          display: block;
          color: #fc8181;
          font-style: italic;
          font-weight: 300;
        }

        .nf-desc {
          font-size: 1.2rem; line-height: 1.7;
          color: #1a2840;
          max-width: 480px;
          margin-bottom: 40px;
          opacity: 0; transform: translateY(30px);
          animation: nf-reveal 0.8s 0.6s forwards;
        }

        .nf-actions {
          display: flex; gap: 20px;
          opacity: 0; transform: translateY(30px);
          animation: nf-reveal 0.8s 0.8s forwards;
        }


/* ── Animations ── */
        @keyframes nf-reveal {
          to { opacity:1; transform:translateY(0); }
        }
        @keyframes nf-settle {
          from { transform:translateY(100%) scaleY(2); opacity:0; }
          to   { transform:translateY(0) scaleY(1);   opacity:0.06; }
        }
        @keyframes nf-drift {
          from { transform:translate(-20px,-10px) rotate(-1deg); }
          to   { transform:translate(20px,10px)   rotate(1deg);  }
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .nf-grid { grid-template-columns:1fr; text-align:center; }
          .nf-visual { order:-1; height:300px; }
          .nf-big { font-size:40vw; }
          .nf-desc { margin-inline:auto; }
          .nf-actions { justify-content:center; flex-direction:column; align-items:center; }
        }
      `}</style>

      <div className="nf-shell">

        {/* Grain overlay */}
        <div className="nf-grain" aria-hidden>
          <svg width="100%" height="100%">
            <rect width="100%" height="100%" filter="url(#nf-grain)" />
          </svg>
        </div>

        {/* Main 404 area */}
        <main className="nf-viewport">
          {/* Sediment wave */}
          <div className="nf-sediment" aria-hidden />

          {/* Dust particle container */}
          <div ref={containerRef} className="absolute inset-0 pointer-events-none" aria-hidden />

          <div className="nf-grid">

            {/* Left — ghost 404 */}
            <div className="nf-visual" aria-hidden>
              <div ref={big404Ref} className="nf-big">404</div>
            </div>

            {/* Right — content */}
            <div className="nf-content">
              <h1 className="nf-h1">
                Even we couldn&apos;t
                <span>clean up this mess.</span>
              </h1>

              <p className="nf-desc">
                The page you&apos;re looking for has settled into the digital dust.
                It might have been moved, deleted, or never existed in the first place.
              </p>

              <div className="nf-actions">
                <TCButton variant="primary" href="/">START FRESH AT HOME</TCButton>
                <TCButton variant="ghost" onClick={() => router.back()}>GO BACK A STEP</TCButton>
              </div>
            </div>

          </div>
        </main>


      </div>
    </>
  )
}
