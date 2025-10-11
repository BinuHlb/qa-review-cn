"use client"

import { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Info Row - Label + Value with icon
export interface InfoRowProps {
  icon?: LucideIcon
  label: string
  value: string | ReactNode
  valueClassName?: string
}

export function InfoRow({ icon: Icon, label, value, valueClassName }: InfoRowProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
        {Icon && <Icon className="h-3 w-3" />}
        <span className="font-medium">{label}</span>
      </div>
      <div className={cn("text-xs font-medium text-neutral-900 dark:text-neutral-100", valueClassName)}>
        {value}
      </div>
    </div>
  )
}

// Stats Grid - 2 column grid of stats
export interface StatItem {
  icon?: LucideIcon
  label: string
  value: string | number | ReactNode
  valueClassName?: string
}

interface StatsGridProps {
  stats: StatItem[]
  columns?: 2 | 3 | 4
  className?: string
}

export function StatsGrid({ stats, columns = 2, className }: StatsGridProps) {
  return (
    <div className={cn(`grid grid-cols-${columns} gap-3 text-xs`, className)}>
      {stats.map((stat, index) => (
        <InfoRow
          key={index}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          valueClassName={stat.valueClassName}
        />
      ))}
    </div>
  )
}

// Badge List - Display list of badges
interface BadgeListProps {
  label: string
  items: string[]
  variant?: "default" | "outline" | "secondary"
  maxVisible?: number
  className?: string
}

export function BadgeList({ label, items, variant = "outline", maxVisible, className }: BadgeListProps) {
  const visibleItems = maxVisible ? items.slice(0, maxVisible) : items
  const remainingCount = maxVisible && items.length > maxVisible ? items.length - maxVisible : 0

  return (
    <div className={cn("space-y-1", className)}>
      <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{label}</div>
      <div className="flex flex-wrap gap-1">
        {visibleItems.map((item, index) => (
          <Badge key={index} variant={variant} className="text-xs px-2 py-0.5">
            {item}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <Badge variant={variant} className="text-xs px-2 py-0.5">
            +{remainingCount}
          </Badge>
        )}
      </div>
    </div>
  )
}

// Contact Info Section
export interface ContactInfo {
  icon: LucideIcon
  label?: string
  value: string
  href?: string
}

interface ContactSectionProps {
  title: string
  contacts: ContactInfo[]
  className?: string
}

export function ContactSection({ title, contacts, className }: ContactSectionProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{title}</div>
      <div className="space-y-1">
        {contacts.map((contact, index) => (
          <div key={index} className="flex items-center gap-1 text-xs min-w-0 text-neutral-700 dark:text-neutral-300">
            <contact.icon className="h-3 w-3 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
            {contact.href ? (
              <a 
                href={contact.href} 
                className="truncate hover:text-primary hover:underline transition-colors"
                title={contact.value}
                onClick={(e) => e.stopPropagation()}
              >
                {contact.value}
              </a>
            ) : (
              <span className="truncate" title={contact.value}>
                {contact.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Progress Bar with Label
interface ProgressBarProps {
  label: string
  current: number
  max: number
  showNumbers?: boolean
  className?: string
  getColor?: (percentage: number) => string
}

export function ProgressBar({ 
  label, 
  current, 
  max, 
  showNumbers = true,
  className,
  getColor
}: ProgressBarProps) {
  const percentage = max > 0 ? (current / max) * 100 : 0
  
  const defaultColorClass = percentage >= 90 
    ? 'bg-red-500' 
    : percentage >= 75 
    ? 'bg-yellow-500' 
    : 'bg-green-500'
  
  const colorClass = getColor ? getColor(percentage / 100) : defaultColorClass

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-neutral-500 dark:text-neutral-400 font-medium">{label}</span>
        {showNumbers && (
          <span className={cn("font-medium", 
            percentage >= 90 ? 'text-red-500' : 
            percentage >= 75 ? 'text-yellow-500' : 
            'text-green-500'
          )}>
            {current}/{max}
          </span>
        )}
      </div>
      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
        <div 
          className={cn("h-2 rounded-full transition-all duration-300", colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Section Divider
interface SectionDividerProps {
  className?: string
}

export function SectionDivider({ className }: SectionDividerProps) {
  return (
    <div className={cn("border-t border-neutral-200 dark:border-neutral-700", className)} />
  )
}

// Collapsible Detail Container
interface DetailContainerProps {
  children: ReactNode
  className?: string
}

export function DetailContainer({ children, className }: DetailContainerProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {children}
    </div>
  )
}

