// blocks/ScheduleCallCTA/config.ts

import type { Block } from 'payload'
import { sectionIdField } from '@/fields/sectionId'
import { richTextField } from '@/fields/richTextField'

export const ScheduleCallCTA: Block = {
  slug: 'scheduleCallCTA',
  interfaceName: 'ScheduleCallCTABlock',
  dbName: 'schedule_call_cta',
  fields: [
    sectionIdField(),
    
    {
      name: 'negativeOffset',
      type: 'checkbox',
      label: 'Overlap Footer',
      defaultValue: true,
      admin: {
        description: 'Enable negative margin to overlap with footer section',
      },
    },
    
    // Logos section (optional)
    {
      name: 'showLogos',
      type: 'checkbox',
      label: 'Show Logos Section',
      defaultValue: true,
    },
    
    {
      name: 'logos',
      type: 'array',
      label: 'Partner Logos',
      minRows: 0,
      maxRows: 10,
      admin: {
        condition: (_, { showLogos }) => Boolean(showLogos),
      },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'width',
          type: 'number',
          defaultValue: 120,
          admin: {
            description: 'Logo width in pixels',
          },
        },
        {
          name: 'height',
          type: 'number',
          defaultValue: 60,
          admin: {
            description: 'Logo height in pixels',
          },
        },
      ],
    },
    
    // Main heading
    richTextField({
      name: 'heading',
      label: 'Main Heading',
      required: true,
      overrides: {
        admin: {
          description: 'Main CTA heading',
        },
      },
    }),
    
    // Left column content
    richTextField({
      name: 'leftContent',
      label: 'Left Column Content',
      required: true,
      overrides: {
        admin: {
          description: 'Description and benefits text',
        },
      },
    }),
    
    // Founder section
    {
      name: 'founderSection',
      type: 'group',
      label: 'Founder Section',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            description: 'Founder/team member photo',
          },
        },
        {
          name: 'name',
          type: 'text',
          required: false,
          maxLength: 50,
          admin: {
            description: 'Founder name (max 50 characters)',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: false,
          maxLength: 50,
          admin: {
            description: 'Founder title (max 50 characters)',
          },
        },
      ],
    },
    
    // Phone number
    {
      name: 'phoneNumber',
      type: 'text',
      required: false,
      admin: {
        description: 'Phone number for calling (e.g., 2122021810)',
      },
    },
    
    {
      name: 'phoneDisplay',
      type: 'text',
      required: false,
      admin: {
        description: 'Phone number display format (e.g., (212) 202-1810)',
      },
    },
    
    // Form relationship
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      admin: {
        description: 'Select the contact form to display',
      },
    },
    
    // Calendar toggle settings
    {
      name: 'enableCalendarToggle',
      type: 'checkbox',
      label: 'Enable Form/Calendar Toggle',
      defaultValue: false,
      admin: {
        description: 'Alternate between form and calendar embed',
      },
    },
    
    {
      name: 'calendarUrl',
      type: 'text',
      required: false,
      admin: {
        condition: (_, { enableCalendarToggle }) => Boolean(enableCalendarToggle),
        description: 'Calendar embed URL (Calendly, GHL, etc.)',
      },
    },
    
    {
      name: 'displayDuration',
      type: 'number',
      defaultValue: 5,
      admin: {
        condition: (_, { enableCalendarToggle }) => Boolean(enableCalendarToggle),
        description: 'Seconds to display each view before switching',
      },
    },
    
    // Disclaimer
    {
      name: 'disclaimer',
      type: 'textarea',
      required: false,
      maxLength: 200,
      admin: {
        rows: 2,
        description: 'Legal disclaimer text (max 200 characters)',
      },
    },
  ],
  labels: {
    plural: 'Schedule Call CTA Sections',
    singular: 'Schedule Call CTA Section',
  },
}