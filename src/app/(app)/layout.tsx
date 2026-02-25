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