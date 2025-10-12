/**
 * Task Card Component
 * Displays actionable tasks on dashboards with counts and priority indicators
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  title: string
  description?: string
  count: number
  variant?: 'default' | 'urgent' | 'info' | 'success'
  icon?: React.ReactNode
  onViewAll?: () => void
  children?: React.ReactNode
  className?: string
}

export function TaskCard({
  title,
  description,
  count,
  variant = 'default',
  icon,
  onViewAll,
  children,
  className = ""
}: TaskCardProps) {
  const variantStyles = {
    default: {
      card: 'border-gray-200',
      header: 'bg-gray-50',
      badge: 'bg-gray-600 text-white'
    },
    urgent: {
      card: 'border-red-200 bg-red-50/30',
      header: 'bg-red-50',
      badge: 'bg-red-600 text-white'
    },
    info: {
      card: 'border-blue-200',
      header: 'bg-blue-50',
      badge: 'bg-blue-600 text-white'
    },
    success: {
      card: 'border-green-200',
      header: 'bg-green-50',
      badge: 'bg-green-600 text-white'
    }
  }
  
  const styles = variantStyles[variant]
  
  return (
    <Card className={cn(styles.card, 'overflow-hidden', className)}>
      <CardHeader className={cn(styles.header, 'pb-3')}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {icon && (
              <div className={cn(
                'p-2 rounded-lg',
                variant === 'urgent' ? 'bg-red-100' :
                variant === 'info' ? 'bg-blue-100' :
                variant === 'success' ? 'bg-green-100' :
                'bg-gray-100'
              )}>
                {icon}
              </div>
            )}
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                {title}
                {variant === 'urgent' && (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
              </CardTitle>
              {description && (
                <CardDescription className="text-xs">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
          <Badge className={cn(styles.badge, 'text-sm font-bold px-3 py-1 border-0')}>
            {count}
          </Badge>
        </div>
      </CardHeader>
      
      {(children || onViewAll) && (
        <CardContent className="pt-4">
          {children}
          
          {onViewAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewAll}
              className="w-full mt-3 text-xs hover:bg-secondary"
            >
              View All
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  )
}

/**
 * Task Item Component
 * Individual task item to display within TaskCard
 */
interface TaskItemProps {
  title: string
  subtitle?: string
  badge?: React.ReactNode
  onClick?: () => void
  className?: string
}

export function TaskItem({
  title,
  subtitle,
  badge,
  onClick,
  className = ""
}: TaskItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center justify-between p-3 rounded-lg transition-colors',
        onClick ? 'cursor-pointer hover:bg-secondary/50' : '',
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {badge && (
        <div className="ml-3 flex-shrink-0">
          {badge}
        </div>
      )}
    </div>
  )
}

/**
 * Empty Task State
 * Shows when no tasks are available
 */
interface EmptyTaskStateProps {
  message?: string
  icon?: React.ReactNode
}

export function EmptyTaskState({ 
  message = "No pending tasks",
  icon 
}: EmptyTaskStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      {icon && (
        <div className="mb-3 text-muted-foreground opacity-50">
          {icon}
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        {message}
      </p>
    </div>
  )
}

