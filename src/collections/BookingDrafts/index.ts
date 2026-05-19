import type { CollectionConfig } from 'payload'
import { admins } from '@/access/admins'

// A BookingDraft represents an in-progress booking wizard session.
// Created the first time the customer interacts with the wizard, updated
// on every step transition, and converted to a Booking on successful submit.
//
// Lifecycle:
//   active  → wizardState is being updated, no booking yet
//   converted → convertedToBookingId is set, draft is kept for analytics
//   expired   → past expiresAt, will be purged by cron
//
// Access model:
//   - All Payload-level access is admins only (no public via auto routes).
//   - Wizard reads/writes go through custom /api/booking-drafts routes,
//     which use the Payload local API (bypasses these access rules).
//   - The token field IS the auth — anyone with the token can read/write
//     that specific draft (same pattern as Stripe Checkout Sessions).

export const BookingDrafts: CollectionConfig = {
  slug: 'booking-drafts',
  access: {
    create: admins,
    read: admins,
    update: admins,
    delete: admins,
  },
  admin: {
    defaultColumns: ['token', 'email', 'stepReached', 'convertedToBookingId', 'updatedAt'],
    useAsTitle: 'token',
    group: 'Bookings',
  },
  fields: [
    {
      name: 'token',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Opaque resume token (UUID v4)' },
    },
    {
      name: 'email',
      type: 'email',
      index: true,
      admin: { description: 'Customer email — present once Step 1 is filled' },
    },
    {
      name: 'ghlContactId',
      type: 'text',
      admin: { description: 'GHL contact ID once upserted' },
    },
    {
      name: 'stepReached',
      type: 'number',
      defaultValue: 1,
      min: 1,
      max: 10,
      admin: { description: '1-10, highest step the customer reached' },
    },
    {
      name: 'wizardState',
      type: 'json',
      admin: { description: 'Full BookingFormData blob' },
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: { description: 'When this draft can be purged (90 days from last update)' },
    },
    {
      name: 'convertedToBookingId',
      type: 'text',
      admin: { description: 'Set when the draft becomes a real booking' },
    },
  ],
  timestamps: true,
}
