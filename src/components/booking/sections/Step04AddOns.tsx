// src/components/booking/sections/Step04AddOns.tsx
'use client'

import React, { useState } from 'react'
import {
  Snowflake, Flame, Archive, AppWindow, AlignJustify, WalletCards,
  UtensilsCrossed, CheckSquare, Shirt, Box, LayoutGrid, Wind,
  Lightbulb, Clock, Info, ChevronDown, ChevronUp, PawPrint
} from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'
import { EXTRA_PRICES } from '@/utilities/booking-helpers'

const ADD_ONS = [
  { id: 'inside-fridge',   label: 'Inside Fridge',          icon: Snowflake,      price: EXTRA_PRICES['inside-fridge'] },
  { id: 'inside-oven',     label: 'Inside Oven',            icon: Flame,          price: EXTRA_PRICES['inside-oven'] },
  { id: 'inside-cabinets', label: 'Inside Cabinets',        icon: Archive,        price: EXTRA_PRICES['inside-cabinets'] },
  { id: 'inside-windows',  label: 'Inside Windows',         icon: AppWindow,      price: EXTRA_PRICES['inside-windows'] },
  { id: 'baseboards',      label: 'Baseboards',             icon: AlignJustify,   price: EXTRA_PRICES['baseboards'] },
  { id: 'walls',           label: 'Walls',                  icon: WalletCards,    price: EXTRA_PRICES['walls'] },
  { id: 'dishes',          label: 'Washing Dishes',         icon: UtensilsCrossed,price: EXTRA_PRICES['dishes'] },
  { id: 'closets',         label: 'Basement',               icon: CheckSquare,    price: EXTRA_PRICES['closets'] },
  { id: 'ironing',         label: 'Hour(s) of Ironing',     icon: Shirt,          price: EXTRA_PRICES['ironing'] },
  { id: 'laundry',         label: 'Laundry Room',           icon: Shirt,          price: EXTRA_PRICES['laundry'] },
  { id: 'organizing',      label: 'Hour(s) of Organizing',  icon: Box,            price: EXTRA_PRICES['organizing'] },
  { id: 'balcony',         label: 'Balcony Cleaning',       icon: LayoutGrid,     price: EXTRA_PRICES['balcony'] },
  { id: 'pet-hair',        label: 'Pet Hair Clean-up',      icon: PawPrint,            price: EXTRA_PRICES['pet-hair'] },
  { id: 'office',          label: 'Office',                 icon: Archive,        price: EXTRA_PRICES['office'] },
  { id: 'ceiling-fans',    label: 'Ceiling Fans',           icon: Wind,           price: EXTRA_PRICES['ceiling-fans'] },
  { id: 'chandeliers',     label: 'Chandeliers / Lights',   icon: Lightbulb,      price: EXTRA_PRICES['chandeliers'] },
  { id: 'same-day',        label: 'Same Day Booking',       icon: Clock,          price: 40 },
]

export function Step04AddOns() {
  const { bookingData, toggleExtra } = useBooking()
  const { selectedExtras } = bookingData
  const [infoOpen, setInfoOpen] = useState(false)

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

      {/* Add-ons grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '10px' }}>
        {ADD_ONS.map(({ id, label, icon: Icon }) => {
          const sel = selectedExtras.includes(id)
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
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected tally */}
      {selectedExtras.length > 0 && (
        <div style={{ marginTop: '20px', padding: '14px 16px', border: '1px solid rgba(23,176,171,0.2)', background: '#e0f5f4', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-navy-deep)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {selectedExtras.length} add-on{selectedExtras.length > 1 ? 's' : ''} selected
          </span>
        </div>
      )}
    </div>
  )
}
