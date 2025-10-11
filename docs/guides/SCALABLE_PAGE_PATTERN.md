# Scalable Page Pattern - Complete Guide

## Overview

This guide demonstrates the fully refactored, dynamic, and scalable pattern for creating list/detail pages with search and filters. **No hardcoding, complete consistency, maximum reusability.**

## Architecture

### Custom Hooks (New!)

1. **`usePageSearch`** - Manages search functionality
2. **`usePageFilters`** - Manages filter state and logic
3. **`usePageState`** - **Unified hook** combining everything

### Components

1. **`DashboardHeader`** - Accepts dynamic search config
2. **`DataFilterBar`** - Accepts dynamic filter config
3. **`DashboardLayout`** - Universal layout wrapper

## The Unified Pattern (Recommended)

Use `usePageState` for the cleanest, most scalable approach:

```tsx
"use client"

import { useMemo } from "react"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { DataFilterBar } from "@/components/shared/data-filter-bar"
import { usePageState } from "@/hooks/use-page-state"
import type { YourDataType } from "@/types/entities"

export default function YourPage() {
  // 1. Define your data source
  const [data, setData] = useState<YourDataType[]>([])

  // 2. Define filter configuration (dynamic, no hardcoding)
  const filterConfigs = useMemo(() => [
    {
      key: "status",
      placeholder: "Status",
      icon: CheckCircle,
      options: [
        { value: "all", label: "All Statuses" },
        { value: "active", label: "Active" },
        { value: "pending", label: "Pending" }
      ]
    },
    {
      key: "type",
      placeholder: "Type",
      icon: Tag,
      options: [
        { value: "all", label: "All Types" },
        { value: "standard", label: "Standard" },
        { value: "premium", label: "Premium" }
      ]
    }
  ], [])

  // 3. Use the unified page state hook
  const {
    headerProps,
    filterBarPropsWithCounts,
    filteredData,
    selectedItem,
    setSelectedItem
  } = usePageState({
    data,
    searchPlaceholder: "Search items...",
    searchFields: ['name', 'description', 'category'],
    filters: filterConfigs,
    viewMode: "list"
  })

  // 4. Render with zero hardcoding!
  return (
    <DashboardLayout {...headerProps}>
      <div className="space-y-4">
        {/* Filter bar with all functionality */}
        <DataFilterBar {...filterBarPropsWithCounts} />

        {/* Your content */}
        <YourListComponent
          data={filteredData}
          selected={selectedItem}
          onSelect={setSelectedItem}
        />
      </div>
    </DashboardLayout>
  )
}
```

## Granular Control (Advanced)

If you need more control, use hooks individually:

### Pattern 1: Search Only

```tsx
import { usePageSearch } from "@/hooks/use-page-search"

const { searchConfig, filterBySearch } = usePageSearch({
  searchPlaceholder: "Search...",
  searchFields: ['name', 'email']
})

// Use in header
<DashboardHeader search={searchConfig} />

// Filter data
const filtered = filterBySearch(data)
```

### Pattern 2: Filters Only

```tsx
import { usePageFilters } from "@/hooks/use-page-filters"

const { filterBarProps, filterData } = usePageFilters({
  filters: [
    { key: "status", placeholder: "Status", options: [...] }
  ]
})

// Use in filter bar
<DataFilterBar {...filterBarProps} />

// Filter data
const filtered = filterData(data)
```

### Pattern 3: Combined (Full Control)

```tsx
import { usePageSearch } from "@/hooks/use-page-search"
import { usePageFilters } from "@/hooks/use-page-filters"

const search = usePageSearch({ ... })
const filters = usePageFilters({ ... })

// Combine filtering
const filteredData = useMemo(() => {
  let result = data
  result = search.filterBySearch(result)
  result = filters.filterData(result)
  return result
}, [data, search, filters])

// Pass to components
<DashboardHeader search={search.searchConfig} />
<DataFilterBar {...filters.filterBarProps} />
```

## Dynamic Filter Generation

Generate filters dynamically from data:

```tsx
const filterConfigs = useMemo(() => {
  // Extract unique values from data
  const uniqueStatuses = Array.from(new Set(data.map(d => d.status)))
  const uniqueTypes = Array.from(new Set(data.map(d => d.type)))

  return [
    {
      key: "status",
      placeholder: "Status",
      options: [
        { value: "all", label: "All Statuses" },
        ...uniqueStatuses.map(status => ({
          value: status,
          label: status.charAt(0).toUpperCase() + status.slice(1)
        }))
      ]
    },
    {
      key: "type",
      placeholder: "Type",
      options: [
        { value: "all", label: "All Types" },
        ...uniqueTypes.map(type => ({
          value: type,
          label: type
        }))
      ]
    }
  ]
}, [data])
```

## Real-World Example: Reviews Page

```tsx
"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { DataFilterBar } from "@/components/shared/data-filter-bar"
import { ReviewView } from "@/components/reviews/review-view"
import { usePageState } from "@/hooks/use-page-state"
import { Award, MapPin, Flag } from "lucide-react"
import type { Review } from "@/types/entities"

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])

  // Dynamic filter generation
  const filterConfigs = useMemo(() => {
    const uniqueStatuses = Array.from(new Set(reviews.map(r => r.status)))
    const uniqueCountries = Array.from(new Set(reviews.map(r => r.country)))
    const uniqueGrades = Array.from(new Set(reviews.map(r => r.currentGrade)))

    return [
      {
        key: "status",
        placeholder: "Status",
        icon: Flag,
        options: [
          { value: "all", label: "All Statuses" },
          ...uniqueStatuses.map(s => ({ value: s, label: s }))
        ]
      },
      {
        key: "country",
        placeholder: "Country",
        icon: MapPin,
        options: [
          { value: "all", label: "All Countries" },
          ...uniqueCountries.map(c => ({ value: c, label: c }))
        ]
      },
      {
        key: "currentGrade",
        placeholder: "Grade",
        icon: Award,
        options: [
          { value: "all", label: "All Grades" },
          ...uniqueGrades.map(g => ({ value: g, label: g }))
        ]
      }
    ]
  }, [reviews])

  // Unified page state - zero hardcoding!
  const {
    headerProps,
    filterBarPropsWithCounts,
    filteredData,
    viewMode,
    selectedItem,
    setSelectedItem
  } = usePageState({
    data: reviews,
    searchPlaceholder: "Search reviews...",
    searchFields: ['memberFirm', 'reviewer', 'type', 'country'],
    filters: filterConfigs
  })

  return (
    <DashboardLayout {...headerProps}>
      <div className="space-y-4">
        <DataFilterBar {...filterBarPropsWithCounts} />
        
        <ReviewView
          reviews={filteredData}
          viewMode={viewMode}
          selectedReview={selectedItem}
          onView={setSelectedItem}
        />
      </div>
    </DashboardLayout>
  )
}
```

## Benefits

### ✅ Zero Hardcoding
- All configurations passed as props
- Dynamic filter generation from data
- No magic strings or duplicate code

### ✅ Complete Consistency
- Same pattern across all pages
- Centralized logic in hooks
- Predictable behavior everywhere

### ✅ Maximum Scalability
- Add new pages in minutes
- Extend functionality easily
- Maintain once, benefit everywhere

### ✅ Type Safety
- Full TypeScript support
- Generic types for any data
- Compile-time safety

### ✅ Testability
- Isolated hooks easy to test
- Pure functions for filtering
- Mock-friendly architecture

## Migration Guide

### From Old Pattern

**Before:**
```tsx
const [searchTerm, setSearchTerm] = useState("")
const [statusFilter, setStatusFilter] = useState("all")
const [viewMode, setViewMode] = useState("list")

// Manual filtering logic
const filtered = useMemo(() => {
  let result = data
  if (searchTerm) { /* ... */ }
  if (statusFilter !== "all") { /* ... */ }
  return result
}, [data, searchTerm, statusFilter])

// Manual props spreading
<DashboardHeader search={{ searchTerm, ... }} />
<DataFilterBar filters={...} filterValues={...} ... />
```

**After:**
```tsx
const { headerProps, filterBarPropsWithCounts, filteredData } = usePageState({
  data,
  searchPlaceholder: "Search...",
  searchFields: ['name'],
  filters: [{ key: "status", ... }]
})

<DashboardLayout {...headerProps}>
  <DataFilterBar {...filterBarPropsWithCounts} />
  <YourList data={filteredData} />
</DashboardLayout>
```

**Lines of code:** ~50 → ~15 (70% reduction!)

## Best Practices

1. **Always use `useMemo` for filter configs** - Prevents recreation on every render
2. **Generate filters dynamically** - Keep DRY, avoid hardcoding options
3. **Use TypeScript generics** - Get type safety for your specific data type
4. **Compose hooks for complex cases** - Mix and match as needed
5. **Keep business logic separate** - Hooks manage UI state, not business logic

## Common Patterns

### Pattern: List with Detail Panel
```tsx
const { headerProps, filterBarPropsWithCounts, filteredData, selectedItem, setSelectedItem } = usePageState({ ... })

<ListDetailLayout
  listContent={<>
    <DataFilterBar {...filterBarPropsWithCounts} />
    <ListView data={filteredData} onSelect={setSelectedItem} />
  </>}
  detailContent={selectedItem && <DetailView item={selectedItem} />}
/>
```

### Pattern: Multiple Filter Sets
```tsx
// Primary filters
const primary = usePageFilters({ filters: primaryFilters })

// Secondary filters
const secondary = usePageFilters({ filters: secondaryFilters })

// Combine
const filtered = useMemo(() => {
  let result = data
  result = primary.filterData(result)
  result = secondary.filterData(result)
  return result
}, [data, primary, secondary])
```

### Pattern: Custom Filter Logic
```tsx
const { filterData, filterValues } = usePageFilters({ ... })

const customFiltered = useMemo(() => {
  let result = filterData(data)
  
  // Add custom business logic
  if (someCondition) {
    result = result.filter(item => /* custom logic */)
  }
  
  return result
}, [filterData, data, someCondition])
```

## Conclusion

This pattern provides:
- **No hardcoding** - Everything is dynamic and configurable
- **Full consistency** - Same approach across entire app
- **Complete scalability** - Add features once, use everywhere
- **Easy maintenance** - Change logic in one place
- **Developer joy** - Clean, predictable, fast to implement

Start new pages with `usePageState` and enjoy building! 🚀

