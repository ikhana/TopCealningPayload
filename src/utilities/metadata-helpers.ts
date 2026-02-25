// src/utilities/metadata-helpers.ts

/**
 * Safely convert Payload CMS nullable strings to Next.js Metadata format
 * Next.js Metadata expects string | undefined, not string | null
 */
export const toMetaString = (value: string | null | undefined): string | undefined => {
  return value ?? undefined
}

/**
 * Create a safe metadata object from Payload data
 */
export const createSafeMetadata = (metadata: {
  title?: string | null
  description?: string | null
  keywords?: string | null
  [key: string]: any
}) => {
  return {
    title: toMetaString(metadata.title),
    description: toMetaString(metadata.description),
    keywords: toMetaString(metadata.keywords),
  }
}

