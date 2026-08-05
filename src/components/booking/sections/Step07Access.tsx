// src/components/booking/sections/Step07Access.tsx
// Compact 2×2 dropdown layout (Geraldine, 2026-07): Pets + Children on one row,
// Access + Referral on the next. Keeping it short leaves room for the agreement
// checkbox + Submit button, now that the Terms step was removed from the funnel.
'use client'

import React, { useId } from 'react'
import { PawPrint, Baby, KeyRound, Search } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'

const PET_TYPES = ['Dog', 'Cat', 'Bird', 'Other']

const ACCESS_METHODS = [
  { id: 'key',       label: 'Leave a Key' },
  { id: 'keypad',    label: 'Keypad / Code' },
  { id: 'open',      label: 'Open Door / Someone Home' },
  { id: 'concierge', label: 'Concierge / Super' },
  { id: 'other',     label: 'Other' },
]

const REFERRAL_OPTIONS = [
  { value: 'google',    label: 'Google Search' },
  { value: 'yelp',      label: 'Yelp' },
  { value: 'facebook',  label: 'Facebook / Instagram' },
  { value: 'neighbour', label: 'Neighbor / Friend' },
  { value: 'flyer',     label: 'Flyer / Postcard' },
  { value: 'repeat',    label: 'Returning Customer' },
  { value: 'other',     label: 'Other' },
]

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontWeight: 700,
  color: 'rgba(74,90,106,0.9)',
  marginBottom: '6px',
  display: 'block',
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px 12px 42px',
  border: '1px solid rgba(13,27,46,0.1)',
  background: 'white',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.3s, box-shadow 0.3s',
  borderRadius: 0,
  cursor: 'pointer',
  appearance: 'none',
}

const onFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
  e.target.style.borderColor = 'var(--color-teal)'
  e.target.style.boxShadow = '0 0 0 4px rgba(23,176,171,0.05)'
}
const onBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
  e.target.style.borderColor = 'rgba(13,27,46,0.1)'
  e.target.style.boxShadow = 'none'
}

// Labeled select with a leading icon.
function IconSelect({
  label, icon: Icon, value, onChange, children, required,
}: {
  label: string
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
  required?: boolean
}) {
  // htmlFor/id gives each select an accessible name for screen readers and agents.
  const id = useId()
  return (
    <div>
      <label htmlFor={id} style={labelStyle}>
        {label} {required && <span style={{ color: 'var(--color-teal)' }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <Icon size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none', zIndex: 1 }} />
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} onFocus={onFocus} onBlur={onBlur} style={selectStyle} required={required}>
          {children}
        </select>
      </div>
    </div>
  )
}

export function Step07Access() {
  const { bookingData, togglePets, toggleChildren, togglePetType, updateAccessMethod, updateReferralSource } =
    useBooking()
  const { hasPets, hasChildren, pets, accessMethod, referralSource } = bookingData

  return (
    <div>
      <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', fontWeight: 900, letterSpacing: '-1.5px', color: 'var(--color-navy-deep)', marginBottom: '32px' }}>
        Conditions &amp; Access.
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Row 1 — Pets | Children */}
        <IconSelect
          label="Pets in the Home?"
          icon={PawPrint}
          value={hasPets ? 'yes' : 'no'}
          onChange={(v) => { const yes = v === 'yes'; if (yes !== hasPets) togglePets() }}
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </IconSelect>

        <IconSelect
          label="Children in the Home?"
          icon={Baby}
          value={hasChildren ? 'yes' : 'no'}
          onChange={(v) => { const yes = v === 'yes'; if (yes !== hasChildren) toggleChildren() }}
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </IconSelect>

        {/* Pet type chips — only when pets = Yes */}
        {hasPets && (
          <div style={{ gridColumn: 'span 2', marginTop: '-4px' }}>
            <label style={{ ...labelStyle, marginBottom: '8px' }}>What kind of pets?</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {PET_TYPES.map((pet) => {
                const sel = pets.includes(pet)
                return (
                  <button
                    type="button"
                    key={pet}
                    onClick={() => togglePetType(pet)}
                    style={{
                      padding: '8px 16px',
                      border: `1px solid ${sel ? 'var(--color-teal)' : 'rgba(13,27,46,0.12)'}`,
                      background: sel ? '#e0f5f4' : 'white',
                      color: sel ? 'var(--color-navy-deep)' : 'rgba(74,90,106,0.75)',
                      fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', borderRadius: 0,
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {pet}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Row 2 — Access method | Referral */}
        <IconSelect
          label="How will our team access the property?"
          icon={KeyRound}
          value={accessMethod}
          onChange={updateAccessMethod}
          required
        >
          <option value="">Select one…</option>
          {ACCESS_METHODS.map(({ id, label }) => (
            <option key={id} value={id}>{label}</option>
          ))}
        </IconSelect>

        <IconSelect
          label="How did you hear about us?"
          icon={Search}
          value={referralSource}
          onChange={updateReferralSource}
        >
          <option value="">Select one…</option>
          {REFERRAL_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </IconSelect>

      </div>
    </div>
  )
}
