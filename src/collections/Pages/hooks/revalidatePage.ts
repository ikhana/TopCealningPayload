import { revalidatePath, revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import type { Page } from '../../../payload-types'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  // Don't revalidate if explicitly disabled
  if (context?.disableRevalidate) {
    return doc
  }

  // Only revalidate published documents
  if (doc._status === 'published') {
    const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
    
    payload.logger.info(`Revalidating page at path: ${path}`)
    
    revalidatePath(path)
    revalidateTag('pages')
  }

  // If the page was previously published and slug changed or unpublished
  if (previousDoc?._status === 'published' && doc._status !== 'published') {
    const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`
    
    payload.logger.info(`Revalidating old page at path: ${oldPath}`)
    
    revalidatePath(oldPath)
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ 
  doc, 
  req: { payload, context } 
}) => {
  if (!context?.disableRevalidate && doc) {
    const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
    
    payload.logger.info(`Revalidating deleted page at path: ${path}`)
    
    revalidatePath(path)
    revalidateTag('pages')
  }

  return doc
}