"use client"

import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  size?: "sm" | "md" | "lg" | "xl"
}

export function Drawer({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  children, 
  footer,
  size = "md" 
}: DrawerProps) {
  const sizeClasses = {
    sm: "w-[400px]",
    md: "w-[500px]",
    lg: "w-[600px]",
    xl: "w-[800px]"
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={`${sizeClasses[size]} p-0`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-lg font-semibold">{title}</SheetTitle>
                {description && (
                  <SheetDescription className="text-sm text-muted-foreground mt-1">
                    {description}
                  </SheetDescription>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t bg-muted/50">
              {footer}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
