# QA Review Application - Workflow Analysis & Redesign Plan

## Application Purpose
Quality Assurance Review System for Member Firms with multi-stage approval workflow

## User Roles & Responsibilities

### 1. **Admin** (Superuser)
- Gets QA review data from Salesforce (using mock data for now)
- Assigns reviews to reviewers
- **Can perform ANY role's tasks** (key requirement)
- Receives email confirmations and feedback
- Has access to all screens and workflows

### 2. **Member Firms**
- Receives review assignment notifications
- Must **accept** the review assignment
- Confirmation sent via email to admin
- Views review progress and results

### 3. **Reviewers**
- Receives review assignment notifications
- Must **accept** the review assignment
- Downloads original files from admin
- Reviews the files offline
- **Re-uploads** reviewed files
- Provides rating (1-5 scale)
- Adds comments
- Submits for technical director review

### 4. **Technical Director** (Senior Reviewer)
- Reviews the reviewer's work
- Sees reviewer's rating (1-5)
- Can **verify or modify** the rating
- Provides verified rating
- Forwards to CEO for final review

### 5. **CEO** (Final Reviewer)
- Reviews both previous ratings (Reviewer + Technical Director)
- Provides **final rating**
- Can optionally upload **additional documents**
- Finalizes the review

---

## Required Workflow (4-Stage Process)

```
┌─────────────────────────────────────────────────────────────────┐
│ STAGE 1: ASSIGNMENT & ACCEPTANCE                                │
├─────────────────────────────────────────────────────────────────┤
│ 1. Admin creates review from Salesforce data                    │
│ 2. Admin assigns to Reviewer                                     │
│ 3. Email sent to: Reviewer + Member Firm                        │
│ 4. Reviewer accepts ✓                                           │
│ 5. Member Firm accepts ✓                                        │
│ 6. Confirmation emails sent to Admin                            │
│ Status: "Pending Acceptance" → "Accepted" → "In Progress"       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ STAGE 2: REVIEWER EVALUATION                                    │
├─────────────────────────────────────────────────────────────────┤
│ 1. Reviewer downloads original files                            │
│ 2. Reviews files offline                                        │
│ 3. Re-uploads reviewed files (marked/annotated)                 │
│ 4. Provides rating (1-5 scale)                                  │
│ 5. Adds comments/feedback                                       │
│ 6. Submits to Technical Director                                │
│ Status: "In Progress" → "Submitted for Verification"            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ STAGE 3: TECHNICAL DIRECTOR VERIFICATION                        │
├─────────────────────────────────────────────────────────────────┤
│ 1. Views reviewer's rating + comments                           │
│ 2. Reviews uploaded files                                       │
│ 3. Can modify rating if needed                                  │
│ 4. Provides verified rating (1-5 scale)                         │
│ 5. Adds verification notes                                      │
│ 6. Forwards to CEO                                              │
│ Status: "Submitted for Verification" → "Verified - Pending Final"│
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ STAGE 4: CEO FINAL REVIEW                                       │
├─────────────────────────────────────────────────────────────────┤
│ 1. Views all previous ratings:                                  │
│    - Reviewer Rating: X/5                                       │
│    - Technical Director Rating: Y/5                             │
│ 2. Reviews all documents                                        │
│ 3. Provides FINAL rating (1-5 scale)                            │
│ 4. Optionally uploads additional documents                      │
│ 5. Finalizes and closes review                                  │
│ Status: "Verified - Pending Final" → "Completed"                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Current State Analysis

### ✅ What We Have
1. **Admin Reviews Page** - Lists all reviews, filtering works
2. **Review Assignment Drawer** - Can assign reviewer with details
3. **Final Review Screen** - Basic CEO review functionality
4. **Member Firms Page** - List of member firms
5. **Reviewers Page** - List of reviewers
6. **Role-based Dashboards** - Separate for each role
7. **Document Management** - Upload/download attachments
8. **Refactored Foundation** - Constants, types, hooks (just completed!)

### ❌ What's Missing

#### 1. **Status Workflow is Incomplete**
**Current Statuses**: 'Completed' | 'Submitted' | 'In Progress' | 'Pending' | 'Overdue' | 'Cancelled' | 'Rejected'

**Need Additional Statuses**:
- `Pending Assignment` - Admin created, not assigned yet
- `Pending Acceptance` - Assigned, waiting for reviewer + firm acceptance
- `Reviewer Accepted` - Reviewer accepted, waiting for firm
- `Firm Accepted` - Firm accepted, waiting for reviewer
- `Accepted` - Both accepted, ready to start
- `In Progress` - Reviewer working on it ✓ (exists)
- `Submitted for Verification` - Reviewer submitted, TD to review
- `Verified - Pending Final` - TD verified, CEO to finalize
- `Completed` - CEO finalized ✓ (exists)
- `Rejected` - At any stage ✓ (exists)

#### 2. **Acceptance Flow**
- No UI for reviewer to accept/reject assignment
- No UI for member firm to accept/reject assignment
- No email integration/simulation
- No feedback loop to admin

#### 3. **Multi-Level Rating System**
**Current**: Single `currentGrade` field (1-5)

**Need**:
```typescript
interface Review {
  // Current
  currentGrade: '1' | '2' | '3' | '4' | '5' // Should be renamed to finalGrade
  
  // Add these:
  reviewerRating?: {
    grade: '1' | '2' | '3' | '4' | '5'
    comments: string
    submittedBy: string
    submittedAt: string
  }
  
  technicalDirectorRating?: {
    grade: '1' | '2' | '3' | '4' | '5'
    verifiedFrom: '1' | '2' | '3' | '4' | '5' // Original reviewer rating
    modified: boolean
    verificationNotes: string
    verifiedBy: string
    verifiedAt: string
  }
  
  ceoFinalRating?: {
    finalGrade: '1' | '2' | '3' | '4' | '5'
    reviewerGrade: string // Reference
    technicalDirectorGrade: string // Reference
    finalNotes: string
    additionalDocuments?: Document[]
    finalizedBy: string
    finalizedAt: string
  }
}
```

#### 4. **File Management Workflow**
**Current**: Basic upload/download

**Need**:
- Original files (from admin/Salesforce)
- Reviewed files (uploaded by reviewer - clearly marked)
- Additional documents (from CEO - optional)
- Clear separation and labeling

#### 5. **Admin Omnipotent Access**
**Current**: Admin only sees admin screens

**Need**: Admin dashboard with tabs/sections for:
- "As Admin" - Standard admin tasks
- "As Reviewer" - Can perform reviewer tasks on behalf
- "As Technical Director" - Can verify ratings on behalf
- "As CEO" - Can finalize reviews on behalf
- "As Member Firm" - Can accept on behalf

#### 6. **Email Notifications** (Simulation)
- Assignment notifications
- Acceptance confirmations
- Status change notifications
- Completion notifications

---

## Redesign Strategy

### Phase 1: Data Model Update (PRIORITY 1) 🔴

#### 1.1 Update Review Interface
**File**: `lib/mock-data.ts` or new `types/entities.ts`

```typescript
export interface ReviewRating {
  grade: '1' | '2' | '3' | '4' | '5'
  comments: string
  submittedBy: string
  submittedAt: string
}

export interface TechnicalDirectorVerification {
  grade: '1' | '2' | '3' | '4' | '5'
  originalReviewerGrade: '1' | '2' | '3' | '4' | '5'
  modified: boolean
  verificationNotes: string
  verifiedBy: string
  verifiedAt: string
}

export interface CEOFinalReview {
  finalGrade: '1' | '2' | '3' | '4' | '5'
  reviewerGrade: string
  technicalDirectorGrade: string
  finalNotes: string
  additionalDocuments?: Document[]
  finalizedBy: string
  finalizedAt: string
}

export interface ReviewAcceptance {
  reviewerAccepted: boolean
  reviewerAcceptedAt?: string
  firmAccepted: boolean
  firmAcceptedAt?: string
}

export interface Review {
  // Existing fields
  id: string
  memberFirm: string
  type: 'Current Member' | 'Prospect'
  reviewer: string
  country: string
  startDate: string
  endDate: string
  
  // Update status type
  status: ReviewStatus
  
  // Original documents from Salesforce
  originalDocuments: Document[]
  
  // Acceptance tracking
  acceptance?: ReviewAcceptance
  
  // Multi-stage ratings
  reviewerRating?: ReviewRating
  technicalDirectorVerification?: TechnicalDirectorVerification
  ceoFinalReview?: CEOFinalReview
  
  // Metadata
  assignedAt?: string
  assignedBy?: string
  lastUpdated: string
  
  // Legacy (for backward compatibility)
  currentGrade?: '1' | '2' | '3' | '4' | '5' // Maps to final grade
  documents?: Document[] // Combine all documents
}

export type ReviewStatus = 
  | 'Pending Assignment'
  | 'Pending Acceptance'
  | 'Reviewer Accepted'
  | 'Firm Accepted'
  | 'Accepted'
  | 'In Progress'
  | 'Submitted for Verification'
  | 'Verified - Pending Final'
  | 'Completed'
  | 'Overdue'
  | 'Cancelled'
  | 'Rejected'
```

#### 1.2 Update Constants
**File**: `lib/constants/index.ts`

Add new review statuses and workflow stages.

#### 1.3 Update Mock Data
Add realistic data with different workflow stages.

---

### Phase 2: Workflow Components (PRIORITY 2) 🟡

#### 2.1 Acceptance Screen
**New Component**: `components/reviews/review-acceptance-card.tsx`

For Reviewer & Member Firm to accept/reject assignments.

Features:
- Review details display
- Accept/Reject buttons
- Confirmation dialog
- Email simulation (toast notification)

#### 2.2 Reviewer Submission Screen
**Update**: `components/reviews/reviewer-submission-form.tsx`

Features:
- Download original files section (read-only)
- Upload reviewed files section
- Rating selector (1-5 with descriptions)
- Comments textarea
- Submit button
- Clear indication of uploaded vs original files

#### 2.3 Technical Director Verification Screen
**New Component**: `components/reviews/technical-director-verification.tsx`

Features:
- Display reviewer's rating prominently
- Show reviewer's comments
- Display all files (original + reviewed)
- Rating selector (1-5) - defaults to reviewer's rating
- "Modified from reviewer rating" indicator
- Verification notes textarea
- Forward to CEO button

#### 2.4 CEO Final Review Screen
**Update**: `components/reviews/final-review-screen.tsx` (already exists)

Features:
- Three-column rating display:
  - Reviewer Rating: X/5
  - Technical Director Rating: Y/5
  - Final Rating: [Selector]
- All documents viewer
- Optional additional documents upload
- Final notes textarea
- Finalize button (closes review)

---

### Phase 3: Admin Omnipotent Interface (PRIORITY 3) 🟢

#### 3.1 Admin Super Dashboard
**New Page**: `app/admin/workflow/page.tsx`

Tabbed interface:
```
┌─────────────────────────────────────────────────┐
│ [Admin] [Reviewer] [Tech Director] [CEO] [Firm] │
├─────────────────────────────────────────────────┤
│                                                 │
│  Content changes based on selected tab          │
│  Shows that role's tasks + ability to act       │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### 3.2 Workflow Status Tracker
**New Component**: `components/reviews/workflow-status-tracker.tsx`

Visual stepper showing:
1. ○ Assignment → 2. ○ Acceptance → 3. ○ Review → 4. ○ Verification → 5. ○ Final

With current stage highlighted.

---

### Phase 4: Email Notification System (PRIORITY 4) 🔵

#### 4.1 Notification Service
**New File**: `lib/services/notification-service.ts`

Simulated email service (toast + console log for now):
- Assignment notification
- Acceptance confirmation
- Submission notification
- Verification notification
- Completion notification

---

### Phase 5: UI/UX Polish (PRIORITY 5) ⚪

#### 5.1 Consistent Design System
- Status badges with colors matching workflow
- Grade badges (1-5) with color scale
- Document type icons
- Action buttons standardized
- Empty states for each screen

#### 5.2 Responsive Design
- Mobile-friendly layouts
- Touch-friendly controls
- Adaptive sidebars

#### 5.3 Loading & Error States
- Skeleton loaders
- Error boundaries
- Retry mechanisms

---

## Implementation Roadmap

### Week 1: Foundation
- [ ] Update data models (Review interface)
- [ ] Add new review statuses to constants
- [ ] Create comprehensive mock data with all workflow stages
- [ ] Update existing components to handle new data structure

### Week 2: Core Workflow
- [ ] Build Acceptance UI (reviewer + firm)
- [ ] Build Reviewer Submission Form
- [ ] Build Technical Director Verification Screen
- [ ] Update CEO Final Review Screen

### Week 3: Admin Powers
- [ ] Build Admin Super Dashboard with tabs
- [ ] Build Workflow Status Tracker component
- [ ] Enable admin to act as any role
- [ ] Add notification simulation

### Week 4: Polish & Testing
- [ ] Design system consistency
- [ ] Responsive layouts
- [ ] Error handling
- [ ] User testing & refinements

---

## Where to Start: Immediate Next Steps

### Step 1: Update Data Model ✅ START HERE
1. Update `types/entities.ts` with new Review interface
2. Add new ReviewStatus type
3. Add rating interfaces (ReviewRating, TechnicalDirectorVerification, CEOFinalReview)
4. Add acceptance tracking interface

### Step 2: Update Constants
1. Add new review statuses to `lib/constants/index.ts`
2. Add workflow stage constants
3. Add rating labels and descriptions

### Step 3: Create Realistic Mock Data
1. Update `lib/mock-data.ts` with reviews at different stages:
   - 2 reviews pending acceptance
   - 3 reviews in progress (reviewer working)
   - 2 reviews submitted for verification (TD to review)
   - 2 reviews verified pending final (CEO to finalize)
   - 5 reviews completed

### Step 4: Build Workflow Status Component
Visual indicator showing current stage - used across all screens.

### Step 5: Build Each Workflow Screen
One at a time, starting with Acceptance UI.

---

## Success Criteria

✅ **Admin can:**
- Assign reviews
- See all workflow stages clearly
- Act on behalf of any role
- Track acceptance status
- View all three ratings (reviewer, TD, CEO)

✅ **Workflow is clear:**
- Each stage has dedicated UI
- Status progression is visible
- Can't skip stages (enforced in UI)
- All actions are reversible (if needed)

✅ **Data integrity:**
- All ratings preserved separately
- Document history tracked
- Audit trail (who did what when)

✅ **User experience:**
- Intuitive navigation
- Clear call-to-actions
- Helpful empty states
- Responsive design

---

**Ready to proceed?** Let's start with Step 1: Updating the data model!

