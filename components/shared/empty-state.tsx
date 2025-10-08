"use client"

import { LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface EmptyStateProps {
  icon: LucideIcon
  iconColor?: string
  iconBgColor?: string
  title: string
  description: string
  steps?: Array<{
    number: string
    title: string
    description: string
  }>
  badge?: {
    text: string
    variant?: "default" | "secondary" | "destructive" | "outline"
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
  title,
  description,
  steps = [],
  badge,
  className = ""
}: EmptyStateProps) {
  return (
    <div className={`h-full flex items-center justify-center ${className}`}>
      <div className="text-center space-y-4 px-6 max-w-md">
        <div className={`mx-auto w-20 h-20 ${iconBgColor} rounded-full flex items-center justify-center`}>
          <Icon className={`h-10 w-10 ${iconColor}`} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        
        {steps.length > 0 && (
          <div className="space-y-3 text-left">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-green-600">{step.number}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{step.title}</p>
                  <p className="text-xs text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {badge && (
          <div className="pt-4">
            <Badge variant={badge.variant || "outline"} className="text-xs">
              {badge.text}
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}
