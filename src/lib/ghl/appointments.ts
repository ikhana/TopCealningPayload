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
  await ghlFetch(`/calendars/events/appointments/${appointmentId}`, {
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
