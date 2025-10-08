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

## Architecture Benefits

### ✅ **Reusability**
- Single source of truth for document viewing
- Timeline component works across all review stages
- No code duplication

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
│   └── status-badge.tsx          # Interactive status badges
└── reviews/
    ├── review-action-panel.tsx   # Uses document-viewer & timeline
    └── final-review-screen.tsx   # Uses document-viewer & timeline
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

