import { useState, useMemo, useCallback } from "react"
import { usePageSearch, type PageSearchConfig } from "./use-page-search"
import { usePageFilters, type UsePageFiltersConfig } from "./use-page-filters"

export interface UsePageStateConfig<T> extends PageSearchConfig, UsePageFiltersConfig {
  data: T[]
  viewMode?: "list" | "card"
  onDataChange?: (data: T[]) => void
}

export interface UsePageStateReturn<T> {
  // View mode
  viewMode: "list" | "card"
  setViewMode: (mode: "list" | "card") => void
  
  // Search
  searchConfig: {
    searchTerm: string
    searchPlaceholder: string
    onSearchChange: (value: string) => void
  }
  
  // Filters
  filterBarProps: {
    showSearch: false
    filters: any[]
    filterValues: Record<string, string>
    onFilterChange: (key: string, value: string) => void
    hasActiveFilters: boolean
    onClearFilters: () => void
    showViewToggle: true
    viewMode: "list" | "card"
    onViewModeChange: (mode: "list" | "card") => void
  }
  
  // Data
  filteredData: T[]
  counts: {
    filtered: number
    total: number
  }
  
  // Selection
  selectedItem: T | null
  setSelectedItem: (item: T | null) => void
  
  // Combined props for easy spreading
  headerProps: {
    search: {
      searchTerm: string
      searchPlaceholder: string
      onSearchChange: (value: string) => void
    }
  }
  
  filterBarPropsWithCounts: {
    showSearch: false
    filters: any[]
    filterValues: Record<string, string>
    onFilterChange: (key: string, value: string) => void
    hasActiveFilters: boolean
    onClearFilters: () => void
    showViewToggle: true
    viewMode: "list" | "card"
    onViewModeChange: (mode: "list" | "card") => void
    resultCount: number
    totalCount: number
  }
}

/**
 * Unified page state management hook
 * 
 * Combines search, filters, view mode, and data management into one hook.
 * This provides a consistent, scalable pattern for all list pages.
 * 
 * @example
 * ```tsx
 * const { headerProps, filterBarPropsWithCounts, filteredData, selectedItem, setSelectedItem } = usePageState({
 *   data: reviews,
 *   searchPlaceholder: "Search reviews...",
 *   searchFields: ['memberFirm', 'reviewer', 'country'],
 *   filters: [
 *     { key: "status", placeholder: "Status", options: [...] }
 *   ]
 * })
 * 
 * return (
 *   <DashboardLayout {...headerProps}>
 *     <DataFilterBar {...filterBarPropsWithCounts} />
 *     <YourListComponent data={filteredData} />
 *   </DashboardLayout>
 * )
 * ```
 */
export function usePageState<T>(config: UsePageStateConfig<T>): UsePageStateReturn<T> {
  const {
    data,
    viewMode: initialViewMode = "list",
    onDataChange,
    ...restConfig
  } = config

  // View mode state
  const [viewMode, setViewMode] = useState<"list" | "card">(initialViewMode)
  
  // Selected item state
  const [selectedItem, setSelectedItem] = useState<T | null>(null)

  // Search hook
  const { searchConfig, filterBySearch } = usePageSearch({
    searchPlaceholder: restConfig.searchPlaceholder,
    searchFields: restConfig.searchFields
  })

  // Filters hook
  const { filterBarProps, filterData } = usePageFilters({
    filters: restConfig.filters,
    onFilterChange: restConfig.onFilterChange
  })

  // Apply search and filters to data
  const filteredData = useMemo(() => {
    let result = data
    
    // Apply search filter
    if (searchConfig.searchTerm) {
      result = filterBySearch(result)
    }
    
    // Apply other filters
    result = filterData(result)
    
    return result
  }, [data, searchConfig.searchTerm, filterBySearch, filterData])

  // Counts
  const counts = useMemo(() => ({
    filtered: filteredData.length,
    total: data.length
  }), [filteredData.length, data.length])

  // Handle view mode change
  const handleViewModeChange = useCallback((mode: "list" | "card") => {
    setViewMode(mode)
  }, [])

  // Combined header props
  const headerProps = useMemo(() => ({
    search: searchConfig
  }), [searchConfig])

  // Combined filter bar props with view toggle and counts
  const filterBarPropsWithCounts = useMemo(() => ({
    ...filterBarProps,
    showSearch: false as const,
    showViewToggle: true as const,
    viewMode,
    onViewModeChange: handleViewModeChange,
    resultCount: counts.filtered,
    totalCount: counts.total
  }), [filterBarProps, viewMode, handleViewModeChange, counts])

  return {
    viewMode,
    setViewMode,
    searchConfig,
    filterBarProps: {
      ...filterBarProps,
      showSearch: false as const,
      showViewToggle: true as const,
      viewMode,
      onViewModeChange: handleViewModeChange
    },
    filteredData,
    counts,
    selectedItem,
    setSelectedItem,
    headerProps,
    filterBarPropsWithCounts
  }
}

