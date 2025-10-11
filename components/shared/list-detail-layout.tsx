"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ListDetailLayoutProps {
  /** Content for the main list area (left side) */
  listContent: ReactNode
  /** Content for the detail panel (right side) */
  detailContent: ReactNode
  /** Optional class name for the container */
  className?: string
  /** Width of the detail panel (default: w-96 = 384px) */
  detailPanelWidth?: "w-80" | "w-96" | "w-[400px]" | "w-[480px]"
  /** Whether detail panel should have overflow-y-auto (default: true) */
  detailScrollable?: boolean
}

/**
 * Reusable two-column layout for list + detail views
 * Used across admin pages: reviews, member-firms, reviewers, etc.
 * 
 * Standard pattern:
 * - Left: Filterable list with search/filters
 * - Right: Detail panel showing selected item
 * 
 * @example
 * <ListDetailLayout
 *   listContent={<ReviewView ... />}
 *   detailContent={<ReviewActionPanel ... />}
 * />
 */
export function ListDetailLayout({
  listContent,
  detailContent,
  className,
  detailPanelWidth = "w-96",
  detailScrollable = true
}: ListDetailLayoutProps) {
  return (
    <div className={cn("flex h-[calc(100vh-85px)]", className)}>
      {/* Left Side - Main List Content */}
      <div className="flex-1 flex flex-col overflow-hidden p-6">
        {listContent}
      </div>

      {/* Right Side - Detail Panel */}
      <div 
        className={cn(
          detailPanelWidth,
          "border-l dark:border-neutral-700 bg-background flex-shrink-0",
          detailScrollable ? "overflow-y-auto" : "overflow-hidden"
        )}
      >
        {detailContent}
      </div>
    </div>
  )
}

