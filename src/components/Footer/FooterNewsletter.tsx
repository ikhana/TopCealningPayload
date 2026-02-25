// src/components/Footer/FooterNewsletter.tsx - MATCHES YOUR STYLING SYSTEM

'use client'

import { AlertCircle, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export function FooterNewsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email')
      return
    }

    setStatus('loading')
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setStatus('success')
        setMessage('Subscribed successfully!')
        setEmail('')
        setTimeout(() => {
          setStatus('idle')
          setMessage('')
        }, 3000)
      } else {
        throw new Error('Failed')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Unable to subscribe. Try again.')
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 4000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Input with Gradient Borders */}
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="relative z-10 w-full h-11 px-4 bg-background dark:bg-card text-foreground placeholder:text-muted-foreground focus:outline-none font-body text-sm transition-all duration-300"
          disabled={status === 'loading'}
          required
        />
        {/* Input Borders */}
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
      </div>
      
      {/* Submit Button with Your Signature Borders */}
      <button
        type="submit"
        disabled={status === 'loading' || !email.trim()}
        className="relative w-full h-11 bg-primary text-primary-foreground hover:bg-transparent hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-300 font-body text-sm uppercase tracking-wide group"
      >
        {/* Button Gradient Borders */}
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-l from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-t from-border-gradient-light via-border-gradient-mid to-border-gradient-dark" />
        
        <span className="relative z-10">
          {status === 'loading' ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
              Subscribing
            </span>
          ) : (
            'Subscribe Now'
          )}
        </span>
      </button>
      
      {/* Status Message */}
      {message && (
        <div className={`flex items-start gap-2 text-xs font-body transition-all duration-300 ${
          status === 'success' 
            ? 'text-success' 
            : status === 'error'
            ? 'text-error'
            : 'text-muted-foreground'
        }`}>
          <div className="flex-shrink-0 mt-0.5">
            {status === 'success' && <CheckCircle className="w-3.5 h-3.5" />}
            {status === 'error' && <AlertCircle className="w-3.5 h-3.5" />}
          </div>
          <span>{message}</span>
        </div>
      )}
    </form>
  )
}