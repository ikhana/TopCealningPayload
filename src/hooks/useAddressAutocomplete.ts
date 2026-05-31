// src/hooks/useAddressAutocomplete.ts
//
// Wraps Google Places Autocomplete around a text input. The caller passes
// a ref to the input + a callback to receive the parsed address when the
// user picks a suggestion.
//
// The Google Maps JS library is loaded lazily on first use (once per page).
// Bias toward Broward County via the bounds option — Google prefers
// nearby addresses but still allows national results. Zip-code validation
// in step-validation.ts catches non-Broward picks at the gate.
//
// API key restrictions (HTTP referrer + API scope) are set on the
// Google Cloud project — the key itself is safe in browser-side env.

'use client'

import { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

export type ParsedAddress = {
  street: string
  city: string
  state: string
  zipCode: string
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

// Single loader instance shared across all callers — Google's loader is
// idempotent but reusing one keeps the script tag count at one.
let sharedLoader: Loader | null = null
function getLoader(): Loader {
  if (!sharedLoader) {
    sharedLoader = new Loader({
      apiKey: API_KEY,
      version: 'weekly',
      libraries: ['places'],
    })
  }
  return sharedLoader
}

// Broward County rough bounding box (SW corner → NE corner).
// Used to bias autocomplete results; doesn't strictly restrict.
const BROWARD_SW = { lat: 25.9484, lng: -80.5089 }
const BROWARD_NE = { lat: 26.4216, lng: -80.0381 }

function parsePlace(place: google.maps.places.PlaceResult): ParsedAddress {
  const components = place.address_components ?? []
  const get = (type: string): string =>
    components.find((c) => c.types.includes(type))?.short_name ?? ''
  const getLong = (type: string): string =>
    components.find((c) => c.types.includes(type))?.long_name ?? ''

  const streetNumber = get('street_number')
  const route = getLong('route')
  const street = [streetNumber, route].filter(Boolean).join(' ').trim()

  // locality first (most common); fall back to sublocality / postal_town for edge cases
  const city =
    getLong('locality') ||
    getLong('sublocality_level_1') ||
    getLong('postal_town') ||
    ''

  // short_name for state gives 'FL' instead of 'Florida' — matches our schema
  const state = get('administrative_area_level_1') || 'FL'
  const zipCode = get('postal_code') || ''

  return { street, city, state, zipCode }
}

export function useAddressAutocomplete(
  inputRef: React.RefObject<HTMLInputElement | null>,
  onPlaceSelected: (parsed: ParsedAddress) => void,
): void {
  // Keep the latest callback in a ref so the effect doesn't re-run on every
  // render. Otherwise we'd tear down + re-attach the Autocomplete on each
  // parent re-render (which happens whenever any address field changes).
  const callbackRef = useRef(onPlaceSelected)
  useEffect(() => {
    callbackRef.current = onPlaceSelected
  }, [onPlaceSelected])

  useEffect(() => {
    if (!inputRef.current) return
    if (!API_KEY) {
      // No key configured — autocomplete silently disabled, manual entry still works.
      // Useful in dev when devs forget to set the env var.
      // eslint-disable-next-line no-console
      console.warn('[useAddressAutocomplete] NEXT_PUBLIC_GOOGLE_MAPS_API_KEY missing — autocomplete disabled')
      return
    }

    const inputEl = inputRef.current
    let autocomplete: google.maps.places.Autocomplete | null = null
    let listener: google.maps.MapsEventListener | null = null
    let cancelled = false

    getLoader()
      .importLibrary('places')
      .then((places) => {
        if (cancelled || !inputEl) return

        autocomplete = new places.Autocomplete(inputEl, {
          componentRestrictions: { country: 'us' },
          fields: ['address_components', 'formatted_address'],
          types: ['address'],
          bounds: new google.maps.LatLngBounds(BROWARD_SW, BROWARD_NE),
          strictBounds: false,
        })

        listener = autocomplete.addListener('place_changed', () => {
          if (!autocomplete) return
          const place = autocomplete.getPlace()
          if (!place.address_components) return
          callbackRef.current(parsePlace(place))
        })
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('[useAddressAutocomplete] Failed to load Google Maps', err)
      })

    return () => {
      cancelled = true
      if (listener) listener.remove()
      // Google's Autocomplete attaches a `.pac-container` to document.body —
      // it gets cleaned up automatically when the input is removed from the DOM.
    }
    // Only re-run if the ref identity changes (which it shouldn't); callback
    // changes are handled via callbackRef above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
