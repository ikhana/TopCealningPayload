// src/access/authors.ts
import type { Access } from 'payload'

import { checkRole } from './checkRole'

export const authors: Access = ({ req: { user } }) => {
  return checkRole(['admin', 'author'], user)
}

export const authorsOrPublished: Access = ({ req: { user } }) => {
  if (user && checkRole(['admin', 'author'], user)) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}

export const authorsAndSelf: Access = ({ req: { user } }) => {
  if (user) {
    // Admins can access all
    if (checkRole(['admin'], user)) {
      return true
    }

    // Authors can only access their own posts
    if (checkRole(['author'], user)) {
      return {
        author: {
          equals: user.id,
        },
      }
    }
  }

  return false
}