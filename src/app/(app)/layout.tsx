// app/(frontend)/layout.tsx

import type { ReactNode } from 'react'
import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { HashScrollHandler } from '@/components/HashScrollHandler'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { draftMode } from 'next/headers'
import './globals.css'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { isEnabled: isDraftMode } = await draftMode()
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link
          rel="preload"
          href="/fonts/soleil/SoleilRegular.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/soleil/SoleilBold.otf"
          as="font"
          type="font/otf"
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
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}