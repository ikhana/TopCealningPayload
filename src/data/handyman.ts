// src/data/handyman.ts
//
// The handyman question options, in one place.
//
// These are not free display strings. Both lists are written verbatim into GHL
// custom fields that hold a fixed option set — `contact.handyman_service_type`
// (MULTIPLE_OPTIONS) and `contact.job_conditions` (CHECKBOX). GHL silently drops
// a value that is not in the field's option list, so a string edited here and
// not mirrored in GHL does not error: the answer just never arrives.
//
// .seed/ghl-provision.ts asserts the two sides agree. Run it after any edit.

export const HANDYMAN_SERVICES = [
  'TV mounting',
  'Plumbing minor repairs',
  'Drywall repair',
  'Door/lock fixing',
  'Furniture assembly',
  'Painting touch-ups',
  'Other',
] as const

/**
 * The opt-out answer (Geraldine, 2026-09-21).
 *
 * Exclusive: picking it clears the others, and picking any other clears it.
 * Without that, "Urgent / same-day" and "None of the above" can both be set,
 * which is a contradiction someone has to resolve on the phone.
 *
 * Kept as a real stored value rather than just leaving the list empty, because
 * an empty list is ambiguous — it cannot distinguish "the customer read the
 * question and none applied" from "the customer skipped it". For an urgency and
 * safety question, that difference is worth a field.
 */
export const JOB_CONDITION_NONE = 'None of the above'

export const JOB_CONDITIONS = [
  'Urgent / same-day',
  'Attempted before by someone else',
  'Visible damage or safety risk',
  JOB_CONDITION_NONE,
] as const
