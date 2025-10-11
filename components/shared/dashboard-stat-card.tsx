"use client"

import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface DashboardStatCardProps {
  title: string
  value: string | number
  subtitle?: string | ReactNode
  icon?: LucideIcon
  variant?: "default" | "primary" | "accent" | "success" | "warning" | "danger"
  className?: string
  onClick?: () => void
}

/**
 * Modern glassmorphism stat card for dashboard
 * Features: Glass effect, gradients, smooth animations, scalable variants
 */
export function DashboardStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
  className,
  onClick
}: DashboardStatCardProps) {
  const variantClasses = {
    default: "bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-sm border-border/50",
    primary: "bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border-primary/20 hover:border-primary/40",
    accent: "bg-gradient-to-br from-accent/10 to-accent/5 backdrop-blur-sm border-accent/20 hover:border-accent/40",
    success: "bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 backdrop-blur-sm border-emerald-500/20 hover:border-emerald-500/40",
    warning: "bg-gradient-to-br from-amber-500/10 to-amber-500/5 backdrop-blur-sm border-amber-500/20 hover:border-amber-500/40",
    danger: "bg-gradient-to-br from-rose-500/10 to-rose-500/5 backdrop-blur-sm border-rose-500/20 hover:border-rose-500/40"
  }

  const iconColorClasses = {
    default: "text-muted-foreground",
    primary: "text-primary",
    accent: "text-accent",
    success: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    danger: "text-rose-600 dark:text-rose-400"
  }

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300 border",
        onClick && "cursor-pointer hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02] active:scale-[0.98]",
        variantClasses[variant],
        className
      )}
      onClick={onClick}
    >
      {/* Glassmorphism effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-foreground/90">
          {title}
        </CardTitle>
        {Icon && (
          <div className={cn(
            "p-2 rounded-lg bg-background/50 backdrop-blur-sm transition-all duration-300",
            onClick && "group-hover:scale-110 group-hover:rotate-3"
          )}>
            <Icon className={cn(
              "h-4 w-4 transition-colors duration-300",
              iconColorClasses[variant]
            )} />
          </div>
        )}
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          {value}
        </div>
        {subtitle && (
          <div className="text-xs text-muted-foreground/80 mt-2 font-medium">
            {subtitle}
          </div>
        )}
      </CardContent>
      
      {/* Hover effect */}
      {onClick && (
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </Card>
  )
}

