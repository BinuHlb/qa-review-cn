import { useState, useMemo, useCallback } from "react"
import type { FilterConfig } from "@/components/shared/data-filter-bar"

export interface UsePageFiltersConfig {
  filters: FilterConfig[]
  onFilterChange?: (filters: Record<string, string>) => void
}

export interface UsePageFiltersReturn {
  filterValues: Record<string, string>
  setFilter: (key: string, value: string) => void
  clearFilters: () => void
  hasActiveFilters: boolean
  handleFilterChange: (key: string, value: string) => void
  filterBarProps: {
    filters: FilterConfig[]
    filterValues: Record<string, string>
    onFilterChange: (key: string, value: string) => void
    hasActiveFilters: boolean
    onClearFilters: () => void
  }
  filterData: <T>(data: T[]) => T[]
}

/**
 * Custom hook for managing page-level filters
 * 
 * Provides:
 * - Filter state management
 * - Ready-to-use props for DataFilterBar
 * - Generic data filtering function
 * 
 * @example
 * ```tsx
 * const { filterBarProps, filterData } = usePageFilters({
 *   filters: [
 *     {
 *       key: "status",
 *       placeholder: "Status",
 *       options: [...]
 *     }
 *   ]
 * })
 * 
 * // Pass to DataFilterBar
 * <DataFilterBar {...filterBarProps} />
 * 
 * // Use in filtering
 * const filtered = filterData(reviews)
 * ```
 */
export function usePageFilters(config: UsePageFiltersConfig): UsePageFiltersReturn {
  const { filters, onFilterChange: onFilterChangeCallback } = config

  // Initialize all filters to "all"
  const initialFilters = useMemo(() => {
    return filters.reduce((acc, filter) => {
      acc[filter.key] = "all"
      return acc
    }, {} as Record<string, string>)
  }, [filters])

  const [filterValues, setFilterValues] = useState<Record<string, string>>(initialFilters)

  // Set a single filter
  const setFilter = useCallback((key: string, value: string) => {
    setFilterValues(prev => {
      const newFilters = { ...prev, [key]: value }
      onFilterChangeCallback?.(newFilters)
      return newFilters
    })
  }, [onFilterChangeCallback])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilterValues(initialFilters)
    onFilterChangeCallback?.(initialFilters)
  }, [initialFilters, onFilterChangeCallback])

  // Check if any filters are active (not "all")
  const hasActiveFilters = useMemo(() => {
    return Object.values(filterValues).some(value => value !== "all")
  }, [filterValues])

  // Handler for DataFilterBar
  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilter(key, value)
  }, [setFilter])

  // Props for DataFilterBar
  const filterBarProps = useMemo(() => ({
    filters,
    filterValues,
    onFilterChange: handleFilterChange,
    hasActiveFilters,
    onClearFilters: clearFilters
  }), [filters, filterValues, handleFilterChange, hasActiveFilters, clearFilters])

  // Generic data filtering function
  const filterData = useCallback(<T,>(data: T[]): T[] => {
    return data.filter(item => {
      return Object.entries(filterValues).every(([key, value]) => {
        if (value === "all") return true
        return (item as any)[key] === value
      })
    })
  }, [filterValues])

  return {
    filterValues,
    setFilter,
    clearFilters,
    hasActiveFilters,
    handleFilterChange,
    filterBarProps,
    filterData
  }
}

