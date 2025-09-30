"use client"

import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import { ViewToggle } from "./view-toggle"

interface FilterSectionProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  onFilter: () => void
  onClearFilters: () => void
  hasActiveFilters: boolean
  resultsCount?: number
  viewMode: "list" | "card"
  onViewModeChange: (mode: "list" | "card") => void
  children: ReactNode
  searchPlaceholder?: string
  compact?: boolean
}

export function FilterSection({
  searchTerm,
  onSearchChange,
  onFilter,
  onClearFilters,
  hasActiveFilters,
  resultsCount,
  viewMode,
  onViewModeChange,
  children,
  searchPlaceholder = "Search...",
  compact = false
}: FilterSectionProps) {
  if (compact) {
    return (
      <div className="sticky top-0 z-10 bg-background py-2 border-b">
        <div className="flex flex-col gap-2">
          {/* Search, Dropdowns, and Controls Row */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {/* Search Field - Reduced Width */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-7 h-8 text-sm"
              />
            </div>

            {/* Filter Dropdowns */}
            {children && (
              <div className="flex gap-2 flex-1 min-w-0">
                {children}
              </div>
            )}

            {/* View Toggle and Action Buttons */}
            <div className="flex gap-2 items-center">
              <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
              <Button onClick={onFilter} size="sm" className="h-8 px-3 text-xs">
                <Filter className="h-3 w-3 mr-1" />
                Filter
              </Button>
              {hasActiveFilters && (
                <Button onClick={onClearFilters} variant="outline" size="sm" className="h-8 px-2">
                  <X className="h-3 w-3" />
                </Button>
              )}
              {hasActiveFilters && resultsCount !== undefined && (
                <Badge variant="secondary" className="text-xs h-6 px-2">
                  {resultsCount}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 sticky top-0 z-10 bg-background py-3 border-b">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <div className="flex gap-2">
          <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
          
          <Button onClick={onFilter} size="sm" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            Apply
          </Button>
          {hasActiveFilters && (
            <Button onClick={onClearFilters} variant="outline" size="sm" className="h-9">
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          {children}
        </div>
        {hasActiveFilters && resultsCount !== undefined && (
          <Badge variant="secondary" className="text-xs">
            {resultsCount} results
          </Badge>
        )}
      </div>
    </div>
  )
}
