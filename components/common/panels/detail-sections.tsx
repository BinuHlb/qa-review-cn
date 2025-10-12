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
    <div className="space-y-1.5 group cursor-default">
      <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 transition-colors group-hover:text-neutral-700 dark:group-hover:text-neutral-300">
        {Icon && <Icon className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />}
        <span className="font-medium">{label}</span>
      </div>
      <div className={cn(
        "text-xs font-semibold text-neutral-900 dark:text-neutral-100 transition-colors",
        valueClassName
      )}>
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
  const gridClass = columns === 3 
    ? "grid-cols-3" 
    : columns === 4 
    ? "grid-cols-4" 
    : "grid-cols-2"
    
  return (
    <div className={cn(`grid ${gridClass} gap-3 text-xs`, className)}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both"
          style={{ animationDelay: `${index * 50}ms`, animationDuration: '300ms' }}
        >
          <InfoRow
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            valueClassName={stat.valueClassName}
          />
        </div>
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
    <div className={cn("space-y-2", className)}>
      <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium transition-colors hover:text-neutral-700 dark:hover:text-neutral-300">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {visibleItems.map((item, index) => (
          <Badge 
            key={index} 
            variant={variant} 
            className="text-xs px-2.5 py-1 transition-all duration-200 hover:scale-105 hover:shadow-sm cursor-default animate-in fade-in-0 zoom-in-95 fill-mode-both"
            style={{ animationDelay: `${index * 30}ms`, animationDuration: '200ms' }}
          >
            {item}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <Badge 
            variant={variant} 
            className="text-xs px-2.5 py-1 transition-all duration-200 hover:scale-105 hover:shadow-sm cursor-default font-semibold"
          >
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
    <div className={cn("space-y-2", className)}>
      <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium transition-colors hover:text-neutral-700 dark:hover:text-neutral-300">
        {title}
      </div>
      <div className="space-y-1.5">
        {contacts.map((contact, index) => (
          <div 
            key={index} 
            className="flex items-center gap-2 text-xs min-w-0 text-neutral-700 dark:text-neutral-300 group p-1.5 -ml-1.5 rounded-md transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800/50 animate-in fade-in-0 slide-in-from-left-2 fill-mode-both"
            style={{ animationDelay: `${index * 50}ms`, animationDuration: '250ms' }}
          >
            <contact.icon className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400 flex-shrink-0 transition-all group-hover:text-primary group-hover:scale-110" />
            {contact.href ? (
              <a 
                href={contact.href} 
                className="truncate font-medium hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                title={contact.value}
                onClick={(e) => e.stopPropagation()}
              >
                {contact.value}
              </a>
            ) : (
              <span className="truncate font-medium" title={contact.value}>
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
    <div className={cn("space-y-2 group", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-neutral-500 dark:text-neutral-400 font-medium transition-colors group-hover:text-neutral-700 dark:group-hover:text-neutral-300">
          {label}
        </span>
        {showNumbers && (
          <span className={cn("font-semibold tabular-nums transition-all duration-300", 
            percentage >= 90 ? 'text-red-500 group-hover:scale-110' : 
            percentage >= 75 ? 'text-yellow-500 group-hover:scale-110' : 
            'text-green-500 group-hover:scale-110'
          )}>
            {current}/{max}
          </span>
        )}
      </div>
      <div className="relative w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5 overflow-hidden shadow-inner">
        <div 
          className={cn(
            "h-2.5 rounded-full transition-all duration-500 ease-out relative overflow-hidden",
            colorClass,
            "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent",
            "before:animate-shimmer"
          )}
          style={{ 
            width: `${percentage}%`,
            boxShadow: percentage > 0 ? '0 1px 3px rgba(0,0,0,0.12)' : 'none'
          }}
        />
        {/* Percentage indicator dot */}
        {percentage > 5 && percentage < 95 && (
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full shadow-sm transition-all duration-500"
            style={{ left: `${percentage}%` }}
          />
        )}
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
    <div className={cn("space-y-4 animate-in fade-in-0 slide-in-from-top-3 duration-400", className)}>
      {children}
    </div>
  )
}

