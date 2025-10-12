/**
 * Recent Activity Card Component
 * Reusable activity feed following shadcn standards
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ActivityItem {
  id: string
  title: string
  subtitle: string
  badge?: string
  timestamp: string
  avatarText?: string
  onClick?: () => void
}

interface RecentActivityCardProps {
  title: string
  description?: string
  items: ActivityItem[]
  maxItems?: number
  onViewAll?: () => void
  viewAllText?: string
  className?: string
}

export function RecentActivityCard({ 
  title, 
  description,
  items,
  maxItems = 5,
  onViewAll,
  viewAllText = "View All Activity",
  className 
}: RecentActivityCardProps) {
  const displayItems = items.slice(0, maxItems)

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg transition-all duration-200",
                "hover:bg-muted/50",
                item.onClick && "cursor-pointer hover:translate-x-1"
              )}
              onClick={item.onClick}
            >
              {item.avatarText && (
                <Avatar className="h-9 w-9 flex-shrink-0">
                  <AvatarFallback className="text-xs">
                    {item.avatarText}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  {item.badge && (
                    <Badge variant="outline" className="text-xs shrink-0">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {item.subtitle}
                </p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {item.timestamp}
              </span>
            </div>
          ))}
        </div>
        
        {onViewAll && (
          <Button 
            variant="ghost" 
            className="w-full mt-4"
            onClick={onViewAll}
          >
            {viewAllText}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

