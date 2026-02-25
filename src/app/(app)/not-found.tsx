import { BorderButton } from '@/components/ui/BorderButton/BorderButton';
import Image from 'next/image';
import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background px-4 py-8 md:py-0">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl animate-geometric-float" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-secondary/5 rounded-full blur-3xl" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          
          <div className="order-2 lg:order-1 space-y-6 md:space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 border border-primary/20">
                <div className="w-2 h-2 bg-primary rounded-full animate-gentle-pulse" />
                <span className="text-xs md:text-sm font-semibold text-primary uppercase tracking-wide">Error 404</span>
              </div>
              
              <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                Lost Your Way?
              </h1>
              
              <p className="text-base md:text-xl text-muted-foreground font-body max-w-lg">
                This page doesn't exist. Let's get you back on track.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-4">
              <BorderButton as="link" href="/" text="Back to Home" variant="filled" />
              <BorderButton as="link" href="/contact-us" text="Get in Touch" variant="outlined-colored" />
            </div>

            <div className="pt-6 md:pt-8 border-t border-border">
              <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">Popular destinations:</p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {[
                  { label: 'Services', href: '/services' },
                  { label: 'About Us', href: '/about-us' },
                  { label: 'Contact', href: '/contact-us' }
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-xs md:text-sm px-3 py-1.5 md:px-4 md:py-2 text-muted-foreground hover:text-primary font-medium transition-colors duration-300 underline hover:no-underline"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md">
              <div className="relative bg-card/80 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl">
                <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                <div className="absolute inset-y-0 top-0 bottom-0 left-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                <div className="absolute inset-y-0 top-0 bottom-0 right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
                
                <div className="text-center space-y-4 md:space-y-6 relative">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto">
                    <Image
                      src="/images/logos/mazo-logo.png"
                      alt="Mazco LLC"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  
                  <div>
                    <div className="text-6xl md:text-8xl font-heading font-bold text-primary mb-2">404</div>
                    <div className="text-base md:text-lg font-semibold text-foreground">Page Not Found</div>
                  </div>
                  
                  <div className="pt-4 md:pt-6 border-t border-border">
                    <p className="text-xs md:text-sm text-muted-foreground font-body">
                      Mazco LLC - Strategic Financial Planning
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}