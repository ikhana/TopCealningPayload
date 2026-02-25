// src/blocks/CalendarBooking/config.ts
import type { Block } from 'payload'

export const CalendarBooking: Block = {
  slug: 'calendarBooking',
  interfaceName: 'CalendarBookingBlock',
  fields: [
    // Section Configuration
    {
      name: 'sectionTitle',
      type: 'text',
      required: true,
      defaultValue: 'Schedule Your Lab Test',
      admin: {
        description: 'Main section heading',
      },
    },
    {
      name: 'sectionSubtitle',
      type: 'textarea',
      admin: {
        description: 'Section description below the title',
        rows: 3,
      },
      defaultValue: 'Choose your preferred date and time for mobile laboratory services. Our certified professionals will come to your location with all necessary equipment.',
    },

    // Calendar Configuration
    {
      name: 'calendarIframeUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'GoHighLevel calendar iframe URL (e.g., https://link.brandbloom.org/widget/booking/F06h1x3q4vC0Zz9z9FPC)',
        placeholder: 'https://link.brandbloom.org/widget/booking/YOUR_CALENDAR_ID',
      },
    },
    {
      name: 'calendarTitle',
      type: 'text',
      defaultValue: 'Select Your Appointment',
      admin: {
        description: 'Title displayed above the calendar widget',
      },
    },
    {
      name: 'calendarDescription',
      type: 'text',
      defaultValue: 'Mobile lab services • Same-day results available',
      admin: {
        description: 'Description displayed below the calendar title',
      },
    },

    // Trust Indicators
    {
      name: 'trustIndicators',
      type: 'array',
      maxRows: 6,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Trust indicator title (e.g., "Same-Day Availability")',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Trust indicator description',
            rows: 2,
          },
        },
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'calendar',
          options: [
            {
              label: 'Calendar',
              value: 'calendar',
            },
            {
              label: 'Clock (Time)',
              value: 'clock',
            },
            {
              label: 'Map Pin (Location)',
              value: 'mappin',
            },
            {
              label: 'Zap (Speed/Fast)',
              value: 'zap',
            },
          ],
          admin: {
            description: 'Icon to display with this trust indicator',
          },
        },
      ],
      defaultValue: [
        {
          title: 'Same-Day Availability',
          description: 'Flexible scheduling with same-day and next-day appointments available',
          icon: 'calendar',
        },
        {
          title: 'Mobile Service',
          description: 'We come to your home, office, or preferred location',
          icon: 'mappin',
        },
        {
          title: 'Fast Results',
          description: 'CLIA-certified lab results delivered within 24-48 hours',
          icon: 'zap',
        },
      ],
      admin: {
        description: 'Trust indicators displayed below the calendar (3-4 recommended)',
      },
    },

    // Visual Configuration
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'gradient',
      options: [
        {
          label: 'White Background',
          value: 'white',
        },
        {
          label: 'Clinical White',
          value: 'clinical',
        },
        {
          label: 'Gradient Background (Recommended)',
          value: 'gradient',
        },
        {
          label: 'Coral Accent Background',
          value: 'coral',
        },
      ],
      admin: {
        description: 'Background style for the section',
      },
    },
    {
      name: 'enableBackgroundPattern',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show subtle medical grid pattern in background',
      },
    },
  ],
  labels: {
    singular: 'Calendar Booking Block',
    plural: 'Calendar Booking Blocks',
  },
}