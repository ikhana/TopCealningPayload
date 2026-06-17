// src/components/booking/sections/Step01Customer.tsx
'use client'

import React from 'react'
import { User, Mail, Phone, Info } from 'lucide-react'
import { useBooking } from '@/components/booking/BookingContext'

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

export function Step01Customer() {
  const { bookingData, updateCustomerInfo } = useBooking()
  const { customer } = bookingData

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    updateCustomerInfo({ [name]: value })
  }

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--color-teal)'
    e.target.style.boxShadow = '0 0 0 4px rgba(23,176,171,0.05)'
  }
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(13,27,46,0.1)'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div>
      <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.2rem)', fontWeight: 900, letterSpacing: '-1.5px', color: 'var(--color-navy-deep)', marginBottom: '40px' }}>
        Contact Information
      </h2>

      {/* 2-col grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* Full Name — spans 2 */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={labelStyle}>Full Name <span style={{ color: 'var(--color-teal)' }}>*</span></label>
          <div style={{ position: 'relative' }}>
            <User size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none' }} />
            <input
              type="text"
              name="firstName"
              value={customer.firstName}
              onChange={handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="e.g. Alexander Pierce"
              style={inputStyle}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle}>Email Address <span style={{ color: 'var(--color-teal)' }}>*</span></label>
          <div style={{ position: 'relative' }}>
            <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none' }} />
            <input
              type="email"
              name="email"
              value={customer.email}
              onChange={handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="alex@example.com"
              style={inputStyle}
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label style={labelStyle}>Phone Number <span style={{ color: 'var(--color-teal)' }}>*</span></label>
          {/* US-only — country code fixed to US, dropdown removed */}
          <div style={{ position: 'relative' }}>
            <Phone size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(74,90,106,0.5)', pointerEvents: 'none' }} />
            <input
              type="tel"
              name="phone"
              value={customer.phone}
              onChange={handleChange}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder="+1 (555) 000-0000"
              style={inputStyle}
              required
            />
          </div>
          <p style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', fontSize: '0.75rem', color: 'rgba(74,90,106,0.7)' }}>
            <Info size={12} />
            We&apos;ll only contact you about your booking
          </p>
        </div>

      </div>
    </div>
  )
}
