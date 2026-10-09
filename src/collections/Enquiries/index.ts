// src/collections/Enquiries/index.ts
import type { CollectionConfig } from 'payload'

import { admins } from '@/access/admins'
import { releaseToGhl } from './hooks/releaseToGhl'

/**
 * Every lead the website captures, in one place, BEFORE it goes anywhere else.
 *
 * Ported from BrandBloomPayload's Enquiries collection. The point of it is the same:
 * this is the system of record, and GoHighLevel is downstream of it.
 *
 * What it replaces. The two lead routes (/api/ghl/lead-capture and
 * /api/ghl/form-submit) used to write straight to GoHighLevel and keep nothing. That
 * had two silent failure modes:
 *
 *   1. A submission the bot screen flagged was answered "ok" and DROPPED. No row, no
 *      trace except one log line in Vercel. A false positive lost a real customer
 *      invisibly (src/lib/botid.ts says so in its own header).
 *   2. If GoHighLevel was down, rate limited or its token had expired, the request
 *      failed and the enquiry was gone.
 *
 * Now every submission is stored first. A suspected bot becomes a QUARANTINED row that
 * is never sent to the CRM but can be read, judged and released. A failed sync becomes
 * a FAILED row that can be retried. Nothing is lost either way.
 *
 * `create` is closed to the public even though the public fills it. Submissions arrive
 * through the two routes, which write with overrideAccess after the spam checks have
 * run and the IP and consent version have been stamped server side. Leaving create open
 * would let anyone POST a row straight past all of that.
 */
export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  access: {
    create: admins,
    read: admins,
    update: admins,
    delete: admins,
  },
  admin: {
    defaultColumns: ['email', 'source', 'syncStatus', 'spamReasons', 'createdAt'],
    useAsTitle: 'email',
    group: 'Leads',
    description:
      'Every enquiry from the website, stored before it is sent to GoHighLevel. Filter by "Quarantined" to review suspected spam; a real customer caught by mistake can be released by setting Sync status to Pending.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          type: 'select',
          required: true,
          options: [
            { label: 'Booking form, step 1', value: 'booking-start' },
            { label: 'Contact form', value: 'contact' },
            { label: 'Job application', value: 'careers' },
          ],
          admin: {
            width: '50%',
            description: 'Which form it came from. Decides what is sent to GoHighLevel.',
          },
        },
        {
          name: 'draftToken',
          type: 'text',
          index: true,
          admin: {
            width: '50%',
            readOnly: true,
            description:
              'Booking form only: the draft this lead belongs to. A second submission from the same draft updates this row instead of adding another.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'firstName', type: 'text', admin: { width: '50%' } },
        { name: 'lastName', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', required: true, admin: { width: '50%' } },
        {
          name: 'phone',
          type: 'text',
          admin: { width: '50%', description: 'Stored as sent to GoHighLevel (E.164).' },
        },
      ],
    },
    {
      name: 'details',
      type: 'json',
      label: 'Everything else the form sent',
      admin: {
        description:
          'The form-specific answers (service and message for the contact form, the application answers for careers), kept as submitted.',
      },
    },
    {
      name: 'resumeNote',
      type: 'text',
      admin: {
        readOnly: true,
        condition: (data) => data?.source === 'careers',
        description:
          'Applications only. The attached resume is uploaded to GoHighLevel during the live submission and is not stored here, so a released application has no resume. The filename is recorded so the applicant can be asked for it again.',
      },
    },

    {
      name: 'consent',
      type: 'group',
      label: 'A2P consent evidence',
      admin: {
        description:
          'What a carrier asks for when it audits a number. Do not edit any of it by hand: an edited consent record is worth less than none, because it still looks like evidence. Timestamp, IP and wording version are taken on the server, never from the browser.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'service',
              type: 'select',
              label: 'Service messages',
              options: [
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },
                { label: 'Not offered on this form', value: 'not-offered' },
              ],
              admin: { width: '50%', readOnly: true },
            },
            {
              name: 'marketing',
              type: 'select',
              label: 'Marketing messages',
              options: [
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },
                { label: 'Not offered on this form', value: 'not-offered' },
              ],
              admin: { width: '50%', readOnly: true },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'version',
              type: 'text',
              admin: {
                width: '50%',
                readOnly: true,
                description: 'Resolves against CONSENT_VERSION in src/lib/consent.ts.',
              },
            },
            {
              name: 'capturedAt',
              type: 'date',
              admin: { width: '50%', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'ip', type: 'text', label: 'IP address', admin: { width: '50%', readOnly: true } },
            { name: 'userAgent', type: 'text', admin: { width: '50%', readOnly: true } },
          ],
        },
      ],
    },

    {
      name: 'syncStatus',
      type: 'select',
      defaultValue: 'pending',
      index: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Synced', value: 'synced' },
        { label: 'Failed', value: 'failed' },
        { label: 'Skipped, GHL not configured', value: 'skipped' },
        { label: 'Quarantined, suspected spam', value: 'quarantined' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'Quarantined means a spam check caught it and it was deliberately never sent. Failed means GoHighLevel was tried and did not take it. Skipped means GoHighLevel was not configured at the time. To send any of them, choose Pending and save: the sync runs a few seconds after the save, so reload the row to see the result (Synced, or Failed with the reason in Sync attempts). Synced, Failed and Skipped are written by the sync, not chosen here, and picking one by hand is read as a request to send. Read "Why it was quarantined" first.',
      },
      hooks: {
        beforeChange: [
          /**
           * Stops a person recording an outcome the sync never produced.
           *
           * The obvious way to send a held lead is to pick "Synced", which would write
           * the word and nothing else: no contact in the CRM, and a record claiming it
           * had one. A status that lies is worse than one that says quarantined, because
           * nobody goes back and checks it. Synced, Failed and Skipped belong to the
           * sync. A human choosing one is asking for the thing to happen, so it becomes
           * Pending, and the afterChange hook runs it.
           */
          ({ value, previousValue, req, operation }) => {
            if (operation !== 'update') return value
            if (req.context?.skipSync) return value // the sync's own writes
            if (value === previousValue) return value
            if (!['synced', 'failed', 'skipped'].includes(String(value))) return value
            req.payload.logger.info(
              `[enquiries] "${value}" chosen by hand, read as a request to send; set to pending`,
            )
            return 'pending'
          },
        ],
      },
    },
    {
      name: 'spamReasons',
      type: 'text',
      label: 'Why it was quarantined',
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (data) => data?.syncStatus === 'quarantined',
        description:
          'Which checks fired. A lead caught only on fill time is a much weaker signal than one that also failed the bot challenge. Worth reading before releasing one.',
      },
    },
    {
      name: 'ghl',
      type: 'group',
      label: 'GoHighLevel',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'contactId', type: 'text', admin: { readOnly: true } },
        {
          name: 'opportunityId',
          type: 'text',
          admin: {
            readOnly: true,
            description: 'Set once, so a retry cannot create a second opportunity.',
          },
        },
      ],
    },
    {
      name: 'syncLog',
      type: 'array',
      label: 'Sync attempts',
      admin: {
        description: 'Every attempt with its outcome, so a missing lead can be traced rather than guessed at.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'at', type: 'date', admin: { width: '33%', date: { pickerAppearance: 'dayAndTime' } } },
            {
              name: 'result',
              type: 'select',
              options: [
                { label: 'OK', value: 'ok' },
                { label: 'Error', value: 'error' },
                { label: 'Skipped', value: 'skipped' },
              ],
              admin: { width: '33%' },
            },
            { name: 'step', type: 'text', admin: { width: '34%' } },
          ],
        },
        { name: 'detail', type: 'textarea' },
      ],
    },
  ],

  hooks: {
    // Setting syncStatus to Pending is what releases a lead to GoHighLevel.
    afterChange: [releaseToGhl],
  },

  timestamps: true,
}
