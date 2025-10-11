# Quick Start: Phase 2 Implementation

## ✅ Phase 1 Complete - What We Have Now

### 🏗️ Infrastructure (1200+ lines)
```
✅ types/workflow.ts          (500+ lines) - Complete type system
✅ lib/services/workflow-service.ts  (400+ lines) - Business logic
✅ lib/services/notification-service.ts (200+ lines) - Notifications
✅ lib/constants/index.ts     (Updated) - All workflow constants
✅ types/entities.ts          (Updated) - Enhanced Review interface
```

### 🎯 What Works Now
- ✅ Complete type system for 4-stage workflow
- ✅ Business logic for all state transitions
- ✅ Role-based permission system
- ✅ Notification/email simulation
- ✅ Audit trail & history tracking
- ✅ Build compiles with zero errors

---

## 🚀 Phase 2: Build the UI (Next Step)

### Priority 1: Mock Data
**Goal**: Create realistic reviews at different workflow stages

**File to Update**: `lib/mock-data.ts`

**What to Add**:
```typescript
// 2 reviews pending acceptance
{
  id: 'REV-PENDING-01',
  workflowStatus: 'pending_acceptance',
  acceptance: {
    reviewer: { accepted: false },
    firm: { accepted: false },
    emailsSent: ['...'],
    reminders: 1
  }
}

// 2 reviews in progress
{
  id: 'REV-PROGRESS-01',
  workflowStatus: 'in_progress',
  acceptance: { ... accepted ... }
}

// 2 reviews submitted for verification
{
  id: 'REV-SUBMITTED-01',
  workflowStatus: 'submitted_for_verification',
  reviewerRating: {
    grade: '3',
    comments: '...',
    submittedBy: 'John Smith',
    submittedAt: '...'
  }
}

// 2 reviews verified, pending final
{
  id: 'REV-VERIFIED-01',
  workflowStatus: 'verified_pending_final',
  reviewerRating: { ... },
  technicalDirectorVerification: {
    grade: '3',
    originalReviewerGrade: '3',
    modified: false,
    verificationNotes: '...'
  }
}

// 5 reviews completed
{
  id: 'REV-COMPLETE-01',
  workflowStatus: 'completed',
  reviewerRating: { ... },
  technicalDirectorVerification: { ... },
  ceoFinalReview: {
    finalGrade: '3',
    finalDecisionNotes: '...',
    finalizedBy: 'CEO',
    finalizedAt: '...'
  }
}
```

---

### Priority 2: Workflow Status Components
**Goal**: Visual indicators showing workflow progress

#### 2.1 Workflow Status Badge
**File**: `components/reviews/workflow/shared/workflow-status-badge.tsx`

```typescript
interface WorkflowStatusBadgeProps {
  status: ReviewWorkflowStatus
}

// Shows colored badge with status label
// Uses WORKFLOW_STATUS_COLORS from constants
```

#### 2.2 Workflow Status Tracker (Stepper)
**File**: `components/reviews/workflow/shared/workflow-status-tracker.tsx`

```typescript
interface WorkflowStatusTrackerProps {
  review: Review
}

// Visual stepper showing:
// ○ Assignment → ○ Acceptance → ○ Review → ○ Verification → ○ Finalization
// With current stage highlighted
```

---

### Priority 3: Acceptance UI
**Goal**: Reviewer & Firm can accept/reject assignments

#### 3.1 Acceptance Card
**File**: `components/reviews/workflow/acceptance/acceptance-card.tsx`

```typescript
interface AcceptanceCardProps {
  review: Review
  userRole: 'reviewer' | 'firm'
  onAccept: (notes?: string) => Promise<void>
  onReject: (reason: string) => Promise<void>
}

// Displays:
// - Review details
// - "Accept" button → Calls WorkflowService.acceptReview()
// - "Reject" button → Opens dialog for rejection reason
// - Shows if other party has accepted
```

---

### Priority 4: Reviewer Submission Form
**Goal**: Reviewer can upload files and submit rating

#### 4.1 Reviewer Submission Form
**File**: `components/reviews/workflow/submission/reviewer-submission-form.tsx`

```typescript
interface ReviewerSubmissionFormProps {
  review: Review
  onSubmit: (data: SubmitReviewAction) => Promise<void>
}

// Sections:
// 1. Original Files (download only)
// 2. Upload Reviewed Files
// 3. Rating Selector (1-5)
// 4. Comments (required)
// 5. Submit button → Calls WorkflowService.submitReview()
```

---

### Priority 5: TD Verification Screen
**Goal**: Technical Director verifies reviewer's work

#### 5.1 TD Verification Screen
**File**: `components/reviews/workflow/verification/td-verification-screen.tsx`

```typescript
interface TDVerificationScreenProps {
  review: Review
  onVerify: (data: VerifyReviewAction) => Promise<void>
}

// Displays:
// - Reviewer's rating prominently
// - Reviewer's comments
// - All files (original + reviewed)
// - Grade selector (defaults to reviewer's grade)
// - "Modified from reviewer" indicator
// - Verification notes
// - Verify button → Calls WorkflowService.verifyReview()
```

---

### Priority 6: CEO Final Review
**Goal**: CEO sees all ratings and makes final decision

#### 6.1 CEO Final Review Screen
**File**: `components/reviews/workflow/finalization/ceo-final-review-screen.tsx`

```typescript
interface CEOFinalReviewProps {
  review: Review
  onFinalize: (data: FinalizeReviewAction) => Promise<void>
}

// Displays:
// Three-column rating comparison:
// ┌─────────────┬─────────────┬─────────────┐
// │  Reviewer   │     TD      │    Final    │
// │   Rating    │   Rating    │   Decision  │
// │    3/5      │    3/5      │   [Select]  │
// └─────────────┴─────────────┴─────────────┘

// - All documents
// - Optional additional docs upload
// - Final notes (required)
// - Finalize button → Calls WorkflowService.finalizeReview()
```

---

### Priority 7: Update Admin Reviews Page
**Goal**: Show workflow status in reviews list

**File**: `app/admin/reviews/page.tsx`

**Changes**:
```typescript
// 1. Add workflow status badge to list items
<WorkflowStatusBadge status={review.workflowStatus} />

// 2. Add filter for workflow status
<Select>
  {WORKFLOW_STATUS_OPTIONS.map(status => ...)}
</Select>

// 3. Show acceptance status
{review.acceptance && (
  <AcceptanceIndicator acceptance={review.acceptance} />
)}
```

---

## 📋 Implementation Checklist

### Week 1: Foundation
- [ ] Create comprehensive mock data (15 reviews)
- [ ] Build WorkflowStatusBadge component
- [ ] Build WorkflowStatusTracker component
- [ ] Update admin reviews page to show workflow status
- [ ] Test filtering by workflow status

### Week 2: Acceptance & Review
- [ ] Build AcceptanceCard component
- [ ] Create acceptance page for reviewers
- [ ] Create acceptance page for firms
- [ ] Build ReviewerSubmissionForm
- [ ] Test accept/reject/submit flow

### Week 3: Verification & Finalization
- [ ] Build TDVerificationScreen
- [ ] Build CEOFinalReviewScreen
- [ ] Create TD dashboard page
- [ ] Create CEO final reviews page
- [ ] Test complete workflow end-to-end

### Week 4: Admin Omnipotent & Polish
- [ ] Build Admin super dashboard with tabs
- [ ] Enable admin to act as any role
- [ ] Add notification toasts
- [ ] Polish UI/UX
- [ ] Final testing

---

## 🎨 Component Examples

### Using WorkflowService
```typescript
const handleAccept = async () => {
  const updated = WorkflowService.acceptReview(review, {
    reviewId: review.id,
    acceptedBy: currentUser.email,
    acceptedByRole: 'reviewer',
    acceptanceNotes: 'Ready to proceed'
  })
  
  await NotificationService.sendAcceptanceConfirmation(...)
  
  // Update state
  setReview(updated)
  
  toast({
    title: 'Review Accepted',
    description: 'Confirmation email sent to admin'
  })
}
```

### Checking Permissions
```typescript
const permissions = WorkflowService.getPermissions(review, userRole)

return (
  <>
    {permissions.canAccept && <AcceptButton onClick={handleAccept} />}
    {permissions.canReject && <RejectButton onClick={handleReject} />}
    {permissions.canSubmit && <SubmitButton onClick={handleSubmit} />}
  </>
)
```

---

## 🎯 Success Metrics

At the end of Phase 2, we should have:
- ✅ 15+ realistic mock reviews across all stages
- ✅ 10+ new workflow UI components
- ✅ Complete acceptance flow
- ✅ Complete submission flow
- ✅ Complete verification flow
- ✅ Complete finalization flow
- ✅ Admin can see all workflow stages
- ✅ Full end-to-end testing complete

---

## 🚀 Let's Start!

**First Task**: Update mock data with realistic workflow examples

**Command to run**:
```bash
# Check current mock data structure
code lib/mock-data.ts
```

**Ready to proceed?** 🎯

