/**
 * Generic Data Filtering Hook
 * Reusable across reviews, firms, reviewers, etc.
 */

import { useState, useMemo, useCallback } from 'react'

export interface FilterConfig<T> {
  searchFields?: (keyof T)[]
  filters?: {
    key: keyof T
    value: any
  }[]
}

export interface UseDataFiltersReturn<T> {
  filteredData: T[]
  searchTerm: string
  setSearchTerm: (term: string) => void
  filters: Record<string, any>
  setFilter: (key: string, value: any) => void
  clearFilters: () => void
  hasActiveFilters: boolean
  resultCount: number
}

export function useDataFilters<T extends Record<string, any>>(
  data: T[],
  config: FilterConfig<T> = {}
): UseDataFiltersReturn<T> {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<Record<string, any>>({})

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    let result = data

    // Search filter
    if (searchTerm && config.searchFields && config.searchFields.length > 0) {
      const searchLower = searchTerm.toLowerCase()
      result = result.filter(item =>
        config.searchFields!.some(field => {
          const value = item[field]
          return value && String(value).toLowerCase().includes(searchLower)
        })
      )
    }

    // Apply custom filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter(item => item[key] === value)
      }
    })

    return result
  }, [data, searchTerm, filters, config.searchFields])

  // Set individual filter
  const setFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchTerm('')
    setFilters({})
  }, [])

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return Boolean(
      searchTerm ||
      Object.values(filters).some(value => value && value !== 'all')
    )
  }, [searchTerm, filters])

  return {
    filteredData,
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    clearFilters,
    hasActiveFilters,
    resultCount: filteredData.length
  }
}

// ============================================================================
// SPECIALIZED HOOKS
// ============================================================================

/**
 * Specialized hook for review filtering
 */
export function useReviewFilters(reviews: any[]) {
  return useDataFilters(reviews, {
    searchFields: ['memberFirm', 'reviewer', 'type', 'country']
  })
}

/**
 * Get unique values for filter dropdowns
 */
export function useUniqueValues<T>(data: T[], key: keyof T): any[] {
  return useMemo(() => {
    const values = data.map(item => item[key]).filter(Boolean)
    return Array.from(new Set(values)).sort()
  }, [data, key])
}

