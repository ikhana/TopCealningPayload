// src/components/booking/sections/Step03Property.tsx
// Step 3 — Specs. Service-aware: shows different fields per serviceType.
//   Residential        → Type of Cleaning, Bedrooms, Bathrooms
//   Commercial         → Type of Space
//   Airbnb             → Bedrooms, Properties Managed
//   Post-Construction  → Property Type, Completion Status
//   (Approx. Size + photos shown for all; size is optional.)

'use client'

import React, { useRef, useState } from 'react'
import { Ruler, Building2, Bath, Sparkles, Layers, Home, Wrench, ImagePlus, X } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'
import { MAX_MEDIA_FILES } from '@/hooks/useBookingForm'
import type { ServiceCategory, ServiceExtras } from '@/types/booking'

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
  return (
    <div style={{ gridColumn: 'span 2' }}>
      <label style={labelStyle}>
        {label} {required && <span style={{ color: 'var(--color-teal)' }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <Icon size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none', zIndex: 1 }} />
        <select value={value} onChange={(e) => onChange(e.target.value)} onFocus={onFieldFocus} onBlur={onFieldBlur} style={selectStyle} required={required}>
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

export function Step03Property() {
  const { bookingData, updatePropertySize, updateServiceExtras, updateSpecialInstructions, mediaFiles, addMediaFiles, removeMediaFile } = useBooking()
  const { property, serviceType, serviceExtras, specialInstructions } = bookingData

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [mediaError, setMediaError] = useState<string | null>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    setMediaError(addMediaFiles(Array.from(files)))
  }

  const setExtra = (key: keyof ServiceExtras) => (v: string) => updateServiceExtras({ [key]: v })

  const showBedrooms = WITH_BEDROOMS.includes(serviceType)
  const showBathrooms = WITH_BATHROOMS.includes(serviceType)

  return (
    <div>
      <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', fontWeight: 900, letterSpacing: '-1.5px', color: 'var(--color-navy-deep)', marginBottom: '40px' }}>
        Service Details.
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* ── Per-service extra questions ─────────────────────── */}
        {serviceType === 'residential' && (
          <SpecSelect label="Type of Cleaning" icon={Sparkles} required
            value={serviceExtras.cleaningType ?? ''} onChange={setExtra('cleaningType')}
            options={['Regular', 'Deep', 'Move-in/Move-out']} />
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

        {/* ── Bedrooms / Bathrooms (conditional) ──────────────── */}
        {showBedrooms && (
          <div>
            <label style={labelStyle}>
              Bedrooms <span style={{ color: 'var(--color-teal)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Building2 size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none', zIndex: 1 }} />
              <select value={property.bedrooms} onChange={(e) => updatePropertySize({ bedrooms: e.target.value })} onFocus={onFieldFocus} onBlur={onFieldBlur} style={selectStyle} required>
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
              <select value={property.bathrooms} onChange={(e) => updatePropertySize({ bathrooms: parseInt(e.target.value) })} onFocus={onFieldFocus} onBlur={onFieldBlur} style={selectStyle} required>
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
          Add Photos <span style={{ color: 'rgba(74,90,106,0.6)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
        </label>
        <p style={{ marginTop: '-2px', marginBottom: '12px', fontSize: '0.75rem', color: 'rgba(74,90,106,0.7)' }}>
          Share photos of the space so we can give you a more accurate estimate. Up to {MAX_MEDIA_FILES} images.
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
