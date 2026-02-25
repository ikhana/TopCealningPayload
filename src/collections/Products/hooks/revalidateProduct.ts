import { revalidatePath, revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

export const revalidateProduct: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { payload, context },
  collection,
}) => {
  if (!context?.disableRevalidate) {
    const typedDoc = doc as any
    
    if (typedDoc._status === 'published') {
      const path = `/products/${typedDoc.slug}`
      
      payload.logger.info(`Revalidating product at path: ${path}`)
      
      revalidatePath(path)
      revalidateTag('products')
    }

    // Handle slug changes or unpublishing
    if (previousDoc && (previousDoc as any)._status === 'published') {
      const typedPreviousDoc = previousDoc as any
      if (typedPreviousDoc.slug !== typedDoc.slug || typedDoc._status !== 'published') {
        const oldPath = `/products/${typedPreviousDoc.slug}`
        
        payload.logger.info(`Revalidating old product at path: ${oldPath}`)
        
        revalidatePath(oldPath)
      }
    }
  }
  
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = ({ 
  doc, 
  req: { payload, context },
}) => {
  if (!context?.disableRevalidate && doc) {
    const typedDoc = doc as any
    const path = `/products/${typedDoc.slug}`
    
    payload.logger.info(`Revalidating deleted product at path: ${path}`)
    
    try {
      revalidatePath(path)
      revalidateTag('products')
    } catch (error) {
      payload.logger.error(`Error revalidating deleted product: ${error}`)
    }
  }

  return doc
}