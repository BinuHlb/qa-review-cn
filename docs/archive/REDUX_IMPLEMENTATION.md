# Redux Toolkit Implementation Guide

This document explains the Redux Toolkit implementation in the QA Review application, including setup, usage, and migration from local state management.

## 🏗️ Architecture Overview

The Redux implementation follows Redux Toolkit best practices with three main slices:

- **Auth Slice**: User authentication state
- **Reviews Slice**: Reviews data, filters, and CRUD operations  
- **UI Slice**: Sidebar states, modals, notifications, and loading states

## 📁 File Structure

```
lib/store/
├── index.ts                 # Store configuration
├── hooks.ts                 # Typed Redux hooks
└── slices/
    ├── authSlice.ts         # Authentication state
    ├── reviewsSlice.ts      # Reviews data and filters
    └── uiSlice.ts          # UI state management

hooks/
├── use-redux-reviews.ts     # Reviews Redux hook
└── use-redux-ui.ts         # UI Redux hook

components/
├── providers/
│   └── redux-provider.tsx   # Redux provider component
└── reviews/
    ├── redux-review-filters.tsx    # Redux-powered filters
    └── redux-reviews-sidebar.tsx   # Redux-powered sidebar
```

## 🚀 Getting Started

### 1. Store Configuration

The Redux store is configured in `lib/store/index.ts`:

```typescript
import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './slices/authSlice'
import { reviewsSlice } from './slices/reviewsSlice'
import { uiSlice } from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    reviews: reviewsSlice.reducer,
    ui: uiSlice.reducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

### 2. Provider Setup

The Redux provider is set up in the app layout:

```typescript
// app/layout.tsx
import { ReduxProvider } from "@/components/providers/redux-provider"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
```

## 🎯 Usage Examples

### Using Reviews Data

```typescript
import { useReduxReviews } from "@/hooks/use-redux-reviews"

function ReviewsPage() {
  const {
    filteredReviews,    // Filtered reviews array
    selectedReview,     // Currently selected review
    viewMode,          // 'list' | 'card'
    filters,           // Current filter state
    stats,             // Review statistics
    isLoading,         // Loading state
    error,             // Error state
    
    // Actions
    selectReview,      // Select a review
    handleSearchChange, // Update search term
    handleStatusChange, // Update status filter
    handleClearFilters, // Clear all filters
    createReview,      // Create new review
    updateReview,      // Update existing review
    deleteReview,      // Delete review
  } = useReduxReviews()

  return (
    <div>
      <input 
        value={filters.searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      {filteredReviews.map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
}
```

### Using UI State

```typescript
import { useReduxUI } from "@/hooks/use-redux-ui"

function LayoutComponent() {
  const {
    leftSidebarOpen,    // Left sidebar state
    rightSidebarOpen,   // Right sidebar state
    activeModal,        // Active modal ID
    notifications,      // Notification array
    
    // Actions
    toggleLeftSidebar,  // Toggle left sidebar
    openModal,         // Open modal
    closeModal,        // Close modal
    addNotification,   // Add notification
  } = useReduxUI()

  return (
    <div>
      <button onClick={toggleLeftSidebar}>
        Toggle Sidebar
      </button>
      {activeModal && <Modal />}
    </div>
  )
}
```

### Direct Redux Usage

For advanced use cases, you can use Redux directly:

```typescript
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { setSearchTerm, setViewMode } from "@/lib/store/slices/reviewsSlice"

function MyComponent() {
  const dispatch = useAppDispatch()
  const searchTerm = useAppSelector(state => state.reviews.filters.searchTerm)
  
  const handleSearch = (value: string) => {
    dispatch(setSearchTerm(value))
  }
  
  return (
    <input 
      value={searchTerm}
      onChange={(e) => handleSearch(e.target.value)}
    />
  )
}
```

## 🔄 Migration from Local State

### Before (Local State)

```typescript
// Old approach with local state
function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState("list")
  
  // Complex filtering logic
  const filteredReviews = useMemo(() => {
    let filtered = reviews
    if (searchTerm) {
      filtered = filtered.filter(/* filter logic */)
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(/* filter logic */)
    }
    return filtered
  }, [reviews, searchTerm, statusFilter])
  
  // Prop drilling to child components
  return (
    <div>
      <Filters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <ReviewList reviews={filteredReviews} />
    </div>
  )
}
```

### After (Redux)

```typescript
// New approach with Redux
function ReviewsPage() {
  const {
    filteredReviews,
    filters,
    viewMode,
    handleSearchChange,
    handleStatusChange,
    handleViewModeChange,
  } = useReduxReviews()
  
  return (
    <div>
      <ReduxReviewFilters />
      <ReviewList reviews={filteredReviews} />
    </div>
  )
}
```

## 🎨 Component Integration

### Redux-Powered Filters

The `ReduxReviewFilters` component automatically connects to Redux:

```typescript
import { ReduxReviewFilters } from "@/components/reviews/redux-review-filters"

function ReviewsPage() {
  return (
    <div>
      <ReduxReviewFilters />
      {/* Filters automatically sync with Redux state */}
    </div>
  )
}
```

### Redux-Powered Sidebar

The `ReduxReviewsSidebar` provides real-time statistics and filters:

```typescript
import { ReduxReviewsSidebar } from "@/components/reviews/redux-reviews-sidebar"

function Layout() {
  return (
    <div>
      <main>Content</main>
      <ReduxReviewsSidebar />
    </div>
  )
}
```

## 🔧 State Structure

### Reviews State

```typescript
interface ReviewsState {
  items: Review[]                    // All reviews
  filteredItems: Review[]            // Filtered reviews
  isLoading: boolean                 // Loading state
  error: string | null               // Error state
  selectedReview: Review | null      // Selected review
  viewMode: 'list' | 'card'         // View mode
  filters: {
    searchTerm: string
    statusFilter: string
    gradeFilter: string
    priorityFilter: string
    countryFilter: string
  }
  stats: {
    total: number
    completed: number
    inProgress: number
    pending: number
    overdue: number
  }
}
```

### UI State

```typescript
interface UIState {
  leftSidebarOpen: boolean           // Left sidebar state
  rightSidebarOpen: boolean          // Right sidebar state
  activeDrawer: string | null        // Active drawer ID
  activeModal: string | null         // Active modal ID
  isMobile: boolean                  // Mobile detection
  sidebarCollapsed: boolean          // Sidebar collapsed state
  loading: {
    reviews: boolean
    attachments: boolean
    comments: boolean
    assignments: boolean
  }
  notifications: Notification[]      // Notification array
}
```

## 🚀 Benefits of This Implementation

### 1. **Centralized State Management**
- Single source of truth for all application state
- Consistent data across components and pages
- Predictable state updates

### 2. **Eliminated Prop Drilling**
- No more passing props through multiple component layers
- Direct access to state from any component
- Cleaner component interfaces

### 3. **Real-time Updates**
- State changes automatically update all connected components
- Cross-component communication without callbacks
- Synchronized UI across different user roles

### 4. **Better Developer Experience**
- Redux DevTools for debugging
- TypeScript support with typed hooks
- Predictable state mutations

### 5. **Performance Optimizations**
- Memoized selectors prevent unnecessary re-renders
- Efficient state updates with Redux Toolkit
- Automatic filtering without manual `useMemo` hooks

## 🔍 Debugging

### Redux DevTools

Install the Redux DevTools browser extension to:
- Inspect state changes
- Time-travel debug
- Monitor actions and state
- Export/import state

### Logging

Redux Toolkit automatically logs actions in development:

```typescript
// Store configuration includes devTools
export const store = configureStore({
  reducer: { /* ... */ },
  devTools: process.env.NODE_ENV !== 'production',
})
```

## 📝 Best Practices

### 1. Use Custom Hooks
Prefer custom hooks over direct Redux usage:

```typescript
// ✅ Good
const { reviews, isLoading } = useReduxReviews()

// ❌ Avoid
const reviews = useAppSelector(state => state.reviews.items)
const isLoading = useAppSelector(state => state.reviews.isLoading)
```

### 2. Keep Components Simple
Components should focus on rendering, not state management:

```typescript
// ✅ Good - Component focuses on rendering
function ReviewCard({ review }: { review: Review }) {
  return <div>{review.title}</div>
}

// ❌ Avoid - Component managing complex state
function ReviewCard({ review }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [comments, setComments] = useState([])
  // ... complex state management
}
```

### 3. Use Actions Consistently
Always use action creators instead of direct state mutations:

```typescript
// ✅ Good
dispatch(setSearchTerm("new search"))

// ❌ Avoid
dispatch({ type: 'reviews/setSearchTerm', payload: "new search" })
```

## 🔄 Migration Strategy

To migrate existing components to Redux:

1. **Identify State**: Find components with local state that should be global
2. **Create Actions**: Add actions to appropriate slices
3. **Update Components**: Replace `useState` with Redux hooks
4. **Test**: Ensure state updates work correctly
5. **Clean Up**: Remove unused local state and props

## 🎯 Example: Complete Page Implementation

```typescript
// app/admin/reviews-redux/page.tsx
"use client"

import { DualSidebarLayout } from "@/components/shared/dual-sidebar-layout"
import { ReviewView } from "@/components/reviews/review-view"
import { ReduxReviewFilters } from "@/components/reviews/redux-review-filters"
import { useReduxReviews } from "@/hooks/use-redux-reviews"

export default function AdminReviewsReduxPage() {
  const {
    filteredReviews,
    selectedReview,
    viewMode,
    isLoading,
    error,
    selectReview,
    handleViewModeChange,
  } = useReduxReviews()

  return (
    <DualSidebarLayout
      title="Reviews Management"
      description="Manage and review all QA assessments"
    >
      <div className="space-y-6">
        <ReduxReviewFilters />
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading reviews...</div>
          </div>
        ) : (
          <ReviewView
            reviews={filteredReviews}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            selectedReview={selectedReview}
            onSelectReview={selectReview}
          />
        )}
      </div>
    </DualSidebarLayout>
  )
}
```

This Redux implementation provides a solid foundation for scalable state management in your QA review application. The centralized state, real-time updates, and elimination of prop drilling will significantly improve the developer experience and application performance.
