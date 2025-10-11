# DataItemCard Migration Guide

Complete guide for refactoring item components to use the universal `DataItemCard` component.

## Overview

The `DataItemCard` component eliminates hardcoded list/card view logic by providing a single, configurable component for all item types.

---

## Before vs After

### ❌ Before (Hardcoded)

```tsx
// member-firm-item.tsx - 340+ lines of duplicated code
export function MemberFirmItem({ memberFirm, viewMode, ... }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (viewMode === "list") {
    return (
      <Card className="...">
        <CardContent className="p-3">
          <div className="space-y-3">
            {/* 150+ lines of hardcoded JSX */}
            <Avatar>...</Avatar>
            <div>...</div>
            <Button onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronUp /> : <ChevronDown />}
            </Button>
            {isExpanded && <div>{/* Expandable content */}</div>}
          </div>
        </CardContent>
      </Card>
    )
  }
  
  // Card view - another 150+ lines of similar JSX
  return <Card>...</Card>
}
```

### ✅ After (Reusable Component)

```tsx
// member-firm-item.tsx - ~80 lines, no layout duplication
import { DataItemCard } from "@/components/shared/data-item-card"

export function MemberFirmItem({ memberFirm, viewMode, ... }) {
  return (
    <DataItemCard
      viewMode={viewMode}
      avatar={<Avatar>...</Avatar>}
      title={memberFirm.name}
      subtitle={memberFirm.location}
      badges={<div>{/* Badges */}</div>}
      secondaryInfo={<div>{/* Desktop info */}</div>}
      mobileInfo={<div>{/* Mobile info */}</div>}
      expandableContent={<div>{/* Expandable details */}</div>}
      alwaysVisibleContent={<div>{/* Always visible in card */}</div>}
      dropdownActions={[...]}
    />
  )
}
```

---

## Complete Example: Member Firm Item

```tsx
"use client"

import { DataItemCard } from "@/components/shared/data-item-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Star, Trash2, Users, Building, Calendar, Mail, Phone, MapPin } from "lucide-react"
import { type MemberFirm, getStatusColor, getTypeColor, ... } from "@/lib/member-firms-mock-data"

interface MemberFirmItemProps {
  memberFirm: MemberFirm
  viewMode: "list" | "card"
  onView?: (firm: MemberFirm) => void
  onEdit?: (firm: MemberFirm) => void
  onDelete?: (firm: MemberFirm) => void
  onReview?: (firm: MemberFirm) => void
}

export function MemberFirmItem({ memberFirm, viewMode, onView, onEdit, onDelete, onReview }: MemberFirmItemProps) {
  return (
    <DataItemCard
      viewMode={viewMode}
      
      // Avatar
      avatar={
        <Avatar className={viewMode === "list" ? "h-8 w-8" : "h-10 w-10"}>
          <AvatarImage src={memberFirm.avatar} alt={memberFirm.name} />
          <AvatarFallback className={`${generateFirmAvatarColor(memberFirm.name)} text-xs font-semibold`}>
            {generateFirmInitials(memberFirm.name)}
          </AvatarFallback>
        </Avatar>
      }
      
      // Title & Subtitle
      title={memberFirm.name}
      subtitle={memberFirm.location}
      
      // Badges (card view)
      badges={
        <div className="flex flex-wrap gap-1">
          <Badge className={`${getStatusColor(memberFirm.status)} text-xs px-2 py-0.5`}>
            {memberFirm.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
          <Badge className={`${getTypeColor(memberFirm.type)} text-xs px-2 py-0.5`}>
            {getTypeLabel(memberFirm.type)}
          </Badge>
          <Badge className={`${getRiskLevelColor(memberFirm.riskLevel)} text-xs px-2 py-0.5`}>
            {memberFirm.riskLevel.toUpperCase()} RISK
          </Badge>
        </div>
      }
      
      // Secondary info (list view - desktop only)
      secondaryInfo={
        <>
          <div className="flex items-center gap-2 bg-white dark:bg-neutral-900/50 px-2 py-1 rounded-md">
            <Star className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
            <span className={`font-medium text-xs ${getComplianceScoreColor(memberFirm.complianceScore)}`}>
              {memberFirm.complianceScore}%
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Badge className={`${getStatusColor(memberFirm.status)} text-xs px-2 py-0.5`}>
              {memberFirm.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
            <Badge className={`${getTypeColor(memberFirm.type)} text-xs px-2 py-0.5`}>
              {getTypeLabel(memberFirm.type)}
            </Badge>
          </div>
        </>
      }
      
      // Mobile info (list view - mobile only)
      mobileInfo={
        <>
          <div className="flex items-center gap-2 bg-white dark:bg-neutral-900/50 px-2 py-1 rounded-md">
            <Star className="h-3 w-3 text-neutral-500" />
            <span className={`font-medium text-xs ${getComplianceScoreColor(memberFirm.complianceScore)}`}>
              {memberFirm.complianceScore}%
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Badge className={`${getStatusColor(memberFirm.status)} text-xs`}>
              {memberFirm.status}
            </Badge>
          </div>
        </>
      }
      
      // Always visible content (card view)
      alwaysVisibleContent={
        <div className="space-y-1">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Specializations</div>
          <div className="flex flex-wrap gap-1">
            {memberFirm.specializations.slice(0, 2).map((spec, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                {spec}
              </Badge>
            ))}
          </div>
        </div>
      }
      
      // Expandable content
      expandableContent={
        <>
          {/* Specializations - Full list */}
          <div className="space-y-1">
            <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">All Specializations</div>
            <div className="flex flex-wrap gap-1">
              {memberFirm.specializations.map((spec, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-neutral-500">
                <Users className="h-3 w-3" />
                <span className="font-medium">Employees</span>
              </div>
              <div className="font-medium">{memberFirm.employeeCount}</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-neutral-500">
                <Building className="h-3 w-3" />
                <span className="font-medium">Partners</span>
              </div>
              <div className="font-medium">{memberFirm.partnerCount}</div>
            </div>
          </div>
          
          {/* Contact */}
          <div className="space-y-1">
            <div className="text-xs text-neutral-500 font-medium">Contact</div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs">
                <Mail className="h-3 w-3" />
                <span className="truncate">{memberFirm.contactEmail}</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Phone className="h-3 w-3" />
                <span>{memberFirm.contactPhone}</span>
              </div>
            </div>
          </div>
        </>
      }
      
      // Primary action
      primaryAction={{
        icon: <Eye className="h-3 w-3" />,
        label: "Review",
        onClick: () => onReview?.(memberFirm)
      }}
      
      // Dropdown actions
      dropdownActions={[
        {
          icon: <Eye className="mr-2 h-4 w-4" />,
          label: "View Details",
          onClick: () => onView?.(memberFirm)
        },
        {
          icon: <Edit className="mr-2 h-4 w-4" />,
          label: "Edit Firm",
          onClick: () => onEdit?.(memberFirm)
        },
        {
          icon: <Star className="mr-2 h-4 w-4" />,
          label: "Schedule Review",
          onClick: () => onReview?.(memberFirm)
        },
        {
          icon: <Trash2 className="mr-2 h-4 w-4" />,
          label: "Delete",
          onClick: () => onDelete?.(memberFirm),
          variant: "destructive"
        }
      ]}
    />
  )
}
```

---

## Migration Steps

### Step 1: Import DataItemCard

```tsx
import { DataItemCard } from "@/components/shared/data-item-card"
```

### Step 2: Remove Hardcoded Logic

**Remove:**
- `if (viewMode === "list")` conditionals
- `if (viewMode === "card")` conditionals
- Manual `isExpanded` state management
- Hardcoded Card/CardHeader/CardContent structures
- Duplicate chevron button logic

### Step 3: Configure via Props

Map your existing content to DataItemCard props:

| Your Content | DataItemCard Prop |
|--------------|------------------|
| Avatar component | `avatar` |
| Item name/title | `title` |
| Subtitle/location | `subtitle` |
| Status badges | `badges` |
| Desktop-only info | `secondaryInfo` |
| Mobile-only info | `mobileInfo` |
| Hidden details | `expandableContent` |
| Card always-visible | `alwaysVisibleContent` |
| Main action button | `primaryAction` |
| Menu items | `dropdownActions` |

### Step 4: Test Both Views

Verify functionality in:
- ✅ List view (collapsed & expanded)
- ✅ Card view (collapsed & expanded)
- ✅ Mobile responsive
- ✅ Desktop view

---

## Benefits

### Code Reduction

| Component | Before (lines) | After (lines) | Saved |
|-----------|----------------|---------------|-------|
| MemberFirmItem | ~340 | ~80 | 260 lines |
| ReviewerItem | ~350 | ~80 | 270 lines |
| ReviewItem | ~450 | ~100 | 350 lines |
| **Total** | **~1140** | **~260** | **880 lines** |

### Maintainability

**Before:** Update 3+ files for UI changes  
**After:** Update 1 component, applies everywhere

### Consistency

**Before:** Manual synchronization needed  
**After:** Auto-consistent across all item types

### Features

- ✅ Built-in expand/collapse
- ✅ Automatic layout handling
- ✅ Mobile responsive
- ✅ Selection state
- ✅ Dropdown menus
- ✅ Primary actions
- ✅ Smooth animations

---

## Next Steps

To complete the refactoring:

1. Refactor `ReviewItem` to use `DataItemCard`
2. Refactor `MemberFirmItem` to use `DataItemCard`
3. Refactor `ReviewerItem` to use `DataItemCard`
4. Remove all hardcoded list/card view conditionals
5. Test all pages for consistency

---

## Consistency Standards

### ✅ **Expand/Collapse Click Area**
- **MUST** include avatar, name, and subtitle
- Wrap in `<div>` with `onClick` handler
- Classes: `flex items-center gap-3 flex-1 min-w-0 cursor-pointer group`
- Provides visual feedback on hover

### ✅ **Chevron Placement (List View)**
- **MUST** be inline with the title (left side)
- Changed from Button to simple `<div>` (no clickable button)
- Classes: `h-5 w-5 p-0 flex-shrink-0 flex items-center justify-center`
- Color: `text-neutral-500 group-hover:text-neutral-700`

### ✅ **Hover Effects**
- Title: `group-hover:text-primary transition-colors`
- Subtitle: `group-hover:text-neutral-500 transition-colors`
- Chevron: `group-hover:text-neutral-700 transition-colors`
- Entire area responds to hover as a group

### ✅ **Chevron Placement (Card View)**
- **NO** chevron in header
- **MUST** have "Show More/Show Less" button at bottom
- Position: Left side of actions row
- Classes: `h-6 px-2 text-xs`
- Label: "Show More" / "Show Less" with chevron icon

### ✅ **Action Buttons (Card View)**
- Layout: `flex justify-between items-center`
- Left: "Show More/Show Less" button
- Right: Action buttons (wrapped in flex gap-1)
- Example:
  ```tsx
  <div className="flex justify-between items-center pt-1">
    <Button variant="ghost" size="sm">
      {isExpanded ? <><ChevronUp /> Show Less</> : <><ChevronDown /> Show More</>}
    </Button>
    <div className="flex gap-1">
      {/* Action buttons */}
    </div>
  </div>
  ```

### ✅ **Expand Animation**
- Use: `transition-all duration-300 overflow-hidden`
- Expanded: `max-h-96 opacity-100`
- Collapsed: `max-h-0 opacity-0`
- **NOT** using `animate-in slide-in-from-top`

### ✅ **Border Separator**
- Always use: `border-t border-neutral-200 dark:border-neutral-700 pt-3`
- Consistent spacing: `space-y-3`

## Notes

- The `width` prop in filters is now optional - component auto-sizes
- All expand/collapse state is managed internally
- Dropdown actions support destructive variant for delete actions
- Avatar sizing can be responsive using viewMode prop
- Chevron MUST be inline with title for consistency
- Animation uses max-height transition for smooth expand/collapse

