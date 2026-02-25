import Link from 'next/link'
import { Home, Sparkles } from 'lucide-react'

const bubbles = [
  { top: '15%', left: '10%',  right: undefined, delay: '0s',   w: 80,  h: 80  },
  { top: '65%', left: '15%',  right: undefined, delay: '1.2s', w: 60,  h: 60  },
  { top: '25%', left: undefined, right: '12%', delay: '0.5s', w: 70,  h: 70  },
  { top: '75%', left: undefined, right: '18%', delay: '1.8s', w: 50,  h: 50  },
  { top: '45%', left: '25%',  right: undefined, delay: '2.3s', w: 45,  h: 45  },
  { top: '35%', left: undefined, right: '25%', delay: '1.5s', w: 60,  h: 60  },
]

const suggestionLinks = [
  { label: 'Cleaning Services', href: '/buyservices' },
  { label: 'About Us',          href: '/#about'      },
  { label: 'Book a Cleaning',   href: '/booking'     },
  { label: 'FAQs',              href: '/faqs'        },
]

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background py-16 px-4">

      {/* ── Gradient blobs ───────────────────────────────────────── */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full"
          style={{ background: 'radial-gradient(circle, oklch(var(--primary) / 0.08) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full"
          style={{ background: 'radial-gradient(circle, oklch(var(--secondary) / 0.06) 0%, transparent 70%)' }}
        />
      </div>

      {/* ── Floating bubbles ─────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {bubbles.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-geometric-float backdrop-blur-sm"
            style={{
              top:              b.top,
              left:             b.left,
              right:            b.right,
              width:            b.w,
              height:           b.h,
              animationDelay:   b.delay,
              background:       'oklch(var(--primary) / 0.12)',
              boxShadow:        '0 4px 12px oklch(0 0 0 / 0.05)',
            }}
          />
        ))}
      </div>

      {/* ── Card ─────────────────────────────────────────────────── */}
      <div className="container max-w-3xl flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="relative w-full bg-background/80 backdrop-blur-sm rounded-3xl p-8 md:p-14 text-center shadow-2xl border border-border">

          {/* Gradient border lines */}
          <div className="absolute left-0 top-0    h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
          <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
          <div className="absolute inset-y-0 left-0  w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />

          {/* ── 4 [Sparkle] 4 ──────────────────────────────────────── */}
          <div className="flex justify-center items-center gap-3 md:gap-6 mb-8">
            <span
              className="font-heading font-black text-foreground leading-none"
              style={{
                fontSize: 'clamp(4rem, 12vw, 8rem)',
                textShadow: '2px 2px 0 oklch(var(--primary) / 0.2), -2px -2px 0 oklch(var(--primary) / 0.2)',
              }}
            >
              4
            </span>

            <div
              className="shrink-0 rounded-full flex items-center justify-center"
              style={{
                width:           'clamp(64px, 10vw, 100px)',
                height:          'clamp(64px, 10vw, 100px)',
                backgroundColor: 'oklch(var(--primary))',
                boxShadow:       '0 8px 25px oklch(var(--primary) / 0.3)',
              }}
            >
              <Sparkles
                style={{
                  width:     'clamp(32px, 5vw, 56px)',
                  height:    'clamp(32px, 5vw, 56px)',
                  color:     'oklch(var(--primary-foreground))',
                  animation: 'spin 10s linear infinite',
                  strokeWidth: 1.5,
                }}
              />
            </div>

            <span
              className="font-heading font-black text-foreground leading-none"
              style={{
                fontSize: 'clamp(4rem, 12vw, 8rem)',
                textShadow: '2px 2px 0 oklch(var(--primary) / 0.2), -2px -2px 0 oklch(var(--primary) / 0.2)',
              }}
            >
              4
            </span>
          </div>

          {/* ── Title ──────────────────────────────────────────────── */}
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Page Not Found
          </h1>

          {/* ── Description ────────────────────────────────────────── */}
          <p className="font-body text-base md:text-lg text-muted-foreground mb-10 max-w-md mx-auto">
            Oops! The page you&apos;re looking for seems to have been swept away during our cleaning.
          </p>

          {/* ── CTA buttons ────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <Link
              href="/"
              className="btn-primary inline-flex items-center justify-center gap-2 no-underline"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
            <Link
              href="/booking"
              className="btn-secondary inline-flex items-center justify-center gap-2 no-underline"
            >
              Book a Cleaning
            </Link>
          </div>

          {/* ── Suggestion links ───────────────────────────────────── */}
          <div className="pt-6 border-t border-border">
            <h2 className="font-semibold text-foreground mb-4 text-base md:text-lg font-heading">
              Looking for our services?
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {suggestionLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 hover:-translate-y-0.5 no-underline"
                  style={{
                    backgroundColor: 'oklch(var(--primary) / 0.1)',
                    color:           'oklch(var(--primary))',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
