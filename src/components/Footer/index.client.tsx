// src/components/Footer/index.client.tsx
// All colours reference the Tailwind theme — no hardcoded hex values.
// Only three justified exceptions:
//   1. radial-gradient glow        — uses color-mix(var(--color-teal)) → design-system
//   2. logo mark clip-path         — geometry value, not a colour
//   3. logo mark box-shadow glow   — uses color-mix(var(--color-teal)) → design-system

'use client'

import { cn } from '@/utilities/cn'
import { CMSLink } from '@/components/CMSLink'
import Image from 'next/image'
import Link from 'next/link'
import type { Footer, Media } from 'src/payload-types'

type Props = {
  footer: Footer
}

export function FooterClient({ footer }: Props) {
  const currentYear  = new Date().getFullYear()
  const copyrightText = (footer.copyright || '© {year} TOP CLEANING. ALL RIGHTS RESERVED.')
    .replace('{year}', currentYear.toString())

  const logoImage   = footer.logo && typeof footer.logo === 'object' ? (footer.logo as Media) : null
  const contactInfo = (footer as any).contactInfo || {}
  const socials     = footer.socialLinks || {}
  const hasContact  = contactInfo.phone1 || contactInfo.email || contactInfo.hours

  return (
    <footer className="bg-navy-obsidian text-white relative overflow-hidden">

      {/* ── Ambient teal glow (decorative, top-right corner) ─────── */}
      <div
        aria-hidden
        className="absolute pointer-events-none z-[1]"
        style={{
          width: '40vw', height: '40vw',
          background: 'radial-gradient(circle, color-mix(in oklch, var(--color-teal) 8%, transparent) 0%, transparent 70%)',
          top: '-20vw', right: '-10vw',
          filter: 'blur(60px)',
        }}
      />

      {/* ── Main 4-column grid ──────────────────────────────────────── */}
      <div className="relative z-[2] max-w-[1400px] mx-auto px-[5%] pt-[110px] pb-[60px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr] gap-10 lg:gap-[60px]">

          {/* ── Column 1: Brand ─────────────────────────────────────── */}
          <div className="flex flex-col gap-[25px] md:col-span-2 lg:col-span-1">

            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center gap-3 no-underline text-white font-black text-[1.5rem] tracking-[-0.5px] leading-none"
            >
              {logoImage?.url ? (
                <Image
                  src={logoImage.url}
                  alt={logoImage.alt || 'Top Cleaning'}
                  width={160}
                  height={44}
                  className="h-11 w-auto"
                />
              ) : (
                <>
                  <div
                    className="w-[34px] h-[34px] bg-teal flex-shrink-0"
                    style={{
                      clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
                      boxShadow: '0 0 20px color-mix(in oklch, var(--color-teal) 40%, transparent)',
                    }}
                  />
                  TOP CLEANING
                </>
              )}
            </Link>

            {/* Mission text */}
            {footer.tagline && (
              <p className="text-white/65 text-[1rem] leading-[1.8] max-w-[320px]">
                {footer.tagline}
              </p>
            )}

            {/* Social icons */}
            <div className="flex items-center gap-5">
              {socials.facebook && (
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-white/65 hover:text-teal hover:-translate-y-[3px] transition-all duration-200"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              )}
              {socials.instagram && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-white/65 hover:text-teal hover:-translate-y-[3px] transition-all duration-200"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              )}
              {socials.twitter && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="text-white/65 hover:text-teal hover:-translate-y-[3px] transition-all duration-200"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* ── Columns 2-3: Navigation sections ─────────────────────── */}
          {footer.sections?.map((section, i) => (
            <div key={section.id || i} className="flex flex-col gap-[30px]">

              {/* Column heading */}
              <h4 className="m-0 font-mono text-[0.75rem] font-semibold uppercase tracking-[3px] text-teal">
                {section.title}
              </h4>

              {/* Links */}
              <ul className="list-none p-0 m-0 flex flex-col gap-3">
                {section.links?.map((item, j) => (
                  <li key={(item as any).id || j}>
                    <CMSLink
                      link={(item as any).link}
                      className={cn(
                        'group inline-flex items-center no-underline',
                        'text-white/65 hover:text-white hover:pl-2',
                        'transition-all duration-200',
                      )}
                    >
                      {/* Arrow that slides in on hover */}
                      <span className="font-mono text-teal text-[0.85rem] opacity-0 max-w-0 overflow-hidden transition-all duration-200 group-hover:opacity-100 group-hover:max-w-[20px] group-hover:mr-2">
                        →
                      </span>
                      {(item as any).link?.label}
                    </CMSLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ── Column 4: Contact Info ────────────────────────────────── */}
          {hasContact && (
            <div className="flex flex-col gap-[30px] md:col-span-2 lg:col-span-1">

              {/* Column heading */}
              <h4 className="m-0 font-mono text-[0.75rem] font-semibold uppercase tracking-[3px] text-teal">
                Contact Info
              </h4>

              <div className="flex flex-col gap-5">

                {/* Phone numbers */}
                {(contactInfo.phone1 || contactInfo.phone2) && (
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[0.65rem] uppercase tracking-[1px] text-white/65">
                      Call Us
                    </span>
                    {contactInfo.phone1 && (
                      <a
                        href={`tel:${String(contactInfo.phone1).replace(/\D/g, '')}`}
                        className="text-white text-[1rem] font-medium no-underline hover:text-teal transition-colors duration-200"
                      >
                        {contactInfo.phone1}
                      </a>
                    )}
                    {contactInfo.phone2 && (
                      <a
                        href={`tel:${String(contactInfo.phone2).replace(/\D/g, '')}`}
                        className="text-white text-[0.9rem] font-medium no-underline hover:text-teal transition-colors duration-200 mt-1"
                      >
                        {contactInfo.phone2}
                      </a>
                    )}
                  </div>
                )}

                {/* Email */}
                {contactInfo.email && (
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[0.65rem] uppercase tracking-[1px] text-white/65">
                      Email
                    </span>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-white text-[1rem] font-medium no-underline hover:text-teal transition-colors duration-200"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                )}

                {/* Hours */}
                {contactInfo.hours && (
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[0.65rem] uppercase tracking-[1px] text-white/65">
                      Hours
                    </span>
                    <span className="text-white text-[0.9rem] font-medium">
                      {contactInfo.hours}
                    </span>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────── */}
      <div className={cn(
        'relative z-[2]',
        'border-t border-white/[0.05]',
        'px-[5%] py-[28px]',
        'flex flex-col md:flex-row md:items-center md:justify-between gap-5',
        'font-mono text-[0.7rem] tracking-[1px] text-white/30',
      )}>
        <div>{copyrightText}</div>

        {footer.legalLinks && footer.legalLinks.length > 0 && (
          <div className="flex items-center gap-6">
            {footer.legalLinks.map((item, i) => (
              <CMSLink
                key={(item as any).id || i}
                link={(item as any).link}
                className="text-white/30 hover:text-white transition-colors duration-200 no-underline"
              >
                {(item as any).link?.label}
              </CMSLink>
            ))}
          </div>
        )}
      </div>

    </footer>
  )
}
