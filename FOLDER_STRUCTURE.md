# QA Review Application - Folder Structure

## Production-Ready Organization

This document explains the folder structure optimized for scalability, maintainability, and production deployment.

```
qa-review-cn/
│
├── app/                          # Next.js 15 App Router
│   ├── (auth)/                   # Auth layout group
│   │   └── login/
│   │
│   ├── admin/                    # Admin role pages
│   │   ├── dashboard/
│   │   ├── reviews/
│   │   ├── reviewers/
│   │   ├── member-firms/
│   │   ├── final-reviews/
│   │   ├── users/
│   │   ├── settings/
│   │   └── workflow/            # NEW: Admin omnipotent interface
│   │
│   ├── reviewer/                 # Reviewer role pages
│   │   ├── dashboard/
│   │   └── reviews/
│   │
│   ├── director/                 # Technical Director pages
│   │   ├── dashboard/
│   │   └── reviews/
│   │
│   ├── ceo/                      # CEO pages
│   │   ├── dashboard/
│   │   └── final-reviews/
│   │
│   ├── firm/                     # Member Firm pages
│   │   └── dashboard/
│   │
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   ├── reviews/
│   │   ├── comments/
│   │   └── attachments/
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/                   # React Components
│   ├── ui/                       # ShadCN UI primitives
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   └── ...
│   │
│   ├── shared/                   # Shared/common components
│   │   ├── admin-page-layout.tsx
│   │   ├── attachments-section.tsx
│   │   ├── percentage-badge.tsx
│   │   ├── status-badge.tsx
│   │   ├── empty-state.tsx
│   │   └── ...
│   │
│   ├── reviews/                  # Review-specific components
│   │   ├── workflow/             # NEW: Workflow components (organized by stage)
│   │   │   ├── acceptance/
│   │   │   │   ├── acceptance-card.tsx
│   │   │   │   └── acceptance-dialog.tsx
│   │   │   │
│   │   │   ├── assignment/
│   │   │   │   ├── review-assign-drawer.tsx (moved)
│   │   │   │   └── assignment-form.tsx
│   │   │   │
│   │   │   ├── submission/
│   │   │   │   ├── reviewer-submission-form.tsx
│   │   │   │   └── file-upload-section.tsx
│   │   │   │
│   │   │   ├── verification/
│   │   │   │   ├── td-verification-screen.tsx
│   │   │   │   └── rating-comparison.tsx
│   │   │   │
│   │   │   ├── finalization/
│   │   │   │   ├── ceo-final-review.tsx
│   │   │   │   └── final-decision-form.tsx
│   │   │   │
│   │   │   └── shared/
│   │   │       ├── workflow-status-tracker.tsx  # Visual stepper
│   │   │       ├── workflow-status-badge.tsx
│   │   │       ├── rating-display.tsx
│   │   │       └── document-category-badge.tsx
│   │   │
│   │   ├── review-list-view.tsx
│   │   ├── review-card-view.tsx
│   │   ├── review-detail-panel.tsx
│   │   ├── review-action-panel.tsx
│   │   └── ...
│   │
│   ├── reviewers/                # Reviewer management components
│   │   └── reviewer-item.tsx
│   │
│   ├── member-firms/             # Member firm components
│   │   ├── member-firm-item.tsx
│   │   └── member-firm-review-dialog.tsx
│   │
│   ├── dashboard-header.tsx
│   ├── app-sidebar.tsx
│   └── ...
│
├── types/                        # TypeScript Type Definitions
│   ├── entities.ts               # Core business entities (Review, Reviewer, Firm, etc.)
│   ├── workflow.ts               # ✨ NEW: Workflow-specific types
│   │                             # - ReviewWorkflowStatus
│   │                             # - WorkflowStage
│   │                             # - AcceptanceTracking
│   │                             # - ReviewerRating
│   │                             # - TechnicalDirectorVerification
│   │                             # - CEOFinalReview
│   │                             # - CategorizedDocument
│   │                             # - WorkflowHistoryEntry
│   │                             # - All workflow actions
│   │
│   ├── api.ts                    # API request/response types (future)
│   └── next-auth.d.ts
│
├── lib/                          # Business Logic & Utilities
│   ├── constants/
│   │   └── index.ts              # ✅ UPDATED: All app constants
│   │                             # - Review types, modes, statuses
│   │                             # - Workflow statuses & stages
│   │                             # - Color schemes for workflow
│   │                             # - Document category colors
│   │
│   ├── services/                 # ✨ NEW: Business logic services
│   │   ├── workflow-service.ts   # Workflow state management
│   │   │                         # - assignReview()
│   │   │                         # - acceptReview()
│   │   │                         # - rejectReview()
│   │   │                         # - submitReview()
│   │   │                         # - verifyReview()
│   │   │                         # - finalizeReview()
│   │   │                         # - getPermissions()
│   │   │
│   │   ├── notification-service.ts  # Email/notification handling
│   │   │                            # - send()
│   │   │                            # - sendAssignmentNotifications()
│   │   │                            # - sendAcceptanceConfirmation()
│   │   │                            # - sendCompletionNotifications()
│   │   │
│   │   ├── review-service.ts     # Review CRUD operations (future)
│   │   └── analytics-service.ts  # Analytics & reporting (future)
│   │
│   ├── utils/                    # Utility functions
│   │   ├── formatters.ts         # Date, number, string formatters
│   │   ├── validators.ts         # Form & data validation
│   │   └── review-utils.ts       # Review-specific utilities
│   │
│   ├── schemas/                  # Validation schemas (Zod - future)
│   │   ├── review-schema.ts
│   │   └── user-schema.ts
│   │
│   ├── api/                      # API client functions
│   │   ├── reviews.ts
│   │   ├── users.ts
│   │   └── attachments.ts
│   │
│   ├── auth.ts                   # NextAuth configuration
│   ├── env.ts
│   ├── navigation.ts
│   ├── utils.ts
│   ├── mock-data.ts              # Mock data (to be updated)
│   ├── reviewers-mock-data.ts
│   └── member-firms-mock-data.ts
│
├── hooks/                        # Custom React Hooks
│   ├── use-data-filters.ts       # ✅ Generic filtering hook
│   ├── use-selection.ts          # ✅ Generic selection hook
│   ├── use-workflow.ts           # NEW: Workflow state management (future)
│   ├── use-reviews.ts
│   ├── use-attachments.ts
│   ├── use-comments.ts
│   ├── use-toast.ts
│   └── ...
│
├── public/                       # Static assets
│   └── ...
│
├── docs/                         # Documentation
│   ├── architecture/
│   │   ├── ARCHITECTURE.md
│   │   ├── API_DOCUMENTATION.md
│   │   ├── DATABASE_SCHEMA.md
│   │   └── REUSABLE_COMPONENTS.md
│   │
│   ├── features/
│   │   ├── WORKFLOW_ANALYSIS.md    # ✨ NEW: Complete workflow guide
│   │   ├── FEATURES_SUMMARY.md
│   │   └── ...
│   │
│   └── guides/
│       ├── SETUP.md
│       ├── START_HERE.md
│       └── PRODUCTION_GUIDE.md
│
├── REFACTORING_COMPLETE.md       # Latest refactoring summary
├── FOLDER_STRUCTURE.md            # This file
└── ...
```

---

## Key Organizational Principles

### 1. **Separation of Concerns**
- **Types** - Pure TypeScript types and interfaces
- **Services** - Business logic (workflow, notifications, etc.)
- **Utils** - Pure utility functions
- **Hooks** - React-specific stateful logic
- **Components** - UI presentation

### 2. **Feature-Based Grouping**
- Components organized by domain (reviews, reviewers, firms)
- Workflow components further organized by stage
- Makes it easy to find related code

### 3. **Scalability**
- Services can be easily swapped with real API calls
- Mock data can be replaced with real database
- Types are centralized and reusable
- Hooks are generic and reusable

### 4. **Production-Ready**
- Clear separation between development (mock) and production code
- Service layer abstracts implementation details
- Easy to add new features without touching existing code

---

## New Additions (Phase 1)

### ✨ Types Layer
```
types/
├── entities.ts     # UPDATED: Enhanced Review interface with workflow fields
└── workflow.ts     # NEW: Complete workflow type system (500+ lines)
```

### ✨ Constants Layer
```
lib/constants/
└── index.ts       # UPDATED: Workflow statuses, stages, colors
```

### ✨ Services Layer
```
lib/services/
├── workflow-service.ts      # NEW: Workflow state machine
└── notification-service.ts  # NEW: Email/notification handler
```

---

## Component Organization Strategy

### Current Structure (Flat)
```
components/reviews/
├── review-list-view.tsx
├── review-card-view.tsx
├── review-assign-drawer.tsx
├── review-detail-panel.tsx
└── ...
```

### Recommended Structure (Feature-Based) - FUTURE
```
components/reviews/
├── workflow/                    # Workflow-specific components
│   ├── assignment/
│   ├── acceptance/
│   ├── submission/
│   ├── verification/
│   ├── finalization/
│   └── shared/
│
├── listing/                     # List/display components
│   ├── review-list-view.tsx
│   ├── review-card-view.tsx
│   └── review-filters.tsx
│
└── detail/                      # Detail view components
    ├── review-detail-panel.tsx
    └── review-action-panel.tsx
```

---

## Data Flow

```
┌─────────────┐
│   UI Layer  │  Components call hooks
│ (Components)│
└──────┬──────┘
       │
┌──────▼──────┐
│  Hooks Layer│  Hooks call services
│   (Custom)  │
└──────┬──────┘
       │
┌──────▼──────┐
│Services Layer│  Services handle business logic
│ (Workflow,   │  Uses types for type safety
│Notification) │
└──────┬──────┘
       │
┌──────▼──────┐
│  API Layer  │  API calls (mock for now)
│(Future: Real)│
└──────┬──────┘
       │
┌──────▼──────┐
│  Database   │  PostgreSQL/Prisma (future)
│  (Future)   │
└─────────────┘
```

---

## Import Strategy

### Best Practices

✅ **Good**:
```typescript
// Use barrel exports from types
import type { Review, Reviewer } from '@/types/entities'
import type { ReviewWorkflowStatus } from '@/types/workflow'

// Use constants
import { WORKFLOW_STATUS, WORKFLOW_STATUS_COLORS } from '@/lib/constants'

// Use services
import { WorkflowService } from '@/lib/services/workflow-service'

// Use utilities
import { formatDate, formatFileSize } from '@/lib/utils/formatters'
```

❌ **Avoid**:
```typescript
// Don't hardcode values
const status = 'in_progress' // Use WORKFLOW_STATUS.IN_PROGRESS.value

// Don't duplicate logic
function formatDate(date) { ... } // Use utility from formatters

// Don't inline business logic
const canSubmit = review.status === 'accepted' // Use WorkflowService.getPermissions()
```

---

## Migration Path (Current → Future)

### Phase 1: ✅ COMPLETE
- Types system created
- Constants centralized
- Services layer created
- No component changes yet (backward compatible)

### Phase 2: IN PROGRESS
- Update mock data with workflow fields
- Create workflow UI components
- Components start using services

### Phase 3: FUTURE
- Reorganize components by feature
- Add real API layer
- Replace mocks with database

---

## Benefits of This Structure

1. **Easy to Find Code**
   - Types? Check `types/`
   - Business logic? Check `lib/services/`
   - UI? Check `components/`

2. **Easy to Test**
   - Services are pure functions (easy to unit test)
   - Hooks can be tested with React Testing Library
   - Components can be tested with Storybook

3. **Easy to Scale**
   - Add new workflow stage? Create folder in `components/reviews/workflow/`
   - Add new service? Create in `lib/services/`
   - Add new role? Create in `app/{role}/`

4. **Easy to Maintain**
   - Change business logic? Update service
   - Change types? TypeScript catches all usages
   - Change UI? Components are isolated

5. **Production-Ready**
   - Clear separation of concerns
   - Mock data can be easily replaced
   - Service layer ready for real APIs

---

**Next Steps**: Update mock data with realistic workflow scenarios →

