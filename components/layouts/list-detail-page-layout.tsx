/**
 * Unified List-Detail Page Layout
 * Reusable template for all list-detail pages (reviews, member firms, reviewers, etc.)
 */

import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ListDetailLayout } from "./list-detail-layout"
import { DataFilterBar, type FilterConfig } from "@/components/common/data-display"
import { EmptyState } from "@/components/common"
import type { LucideIcon } from "lucide-react"

export interface EmptyStateConfig {
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
}

export interface ListDetailPageLayoutProps {
  // Search configuration
  searchTerm: string
  searchPlaceholder: string
  onSearchChange: (term: string) => void
  
  // Filter configuration
  filters: FilterConfig[]
  filterValues: Record<string, string>
  onFilterChange: (key: string, value: string) => void
  hasActiveFilters: boolean
  onClearFilters: () => void
  
  // View mode
  showViewToggle?: boolean
  viewMode?: "list" | "card"
  onViewModeChange?: (mode: "list" | "card") => void
  
  // Counts
  resultCount: number
  totalCount: number
  
  // List content (the actual list of items)
  listContent: React.ReactNode
  
  // Detail content (the detail panel or action panel)
  detailContent: React.ReactNode
  
  // Empty state when no item is selected
  emptyStateConfig: EmptyStateConfig
  
  // Whether detail panel should handle its own scrolling
  detailScrollable?: boolean
  
  // Optional: Custom header actions
  headerActions?: React.ReactNode
  
  // Optional: Show sidebar
  showSidebar?: boolean
}

export function ListDetailPageLayout({
  searchTerm,
  searchPlaceholder,
  onSearchChange,
  filters,
  filterValues,
  onFilterChange,
  hasActiveFilters,
  onClearFilters,
  showViewToggle = true,
  viewMode = "list",
  onViewModeChange,
  resultCount,
  totalCount,
  listContent,
  detailContent,
  emptyStateConfig,
  detailScrollable = false,
  headerActions,
  showSidebar = true
}: ListDetailPageLayoutProps) {
  const content = (
    <>
      <DashboardHeader 
        search={{
          searchTerm,
          searchPlaceholder,
          onSearchChange
        }}
      />
      {headerActions && (
        <div className="px-6 py-2 border-b">
          {headerActions}
        </div>
      )}
      <ListDetailLayout
        listContent={
          <>
            {/* Header with Filters */}
            <div className="flex-shrink-0 mb-6">
              <DataFilterBar
                showSearch={false}
                filters={filters}
                filterValues={filterValues}
                onFilterChange={onFilterChange}
                showViewToggle={showViewToggle}
                viewMode={viewMode}
                onViewModeChange={onViewModeChange}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={onClearFilters}
                resultCount={resultCount}
                totalCount={totalCount}
              />
            </div>

            {/* List Content */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              {listContent}
            </div>
          </>
        }
        detailContent={
          detailContent || (
            <div className="h-full flex items-center justify-center p-6">
              <EmptyState {...emptyStateConfig} />
            </div>
          )
        }
        detailScrollable={detailScrollable}
      />
    </>
  )

  if (!showSidebar) {
    return content
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {content}
      </SidebarInset>
    </SidebarProvider>
  )
}

