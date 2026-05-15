import { ghlFetch } from './client'
import type { GhlAppointment, GhlCreateAppointmentPayload } from './types'

export async function createAppointment(
  data: GhlCreateAppointmentPayload,
): Promise<GhlAppointment> {
  const res = await ghlFetch('/calendars/events/appointments', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      appointmentStatus: data.appointmentStatus ?? 'confirmed',
      ignoreDateRange: data.ignoreDateRange ?? false,
      toNotify: data.toNotify ?? true,
    }),
  })
  return res.json()
}

export async function cancelAppointment(appointmentId: string): Promise<void> {
  // GHL API quirk: DELETE uses /calendars/events/{id}, NOT /calendars/events/appointments/{id}.
  // The latter returns 401 "This route is not yet supported by the IAM Service" even with full scopes.
  // POST uses /calendars/events/appointments — only the DELETE path differs.
  await ghlFetch(`/calendars/events/${appointmentId}`, {
    method: 'DELETE',
  })
}

export async function getAppointmentsForContact(
  contactId: string,
): Promise<GhlAppointment[]> {
  const res = await ghlFetch(`/contacts/${contactId}/appointments`)
  const json = await res.json()
  return json.events ?? []
}
