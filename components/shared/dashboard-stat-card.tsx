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
  variant?: "default" | "primary" | "accent"
  className?: string
  onClick?: () => void
}

/**
 * Standardized stat card for dashboard
 * Consistent styling across all dashboard metrics
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
    default: "",
    primary: "border-l-4 border-l-primary",
    accent: "border-l-4 border-l-accent-foreground"
  }

  return (
    <Card 
      className={cn(
        "transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-md hover:scale-[1.02]",
        variantClasses[variant],
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className={cn(
            "h-4 w-4",
            variant === "primary" ? "text-primary" : "text-muted-foreground",
            onClick && "group-hover:scale-110 transition-transform duration-200"
          )} />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <div className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

