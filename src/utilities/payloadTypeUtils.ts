// src/utilities/payloadTypeUtils.ts
/**
 * Utility functions to safely handle Payload's nullable types
 */

export function safeString(value: string | null | undefined): string {
  return value ?? ''
}

export function safeNumberWithDefault(value: number | null | undefined, defaultValue: number): number {
  return value ?? defaultValue
}

export function safeEnum<T extends string>(
  value: T | null | undefined, 
  defaultValue: T
): T {
  return value ?? defaultValue
}

export function safeBooleanWithDefault(value: boolean | null | undefined, defaultValue: boolean): boolean {
  return value ?? defaultValue
}