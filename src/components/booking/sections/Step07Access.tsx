// src/components/booking/sections/Step07Access.tsx
'use client'

import React from 'react'
import { PawPrint, Baby, KeyRound, Hash, DoorOpen, ConciergeBell, HelpCircle, Search } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'

const PET_TYPES = ['Dog', 'Cat', 'Bird', 'Other']

const ACCESS_METHODS = [
  { id: 'key',       label: 'Leave a Key',      icon: KeyRound },
  { id: 'keypad',    label: 'Keypad / Code',    icon: Hash },
  { id: 'open',      label: 'Open Door',        icon: DoorOpen },
  { id: 'concierge', label: 'Concierge / Super', icon: ConciergeBell },
  { id: 'other',     label: 'Other',            icon: HelpCircle },
]

const REFERRAL_OPTIONS = [
  { value: '',            label: 'Select one…' },
  { value: 'google',      label: 'Google Search' },
  { value: 'yelp',        label: 'Yelp' },
  { value: 'facebook',    label: 'Facebook / Instagram' },
  { value: 'neighbour',   label: 'Neighbour / Friend' },
  { value: 'flyer',       label: 'Flyer / Postcard' },
  { value: 'repeat',      label: 'Returning Customer' },
  { value: 'other',       label: 'Other' },
]

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontWeight: 700,
  color: 'rgba(74,90,106,0.9)',
  marginBottom: '10px',
  display: 'block',
}

const sectionDivider: React.CSSProperties = {
  borderBottom: '1px solid rgba(13,27,46,0.06)',
  marginBottom: '32px',
  paddingBottom: '32px',
}

export function Step07Access() {
  const { bookingData, togglePets, toggleChildren, togglePetType, updateAccessMethod, updateReferralSource } =
    useBooking()
  const { hasPets, hasChildren, pets, accessMethod, referralSource } = bookingData

  return (
    <div>
      <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', fontWeight: 900, letterSpacing: '-1.5px', color: 'var(--color-navy-deep)', marginBottom: '36px' }}>
        Conditions & Access.
      </h2>

      {/* ── Pets ─────────────────────────────────────────────── */}
      <div style={sectionDivider}>
        <label style={labelStyle}>Pets in the Home?</label>

        {/* Yes / No toggle */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {(['Yes', 'No'] as const).map((opt) => {
            const active = opt === 'Yes' ? hasPets : !hasPets
            return (
              <div
                key={opt}
                onClick={opt === 'Yes' ? () => { if (!hasPets) togglePets() } : () => { if (hasPets) togglePets() }}
                style={{
                  border: `1px solid ${active ? 'var(--color-teal)' : 'rgba(13,27,46,0.1)'}`,
                  padding: '10px 28px',
                  cursor: 'pointer',
                  background: active ? '#e0f5f4' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'border-color 0.2s, background 0.2s, color 0.2s',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  color: active ? 'var(--color-navy-deep)' : 'rgba(74,90,106,0.65)',
                }}
              >
                <PawPrint size={14} style={{ color: active ? 'var(--color-teal)' : 'rgba(74,90,106,0.4)' }} />
                {opt}
              </div>
            )
          })}
        </div>

        {/* Pet type chips — always rendered, collapsed when hasPets is false */}
        <div
          aria-hidden={!hasPets}
          style={{
            maxHeight: hasPets ? '220px' : '0',
            opacity: hasPets ? 1 : 0,
            overflow: 'hidden',
            marginTop: hasPets ? '18px' : '0',
            transition: 'max-height 0.3s ease-out, opacity 0.2s ease-out, margin-top 0.3s ease-out',
          }}
        >
          <label style={{ ...labelStyle, marginBottom: '8px' }}>What kind of pets?</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {PET_TYPES.map((pet) => {
              const sel = pets.includes(pet)
              return (
                <div
                  key={pet}
                  onClick={() => togglePetType(pet)}
                  style={{
                    border: `1px solid ${sel ? 'var(--color-teal)' : 'rgba(13,27,46,0.1)'}`,
                    padding: '7px 18px',
                    cursor: 'pointer',
                    background: sel ? '#e0f5f4' : 'white',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: sel ? 'var(--color-navy-deep)' : 'rgba(74,90,106,0.7)',
                    transition: 'border-color 0.2s, background 0.2s, color 0.2s',
                  }}
                  onMouseEnter={(e) => { if (!sel) (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-teal)' }}
                  onMouseLeave={(e) => { if (!sel) (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(13,27,46,0.1)' }}
                >
                  {pet}
                  {sel && <span style={{ marginLeft: '6px', color: 'var(--color-teal)', fontSize: '0.7rem' }}>✓</span>}
                </div>
              )
            })}
          </div>
          <p style={{ marginTop: '8px', fontSize: '0.75rem', color: 'rgba(74,90,106,0.65)', lineHeight: 1.5 }}>
            A small pet fee may apply to ensure a thorough clean.
          </p>
        </div>
      </div>

      {/* ── Children ─────────────────────────────────────────── */}
      <div style={sectionDivider}>
        <label style={labelStyle}>Children Present?</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          {(['Yes', 'No'] as const).map((opt) => {
            const active = opt === 'Yes' ? hasChildren : !hasChildren
            return (
              <div
                key={opt}
                onClick={opt === 'Yes' ? () => { if (!hasChildren) toggleChildren() } : () => { if (hasChildren) toggleChildren() }}
                style={{
                  border: `1px solid ${active ? 'var(--color-teal)' : 'rgba(13,27,46,0.1)'}`,
                  padding: '10px 28px',
                  cursor: 'pointer',
                  background: active ? '#e0f5f4' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'border-color 0.2s, background 0.2s, color 0.2s',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  color: active ? 'var(--color-navy-deep)' : 'rgba(74,90,106,0.65)',
                }}
              >
                <Baby size={14} style={{ color: active ? 'var(--color-teal)' : 'rgba(74,90,106,0.4)' }} />
                {opt}
              </div>
            )
          })}
        </div>
        <p style={{ marginTop: '8px', fontSize: '0.75rem', color: 'rgba(74,90,106,0.65)' }}>
          We use eco-friendly, child-safe products.
        </p>
      </div>

      {/* ── Access Method ─────────────────────────────────────── */}
      <div style={sectionDivider}>
        <label style={labelStyle}>
          How will our team access the property? <span style={{ color: 'var(--color-teal)' }}>*</span>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
          {ACCESS_METHODS.map(({ id, label, icon: Icon }) => {
            const sel = accessMethod === id
            return (
              <div
                key={id}
                onClick={() => updateAccessMethod(id)}
                style={{
                  border: `1px solid ${sel ? 'var(--color-teal)' : 'rgba(13,27,46,0.1)'}`,
                  padding: '14px 12px',
                  cursor: 'pointer',
                  background: sel ? '#e0f5f4' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => { if (!sel) (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-teal)' }}
                onMouseLeave={(e) => { if (!sel) (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(13,27,46,0.1)' }}
              >
                <Icon size={15} style={{ color: sel ? 'var(--color-teal)' : 'rgba(74,90,106,0.5)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: sel ? 'var(--color-navy-deep)' : 'rgba(74,90,106,0.75)' }}>{label}</span>
                {sel && <div style={{ marginLeft: 'auto', width: '14px', height: '14px', border: '1px solid var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', color: 'var(--color-teal)', flexShrink: 0 }}>✓</div>}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Referral Source ───────────────────────────────────── */}
      <div>
        <label style={labelStyle}>How Did You Hear About Us?</label>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.45)', pointerEvents: 'none', zIndex: 1 }} />
          <select
            value={referralSource}
            onChange={(e) => updateReferralSource(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 42px',
              border: '1px solid rgba(13,27,46,0.1)',
              background: 'white',
              fontSize: '0.92rem',
              outline: 'none',
              borderRadius: 0,
              cursor: 'pointer',
              appearance: 'none' as const,
              transition: 'border-color 0.3s',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--color-teal)' }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(13,27,46,0.1)' }}
          >
            {REFERRAL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
