// src/components/booking/sections/Step03Property.tsx
// Step 3 — Specs. Service-aware: shows different fields per serviceType.
//   Residential        → Type of Cleaning, Bedrooms, Bathrooms
//   Commercial         → Type of Space
//   Airbnb             → Bedrooms, Properties Managed
//   Post-Construction  → Property Type, Completion Status
//   (Approx. Size + photos shown for all; size is optional.)

'use client'

import React, { useId, useRef, useState } from 'react'
import { Ruler, Building2, Bath, Sparkles, Layers, Home, Wrench, ImagePlus, X } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'
import { MAX_MEDIA_FILES } from '@/hooks/useBookingForm'
import type { ServiceCategory, ServiceExtras } from '@/types/booking'
import {
  ROOM_PRICES,
  quoteAreas,
  isAreaPriced,
  type RoomKey,
  type RoomCounts,
  type CleaningTier,
} from '@/data/pricing'

const BEDROOM_OPTIONS = [
  { value: 'studio', label: 'Studio' },
  { value: '1', label: '1 Bedroom' },
  { value: '2', label: '2 Bedrooms' },
  { value: '3', label: '3 Bedrooms' },
  { value: '4', label: '4 Bedrooms' },
  { value: '5', label: '5 Bedrooms' },
  { value: '6', label: '6 Bedrooms' },
]

const BATHROOM_OPTIONS = [1, 2, 3, 4, 5, 6]

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

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px 12px 42px',
  border: '1px solid rgba(13,27,46,0.1)',
  background: 'white',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.3s, box-shadow 0.3s',
  borderRadius: 0,
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none',
}

type FieldEl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
const onFieldFocus = (e: React.FocusEvent<FieldEl>) => {
  e.target.style.borderColor = 'var(--color-teal)'
  e.target.style.boxShadow = '0 0 0 4px rgba(23,176,171,0.05)'
}
const onFieldBlur = (e: React.FocusEvent<FieldEl>) => {
  e.target.style.borderColor = 'rgba(13,27,46,0.1)'
  e.target.style.boxShadow = 'none'
}

// Reusable labeled <select> for the per-service single-option questions.
function SpecSelect({
  label, icon: Icon, value, onChange, options, required,
}: {
  label: string
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  value: string
  onChange: (v: string) => void
  options: string[]
  required?: boolean
}) {
  // htmlFor/id gives the select an accessible name. Without it the label is
  // just an adjacent element and screen readers (and AI agents) see an
  // unlabelled dropdown.
  const id = useId()
  return (
    <div style={{ gridColumn: 'span 2' }}>
      <label htmlFor={id} style={labelStyle}>
        {label} {required && <span style={{ color: 'var(--color-teal)' }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <Icon size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none', zIndex: 1 }} />
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} onFocus={onFieldFocus} onBlur={onFieldBlur} style={selectStyle} required={required}>
          <option value="">Select…</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  )
}

// Handyman intentionally excluded — its Details step is just photos + special instructions.
const WITH_BEDROOMS: ServiceCategory[] = ['residential', 'movein-out', 'airbnb', 'custom', 'hoarding']
const WITH_BATHROOMS: ServiceCategory[] = ['residential', 'movein-out', 'airbnb', 'custom', 'hoarding']

// Display order and labels for the area picker. Keys must match ROOM_PRICES.
const AREA_LIST: Array<{ key: RoomKey; label: string }> = [
  { key: 'bedroom',       label: 'Bedroom' },
  { key: 'fullBathroom',  label: 'Full Bathroom' },
  { key: 'halfBathroom',  label: 'Half Bathroom' },
  { key: 'kitchen',       label: 'Kitchen' },
  { key: 'livingRoom',    label: 'Living Room' },
  { key: 'diningRoom',    label: 'Dining Room' },
  { key: 'familyRoom',    label: 'Family Room' },
  { key: 'office',        label: 'Office' },
  { key: 'laundryRoom',   label: 'Laundry Room' },
  { key: 'stairsHallway', label: 'Stairs / Hallway' },
  { key: 'patioBalcony',  label: 'Patio / Balcony' },
]

const MAX_PER_AREA = 10

// One row: label, unit price for the active tier, and a -/+ stepper.
function AreaRow({
  label, price, count, onChange,
}: {
  label: string
  price: number
  count: number
  onChange: (next: number) => void
}) {
  const selected = count > 0
  const btn = (enabled: boolean): React.CSSProperties => ({
    width: '30px', height: '30px', flexShrink: 0,
    border: '1px solid rgba(13,27,46,0.12)',
    background: 'white',
    color: enabled ? 'var(--color-navy-deep)' : 'rgba(74,90,106,0.3)',
    fontSize: '1rem', lineHeight: 1, fontWeight: 700,
    cursor: enabled ? 'pointer' : 'not-allowed',
    borderRadius: 0,
  })

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 14px',
        border: `1px solid ${selected ? 'var(--color-teal)' : 'rgba(13,27,46,0.1)'}`,
        background: selected ? '#e0f5f4' : 'white',
        transition: 'border-color 0.25s, background 0.25s',
      }}
    >
      <span style={{ flex: 1, fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-navy-deep)' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'rgba(74,90,106,0.75)' }}>
        ${price}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          type="button"
          aria-label={`Remove one ${label}`}
          disabled={count === 0}
          onClick={() => onChange(Math.max(0, count - 1))}
          style={btn(count > 0)}
        >
          −
        </button>
        <span
          aria-live="polite"
          style={{
            minWidth: '22px', textAlign: 'center',
            fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700,
            color: 'var(--color-navy-deep)',
          }}
        >
          {count}
        </span>
        <button
          type="button"
          aria-label={`Add one ${label}`}
          disabled={count >= MAX_PER_AREA}
          onClick={() => onChange(Math.min(MAX_PER_AREA, count + 1))}
          style={btn(count < MAX_PER_AREA)}
        >
          +
        </button>
      </div>
    </div>
  )
}

// The area picker + live estimate.
//
// Pricing rule (Geraldine, 2026-08-20):
//   Final Price = MAX(Minimum Booking Price, Total Price of Selected Areas)
// When the minimum bites we tell the customer how much headroom is left, so the
// floor reads as "you may as well add rooms" rather than as a surcharge.
function AreaSelector({
  counts, tier, onChange,
}: {
  counts: RoomCounts
  tier: CleaningTier
  onChange: (next: RoomCounts) => void
}) {
  const quote = quoteAreas(counts, tier)

  return (
    <div style={{ gridColumn: 'span 2' }}>
      <label style={labelStyle}>
        Areas to Clean <span style={{ color: 'var(--color-teal)' }}>*</span>
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
        {AREA_LIST.map(({ key, label }) => (
          <AreaRow
            key={key}
            label={label}
            price={ROOM_PRICES[key][tier]}
            count={counts[key] ?? 0}
            onChange={(next) => onChange({ ...counts, [key]: next })}
          />
        ))}
      </div>

      {/* Live estimate */}
      <div
        style={{
          marginTop: '16px', padding: '16px 18px',
          background: 'var(--color-navy-deep)', color: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.75 }}>
            Estimated Total
          </span>
          <span style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-1px' }}>
            ${quote.total}
          </span>
        </div>

        {quote.minimumApplied && (
          <p style={{ margin: '10px 0 0', fontSize: '0.8rem', lineHeight: 1.5, opacity: 0.8 }}>
            Minimum service charge: ${quote.minimum}. Your selection comes to $
            {quote.subtotal} — you may add up to ${quote.remainingToMinimum} more in
            cleaning areas at no extra cost.
          </p>
        )}

        <p style={{ margin: '10px 0 0', fontSize: '0.75rem', lineHeight: 1.5, opacity: 0.6 }}>
          This is an estimate. The exact price is confirmed with you after our call.
        </p>
      </div>
    </div>
  )
}

// Short explainer shown under the residential "Type of Cleaning" select.
const CLEANING_TYPE_INFO: Record<string, { badge: string; desc: string }> = {
  'Regular': { badge: 'Maintenance', desc: 'Perfect for maintaining a consistently clean home.' },
  'Deep': { badge: 'Detailed', desc: 'Ideal for first-time cleanings or homes needing extra attention.' },
  'Move-in/Move-out': { badge: 'Vacant Property', desc: 'Designed for empty homes before moving in or after moving out.' },
}

const HANDYMAN_SERVICES = ['TV mounting', 'Plumbing minor repairs', 'Drywall repair', 'Door/lock fixing', 'Furniture assembly', 'Painting touch-ups', 'Other']
const JOB_CONDITIONS = ['Urgent / same-day', 'Attempted before by someone else', 'Visible damage or safety risk']

// Multi-select chip group (handyman service types + job conditions).
function MultiChips({ label, options, selected, onToggle, required }: {
  label: string
  options: string[]
  selected: string[]
  onToggle: (v: string) => void
  required?: boolean
}) {
  return (
    <div style={{ gridColumn: 'span 2' }}>
      <label style={labelStyle}>
        {label} {required && <span style={{ color: 'var(--color-teal)' }}>*</span>}
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {options.map((opt) => {
          const sel = selected.includes(opt)
          return (
            <button
              type="button"
              key={opt}
              onClick={() => onToggle(opt)}
              style={{
                padding: '9px 14px',
                border: `1px solid ${sel ? 'var(--color-teal)' : 'rgba(13,27,46,0.12)'}`,
                background: sel ? '#e0f5f4' : 'white',
                color: sel ? 'var(--color-navy-deep)' : 'rgba(74,90,106,0.8)',
                fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', borderRadius: 0,
                display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'all 0.25s ease',
              }}
            >
              {sel && <span style={{ color: 'var(--color-teal)', fontSize: '0.7rem' }}>✓</span>}
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function Step03Property() {
  const { bookingData, updatePropertySize, updateServiceExtras, updateHandyman, toggleHandymanMulti, updateSpecialInstructions, mediaFiles, addMediaFiles, removeMediaFile } = useBooking()
  const { property, serviceType, serviceExtras, handyman, specialInstructions } = bookingData
  const isHandyman = serviceType === 'handyman'

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [mediaError, setMediaError] = useState<string | null>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    setMediaError(addMediaFiles(Array.from(files)))
  }

  const setExtra = (key: keyof ServiceExtras) => (v: string) => updateServiceExtras({ [key]: v })

  const showAreas = isAreaPriced(serviceType)

  // When the area picker is shown it already collects bedrooms and bathrooms, so
  // the standalone selects would be asking the same question twice.
  const showBedrooms = WITH_BEDROOMS.includes(serviceType) && !showAreas
  const showBathrooms = WITH_BATHROOMS.includes(serviceType) && !showAreas

  // Tier comes from the existing "Type of Cleaning" question rather than a new
  // toggle — it already exists and already maps to a GHL field.
  const tier: CleaningTier = serviceExtras.cleaningType === 'Deep' ? 'deep' : 'regular'

  const areas: RoomCounts = property.areas ?? {}

  // Keep bedrooms/bathrooms in sync with the picker. They are no longer shown as
  // inputs here, but they still feed GHL custom fields and the summary panel.
  const handleAreasChange = (next: RoomCounts) => {
    updatePropertySize({
      areas: next,
      bedrooms: String(next.bedroom ?? 0),
      bathrooms: (next.fullBathroom ?? 0) + (next.halfBathroom ?? 0),
    })
  }

  return (
    <div>
      <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', fontWeight: 900, letterSpacing: '-1.5px', color: 'var(--color-navy-deep)', marginBottom: '40px' }}>
        Service Details.
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* ── Handyman-specific questions ─────────────────────── */}
        {isHandyman && (
          <>
            <MultiChips
              label="What type of handyman service is needed?"
              options={HANDYMAN_SERVICES}
              selected={handyman.serviceTypes ?? []}
              onToggle={(v) => toggleHandymanMulti('serviceTypes', v)}
              required
            />

            {(handyman.serviceTypes ?? []).includes('Other') && (
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Please describe</label>
                <input
                  type="text"
                  value={handyman.otherDetail ?? ''}
                  onChange={(e) => updateHandyman({ otherDetail: e.target.value })}
                  onFocus={onFieldFocus}
                  onBlur={onFieldBlur}
                  placeholder="Describe the service needed"
                  style={{ ...inputStyle, paddingLeft: '16px' }}
                />
              </div>
            )}

            <MultiChips
              label="Condition — check all that apply"
              options={JOB_CONDITIONS}
              selected={handyman.jobConditions ?? []}
              onToggle={(v) => toggleHandymanMulti('jobConditions', v)}
            />

            <SpecSelect
              label="Do you have tools & materials, or should we bring them?"
              icon={Wrench}
              value={handyman.toolsMaterials ?? ''}
              onChange={(v) => updateHandyman({ toolsMaterials: v })}
              options={['I have them', 'Please bring them']}
            />

            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>
                Specific parts needed <span style={{ color: 'rgba(74,90,106,0.6)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
              </label>
              <input
                type="text"
                value={handyman.partsNeeded ?? ''}
                onChange={(e) => updateHandyman({ partsNeeded: e.target.value })}
                onFocus={onFieldFocus}
                onBlur={onFieldBlur}
                placeholder='e.g. 55" TV bracket, white paint'
                style={{ ...inputStyle, paddingLeft: '16px' }}
              />
            </div>
          </>
        )}

        {/* ── Per-service extra questions ─────────────────────── */}
        {serviceType === 'residential' && (
          <>
            <SpecSelect label="Type of Cleaning" icon={Sparkles} required
              value={serviceExtras.cleaningType ?? ''} onChange={setExtra('cleaningType')}
              options={['Regular', 'Deep', 'Move-in/Move-out']} />
            {serviceExtras.cleaningType && CLEANING_TYPE_INFO[serviceExtras.cleaningType] && (
              <div style={{ gridColumn: 'span 2', marginTop: '-14px', display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px 14px', background: 'rgba(23,176,171,0.05)', borderLeft: '3px solid var(--color-teal)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-teal)', flexShrink: 0, marginTop: '2px' }}>
                  {CLEANING_TYPE_INFO[serviceExtras.cleaningType]!.badge}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'rgba(74,90,106,0.85)', lineHeight: 1.45 }}>
                  {CLEANING_TYPE_INFO[serviceExtras.cleaningType]!.desc}
                </span>
              </div>
            )}
          </>
        )}

        {serviceType === 'commercial' && (
          <SpecSelect label="Type of Space" icon={Building2} required
            value={serviceExtras.typeOfSpace ?? ''} onChange={setExtra('typeOfSpace')}
            options={['Office', 'Store', 'Other']} />
        )}

        {serviceType === 'renovation' && (
          <>
            <SpecSelect label="Property Type" icon={Home} required
              value={serviceExtras.propertyType ?? ''} onChange={setExtra('propertyType')}
              options={['House', 'Apartment', 'Commercial']} />
            <SpecSelect label="Completion Status" icon={Wrench} required
              value={serviceExtras.completionStatus ?? ''} onChange={setExtra('completionStatus')}
              options={['New build', 'Renovation']} />
          </>
        )}

        {/* ── Areas to clean (area-priced services) ───────────── */}
        {showAreas && (
          <AreaSelector counts={areas} tier={tier} onChange={handleAreasChange} />
        )}

        {/* ── Bedrooms / Bathrooms (conditional) ──────────────── */}
        {showBedrooms && (
          <div>
            <label style={labelStyle}>
              Bedrooms <span style={{ color: 'var(--color-teal)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Building2 size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none', zIndex: 1 }} />
              <select aria-label="Bedrooms" value={property.bedrooms} onChange={(e) => updatePropertySize({ bedrooms: e.target.value })} onFocus={onFieldFocus} onBlur={onFieldBlur} style={selectStyle} required>
                <option value="">Select bedrooms</option>
                {BEDROOM_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>
        )}

        {showBathrooms && (
          <div>
            <label style={labelStyle}>
              Bathrooms <span style={{ color: 'var(--color-teal)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Bath size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none', zIndex: 1 }} />
              <select aria-label="Bathrooms" value={property.bathrooms} onChange={(e) => updatePropertySize({ bathrooms: parseInt(e.target.value) })} onFocus={onFieldFocus} onBlur={onFieldBlur} style={selectStyle} required>
                {BATHROOM_OPTIONS.map((n) => <option key={n} value={n}>{n} {n === 1 ? 'Bathroom' : 'Bathrooms'}</option>)}
              </select>
            </div>
          </div>
        )}

        {serviceType === 'airbnb' && (
          <SpecSelect label="How many properties do you manage?" icon={Layers} required
            value={serviceExtras.propertiesManaged ?? ''} onChange={setExtra('propertiesManaged')}
            options={['1', '2-5', '6-10', '10+']} />
        )}

        {/* ── Approx. size (optional; not shown for Handyman) ─── */}
        {serviceType !== 'handyman' && (
        <div style={{ gridColumn: 'span 2' }}>
          <label style={labelStyle}>
            Approx. Size <span style={{ color: 'rgba(74,90,106,0.6)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(sq ft — optional)</span>
          </label>
          <div style={{ position: 'relative' }}>
            <Ruler size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none' }} />
            <input
              type="number"
              value={property.squareFootage || ''}
              onChange={(e) => updatePropertySize({ squareFootage: parseInt(e.target.value) || 0 })}
              onFocus={onFieldFocus}
              onBlur={onFieldBlur}
              min="0"
              placeholder="e.g. 1500"
              style={inputStyle}
            />
          </div>
        </div>
        )}

      </div>

      {/* ── Special instructions (all services) ───────────────── */}
      <div style={{ marginTop: '32px' }}>
        <label style={labelStyle}>
          Special Instructions <span style={{ color: 'rgba(74,90,106,0.6)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
        </label>
        <textarea
          value={specialInstructions}
          onChange={(e) => updateSpecialInstructions(e.target.value)}
          onFocus={onFieldFocus}
          onBlur={onFieldBlur}
          placeholder="Anything we should know? Questions, priority areas, parking, pets…"
          rows={4}
          style={{ ...inputStyle, paddingLeft: '16px', resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>

      {/* ── Optional photos ───────────────────────────────────── */}
      <div style={{ marginTop: '32px' }}>
        <label style={labelStyle}>
          Add Photos {isHandyman
            ? <span style={{ color: 'var(--color-teal)' }}>*</span>
            : <span style={{ color: 'rgba(74,90,106,0.6)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>}
        </label>
        <p style={{ marginTop: '-2px', marginBottom: '12px', fontSize: '0.75rem', color: 'rgba(74,90,106,0.7)' }}>
          {isHandyman
            ? `Please upload clear photos of the area for an accurate quote (required). Up to ${MAX_MEDIA_FILES} images.`
            : `Share photos of the space so we can give you a more accurate estimate. Up to ${MAX_MEDIA_FILES} images.`}
        </p>

        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '28px 16px',
            border: `1.5px dashed ${dragOver ? 'var(--color-teal)' : 'rgba(13,27,46,0.18)'}`,
            background: dragOver ? 'rgba(23,176,171,0.05)' : 'rgba(13,27,46,0.015)',
            cursor: mediaFiles.length >= MAX_MEDIA_FILES ? 'not-allowed' : 'pointer',
            transition: 'border-color 0.25s, background 0.25s',
            opacity: mediaFiles.length >= MAX_MEDIA_FILES ? 0.55 : 1,
          }}
        >
          <ImagePlus size={22} style={{ color: 'var(--color-teal)' }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--color-navy-deep)', fontWeight: 600 }}>
            {mediaFiles.length >= MAX_MEDIA_FILES ? 'Maximum photos added' : 'Click to upload or drag & drop'}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'rgba(74,90,106,0.7)' }}>
            JPG, PNG or GIF — up to 10 MB each
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={mediaFiles.length >= MAX_MEDIA_FILES}
            onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
          />
        </div>

        {mediaError && (
          <p style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--color-coral, #fc8181)' }}>
            {mediaError}
          </p>
        )}

        {mediaFiles.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: '10px', marginTop: '14px' }}>
            {mediaFiles.map((file, i) => {
              const url = URL.createObjectURL(file)
              return (
                <div key={`${file.name}-${file.size}-${i}`} style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', border: '1px solid rgba(13,27,46,0.1)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={file.name}
                    onLoad={() => URL.revokeObjectURL(url)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeMediaFile(i)}
                    aria-label={`Remove ${file.name}`}
                    style={{
                      position: 'absolute', top: '4px', right: '4px',
                      width: '22px', height: '22px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(13,27,46,0.78)', color: 'white',
                      border: 'none', borderRadius: '50%', cursor: 'pointer', padding: 0,
                    }}
                  >
                    <X size={13} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
