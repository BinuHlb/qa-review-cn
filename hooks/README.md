# Custom Hooks

This directory contains all reusable custom React hooks for the QA Review application.

## 📁 Directory Structure

```
hooks/
├── index.ts                    # Barrel export for all hooks
├── README.md                   # This file
│
├── Page State Management (⭐ Recommended Pattern)
├── use-page-state.ts          # Unified hook combining search, filters, and view mode
├── use-page-search.ts         # Search functionality for pages
├── use-page-filters.ts        # Filter state management
│
├── Data Management
├── use-data-filters.ts        # Generic data filtering
├── use-selection.ts           # Item selection management
│
├── Feature-Specific
├── use-reviews.ts             # Review operations
├── use-final-review.ts        # Final review workflow
├── use-attachments.ts         # File attachment handling
├── use-comments.ts            # Comment management
│
├── Redux State
├── use-redux-reviews.ts       # Redux review state
├── use-redux-ui.ts            # Redux UI state
│
└── UI Utilities
    ├── use-mobile.ts          # Mobile breakpoint detection
    └── use-toast.ts           # Toast notifications
```

## 🚀 Quick Start

### For New Pages (Recommended)

Use the unified `usePageState` hook:

```tsx
import { usePageState } from "@/hooks"

const { headerProps, filterBarPropsWithCounts, filteredData } = usePageState({
  data: items,
  searchPlaceholder: "Search...",
  searchFields: ['name', 'description'],
  filters: [
    { key: "status", placeholder: "Status", options: [...] }
  ]
})

<DashboardLayout {...headerProps}>
  <DataFilterBar {...filterBarPropsWithCounts} />
  <YourList data={filteredData} />
</DashboardLayout>
```

## 📚 Hook Categories

### 1. Page State Management (⭐ New Scalable Pattern)

#### `usePageState`
**Purpose:** All-in-one page state management  
**Use When:** Building any list/detail page with search and filters  
**Benefits:** Zero hardcoding, complete consistency, maximum scalability

```tsx
const state = usePageState({
  data: items,
  searchPlaceholder: "Search items...",
  searchFields: ['name', 'email'],
  filters: filterConfigs,
  viewMode: "list"
})
```

**Returns:**
- `headerProps` - Props for DashboardHeader
- `filterBarPropsWithCounts` - Props for DataFilterBar
- `filteredData` - Filtered and searched data
- `selectedItem` - Currently selected item
- `viewMode` - Current view mode

#### `usePageSearch`
**Purpose:** Search functionality  
**Use When:** Need search without full page state management

```tsx
const { searchConfig, filterBySearch } = usePageSearch({
  searchPlaceholder: "Search...",
  searchFields: ['name', 'description']
})
```

#### `usePageFilters`
**Purpose:** Filter state management  
**Use When:** Need filters without full page state management

```tsx
const { filterBarProps, filterData } = usePageFilters({
  filters: [
    { key: "status", placeholder: "Status", options: [...] }
  ]
})
```

### 2. Data Management

#### `useDataFilters`
**Purpose:** Legacy data filtering hook  
**Status:** Consider migrating to `usePageFilters`

#### `useSelection`
**Purpose:** Item selection with toggle behavior  
**Use When:** Need selection management separate from page state

```tsx
const { selected, select, clear } = useSelection<Item>(
  (item) => item.id,
  { toggleOnReselect: true }
)
```

### 3. Feature-Specific Hooks

#### `useReviews`
**Purpose:** Review CRUD operations  
**Use When:** Working with review data

#### `useFinalReview`
**Purpose:** Final review workflow  
**Use When:** Handling final review processes

#### `useAttachments`
**Purpose:** File attachment handling  
**Use When:** Managing document uploads/downloads

#### `useComments`
**Purpose:** Comment management  
**Use When:** Handling comments on items

### 4. Redux State

#### `useReduxReviews`
**Purpose:** Access Redux review state  
**Use When:** Need global review state

#### `useReduxUI`
**Purpose:** Access Redux UI state  
**Use When:** Need global UI state

### 5. UI Utilities

#### `useMobile`
**Purpose:** Detect mobile breakpoint  
**Use When:** Conditional mobile rendering

```tsx
const isMobile = useMobile()
```

#### `useToast`
**Purpose:** Show toast notifications  
**Use When:** Display user feedback

```tsx
const { toast } = useToast()
toast({ title: "Success!", description: "Item saved" })
```

## 🎯 Best Practices

### 1. Import from Index
```tsx
// ✅ Good
import { usePageState, useToast } from "@/hooks"

// ❌ Avoid
import { usePageState } from "@/hooks/use-page-state"
```

### 2. Use TypeScript Generics
```tsx
// ✅ Good - Type safe
const { filteredData } = usePageState<Review>({ ... })

// ❌ Avoid - Untyped
const { filteredData } = usePageState({ ... })
```

### 3. Memoize Configurations
```tsx
// ✅ Good - Prevents recreation
const filters = useMemo(() => [
  { key: "status", ... }
], [dependencies])

// ❌ Avoid - Recreates every render
const filters = [{ key: "status", ... }]
```

### 4. Compose for Complex Needs
```tsx
// ✅ Good - Flexible composition
const search = usePageSearch({ ... })
const filters = usePageFilters({ ... })
const custom = useYourCustomHook({ ... })

// Combine as needed
const data = customLogic(search, filters, custom)
```

## 🔄 Migration Guide

### From Old Pattern to New

**Old Way (50+ lines):**
```tsx
const [searchTerm, setSearchTerm] = useState("")
const [statusFilter, setStatusFilter] = useState("all")
const [viewMode, setViewMode] = useState("list")

const filtered = useMemo(() => {
  let result = data
  if (searchTerm) { /* manual filtering */ }
  if (statusFilter !== "all") { /* manual filtering */ }
  return result
}, [data, searchTerm, statusFilter])

// Manual prop spreading...
<DashboardHeader search={{ searchTerm, ... }} />
<DataFilterBar 
  filters={...}
  filterValues={...}
  onFilterChange={...}
  // ... many more props
/>
```

**New Way (10-15 lines):**
```tsx
const { headerProps, filterBarPropsWithCounts, filteredData } = usePageState({
  data,
  searchPlaceholder: "Search...",
  searchFields: ['name'],
  filters: [{ key: "status", ... }]
})

<DashboardLayout {...headerProps}>
  <DataFilterBar {...filterBarPropsWithCounts} />
</DashboardLayout>
```

**Result:** 70% less code, 100% more maintainable!

## 📖 Documentation

- **Comprehensive Guide:** `/docs/guides/SCALABLE_PAGE_PATTERN.md`
- **Search in Header:** `/docs/guides/SEARCH_IN_HEADER_USAGE.md`
- **Component Docs:** `/docs/architecture/REUSABLE_COMPONENTS.md`

## 🤝 Contributing

When adding new hooks:

1. ✅ Add TypeScript types
2. ✅ Include JSDoc comments
3. ✅ Export from `index.ts`
4. ✅ Update this README
5. ✅ Add usage examples
6. ✅ Write tests (when applicable)

## 💡 Tips

- **Start with `usePageState`** for new pages
- **Compose hooks** for complex requirements
- **Keep hooks focused** on single responsibilities
- **Use generics** for type safety
- **Memoize configs** to avoid re-renders

## 🎓 Learning Resources

### New to Custom Hooks?
- React Docs: https://react.dev/learn/reusing-logic-with-custom-hooks
- Our Guide: `/docs/guides/SCALABLE_PAGE_PATTERN.md`

### Want to Deep Dive?
- Read hook source code (well-commented!)
- Check real usage in `/app/admin/*` pages
- Review test files (coming soon)

---

**Remember:** The goal is **zero hardcoding**, **complete consistency**, and **maximum scalability**. These hooks make that easy! 🚀

