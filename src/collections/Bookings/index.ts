import type { CollectionConfig } from 'payload'
import { admins } from '@/access/admins'

const isOwner = ({ req: { user } }) => {
  if (!user) return false
  return { user: { equals: user.id } }
}

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  access: {
    create: () => true, // guests and logged-in users can both create bookings
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.roles?.includes('admin')) return true
      return { user: { equals: user.id } }
    },
    update: admins,
    delete: admins,
  },
  admin: {
    defaultColumns: ['confirmationCode', 'serviceType', 'serviceDate', 'status', 'createdAt'],
    useAsTitle: 'confirmationCode',
    group: 'Bookings',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false, // optional — guest bookings have no user association
      admin: { position: 'sidebar' },
    },
    {
      name: 'confirmationCode',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar', description: 'e.g. TC-2026-0042' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'serviceType',
          type: 'select',
          required: true,
          options: [
            { label: 'Residential', value: 'residential' },
            { label: 'Move In / Out', value: 'movein-out' },
            { label: 'Airbnb', value: 'airbnb' },
            { label: 'Commercial', value: 'commercial' },
            { label: 'Renovation', value: 'renovation' },
            { label: 'Hoarding', value: 'hoarding' },
            { label: 'Custom', value: 'custom' },
          ],
        },
        {
          name: 'frequency',
          type: 'select',
          required: true,
          options: [
            { label: 'One-time', value: 'one-time' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Biweekly', value: 'biweekly' },
            { label: 'Every 3 Weeks', value: '3weekly' },
            { label: 'Monthly', value: 'monthly' },
            { label: 'Every 8 Weeks', value: '8weekly' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'serviceDate',
          type: 'text',
          required: true,
          admin: { description: 'YYYY-MM-DD' },
        },
        {
          name: 'serviceTime',
          type: 'text',
          required: true,
          admin: { description: 'e.g. 09:00 AM' },
        },
      ],
    },
    {
      name: 'address',
      type: 'group',
      fields: [
        { name: 'street', type: 'text', required: true },
        { name: 'apt', type: 'text' },
        { name: 'city', type: 'text', required: true },
        { name: 'state', type: 'text', required: true },
        { name: 'zipCode', type: 'text', required: true },
      ],
    },
    {
      name: 'property',
      type: 'group',
      fields: [
        { name: 'squareFootage', type: 'number', min: 0 },
        { name: 'bedrooms', type: 'text' },
        { name: 'bathrooms', type: 'number', min: 0 },
      ],
    },
    {
      name: 'selectedExtras',
      type: 'array',
      fields: [
        { name: 'extraId', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
        { name: 'price', type: 'number', required: true, min: 0 },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'hasChildren', type: 'checkbox', defaultValue: false },
        { name: 'hasPets', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'accessMethod',
      type: 'text',
    },
    {
      name: 'customerNotes',
      type: 'textarea',
    },
    {
      name: 'pricing',
      type: 'group',
      fields: [
        { name: 'basePrice', type: 'number', min: 0, defaultValue: 0 },
        { name: 'extrasTotal', type: 'number', min: 0, defaultValue: 0 },
        { name: 'discount', type: 'number', min: 0, defaultValue: 0 },
        { name: 'total', type: 'number', min: 0, required: true },
        { name: 'currency', type: 'text', defaultValue: 'usd' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'ghlContactId',
      type: 'text',
      admin: { position: 'sidebar', description: 'GoHighLevel Contact ID' },
    },
    {
      name: 'ghlAppointmentId',
      type: 'text',
      admin: { position: 'sidebar', description: 'GoHighLevel Appointment ID' },
    },
    {
      name: 'ghlOpportunityId',
      type: 'text',
      admin: { position: 'sidebar', description: 'GoHighLevel Opportunity ID' },
    },
    {
      name: 'authnetCustomerProfileId',
      type: 'text',
      admin: { position: 'sidebar', description: 'Authorize.net CIM Customer Profile ID' },
    },
    {
      name: 'authnetPaymentProfileId',
      type: 'text',
      admin: { position: 'sidebar', description: 'Authorize.net CIM Payment Profile ID' },
    },
    {
      name: 'authnetTransactionId',
      type: 'text',
      admin: { position: 'sidebar', description: 'Authorize.net Transaction ID (set on completion)' },
    },
    {
      name: 'idempotencyKey',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar', description: 'UUID v4 — prevents double-submit' },
    },
    {
      name: 'failureReason',
      type: 'textarea',
      admin: { position: 'sidebar', description: 'Error detail for cancelled/failed bookings' },
    },
  ],
  timestamps: true,
}
