export interface GhlContact {
  id: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  locationId: string
  tags?: string[]
  customFields?: Array<{ id: string; field_value: string | number }>
  dateAdded?: string
  dateUpdated?: string
}

export interface GhlAppointment {
  id: string
  calendarId: string
  contactId: string
  startTime: string  // ISO 8601 with offset
  endTime: string
  title?: string
  status: 'new' | 'confirmed' | 'cancelled' | 'showed' | 'noshow' | 'invalid'
  address?: string
  notes?: string
  assignedUserId?: string
}

export interface GhlOpportunity {
  id: string
  name: string
  pipelineId: string
  pipelineStageId: string
  contactId: string
  status: 'open' | 'won' | 'lost' | 'abandoned'
  monetaryValue?: number
  assignedTo?: string
}

export interface GhlSlot {
  startTime: string
  endTime: string
}

export interface GhlFreeSlots {
  [date: string]: {
    slots: GhlSlot[]
  }
}

export interface GhlCustomFieldValue {
  id: string
  field_value: string | number | string[]
}

export interface GhlUpsertContactPayload {
  firstName?: string
  lastName?: string
  email: string
  phone: string
  locationId: string
  // Service address — powers {{contact.address1}} / {{contact.city}} /
  // {{contact.state}} merge fields in the booking emails.
  address1?: string
  city?: string
  state?: string
  postalCode?: string
  customFields?: GhlCustomFieldValue[]
  tags?: string[]
}

export interface GhlCreateAppointmentPayload {
  calendarId: string
  locationId: string
  contactId: string
  startTime: string
  endTime: string
  title?: string
  appointmentStatus?: 'new' | 'confirmed'
  address?: string
  notes?: string
  ignoreDateRange?: boolean
  toNotify?: boolean
}

export interface GhlCreateOpportunityPayload {
  pipelineId: string
  locationId: string
  name: string
  pipelineStageId: string
  contactId: string
  status?: 'open' | 'won' | 'lost' | 'abandoned'
  monetaryValue?: number
  assignedTo?: string
}
