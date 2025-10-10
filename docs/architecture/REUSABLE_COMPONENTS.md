# Reusable Review Components Architecture

## Overview

Production-ready, scalable components for document viewing and review workflow tracking.

## Components

### 1. **DocumentViewer** (`components/shared/document-viewer.tsx`)

Reusable document viewer with inline preview capabilities.

**Features:**
- Document list with metadata (name, size, upload date)
- Interactive view/download buttons
- Inline PDF preview with formatted content
- Inline Excel preview with tables and tabs
- Empty state when no document selected
- Toolbar with zoom and fullscreen controls

**Props:**
```typescript
interface DocumentViewerProps {
  documents: Document[]
  onDownload?: (doc: Document) => void
  showUpload?: boolean
  onUpload?: (files: File[]) => void
}
```

**Usage:**
```tsx
import { DocumentViewer } from "@/components/shared/document-viewer"

<DocumentViewer
  documents={review.documents}
  onDownload={handleDownload}
/>
```

---

### 2. **ReviewTimeline** (`components/shared/review-timeline.tsx`)

Timeline component showing review workflow stages with dynamic status.

**Features:**
- 3-stage workflow visualization:
  1. Reviewer Assessment
  2. Technical Director Review  
  3. Final Review
- Auto-calculated stage status based on review state
- Color-coded stages (green=completed, blue=current, gray=pending)
- Shows user, date, grade, and notes for each stage
- Animated pulse for current stage
- Connecting lines between stages

**Props:**
```typescript
interface ReviewTimelineProps {
  review: Review
  reviewerGrade?: string
  reviewerNotes?: string
  reviewerDate?: string
  technicalDirectorGrade?: string
  technicalDirectorNotes?: string
  technicalDirectorDate?: string
  finalReviewStatus?: 'approved' | 'rejected' | 'pending'
  finalReviewNotes?: string
  finalReviewDate?: string
}
```

**Usage:**
```tsx
import { ReviewTimeline } from "@/components/shared/review-timeline"

<ReviewTimeline
  review={review}
  reviewerGrade="1"
  reviewerNotes="Excellent work"
  reviewerDate="2024-01-15"
  technicalDirectorGrade="1"
  technicalDirectorNotes="Approved"
  technicalDirectorDate="2024-01-20"
  finalReviewStatus="approved"
/>
```

---

### 3. **ReviewActionPanel** (`components/reviews/review-action-panel.tsx`)

Unified action panel for all review stages - now uses reusable components.

**Features:**
- Review header with member firm info
- Current grade badge
- **DocumentViewer integration** - Full document viewing
- **ReviewTimeline integration** - Optional timeline display
- Rating form (reviewer or technical director)
- Configurable for different user roles

**Props:**
```typescript
interface ReviewActionPanelProps {
  review: Review
  initialAttachments?: Document[]
  showSubmitRating?: boolean
  onSubmitRating?: (reviewId: string, grade: string, notes: string) => Promise<void>
  showTechnicalDirectorRating?: boolean
  onTechnicalDirectorRating?: (reviewId: string, grade: string, notes: string) => Promise<void>
  showTimeline?: boolean
  // Timeline data props
  reviewerGrade?: string
  reviewerNotes?: string
  // ... more timeline props
}
```

**Usage Examples:**

**For Reviewers:**
```tsx
<ReviewActionPanel
  review={review}
  showSubmitRating={true}
  onSubmitRating={handleSubmitRating}
/>
```

**For Technical Directors:**
```tsx
<ReviewActionPanel
  review={review}
  showTechnicalDirectorRating={true}
  onTechnicalDirectorRating={handleTechnicalRating}
  showTimeline={false}
/>
```

**For Final Review (CEO):**
```tsx
<ReviewActionPanel
  review={review}
  showTimeline={true}
  reviewerGrade="1"
  reviewerNotes="Initial review completed"
  technicalDirectorGrade="1"
  finalReviewStatus="pending"
/>
```

---

### 4. **DataFilterBar** (`components/shared/data-filter-bar.tsx`)

Reusable, configurable filter bar for data filtering across the application.

**Features:**
- Search input with icon
- Multiple configurable filter selects
- Optional view mode toggle (list/card)
- Clear filters button
- Result count display
- Consistent `bg-muted/50` styling on all inputs
- Fully responsive and type-safe

**Props:**
```typescript
interface DataFilterBarProps {
  searchTerm: string
  searchPlaceholder?: string
  onSearchChange: (value: string) => void
  filters: FilterConfig[]
  filterValues: Record<string, string>
  onFilterChange: (key: string, value: string) => void
  showViewToggle?: boolean
  viewMode?: "list" | "card"
  onViewModeChange?: (mode: "list" | "card") => void
  hasActiveFilters: boolean
  onClearFilters: () => void
  resultCount?: number
  totalCount?: number
}

interface FilterConfig {
  key: string
  placeholder: string
  icon?: LucideIcon
  width?: string
  options: Array<{ value: string; label: string }>
}
```

**Usage:**
```tsx
import { DataFilterBar } from "@/components/shared/data-filter-bar"
import { Calendar, Award, MapPin } from "lucide-react"

const filters = [
  {
    key: "year",
    placeholder: "Year",
    icon: Calendar,
    width: "w-[130px]",
    options: [
      { value: "all", label: "All Years" },
      { value: "2024", label: "2024" },
    ]
  },
  {
    key: "grade",
    placeholder: "Grade",
    icon: Award,
    options: [
      { value: "all", label: "All Grades" },
      { value: "1", label: "Grade 1" },
    ]
  }
]

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
```

**Pages Using DataFilterBar:**
- `/admin/reviews` - Review filters
- `/admin/final-reviews` - Final review filters
- `/admin/reviewers` - Reviewer filters
- `/admin/member-firms` - Member firm filters
- `/director/reviews` - Technical director filters

---

### 5. **DataViewContainer** (`components/shared/data-view-container.tsx`)

Reusable container component for list/card view rendering with consistent layouts.

**Features:**
- Handles list vs card view rendering
- Configurable grid columns for card view
- Configurable spacing for list view
- Consistent animations
- Fully responsive
- Type-safe

**Props:**
```typescript
interface DataViewContainerProps {
  viewMode: "list" | "card"
  children: ReactNode
  className?: string
  cardGridCols?: {
    sm?: string
    md?: string
    lg?: string
    xl?: string
  }
  listSpacing?: string
}
```

**Usage:**
```tsx
import { DataViewContainer } from "@/components/shared/data-view-container"

<DataViewContainer 
  viewMode={viewMode}
  listSpacing="space-y-1"
  cardGridCols={{
    sm: "grid-cols-1",
    md: "md:grid-cols-2",
    lg: "lg:grid-cols-2",
    xl: "xl:grid-cols-3"
  }}
>
  {items.map((item) => (
    <ItemComponent key={item.id} item={item} />
  ))}
</DataViewContainer>
```

**Components Using DataViewContainer:**
- `ReviewView` - Review list/card rendering
- `/admin/member-firms` - Member firm list/card rendering

---

### 6. **DataItemCard** (`components/shared/data-item-card.tsx`)

Universal reusable card component for both list and card views with expand/collapse functionality.

**Features:**
- Handles both list and card view rendering
- Built-in expand/collapse with smooth animations
- Configurable avatar, title, subtitle
- Flexible badge system
- Dropdown menu actions
- Primary and quick actions
- Mobile responsive layouts
- Selection state support
- Zero hardcoded layouts

**Props:**
```typescript
interface DataItemCardProps {
  viewMode: "list" | "card"
  avatar?: ReactNode
  title: string | ReactNode
  subtitle?: string | ReactNode
  badges?: ReactNode
  secondaryInfo?: ReactNode // Desktop-only info (list view)
  mobileInfo?: ReactNode // Mobile-only info (list view)
  expandableContent?: ReactNode
  alwaysVisibleContent?: ReactNode // Card view always visible
  primaryAction?: {
    icon: ReactNode
    label: string
    onClick: () => void
  }
  quickActions?: ReactNode
  dropdownActions?: DropdownAction[]
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

interface DropdownAction {
  icon: ReactNode
  label: string
  onClick: () => void
  variant?: "default" | "destructive"
}
```

**Usage Example:**
```tsx
import { DataItemCard } from "@/components/shared/data-item-card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2 } from "lucide-react"

<DataItemCard
  viewMode={viewMode}
  avatar={
    <Avatar className="h-8 w-8">
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  }
  title={item.name}
  subtitle={item.email}
  badges={
    <div className="flex gap-1">
      <Badge>Active</Badge>
      <Badge variant="outline">Grade 1</Badge>
    </div>
  }
  secondaryInfo={
    <div className="flex gap-2">
      <span>Status info</span>
    </div>
  }
  expandableContent={
    <div className="space-y-2">
      <div>Detailed information...</div>
    </div>
  }
  primaryAction={{
    icon: <Eye className="h-3 w-3" />,
    label: "View",
    onClick: () => handleView(item)
  }}
  dropdownActions={[
    {
      icon: <Edit className="mr-2 h-4 w-4" />,
      label: "Edit",
      onClick: () => handleEdit(item)
    },
    {
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      label: "Delete",
      onClick: () => handleDelete(item),
      variant: "destructive"
    }
  ]}
  isSelected={selectedItem?.id === item.id}
  onClick={() => selectItem(item)}
/>
```

**Benefits:**
- ✅ Single component for all item types
- ✅ No hardcoded layouts
- ✅ Fully configurable via props
- ✅ Built-in expand/collapse
- ✅ Consistent UX across all screens
- ✅ Type-safe with TypeScript

---

## Architecture Benefits

### ✅ **Reusability**
- Single source of truth for document viewing
- Timeline component works across all review stages
- DataFilterBar eliminates filter UI duplication across pages
- DataViewContainer eliminates list/card view layout duplication
- DataItemCard provides universal item rendering (reviews, firms, reviewers)
- No code duplication - DRY principle applied throughout

### ✅ **Scalability**
- Easy to add new document types
- Timeline stages configurable
- Props-driven, no hardcoding

### ✅ **Type Safety**
- Full TypeScript support
- Shared Document interface
- Proper type definitions

### ✅ **Maintainability**
- Changes in one place affect all pages
- Clear separation of concerns
- Well-documented props

### ✅ **Production Ready**
- Error boundaries
- Loading states
- Proper date formatting
- Responsive design

---

## File Structure

```
components/
├── shared/
│   ├── document-viewer.tsx       # Reusable document viewer
│   ├── review-timeline.tsx       # Workflow timeline
│   ├── data-filter-bar.tsx       # Reusable filter component
│   ├── data-view-container.tsx   # Reusable list/card view container
│   ├── data-item-card.tsx        # Universal item card component
│   └── status-badge.tsx          # Interactive status badges
├── reviews/
│   ├── review-action-panel.tsx   # Uses document-viewer & timeline
│   ├── review-view.tsx            # Uses data-view-container
│   ├── review-item.tsx            # Can use data-item-card
│   └── final-review-screen.tsx   # Uses document-viewer & timeline
├── member-firms/
│   └── member-firm-item.tsx       # Can use data-item-card
└── reviewers/
    └── reviewer-item.tsx          # Can use data-item-card
```

---

## Integration Points

### Pages Using These Components:

1. **Admin Reviewers** (`/admin/reviewers`)
   - Uses ReviewActionPanel with document viewer
   - Shows reviewer rating form

2. **Technical Director Reviews** (`/director/reviews`)
   - Uses ReviewActionPanel with document viewer
   - Shows technical director rating form

3. **Admin Final Reviews** (`/admin/final-reviews`)
   - Uses FinalReviewScreen
   - Shows timeline and documents
   - CEO final approval

4. **CEO Final Reviews** (`/ceo/final-reviews`)
   - Uses FinalReviewScreen
   - Shows complete timeline
   - Final approval/rejection

---

## Future Enhancements

- [ ] Add document zoom functionality
- [ ] Add fullscreen mode
- [ ] Support more document types (Word, images)
- [ ] Add document annotations
- [ ] Timeline export/print
- [ ] Real-time collaboration indicators

