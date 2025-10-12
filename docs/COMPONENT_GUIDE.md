# Component Architecture Guide

## 📚 Component Organization

Your components are now organized into a clean, scalable structure:

```
components/
├── layouts/         # Page layout templates
├── features/        # Feature-specific components  
├── common/          # Reusable common components
└── ui/              # Base shadcn/ui components
```

---

## 🗂️ Directory Structure

### 1. **layouts/** - Page Templates

**Purpose:** High-level page layouts and templates

```
layouts/
├── list-detail-page-layout.tsx  ⭐ Unified list-detail template
├── dashboard-layout.tsx         # Main dashboard wrapper
├── list-detail-layout.tsx       # Generic list-detail split
├── page-layout.tsx              # Basic page wrapper
├── dual-sidebar-layout.tsx      # Two sidebars
├── split-view-layout.tsx        # Split screen view
├── admin-page-layout.tsx        # Admin-specific layout
└── index.ts                     # Barrel exports
```

**When to use:**
- Building new pages
- Creating page templates
- Wrapping page content

**Example:**
```tsx
import { ListDetailPageLayout } from "@/components/layouts"

<ListDetailPageLayout
  searchPlaceholder="Search..."
  filters={filterConfigs}
  listContent={<YourList />}
  detailContent={<YourDetail />}
/>
```

---

### 2. **features/** - Feature-Specific

**Purpose:** Components specific to a business feature

```
features/
├── reviews/
│   ├── review-view.tsx          # Main review list/card view
│   ├── review-item.tsx          # Single review item
│   ├── review-action-panel.tsx  # Review detail panel
│   ├── review-assign-drawer.tsx # Assignment drawer
│   ├── workflow/                # Workflow-specific
│   │   ├── acceptance-drawer.tsx
│   │   ├── reviewer-work-drawer.tsx
│   │   └── verification-drawer.tsx
│   └── index.ts
│
├── member-firms/
│   ├── member-firm-view.tsx
│   ├── member-firm-item.tsx
│   ├── member-firm-action-panel.tsx
│   └── index.ts
│
└── reviewers/
    ├── reviewer-view.tsx
    ├── reviewer-item.tsx
    └── index.ts
```

**When to use:**
- Building feature-specific UI
- Components tied to a domain model
- Business logic components

**Example:**
```tsx
import { ReviewView, ReviewActionPanel } from "@/components/features/reviews"

<ReviewView reviews={reviews} onSelect={handleSelect} />
<ReviewActionPanel review={selectedReview} />
```

---

### 3. **common/** - Shared Components

**Purpose:** Truly reusable components used across features

#### 3a. **common/data-display/**

Components for displaying and filtering data.

```
data-display/
├── data-filter-bar.tsx    # Filter controls
├── data-view-container.tsx
├── view-toggle.tsx        # List/Card toggle
├── filter-section.tsx
└── index.ts
```

**Example:**
```tsx
import { DataFilterBar } from "@/components/common/data-display"

<DataFilterBar
  filters={filterConfigs}
  filterValues={filterValues}
  onFilterChange={handleFilterChange}
  viewMode={viewMode}
  onViewModeChange={setViewMode}
/>
```

#### 3b. **common/forms/**

All form-related components.

```
forms/
├── form-input.tsx
├── form-select.tsx
├── form-textarea.tsx
├── form-date-picker.tsx
├── form-field.tsx
├── grade-select.tsx       # Grade dropdown
├── rating-form.tsx        # Complete rating form
├── grid-form.tsx
└── index.ts
```

**Example:**
```tsx
import { RatingForm, GradeSelect } from "@/components/common/forms"

<RatingForm
  onSubmit={handleSubmit}
  currentGrade="3"
  gradeLabel="Your Grade"
/>
```

#### 3c. **common/panels/**

Panel and section layouts.

```
panels/
├── action-panel-layout.tsx    # Standard action panel
├── detail-sections.tsx        # Info rows, stats grids
├── scrollable-panel.tsx
└── index.ts
```

**Exports:**
```tsx
import { 
  ActionPanelLayout, 
  ActionPanelFormSection,
  InfoRow,
  StatsGrid,
  BadgeList,
  ContactSection
} from "@/components/common/panels"
```

#### 3d. **common/documents/**

Document and attachment handling.

```
documents/
├── attachments-section.tsx    # File attachments
├── document-viewer.tsx        # PDF/doc viewer
├── comments-section.tsx       # Comments thread
└── index.ts
```

**Example:**
```tsx
import { AttachmentsSection, CommentsSection } from "@/components/common/documents"

<AttachmentsSection
  attachments={attachments}
  onUpload={handleUpload}
  onDownload={handleDownload}
/>
```

#### 3e. **common/drawers/**

Drawer/sheet components.

```
drawers/
├── drawer.tsx           # Base drawer
├── drawer-footer.tsx    # Drawer footer with actions
├── assign-drawer.tsx    # Generic assignment drawer
└── index.ts
```

#### 3f. **common/** (root level)

Display and utility components.

```
common/
├── empty-state.tsx              # No data state
├── status-badge.tsx             # Status indicators
├── percentage-badge.tsx         # Percentage display
├── workflow-status-badge.tsx    # Workflow status
├── dashboard-stats-grid.tsx     ⭐ Stats grid
├── quick-actions-card.tsx       ⭐ Quick actions
├── recent-activity-card.tsx     ⭐ Activity feed
├── review-timeline.tsx
├── task-card.tsx
└── index.ts
```

**Example:**
```tsx
import { 
  DashboardStatsGrid,
  QuickActionsCard,
  RecentActivityCard,
  EmptyState,
  WorkflowStatusBadge
} from "@/components/common"
```

---

## 🎣 Hooks Organization

### Location: `hooks/`

```
hooks/
├── use-list-detail-page.ts  ⭐ Unified page state
├── use-data-filters.ts      # Data filtering
├── use-selection.ts         # Item selection
├── use-page-search.ts       # Search state
├── use-page-filters.ts      # Filter state
├── use-page-state.ts        # Page state
├── use-attachments.ts       # Attachment handling
├── use-comments.ts          # Comments handling
├── use-reviews.ts           # Review operations
├── use-toast.ts             # Toast notifications
└── index.ts                 # Barrel exports
```

**Import pattern:**
```tsx
import { 
  useListDetailPage, 
  useDataFilters, 
  useSelection,
  useToast 
} from "@/hooks"
```

---

## 🎯 Component Selection Guide

### "Which component should I use?"

#### For Page Layouts:
```
Need a list-detail page? → ListDetailPageLayout
Need a dashboard? → DashboardLayout
Need basic page? → PageLayout
Need dual sidebar? → DualSidebarLayout
```

#### For Displaying Stats:
```
Dashboard stats grid? → DashboardStatsGrid
Single stat card? → DashboardStatCard
Multiple stats? → StatsGrid (from panels)
```

#### For User Actions:
```
Quick actions list? → QuickActionsCard
Single button? → Button (from ui/)
Form submission? → RatingForm or custom form
```

#### For Displaying Data:
```
List of items? → Feature-specific view (ReviewView, etc.)
Filters needed? → DataFilterBar
Empty state? → EmptyState
Activity feed? → RecentActivityCard
```

#### For Forms:
```
Complete rating form? → RatingForm
Grade selection? → GradeSelect
Custom form field? → FormInput, FormSelect, etc.
```

---

## 📖 Common Patterns

### Pattern 1: List-Detail Page

```tsx
"use client"

import { useState } from "react"
import { ListDetailPageLayout } from "@/components/layouts"
import { useListDetailPage } from "@/hooks"
import { YourItemView } from "@/components/features/your-feature"
import { YourActionPanel } from "@/components/features/your-feature"

export default function YourPage() {
  const [data] = useState(yourData)
  
  const pageState = useListDetailPage({
    data,
    searchFields: ['name', 'type'],
    getItemId: (item) => item.id
  })
  
  return (
    <ListDetailPageLayout
      {...pageState}
      searchPlaceholder="Search..."
      filters={filterConfigs}
      listContent={<YourItemView items={pageState.filteredData} />}
      detailContent={<YourActionPanel item={pageState.selectedItem} />}
      emptyStateConfig={emptyConfig}
    />
  )
}
```

### Pattern 2: Dashboard Page

```tsx
"use client"

import { useMemo } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { 
  DashboardStatsGrid, 
  QuickActionsCard,
  type DashboardStat 
} from "@/components/common"
import { useRouter } from "next/navigation"

export default function YourDashboard() {
  const router = useRouter()
  
  const stats: DashboardStat[] = useMemo(() => [
    {
      title: "Total Items",
      value: 100,
      subtitle: "Description",
      icon: IconComponent,
      onClick: () => router.push('/path')
    }
  ], [router])
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Title
        </h1>
        
        <DashboardStatsGrid stats={stats} columns={4} />
        
        <QuickActionsCard
          title="Quick Actions"
          actions={quickActions}
        />
      </div>
    </DashboardLayout>
  )
}
```

### Pattern 3: Feature Component

```tsx
// components/features/your-feature/your-view.tsx

import { YourItem } from "./your-item"

interface YourViewProps {
  items: YourType[]
  selectedItem: YourType | null
  onSelect: (item: YourType) => void
  viewMode?: "list" | "card"
}

export function YourView({ items, selectedItem, onSelect, viewMode = "list" }: YourViewProps) {
  if (viewMode === "card") {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map(item => (
          <YourItem 
            key={item.id} 
            item={item}
            selected={selectedItem?.id === item.id}
            onClick={() => onSelect(item)}
          />
        ))}
      </div>
    )
  }
  
  return (
    <div className="space-y-2">
      {items.map(item => (
        <YourItem 
          key={item.id} 
          item={item}
          selected={selectedItem?.id === item.id}
          onClick={() => onSelect(item)}
        />
      ))}
    </div>
  )
}
```

---

## 🎨 Styling Standards

### Colors - Always Use Theme Variables

```tsx
// ✅ GOOD - Theme aware
className="text-primary"
className="bg-muted"
className="border-destructive"
variant="success"

// ❌ BAD - Hardcoded
className="text-blue-500"
className="bg-gray-100"
className="border-red-500"
style={{ color: '#3B82F6' }}
```

### Spacing - Standard Tailwind

```tsx
// ✅ GOOD - Standard utilities
className="space-y-6"
className="gap-4"
className="p-6"

// ❌ BAD - Complex responsive
className="p-3 sm:p-4 md:p-6 lg:p-8"
className="gap-3 sm:gap-4 md:gap-6"
```

### Animations - Keep Simple

```tsx
// ✅ GOOD - Standard transitions
className="transition-all duration-200"
className="hover:scale-[1.02]"

// ❌ BAD - Custom keyframes
className="animate-gradient-wave"
className="animate-blob-float"
```

---

## 🔍 Component Lookup Table

| I need to... | Use this component | Location |
|--------------|-------------------|----------|
| Show dashboard stats | `DashboardStatsGrid` | `@/components/common` |
| Create list-detail page | `ListDetailPageLayout` | `@/components/layouts` |
| Add quick actions | `QuickActionsCard` | `@/components/common` |
| Show recent activity | `RecentActivityCard` | `@/components/common` |
| Display filters | `DataFilterBar` | `@/components/common/data-display` |
| Show empty state | `EmptyState` | `@/components/common` |
| Add rating form | `RatingForm` | `@/components/common/forms` |
| Show attachments | `AttachmentsSection` | `@/components/common/documents` |
| Display comments | `CommentsSection` | `@/components/common/documents` |
| Show status badge | `WorkflowStatusBadge` | `@/components/common` |

---

## 🚀 Quick Start Examples

### Example 1: New Dashboard with Stats

```tsx
"use client"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { DashboardStatsGrid, type DashboardStat } from "@/components/common"
import { FileText, CheckCircle } from "lucide-react"

export default function MyDashboard() {
  const stats: DashboardStat[] = [
    {
      title: "Total Items",
      value: 42,
      subtitle: "All time",
      icon: FileText,
      onClick: () => console.log('clicked')
    },
    {
      title: "Completed",
      value: 30,
      subtitle: "This month",
      icon: CheckCircle,
      variant: "success"
    }
  ]
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <DashboardStatsGrid stats={stats} columns={4} />
      </div>
    </DashboardLayout>
  )
}
```

### Example 2: New List-Detail Page

```tsx
"use client"

import { ListDetailPageLayout } from "@/components/layouts"
import { useListDetailPage } from "@/hooks"

export default function MyListPage() {
  const pageState = useListDetailPage({
    data: myData,
    searchFields: ['name'],
    getItemId: (item) => item.id
  })
  
  return (
    <ListDetailPageLayout
      {...pageState}
      searchPlaceholder="Search items..."
      filters={[]}
      listContent={<div>Your list here</div>}
      detailContent={<div>Your detail here</div>}
      emptyStateConfig={{
        icon: FileText,
        title: "No Selection",
        description: "Select an item"
      }}
    />
  )
}
```

---

## 🎯 Best Practices

### 1. **Always Use Barrel Imports**

```tsx
// ✅ GOOD
import { ReviewView, ReviewActionPanel } from "@/components/features/reviews"
import { DashboardStatsGrid } from "@/components/common"

// ❌ AVOID
import { ReviewView } from "@/components/features/reviews/review-view"
import { DashboardStatsGrid } from "@/components/common/dashboard-stats-grid"
```

### 2. **Use Type Imports**

```tsx
// ✅ GOOD
import { type DashboardStat } from "@/components/common"

// ❌ AVOID
import { DashboardStat } from "@/components/common" // Runtime import for type
```

### 3. **Keep Components Focused**

```tsx
// ✅ GOOD - Single responsibility
function ReviewItem({ review, onClick }) {
  return <div onClick={onClick}>...</div>
}

// ❌ AVOID - Too many responsibilities
function ReviewItem({ review, onEdit, onDelete, onAssign, onComment }) {
  // Too complex
}
```

### 4. **Use Proper Variants**

```tsx
// ✅ GOOD
<DashboardStatCard variant="success" />
<DashboardStatCard variant="warning" />
<DashboardStatCard variant="destructive" />

// ❌ AVOID
<DashboardStatCard className="text-green-600" />
<DashboardStatCard className="text-red-600" />
```

---

## 📋 Component Props Reference

### DashboardStatsGrid

```tsx
interface DashboardStat {
  title: string              // Stat title
  value: string | number     // Main value
  subtitle?: string | ReactNode // Description
  icon: LucideIcon          // Icon component
  variant?: "default" | "success" | "warning" | "destructive"
  onClick?: () => void      // Click handler
}

<DashboardStatsGrid 
  stats={DashboardStat[]}
  columns={2 | 3 | 4 | 5}
  className?: string
/>
```

### ListDetailPageLayout

```tsx
<ListDetailPageLayout
  // Search
  searchTerm={string}
  searchPlaceholder={string}
  onSearchChange={(term: string) => void}
  
  // Filters
  filters={FilterConfig[]}
  filterValues={Record<string, string>}
  onFilterChange={(key: string, value: string) => void}
  hasActiveFilters={boolean}
  onClearFilters={() => void}
  
  // View
  viewMode="list" | "card"
  onViewModeChange={(mode) => void}
  showViewToggle={boolean}
  
  // Content
  listContent={ReactNode}
  detailContent={ReactNode}
  emptyStateConfig={EmptyStateConfig}
  
  // Optional
  resultCount={number}
  totalCount={number}
  detailScrollable={boolean}
  showSidebar={boolean}
/>
```

### QuickActionsCard

```tsx
interface QuickAction {
  title: string
  description: string
  icon: LucideIcon
  onClick: () => void
  variant?: "default" | "success" | "warning" | "destructive"
}

<QuickActionsCard
  title={string}
  description?={string}
  actions={QuickAction[]}
  className?={string}
/>
```

---

## 🔧 Troubleshooting

### Import Errors

**Problem:** "Cannot find module"
**Solution:** Check the new import paths:
```tsx
// Old
import { X } from "@/components/shared/x"
import { Y } from "@/components/reviews/y"

// New
import { X } from "@/components/common"
import { Y } from "@/components/features/reviews"
```

### Type Errors

**Problem:** Type mismatch
**Solution:** Import types from index:
```tsx
import { type DashboardStat } from "@/components/common"
import { type FilterConfig } from "@/components/common/data-display"
```

### Styling Issues

**Problem:** Colors not showing
**Solution:** Use variants instead of hardcoded colors:
```tsx
// Old
className="text-blue-500"

// New
variant="default"  // or use theme classes
className="text-primary"
```

---

## 📚 Additional Resources

### Documentation
- See `REFACTORING_SUMMARY.md` for architecture overview
- See `REFACTORING_CHANGES.md` for detailed changes
- See `DASHBOARD_REFACTORING.md` for dashboard specifics
- See `BEFORE_AFTER_COMPARISON.md` for visual comparisons

### Key Files
- `components/layouts/list-detail-page-layout.tsx` - Main template
- `hooks/use-list-detail-page.ts` - Main hook
- `components/common/index.ts` - All common components
- `lib/constants/index.ts` - Constants and types

---

## ✅ Checklist for New Components

When creating new components:

- [ ] Place in correct directory (layouts/features/common)
- [ ] Export from index.ts
- [ ] Use TypeScript interfaces
- [ ] Use theme variables (no hardcoded colors)
- [ ] Use standard Tailwind utilities
- [ ] Add proper types
- [ ] Make it reusable
- [ ] Document complex props
- [ ] Follow shadcn patterns
- [ ] Test in both light/dark mode

---

## 🎊 You're All Set!

Your codebase is now:
- ✅ Fully organized
- ✅ Highly reusable
- ✅ Shadcn/ui compliant
- ✅ Theme-aware
- ✅ Type-safe
- ✅ Well-documented
- ✅ Production-ready

Happy coding! 🚀

