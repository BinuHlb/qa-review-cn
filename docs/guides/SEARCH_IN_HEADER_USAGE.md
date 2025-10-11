# Search in Header - Usage Guide

## Overview
The search functionality can now be placed in either the **DashboardHeader** or the **DataFilterBar**, providing flexible positioning for different layouts.

## How It Works

### 1. **DashboardHeader** - Accepts Optional Search Props
The header component now accepts an optional `search` prop that displays a search input in the center of the header.

### 2. **DataFilterBar** - Search Can Be Hidden
The filter bar has a `showSearch` prop (defaults to `true`) that allows you to hide the search when it's in the header instead.

## Usage Example

### Option A: Search in Header (Recommended for list pages)

```tsx
"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DataFilterBar } from "@/components/shared/data-filter-bar"

export default function MyPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "card">("list")
  
  // ... your other state and logic

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Pass search props to header */}
        <DashboardHeader 
          search={{
            searchTerm,
            searchPlaceholder: "Search reviews...",
            onSearchChange: setSearchTerm
          }}
        />
        
        <div className="p-4">
          {/* Hide search in filter bar since it's in header */}
          <DataFilterBar
            showSearch={false}  // ← Important: Hide search here
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filterConfigs}
            filterValues={filters}
            onFilterChange={setFilter}
            showViewToggle={true}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            hasActiveFilters={hasFilters}
            onClearFilters={clearFilters}
            resultCount={filteredData.length}
            totalCount={data.length}
          />
          
          {/* Your content */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

### Option B: Search in Filter Bar (Default - Backward Compatible)

```tsx
"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DataFilterBar } from "@/components/shared/data-filter-bar"

export default function MyPage() {
  const [searchTerm, setSearchTerm] = useState("")
  
  // ... your other state and logic

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* No search props - header doesn't show search */}
        <DashboardHeader />
        
        <div className="p-4">
          {/* Search remains in filter bar (default behavior) */}
          <DataFilterBar
            // showSearch={true} is default, can be omitted
            searchTerm={searchTerm}
            searchPlaceholder="Search..."
            onSearchChange={setSearchTerm}
            filters={filterConfigs}
            filterValues={filters}
            onFilterChange={setFilter}
            hasActiveFilters={hasFilters}
            onClearFilters={clearFilters}
          />
          
          {/* Your content */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

## Props Reference

### DashboardHeader

```typescript
interface DashboardHeaderProps {
  search?: {
    searchTerm: string
    searchPlaceholder?: string
    onSearchChange: (value: string) => void
  }
}
```

- **`search`** (optional): If provided, shows search input in header
  - **`searchTerm`**: Current search value
  - **`searchPlaceholder`**: Placeholder text (defaults to "Search...")
  - **`onSearchChange`**: Callback when search changes

### DataFilterBar

```typescript
interface DataFilterBarProps {
  // Search (optional - can be in header instead)
  showSearch?: boolean              // Show/hide search (default: true)
  searchTerm?: string               // Current search value
  searchPlaceholder?: string        // Placeholder text
  onSearchChange?: (value: string) => void  // Search change callback
  
  // ... other props remain the same
}
```

## Benefits

✅ **Flexible Placement**: Choose where search makes most sense for your layout  
✅ **Backward Compatible**: Existing pages work without changes  
✅ **Clean UX**: Search in header provides more space for filters  
✅ **Consistent Behavior**: Same search functionality, different locations  
✅ **Dynamic**: Works with all existing filter and view toggle features  

## When to Use Each Approach

### Search in Header (Option A)
- ✅ List-heavy pages with many filters
- ✅ When you want prominent search visibility
- ✅ Pages with complex filtering needs
- ✅ Better for mobile responsiveness

### Search in Filter Bar (Option B)
- ✅ Simple pages with few filters
- ✅ When filters and search are closely related
- ✅ Existing pages (already working)
- ✅ When header space is limited

