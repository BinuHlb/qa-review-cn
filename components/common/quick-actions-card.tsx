/**
 * Quick Actions Card Component
 * Reusable quick actions list following shadcn standards
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface QuickAction {
  title: string
  description: string
  icon: LucideIcon
  onClick: () => void
  variant?: "default" | "primary" | "success" | "warning" | "destructive"
}

interface QuickActionsCardProps {
  title: string
  description?: string
  actions: QuickAction[]
  className?: string
}

const iconVariantStyles = {
  default: "text-primary bg-primary/10",
  primary: "text-primary bg-primary/10",
  success: "text-green-600 dark:text-green-400 bg-green-500/10",
  warning: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
  destructive: "text-destructive bg-destructive/10"
}

export function QuickActionsCard({ 
  title, 
  description, 
  actions,
  className 
}: QuickActionsCardProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="grid gap-3">
        {actions.map((action, index) => (
          <Button 
            key={index}
            variant="outline" 
            className="group justify-start h-auto py-4 hover:bg-accent transition-all duration-200"
            onClick={action.onClick}
          >
            <div className={cn(
              "p-2 rounded-lg transition-colors duration-200 flex-shrink-0",
              iconVariantStyles[action.variant || "default"]
            )}>
              <action.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 text-left ml-3 min-w-0">
              <div className="font-medium text-sm">{action.title}</div>
              <div className="text-xs text-muted-foreground truncate">{action.description}</div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform duration-200 flex-shrink-0" />
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}

