import type { CollectionConfig } from 'payload'
import { admins } from '@/access/admins'

// A BookingSeries represents a recurring booking sequence (weekly, biweekly, monthly, etc).
// One-time bookings do NOT have a series — they're standalone Booking records with seriesId = null.
//
// Lifecycle:
//   active   → series is running, future occurrences are being scheduled
//   paused   → no new auto-extension, existing future bookings still happen (until customer cancels them individually)
//   cancelled → series is dead, all future bookings cancelled
//
// Series-level state lives here so:
//   - "pause series" is a 1-row update, not N
//   - cron auto-extension queries WHERE status=active AND futureCount < threshold
//   - payment method, anchor day/time, preferences have a clear home

export const BookingSeries: CollectionConfig = {
  slug: 'booking-series',
  access: {
    create: () => true, // backend creates these during booking submit (with or without user)
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return { user: { equals: user.id } }
    },
    update: admins,
    delete: admins,
  },
  admin: {
    defaultColumns: ['id', 'frequency', 'status', 'anchorDayOfWeek', 'anchorTime', 'createdAt'],
    useAsTitle: 'id',
    group: 'Bookings',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false, // guest series have no user
      admin: { position: 'sidebar', description: 'Owning customer (null for guest series)' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'frequency',
          type: 'select',
          required: true,
          options: [
            { label: 'Weekly', value: 'weekly' },
            { label: 'Biweekly', value: 'biweekly' },
            { label: 'Every 3 Weeks', value: '3weekly' },
            { label: 'Monthly', value: 'monthly' },
            { label: 'Every 8 Weeks', value: '8weekly' },
          ],
        },
        {
          name: 'anchorDayOfWeek',
          type: 'number',
          required: true,
          min: 0,
          max: 6,
          admin: { description: '0=Sunday, 6=Saturday' },
        },
        {
          name: 'anchorTime',
          type: 'text',
          required: true,
          admin: { description: 'HH:mm in calendar timezone, e.g. "11:00"' },
        },
      ],
    },
    {
      name: 'cancelledAt',
      type: 'date',
      admin: { position: 'sidebar', description: 'When the series was cancelled' },
    },
    {
      name: 'cancellationReason',
      type: 'textarea',
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
