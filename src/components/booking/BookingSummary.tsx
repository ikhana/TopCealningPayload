// src/components/booking/BookingSummary.tsx
// Right-column panel.
//
// Geraldine, 2026-09-21: for area-priced cleaning she wants "a complete
// breakdown of everything the customer selected and the estimated total price",
// updating live as areas, add-on quantities and frequency change — replacing the
// old "1 add-on selected" line, which told the customer nothing.
//
// Everything else keeps the request-only panel. Her instruction is explicit that
// the automatic quote is for the services whose pricing is settled, and that
// "for the other services where we cannot calculate an exact price automatically
// yet, we can continue using the current Request a Quote / We'll confirm pricing
// system." Showing a confident number for a job nobody has priced is worse than
// showing none.
'use client'

import React from 'react'
import { Gem, Sparkles, BadgeCheck, ClipboardCheck } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'
import {
  quoteAreas,
  quoteHourly,
  areaLineItems,
  isAreaPriced,
  effectiveTier,
  activeCondition,
  conditionUplift,
  HOURLY_DISCLAIMER,
  type RoomCounts,
} from '@/data/pricing'
import { addOnQty, addOnTotal, addOnsTotal, addOnVariant, getAddOn } from '@/data/addons'

const SERVICE_LABELS: Record<string, string> = {
  residential:  'Residential Cleaning',
  'movein-out': 'Move In / Out',
  airbnb:       'AirBnB Special',
  custom:       'Custom Cleaning',
  commercial:   'Commercial Office',
  renovation:   'Post Renovation',
  hoarding:     'Hoarding Cleanup',
  handyman:     'Handyman Services',
}

const FREQUENCY_LABELS: Record<string, string> = {
  'one-time': 'One-time',
  weekly: 'Weekly',
  biweekly: 'Bi-Weekly',
  monthly: 'Monthly',
  '3weekly': 'Every 3 Weeks',
  '8weekly': 'Every 8 Weeks',
}

const TRUST = [
  { icon: Gem,        title: 'Premium Quality',         desc: 'Top-tier service & attention to detail' },
  { icon: Sparkles,   title: 'Quality Products',        desc: 'Chosen to deliver outstanding results' },
  { icon: BadgeCheck, title: 'Satisfaction Guaranteed', desc: "We're not happy until you are" },
]

const ESTIMATE_NOTE =
  'Your estimated total is based on the information provided. Final pricing may be adjusted ' +
  'if the actual condition or scope of the property differs from the information submitted.'

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)' }

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ ...mono, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'rgba(74,90,106,0.55)', margin: '14px 0 6px' }}>
      {children}
    </div>
  )
}

function Line({ label, value, muted, accent }: { label: string; value: string; muted?: boolean; accent?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '3px 0', fontSize: '0.82rem', color: accent ? 'var(--color-teal)' : muted ? 'rgba(74,90,106,0.7)' : 'var(--color-navy-deep)' }}>
      <span style={{ minWidth: 0 }}>{label}</span>
      <span style={{ ...mono, flexShrink: 0, fontWeight: 600 }}>{value}</span>
    </div>
  )
}

export function BookingSummary() {
  const { bookingData } = useBooking()
  const { serviceType, selectedExtras, extraQuantities, extraVariants, property, serviceExtras, frequency, customHourly } = bookingData

  const priced = isAreaPriced(serviceType)
  const hourly = priced && customHourly?.enabled === true

  const areas: RoomCounts = property.areas ?? {}
  const condition = activeCondition(serviceExtras.lastCleaned, serviceExtras.homeCondition)
  const tier = effectiveTier(serviceExtras.cleaningType, condition)
  const lines = areaLineItems(areas, tier)
  const extrasTotal = addOnsTotal(selectedExtras, extraQuantities, extraVariants)
  const quote = quoteAreas(areas, tier, frequency, extrasTotal, conditionUplift(condition))
  const hourlyQuote = quoteHourly(customHourly?.cleaners ?? 2, customHourly?.hoursPerCleaner ?? 3)

  const hasSomething = hourly || lines.length > 0 || selectedExtras.length > 0
  const total = hourly ? hourlyQuote.total : quote.total

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      <div style={{ ...mono, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'rgba(74,90,106,0.6)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        {priced ? 'Your Cleaning Summary' : 'Request Summary'}
        <div style={{ flex: 1, height: '1px', background: 'rgba(13,27,46,0.08)' }} />
      </div>

      {/* ── Priced path: the live itemised quote ─────────────────────── */}
      {priced && hasSomething && (
        <div style={{ border: '1px solid rgba(13,27,46,0.08)', background: 'white', padding: '16px 18px', marginBottom: '20px' }}>

          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-navy-deep)' }}>
            {hourly ? 'Custom Hourly Cleaning' : (serviceExtras.cleaningType || 'Regular') + ' Cleaning'}
          </div>

          {hourly ? (
            <>
              <SectionHeading>Time Booked</SectionHeading>
              <Line label="Number of Cleaners" value={String(hourlyQuote.cleaners)} />
              <Line label="Hours Per Cleaner" value={`${hourlyQuote.hoursPerCleaner} hours`} />
              <Line label="Total Labor Hours" value={`${hourlyQuote.totalLaborHours} hours`} muted />
              <Line label="Hourly rate" value={`$${hourlyQuote.rate} / hour`} muted />
            </>
          ) : (
            <>
              {lines.length > 0 && (
                <>
                  <SectionHeading>Areas</SectionHeading>
                  {lines.map((l) => (
                    <Line
                      key={l.key}
                      label={l.qty > 1 ? `${l.qty} ${l.label}s` : l.label}
                      value={`$${l.total}`}
                    />
                  ))}
                </>
              )}

              {selectedExtras.length > 0 && (
                <>
                  <SectionHeading>Add-On Services</SectionHeading>
                  {selectedExtras.map((id) => {
                    const addon = getAddOn(id)
                    if (!addon) return null
                    const qty = addOnQty(id, extraQuantities)
                    return (
                      <Line
                        key={id}
                        // Quantity in brackets only when the add-on takes one, so
                        // a flat charge does not read as "Wall Spot Cleaning (1)".
                        label={
                          addon.quantity
                            ? `${addon.label} (${qty})`
                            : addon.variants
                              ? `${addon.label} (${addOnVariant(id, extraVariants)?.label})`
                              : addon.label
                        }
                        value={`$${addOnTotal(id, extraQuantities, extraVariants)}`}
                      />
                    )
                  })}
                </>
              )}

              {quote.minimumApplied && (
                <p style={{ margin: '10px 0 0', fontSize: '0.72rem', lineHeight: 1.45, color: 'rgba(74,90,106,0.7)' }}>
                  A ${quote.minimum} minimum service charge applies to this booking.
                </p>
              )}

              {quote.discountRate > 0 && (
                <>
                  <SectionHeading>Service Frequency</SectionHeading>
                  <Line
                    label={`${FREQUENCY_LABELS[frequency] ?? frequency} (${Math.round(quote.discountRate * 100)}% off)`}
                    value={`-$${quote.discountAmount}`}
                    accent
                  />
                </>
              )}
            </>
          )}

          {/* Estimated Total, deliberately the loudest thing in the panel */}
          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(13,27,46,0.1)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-navy-deep)' }}>
              Estimated Total
            </span>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-1px', color: 'var(--color-navy-deep)' }}>
              ${total}
            </span>
          </div>

          <p style={{ margin: '10px 0 0', fontSize: '0.7rem', lineHeight: 1.5, color: 'rgba(74,90,106,0.65)' }}>
            {hourly ? HOURLY_DISCLAIMER : ESTIMATE_NOTE}
          </p>
        </div>
      )}

      {/* ── Priced but nothing chosen yet ────────────────────────────── */}
      {priced && !hasSomething && (
        <p style={{ fontSize: '0.85rem', color: 'rgba(74,90,106,0.75)', lineHeight: 1.6, marginBottom: '20px' }}>
          Choose the areas you&apos;d like cleaned and your estimate will appear here.
        </p>
      )}

      {/* ── Quote-only path, unchanged ───────────────────────────────── */}
      {!priced && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(23,176,171,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ClipboardCheck size={30} style={{ color: 'var(--color-teal)' }} />
            </div>
          </div>

          <p style={{ textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-navy-deep)', lineHeight: 1.3, margin: '0 0 22px', letterSpacing: '-0.5px' }}>
            You&apos;re one step closer to a{' '}
            <em style={{ fontWeight: 400, fontStyle: 'italic', color: 'var(--color-teal)' }}>beautifully</em>{' '}
            clean space.
          </p>

          {serviceType && (
            <div style={{ marginBottom: '20px', padding: '14px 16px', background: 'rgba(13,27,46,0.02)', border: '1px solid rgba(13,27,46,0.06)' }}>
              <div style={{ ...mono, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(74,90,106,0.5)', marginBottom: '4px' }}>
                Service
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-navy-deep)' }}>
                {SERVICE_LABELS[serviceType] || serviceType}
              </div>
              {selectedExtras.length > 0 && (
                <div style={{ ...mono, fontSize: '0.7rem', color: 'var(--color-teal)', marginTop: '3px' }}>
                  {selectedExtras.length} add-on{selectedExtras.length > 1 ? 's' : ''} selected
                </div>
              )}
            </div>
          )}

          <div style={{ padding: '16px', marginBottom: '26px', background: 'rgba(23,176,171,0.06)', border: '1px solid rgba(23,176,171,0.15)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-navy-deep)', margin: 0, lineHeight: 1.55, fontWeight: 500 }}>
              This is a request form only. We&apos;ll review your details and confirm final pricing before your appointment.
            </p>
          </div>
        </>
      )}

      {/* Trust badges — pinned to the bottom */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: 'auto' }}>
        {TRUST.map(({ icon: Icon, title, desc }) => (
          <div key={title} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Icon size={22} style={{ color: 'var(--color-teal)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ ...mono, fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-navy-deep)' }}>
                {title}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(74,90,106,0.75)', lineHeight: 1.4, marginTop: '2px' }}>
                {desc}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
