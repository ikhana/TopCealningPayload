// src/components/booking/sections/Step04AddOns.tsx
'use client'

import React, { useState } from 'react'
import {
  Snowflake, Flame, Archive, AppWindow, AlignJustify, WalletCards,
  UtensilsCrossed, CheckSquare, Shirt, Box, LayoutGrid, Wind,
  Lightbulb, Clock, Info, ChevronDown, ChevronUp, PawPrint, Car, BedDouble, Fan
} from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'
import {
  ADD_ONS,
  MAX_ADDON_QTY,
  addOnPriceLabel,
  addOnQty,
  addOnTotal,
  addOnsTotal,
  type AddOn,
} from '@/data/addons'
import {
  quoteAreas,
  isAreaPriced,
  effectiveTier,
  activeCondition,
  conditionUplift,
  quoteHourly,
  HOURLY_MIN_CLEANERS,
  HOURLY_MAX_CLEANERS,
  HOURLY_MIN_HOURS_PER_CLEANER,
  HOURLY_MAX_HOURS_PER_CLEANER,
  HOURLY_DISCLAIMER,
  type RoomCounts,
} from '@/data/pricing'

// Icons stay here rather than in @/data/addons: that module is imported by the
// server-side submit flow, and dragging a React icon component into it would
// pull lucide into the server bundle for no reason.
const ICONS: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  'inside-fridge': Snowflake,
  'inside-oven': Flame,
  'inside-cabinets': Archive,
  'inside-windows': AppWindow,
  baseboards: AlignJustify,
  walls: WalletCards,
  dishes: UtensilsCrossed,
  closets: CheckSquare,
  ironing: Shirt,
  laundry: Shirt,
  organizing: Box,
  balcony: LayoutGrid,
  'pet-hair': PawPrint,
  'ceiling-fans': Wind,
  chandeliers: Lightbulb,
  'same-day': Clock,
  'garage-sweep': Car,
  'bed-linens': BedDouble,
  'air-vents': Fan,
  'window-tracks': AppWindow,
}

/**
 * The −/+ stepper, shown directly beneath the add-on it belongs to.
 *
 * Geraldine, 2026-09-21: "once the customer clicks the service, the quantity
 * selector should appear immediately underneath or next to the selected
 * service." Putting it anywhere else means the customer changes a number and
 * watches a total move somewhere off-screen.
 */
function QtyStepper({ addon, qty, onChange }: { addon: AddOn; qty: number; onChange: (n: number) => void }) {
  const btn = (enabled: boolean): React.CSSProperties => ({
    width: '26px', height: '26px', flexShrink: 0,
    border: '1px solid rgba(13,27,46,0.15)',
    background: 'white',
    color: enabled ? 'var(--color-navy-deep)' : 'rgba(74,90,106,0.3)',
    fontSize: '0.95rem', lineHeight: 1, fontWeight: 700,
    cursor: enabled ? 'pointer' : 'not-allowed',
    borderRadius: 0,
  })

  return (
    // stopPropagation: the whole card is a click target that toggles the add-on
    // off. Without this, pressing + would deselect the thing you are counting.
    <div onClick={(e) => e.stopPropagation()} style={{ marginTop: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button type="button" aria-label={`Fewer ${addon.label}`} disabled={qty <= 1}
          onClick={() => onChange(qty - 1)} style={btn(qty > 1)}>−</button>
        <span aria-live="polite" style={{ minWidth: '20px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-navy-deep)' }}>
          {qty}
        </span>
        <button type="button" aria-label={`More ${addon.label}`} disabled={qty >= MAX_ADDON_QTY}
          onClick={() => onChange(qty + 1)} style={btn(qty < MAX_ADDON_QTY)}>+</button>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-teal)' }}>
          ${addOnTotal(addon.id, { [addon.id]: qty })}
        </span>
      </div>
      {addon.hint && (
        <p style={{ margin: '6px 0 0', fontSize: '0.68rem', lineHeight: 1.4, color: 'rgba(74,90,106,0.7)' }}>
          {addon.hint}
        </p>
      )}
    </div>
  )
}

/** Labelled −/+ row for the two Custom Hourly inputs. */
function HourlyStepper({
  label, hint, value, min, max, onChange,
}: {
  label: string
  hint?: string
  value: number
  min: number
  max: number
  onChange: (n: number) => void
}) {
  const btn = (enabled: boolean): React.CSSProperties => ({
    width: '34px', height: '34px', flexShrink: 0,
    border: '1px solid rgba(13,27,46,0.15)', background: 'white',
    color: enabled ? 'var(--color-navy-deep)' : 'rgba(74,90,106,0.3)',
    fontSize: '1.05rem', lineHeight: 1, fontWeight: 700,
    cursor: enabled ? 'pointer' : 'not-allowed', borderRadius: 0,
  })
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: 'rgba(74,90,106,0.9)', marginBottom: '8px' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button type="button" aria-label={`Fewer ${label}`} disabled={value <= min}
          onClick={() => onChange(value - 1)} style={btn(value > min)}>−</button>
        <span aria-live="polite" style={{ minWidth: '38px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-navy-deep)' }}>
          {value}
        </span>
        <button type="button" aria-label={`More ${label}`} disabled={value >= max}
          onClick={() => onChange(value + 1)} style={btn(value < max)}>+</button>
      </div>
      {hint && <p style={{ margin: '6px 0 0', fontSize: '0.7rem', color: 'rgba(74,90,106,0.7)' }}>{hint}</p>}
    </div>
  )
}

export function Step04AddOns() {
  const { bookingData, toggleExtra, setExtraQuantity, updateCustomHourly } = useBooking()
  const { selectedExtras, extraQuantities, serviceType, property, serviceExtras, frequency, customHourly } = bookingData
  const [infoOpen, setInfoOpen] = useState(false)
  const hourlyOn = customHourly?.enabled === true
  const hourly = quoteHourly(customHourly?.cleaners ?? 2, customHourly?.hoursPerCleaner ?? 3)

  // The full quote, shown at the END of this step (Geraldine, 2026-09-21:
  // "Price has to be shown at the last / after client see the additional
  // service"). Step 3 no longer prints a total, so this is the first and only
  // place the customer sees one — which is the point: a number that appears
  // before the add-ons are on screen is a number that changes under them.
  const areas: RoomCounts = property.areas ?? {}
  const condition = activeCondition(serviceExtras.lastCleaned, serviceExtras.homeCondition)
  const tier = effectiveTier(serviceExtras.cleaningType, condition)
  const extrasTotal = addOnsTotal(selectedExtras, extraQuantities)
  const quote = quoteAreas(areas, tier, frequency, extrasTotal, conditionUplift(condition))
  const showQuote = isAreaPriced(serviceType)

  return (
    <div>
      <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', fontWeight: 900, letterSpacing: '-1.5px', color: 'var(--color-navy-deep)', marginBottom: '28px' }}>
        Customize Service.
      </h2>

      {/* Collapsible info note */}
      <div style={{ marginBottom: '28px', border: '1px solid rgba(13,27,46,0.1)', background: 'white' }}>
        <button
          type="button"
          onClick={() => setInfoOpen(!infoOpen)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(74,90,106,0.8)' }}
        >
          <Info size={13} style={{ color: 'var(--color-teal)', flexShrink: 0 }} />
          Important information about add-ons
          <span style={{ marginLeft: 'auto' }}>
            {infoOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </button>
        {infoOpen && (
          <div style={{ padding: '0 16px 14px', fontSize: '0.8rem', lineHeight: 1.7, color: 'rgba(74,90,106,0.85)', borderTop: '1px dashed rgba(13,27,46,0.08)' }}>
            <p style={{ marginTop: '12px' }}>Interior appliances (oven, fridge, cabinets, windows, baseboards, walls) are not included in regular cleaning — they must be selected below.</p>
            <p style={{ marginTop: '8px' }}><strong>Same Day Bookings:</strong> an additional fee applies if not selected when booked.</p>
          </div>
        )}
      </div>

      {/*
        Hidden in hourly mode. Geraldine, 2026-09-21: for Custom Cleaning the
        customer "should only select Number of Cleaners and Hours Per Cleaner",
        and add-ons "should not be added to the Custom Cleaning total". Leaving
        the grid on screen but uncharged would be the worst of both — the
        customer ticks things and the total does not move.

        The selections themselves are kept in state, so switching back to areas
        restores whatever was already chosen.
      */}
      <div style={{ display: hourlyOn ? 'none' : 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '10px' }}>
        {ADD_ONS.map((addon) => {
          const { id, label } = addon
          const Icon = ICONS[id] ?? Archive
          const sel = selectedExtras.includes(id)
          const qty = addOnQty(id, extraQuantities)
          return (
            <div
              key={id}
              onClick={() => toggleExtra(id)}
              style={{
                border: `1px solid ${sel ? 'var(--color-teal)' : 'rgba(13,27,46,0.1)'}`,
                padding: '14px',
                cursor: 'pointer',
                background: sel ? '#e0f5f4' : 'white',
                transition: 'all 0.3s cubic-bezier(0.25,1,0.5,1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
              onMouseEnter={(e) => { if (!sel) { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-teal)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)' } }}
              onMouseLeave={(e) => { if (!sel) { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(13,27,46,0.1)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' } }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Icon size={15} style={{ color: sel ? 'var(--color-teal)' : 'rgba(74,90,106,0.5)', flexShrink: 0 }} />
                {sel && (
                  <div style={{ width: '14px', height: '14px', border: '1px solid var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: 'var(--color-teal)', flexShrink: 0 }}>✓</div>
                )}
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-navy-deep)', lineHeight: 1.3 }}>{label}</div>
                <div style={{ marginTop: '3px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(74,90,106,0.75)' }}>
                  {addOnPriceLabel(addon)}
                </div>
              </div>

              {sel && addon.quantity && (
                <QtyStepper addon={addon} qty={qty} onChange={(n) => setExtraQuantity(id, n)} />
              )}
            </div>
          )
        })}
      </div>

      {/* ── Custom Hourly, when switched on ──────────────────────────────── */}
      {showQuote && hourlyOn && (
        <div style={{ marginTop: '24px', border: '1px solid var(--color-teal)', background: '#f2fbfa', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-navy-deep)' }}>Custom Hourly Cleaning</div>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'rgba(74,90,106,0.85)' }}>
                Book by the hour and choose the number of cleaners and hours that works best for you.
              </p>
            </div>
            <button
              type="button"
              onClick={() => updateCustomHourly({ enabled: false })}
              style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-teal)', padding: 0 }}
            >
              Back to areas
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <HourlyStepper
              label="Number of Cleaners"
              value={hourly.cleaners}
              min={HOURLY_MIN_CLEANERS}
              max={HOURLY_MAX_CLEANERS}
              onChange={(n) => updateCustomHourly({ cleaners: n })}
            />
            <HourlyStepper
              label="Hours Per Cleaner"
              hint={`Minimum ${HOURLY_MIN_HOURS_PER_CLEANER} hours per cleaner`}
              value={hourly.hoursPerCleaner}
              min={HOURLY_MIN_HOURS_PER_CLEANER}
              max={HOURLY_MAX_HOURS_PER_CLEANER}
              onChange={(n) => updateCustomHourly({ hoursPerCleaner: n })}
            />
          </div>

          {/* Rate card. Shown in full so the customer can see that booking
              longer drops the rate, rather than wondering why it moved. */}
          <div style={{ marginTop: '18px', border: '1px solid rgba(13,27,46,0.08)', background: 'white' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(74,90,106,0.6)', padding: '10px 14px 6px' }}>
              Hourly rates (per cleaner)
            </div>
            {[
              { band: '3 – 4 hours', rate: 35, lo: 3, hi: 4 },
              { band: '5 – 7 hours', rate: 32, lo: 5, hi: 7 },
              { band: '8+ hours',    rate: 30, lo: 8, hi: 99 },
            ].map(({ band, rate, lo, hi }) => {
              const active = hourly.hoursPerCleaner >= lo && hourly.hoursPerCleaner <= hi
              return (
                <div key={band} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 14px', fontSize: '0.82rem', background: active ? '#e0f5f4' : 'transparent', fontWeight: active ? 700 : 400, color: 'var(--color-navy-deep)' }}>
                  <span>{band}</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>${rate} / hour</span>
                </div>
              )
            })}
          </div>

          <div style={{ marginTop: '16px', padding: '16px 18px', background: 'var(--color-navy-deep)', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.75 }}>
                Estimated Total
              </span>
              <span style={{ fontSize: '1.7rem', fontWeight: 900, letterSpacing: '-1px' }}>${hourly.total}</span>
            </div>
            <p style={{ margin: '8px 0 0', fontSize: '0.78rem', opacity: 0.8 }}>
              Total labor hours: {hourly.totalLaborHours} ({hourly.cleaners} cleaner
              {hourly.cleaners > 1 ? 's' : ''} × {hourly.hoursPerCleaner} hours each) at ${hourly.rate} / hour
            </p>
          </div>

          <p style={{ margin: '12px 0 0', fontSize: '0.75rem', lineHeight: 1.55, color: 'rgba(74,90,106,0.8)' }}>
            {HOURLY_DISCLAIMER}
          </p>
        </div>
      )}

      {/* ── The estimate, at the end, once the add-ons have been seen ────── */}
      {showQuote && !hourlyOn && (
        <div style={{ marginTop: '24px', padding: '18px 20px', background: 'var(--color-navy-deep)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.75 }}>
              Estimated Total
            </span>
            <span style={{ fontSize: '1.7rem', fontWeight: 900, letterSpacing: '-1px' }}>
              ${quote.total}
            </span>
          </div>

          {/* Cleaning and add-ons split out, so the number is checkable. The
              home-condition adjustment stays folded into the cleaning line —
              Geraldine, 2026-09-08: no "+25%" line is to be shown. */}
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.12)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', opacity: 0.85 }}>
              <span>Cleaning</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>${quote.total - extrasTotal}</span>
            </div>
            {extrasTotal > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', opacity: 0.85 }}>
                <span>Add-ons ({selectedExtras.length})</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>${extrasTotal}</span>
              </div>
            )}
            {quote.discountRate > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--color-teal-glow, #3dcfca)' }}>
                <span>Recurring discount ({Math.round(quote.discountRate * 100)}%)</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>-${quote.discountAmount}</span>
              </div>
            )}
          </div>

          {quote.minimumApplied && (
            <p style={{ margin: '12px 0 0', fontSize: '0.78rem', lineHeight: 1.5, opacity: 0.8 }}>
              Minimum service charge: ${quote.minimum}. You may add up to $
              {quote.remainingToMinimum} more in cleaning areas at no extra cost.
            </p>
          )}

          <p style={{ margin: '10px 0 0', fontSize: '0.72rem', lineHeight: 1.5, opacity: 0.6 }}>
            Pricing is based on the size, selected areas, service type, and current condition
            of the home. This is an estimate. The exact price is confirmed with you after our call.
          </p>
        </div>
      )}

      {/*
        The way in to hourly. Geraldine, 2026-09-21: it sits BELOW the estimated
        total, once the customer has seen what Regular/Deep would cost. That
        ordering is the whole point — it is an escape hatch for someone who looks
        at the area price and thinks "I only want two hours of help", so it has
        to come after the number that prompts the thought.
      */}
      {showQuote && !hourlyOn && (
        <div style={{ marginTop: '14px', padding: '14px 18px', border: '1px dashed rgba(13,27,46,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-navy-deep)' }}>Want Something Custom?</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(74,90,106,0.8)', fontStyle: 'italic' }}>Prefer to book by time instead?</div>
          </div>
          <button
            type="button"
            onClick={() => updateCustomHourly({ enabled: true })}
            style={{ padding: '11px 20px', background: 'white', border: '1px solid var(--color-teal)', color: 'var(--color-teal)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 0 }}
          >
            Choose Custom Cleaning
          </button>
        </div>
      )}

      {/* Non-area-priced services get no live number, so just the count. */}
      {!showQuote && selectedExtras.length > 0 && (
        <div style={{ marginTop: '20px', padding: '14px 16px', border: '1px solid rgba(23,176,171,0.2)', background: '#e0f5f4', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-navy-deep)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {selectedExtras.length} add-on{selectedExtras.length > 1 ? 's' : ''} selected
          </span>
        </div>
      )}
    </div>
  )
}
