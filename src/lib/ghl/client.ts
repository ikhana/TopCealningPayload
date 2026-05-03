import { GhlApiError, GhlAuthError, GhlRateLimitError } from './errors'

const BASE_URL = process.env.GHL_API_BASE ?? 'https://services.leadconnectorhq.com'
const API_VERSION = '2021-07-28'

// Simple token bucket — tracks in-flight requests, caps at 10 concurrent
let inFlight = 0
const MAX_CONCURRENT = 10
const pendingQueue: Array<() => void> = []

function acquire(): Promise<void> {
  if (inFlight < MAX_CONCURRENT) {
    inFlight++
    return Promise.resolve()
  }
  return new Promise((resolve) => pendingQueue.push(resolve))
}

function release() {
  inFlight--
  const next = pendingQueue.shift()
  if (next) {
    inFlight++
    next()
  }
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export async function ghlFetch(
  path: string,
  options: RequestInit = {},
  retries = 3,
): Promise<Response> {
  await acquire()

  try {
    const url = `${BASE_URL}${path}`
    const headers: HeadersInit = {
      Authorization: `Bearer ${process.env.GHL_PRIVATE_TOKEN}`,
      Version: API_VERSION,
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    }

    let attempt = 0
    let lastError: Error | null = null

    while (attempt <= retries) {
      const res = await fetch(url, { ...options, headers })

      if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get('Retry-After') ?? '10', 10) * 1000
        if (attempt < retries) {
          await sleep(retryAfter || Math.pow(2, attempt) * 200)
          attempt++
          continue
        }
        throw new GhlRateLimitError(retryAfter / 1000)
      }

      if (res.status === 401) throw new GhlAuthError()

      if (!res.ok) {
        let body: unknown
        try { body = await res.json() } catch { /* ignore */ }

        // Retry on 5xx
        if (res.status >= 500 && attempt < retries) {
          await sleep(Math.pow(2, attempt) * 200)
          attempt++
          lastError = new GhlApiError(`GHL ${res.status}`, res.status, body)
          continue
        }

        throw new GhlApiError(
          `GHL request failed: ${res.status} ${res.statusText}`,
          res.status,
          body,
        )
      }

      return res
    }

    throw lastError ?? new GhlApiError('GHL request failed after retries', 500)
  } finally {
    release()
  }
}
