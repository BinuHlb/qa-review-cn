import { Button } from "@/components/ui/button"
import { ReactNode } from "react"

interface DrawerFooterAction {
  label: string
  onClick: () => void
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link"
  disabled?: boolean
  loading?: boolean
  icon?: ReactNode
  className?: string
}

interface DrawerFooterProps {
  actions: DrawerFooterAction[]
  className?: string
}

export function DrawerFooter({ actions, className = "" }: DrawerFooterProps) {
  return (
    <div className={`px-6 py-4 border-t bg-muted/30 ${className}`}>
      <div className="flex gap-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            type="button"
            variant={action.variant || "default"}
            onClick={action.onClick}
            className={`flex-1 ${action.className || ""}`}
            disabled={action.disabled || action.loading}
          >
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.loading ? "Processing..." : action.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

