"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, RotateCcw, List, Grid3X3 } from "lucide-react"
import { LucideIcon } from "lucide-react"

export interface FilterConfig {
  key: string
  placeholder: string
  icon?: LucideIcon
  width?: string
  options: Array<{
    value: string
    label: string
  }>
}

interface DataFilterBarProps {
  // Search
  searchTerm: string
  searchPlaceholder?: string
  onSearchChange: (value: string) => void
  
  // Filters
  filters: FilterConfig[]
  filterValues: Record<string, string>
  onFilterChange: (key: string, value: string) => void
  
  // View mode (optional)
  showViewToggle?: boolean
  viewMode?: "list" | "card"
  onViewModeChange?: (mode: "list" | "card") => void
  
  // Actions
  hasActiveFilters: boolean
  onClearFilters: () => void
  
  // Result count (optional)
  resultCount?: number
  totalCount?: number
}

export function DataFilterBar({
  searchTerm,
  searchPlaceholder = "Search...",
  onSearchChange,
  filters,
  filterValues,
  onFilterChange,
  showViewToggle = false,
  viewMode = "list",
  onViewModeChange,
  hasActiveFilters,
  onClearFilters,
  resultCount,
  totalCount,
}: DataFilterBarProps) {
  return (
    <div className="space-y-4">
      {/* Top row with search and view toggle */}
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9 bg-muted/50"
            />
          </div>
        </div>

        {/* Result count */}
        {resultCount !== undefined && totalCount !== undefined && (
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            {resultCount} of {totalCount}
          </div>
        )}

        {/* View toggle */}
        {showViewToggle && onViewModeChange && (
          <div className="flex items-center gap-1 p-1 bg-muted rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange("list")}
              className={`h-8 px-3 ${viewMode === "list" ? "bg-background shadow-sm" : ""}`}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewModeChange("card")}
              className={`h-8 px-3 ${viewMode === "card" ? "bg-background shadow-sm" : ""}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Clear filters button */}
        {hasActiveFilters && (
          <Button onClick={onClearFilters} variant="outline" size="sm" className="whitespace-nowrap">
            <RotateCcw className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Filter selects */}
      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            const selectedValue = filterValues[filter.key] || "all"
            const selectedOption = filter.options.find(opt => opt.value === selectedValue)
            const displayLabel = selectedOption?.label || filter.placeholder
            
            return (
              <Select
                key={filter.key}
                value={selectedValue}
                onValueChange={(value) => onFilterChange(filter.key, value)}
              >
                <SelectTrigger className={`${filter.width || "w-auto min-w-[140px] max-w-[200px]"} h-9 bg-muted/50`}>
                  <div className="flex items-center gap-2 flex-1 overflow-hidden">
                    {filter.icon && <filter.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                    <span className="truncate text-sm whitespace-nowrap">{displayLabel}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          })}
        </div>
      )}
    </div>
  )
}

