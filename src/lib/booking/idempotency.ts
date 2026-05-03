import { randomUUID } from 'crypto'

export function generateIdempotencyKey(): string {
  return randomUUID()
}

// Client-side variant — uses crypto.randomUUID() from Web Crypto API
export function generateIdempotencyKeyClient(): string {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID()
  }
  // Fallback using Math.random — only reached in very old browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
