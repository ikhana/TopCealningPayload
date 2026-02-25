// src/utilities/nullToUndefined.ts
/**
 * Convert null to undefined for Next.js Metadata compatibility
 * Payload CMS returns string | null, but Next.js expects string | undefined
 */
export function nullToUndefined<T>(value: T | null | undefined): T | undefined {
  if (value === null || value === undefined) return undefined
  return value
}

/**
 * Type guard to check if value is not null or undefined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

/**
 * Convert nullable string to metadata-safe string
 */
export function toMetaString(value: string | null | undefined): string | undefined {
  return value ?? undefined
}

/**
 * Convert nullable number to metadata-safe number
 */
export function toMetaNumber(value: number | null | undefined): number | undefined {
  return value ?? undefined
}