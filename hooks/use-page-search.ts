import { useState, useMemo } from "react"

export interface PageSearchConfig {
  searchPlaceholder?: string
  searchFields?: string[]
}

export interface UsePageSearchReturn {
  searchTerm: string
  setSearchTerm: (value: string) => void
  searchConfig: {
    searchTerm: string
    searchPlaceholder: string
    onSearchChange: (value: string) => void
  }
  filterBySearch: <T>(data: T[], fields?: string[]) => T[]
}

/**
 * Custom hook for managing page-level search functionality
 * 
 * Provides:
 * - Search state management
 * - Ready-to-use search config for DashboardHeader
 * - Generic search filtering function
 * 
 * @example
 * ```tsx
 * const { searchConfig, filterBySearch } = usePageSearch({
 *   searchPlaceholder: "Search reviews...",
 *   searchFields: ['memberFirm', 'reviewer', 'country']
 * })
 * 
 * // Pass to header
 * <DashboardHeader search={searchConfig} />
 * 
 * // Use in filtering
 * const filtered = filterBySearch(reviews)
 * ```
 */
export function usePageSearch(config: PageSearchConfig = {}): UsePageSearchReturn {
  const {
    searchPlaceholder = "Search...",
    searchFields = []
  } = config

  const [searchTerm, setSearchTerm] = useState("")

  // Search configuration for DashboardHeader
  const searchConfig = useMemo(() => ({
    searchTerm,
    searchPlaceholder,
    onSearchChange: setSearchTerm
  }), [searchTerm, searchPlaceholder])

  // Generic search filter function
  const filterBySearch = <T,>(data: T[], fields: string[] = searchFields): T[] => {
    if (!searchTerm || !fields.length) return data

    const searchLower = searchTerm.toLowerCase()
    
    return data.filter(item => {
      return fields.some(field => {
        const value = (item as any)[field]
        if (value == null) return false
        return String(value).toLowerCase().includes(searchLower)
      })
    })
  }

  return {
    searchTerm,
    setSearchTerm,
    searchConfig,
    filterBySearch
  }
}

