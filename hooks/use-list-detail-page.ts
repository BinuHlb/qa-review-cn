/**
 * Unified hook for list-detail page pattern
 * Handles search, filters, selection, and view mode state
 */

import { useState, useMemo, useCallback, useEffect } from "react"
import { useDataFilters } from "./use-data-filters"
import { useSelection } from "./use-selection"
import type { FilterConfig } from "@/components/common/data-display/data-filter-bar"

export interface UseListDetailPageConfig<T> {
  /** Initial data */
  data: T[]
  /** Fields to search in */
  searchFields: (keyof T)[]
  /** Filter configurations */
  filterConfigs?: FilterConfig[]
  /** Initial view mode */
  initialViewMode?: "list" | "card"
  /** Function to get unique ID from item */
  getItemId: (item: T) => string
}

export interface UseListDetailPageReturn<T> {
  // Data
  filteredData: T[]
  allData: T[]
  
  // Search
  searchTerm: string
  setSearchTerm: (term: string) => void
  
  // Filters
  filters: Record<string, string>
  setFilter: (key: string, value: string) => void
  clearFilters: () => void
  hasActiveFilters: boolean
  filterConfigs?: FilterConfig[]
  
  // Selection
  selectedItem: T | null
  selectItem: (item: T) => void
  clearSelection: () => void
  toggleSelection: (item: T) => void
  
  // View mode
  viewMode: "list" | "card"
  setViewMode: (mode: "list" | "card") => void
  
  // Counts
  totalCount: number
  filteredCount: number
}

export function useListDetailPage<T extends Record<string, any>>({
  data,
  searchFields,
  filterConfigs,
  initialViewMode = "list",
  getItemId
}: UseListDetailPageConfig<T>): UseListDetailPageReturn<T> {
  const [viewMode, setViewMode] = useState<"list" | "card">(initialViewMode)
  
  // Use data filters hook
  const {
    filteredData,
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    clearFilters: resetFilters,
    hasActiveFilters
  } = useDataFilters<T>(data, { searchFields })
  
  // Use selection hook
  const {
    selected,
    select,
    clear: clearSelection
  } = useSelection<T>(getItemId, { toggleOnReselect: true })
  
  // Extract single item from selection state
  const selectedItem: T | null = selected && !Array.isArray(selected) ? selected : null
  
  // Helper to select/toggle item
  const selectItem = useCallback((item: T) => {
    select(item)
  }, [select])
  
  const toggleSelection = useCallback((item: T) => {
    if (selectedItem && getItemId(selectedItem) === getItemId(item)) {
      clearSelection()
    } else {
      selectItem(item)
    }
  }, [selectedItem, selectItem, clearSelection, getItemId])
  
  // Clear selection if filtered data changes and selected item is no longer in the list
  useEffect(() => {
    if (filteredData.length === 0) {
      clearSelection()
    } else if (selectedItem && !filteredData.find(item => getItemId(item) === getItemId(selectedItem))) {
      clearSelection()
    }
  }, [filteredData, selectedItem, clearSelection, getItemId])
  
  // Unified clear filters function
  const clearAllFilters = useCallback(() => {
    setSearchTerm("")
    resetFilters()
  }, [setSearchTerm, resetFilters])
  
  return {
    // Data
    filteredData,
    allData: data,
    
    // Search
    searchTerm,
    setSearchTerm,
    
    // Filters
    filters,
    setFilter,
    clearFilters: clearAllFilters,
    hasActiveFilters: Boolean(searchTerm || hasActiveFilters),
    filterConfigs,
    
    // Selection
    selectedItem,
    selectItem,
    clearSelection,
    toggleSelection,
    
    // View mode
    viewMode,
    setViewMode,
    
    // Counts
    totalCount: data.length,
    filteredCount: filteredData.length
  }
}

