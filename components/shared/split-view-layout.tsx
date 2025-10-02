"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SplitViewLayoutProps {
  leftContent: ReactNode
  rightContent: ReactNode
  leftClassName?: string
  rightClassName?: string
  className?: string
  leftColumnSpan?: number
  rightColumnSpan?: number
}

export function SplitViewLayout({
  leftContent,
  rightContent,
  leftClassName = "",
  rightClassName = "",
  className = "",
  leftColumnSpan = 2,
  rightColumnSpan = 1
}: SplitViewLayoutProps) {
  return (
    <div className={cn("grid gap-6 h-full grid-cols-1 lg:grid-cols-3", className)}>
      {/* Left Side */}
      <div className={cn(
        "flex flex-col h-full overflow-hidden",
        `lg:col-span-${leftColumnSpan}`,
        leftClassName
      )}>
        {leftContent}
      </div>

      {/* Right Side */}
      <div className={cn(
        "overflow-hidden pl-2 border-l h-full",
        `lg:col-span-${rightColumnSpan}`,
        rightClassName
      )}>
        {rightContent}
      </div>
    </div>
  )
}
