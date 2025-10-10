# DataFilterBar Component

A reusable, configurable filter bar component for data filtering across the application.

## Features

- ✅ Search input with icon
- ✅ Multiple configurable filter selects
- ✅ Optional view mode toggle (list/card)
- ✅ Clear filters button
- ✅ Result count display
- ✅ Consistent `bg-muted/50` styling on all inputs
- ✅ Fully responsive
- ✅ Type-safe with TypeScript

## Usage

### Basic Example

```tsx
import { DataFilterBar } from "@/components/shared/data-filter-bar"
import { Calendar, Award, MapPin } from "lucide-react"

function MyPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValues, setFilterValues] = useState({
    year: "all",
    grade: "all",
    country: "all"
  })
  const [viewMode, setViewMode] = useState<"list" | "card">("list")

  const filters = [
    {
      key: "year",
      placeholder: "Year",
      icon: Calendar,
      width: "w-[130px]",
      options: [
        { value: "all", label: "All Years" },
        { value: "2024", label: "2024" },
        { value: "2023", label: "2023" },
      ]
    },
    {
      key: "grade",
      placeholder: "Grade",
      icon: Award,
      options: [
        { value: "all", label: "All Grades" },
        { value: "1", label: "Grade 1" },
        { value: "2", label: "Grade 2" },
      ]
    },
    {
      key: "country",
      placeholder: "Country",
      icon: MapPin,
      width: "w-[140px]",
      options: [
        { value: "all", label: "All Countries" },
        { value: "USA", label: "USA" },
        { value: "Canada", label: "Canada" },
      ]
    }
  ]

  const hasActiveFilters = 
    searchTerm !== "" || 
    filterValues.year !== "all" || 
    filterValues.grade !== "all" || 
    filterValues.country !== "all"

  const handleClearFilters = () => {
    setSearchTerm("")
    setFilterValues({
      year: "all",
      grade: "all",
      country: "all"
    })
  }

  return (
    <DataFilterBar
      searchTerm={searchTerm}
      searchPlaceholder="Search reviews..."
      onSearchChange={setSearchTerm}
      filters={filters}
      filterValues={filterValues}
      onFilterChange={(key, value) => 
        setFilterValues(prev => ({ ...prev, [key]: value }))
      }
      showViewToggle={true}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={handleClearFilters}
      resultCount={filteredData.length}
      totalCount={allData.length}
    />
  )
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `searchTerm` | `string` | Yes | Current search term value |
| `searchPlaceholder` | `string` | No | Placeholder for search input (default: "Search...") |
| `onSearchChange` | `(value: string) => void` | Yes | Search term change handler |
| `filters` | `FilterConfig[]` | Yes | Array of filter configurations |
| `filterValues` | `Record<string, string>` | Yes | Current filter values |
| `onFilterChange` | `(key: string, value: string) => void` | Yes | Filter change handler |
| `showViewToggle` | `boolean` | No | Show view mode toggle (default: false) |
| `viewMode` | `"list" \| "card"` | No | Current view mode |
| `onViewModeChange` | `(mode: "list" \| "card") => void` | No | View mode change handler |
| `hasActiveFilters` | `boolean` | Yes | Whether any filters are active |
| `onClearFilters` | `() => void` | Yes | Clear filters handler |
| `resultCount` | `number` | No | Current filtered results count |
| `totalCount` | `number` | No | Total items count |

## FilterConfig Type

```typescript
interface FilterConfig {
  key: string              // Unique identifier
  placeholder: string      // Select placeholder text
  icon?: LucideIcon       // Optional icon component
  width?: string          // Tailwind width class (default: "w-[130px]")
  options: Array<{
    value: string         // Option value
    label: string         // Display label
  }>
}
```

## Benefits

1. **DRY Principle**: Single source of truth for filter UI
2. **Consistency**: All filter bars look and behave the same
3. **Maintainability**: Update once, applies everywhere
4. **Type Safety**: Full TypeScript support
5. **Flexibility**: Highly configurable for different use cases
6. **Accessibility**: Built on shadcn/ui components

## Migration

Replace existing inline filter code with:

```tsx
// Before: 100+ lines of duplicated filter JSX
// After: ~30 lines with DataFilterBar

<DataFilterBar {...filterProps} />
```

