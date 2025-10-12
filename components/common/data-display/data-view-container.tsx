"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface DataViewContainerProps {
  viewMode: "list" | "card"
  children: ReactNode
  className?: string
  cardGridCols?: {
    sm?: string
    md?: string
    lg?: string
    xl?: string
  }
  listSpacing?: string
}

export function DataViewContainer({
  viewMode,
  children,
  className,
  cardGridCols = {
    sm: "grid-cols-1",
    md: "md:grid-cols-2",
    lg: "lg:grid-cols-2",
    xl: "xl:grid-cols-3"
  },
  listSpacing = "space-y-3"
}: DataViewContainerProps) {
  if (viewMode === "list") {
    return (
      <div className={cn(
        listSpacing,
        "animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
        className
      )}>
        {children}
      </div>
    )
  }

  return (
    <div className={cn(
      "grid gap-3",
      cardGridCols.sm,
      cardGridCols.md,
      cardGridCols.lg,
      cardGridCols.xl,
      "animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
      className
    )}>
      {children}
    </div>
  )
}

