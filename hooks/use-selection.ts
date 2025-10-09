/**
 * Generic Selection Hook
 * Handles single or multi-select functionality
 */

import { useState, useCallback, useMemo } from 'react'

export interface UseSelectionOptions {
  multiSelect?: boolean
  toggleOnReselect?: boolean
}

export interface UseSelectionReturn<T> {
  selected: T | T[] | null
  isSelected: (item: T) => boolean
  select: (item: T) => void
  deselect: (item?: T) => void
  toggle: (item: T) => void
  clear: () => void
  selectedCount: number
}

/**
 * Generic hook for managing item selection
 * @param getId - Function to extract unique ID from item
 * @param options - Configuration options
 */
export function useSelection<T>(
  getId: (item: T) => string,
  options: UseSelectionOptions = {}
): UseSelectionReturn<T> {
  const { multiSelect = false, toggleOnReselect = true } = options
  
  const [selected, setSelected] = useState<T | T[] | null>(
    multiSelect ? [] : null
  )

  // Check if item is selected
  const isSelected = useCallback((item: T): boolean => {
    if (!selected) return false
    
    if (multiSelect && Array.isArray(selected)) {
      return selected.some(s => getId(s) === getId(item))
    }
    
    return getId(selected as T) === getId(item)
  }, [selected, getId, multiSelect])

  // Select an item
  const select = useCallback((item: T) => {
    if (multiSelect) {
      setSelected(prev => {
        const arr = Array.isArray(prev) ? prev : []
        // Don't add if already selected
        if (arr.some(s => getId(s) === getId(item))) {
          return arr
        }
        return [...arr, item]
      })
    } else {
      setSelected(item)
    }
  }, [getId, multiSelect])

  // Deselect an item (or clear all)
  const deselect = useCallback((item?: T) => {
    if (!item) {
      setSelected(multiSelect ? [] : null)
      return
    }

    if (multiSelect && Array.isArray(selected)) {
      setSelected(selected.filter(s => getId(s) !== getId(item)))
    } else {
      setSelected(null)
    }
  }, [selected, getId, multiSelect])

  // Toggle selection
  const toggle = useCallback((item: T) => {
    if (isSelected(item)) {
      if (toggleOnReselect) {
        deselect(item)
      }
    } else {
      select(item)
    }
  }, [isSelected, select, deselect, toggleOnReselect])

  // Clear all selections
  const clear = useCallback(() => {
    setSelected(multiSelect ? [] : null)
  }, [multiSelect])

  // Get selection count
  const selectedCount = useMemo(() => {
    if (!selected) return 0
    if (Array.isArray(selected)) return selected.length
    return 1
  }, [selected])

  return {
    selected,
    isSelected,
    select,
    deselect,
    toggle,
    clear,
    selectedCount
  }
}

// ============================================================================
// SPECIALIZED SELECTION HOOKS
// ============================================================================

/**
 * Hook for selecting reviews
 */
export function useReviewSelection(options?: UseSelectionOptions) {
  return useSelection<{ id: string }>(
    (review) => review.id,
    options
  )
}

/**
 * Hook for selecting reviewers
 */
export function useReviewerSelection(options?: UseSelectionOptions) {
  return useSelection<{ id: string }>(
    (reviewer) => reviewer.id,
    options
  )
}

