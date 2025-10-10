# Final Implementation Plan - Workflow-First Approach

## ✅ Agreed Approach: Dashboard-First with Modals/Drawers

### Why This Works
- ✅ Users land on their dashboard (natural starting point)
- ✅ Clear task lists ("You have 2 pending items")
- ✅ Click task → Modal/Drawer opens → Action → Dashboard updates
- ✅ Minimal navigation, stays within design system
- ✅ Uses existing drawer patterns (already have ReviewAssignDrawer)

---

## 🎯 Implementation Order

### Phase 1: Workflow Status Indicators (Foundation)
**Goal**: Show workflow status everywhere

1. **WorkflowStatusBadge Component** (10 min)
   - Small colored badge showing status
   - Uses WORKFLOW_STATUS_COLORS from constants
   - Props: status, size
   
2. **Update Admin Reviews Page** (15 min)
   - Import workflow mock data
   - Show workflow status badge on each review
   - Add filter by workflow status

---

### Phase 2: Reviewer Workflow (Priority 1)
**Goal**: Reviewer can accept and work on reviews

#### 2.1 Reviewer Dashboard (30 min)
```
┌─────────────────────────────────────────┐
│ ⚠️ Action Required                      │
│ Pending Acceptances                     │
│ ┌─────────────────────────────────────┐ │
│ │ REV-PENDING-001: Ernst & Young      │ │
│ │ 18-hour review • Due: Jan 15        │ │
│ │ [View Details]                      │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📂 My Active Reviews                    │
│ REV-PROGRESS-001: Deloitte (45%)        │
│ REV-PROGRESS-002: BDO (75%)             │
└─────────────────────────────────────────┘
```

**Components**:
- Task cards with counts
- Clickable review items
- Progress indicators

#### 2.2 Acceptance Drawer (30 min)
**File**: `components/reviews/workflow/acceptance-drawer.tsx`

```
Opens when reviewer clicks "View Details" on pending review

┌─────────────────────────────────────────┐
│ Review Assignment                    [X]│
├─────────────────────────────────────────┤
│ Member Firm: Ernst & Young             │
│ Review Type: 18-hour comprehensive     │
│ Deadline: January 15, 2025             │
│                                         │
│ Documents (2):                          │
│ • Financial Statements 2024.pdf         │
│ • Audit Report Q3.pdf                   │
│                                         │
│ [Download All]                          │
│                                         │
│ Team Meeting:                           │
│ 🔗 https://teams.microsoft.com/...     │
│                                         │
│ Notes (optional):                       │
│ [Text area for acceptance notes]        │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Do you accept this review?          │ │
│ │ [Reject]              [Accept] ✓    │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Uses**:
- Existing Sheet/Drawer from shadcn
- WorkflowService.acceptReview() on accept
- WorkflowService.rejectReview() on reject
- Toast notification on success

#### 2.3 Reviewer Work Drawer (45 min)
**File**: `components/reviews/workflow/reviewer-work-drawer.tsx`

```
Opens when reviewer clicks on active review

┌─────────────────────────────────────────┐
│ Review Work: Deloitte                [X]│
├─────────────────────────────────────────┤
│ Progress: 45% complete                  │
│ Deadline: December 15, 2024             │
│                                         │
│ 📥 Original Documents                   │
│ • Financial Statements (Download)       │
│ • Audit Report (Download)               │
│                                         │
│ 📤 Upload Reviewed Files                │
│ [Drag files or click to upload]        │
│ • Reviewed_Financial.pdf ✓              │
│                                         │
│ ⭐ Your Rating (Required)               │
│ ○ 1 - Excellent                         │
│ ○ 2 - Good                              │
│ ● 3 - Satisfactory                      │
│ ○ 4 - Needs Improvement                 │
│ ○ 5 - Poor                              │
│                                         │
│ 📝 Comments (Required)                  │
│ [Rich text area]                        │
│                                         │
│ 💡 Recommendations (Optional)           │
│ [Text area]                             │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Ready to submit?                    │ │
│ │ [Save Draft]  [Submit for Review] ✓ │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Uses**:
- AttachmentsSection component (already exists!)
- WorkflowService.submitReview()
- Form validation before submit

---

### Phase 3: Technical Director Workflow (Priority 2)
**Goal**: TD can verify reviews

#### 3.1 TD Dashboard (20 min)
```
┌─────────────────────────────────────────┐
│ 🔍 Pending Verification (2)             │
│ REV-SUBMITTED-001: KPMG                 │
│ Reviewer Rating: 2/5                    │
│ Submitted: Oct 7, 2024                  │
│ [Verify]                                │
└─────────────────────────────────────────┘
```

#### 3.2 Verification Drawer (45 min)
**File**: `components/reviews/workflow/verification-drawer.tsx`

```
┌─────────────────────────────────────────┐
│ Verify Review: KPMG                  [X]│
├─────────────────────────────────────────┤
│ 👤 Reviewer Assessment                  │
│ ├─ Rating: 2 (Good)                     │
│ ├─ Comments: "Strong compliance..."     │
│ └─ Time Spent: 17.5 hours               │
│                                         │
│ 📂 Documents                            │
│ • Original Files (3)                    │
│ • Reviewed Files (2)                    │
│                                         │
│ ✅ Your Verification                    │
│ Do you agree with Grade 2?              │
│ ○ Yes, confirm Grade 2                  │
│ ● No, change to: [Dropdown 1-5]         │
│                                         │
│ 📝 Verification Notes (Required)        │
│ [Text area]                             │
│                                         │
│ Agreement Level:                        │
│ ● Full agreement                        │
│ ○ Partial agreement                     │
│ ○ Disagree                              │
│                                         │
│ [Back]          [Verify & Send to CEO]  │
└─────────────────────────────────────────┘
```

**Uses**:
- WorkflowService.verifyReview()
- Shows comparison view

---

### Phase 4: CEO Workflow (Priority 3)
**Goal**: CEO can finalize reviews

#### 4.1 CEO Dashboard (20 min)
```
┌─────────────────────────────────────────┐
│ 📊 Pending Final Approval (2)           │
│ REV-VERIFIED-001: PwC Global            │
│ Reviewer: 2 → TD: 1 (Upgraded)          │
│ Verified: Oct 8, 2024                   │
│ [Finalize]                              │
└─────────────────────────────────────────┘
```

#### 4.2 Use Existing Final Review Screen ✓
**File**: `components/reviews/final-review-screen.tsx` (Already exists!)

Just need to:
- Connect from CEO dashboard
- Ensure it uses WorkflowService.finalizeReview()
- Add proper navigation

---

### Phase 5: Member Firm Workflow (Priority 4)
**Goal**: Firm can accept reviews

#### 5.1 Firm Dashboard (15 min)
```
┌─────────────────────────────────────────┐
│ 📋 Reviews Involving Your Firm          │
│ Pending Acceptance (1)                  │
│ Active Reviews (2)                      │
│ Completed (5)                           │
└─────────────────────────────────────────┘
```

#### 5.2 Use Same Acceptance Drawer
- Reuse AcceptanceDrawer component
- Just change role prop to "firm"

---

### Phase 6: Admin Omnipotent Mode (Optional)
**Goal**: Admin can act as any role

```
/admin/dashboard

┌─────────────────────────────────────────┐
│ Admin Control Panel                     │
│ [Admin View] [As Reviewer] [As TD] [As CEO] [As Firm]│
├─────────────────────────────────────────┤
│ Content changes based on selected tab   │
└─────────────────────────────────────────┘
```

**Implementation**:
- Tab component
- Shows that role's dashboard when tab selected
- Admin can perform actions on behalf

---

## 📋 Component Inventory

### To Build (NEW)
1. `components/reviews/workflow/shared/workflow-status-badge.tsx`
2. `components/reviews/workflow/acceptance/acceptance-drawer.tsx`
3. `components/reviews/workflow/submission/reviewer-work-drawer.tsx`
4. `components/reviews/workflow/verification/verification-drawer.tsx`
5. `components/shared/task-card.tsx` (for dashboard task lists)

### To Update (EXISTING)
1. `app/reviewer/dashboard/page.tsx` - Add task lists
2. `app/director/dashboard/page.tsx` - Add pending verifications
3. `app/ceo/dashboard/page.tsx` - Add pending finals
4. `app/firm/dashboard/page.tsx` - Add pending acceptances
5. `app/admin/reviews/page.tsx` - Use workflow mock data

### To Reuse (ALREADY PERFECT)
1. `components/reviews/final-review-screen.tsx` ✓
2. `components/shared/attachments-section.tsx` ✓
3. `components/reviews/review-assign-drawer.tsx` ✓

---

## 🚀 Build Order (Next 2-3 Hours)

### Hour 1: Foundation
- [ ] Create WorkflowStatusBadge component (10 min)
- [ ] Update admin/reviews to use workflow mock data (15 min)
- [ ] Create TaskCard component for dashboards (15 min)
- [ ] Update reviewer dashboard with task sections (20 min)

### Hour 2: Core Workflow
- [ ] Build AcceptanceDrawer component (30 min)
- [ ] Build ReviewerWorkDrawer component (30 min)

### Hour 3: Verification & Final
- [ ] Update TD dashboard (15 min)
- [ ] Build VerificationDrawer (30 min)
- [ ] Update CEO dashboard (15 min)

---

## 🎯 Success Criteria

After implementation, users can:
- ✅ Reviewer: See pending → Accept → Work → Submit
- ✅ TD: See pending → Verify → Send to CEO
- ✅ CEO: See pending → Finalize
- ✅ Firm: See pending → Accept
- ✅ Admin: Monitor all workflow stages

All within **design system** (shadcn components only)!

---

## Let's Start! 🚀

**First Component**: WorkflowStatusBadge
**Time Estimate**: 10 minutes
**Purpose**: Foundation for showing status everywhere

Ready to build! 🎨

