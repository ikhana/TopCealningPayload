// app/(frontend)/layout.tsx

import type { ReactNode } from 'react'
import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ExitIntentPopup } from '@/components/ExitIntentPopup'
import { HashScrollHandler } from '@/components/HashScrollHandler'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { draftMode } from 'next/headers'
import { Poppins } from 'next/font/google'
import './globals.css'

// Self-hosted at build time by next/font. This replaces the CSS @import of
// fonts.googleapis.com in globals.css, which was render-blocking: the browser
// had to download globals.css, parse it, discover the @import, then do DNS +
// TLS + a round trip to Google before anything could paint (~420ms).
// Roboto was dropped entirely — it was requested with 4 weights and used nowhere.
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
})

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { isEnabled: isDraftMode } = await draftMode()

  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        {/* Preload WOFF2 only. The @font-face rules still list the .otf as a
            fallback source, so older browsers (and any failure to fetch the
            woff2) fall back automatically without a visible change. */}
        <link
          rel="preload"
          href="/fonts/soleil/SoleilRegular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/soleil/SoleilBold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex flex-col antialiased font-body">
        {/* ── Global grain overlay (backgrond.html technique) ──────────
            Fixed SVG fractal-noise filter, multiply blend, pointer-events:none.
            Applies the cellulose-fiber tactile texture across all sections. */}
        <div
          aria-hidden
          style={{
            position: 'fixed', top: 0, left: 0,
            width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: 9999,
            opacity: 0.32,
            mixBlendMode: 'multiply',
          }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id="tc-global-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#tc-global-grain)" />
          </svg>
        </div>
        <Providers>
          <HashScrollHandler />
          <AdminBar />
          {(isDraftMode || process.env.NODE_ENV === 'development') && (
            <LivePreviewListener />
          )}
          <Header />
          {/* pb-40 reserves space for the floating Footer CTA (marginTop:-80px) so the last
              section of every page doesn't get covered by the "Ready for a spotless space?" band */}
          <main className="flex-1 w-full pb-40">{children}</main>
          <Footer />
          {/* Exit-intent coupon — self-suppresses on booking/checkout paths */}
          <ExitIntentPopup />
        </Providers>
      </body>
    </html>
  )
}