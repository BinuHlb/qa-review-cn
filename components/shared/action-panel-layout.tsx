"use client"

import { ReactNode } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { generateInitials, generateAvatarColor } from "@/lib/utils/review-utils"

// Section wrapper for consistent spacing
interface ActionPanelSectionProps {
  children: ReactNode
  className?: string
}

export function ActionPanelSection({ children, className }: ActionPanelSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {children}
    </div>
  )
}

// Header component for action panels
interface ActionPanelHeaderProps {
  title: string
  subtitle?: string
  badges?: Array<{
    label: string
    variant?: "default" | "outline" | "secondary" | "destructive"
    className?: string
  }>
  avatar?: {
    name: string
    fallbackText?: string
  }
  actions?: ReactNode
}

export function ActionPanelHeader({ 
  title, 
  subtitle, 
  badges, 
  avatar,
  actions 
}: ActionPanelHeaderProps) {
  return (
    <div className="flex-shrink-0 p-6 pb-4 border-b dark:border-neutral-700">
      <div className="flex items-center gap-3">
        {avatar && (
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarFallback className={`${generateAvatarColor(avatar.name)} text-sm font-semibold`}>
              {avatar.fallbackText || generateInitials(avatar.name)}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100 truncate" title={title}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate" title={subtitle}>
              {subtitle}
            </p>
          )}
          {badges && badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {badges.map((badge, index) => (
                <Badge 
                  key={index} 
                  variant={badge.variant || "outline"}
                  className={cn("text-xs", badge.className)}
                >
                  {badge.label}
                </Badge>
              ))}
            </div>
          )}
        </div>
        {actions && (
          <div className="flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

// Form section wrapper with consistent styling
interface ActionPanelFormSectionProps {
  title: string
  icon?: ReactNode
  description?: string
  children: ReactNode
  variant?: "default" | "primary" | "warning"
  className?: string
}

export function ActionPanelFormSection({ 
  title, 
  icon, 
  description,
  children, 
  variant = "default",
  className 
}: ActionPanelFormSectionProps) {
  const variantClasses = {
    default: "bg-muted/50",
    primary: "bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/50",
    warning: "bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/50"
  }

  return (
    <div className={cn("rounded-lg p-4", variantClasses[variant], className)}>
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-muted">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="flex items-center justify-center">
              {icon}
            </div>
          )}
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
        </div>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

// Info card for displaying key-value pairs
interface ActionPanelInfoCardProps {
  items: Array<{
    icon?: ReactNode
    label: string
    value: ReactNode
    valueClassName?: string
  }>
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function ActionPanelInfoCard({ items, columns = 2, className }: ActionPanelInfoCardProps) {
  const gridClass = columns === 1 
    ? "grid-cols-1" 
    : columns === 3 
    ? "grid-cols-3" 
    : columns === 4 
    ? "grid-cols-4" 
    : "grid-cols-2"

  return (
    <div className={cn(`grid ${gridClass} gap-3`, className)}>
      {items.map((item, index) => (
        <div key={index} className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            {item.icon}
            <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
          </div>
          <div className={cn("font-semibold text-sm text-foreground", item.valueClassName)}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  )
}

// Main layout container
interface ActionPanelLayoutProps {
  header?: ReactNode
  children: ReactNode
  className?: string
}

export function ActionPanelLayout({ header, children, className }: ActionPanelLayoutProps) {
  return (
    <div className={cn("h-full flex flex-col bg-background overflow-hidden", className)}>
      {header}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}

// Scrollable content area (for complex layouts)
interface ActionPanelScrollAreaProps {
  children: ReactNode
  className?: string
}

export function ActionPanelScrollArea({ children, className }: ActionPanelScrollAreaProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto min-h-0 px-6 py-4", className)}>
      {children}
    </div>
  )
}


