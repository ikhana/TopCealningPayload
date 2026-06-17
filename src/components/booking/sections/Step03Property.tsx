// src/components/booking/sections/Step03Property.tsx
'use client'

import React, { useRef, useState } from 'react'
import { Ruler, Building2, Bath, ImagePlus, X } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'
import { MAX_MEDIA_FILES } from '@/hooks/useBookingForm'

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
  width: '100%',
  padding: '12px 16px 12px 42px',
  border: '1px solid rgba(13,27,46,0.1)',
  background: 'white',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.3s',
  borderRadius: 0,
  cursor: 'pointer',
  appearance: 'none',
}

export function Step03Property() {
  const { bookingData, updatePropertySize, mediaFiles, addMediaFiles, removeMediaFile } = useBooking()
  const { property } = bookingData

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [mediaError, setMediaError] = useState<string | null>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const reason = addMediaFiles(Array.from(files))
    setMediaError(reason)
  }

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'var(--color-teal)'
    e.target.style.boxShadow = '0 0 0 4px rgba(23,176,171,0.05)'
  }
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'rgba(13,27,46,0.1)'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div>
      <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', fontWeight: 900, letterSpacing: '-1.5px', color: 'var(--color-navy-deep)', marginBottom: '40px' }}>
        Property Details.
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* Square Footage — full width */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={labelStyle}>
            Square Footage <span style={{ color: 'var(--color-teal)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <Ruler size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none' }} />
            <input
              type="number"
              value={property.squareFootage || ''}
              onChange={(e) => updatePropertySize({ squareFootage: parseInt(e.target.value) || 0 })}
              onFocus={onFocus}
              onBlur={onBlur}
              min="0"
              placeholder="Enter sq. ft."
              style={inputStyle}
              required
            />
          </div>
          <p style={{ marginTop: '6px', fontSize: '0.75rem', color: 'rgba(74,90,106,0.7)' }}>
            Enter the total square footage of your property
          </p>
        </div>

        {/* Bedrooms */}
        <div>
          <label style={labelStyle}>
            Bedrooms <span style={{ color: 'var(--color-teal)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <Building2 size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none', zIndex: 1 }} />
            <select
              value={property.bedrooms}
              onChange={(e) => updatePropertySize({ bedrooms: e.target.value })}
              onFocus={onFocus}
              onBlur={onBlur}
              style={selectStyle}
              required
            >
              <option value="">Select bedrooms</option>
              {BEDROOM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <label style={labelStyle}>
            Bathrooms <span style={{ color: 'var(--color-teal)' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <Bath size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none', zIndex: 1 }} />
            <select
              value={property.bathrooms}
              onChange={(e) => updatePropertySize({ bathrooms: parseInt(e.target.value) })}
              onFocus={onFocus}
              onBlur={onBlur}
              style={selectStyle}
              required
            >
              {BATHROOM_OPTIONS.map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? 'Bathroom' : 'Bathrooms'}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* ── Optional photos ───────────────────────────────────── */}
      <div style={{ marginTop: '32px' }}>
        <label style={labelStyle}>
          Add Photos <span style={{ color: 'rgba(74,90,106,0.6)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
        </label>
        <p style={{ marginTop: '-2px', marginBottom: '12px', fontSize: '0.75rem', color: 'rgba(74,90,106,0.7)' }}>
          Share photos of the space so we can give you a more accurate estimate. Up to {MAX_MEDIA_FILES} images.
        </p>

        {/* Drop zone */}
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

        {/* Thumbnails */}
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
