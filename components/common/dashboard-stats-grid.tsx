/**
 * Dashboard Stats Grid Component
 * Reusable stats display following shadcn standards
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DashboardStat {
  title: string
  value: string | number
  subtitle?: string | React.ReactNode
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  onClick?: () => void
  variant?: "default" | "success" | "warning" | "destructive"
}

interface DashboardStatsGridProps {
  stats: DashboardStat[]
  columns?: 2 | 3 | 4 | 5
  className?: string
}

const variantStyles = {
  default: "border-border hover:border-primary/50",
  success: "border-green-500/20 hover:border-green-500/40 bg-green-50/50 dark:bg-green-950/20",
  warning: "border-amber-500/20 hover:border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20",
  destructive: "border-destructive/20 hover:border-destructive/40 bg-destructive/5"
}

const iconVariantStyles = {
  default: "text-muted-foreground",
  success: "text-green-600 dark:text-green-400",
  warning: "text-amber-600 dark:text-amber-400",
  destructive: "text-destructive"
}

export function DashboardStatsGrid({ 
  stats, 
  columns = 4,
  className 
}: DashboardStatsGridProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
    5: "md:grid-cols-3 lg:grid-cols-5"
  }

  return (
    <div className={cn("grid grid-cols-1 gap-4", gridCols[columns], className)}>
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={cn(
            "transition-all duration-200",
            stat.onClick && "cursor-pointer hover:shadow-md hover:scale-[1.02]",
            variantStyles[stat.variant || "default"]
          )}
          onClick={stat.onClick}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={cn("h-4 w-4", iconVariantStyles[stat.variant || "default"])} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.subtitle && (
              <p className="text-xs text-muted-foreground mt-1">
                {stat.subtitle}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

