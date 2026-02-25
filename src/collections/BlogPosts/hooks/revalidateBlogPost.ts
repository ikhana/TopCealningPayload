// src/collections/BlogPosts/hooks/revalidateBlogPost.ts
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { BlogPost } from '@/payload-types'
import { revalidatePath } from 'next/cache'

export const revalidateBlogPost: CollectionAfterChangeHook<BlogPost> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  if (doc._status === 'published') {
    const path = `/blog/${doc.slug}`

    payload.logger.info(`Revalidating blog post at path: ${path}`)

    revalidatePath(path)
    revalidatePath('/blog')
    revalidatePath('/')
  }

  // If the slug has changed, revalidate the old path
  if (previousDoc?._status === 'published' && doc.slug !== previousDoc.slug) {
    const oldPath = `/blog/${previousDoc.slug}`
    payload.logger.info(`Revalidating old blog post path: ${oldPath}`)
    revalidatePath(oldPath)
  }

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<BlogPost> = ({ doc, req: { payload } }) => {
  const path = `/blog/${doc.slug}`

  payload.logger.info(`Revalidating deleted blog post at path: ${path}`)

  revalidatePath(path)
  revalidatePath('/blog')
  revalidatePath('/')

  return doc
}