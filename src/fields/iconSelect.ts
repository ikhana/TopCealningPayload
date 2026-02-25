// fields/iconSelect.ts

import type { Field } from 'payload'
import { deepMerge } from '@/utilities/deepMerge'

export const availableIcons = [
  // Financial & Business
  { label: 'Trending Up', value: 'trending-up' },
  { label: 'Bar Chart', value: 'bar-chart' },
  { label: 'Pie Chart', value: 'pie-chart' },
  { label: 'Line Chart', value: 'line-chart' },
  { label: 'Dollar Sign', value: 'dollar-sign' },
  { label: 'Credit Card', value: 'credit-card' },
  { label: 'Wallet', value: 'wallet' },
  { label: 'Briefcase', value: 'briefcase' },
  { label: 'Building', value: 'building' },
  { label: 'Building 2', value: 'building-2' },
  { label: 'Bank', value: 'landmark' },
  
  // Protection & Security
  { label: 'Shield', value: 'shield' },
  { label: 'Shield Check', value: 'shield-check' },
  { label: 'Lock', value: 'lock' },
  { label: 'Key', value: 'key' },
  
  // Growth & Strategy
  { label: 'Target', value: 'target' },
  { label: 'Award', value: 'award' },
  { label: 'Trophy', value: 'trophy' },
  { label: 'Medal', value: 'medal' },
  { label: 'Lightbulb', value: 'lightbulb' },
  { label: 'Rocket', value: 'rocket' },
  { label: 'Zap', value: 'zap' },
  { label: 'Gift', value: 'gift' }, // ✅ ADDED MISSING ICON
  
  // Technology
  { label: 'Cpu', value: 'cpu' },
  { label: 'Layers', value: 'layers' },
  { label: 'Settings', value: 'settings' },
  { label: 'Activity', value: 'activity' },
  
  // People & Communication
  { label: 'Users', value: 'users' },
  { label: 'User', value: 'user' },
  { label: 'User Check', value: 'user-check' },
  { label: 'Heart', value: 'heart' },
  { label: 'Handshake', value: 'handshake' },
  
  // Documents & Files
  { label: 'File Text', value: 'file-text' },
  { label: 'Clipboard', value: 'clipboard' },
  { label: 'Check Circle', value: 'check-circle' },
  { label: 'Check Square', value: 'check-square' },
  { label: 'Book Open', value: 'book-open' },
  { label: 'Scroll Text', value: 'scroll-text' },
  { label: 'Bookmark Check', value: 'bookmark-check' },
  
  // Time & Calendar
  { label: 'Calendar', value: 'calendar' },
  { label: 'Clock', value: 'clock' },
  { label: 'Timer', value: 'timer' },
  
  // Location & Navigation
  { label: 'Map Pin', value: 'map-pin' },
  { label: 'Navigation', value: 'navigation' },
  { label: 'Compass', value: 'compass' },
  
  // Arrows & Directions
  { label: 'Arrow Right', value: 'arrow-right' },
  { label: 'Arrow Up Right', value: 'arrow-up-right' },
  { label: 'Arrow Down Left', value: 'arrow-down-left' },
  { label: 'Chevron Right', value: 'chevron-right' },
  
  // Education
  { label: 'Graduation Cap', value: 'graduation-cap' },
  
  // Miscellaneous
  { label: 'Star', value: 'star' },
  { label: 'Globe', value: 'globe' },
  { label: 'Home', value: 'home' },
  { label: 'Phone', value: 'phone' },
  { label: 'Mail', value: 'mail' },
  { label: 'Message Circle', value: 'message-circle' },
  { label: 'Baggage Claim', value: 'baggage-claim' },
  { label: 'Circle Fading Plus', value: 'circle-fading-plus' },
  { label: 'Thermometer', value: 'thermometer' },
  { label: 'Badge Alert', value: 'badge-alert' },
]

type IconSelectType = (options?: {
  name?: string
  label?: string
  required?: boolean
  overrides?: Partial<Field>
}) => Field

export const iconSelectField: IconSelectType = ({
  name = 'icon',
  label = 'Icon',
  required = false,
  overrides = {},
} = {}) => {
  const iconSelectConfig: Field = {
    name,
    type: 'select',
    label,
    required,
    options: availableIcons,
    admin: {
      description: 'Select an icon from the available options',
    },
  }

  return deepMerge(iconSelectConfig, overrides)
}