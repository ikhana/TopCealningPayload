// components/ui/Icon/Icon.tsx

'use client'

import React from 'react'
import * as LucideIcons from 'lucide-react'
import { cn } from '@/utilities/cn'

// Helper function to convert PascalCase/kebab-case to kebab-case
function normalizeIconName(name: string): string {
  // If already kebab-case, return as-is
  if (name.includes('-')) return name.toLowerCase()
  
  // Convert PascalCase to kebab-case
  return name
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '') // Remove leading dash
}

const iconMap: Record<string, React.ComponentType<any>> = {
  // Financial & Business
  'trending-up': LucideIcons.TrendingUp,
  'bar-chart': LucideIcons.BarChart,
  'pie-chart': LucideIcons.PieChart,
  'line-chart': LucideIcons.LineChart,
  'dollar-sign': LucideIcons.DollarSign,
  'credit-card': LucideIcons.CreditCard,
  'wallet': LucideIcons.Wallet,
  'briefcase': LucideIcons.Briefcase,
  'building': LucideIcons.Building,
  'building-2': LucideIcons.Building2,
  'landmark': LucideIcons.Landmark,
  
  // Protection & Security
  'shield': LucideIcons.Shield,
  'shield-check': LucideIcons.ShieldCheck,
  'lock': LucideIcons.Lock,
  'key': LucideIcons.Key,
  
  // Growth & Strategy
  'target': LucideIcons.Target,
  'award': LucideIcons.Award,
  'trophy': LucideIcons.Trophy,
  'medal': LucideIcons.Medal,
  'lightbulb': LucideIcons.Lightbulb,
  'rocket': LucideIcons.Rocket,
  'zap': LucideIcons.Zap,
  'gift': LucideIcons.Gift, // ✅ ADDED MISSING ICON
  
  // Technology
  'cpu': LucideIcons.Cpu,
  'layers': LucideIcons.Layers,
  'settings': LucideIcons.Settings,
  'activity': LucideIcons.Activity,
  
  // People & Communication
  'users': LucideIcons.Users,
  'user': LucideIcons.User,
  'user-check': LucideIcons.UserCheck,
  'heart': LucideIcons.Heart,
  'handshake': LucideIcons.Handshake,
  
  // Documents & Files
  'file-text': LucideIcons.FileText,
  'clipboard': LucideIcons.Clipboard,
  'check-circle': LucideIcons.CheckCircle,
  'check-square': LucideIcons.CheckSquare,
  'book-open': LucideIcons.BookOpen,
  'scroll-text': LucideIcons.ScrollText,
  'bookmark-check': LucideIcons.BookmarkCheck,
  
  // Time & Calendar
  'calendar': LucideIcons.Calendar,
  'clock': LucideIcons.Clock,
  'timer': LucideIcons.Timer,
  
  // Location & Navigation
  'map-pin': LucideIcons.MapPin,
  'navigation': LucideIcons.Navigation,
  'compass': LucideIcons.Compass,
  
  // Arrows & Directions
  'arrow-right': LucideIcons.ArrowRight,
  'arrow-up-right': LucideIcons.ArrowUpRight,
  'arrow-down-left': LucideIcons.ArrowDownLeft,
  'chevron-right': LucideIcons.ChevronRight,
  
  // Education
  'graduation-cap': LucideIcons.GraduationCap,
  
  // Miscellaneous
  'star': LucideIcons.Star,
  'globe': LucideIcons.Globe,
  'home': LucideIcons.Home,
  'phone': LucideIcons.Phone,
  'mail': LucideIcons.Mail,
  'message-circle': LucideIcons.MessageCircle,
  'baggage-claim': LucideIcons.BaggageClaim,
  'circle-fading-plus': LucideIcons.CircleFadingPlus,
  'thermometer': LucideIcons.Thermometer,
  'badge-alert': LucideIcons.BadgeAlert,
}

type IconProps = {
  name?: string | null
  size?: number
  className?: string
  strokeWidth?: number
}

export function Icon({ name, size = 24, className, strokeWidth = 2 }: IconProps) {
  if (!name) return null

  // Normalize the icon name to kebab-case
  const normalizedName = normalizeIconName(name)
  const IconComponent = iconMap[normalizedName]

  if (!IconComponent) {
    console.warn(`Icon "${name}" (normalized: "${normalizedName}") not found in icon map`)
    return null
  }

  return (
    <IconComponent
      size={size}
      className={cn('inline-block', className)}
      strokeWidth={strokeWidth}
    />
  )
}