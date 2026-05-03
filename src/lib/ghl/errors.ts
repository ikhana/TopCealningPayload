export class GhlApiError extends Error {
  status: number
  body: unknown

  constructor(message: string, status: number, body?: unknown) {
    super(message)
    this.name = 'GhlApiError'
    this.status = status
    this.body = body
  }
}

export class GhlRateLimitError extends GhlApiError {
  retryAfter: number

  constructor(retryAfter = 10) {
    super('GHL rate limit exceeded', 429)
    this.name = 'GhlRateLimitError'
    this.retryAfter = retryAfter
  }
}

export class GhlAuthError extends GhlApiError {
  constructor() {
    super('GHL authentication failed — check GHL_PRIVATE_TOKEN', 401)
    this.name = 'GhlAuthError'
  }
}

export class GhlNotFoundError extends GhlApiError {
  constructor(resource: string) {
    super(`GHL resource not found: ${resource}`, 404)
    this.name = 'GhlNotFoundError'
  }
}
