// src/blocks/PartnershipTrust/Component.tsx
import type { PartnerTrustBlock as PartnerTrustBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'
import { Award, Quote } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export const PartnerTrustBlock: React.FC<
  PartnerTrustBlockProps & {
    id?: string
  }
> = (props) => {
  const {
    hero,
    trust,
    cta,
    layout,
    bg,
    pad,
  } = props

  const safeLayout = layout || 'stacked'
  const safeBg = bg || 'parchment'
  const safePad = pad || 'large'

  // Background classes
  const backgroundClasses = {
    parchment: 'bg-parchment text-charcoal',
    charcoal: 'bg-charcoal text-parchment',
    white: 'bg-white text-charcoal',
    bourbon: 'bg-gradient-to-br from-parchment to-bourbon/10 text-charcoal',
  }

  // Padding classes
  const paddingClasses = {
    small: 'py-12 lg:py-16',
    medium: 'py-16 lg:py-20',
    large: 'py-20 lg:py-28',
    xl: 'py-28 lg:py-36',
  }

  // Overlay classes
  const overlayClasses = {
    none: '',
    subtle: 'bg-black/20',
    strong: 'bg-black/50',
    gradient: 'bg-gradient-to-t from-black/70 via-black/30 to-transparent',
  }

  const HeroSection = () => (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
      {/* Hero Image */}
      {hero?.image && (
        <div className="relative aspect-[16/9] lg:aspect-[21/9]">
          <Media
            resource={typeof hero.image === 'number' ? String(hero.image) : hero.image}
            className="w-full h-full"
            imgClassName="w-full h-full object-cover"
          />
          
          {/* Overlay */}
          {hero.overlay && hero.overlay !== 'none' && (
            <div className={cn('absolute inset-0', overlayClasses[hero.overlay])} />
          )}
          
          {/* Heritage texture overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C28033' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3Ccircle cx='0' cy='30' r='1'/%3E%3Ccircle cx='60' cy='30' r='1'/%3E%3Ccircle cx='30' cy='0' r='1'/%3E%3Ccircle cx='30' cy='60' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}
          />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center p-8 lg:p-12">
            <div className="text-center max-w-4xl">
              {/* Eyebrow */}
              {hero.eyebrow && (
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-bourbon/90 rounded-full">
                  <Award className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-semibold tracking-wider uppercase">
                    {hero.eyebrow}
                  </span>
                </div>
              )}
              
              {/* Headline */}
              {hero.headline && (
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-playfair text-white mb-4 leading-tight drop-shadow-lg">
                  {hero.headline}
                </h1>
              )}
              
              {/* Tagline */}
              {hero.tagline && (
                <p className="text-lg md:text-xl lg:text-2xl text-white/90 drop-shadow-md max-w-2xl mx-auto">
                  {hero.tagline}
                </p>
              )}
              
              {/* CTA */}
              {cta?.enabled && safeLayout === 'overlay' && (
                <div className="mt-8">
                  <Button
                    asChild
                    size="lg"
                    className={cn(
                      'px-8 py-3 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105',
                      cta.style === 'bourbon' && 'bg-bourbon hover:bg-bourbon/90 text-white',
                      cta.style === 'charcoal' && 'bg-charcoal hover:bg-charcoal/90 text-white',
                      cta.style === 'outline' && 'bg-white/90 hover:bg-white text-charcoal border-2 border-white/50',
                    )}
                  >
                    <Link href={cta.link || '/contact'}>
                      {cta.text || 'Start Your Custom Project'}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const TrustSection = () => (
    <div className="space-y-8 lg:space-y-12">
      {/* Trust Title */}
      {trust?.title && (
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-playfair mb-2">
            {trust.title}
          </h2>
          <div className="w-24 h-1 bg-bourbon mx-auto rounded-full"></div>
        </div>
      )}

      {/* Trust Content based on method */}
      {trust?.method === 'stats' && trust.stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {trust.stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="mb-4">
                <div className="text-3xl lg:text-4xl xl:text-5xl font-bold text-bourbon mb-2 transition-transform duration-300 group-hover:scale-110">
                  {stat.number}
                </div>
                <div className="text-sm lg:text-base text-muted-foreground font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {trust?.method === 'logos' && trust.logos && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center">
          {trust.logos.map((logoItem, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center p-4 rounded-lg bg-white/50 hover:bg-white/80 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Media
                resource={typeof logoItem.logo === 'number' ? String(logoItem.logo) : logoItem.logo}
                className="max-w-full max-h-16 opacity-70 hover:opacity-100 transition-opacity duration-300"
                imgClassName="object-contain grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      )}

      {trust?.method === 'quote' && trust.quote && (
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <Quote className="w-12 h-12 text-bourbon/30 mx-auto mb-6" />
            <blockquote className="text-xl md:text-2xl lg:text-3xl font-light font-playfair leading-relaxed mb-8 text-foreground/90">
              &ldquo;{trust.quote.text}&rdquo;
            </blockquote>
            <div className="space-y-1">
              <div className="font-semibold text-lg text-bourbon">
                {trust.quote.author}
              </div>
              {trust.quote.title && (
                <div className="text-muted-foreground">
                  {trust.quote.title}
                </div>
              )}
              {trust.quote.company && (
                <div className="text-sm text-muted-foreground font-medium">
                  {trust.quote.company}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {trust?.method === 'mixed' && (
        <div className="space-y-12">
          {/* Stats */}
          {trust.stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {trust.stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-3xl lg:text-4xl font-bold text-bourbon mb-2 transition-transform duration-300 group-hover:scale-110">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Quote */}
          {trust.quote && (
            <div className="max-w-3xl mx-auto text-center">
              <blockquote className="text-lg md:text-xl font-light leading-relaxed mb-6 text-foreground/90">
                &ldquo;{trust.quote.text}&rdquo;
              </blockquote>
              <div className="text-bourbon font-semibold">
                — {trust.quote.author}
                {trust.quote.company && `, ${trust.quote.company}`}
              </div>
            </div>
          )}
          
          {/* Logos */}
          {trust.logos && (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center opacity-60">
              {trust.logos.map((logoItem, index) => (
                <div key={index} className="flex items-center justify-center">
                  <Media
                    resource={typeof logoItem.logo === 'number' ? String(logoItem.logo) : logoItem.logo}
                    className="max-w-full max-h-12"
                    imgClassName="object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CTA for non-overlay layouts */}
      {cta?.enabled && safeLayout !== 'overlay' && (
        <div className="text-center pt-8">
          <Button
            asChild
            size="lg"
            className={cn(
              'px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105',
              cta.style === 'bourbon' && 'bg-bourbon hover:bg-bourbon/90 text-white',
              cta.style === 'charcoal' && 'bg-charcoal hover:bg-charcoal/90 text-white',
              cta.style === 'outline' && 'border-2 border-bourbon text-bourbon hover:bg-bourbon hover:text-white',
            )}
          >
            <Link href={cta.link || '/contact'}>
              {cta.text || 'Start Your Custom Project'}
            </Link>
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <section className={cn('w-full', backgroundClasses[safeBg], paddingClasses[safePad])}>
      <div className="container mx-auto px-4">
        {safeLayout === 'stacked' && (
          <div className="space-y-16 lg:space-y-20">
            <HeroSection />
            <TrustSection />
          </div>
        )}

        {safeLayout === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <HeroSection />
            </div>
            <div>
              <TrustSection />
            </div>
          </div>
        )}

        {safeLayout === 'overlay' && (
          <div className="relative">
            <HeroSection />
            <div className="absolute bottom-8 left-0 right-0">
              <div className="container mx-auto px-4">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-2xl max-w-5xl mx-auto">
                  <TrustSection />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Heritage texture overlay for entire section */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C28033' fill-opacity='0.3'%3E%3Cpath d='M0 0h120v2H0zm0 6h120v2H0zm0 6h120v1H0zm0 3h120v1H0zm0 3h120v2H0zm0 6h120v1H0zm0 3h120v1H0zm0 3h120v2H0zm0 6h120v1H0zm0 3h120v1H0zm0 3h120v2H0zm0 6h120v1H0zm0 3h120v1H0zm0 3h120v2H0zm0 6h120v1H0zm0 3h120v1H0zm0 3h120v2H0zm0 6h120v1H0zm0 3h120v1H0zm0 3h120v2H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
        aria-hidden="true"
      />
    </section>
  )
}