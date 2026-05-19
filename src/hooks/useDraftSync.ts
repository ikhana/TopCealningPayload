// src/hooks/useDraftSync.ts
// Persists wizard state to /api/booking-drafts so customers can resume
// after closing the tab. Two save paths:
//   - Debounced (1.5s) — fires on any bookingData change once email is set
//   - Forced — called on step transitions for an immediate write
//
// The token is generated client-side (crypto.randomUUID) on first interaction
// and stored in sessionStorage so refreshes reuse the same draft row.

'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { BookingFormData } from '@/types/booking'

const STORAGE_KEY = 'tc_draft_token'
const DEBOUNCE_MS = 1500

function getOrCreateToken(): string {
  if (typeof window === 'undefined') return ''
  let token = sessionStorage.getItem(STORAGE_KEY)
  if (!token) {
    token = crypto.randomUUID()
    sessionStorage.setItem(STORAGE_KEY, token)
  }
  return token
}

async function saveDraft(
  token: string,
  stepReached: number,
  bookingData: BookingFormData,
): Promise<void> {
  try {
    await fetch('/api/booking-drafts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        email: bookingData.customer.email || undefined,
        stepReached,
        wizardState: bookingData,
      }),
    })
  } catch {
    // best-effort — never block the wizard on a draft save failure
  }
}

export type HydratedDraft = {
  stepReached: number
  wizardState: BookingFormData
}

export function useDraftSync(bookingData: BookingFormData, currentStep: number) {
  const tokenRef = useRef<string>('')
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    tokenRef.current = getOrCreateToken()
  }, [])

  useEffect(() => {
    if (!tokenRef.current) return
    if (!bookingData.customer.email?.trim()) return

    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      saveDraft(tokenRef.current, currentStep, bookingData)
    }, DEBOUNCE_MS)

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [bookingData, currentStep])

  const forceSaveDraft = useCallback(
    (stepReached: number) => {
      if (!tokenRef.current) return Promise.resolve()
      if (!bookingData.customer.email?.trim()) return Promise.resolve()
      return saveDraft(tokenRef.current, stepReached, bookingData)
    },
    [bookingData],
  )

  const getToken = useCallback(() => tokenRef.current, [])

  const clearDraft = useCallback(() => {
    if (typeof window !== 'undefined') sessionStorage.removeItem(STORAGE_KEY)
    tokenRef.current = ''
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
      debounceTimer.current = null
    }
  }, [])

  // Reads ?resume=<token> from the current URL and fetches the draft.
  // On success adopts the token as the active session token and returns
  // the saved state so the caller can hydrate the wizard.
  // Returns null when no resume param exists or the draft is invalid/expired.
  const hydrateFromResume = useCallback(async (): Promise<HydratedDraft | null> => {
    if (typeof window === 'undefined') return null

    const params = new URLSearchParams(window.location.search)
    const token = params.get('resume')
    if (!token || token.length < 8 || token.length > 128) return null

    try {
      const res = await fetch(`/api/booking-drafts/${encodeURIComponent(token)}`)
      if (!res.ok) return null

      const json = await res.json()
      if (!json?.ok || !json?.draft?.wizardState) return null

      sessionStorage.setItem(STORAGE_KEY, token)
      tokenRef.current = token

      // Strip the resume param from the URL so refreshes don't re-fetch
      const cleaned = new URL(window.location.href)
      cleaned.searchParams.delete('resume')
      window.history.replaceState({}, '', cleaned.toString())

      return {
        stepReached: typeof json.draft.stepReached === 'number' ? json.draft.stepReached : 1,
        wizardState: json.draft.wizardState as BookingFormData,
      }
    } catch {
      return null
    }
  }, [])

  return { forceSaveDraft, getToken, clearDraft, hydrateFromResume }
}
