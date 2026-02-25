import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { CollectionSlug } from 'payload'
import { getPayload } from 'payload'

export async function GET(req: Request): Promise<Response> {
  const payload = await getPayload({ config: configPromise })
  const { searchParams } = new URL(req.url)
  
  const path = searchParams.get('path')
  const collection = searchParams.get('collection') as CollectionSlug
  const slug = searchParams.get('slug')

  if (!path) {
    return new Response('No path provided', { status: 404 })
  }

  try {
    // Authenticate user through Payload's auth
    const { user } = await payload.auth({ 
      headers: req.headers,
    })

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Enable draft mode
    const draft = await draftMode()
    draft.enable()

    // If collection and slug are provided, verify document exists
    if (collection && slug) {
      const result = await payload.find({
        collection,
        draft: true,
        limit: 1,
        where: {
          slug: {
            equals: slug,
          },
        },
        user, // Pass the user for access control
      })

      if (!result.docs.length) {
        return new Response('Document not found', { status: 404 })
      }
    }
  } catch (error) {
    console.error('Preview authentication error:', error)
    return new Response('Preview error', { status: 500 })
  }

  // Redirect outside of try-catch to avoid catching NEXT_REDIRECT
  redirect(decodeURIComponent(path))
}